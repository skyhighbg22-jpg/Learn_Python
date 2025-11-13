-- 🔧 FIXED LESSON INSERTION SCRIPT - JSON SYNTAX CORRECTED
-- Run this in your Supabase SQL Editor

-- Clear existing data safely
DELETE FROM user_lesson_progress;
DELETE FROM lessons;
DELETE FROM sections;

-- Insert sections
INSERT INTO sections (id, title, description, path, order_index, unlock_requirement_xp) VALUES
('00000000-0000-0000-0000-000000000001', 'Python Basics', 'Start your Python journey with the fundamentals', 'python-basics', 1, 0),
('00000000-0000-0000-0000-000000000002', 'Variables & Data Types', 'Master variables and data types in Python', 'variables-data-types', 2, 30),
('00000000-0000-0000-0000-000000000003', 'Control Flow', 'Learn to control your program flow with conditions', 'control-flow', 3, 80),
('00000000-0000-0000-0000-000000000004', 'Functions & Modules', 'Organize your code with functions', 'functions-modules', 4, 150),
('00000000-0000-0000-0000-000000000005', 'Lists & Data Structures', 'Work with collections in Python', 'lists-data-structures', 5, 250);

-- Insert lessons with proper JSON escaping
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
('10000000-0000-0000-0000-000000000001', 'Welcome to Python', 'Introduction to Python programming', 'beginner', 10, 1, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "🐍 Welcome to Python! Python is a powerful, easy-to-learn programming language."}, {"type": "multiple-choice", "question": "Who created Python?", "options": ["Guido van Rossum", "James Gosling", "Bjarne Stroustrup"], "correctAnswer": "Guido van Rossum", "explanation": "Guido van Rossum created Python in 1991."}]',
'traditional', 12),

('10000000-0000-0000-0000-000000000002', 'Hello World Program', 'Write your first Python program', 'beginner', 15, 2, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "The classic first program in any language is Hello World!"}, {"type": "code", "question": "Write a program that prints Hello World", "starterCode": "# Your first program\nprint()", "solution": "print(\"Hello World\")", "hints": ["Use the print function", "Text goes in quotes"]}]',
'code', 15),

('10000000-0000-0000-0000-000000000003', 'Python Syntax', 'Learn Python syntax basics', 'beginner', 12, 3, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "Python uses indentation instead of braces and semicolons."}, {"type": "multiple-choice", "question": "How do you write a comment in Python?", "options": ["// comment", "# comment", "/* comment */", "-- comment"], "correctAnswer": "# comment"}]',
'traditional', 10),

('10000000-0000-0000-0000-000000000004', 'Running Python', 'Different ways to run Python code', 'beginner', 10, 4, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "You can run Python in interactive mode, script files, or online."}, {"type": "multiple-choice", "question": "What is the file extension for Python files?", "options": [".python", ".py", ".pt", ".txt"], "correctAnswer": ".py"}]',
'traditional', 8),

('20000000-0000-0000-0000-000000000001', 'Creating Variables', 'Learn to create and use variables', 'beginner', 15, 1, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Variables store data values. Create them with the = operator."}, {"type": "code", "question": "Create a variable named age with value 25", "starterCode": "# Create the age variable\nage = ", "solution": "age = 25"}]',
'code', 15),

('20000000-0000-0000-0000-000000000002', 'Python Data Types', 'Understanding Python data types', 'beginner', 18, 2, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Python has int, float, str, bool, and more data types."}, {"type": "multiple-choice", "question": "What data type is 3.14?", "options": ["int", "float", "str", "bool"], "correctAnswer": "float", "explanation": "3.14 is a float because it has decimal places."}]',
'traditional', 12),

('20000000-0000-0000-0000-000000000003', 'Type Conversion', 'Converting between data types', 'beginner', 20, 3, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Use int(), float(), str() to convert between types."}, {"type": "code", "question": "Convert string 123 to integer and add 10", "starterCode": "result = int(\"123\") + ", "solution": "result = int(\"123\") + 10"}]',
'code', 15),

('30000000-0000-0000-0000-000000000001', 'If Statements', 'Making decisions in code', 'beginner', 20, 1, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "If statements let your program make decisions based on conditions."}, {"type": "code", "question": "Check if age is 18 or older and print Adult", "starterCode": "age = 20\nif age >= 18:\n    print()", "solution": "age = 20\nif age >= 18:\n    print(\"Adult\")"}]',
'code', 18),

('30000000-0000-0000-0000-000000000002', 'Comparison Operators', 'Comparing values in Python', 'beginner', 15, 2, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Use ==, !=, >, <, >=, <= to compare values."}, {"type": "multiple-choice", "question": "What is the difference between = and ==?", "options": ["They are the same", "= assigns, == compares", "== assigns, = compares"], "correctAnswer": "= assigns, == compares"}]',
'traditional', 10),

('30000000-0000-0000-0000-000000000003', 'Else and Elif', 'Multiple conditions with if-elif-else', 'beginner', 22, 3, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Use elif for additional conditions and else for the default case."}, {"type": "code", "question": "Grade system: 90+=A, 80-89=B, 70-79=C, else=F", "starterCode": "score = 85\nif score >= 90:\n    print(\"A\")\nelif score >= 80:\n    print()", "solution": "score = 85\nif score >= 90:\n    print(\"A\")\nelif score >= 80:\n    print(\"B\")\nelif score >= 70:\n    print(\"C\")\nelse:\n    print(\"F\")"}]',
'code', 20);

-- Add daily challenges
DELETE FROM daily_challenges;
INSERT INTO daily_challenges (title, description, difficulty, xp_reward, date, problem) VALUES
('Python Basics Quiz', 'Test your Python knowledge', 'easy', 40, CURRENT_DATE,
 '{"type": "quiz", "questions": [{"question": "Who created Python?", "options": ["Guido van Rossum", "James Gosling", "Bjarne Stroustrup"], "correctAnswer": "Guido van Rossum"}]}'),

('Variables Challenge', 'Test your variable skills', 'easy', 50, CURRENT_DATE + INTERVAL '1 day',
 '{"type": "quiz", "questions": [{"question": "How do you create a variable?", "options": ["x = 5", "var x = 5", "x := 5"], "correctAnswer": "x = 5"}]}'),

('Code Challenge: Hello World', 'Write your first program', 'easy', 30, CURRENT_DATE + INTERVAL '2 days',
 '{"type": "code", "question": "Print your name to the console", "starterCode": "print()", "solution": "print(\"Your Name\")"}');

SELECT 'SUCCESS: Lessons added with fixed JSON syntax' as message,
       COUNT(*) as total_lessons
FROM lessons;