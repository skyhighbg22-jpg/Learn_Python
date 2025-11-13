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

-- Insert comprehensive sections with more content
INSERT INTO sections (title, description, path, order_index, unlock_requirement_xp) VALUES
('Python Basics', 'Learn the fundamentals of Python programming', 'python-basics', 1, 0),
('Variables & Data Types', 'Understanding how to store and manipulate data', 'variables-data-types', 2, 30),
('Control Flow', 'Making decisions and controlling program flow', 'control-flow', 3, 80),
('Functions & Modules', 'Organizing code with functions and modules', 'functions-modules', 4, 150),
('Lists & Data Structures', 'Working with collections and data structures', 'lists-data-structures', 5, 250),
('Loops & Iteration', 'Repeating actions with loops', 'loops-iteration', 6, 350),
('String Operations', 'Manipulating text and strings', 'string-operations', 7, 450),
('File Operations', 'Reading from and writing to files', 'file-operations', 8, 550),
('Error Handling', 'Dealing with errors and exceptions', 'error-handling', 9, 650),
('Object-Oriented Programming', 'Working with classes and objects', 'oop', 10, 800)
ON CONFLICT DO NOTHING;

-- Insert comprehensive lesson content for Python Basics section
INSERT INTO lessons (title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
('Welcome to Python', 'Introduction to Python programming and its history', 'beginner', 10, 1,
 (SELECT id FROM sections WHERE path = 'python-basics'),
 '[
   {
     "type": "text",
     "content": "🐍 Welcome to Python Programming!\n\nPython is a high-level, interpreted programming language created by Guido van Rossum and first released in 1991. It\'s known for its simple, readable syntax and powerful capabilities."
   },
   {
     "type": "text",
     "content": "Why learn Python?\n• Easy to learn and read\n• Versatile and powerful\n• Large community and libraries\n• Great for beginners and experts\n• Used in web development, data science, AI, and more"
   },
   {
     "type": "multiple-choice",
     "question": "Who created Python?",
     "options": ["Guido van Rossum", "James Gosling", "Bjarne Stroustrup", "Dennis Ritchie"],
     "correctAnswer": "Guido van Rossum",
     "explanation": "Guido van Rossum created Python and released it in 1991. He named it after the British comedy group Monty Python."
   },
   {
     "type": "multiple-choice",
     "question": "What year was Python first released?",
     "options": ["1989", "1991", "1995", "2000"],
     "correctAnswer": "1991",
     "explanation": "Python was first released in 1991, though development began in 1989."
   }
 ]',
 'traditional', 12),

('Your First Python Program', 'Write and run your first Python code', 'beginner', 15, 2,
 (SELECT id FROM sections WHERE path = 'python-basics'),
 '[
   {
     "type": "text",
     "content": "Let\'s write your first Python program! The traditional first program is called \"Hello, World!\" - it simply displays a greeting message."
   },
   {
     "type": "code",
     "question": "Write a program that prints \"Hello, World!\" to the console",
     "starterCode": "# Your first Python program\nprint()",
     "solution": "print(\"Hello, World!\")",
     "testCases": [
       {"input": "", "expectedOutput": "Hello, World!"}
     ],
     "hints": [
       "Use the print() function to display text",
       "Text in Python needs to be in quotes",
       "Don\'t forget the parentheses after print"
     ]
   },
   {
     "type": "text",
     "content": "Great job! The print() function is one of the most fundamental functions in Python. It displays output to the console."
   }
 ]',
 'code', 15),

('Python Syntax Basics', 'Understanding Python syntax and basic rules', 'beginner', 12, 3,
 (SELECT id FROM sections WHERE path = 'python-basics'),
 '[
   {
     "type": "text",
     "content": "Python has a clean, readable syntax. Here are the key rules to remember:\n\n1. Indentation matters - Python uses whitespace to define code blocks\n2. No semicolons needed at the end of statements\n3. Comments start with #\n4. Variables are created by assignment"
   },
   {
     "type": "multiple-choice",
     "question": "How do you write a comment in Python?",
     "options": ["// This is a comment", "# This is a comment", "/* This is a comment */", "-- This is a comment"],
     "correctAnswer": "# This is a comment",
     "explanation": "Python uses the # symbol for single-line comments."
   },
   {
     "type": "multiple-choice",
     "question": "True or False: Python uses semicolons to end statements",
     "options": ["True", "False"],
     "correctAnswer": "False",
     "explanation": "Python does not require semicolons at the end of statements, making the code cleaner and more readable."
   }
 ]',
 'traditional', 10),

