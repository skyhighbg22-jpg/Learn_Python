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
  logSecurityEvent
} from '../shared/auth-middleware.ts'

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

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

    // Rate limiting check
    const rateLimitResult = checkRateLimit(clientIP, 10, 60000) // 10 requests per minute
    if (!rateLimitResult.allowed) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', {
        ip: clientIP,
        path: pathname,
        severity: 'high'
      })
      return createErrorResponse(rateLimitResult.error!, 429)
    }

    // Only process POST requests for security
    if (req.method !== 'POST') {
      logSecurityEvent('INVALID_METHOD', {
        method: req.method,
        path: pathname,
        ip: clientIP,
        severity: 'medium'
      })
      return createErrorResponse('Method not allowed', 405)
    }

    // SECURE: This endpoint should only be callable by authorized service accounts
    // For now, we'll check for a special service key
    const serviceKey = req.headers.get('x-service-key')
    if (serviceKey !== Deno.env.get('STREAK_MAINTENANCE_SERVICE_KEY')) {
      logSecurityEvent('UNAUTHORIZED_ACCESS', {
        path: pathname,
        ip: clientIP,
        severity: 'critical'
      })
      return createErrorResponse('Unauthorized', 401)
    }

    if (pathname === '/streak-maintenance') {
      await handleStreakMaintenance()

      logSecurityEvent('STREAK_MAINTENANCE_COMPLETED', {
        severity: 'info'
      })

      const response = createSuccessResponse({
        message: 'Streak maintenance completed successfully'
      })
      return addSecurityHeaders(response)
    }

    return createErrorResponse('Not found', 404)

  } catch (error) {
    console.error('Error in streak-maintenance function:', error)
    logSecurityEvent('FUNCTION_ERROR', {
      error: error.message,
      severity: 'high'
    })
    return createErrorResponse('Internal server error', 500)
  }
})

async function handleStreakMaintenance() {
  console.log('Starting streak maintenance process...')

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  try {
    // Get all users - handle missing columns gracefully
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, current_streak, last_active_date, hearts, longest_streak')
      .neq('last_active_date', null)

    if (profilesError) {
      throw new Error(`Error fetching profiles: ${profilesError.message}`)
    }

    console.log(`Processing ${profiles.length} users for streak maintenance`)

    // Process each user's streak
    for (const profile of profiles) {
      await processUserStreak(profile, yesterdayStr)
    }

    // Reset hearts for all users
    await resetDailyHearts()

    // Update weekly leaderboards if it's Monday
    if (new Date().getDay() === 1) { // Monday
      await updateWeeklyLeaderboards()
    }

    console.log('Streak maintenance completed successfully')

  } catch (error) {
    console.error('Error in streak maintenance:', error)
    throw error
  }
}

async function processUserStreak(profile: any, yesterdayStr: string) {
  const { id, current_streak, last_active_date, hearts, max_streak } = profile

  // Check if user was active yesterday
  const wasActiveYesterday = last_active_date === yesterdayStr
  const today = new Date().toISOString().split('T')[0]
  const lastActiveDate = new Date(last_active_date)
  const daysSinceLastActive = Math.floor((new Date(today).getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24))

  let newStreak = current_streak
  let newHearts = hearts
  let newMaxStreak = max_streak

  if (wasActiveYesterday) {
    // User was active yesterday, maintain or increase streak
    if (newStreak >= 0) {
      newStreak += 1
    } else {
      // Starting a new streak after a break
      newStreak = 1
    }

    // Check for streak milestones
    await checkStreakMilestones(id, newStreak)

  } else if (daysSinceLastActive > 1) {
    // User missed yesterday, reset streak
    newStreak = 0
  }

  // Update max streak if current is higher
  if (newStreak > newMaxStreak) {
    newMaxStreak = newStreak
    await checkMaxStreakMilestones(id, newMaxStreak)
  }

  // Update user profile
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      current_streak: newStreak,
      max_streak: newMaxStreak,
      last_active_date: new Date().toISOString().split('T')[0]
    })
    .eq('id', id)

  if (updateError) {
    console.error(`Error updating profile ${id}:`, updateError)
    throw updateError
  }
}

async function resetDailyHearts() {
  console.log('Resetting daily hearts for all users...')

  // Get user preferences for heart settings
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, daily_goal_hearts')

  if (!profiles) return

  for (const profile of profiles) {
    // Reset hearts to daily maximum (default: 5)
    const maxHearts = profile.daily_goal_hearts || 5

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ hearts: maxHearts })
      .eq('id', profile.id)

    if (updateError) {
      console.error(`Error resetting hearts for user ${profile.id}:`, updateError)
    }
  }

  console.log('Daily hearts reset completed')
}

async function checkStreakMilestones(userId: string, streak: number) {
  const milestones = [3, 7, 14, 30, 60, 100, 365]

  for (const milestone of milestones) {
    if (streak === milestone) {
      await createStreakMilestoneNotification(userId, milestone)
      await awardStreakAchievements(userId, milestone)
    }
  }
}

async function checkMaxStreakMilestones(userId: string, maxStreak: number) {
  const milestones = [10, 25, 50, 100, 200, 500, 1000]

  for (const milestone of milestones) {
    if (maxStreak === milestone) {
      await createMaxStreakMilestoneNotification(userId, milestone)
    }
  }
}

async function createStreakMilestoneNotification(userId: string, streak: number) {
  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type: 'streak',
      title: '🔥 Amazing Streak!',
      message: `Congratulations! You've maintained a ${streak}-day learning streak!`,
      metadata: { streak_days: streak, type: 'milestone' },
      read: false,
      created_at: new Date().toISOString()
    })

  if (error) {
    console.error(`Error creating streak notification for user ${userId}:`, error)
  }
}

async function createMaxStreakMilestoneNotification(userId: string, maxStreak: number) {
  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type: 'streak',
      title: '🏆 New Personal Best!',
      message: `Congratulations! Your new longest streak is ${maxStreak} days!`,
      metadata: { max_streak: maxStreak, type: 'personal_best' },
      read: false,
      created_at: new Date().toISOString()
    })

  if (error) {
    console.error(`Error creating max streak notification for user ${userId}:`, error)
  }
}

async function awardStreakAchievements(userId: string, streak: number) {
  // Award XP for streak milestones
  const xpRewards = {
    3: 50,    // 3 days
    7: 100,   // 1 week
    14: 200,  // 2 weeks
    30: 500,  // 1 month
    60: 1000, // 2 months
    100: 2000, // 3+ months
    365: 5000 // 1 year
  }

  const xpReward = xpRewards[streak as keyof typeof xpRewards]

  if (xpReward) {
    const { error: xpError } = await supabase.rpc('award_achievement_xp', {
      p_user_id: userId,
      p_xp_amount: xpReward
    })

    if (xpError) {
      console.error(`Error awarding streak XP for user ${userId}:`, xpError)
    }
  }
}

async function updateWeeklyLeaderboards() {
  console.log('Updating weekly leaderboards...')

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  weekStart.setHours(0, 0, 0, 0)

  const { error: updateError } = await supabase
    .rpc('update_weekly_leaderboards', {
      p_week_start: weekStart.toISOString()
    })

  if (updateError) {
    console.error('Error updating weekly leaderboards:', updateError)
  }
}

// Health check endpoint
Deno.serve(handleStreakMaintenance, { port: 8080 })