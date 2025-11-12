import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// CORS headers with proper security
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || 'https://yourdomain.com', // Restrict to specific domains
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
}

// JWT Authentication middleware
export async function authenticateRequest(req: Request): Promise<{ userId: string; error?: string }> {
  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return { userId: '', error: 'No authorization header provided' }
    }

    // Extract token from Bearer format
    const token = authHeader.replace('Bearer ', '')
    if (!token) {
      return { userId: '', error: 'Invalid authorization header format' }
    }

    // Verify JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      console.error('JWT verification failed:', error)
      return { userId: '', error: 'Invalid or expired token' }
    }

    return { userId: user.id }

  } catch (error) {
    console.error('Authentication error:', error)
    return { userId: '', error: 'Authentication failed' }
  }
}

// Rate limiting middleware
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; error?: string } {
  const now = Date.now()
  const windowStart = now - windowMs

  // Clean up old entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }

  // Get or create rate limit entry
  const existing = rateLimitStore.get(identifier)
  if (!existing) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs })
    return { allowed: true }
  }

  // Check if window has expired
  if (existing.resetTime < now) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs })
    return { allowed: true }
  }

  // Check limit
  if (existing.count >= limit) {
    const retryAfter = Math.ceil((existing.resetTime - now) / 1000)
    return {
      allowed: false,
      error: `Rate limit exceeded. Try again in ${retryAfter} seconds.`
    }
  }

  // Increment count
  existing.count++
  return { allowed: true }
}

// Input validation middleware
export function validateInput(data: any, rules: Record<string, any>): { valid: boolean; error?: string } {
  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field]

    // Required field validation
    if (rule.required && (value === undefined || value === null || value === '')) {
      return { valid: false, error: `Field ${field} is required` }
    }

    // Skip further validation if field is optional and not provided
    if (!rule.required && (value === undefined || value === null || value === '')) {
      continue
    }

    // Type validation
    if (rule.type && typeof value !== rule.type) {
      return { valid: false, error: `Field ${field} must be of type ${rule.type}` }
    }

    // Length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      return { valid: false, error: `Field ${field} exceeds maximum length of ${rule.maxLength}` }
    }

    if (rule.minLength && value.length < rule.minLength) {
      return { valid: false, error: `Field ${field} must be at least ${rule.minLength} characters long` }
    }

    // Pattern validation
    if (rule.pattern && !new RegExp(rule.pattern).test(value)) {
      return { valid: false, error: `Field ${field} format is invalid` }
    }

    // Custom validation
    if (rule.validate && !rule.validate(value)) {
      return { valid: false, error: rule.errorMessage || `Field ${field} validation failed` }
    }
  }

  return { valid: true }
}

// Security headers middleware
export function addSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers)

  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-XSS-Protection', '1; mode=block')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

  // Add CSP header if not present
  if (!headers.get('Content-Security-Policy')) {
    headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'")
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  })
}

// Error response helper
export function createErrorResponse(message: string, status: number = 400): Response {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

// Success response helper
export function createSuccessResponse(data: any, status: number = 200): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

// Log security events
export function logSecurityEvent(event: string, details: any): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    severity: details.severity || 'info'
  }

  // Log to console (in production, this should go to a secure logging service)
  console.log('SECURITY_EVENT:', JSON.stringify(logEntry))

  // In production, you might want to:
  // - Send to a SIEM system
  // - Store in a secure audit log
  // - Trigger alerts for critical events
}