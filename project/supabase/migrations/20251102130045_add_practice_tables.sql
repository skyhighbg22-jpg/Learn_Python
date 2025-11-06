/*
  # Add Practice Content Tables

  1. New Tables
    - `code_challenges` - Coding problems for practice
    - `user_challenge_attempts` - Track user attempts
    - `algorithm_problems` - Algorithm practice problems
    - `user_algorithm_attempts` - Track algorithm attempts
    - `project_templates` - Project building templates
    - `user_project_attempts` - Track project progress
  
  2. Security
    - Enable RLS on all new tables
    - Users can only access their own attempts
    - Public read access for challenges and projects
*/

-- Code Challenges table
CREATE TABLE IF NOT EXISTS code_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL,
  category text NOT NULL,
  xp_reward int DEFAULT 50,
  problem_statement text NOT NULL,
  starter_code text,
  test_cases jsonb NOT NULL,
  hints jsonb,
  created_at timestamptz DEFAULT now()
);

-- User code challenge attempts
CREATE TABLE IF NOT EXISTS user_code_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id uuid REFERENCES code_challenges(id) ON DELETE CASCADE,
  solution_code text,
  passed boolean DEFAULT false,
  execution_time_ms int,
  attempts_count int DEFAULT 1,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Algorithm Problems table
CREATE TABLE IF NOT EXISTS algorithm_problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL,
  category text NOT NULL,
  xp_reward int DEFAULT 75,
  problem_statement text NOT NULL,
  explanation text NOT NULL,
  time_complexity text,
  space_complexity text,
  test_cases jsonb NOT NULL,
  solution_code text,
  hints jsonb,
  created_at timestamptz DEFAULT now()
);

-- User algorithm attempts
CREATE TABLE IF NOT EXISTS user_algorithm_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  problem_id uuid REFERENCES algorithm_problems(id) ON DELETE CASCADE,
  solution_code text,
  passed boolean DEFAULT false,
  execution_time_ms int,
  attempts_count int DEFAULT 1,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, problem_id)
);

-- Project Templates table
CREATE TABLE IF NOT EXISTS project_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL,
  category text NOT NULL,
  xp_reward int DEFAULT 200,
  project_brief text NOT NULL,
  starter_files jsonb,
  learning_objectives jsonb,
  resources jsonb,
  created_at timestamptz DEFAULT now()
);

-- User project attempts
CREATE TABLE IF NOT EXISTS user_project_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES project_templates(id) ON DELETE CASCADE,
  code text,
  status text DEFAULT 'in_progress',
  completion_percentage int DEFAULT 0,
  submitted_at timestamptz,
  completed_at timestamptz,
  feedback jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, project_id)
);

-- Enable RLS
ALTER TABLE code_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_code_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE algorithm_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_algorithm_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_project_attempts ENABLE ROW LEVEL SECURITY;

-- Public read access for challenges
CREATE POLICY "Anyone can view code challenges"
  ON code_challenges FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view algorithm problems"
  ON algorithm_problems FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view project templates"
  ON project_templates FOR SELECT
  TO authenticated
  USING (true);

-- User attempt policies
CREATE POLICY "Users can view own code attempts"
  ON user_code_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own code attempts"
  ON user_code_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own code attempts"
  ON user_code_attempts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own algorithm attempts"
  ON user_algorithm_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own algorithm attempts"
  ON user_algorithm_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own algorithm attempts"
  ON user_algorithm_attempts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own project attempts"
  ON user_project_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own project attempts"
  ON user_project_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own project attempts"
  ON user_project_attempts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_code_challenges_difficulty ON code_challenges(difficulty);
CREATE INDEX IF NOT EXISTS idx_code_challenges_category ON code_challenges(category);
CREATE INDEX IF NOT EXISTS idx_user_code_attempts_user_id ON user_code_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_algorithm_problems_difficulty ON algorithm_problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_user_algorithm_attempts_user_id ON user_algorithm_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_project_templates_difficulty ON project_templates(difficulty);
CREATE INDEX IF NOT EXISTS idx_user_project_attempts_user_id ON user_project_attempts(user_id);
