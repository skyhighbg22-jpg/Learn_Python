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

    if (pathname === '/weekly-leaderboard') {
      const body = await req.json()
      const { week_start } = body

      if (!week_start) {
        return new Response(
          JSON.stringify({ error: 'week_start parameter is required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      await handleWeeklyLeaderboard(week_start)

      return new Response(
        JSON.stringify({ message: 'Weekly leaderboard updated successfully' }),
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
    console.error('Error in weekly-leaderboard function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function handleWeeklyLeaderboard(weekStart: string) {
  console.log(`Starting weekly leaderboard calculation for week starting ${weekStart}`)

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  try {
    // Clear existing weekly leaderboard entries for this week
    const { error: clearError } = await supabase
      .from('leaderboards')
      .delete()
      .gte('week_start', weekStart)
      .lt('week_start', weekEnd.toISOString())

    if (clearError) {
      throw new Error(`Error clearing weekly leaderboards: ${clearError.message}`)
    }

    // Calculate weekly XP for all users
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, level, league')

    if (!profiles) {
      console.log('No profiles found')
      return
    }

    const leaderboardEntries = []

    for (const profile of profiles) {
      const weeklyXP = await calculateWeeklyXP(profile.id, weekStart, weekEnd)

      if (weeklyXP > 0) { // Only include users who earned XP this week
        leaderboardEntries.push({
          user_id: profile.id,
          username: profile.username,
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
          level: profile.level,
          league: profile.league,
          weekly_xp: weeklyXP,
          week_start: weekStart,
          week_end: weekEnd.toISOString(),
          rank: 0 // Will be calculated after all entries are collected
        })
      }
    }

    // Sort by weekly XP (descending) and assign ranks
    leaderboardEntries.sort((a, b) => b.weekly_xp - a.weekly_xp)

    leaderboardEntries.forEach((entry, index) => {
      entry.rank = index + 1
    })

    // Batch insert into leaderboard
    if (leaderboardEntries.length > 0) {
      const { error: insertError } = await supabase
        .from('leaderboards')
        .insert(leaderboardEntries)

      if (insertError) {
        throw new Error(`Error inserting leaderboard entries: ${insertError.message}`)
      }
    }

    // Award league promotions and rewards
    await processLeaguePromotions(leaderboardEntries)

    // Send weekly result notifications
    await sendWeeklyResultNotifications(leaderboardEntries)

    console.log(`Weekly leaderboard updated with ${leaderboardEntries.length} entries`)

  } catch (error) {
    console.error('Error in weekly leaderboard calculation:', error)
    throw error
  }
}

async function calculateWeeklyXP(userId: string, weekStart: Date, weekEnd: Date): Promise<number> {
  let totalXP = 0

  try {
    // XP from lesson completions
    const { data: lessonCompletions } = await supabase
      .from('user_lessons')
      .select('xp_earned')
      .eq('user_id', userId)
      .gte('completed_at', weekStart.toISOString())
      .lt('completed_at', weekEnd.toISOString())
      .eq('completed', true)

    if (lessonCompletions) {
      totalXP += lessonCompletions.reduce((sum, lesson) => sum + (lesson.xp_earned || 0), 0)
    }

    // XP from daily challenges
    const { data: challengeCompletions } = await supabase
      .from('daily_challenge_attempts')
      .select('score')
      .eq('user_id', userId)
      .gte('created_at', weekStart.toISOString())
      .lt('created_at', weekEnd.toISOString())
      .eq('completed', true)

    if (challengeCompletions) {
      totalXP += challengeCompletions.reduce((sum, challenge) => sum + challenge.score, 0)
    }

    // XP from achievements
    const { data: achievements } = await supabase
      .from('user_achievements')
      .select('achievements(xp_reward)')
      .join('achievements', 'achievement_id')
      .eq('user_achievements.user_id', userId)
      .gte('user_achievements.unlocked_at', weekStart.toISOString())
      .lt('user_achievements.unlocked_at', weekEnd.toISOString())

    if (achievements) {
      totalXP += achievements.reduce((sum, achievement) => sum + (achievement.achievements?.xp_reward || 0), 0)
    }

    return totalXP

  } catch (error) {
    console.error(`Error calculating weekly XP for user ${userId}:`, error)
    return 0
  }
}

async function processLeaguePromotions(leaderboardEntries: any[]) {
  const leagueThresholds = {
    'bronze': { min: 0, max: 1000, next: 'silver' },
    'silver': { min: 1001, max: 5000, next: 'gold' },
    'gold': { min: 5001, max: 15000, next: 'platinum' },
    'platinum': { min: 15001, max: Infinity, next: null }
  }

  for (const entry of leaderboardEntries) {
    const currentLeague = entry.league.toLowerCase()
    const weeklyXP = entry.weekly_xp

    // Calculate total XP for league consideration
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_xp')
      .eq('id', entry.user_id)
      .single()

    if (!profile) continue

    const totalXP = profile.total_xp + weeklyXP
    let newLeague = currentLeague

    // Check if user should be promoted
    const threshold = leagueThresholds[currentLeague as keyof typeof leagueThresholds]
    if (threshold && totalXP > threshold.max && threshold.next) {
      newLeague = threshold.next
    }

    // Update user's league if changed
    if (newLeague !== currentLeague) {
      await promoteUserLeague(entry.user_id, newLeague, entry.rank)
    }
  }
}

async function promoteUserLeague(userId: string, newLeague: string, rank: number) {
  // Award bonus XP for league promotion
  const leagueBonus = {
    'silver': 200,
    'gold': 500,
    'platinum': 1000
  }

  const bonus = leagueBonus[newLeague as keyof typeof leagueBonus] || 0

  if (bonus > 0) {
    const { error: xpError } = await supabase.rpc('award_achievement_xp', {
      p_user_id: userId,
      p_xp_amount: bonus
    })

    if (xpError) {
      console.error(`Error awarding league promotion XP for user ${userId}:`, xpError)
    }
  }

  // Update user's league
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ league: newLeague })
    .eq('id', userId)

  if (updateError) {
    console.error(`Error updating league for user ${userId}:`, updateError)
  }

  // Create notification
  const { error: notificationError } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type: 'weekly_leaderboard',
      title: '🏆 League Promotion!',
      message: `Congratulations! You've been promoted to ${newLeague} league! You ranked #${rank} this week.`,
      metadata: {
        new_league: newLeague,
        rank: rank,
        bonus_xp: bonus,
        type: 'promotion'
      },
      read: false,
      created_at: new Date().toISOString()
    })

  if (notificationError) {
    console.error(`Error creating league promotion notification for user ${userId}:`, notificationError)
  }
}

async function sendWeeklyResultNotifications(leaderboardEntries: any[]) {
  for (const entry of leaderboardEntries) {
    // Only notify top 10 users
    if (entry.rank <= 10) {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: entry.user_id,
          type: 'weekly_leaderboard',
          title: '📊 Weekly Results!',
          message: `You finished #${entry.rank} in the weekly leaderboard with ${entry.weekly_xp} XP!`,
          metadata: {
            rank: entry.rank,
            weekly_xp: entry.weekly_xp,
            type: 'weekly_result'
          },
          read: false,
          created_at: new Date().toISOString()
        })

      if (notificationError) {
        console.error(`Error creating weekly result notification for user ${entry.user_id}:`, notificationError)
      }
    }
  }
}

// Health check endpoint
Deno.serve(handleWeeklyLeaderboard, { port: 8081 })