('Running Python Programs', 'Different ways to run Python code', 'beginner', 10, 4,
 (SELECT id FROM sections WHERE path = 'python-basics'),
 '[
   {
     "type": "text",
     "content": "There are several ways to run Python code:\n\n1. **Interactive Mode**: Type python in terminal and run code line by line\n2. **Script Files**: Save code in .py files and run them\n3. **IDE**: Use code editors like VS Code, PyCharm\n4. **Online**: Use online Python interpreters"
   },
   {
     "type": "multiple-choice",
     "question": "What is the file extension for Python script files?",
     "options": [".python", ".py", ".pt", ".txt"],
     "correctAnswer": ".py",
     "explanation": "Python script files use the .py extension."
   }
 ]',
 'traditional', 8)
ON CONFLICT DO NOTHING;

-- Insert lessons for Variables & Data Types section
INSERT INTO lessons (title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
('Creating Variables', 'Learn how to create and use variables in Python', 'beginner', 15, 1,
 (SELECT id FROM sections WHERE path = 'variables-data-types'),
 '[
   {
     "type": "text",
     "content": "Variables are containers for storing data values. In Python, you create a variable by assigning a value to it using the equals sign (=)."
   },
   {
     "type": "text",
     "content": "Variable naming rules:\n• Can contain letters, numbers, and underscores\n• Cannot start with a number\n• Cannot use Python keywords\n• Case-sensitive (name and Name are different)"
   },
   {
     "type": "code",
     "question": "Create a variable named \"age\" and assign it the value 25",
     "starterCode": "# Create the age variable here\n\nprint(age)",
     "solution": "age = 25\nprint(age)",
     "testCases": [
       {"input": "", "expectedOutput": "25"}
     ],
     "hints": [
       "Use the assignment operator (=) to create variables",
       "Variable names should be descriptive",
       "Remember to print the variable to see the result"
     ]
   },
   {
     "type": "multiple-choice",
     "question": "Which of these is a valid variable name?",
     "options": ["2ndPlace", "second_place", "second-place", "second place"],
     "correctAnswer": "second_place",
     "explanation": "Variable names cannot start with numbers or contain hyphens/spaces, but can use underscores."
   }
 ]',
 'code', 15),

('Python Data Types', 'Understanding different data types in Python', 'beginner', 18, 2,
 (SELECT id FROM sections WHERE path = 'variables-data-types'),
 '[
   {
     "type": "text",
     "content": "Python has several built-in data types:\n\n**Numeric Types:**\n• int: Whole numbers (1, 42, -7)\n• float: Decimal numbers (3.14, -0.5, 2.0)\n\n**Text Types:**\n• str: Text strings (\"Hello\", \"Python 3.9\")\n\n**Boolean Type:**\n• bool: True or False values\n\n**Sequence Types:**\n• list: Ordered, changeable collections\n• tuple: Ordered, unchangeable collections"
   },
   {
     "type": "multiple-choice",
     "question": "What data type would 3.14 be in Python?",
     "options": ["int", "float", "str", "bool"],
     "correctAnswer": "float",
     "explanation": "3.14 is a float because it has decimal places."
   },
   {
     "type": "code",
     "question": "Create a string variable named \"greeting\" with the value \"Hello Python\"",
     "starterCode": "# Create the greeting variable\n\nprint(type(greeting))",
     "solution": "greeting = \"Hello Python\"\nprint(type(greeting))",
     "testCases": [
       {"input": "", "expectedOutput": "<class \'str\'>"}
     ],
     "hints": [
       "Strings must be enclosed in quotes",
       "You can use single or double quotes",
       "The type() function shows the data type"
     ]
   }
 ]',
 'traditional', 12),

