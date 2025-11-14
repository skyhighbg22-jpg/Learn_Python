-- Migration for Enhanced PyLearn Features
-- This migration adds database support for new features: AI Character, Progressive Hints, League System, etc.

-- Add new columns to lessons table for enhanced features
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS drag_drop_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS game_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS story_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS hints JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS sky_tips JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS difficulty_level INTEGER DEFAULT 1;

-- Add new columns to profiles table for enhanced features
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS league_rank INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS weekly_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_challenges_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS perfect_solutions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS hints_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS avatar_frame TEXT DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'Python Learner',
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_league_update TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add new columns to user_lesson_progress for enhanced tracking
ALTER TABLE user_lesson_progress
ADD COLUMN IF NOT EXISTS hints_revealed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS time_spent INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS perfect_completion BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS sky_tips_viewed JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS lesson_rating INTEGER,
ADD COLUMN IF NOT EXISTS feedback TEXT;

-- Create AI Character conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  context_type TEXT DEFAULT 'general', -- general, lesson, challenge, coding
  context_data JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI character preferences table
CREATE TABLE IF NOT EXISTS ai_character_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  personality_style TEXT DEFAULT 'friendly', -- friendly, professional, humorous
  response_length TEXT DEFAULT 'medium', -- short, medium, detailed
  show_tips BOOLEAN DEFAULT TRUE,
  allow_jokes BOOLEAN DEFAULT TRUE,
  encouragement_level INTEGER DEFAULT 3, -- 1-5 scale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create enhanced daily challenges table for rotation system
CREATE TABLE IF NOT EXISTS daily_challenge_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  base_xp INTEGER NOT NULL,
  time_bonus BOOLEAN DEFAULT TRUE,
  streak_multiplier BOOLEAN DEFAULT TRUE,
  problem JSONB NOT NULL,
  category TEXT NOT NULL, -- logic, syntax, problem_solving, optimization
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weekly challenge schedule table
CREATE TABLE IF NOT EXISTS weekly_challenge_schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_start DATE UNIQUE NOT NULL,
  challenge_1_id UUID REFERENCES daily_challenge_templates(id),
  challenge_2_id UUID REFERENCES daily_challenge_templates(id),
  challenge_3_id UUID REFERENCES daily_challenge_templates(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user challenge statistics table
CREATE TABLE IF NOT EXISTS user_challenge_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_challenges INTEGER DEFAULT 0,
  perfect_challenges INTEGER DEFAULT 0,
  average_completion_time INTEGER DEFAULT 0,
  weekly_xp_earned INTEGER DEFAULT 0,
  last_challenge_date DATE,
  current_week_start DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create league progress table
CREATE TABLE IF NOT EXISTS league_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_league TEXT NOT NULL DEFAULT 'bronze',
  league_rank INTEGER DEFAULT 0,
  xp_in_current_league INTEGER DEFAULT 0,
  xp_to_next_league INTEGER DEFAULT 100,
  promotion_count INTEGER DEFAULT 0,
  demotion_count INTEGER DEFAULT 0,
  best_league TEXT DEFAULT 'bronze',
  last_league_change TIMESTAMP WITH TIME ZONE,
  weekly_performance JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weekly leaderboard table
CREATE TABLE IF NOT EXISTS weekly_leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_start DATE UNIQUE NOT NULL,
  league TEXT NOT NULL,
  top_users JSONB NOT NULL DEFAULT '[]', -- Array of user objects with rank, xp, stats
  total_participants INTEGER DEFAULT 0,
  league_cutoff_xp INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user achievements enhanced table (add new columns)
ALTER TABLE user_achievements
ADD COLUMN IF NOT EXISTS rarity TEXT DEFAULT 'common', -- common, rare, epic, legendary
ADD COLUMN IF NOT EXISTS progress_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS shared_externally BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS celebration_viewed BOOLEAN DEFAULT FALSE;

-- Create learning paths table for enhanced visualization
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📚',
  color TEXT NOT NULL DEFAULT 'blue',
  difficulty TEXT NOT NULL CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
  total_lessons INTEGER DEFAULT 0,
  estimated_minutes INTEGER DEFAULT 0,
  prerequisites JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]', -- Array of skill objects
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user learning path progress table
CREATE TABLE IF NOT EXISTS user_learning_path_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  completed_lessons INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'not_started', -- not_started, in_progress, completed
  UNIQUE(user_id, learning_path_id)
);

