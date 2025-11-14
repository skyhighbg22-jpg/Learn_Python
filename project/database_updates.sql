-- Database Schema Updates for Enhanced Features
-- This file contains all the database changes needed for the new features

-- ==========================================
-- 1. Enhanced Achievement System Updates
-- ==========================================

-- Add special rewards and rarity to achievements table
ALTER TABLE achievements
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS secret BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS special_rewards JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary'));

-- Add hint tracking to user_lesson_progress table
ALTER TABLE user_lesson_progress
ADD COLUMN IF NOT EXISTS hints_used INTEGER DEFAULT 0;

-- Add hint data and Sky's tips to lessons table
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS hint_data JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS sky_tips JSONB DEFAULT '[]'::jsonb;

-- ==========================================
-- 2. AI Character System Tables
-- ==========================================

-- Add AI character preferences to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS sky_chat_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS preferred_personality TEXT DEFAULT 'motivational';

-- Create conversations table for AI character interactions
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id TEXT NOT NULL,
  message JSONB NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('user', 'sky')),
  lesson_context UUID REFERENCES lessons(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_conversation_id ON ai_conversations(conversation_id);

-- ==========================================
-- 3. Daily Challenges System
-- ==========================================

-- Create weekly challenges table
CREATE TABLE IF NOT EXISTS weekly_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_start DATE UNIQUE NOT NULL,
  challenges JSONB NOT NULL, -- 7 challenges array with metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add challenge completion tracking
CREATE TABLE IF NOT EXISTS user_challenge_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  score INTEGER NOT NULL DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  UNIQUE(user_id, challenge_id)
);

-- Add streak tracking for daily challenges
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS daily_challenge_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_daily_challenge_date DATE;

-- ==========================================
-- 4. Enhanced Leaderboard System
-- ==========================================

-- Create enhanced user profile view for leaderboards
CREATE OR REPLACE VIEW enhanced_user_profile AS
SELECT
  p.id,
  p.username,
  p.display_name,
  p.avatar_character,
  p.avatar_frame,
  p.title,
  p.league,
  p.total_xp,
  p.current_level,
  p.current_streak,
  p.longest_streak,
  p.country_code,
  p.created_at,
  p.last_active_date,
  p.daily_goal_minutes,
  p.learning_path,
  p.daily_challenge_streak,
  p.last_daily_challenge_date,
  -- Aggregated achievement data
  COALESCE(achievement_counts.total_achievements, 0) as total_achievements,
  COALESCE(achievement_counts.total_points, 0) as total_points,
  COALESCE(achievement_counts.completed_lessons, 0) as completed_lessons,
  -- Calculated fields
  COALESCE(p.total_xp, 0) + COALESCE(achievement_counts.total_points, 0) as total_score,
  COALESCE(weekly_stats.weekly_xp, 0) as weekly_xp
FROM profiles p
LEFT JOIN (
  SELECT
    user_id,
    COUNT(*) as total_achievements,
    SUM(points) as total_points,
    COUNT(CASE WHEN achievement_id LIKE '%lesson%' THEN 1 END) as completed_lessons
  FROM user_achievements ua
  JOIN achievements a ON ua.achievement_id = a.id
  WHERE ua.unlocked_at IS NOT NULL
  GROUP BY user_id
) achievement_counts ON p.id = achievement_counts.user_id
LEFT JOIN (
  SELECT
    user_id,
    SUM(CASE WHEN created_at >= date_trunc('week', CURRENT_DATE) THEN xp_earned ELSE 0 END) as weekly_xp
  FROM user_lesson_progress
  WHERE completed_at IS NOT NULL
  GROUP BY user_id
) weekly_stats ON p.id = weekly_stats.user_id;

-- Create leaderboard history table for tracking rank changes
CREATE TABLE IF NOT EXISTS weekly_leaderboard_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  current_rank INTEGER NOT NULL,
  previous_rank INTEGER,
  rank_change INTEGER GENERATED ALWAYS AS (current_rank - COALESCE(previous_rank, current_rank)) STORED,
  time_range TEXT NOT NULL CHECK (time_range IN ('weekly', 'monthly', 'yearly')),
  category TEXT DEFAULT 'overall' CHECK (category IN ('overall', 'xp', 'streak', 'achievements', 'lessons')),
  week_start DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, time_range, category, week_start)
);

-- ==========================================
-- 5. Code Quality System
-- ==========================================

