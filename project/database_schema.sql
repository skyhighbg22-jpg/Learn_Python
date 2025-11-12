-- Database Schema and Functions for Learn Python Application
-- This file contains all the necessary tables and functions for the application

-- Core Tables
CREATE TABLE IF NOT EXISTS sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  path TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  unlock_requirement_xp INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  xp_reward INTEGER NOT NULL DEFAULT 10,
  order_index INTEGER NOT NULL,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  estimated_minutes INTEGER DEFAULT 10,
  lesson_type TEXT NOT NULL DEFAULT 'multiple-choice',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'locked', -- locked, available, in_progress, completed
  score INTEGER DEFAULT 0,
  completion_time INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  avatar_character TEXT DEFAULT '🐍',
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  hearts INTEGER DEFAULT 5,
  max_hearts INTEGER DEFAULT 5,
  last_heart_reset DATE DEFAULT CURRENT_DATE,
  last_active_date DATE,
  league TEXT DEFAULT 'bronze',
  learning_path TEXT,
  daily_goal_minutes INTEGER DEFAULT 30,
  daily_goal_hearts INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  xp_reward INTEGER NOT NULL DEFAULT 50,
  date DATE UNIQUE NOT NULL,
  problem JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_challenge_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES daily_challenges(id) ON DELETE CASCADE,
  challenge_date DATE NOT NULL,
  score INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 1,
  completion_time INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement JSONB NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Database Functions

-- Award achievement XP function
CREATE OR REPLACE FUNCTION award_achievement_xp(
  p_user_id UUID,
  p_achievement_id UUID DEFAULT gen_random_uuid(),
  p_xp_amount INTEGER
) RETURNS BOOLEAN AS $$
BEGIN
  -- Update user profile with XP
  UPDATE profiles
  SET total_xp = total_xp + p_xp_amount,
      current_level = GREATEST(1, FLOOR((total_xp + p_xp_amount) / 100)),
      updated_at = NOW()
  WHERE id = p_user_id;

  -- Record achievement (if achievement_id provided)
  IF p_achievement_id IS NOT NULL THEN
    INSERT INTO user_achievements (user_id, achievement_id, earned_at)
    VALUES (p_user_id, p_achievement_id, NOW())
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Update weekly leaderboards function
CREATE OR REPLACE FUNCTION update_weekly_leaderboards(
  p_week_start TIMESTAMP WITH TIME ZONE
) RETURNS VOID AS $$
BEGIN
  -- This function would update weekly leaderboard data
  -- Implementation depends on specific leaderboard requirements
  RAISE NOTICE 'Weekly leaderboards updated for week starting at %', p_week_start;
END;
$$ LANGUAGE plpgsql;

-- Function to get user progress statistics
CREATE OR REPLACE FUNCTION get_user_progress_stats(
  p_user_id UUID
) RETURNS TABLE(
  completed_lessons BIGINT,
  total_xp BIGINT,
  current_level BIGINT,
  current_streak BIGINT,
  completed_challenges BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT CASE WHEN ulp.status = 'completed' THEN ulp.lesson_id END) as completed_lessons,
    COALESCE(p.total_xp, 0) as total_xp,
    COALESCE(p.current_level, 1) as current_level,
    COALESCE(p.current_streak, 0) as current_streak,
    COUNT(DISTINCT CASE WHEN dca.completed = TRUE THEN dca.challenge_id END) as completed_challenges
  FROM profiles p
  LEFT JOIN user_lesson_progress ulp ON p.id = ulp.user_id
  LEFT JOIN daily_challenge_attempts dca ON p.id = dca.user_id
  WHERE p.id = p_user_id
  GROUP BY p.id, p.total_xp, p.current_level, p.current_streak;
END;
$$ LANGUAGE plpgsql;

-- Sample Data for Testing

-- Insert sample sections
INSERT INTO sections (title, description, path, order_index, unlock_requirement_xp) VALUES
('Python Basics', 'Learn the fundamentals of Python programming', 'python-basics', 1, 0),
('Variables & Data Types', 'Understanding how to store and manipulate data', 'variables-data-types', 2, 50),
('Control Flow', 'Making decisions and controlling program flow', 'control-flow', 3, 150)
ON CONFLICT DO NOTHING;

-- Insert sample lessons
INSERT INTO lessons (title, description, difficulty, xp_reward, order_index, section_id, content) VALUES
('Your First Python Program', 'Write and run your first Python code', 'beginner', 10, 1,
 (SELECT id FROM sections WHERE order_index = 1),
 '[{"type": "text", "content": "Welcome to Python!"}, {"type": "multiple-choice", "question": "What is Python?", "options": ["A programming language", "A snake", "A fruit"], "correctAnswer": "A programming language"}]'),
('Variables', 'Learn how to store data in variables', 'beginner', 15, 1,
 (SELECT id FROM sections WHERE order_index = 2),
 '[{"type": "text", "content": "Variables store data in Python"}, {"type": "multiple-choice", "question": "How do you create a variable in Python?", "options": ["x = 5", "var x = 5", "declare x = 5"], "correctAnswer": "x = 5"}]'),
('If Statements', 'Learn to make decisions in your code', 'beginner', 20, 2,
 (SELECT id FROM sections WHERE order_index = 3),
 '[{"type": "text", "content": "If statements let you make decisions"}, {"type": "multiple-choice", "question": "What keyword is used for conditional statements?", "options": ["if", "when", "check"], "correctAnswer": "if"}]')
ON CONFLICT DO NOTHING;

-- Insert sample daily challenges
INSERT INTO daily_challenges (title, description, difficulty, xp_reward, date, problem) VALUES
('Python Variables Challenge', 'Test your knowledge of Python variables', 'easy', 50, CURRENT_DATE,
 '{"type": "quiz", "questions": [{"question": "What is a variable?", "options": ["Storage location", "A type", "A function"], "answer": "Storage location"}]}')
ON CONFLICT (date) DO NOTHING;

-- Insert sample achievements
INSERT INTO achievements (name, description, icon, requirement, xp_reward) VALUES
('First Steps', 'Complete your first lesson', '🎯', '{"type": "lesson_completion", "count": 1}', 25),
('Python Basics', 'Complete the Python Basics section', '🐍', '{"type": "section_completion", "section": "python-basics"}', 100),
('Week Warrior', 'Maintain a 7-day streak', '🔥', '{"type": "streak", "days": 7}', 200)
ON CONFLICT DO NOTHING;