-- Create user activity tracking table for analytics
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- lesson_start, lesson_complete, challenge_attempt, login, etc.
  activity_data JSONB DEFAULT '{}',
  session_duration INTEGER, -- seconds
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hints tracking table for analytics
CREATE TABLE IF NOT EXISTS hint_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  hint_index INTEGER NOT NULL,
  hint_content TEXT NOT NULL,
  xp_penalty INTEGER DEFAULT 0,
  time_to_hint INTEGER, -- seconds from lesson start to hint reveal
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sky tips tracking table
CREATE TABLE IF NOT EXISTS sky_tips_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  tip_index INTEGER NOT NULL,
  tip_content TEXT NOT NULL,
  was_helpful BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create enhanced notifications table for new features
ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general', -- achievement, league, challenge, lesson, social
ADD COLUMN IF NOT EXISTS action_url TEXT,
ADD COLUMN IF NOT EXISTS action_text TEXT,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_dismissable BOOLEAN DEFAULT TRUE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_session_id ON ai_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created_at ON ai_conversations(created_at);

CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(activity_type);

CREATE INDEX IF NOT EXISTS idx_hint_usage_user_id ON hint_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_hint_usage_lesson_id ON hint_usage(lesson_id);

CREATE INDEX IF NOT EXISTS idx_sky_tips_usage_user_id ON sky_tips_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_sky_tips_usage_lesson_id ON sky_tips_usage(lesson_id);

CREATE INDEX IF NOT EXISTS idx_league_progress_user_id ON league_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_league_progress_current_league ON league_progress(current_league);

CREATE INDEX IF NOT EXISTS idx_weekly_leaderboard_week_start ON weekly_leaderboard(week_start);
CREATE INDEX IF NOT EXISTS idx_weekly_leaderboard_league ON weekly_leaderboard(league);

CREATE INDEX IF NOT EXISTS idx_user_learning_path_progress_user_id ON user_learning_path_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_path_progress_status ON user_learning_path_progress(status);

-- Insert default league thresholds data
CREATE TABLE IF NOT EXISTS league_thresholds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  league_name TEXT UNIQUE NOT NULL,
  min_xp INTEGER NOT NULL,
  max_xp INTEGER, -- NULL for highest league
  benefits JSONB DEFAULT '[]',
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO league_thresholds (league_name, min_xp, max_xp, benefits, color, icon) VALUES
('bronze', 0, 199, '{"daily_bonus": 5, "profile_badge": "🥉", "title": "Bronze Coder"}', '#CD7F32', '🥉'),
('silver', 200, 499, '{"daily_bonus": 10, "profile_badge": "🥈", "title": "Silver Developer"}', '#C0C0C0', '🥈'),
('gold', 500, 999, '{"daily_bonus": 15, "profile_badge": "🥇", "title": "Gold Engineer"}', '#FFD700', '🥇'),
('platinum', 1000, 1999, '{"daily_bonus": 20, "profile_badge": "💎", "title": "Platinum Expert"}', '#E5E4E2', '💎'),
('diamond', 2000, 3999, '{"daily_bonus": 25, "profile_badge": "💠", "title": "Diamond Master"}', '#B9F2FF', '💠'),
('master', 4000, 7999, '{"daily_bonus": 30, "profile_badge": "👑", "title": "Code Master"}', '#FF6B6B', '👑'),
('grandmaster', 8000, NULL, '{"daily_bonus": 50, "profile_badge": "🌟", "title": "Grandmaster Python"}', '#9333EA', '🌟')
ON CONFLICT (league_name) DO NOTHING;

