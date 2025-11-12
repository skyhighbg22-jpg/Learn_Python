import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Import security middleware
import {
  authenticateRequest,
  checkRateLimit,
  corsHeaders,
  createErrorResponse,
  createSuccessResponse,
  addSecurityHeaders,
  validateInput
} from '../shared/auth-middleware.ts'

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Email service configuration
const EMAIL_SERVICE_KEY = Deno.env.get('EMAIL_SERVICE_KEY')!

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return addSecurityHeaders(new Response('ok', { headers: corsHeaders }))
  }

  try {
    const url = new URL(req.url)
    const { pathname } = url

    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') ||
                   req.headers.get('x-real-ip') ||
                   'unknown'

    // Rate limiting check (stricter for email services)
    const rateLimitResult = checkRateLimit(clientIP, 5, 60000) // 5 emails per minute
    if (!rateLimitResult.allowed) {
      return createErrorResponse(rateLimitResult.error!, 429)
    }

    // Service key authentication for email services
    const serviceKey = req.headers.get('x-email-service-key')
    if (serviceKey !== EMAIL_SERVICE_KEY) {
      return createErrorResponse('Unauthorized email service access', 401)
    }

    // Only process POST requests
    if (req.method !== 'POST') {
      return createErrorResponse('Method not allowed', 405)
    }

    // Route handling
    if (pathname === '/send-welcome-email') {
      return handleWelcomeEmail(req)
    }

    if (pathname === '/send-verification-email') {
      return handleVerificationEmail(req)
    }

    if (pathname === '/send-password-reset') {
      return handlePasswordResetEmail(req)
    }

    return createErrorResponse('Email service endpoint not found', 404)

  } catch (error) {
    console.error('Email service error:', error)
    return createErrorResponse('Email service temporarily unavailable', 500)
  }
})

