import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const { pathname } = url

    if (req.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (pathname === '/achievement-processor') {
      const body = await req.json()
      const { user_id, activity_type, activity_data } = body

      if (!user_id || !activity_type) {
        return new Response(
          JSON.stringify({ error: 'user_id and activity_type are required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      await processAchievementActivity(user_id, activity_type, activity_data)

      return new Response(
        JSON.stringify({ message: 'Achievement activity processed successfully' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response('Not found', {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in achievement processor:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function processAchievementActivity(userId: string, activityType: string, activityData: any) {
  console.log(`Processing achievement activity for user ${userId}: ${activityType}`)

  try {
    switch (activityType) {
      case 'lesson_completed':
        await processLessonCompletion(userId, activityData)
        break
      case 'challenge_completed':
        await processChallengeCompletion(userId, activityData)
        break
      case 'streak_milestone':
        await processStreakMilestone(userId, activityData)
        break
      case 'xp_milestone':
        await processXPMilestone(userId, activityData)
        break
      case 'perfect_lesson':
        await processPerfectLesson(userId, activityData)
        break
      case 'speed_demon':
        await processSpeedDemon(userId, activityData)
        break
      default:
        console.log(`Unknown achievement activity type: ${activityType}`)
    }

    // Check for achievement unlocks after processing
    await checkAndUnlockAchievements(userId)

  } catch (error) {
    console.error(`Error processing achievement activity: ${error}`)
    throw error
  }
}

async function processLessonCompletion(userId: string, data: any) {
  const { lesson_id, score, xp_earned, time_taken } = data

  // Track lessons completed count
  await incrementAchievementProgress(userId, 'lessons_completed', 1)

  // Check for perfect scores
  if (score >= 100) {
    await incrementAchievementProgress(userId, 'perfect_lessons', 1)
  }

  // Check for speed achievements
  if (time_taken && time_taken < 30) {
    await incrementAchievementProgress(userId, 'fast_learner', 1)
  }

  // Get user's current lesson count
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, total_lessons_completed')
    .eq('id', userId)
    .single()

  if (profile) {
      const lessonsCompleted = profile.total_lessons_completed || 0

      // Milestone achievements for lesson counts
      if (lessonsCompleted === 1) {
        await unlockAchievement(userId, 'first_steps')
      }
      if (lessonsCompleted === 10) {
        await unlockAchievement(userId, 'dedicated_learner')
      }
      if (lessonsCompleted === 25) {
        await unlockAchievement(userId, 'python_enthusiast')
      }
      if (lessonsCompleted === 50) {
        await unlockAchievement(userId, 'python_master')
      }
      if (lessonsCompleted === 100) {
        await unlockAchievement(userId, 'python_legend')
      }
    }
}

async function processChallengeCompletion(userId: string, data: any) {
  const { challenge_type, difficulty, score } = data

  await incrementAchievementProgress(userId, 'challenges_completed', 1)

  // Check for difficulty-specific achievements
  if (difficulty === 'hard' && score >= 90) {
    await incrementAchievementProgress(userId, 'challenge_master', 1)
  }

  // Track challenges by type
  await incrementAchievementProgress(userId, `${challenge_type}_challenges`, 1)

  // First challenge completion
  const challengesCompleted = await getAchievementProgress(userId, 'challenges_completed')
  if (challengesCompleted === 1) {
    await unlockAchievement(userId, 'first_challenge')
  }
}

async function processStreakMilestone(userId: string, data: any) {
  const { streak_days } = data

  // Streak milestone achievements
  if (streak_days === 3) {
    await unlockAchievement(userId, 'three_day_streak')
  }
  if (streak_days === 7) {
    await unlockAchievement(userId, 'one_week_streak')
  }
  if (streak_days === 30) {
    await unlockAchievement(userId, 'one_month_streak')
  }
  if (streak_days === 100) {
    await unlockAchievement(userId, 'century_streak')
  }
}

async function processXPMilestone(userId: string, data: any) {
  const { total_xp } = data

  // XP milestone achievements
  if (total_xp >= 100) {
    await unlockAchievement(userId, 'century_club')
  }
  if (total_xp >= 500) {
    await unlockAchievement(userId, 'xp_expert')
  }
  if (total_xp >= 1000) {
    await unlockAchievement(userId, 'xp_master')
  }
  if (total_xp >= 5000) {
    await unlockAchievement(userId, 'xp_legend')
  }
  if (total_xp >= 10000) {
    await unlockAchievement(userId, 'xp_titan')
  }
}

async function processPerfectLesson(userId: string, data: any) {
  await incrementAchievementProgress(userId, 'perfect_lessons', 1)

  const perfectLessons = await getAchievementProgress(userId, 'perfect_lessons')
  if (perfectLessons === 5) {
    await unlockAchievement(userId, 'perfectionist')
  }
  if (perfectLessons === 10) {
    await unlockAchievement(userId, 'perfect_ten')
  }
  if (perfectLessons === 25) {
    await unlockAchievement(userId, 'flawless_victory')
  }
}

async function processSpeedDemon(userId: string, data: any) {
  await incrementAchievementProgress(userId, 'speed_demon', 1)

  const speedDemos = await getAchievementProgress(userId, 'speed_demon')
  if (speedDemos === 5) {
    await unlockAchievement(userId, 'lightning_fast')
  }
  if (speedDemos === 10) {
    await unlockAchievement(userId, 'supersonic')
  }
}

async function incrementAchievementProgress(userId: string, metric: string, amount: number = 1) {
  const progressKey = `${userId}_${metric}`

  try {
    const { data: existing } = await supabase
      .from('achievement_progress')
      .select('id, progress')
      .eq('user_id', userId)
      .eq('metric', progressKey)
      .single()

    if (existing) {
      // Update existing progress
      const newProgress = existing.progress + amount
      await supabase
        .from('achievement_progress')
        .update({ progress: newProgress })
        .eq('id', existing.id)
    } else {
      // Create new progress entry
      await supabase
        .from('achievement_progress')
        .insert({
          user_id: userId,
          metric: progressKey,
          progress: amount,
          created_at: new Date().toISOString()
        })
    }

  } catch (error) {
    console.error(`Error updating achievement progress for ${metric}: ${error}`)
  }
}

async function getAchievementProgress(userId: string, metric: string): Promise<number> {
  try {
    const { data } = await supabase
      .from('achievement_progress')
      .select('progress')
      .eq('user_id', userId)
      .eq('metric', `${userId}_${metric}`)
      .single()

    return data?.progress || 0

  } catch (error) {
    console.error(`Error getting achievement progress for ${metric}: ${error}`)
    return 0
  }
}

async function checkAndUnlockAchievements(userId: string) {
  try {
    // Get all achievements the user hasn't unlocked yet
    const { data: achievements } = await supabase
      .from('achievements')
      .select('*')
      .not('in', 'user_achievements', 'achievement_id', 'id')

    const { data: userProgress } = await supabase
      .from('achievement_progress')
      .select('*')
      .eq('user_id', userId)

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, level, current_streak, total_xp, hearts')
      .eq('id', userId)
      .single()

    if (!achievements || !userProgress || !profile) return

    const progressMap = new Map(
      userProgress.map(p => [p.metric, p.progress])
    )

    for (const achievement of achievements) {
      if (await shouldUnlockAchievement(achievement, profile, progressMap)) {
        await unlockAchievement(userId, achievement.id)
      }
    }

  } catch (error) {
    console.error('Error checking achievements:', error)
  }
}

async function shouldUnlockAchievement(achievement: any, profile: any, progressMap: Map<string, number>): Promise<boolean> {
  const { requirements } = achievement

  if (!requirements) return false

  const { type, value, condition } = requirements

  switch (type) {
    case 'lessons_completed':
      return progressMap.get(`${profile.id}_lessons_completed`) >= value

    case 'total_xp':
      return profile.total_xp >= value

    case 'current_streak':
      return profile.current_streak >= value

    case 'level_reached':
      return profile.level >= value

    case 'perfect_lessons':
      return progressMap.get(`${profile.id}_perfect_lessons`) >= value

    case 'challenges_completed':
      return progressMap.get(`${profile.id}_challenges_completed`) >= value

    case 'python_basics':
      return progressMap.get(`${profile.id}_python_basics_lessons`) >= value

    case 'algorithms':
      return progressMap.get(`${profile.id}_algorithm_problems_solved`) >= value

    case 'web_development':
      return progressMap.get(`${profile.id}_web_projects_completed`) >= value

    case 'data_science':
      return progressMap.get(`${profile.id}_data_science_projects`) >= value

    case 'automation':
      return progressMap.get(`${profile.id}_automation_scripts_created`) >= value

    default:
      return false
  }
}

async function unlockAchievement(userId: string, achievementId: string) {
  try {
    // Check if achievement exists and is not already unlocked
    const { data: achievement } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', achievementId)
      .single()

    if (!achievement) return

    const { data: existingUnlock } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .maybeSingle()

    if (existingUnlock) return

    // Unlock the achievement
    const { error: unlockError } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId,
        unlocked_at: new Date().toISOString(),
        progress: 100
      })

    if (unlockError) {
      console.error(`Error unlocking achievement ${achievementId}:`, unlockError)
      return
    }

    // Award XP for the achievement
    if (achievement.xp_reward > 0) {
      const { error: xpError } = await supabase.rpc('award_achievement_xp', {
        p_user_id: userId,
        p_xp_amount: achievement.xp_reward
      })

      if (xpError) {
        console.error(`Error awarding achievement XP:`, xpError)
      }
    }

    // Create notification
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'achievement',
        title: '🏆 Achievement Unlocked!',
        message: achievement.description,
        metadata: {
          achievement_id: achievementId,
          achievement_title: achievement.title,
          xp_reward: achievement.xp_reward,
          rarity: achievement.rarity,
          icon: achievement.icon
        },
        read: false,
        created_at: new Date().toISOString()
      })

    if (notificationError) {
      console.error(`Error creating achievement notification:`, notificationError)
    }

    console.log(`Achievement unlocked for user ${userId}: ${achievement.title}`)

  } catch (error) {
    console.error(`Error unlocking achievement ${achievementId}:`, error)
  }
}

async function unlockAchievement(userId: string, achievementSlug: string) {
  try {
    // Get achievement by slug
    const { data: achievement } = await supabase
      .from('achievements')
      .select('*')
      .eq('slug', achievementSlug)
      .single()

    if (!achievement) {
      console.error(`Achievement not found: ${achievementSlug}`)
      return
    }

    await unlockAchievement(userId, achievement.id)

  } catch (error) {
    console.error(`Error unlocking achievement by slug ${achievementSlug}:`, error)
  }
}

// Health check endpoint
Deno.serve(processAchievementActivity, { port: 8082 })