-- Insert default learning paths
INSERT INTO learning_paths (name, description, icon, color, difficulty, total_lessons, estimated_minutes, prerequisites, skills, sort_order) VALUES
('Python Fundamentals', 'Master the basics of Python programming from variables to functions', '🐍', 'from-green-500 to-emerald-500', 'BEGINNER', 25, 480, '[]', '[{"name": "Variables", "level": 0}, {"name": "Data Types", "level": 0}, {"name": "Control Flow", "level": 0}]', 1),
('Control Flow Mastery', 'Learn conditional statements, loops, and logical operators', '🔀', 'from-blue-500 to-cyan-500', 'BEGINNER', 20, 600, '[{"path": "Python Fundamentals", "completion": 0.8}]', '[{"name": "If Statements", "level": 0}, {"name": "Loops", "level": 0}, {"name": "Logical Operators", "level": 0}]', 2),
('Data Structures & Algorithms', 'Master lists, dictionaries, sets, and essential algorithms', '🏗️', 'from-purple-500 to-pink-500', 'INTERMEDIATE', 30, 900, '[{"path": "Control Flow Mastery", "completion": 0.9}]', '[{"name": "Lists", "level": 0}, {"name": "Dictionaries", "level": 0}, {"name": "Algorithms", "level": 0}]', 3),
('Advanced Python', 'Advanced topics including OOP, decorators, and best practices', '🚀', 'from-orange-500 to-red-500', 'ADVANCED', 35, 1200, '[{"path": "Data Structures & Algorithms", "completion": 0.8}]', '[{"name": "Classes", "level": 0}, {"name": "Decorators", "level": 0}, {"name": "Advanced Patterns", "level": 0}]', 4)
ON CONFLICT DO NOTHING;

-- Create function to update league progress
CREATE OR REPLACE FUNCTION update_user_league_progress(
  p_user_id UUID,
  p_xp_earned INTEGER DEFAULT 0
) RETURNS VOID AS $$
DECLARE
  current_league_name TEXT;
  new_league_name TEXT;
  current_league_xp INTEGER;
  total_xp INTEGER;
BEGIN
  -- Get current total XP
  SELECT p.total_xp INTO total_xp
  FROM profiles p
  WHERE p.id = p_user_id;

  -- Determine appropriate league based on XP
  SELECT lt.league_name INTO new_league_name
  FROM league_thresholds lt
  WHERE total_xp >= lt.min_xp
  ORDER BY lt.min_xp DESC
  LIMIT 1;

  -- Update or create league progress
  INSERT INTO league_progress (
    user_id,
    current_league,
    xp_in_current_league,
    xp_to_next_league
  ) VALUES (
    p_user_id,
    new_league_name,
    total_xp,
    COALESCE((SELECT min_xp FROM league_thresholds WHERE league_name != new_league_name AND min_xp > total_xp ORDER BY min_xp LIMIT 1), 999999) - total_xp
  )
  ON CONFLICT (user_id) DO UPDATE SET
    current_league = EXCLUDED.current_league,
    xp_in_current_league = EXCLUDED.xp_in_current_league,
    xp_to_next_league = EXCLUDED.xp_to_next_league,
    updated_at = NOW();

END;
$$ LANGUAGE plpgsql;

-- Create function to track user activity
CREATE OR REPLACE FUNCTION track_user_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_activity_data JSONB DEFAULT '{}',
  p_session_duration INTEGER DEFAULT NULL,
  p_xp_earned INTEGER DEFAULT 0
) RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO user_activity (
    user_id,
    activity_type,
    activity_data,
    session_duration,
    xp_earned
  ) VALUES (
    p_user_id,
    p_activity_type,
    p_activity_data,
    p_session_duration,
    p_xp_earned
  )
  RETURNING id INTO activity_id;

  RETURN activity_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update league progress when XP changes
CREATE OR REPLACE FUNCTION trigger_league_progress_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_user_league_progress(NEW.id, NEW.total_xp - OLD.total_xp);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_league_on_xp_change
  AFTER UPDATE ON profiles
  FOR EACH ROW
  WHEN (NEW.total_xp != OLD.total_xp)
  EXECUTE FUNCTION trigger_league_progress_update();