// Send welcome email
async function handleWelcomeEmail(req: Request): Promise<Response> {
  try {
    const { email, fullName, isNewUser } = await req.json()

    // Validate input
    const validation = validateInput(
      { email, fullName },
      {
        email: { required: true, type: 'string', pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
        fullName: { required: true, type: 'string', maxLength: 100 }
      }
    )

    if (!validation.valid) {
      return createErrorResponse(validation.error!, 400)
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase.auth.admin.getUserByEmail(email)

    if (userError) {
      console.error('Error checking user:', userError)
      return createErrorResponse('User verification failed', 400)
    }

    const isExistingUser = !!user.user

    // HTML email template
    const htmlContent = generateWelcomeEmailHTML(fullName, isNewUser, isExistingUser)
    const subject = isExistingUser
      ? 'Welcome back to PyLearn!'
      : 'Welcome to PyLearn - Start Your Python Journey!'

    // Send email using Resend or your preferred email service
    const emailSent = await sendEmail({
      to: email,
      subject,
      html: htmlContent,
      text: generateWelcomeEmailText(fullName, isNewUser, isExistingUser)
    })

    if (!emailSent) {
      return createErrorResponse('Failed to send welcome email', 500)
    }

    return createSuccessResponse({
      message: 'Welcome email sent successfully',
      isNewUser,
      isExistingUser
    })

  } catch (error) {
    console.error('Error in welcome email handler:', error)
    return createErrorResponse('Failed to process welcome email', 500)
  }
}

// Send email verification
async function handleVerificationEmail(req: Request): Promise<Response> {
  try {
    const { email } = await req.json()

    // Validate input
    const validation = validateInput(
      { email },
      {
        email: { required: true, type: 'string', pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' }
      }
    )

    if (!validation.valid) {
      return createErrorResponse(validation.error!, 400)
    }

    // Check if user exists and needs verification
    const { data: user, error: userError } = await supabase.auth.admin.getUserByEmail(email)

    if (userError || !user.user) {
      return createErrorResponse('User not found', 404)
    }

    if (user.user.email_confirmed) {
      return createErrorResponse('Email already verified', 400)
    }

    // Generate verification token
    const { error: resendError } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email,
      options: {
        redirectTo: `${Deno.env.get('SITE_URL') || 'https://pylearn.com'}/verify-email`
      }
    })

    if (resendError) {
      console.error('Error generating verification link:', resendError)
      return createErrorResponse('Failed to generate verification link', 500)
    }

    // Send verification email HTML
    const htmlContent = generateVerificationEmailHTML(email)
    const subject = 'Verify your PyLearn email address'

    const emailSent = await sendEmail({
      to: email,
      subject,
      html: htmlContent,
      text: generateVerificationEmailText(email)
    })

    if (!emailSent) {
      return createErrorResponse('Failed to send verification email', 500)
    }

    return createSuccessResponse({ message: 'Verification email sent successfully' })

  } catch (error) {
    console.error('Error in verification email handler:', error)
    return createErrorResponse('Failed to process verification email', 500)
  }
}

// Send password reset email
async function handlePasswordResetEmail(req: Request): Promise<Response> {
  try {
    const { email } = await req.json()

    // Validate input
    const validation = validateInput(
      { email },
      {
        email: { required: true, type: 'string', pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' }
      }
    )

    if (!validation.valid) {
      return createErrorResponse(validation.error!, 400)
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase.auth.admin.getUserByEmail(email)

    if (userError || !user.user) {
      // Don't reveal if user exists or not for security
      return createSuccessResponse({ message: 'If an account exists, a password reset email has been sent' })
    }

    // Generate password reset link
    const { error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${Deno.env.get('SITE_URL') || 'https://pylearn.com'}/reset-password`
      }
    })

    if (resetError) {
      console.error('Error generating reset link:', resetError)
      return createErrorResponse('Failed to generate reset link', 500)
    }

    // Send password reset email HTML
    const htmlContent = generatePasswordResetEmailHTML(email)
    const subject = 'Reset your PyLearn password'

    const emailSent = await sendEmail({
      to: email,
      subject,
      html: htmlContent,
      text: generatePasswordResetEmailText(email)
    })

    if (!emailSent) {
      return createErrorResponse('Failed to send password reset email', 500)
    }

    return createSuccessResponse({ message: 'Password reset email sent successfully' })

  } catch (error) {
    console.error('Error in password reset email handler:', error)
    return createErrorResponse('Failed to process password reset email', 500)
  }
}

// Email sending function (integrate with your email service)
async function sendEmail({ to, subject, html, text }: {
  to: string
  subject: string
  html: string
  text: string
}): Promise<boolean> {
  try {
    // Integration with Resend (example)
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

    if (RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'PyLearn <noreply@pylearn.com>',
          to: [to],
          subject,
          html,
          text,
        }),
      })

      return response.ok
    } else {
      // Fallback: Log email content (for development)
      console.log('EMAIL TO:', to)
      console.log('SUBJECT:', subject)
      console.log('CONTENT:', html)
      return true
    }
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

// Email template generators
function generateWelcomeEmailHTML(fullName: string, isNewUser: boolean, isExistingUser: boolean): string {
  const siteUrl = Deno.env.get('SITE_URL') || 'https://pylearn.com'

  const title = isExistingUser ? 'Welcome Back to PyLearn!' : 'Welcome to PyLearn!'
  const subtitle = isExistingUser
    ? 'Great to have you back! Continue your Python learning journey where you left off.'
    : '🐍 Welcome to your Python learning adventure! We\'re excited to help you master Python.'

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .button:hover { background: #5a6fd8; }
        .feature { background: white; padding: 20px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
        </div>
        <div class="content">
            <h2>Hi ${fullName}!</h2>
            <p>${subtitle}</p>

            ${!isExistingUser ? `
            <div class="feature">
                <h3>🚀 What's waiting for you:</h3>
                <ul>
                    <li>Interactive Python lessons with instant feedback</li>
                    <li>Real-world coding challenges and projects</li>
                    <li>Social features to learn with friends</li>
                    <li>Achievements and gamification to keep you motivated</li>
                    <li>Track your progress and celebrate milestones</li>
                </ul>
            </div>
            ` : ''}

            <div style="text-align: center;">
                <a href="${siteUrl}" class="button">Start Learning Python</a>
            </div>

            <div class="feature">
                <h3>💡 Pro Tips:</h3>
                <ul>
                    <li>Complete daily challenges to build streaks</li>
                    <li>Join the community and connect with other learners</li>
                    <li>Set a learning schedule and stick to it</li>
                    <li>Don't be afraid to make mistakes - that's how we learn!</li>
                </ul>
            </div>

            <div class="footer">
                <p>Happy coding! 🐍</p>
                <p>The PyLearn Team</p>
                <p><small>If you didn't create this account, please contact us at support@pylearn.com</small></p>
            </div>
        </div>
    </div>
</body>
</html>
  `.trim()
}

function generateWelcomeEmailText(fullName: string, isNewUser: boolean, isExistingUser: boolean): string {
  const title = isExistingUser ? 'Welcome Back to PyLearn!' : 'Welcome to PyLearn!'
  const siteUrl = Deno.env.get('SITE_URL') || 'https://pylearn.com'

  let content = `Hi ${fullName}!\n\n`

  if (isExistingUser) {
    content += 'Welcome back to PyLearn! We\'re excited to help you continue your Python learning journey.\n\n'
  } else {
    content += 'Welcome to PyLearn! 🐍 We\'re thrilled to have you join our community of Python learners.\n\n'
    content += 'What\'s waiting for you:\n'
    content += '- Interactive Python lessons with instant feedback\n'
    content += '- Real-world coding challenges and projects\n'
    content += '- Social features to learn with friends\n'
    content += '- Achievements and gamification to keep you motivated\n\n'
  }

  content += `Start learning: ${siteUrl}\n\n`
  content += 'Happy coding!\n'
  content += 'The PyLearn Team\n\n'
  content += 'If you didn\'t create this account, please contact us at support@pylearn.com'

  return content
}

function generateVerificationEmailHTML(email: string): string {
  const siteUrl = Deno.env.get('SITE_URL') || 'https://pylearn.com'

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your PyLearn Email</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .button:hover { background: #218838; }
        .notice { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verify Your Email Address</h1>
        </div>
        <div class="content">
            <h2>Hi there!</h2>
            <p>Thanks for signing up for PyLearn! To complete your registration and start learning Python, please verify your email address by clicking the button below:</p>

            <div style="text-align: center;">
                <a href="${siteUrl}/auth/verify?email=${encodeURIComponent(email)}" class="button">Verify Email Address</a>
            </div>

            <div class="notice">
                <p><strong>Important:</strong> This verification link will expire in 24 hours. If you didn't create a PyLearn account, you can safely ignore this email.</p>
            </div>

            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 3px;">${siteUrl}/auth/verify?email=${encodeURIComponent(email)}</p>

            <div class="footer">
                <p>See you in the classroom! 🐍</p>
                <p>The PyLearn Team</p>
            </div>
        </div>
    </div>
</body>
</html>
  `.trim()
}

function generateVerificationEmailText(email: string): string {
  const siteUrl = Deno.env.get('SITE_URL') || 'https://pylearn.com'

  return `
Hi there!

Thanks for signing up for PyLearn! To complete your registration and start learning Python, please verify your email address by visiting this link:

${siteUrl}/auth/verify?email=${encodeURIComponent(email)}

Important: This verification link will expire in 24 hours. If you didn't create a PyLearn account, you can safely ignore this email.

See you in the classroom! 🐍
The PyLearn Team
  `.trim()
}

function generatePasswordResetEmailHTML(email: string): string {
  const siteUrl = Deno.env.get('SITE_URL') || 'https://pylearn.com'

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your PyLearn Password</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .button:hover { background: #c82333; }
        .notice { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reset Your Password</h1>
        </div>
        <div class="content">
            <h2>Password Reset Request</h2>
            <p>We received a request to reset the password for your PyLearn account (${email}). If you made this request, click the button below to reset your password:</p>

            <div style="text-align: center;">
                <a href="${siteUrl}/reset-password?email=${encodeURIComponent(email)}" class="button">Reset Password</a>
            </div>

            <div class="notice">
                <p><strong>Security Notice:</strong></p>
                <ul>
                    <li>This password reset link will expire in 1 hour for security reasons</li>
                    <li>If you didn't request a password reset, please ignore this email</li>
                    <li>Never share this link with anyone</li>
                </ul>
            </div>

            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 3px;">${siteUrl}/reset-password?email=${encodeURIComponent(email)}</p>

            <div class="footer">
                <p>Stay safe and keep learning! 🐍</p>
                <p>The PyLearn Team</p>
            </div>
        </div>
    </div>
</body>
</html>
  `.trim()
}

function generatePasswordResetEmailText(email: string): string {
  const siteUrl = Deno.env.get('SITE_URL') || 'https://pylearn.com'

  return `
Password Reset Request

We received a request to reset the password for your PyLearn account (${email}). If you made this request, visit this link to reset your password:

${siteUrl}/reset-password?email=${encodeURIComponent(email)}

Security Notice:
- This password reset link will expire in 1 hour for security reasons
- If you didn't request a password reset, please ignore this email
- Never share this link with anyone

Stay safe and keep learning! 🐍
The PyLearn Team
  `.trim()
}