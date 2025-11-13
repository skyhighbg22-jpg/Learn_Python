-- QUICK SETUP SCRIPT FOR LEARN PYTHON APPLICATION
-- Copy and paste this into your Supabase SQL Editor
-- This creates all necessary tables and sample data

-- ========================================
-- CORE TABLES
-- ========================================

-- Sections table (learning modules)
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

-- Lessons table (individual lessons within sections)
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

-- User lesson progress tracking
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'locked',
  score INTEGER DEFAULT 0,
  completion_time INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- User profiles
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

-- Daily challenges
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

-- Challenge attempts
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

-- Notifications
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

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement JSONB NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ========================================
-- DATABASE FUNCTIONS
-- ========================================

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

-- User progress stats function
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

-- ========================================
-- SAMPLE DATA
-- ========================================

-- Insert learning sections
INSERT INTO sections (title, description, path, order_index, unlock_requirement_xp) VALUES
('Python Basics', 'Learn the fundamentals of Python programming', 'python-basics', 1, 0),
('Variables & Data Types', 'Understanding how to store and manipulate data', 'variables-data-types', 2, 30),
('Control Flow', 'Making decisions and controlling program flow', 'control-flow', 3, 80),
('Functions & Modules', 'Organizing code with functions and modules', 'functions-modules', 4, 150),
('Lists & Data Structures', 'Working with collections and data structures', 'lists-data-structures', 5, 250)
ON CONFLICT DO NOTHING;

-- Get section IDs for lesson insertion
DO $$
DECLARE
  basics_id UUID;
  variables_id UUID;
  control_id UUID;
BEGIN
  SELECT id INTO basics_id FROM sections WHERE path = 'python-basics';
  SELECT id INTO variables_id FROM sections WHERE path = 'variables-data-types';
  SELECT id INTO control_id FROM sections WHERE path = 'control-flow';

  -- Insert Python Basics lessons
  INSERT INTO lessons (title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
  ('Welcome to Python', 'Introduction to Python programming and its history', 'beginner', 10, 1, basics_id,
   '[{"type": "text", "content": "🐍 Welcome to Python Programming!\\n\\nPython is a high-level, interpreted programming language created by Guido van Rossum."}, {"type": "multiple-choice", "question": "Who created Python?", "options": ["Guido van Rossum", "James Gosling", "Bjarne Stroustrup", "Dennis Ritchie"], "correctAnswer": "Guido van Rossum"}]',
   'traditional', 12),

  ('Your First Program', 'Write and run your first Python code', 'beginner', 15, 2, basics_id,
   '[{"type": "text", "content": "Let\'s write your first Python program!"}, {"type": "code", "question": "Write a program that prints \\"Hello, World!\\"", "starterCode": "# Your first program\\nprint()", "solution": "print(\\"Hello, World!\\")"}]',
   'code', 15),

  ('Variables', 'Learn how to create and use variables', 'beginner', 15, 1, variables_id,
   '[{"type": "text", "content": "Variables are containers for storing data values."}, {"type": "code", "question": "Create a variable named age with value 25", "starterCode": "# Create the variable\\nage = ", "solution": "age = 25"}]',
   'code', 15),

  ('Data Types', 'Understanding different data types in Python', 'beginner', 18, 2, variables_id,
   '[{"type": "text", "content": "Python has several built-in data types: int, float, str, bool."}, {"type": "multiple-choice", "question": "What data type is 3.14?", "options": ["int", "float", "str", "bool"], "correctAnswer": "float"}]',
   'traditional', 12),

  ('If Statements', 'Making decisions in your code with conditional logic', 'beginner', 20, 1, control_id,
   '[{"type": "text", "content": "If statements allow your program to make decisions."}, {"type": "code", "question": "Write an if statement that checks if age >= 18", "starterCode": "age = 20\\nif :", "solution": "age = 20\\nif age >= 18:\\n    print(\\"You can vote\\")"}]',
   'code', 18)
  ON CONFLICT DO NOTHING;
END $$;

-- Insert daily challenges
INSERT INTO daily_challenges (title, description, difficulty, xp_reward, date, problem) VALUES
('Python Basics Quiz', 'Test your Python fundamentals', 'easy', 40, CURRENT_DATE,
 '{"type": "quiz", "questions": [{"question": "Who created Python?", "options": ["Guido van Rossum", "James Gosling", "Bjarne Stroustrup"], "correctAnswer": "Guido van Rossum"}]}'),

('Variables Challenge', 'Test your variable knowledge', 'easy', 50, CURRENT_DATE + INTERVAL '1 day',
 '{"type": "quiz", "questions": [{"question": "How do you create a variable?", "options": ["x = 5", "var x = 5", "x := 5"], "correctAnswer": "x = 5"}]}')
ON CONFLICT (date) DO NOTHING;

-- Insert achievements
INSERT INTO achievements (name, description, icon, requirement, xp_reward) VALUES
('First Steps', 'Complete your first lesson', '🎯', '{"type": "lesson_completion", "count": 1}', 25),
('Python Basics', 'Complete the Python Basics section', '🐍', '{"type": "section_completion", "section": "python-basics"}', 100),
('Week Warrior', 'Maintain a 7-day streak', '🔥', '{"type": "streak", "days": 7}', 200)
ON CONFLICT DO NOTHING;

-- ========================================
-- SUCCESS MESSAGE
-- ========================================

SELECT '🎉 Setup completed successfully! Your Learn Python application is now ready with sample lessons and data.' AS message;