('Type Conversion', 'Converting between different data types', 'beginner', 20, 3,
 (SELECT id FROM sections WHERE path = 'variables-data-types'),
 '[
   {
     "type": "text",
     "content": "Sometimes you need to convert data from one type to another. Python provides built-in functions for type conversion:\n\n• int(): Convert to integer\n• float(): Convert to floating point\n• str(): Convert to string\n• bool(): Convert to boolean"
   },
   {
     "type": "code",
     "question": "Convert the string \"123\" to an integer and add 10 to it",
     "starterCode": "number_str = \"123\"\n# Convert and add 10\nresult = ",
     "solution": "number_str = \"123\"\nresult = int(number_str) + 10",
     "testCases": [
       {"input": "", "expectedOutput": "133"}
     ],
     "hints": [
       "Use the int() function to convert string to integer",
       "You can perform arithmetic operations after conversion"
     ]
   }
 ]',
 'code', 15)
ON CONFLICT DO NOTHING;

-- Insert lessons for Control Flow section
INSERT INTO lessons (title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
('If Statements', 'Making decisions in your code with conditional logic', 'beginner', 20, 1,
 (SELECT id FROM sections WHERE path = 'control-flow'),
 '[
   {
     "type": "text",
     "content": "If statements allow your program to make decisions. They execute different code blocks based on whether a condition is True or False."
   },
   {
     "type": "text",
     "content": "Basic syntax:\n```python\nif condition:\n    # Code to execute if condition is True\nelif another_condition:\n    # Code to execute if another_condition is True\nelse:\n    # Code to execute if no conditions are True\n```"
   },
   {
     "type": "code",
     "question": "Write an if statement that checks if age is 18 or older and prints \"You can vote\"",
     "starterCode": "age = 20\n# Write your if statement here",
     "solution": "age = 20\nif age >= 18:\n    print(\"You can vote\")",
     "testCases": [
       {"input": "", "expectedOutput": "You can vote"}
     ],
     "hints": [
       "Use the >= operator for \"greater than or equal to\"",
       "Remember the colon (:) after the condition",
       "Indent the code inside the if block"
     ]
   }
 ]',
 'code', 18),

('Comparison Operators', 'Using operators to compare values', 'beginner', 15, 2,
 (SELECT id FROM sections WHERE path = 'control-flow'),
 '[
   {
     "type": "text",
     "content": "Comparison operators compare two values and return True or False:\n\n• == : Equal to\n• != : Not equal to\n• > : Greater than\n• < : Less than\n• >= : Greater than or equal to\n• <= : Less than or equal to"
   },
   {
     "type": "multiple-choice",
     "question": "What is the difference between = and ==?",
     "options": ["They are the same", "= assigns a value, == compares values", "== assigns a value, = compares values", "Neither is valid in Python"],
     "correctAnswer": "= assigns a value, == compares values",
     "explanation": "= is the assignment operator (creates variables), while == is the equality comparison operator."
   }
 ]',
 'traditional', 10),

('Else and Elif', 'Handling multiple conditions with else and elif', 'beginner', 22, 3,
 (SELECT id FROM sections WHERE path = 'control-flow'),
 '[
   {
     "type": "text",
     "content": "When you have multiple conditions, you can use if-elif-else chains:\n\n• if: First condition to check\n• elif: Additional conditions (can have multiple)\n• else: Default case when no conditions are met"
   },
   {
     "type": "code",
     "question": "Write a grading program that prints A for 90+, B for 80-89, C for 70-79, or F for below 70",
     "starterCode": "score = 85\n# Write your if-elif-else chain",
     "solution": "score = 85\nif score >= 90:\n    print(\"A\")\nelif score >= 80:\n    print(\"B\")\nelif score >= 70:\n    print(\"C\")\nelse:\n    print(\"F\")",
     "testCases": [
       {"input": "", "expectedOutput": "B"}
     ],
     "hints": [
       "Start with the highest grade and work down",
       "Use elif for the middle ranges",
       "Use else for the lowest range"
     ]
   }
 ]',
 'code', 20)
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