-- Create code quality analysis table
CREATE TABLE IF NOT EXISTS code_quality_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id),
  code TEXT NOT NULL,
  analysis JSONB NOT NULL, -- Contains the full analysis report
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  grade TEXT NOT NULL CHECK (grade IN ('A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F')),
  issues_count INTEGER DEFAULT 0,
  fixable_issues INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create code quality trends table
CREATE TABLE IF NOT EXISTS code_quality_trends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  avg_score DECIMAL(5,2) DEFAULT 0,
  analyses_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ==========================================
-- 6. Achievement Celebrations
-- ==========================================

-- Create achievement celebrations table for tracking viewed celebrations
CREATE TABLE IF NOT EXISTS achievement_celebrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id),
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ==========================================
-- 7. Indexes for Performance
-- ==========================================

-- Performance indexes for frequently queried data
CREATE INDEX IF NOT EXISTS idx_profiles_total_xp ON profiles(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_league_xp ON profiles(league, total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_country ON profiles(country_code) WHERE country_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_unlocked ON user_achievements(user_id, unlocked_at);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_completed ON user_lesson_progress(user_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_created ON ai_conversations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_challenges_week_start ON weekly_challenges(week_start);
CREATE INDEX IF NOT EXISTS idx_code_quality_analyses_user_created ON code_quality_analyses(user_id, created_at DESC);

-- ==========================================
-- 8. Sample Data Inserts (Optional)
-- ==========================================

-- Insert some rare achievements for demonstration
INSERT INTO achievements (id, title, description, icon, category, requirements, xp_reward, rarity, points, special_rewards) VALUES
('achievement_python_master', 'Python Master', 'Complete all Python lessons with a perfect score', '🐍', 'progress', '{"completed_lessons": "all", "avg_score": 100}', 500, 'legendary', 1000, '[{"type": "title", "value": "Python Master", "description": "Earn the title of Python Master", "rarity": "legendary"}, {"type": "badge", "value": "python-master", "description": "Exclusive Python Master badge", "rarity": "legendary"}]'),
('achievement_streak_legend', 'Streak Legend', 'Maintain a 100-day learning streak', '🔥', 'streak', '{"current_streak": 100}', 300, 'epic', 500, '[{"type": "avatar", "value": "🔥", "description": "Legendary fire avatar", "rarity": "epic"}, {"type": "theme", "value": "fire", "description": "Fire theme for your profile", "rarity": "epic"}]'),
('achievement_code_quality_guru', 'Code Quality Guru', 'Achieve A+ grade on 50 different code submissions', '✨', 'special', '{"quality_analyses": 50, "min_grade": "A+"}', 200, 'rare', 300, '[{"type": "badge", "value": "quality-guru", "description": "Code Quality Guru badge", "rarity": "rare"}]')
ON CONFLICT (id) DO NOTHING;

-- Insert sample Sky tips for common lessons
UPDATE lessons
SET sky_tips = '[
  "Python is case-sensitive - make sure your variable names match exactly!",
  "Always use meaningful variable names that describe what the data represents",
  "Don''t forget the colon (:) after if statements and loops",
  "Indentation matters in Python - use 4 spaces for each level"
]'
WHERE title LIKE '%Variables%' OR title LIKE '%Introduction%';

-- ==========================================
-- 9. Cleanup and Validation
-- ==========================================

-- Create function to calculate and update user leaderboard stats
CREATE OR REPLACE FUNCTION update_user_leaderboard_stats(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    -- This function would be called periodically to update the enhanced_user_profile view
    -- and recalculate leaderboard positions
    NULL;
END;
$$ LANGUAGE plpgsql;

-- Add validation constraints
ALTER TABLE profiles
ADD CONSTRAINT IF NOT EXISTS check_current_streak_positive CHECK (current_streak >= 0),
ADD CONSTRAINT IF NOT EXISTS check_longest_streak_positive CHECK (longest_streak >= 0),
ADD CONSTRAINT IF NOT EXISTS check_total_xp_positive CHECK (total_xp >= 0),
ADD CONSTRAINT IF NOT EXISTS check_current_level_positive CHECK (current_level >= 1);

-- Comments for documentation
COMMENT ON TABLE ai_conversations IS 'Stores conversations between users and the Sky AI character';
COMMENT ON TABLE weekly_challenges IS 'Contains the 7 weekly challenges that rotate every Monday';
COMMENT ON TABLE code_quality_analyses IS 'Stores AI-powered code quality analysis results';
COMMENT ON TABLE achievement_celebrations IS 'Tracks which achievement celebrations users have viewed';
COMMENT ON VIEW enhanced_user_profile IS 'Enhanced user profile data with aggregated stats for leaderboards';

-- End of Database Updates
-- This script should be run in sequence after the existing database schema