-- Create view for user profile with enhanced data
CREATE OR REPLACE VIEW enhanced_user_profile AS
SELECT
  p.*,
  lp.current_league,
  lp.league_rank,
  lp.xp_in_current_league,
  lp.xp_to_next_league,
  ucs.total_challenges,
  ucs.current_streak as challenge_streak,
  ucs.perfect_challenges,
  COALESCE(achievement_counts.total_achievements, 0) as total_achievements,
  COALESCE(lesson_counts.completed_lessons, 0) as completed_lessons,
  COALESCE(learning_paths_count.active_paths, 0) as active_learning_paths
FROM profiles p
LEFT JOIN league_progress lp ON p.id = lp.user_id
LEFT JOIN user_challenge_stats ucs ON p.id = ucs.user_id
LEFT JOIN (
  SELECT
    user_id,
    COUNT(*) as total_achievements
  FROM user_achievements
  GROUP BY user_id
) achievement_counts ON p.id = achievement_counts.user_id
LEFT JOIN (
  SELECT
    user_id,
    COUNT(*) as completed_lessons
  FROM user_lesson_progress
  WHERE status = 'completed'
  GROUP BY user_id
) lesson_counts ON p.id = lesson_counts.user_id
LEFT JOIN (
  SELECT
    user_id,
    COUNT(*) as active_paths
  FROM user_learning_path_progress
  WHERE status = 'in_progress'
  GROUP BY user_id
) learning_paths_count ON p.id = learning_paths_count.user_id;

-- Add RLS (Row Level Security) policies for new tables
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_character_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenge_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_challenge_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_path_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE hint_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE sky_tips_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for AI conversations
CREATE POLICY "Users can view own AI conversations" ON ai_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI conversations" ON ai_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI conversations" ON ai_conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- Similar policies for other user-specific tables
CREATE POLICY "Users can view own preferences" ON ai_character_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own preferences" ON ai_character_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own challenge stats" ON user_challenge_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own challenge stats" ON user_challenge_stats
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own league progress" ON league_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own league progress" ON league_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own learning path progress" ON user_learning_path_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own learning path progress" ON user_learning_path_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own activity" ON user_activity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON user_activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own hint usage" ON hint_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hint usage" ON hint_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own sky tips usage" ON sky_tips_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sky tips usage" ON sky_tips_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read policies for shared data
CREATE POLICY "Anyone can view learning paths" ON learning_paths
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view league thresholds" ON league_thresholds
  FOR SELECT;

CREATE POLICY "Anyone can view weekly leaderboards" ON weekly_leaderboard
  FOR SELECT;

CREATE POLICY "Anyone can view challenge templates" ON daily_challenge_templates
  FOR SELECT;

COMMENT ON TABLE ai_conversations IS 'Stores AI character conversation history and context';
COMMENT ON TABLE ai_character_preferences IS 'User preferences for AI character personality and behavior';
COMMENT ON TABLE daily_challenge_templates IS 'Template challenges used for daily rotation system';
COMMENT ON TABLE weekly_challenge_schedule IS 'Weekly schedule of daily challenges';
COMMENT ON TABLE user_challenge_stats IS 'Comprehensive user challenge statistics and performance tracking';
COMMENT ON TABLE league_progress IS 'User progression through league system with rankings and rewards';
COMMENT ON TABLE weekly_leaderboard IS 'Weekly league leaderboards for competitive elements';
COMMENT ON TABLE learning_paths IS 'Structured learning paths with prerequisites and skill tracking';
COMMENT ON TABLE user_learning_path_progress IS 'User progress through various learning paths';
COMMENT ON TABLE user_activity IS 'Detailed activity tracking for analytics and personalization';
COMMENT ON TABLE hint_usage IS 'Tracking hint usage for analytics and difficulty balancing';
COMMENT ON TABLE sky_tips_usage IS 'Tracking Sky's tips engagement and effectiveness';