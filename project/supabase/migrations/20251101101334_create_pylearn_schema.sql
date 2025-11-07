/*
  # PyLearn Database Schema

  ## Overview
  Complete database schema for PyLearn - a gamified Python learning platform.

  ## New Tables

  ### Authentication & Users
  - `profiles` - Extended user profile data
    - `id` (uuid, FK to auth.users)
    - `username` (text, unique)
    - `display_name` (text)
    - `avatar_character` (text) - Selected character avatar
    - `current_streak` (int)
    - `longest_streak` (int)
    - `total_xp` (int)
    - `current_level` (int)
    - `hearts` (int) - Daily hearts (max 5)
    - `last_heart_reset` (timestamptz)
    - `league` (text) - Bronze, Silver, Gold, Platinum, Diamond
    - `learning_path` (text) - Web Dev, Data Science, etc.
    - `daily_goal_minutes` (int)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### Learning Content
  - `lessons` - Individual lessons
    - `id` (uuid)
    - `title` (text)
    - `description` (text)
    - `difficulty` (text) - beginner, intermediate, advanced, expert, master
    - `xp_reward` (int)
    - `order_index` (int)
    - `section_id` (uuid, FK)
    - `content` (jsonb) - Lesson content structure
    - `estimated_minutes` (int)

  - `sections` - Groups of lessons
    - `id` (uuid)
    - `title` (text)
    - `description` (text)
    - `path` (text) - Learning path category
    - `order_index` (int)
    - `unlock_requirement_xp` (int)

  - `user_lesson_progress` - Track user progress
    - `id` (uuid)
    - `user_id` (uuid, FK)
    - `lesson_id` (uuid, FK)
    - `status` (text) - locked, unlocked, in_progress, completed
    - `score` (int)
    - `attempts` (int)
    - `completed_at` (timestamptz)
    - `last_attempt_at` (timestamptz)

  ### Gamification
  - `achievements` - Available achievements
    - `id` (uuid)
    - `name` (text)
    - `description` (text)
    - `icon` (text)
    - `category` (text)
    - `requirement` (jsonb)
    - `xp_reward` (int)

  - `user_achievements` - User earned achievements
    - `id` (uuid)
    - `user_id` (uuid, FK)
    - `achievement_id` (uuid, FK)
    - `earned_at` (timestamptz)

  - `daily_challenges` - Daily coding challenges
    - `id` (uuid)
    - `title` (text)
    - `description` (text)
    - `difficulty` (text)
    - `xp_reward` (int)
    - `date` (date)
    - `problem` (jsonb)

  - `user_challenge_completions` - Track completed challenges
    - `id` (uuid)
    - `user_id` (uuid, FK)
    - `challenge_id` (uuid, FK)
    - `completed_at` (timestamptz)
    - `solution_code` (text)
    - `execution_time_ms` (int)

  ### Projects
  - `projects` - Learning projects
    - `id` (uuid)
    - `title` (text)
    - `description` (text)
    - `difficulty` (text)
    - `xp_reward` (int)
    - `requirements` (jsonb)
    - `starter_code` (text)

  - `user_projects` - User project submissions
    - `id` (uuid)
    - `user_id` (uuid, FK)
    - `project_id` (uuid, FK)
    - `code` (text)
    - `status` (text) - in_progress, submitted, completed
    - `feedback` (jsonb)
    - `submitted_at` (timestamptz)

  ### Social Features
  - `friendships` - Friend connections
    - `id` (uuid)
    - `user_id` (uuid, FK)
    - `friend_id` (uuid, FK)
    - `status` (text) - pending, accepted
    - `created_at` (timestamptz)

  - `leaderboards` - Weekly leaderboard entries
    - `id` (uuid)
    - `user_id` (uuid, FK)
    - `week_start` (date)
    - `weekly_xp` (int)
    - `rank` (int)

  ### Interview Prep
  - `interview_questions` - Coding interview problems
    - `id` (uuid)
    - `title` (text)
    - `description` (text)
    - `difficulty` (text)
    - `category` (text)
    - `test_cases` (jsonb)
    - `hints` (jsonb)

  - `user_interview_attempts` - Track interview question attempts
    - `id` (uuid)
    - `user_id` (uuid, FK)
    - `question_id` (uuid, FK)
    - `solution_code` (text)
    - `passed` (boolean)
    - `execution_time_ms` (int)
    - `attempted_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only read/write their own data
  - Public read access for lessons, sections, achievements, challenges, projects, and interview questions
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  avatar_character text DEFAULT 'sky',
  current_streak int DEFAULT 0,
  longest_streak int DEFAULT 0,
  total_xp int DEFAULT 0,
  current_level int DEFAULT 1,
  hearts int DEFAULT 5,
  last_heart_reset timestamptz DEFAULT now(),
  league text DEFAULT 'bronze',
  learning_path text,
  daily_goal_minutes int DEFAULT 15,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sections table
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  path text NOT NULL,
  order_index int NOT NULL,
  unlock_requirement_xp int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL,
  xp_reward int DEFAULT 10,
  order_index int NOT NULL,
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
  content jsonb NOT NULL,
  estimated_minutes int DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

-- User lesson progress
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  status text DEFAULT 'locked',
  score int DEFAULT 0,
  attempts int DEFAULT 0,
  completed_at timestamptz,
  last_attempt_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  category text NOT NULL,
  requirement jsonb NOT NULL,
  xp_reward int DEFAULT 50,
  created_at timestamptz DEFAULT now()
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Daily challenges
CREATE TABLE IF NOT EXISTS daily_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL,
  xp_reward int DEFAULT 20,
  date date NOT NULL UNIQUE,
  problem jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- User challenge completions
CREATE TABLE IF NOT EXISTS user_challenge_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id uuid REFERENCES daily_challenges(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  solution_code text,
  execution_time_ms int,
  UNIQUE(user_id, challenge_id)
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL,
  xp_reward int DEFAULT 100,
  requirements jsonb NOT NULL,
  starter_code text,
  created_at timestamptz DEFAULT now()
);

-- User projects
CREATE TABLE IF NOT EXISTS user_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  code text,
  status text DEFAULT 'in_progress',
  feedback jsonb,
  submitted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, project_id)
);

-- Friendships table
CREATE TABLE IF NOT EXISTS friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  friend_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Leaderboards table
CREATE TABLE IF NOT EXISTS leaderboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  weekly_xp int DEFAULT 0,
  rank int,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, week_start)
);

-- Interview questions
CREATE TABLE IF NOT EXISTS interview_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL,
  category text NOT NULL,
  test_cases jsonb NOT NULL,
  hints jsonb,
  created_at timestamptz DEFAULT now()
);

-- User interview attempts
CREATE TABLE IF NOT EXISTS user_interview_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  question_id uuid REFERENCES interview_questions(id) ON DELETE CASCADE,
  solution_code text,
  passed boolean DEFAULT false,
  execution_time_ms int,
  attempted_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interview_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for public content (sections, lessons, achievements, etc.)
CREATE POLICY "Anyone can view sections"
  ON sections FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view daily challenges"
  ON daily_challenges FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view interview questions"
  ON interview_questions FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user progress
CREATE POLICY "Users can view own progress"
  ON user_lesson_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_lesson_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for challenge completions
CREATE POLICY "Users can view own challenge completions"
  ON user_challenge_completions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenge completions"
  ON user_challenge_completions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user projects
CREATE POLICY "Users can view own projects"
  ON user_projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON user_projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON user_projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for friendships
CREATE POLICY "Users can view own friendships"
  ON friendships FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friendships"
  ON friendships FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own friendships"
  ON friendships FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id)
  WITH CHECK (auth.uid() = user_id OR auth.uid() = friend_id);

-- RLS Policies for leaderboards
CREATE POLICY "Anyone can view leaderboards"
  ON leaderboards FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own leaderboard entry"
  ON leaderboards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leaderboard entry"
  ON leaderboards FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for interview attempts
CREATE POLICY "Users can view own interview attempts"
  ON user_interview_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interview attempts"
  ON user_interview_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson_id ON user_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_week_start ON leaderboards(week_start);
CREATE INDEX IF NOT EXISTS idx_leaderboards_weekly_xp ON leaderboards(weekly_xp DESC);
CREATE INDEX IF NOT EXISTS idx_friendships_user_id ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON friendships(friend_id);
