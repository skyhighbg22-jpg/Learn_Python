-- 🛡️ SAFE LESSON ADDITION SCRIPT - NON-DESTRUCTIVE
-- This script ADDS lessons without deleting existing data
-- Copy and paste this into your Supabase SQL Editor

-- First, let's check what data already exists
SELECT '=== EXISTING DATA CHECK ===' as status;

-- Check existing sections
SELECT 'Existing Sections:', COUNT(*) as count FROM sections;

-- Check existing lessons
SELECT 'Existing Lessons:', COUNT(*) as count FROM lessons;

-- Show existing sections if any
SELECT 'Current sections in database:' as info;
SELECT id, title, order_index, unlock_requirement_xp FROM sections ORDER BY order_index;

-- Insert new sections ONLY if they don't already exist
INSERT INTO sections (title, description, path, order_index, unlock_requirement_xp)
SELECT 'Python Basics', 'Start your Python journey with the fundamentals', 'python-basics', 1, 0
WHERE NOT EXISTS (SELECT 1 FROM sections WHERE path = 'python-basics');

INSERT INTO sections (title, description, path, order_index, unlock_requirement_xp)
SELECT 'Variables & Data Types', 'Master variables and data types in Python', 'variables-data-types', 2, 30
WHERE NOT EXISTS (SELECT 1 FROM sections WHERE path = 'variables-data-types');

INSERT INTO sections (title, description, path, order_index, unlock_requirement_xp)
SELECT 'Control Flow', 'Learn to control your program flow with conditions', 'control-flow', 3, 80
WHERE NOT EXISTS (SELECT 1 FROM sections WHERE path = 'control-flow');

INSERT INTO sections (title, description, path, order_index, unlock_requirement_xp)
SELECT 'Functions & Modules', 'Organize your code with functions', 'functions-modules', 4, 150
WHERE NOT EXISTS (SELECT 1 FROM sections WHERE path = 'functions-modules');

INSERT INTO sections (title, description, path, order_index, unlock_requirement_xp)
SELECT 'Lists & Data Structures', 'Work with collections in Python', 'lists-data-structures', 5, 250
WHERE NOT EXISTS (SELECT 1 FROM sections WHERE path = 'lists-data-structures');

-- Now insert lessons for each section (only if they don't exist)
-- Python Basics lessons
INSERT INTO lessons (title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes)
SELECT 'Welcome to Python', 'Introduction to Python programming', 'beginner', 10, 1,
       (SELECT id FROM sections WHERE path = 'python-basics'),
       '[{"type": "text", "content": "🐍 Welcome to Python! Python is a powerful, easy-to-learn programming language."}, {"type": "multiple-choice", "question": "Who created Python?", "options": ["Guido van Rossum", "James Gosling", "Bjarne Stroustrup"], "correctAnswer": "Guido van Rossum", "explanation": "Guido van Rossum created Python in 1991."}]',
       'traditional', 12
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Welcome to Python' AND section_id = (SELECT id FROM sections WHERE path = 'python-basics'));

INSERT INTO lessons (title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes)
SELECT 'Hello World Program', 'Write your first Python program', 'beginner', 15, 2,
       (SELECT id FROM sections WHERE path = 'python-basics'),
       '[{"type": "text", "content": "The classic first program in any language is Hello World!"}, {"type": "code", "question": "Write a program that prints \\"Hello, World!\\"", "starterCode": "# Your first program\\nprint(\\"\\")", "solution": "print(\\"Hello, World!\\")", "hints": ["Use the print function", "Text goes in quotes"]}]',
       'code', 15
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Hello World Program' AND section_id = (SELECT id FROM sections WHERE path = 'python-basics'));

INSERT INTO lessons (title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes)
SELECT 'Python Syntax', 'Learn Python syntax basics', 'beginner', 12, 3,
       (SELECT id FROM sections WHERE path = 'python-basics'),
       '[{"type": "text", "content": "Python uses indentation instead of braces and semicolons."}, {"type": "multiple-choice", "question": "How do you write a comment in Python?", "options": ["// comment", "# comment", "/* comment */", "-- comment"], "correctAnswer": "# comment"}]',
       'traditional', 10
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Python Syntax' AND section_id = (SELECT id FROM sections WHERE path = 'python-basics'));

INSERT INTO lessons (title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes)
SELECT 'Running Python', 'Different ways to run Python code', 'beginner', 10, 4,
       (SELECT id FROM sections WHERE path = 'python-basics'),
       '[{"type": "text", "content": "You can run Python in interactive mode, script files, or online."}, {"type": "multiple-choice", "question": "What is the file extension for Python files?", "options": [".python", ".py", ".pt", ".txt"], "correctAnswer": ".py"}]',
       'traditional', 8
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Running Python' AND section_id = (SELECT id FROM sections WHERE path = 'python-basics'));

-- Variables & Data Types lessons
INSERT INTO lessons (title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes)
SELECT 'Creating Variables', 'Learn to create and use variables', 'beginner', 15, 1,
       (SELECT id FROM sections WHERE path = 'variables-data-types'),
       '[{"type": "text", "content": "Variables store data values. Create them with the = operator."}, {"type": "code", "question": "Create a variable named age with value 25", "starterCode": "# Create the age variable\\nage = ", "solution": "age = 25"}]',
       'code', 15
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Creating Variables' AND section_id = (SELECT id FROM sections WHERE path = 'variables-data-types'));

INSERT INTO lessons (title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes)
SELECT 'Python Data Types', 'Understanding Python data types', 'beginner', 18, 2,
       (SELECT id FROM sections WHERE path = 'variables-data-types'),
       '[{"type": "text", "content": "Python has int, float, str, bool, and more data types."}, {"type": "multiple-choice", "question": "What data type is 3.14?", "options": ["int", "float", "str", "bool"], "correctAnswer": "float", "explanation": "3.14 is a float because it has decimal places."}]',
       'traditional', 12
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Python Data Types' AND section_id = (SELECT id FROM sections WHERE path = 'variables-data-types'));

INSERT INTO lessons (title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes)
SELECT 'Type Conversion', 'Converting between data types', 'beginner', 20, 3,
       (SELECT id FROM sections WHERE path = 'variables-data-types'),
       '[{"type": "text", "content": "Use int(), float(), str() to convert between types."}, {"type": "code", "question": "Convert \\"123\\" string to integer and add 10", "starterCode": "result = int(\\"123\\") + ", "solution": "result = int(\\"123\\") + 10"}]',
       'code', 15
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Type Conversion' AND section_id = (SELECT id FROM sections WHERE path = 'variables-data-types'));

-- Control Flow lessons
INSERT INTO lessons (title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes)
SELECT 'If Statements', 'Making decisions in code', 'beginner', 20, 1,
       (SELECT id FROM sections WHERE path = 'control-flow'),
       '[{"type": "text", "content": "If statements let your program make decisions based on conditions."}, {"type": "code", "question": "Check if age is 18 or older and print \\"Adult\\"", "starterCode": "age = 20\\nif age >= 18:\\n    print(\\"\\")", "solution": "age = 20\\nif age >= 18:\\n    print(\\"Adult\\")"}]',
       'code', 18
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'If Statements' AND section_id = (SELECT id FROM sections WHERE path = 'control-flow'));

INSERT INTO lessons (title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes)
SELECT 'Comparison Operators', 'Comparing values in Python', 'beginner', 15, 2,
       (SELECT id FROM sections WHERE path = 'control-flow'),
       '[{"type": "text", "content": "Use ==, !=, >, <, >=, <= to compare values."}, {"type": "multiple-choice", "question": "What is the difference between = and ==?", "options": ["They are the same", "= assigns, == compares", "== assigns, = compares"], "correctAnswer": "= assigns, == compares"}]',
       'traditional', 10
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Comparison Operators' AND section_id = (SELECT id FROM sections WHERE path = 'control-flow'));

INSERT INTO lessons (title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes)
SELECT 'Else and Elif', 'Multiple conditions with if-elif-else', 'beginner', 22, 3,
       (SELECT id FROM sections WHERE path = 'control-flow'),
       '[{"type": "text", "content": "Use elif for additional conditions and else for the default case."}, {"type": "code", "question": "Grade system: 90+=A, 80-89=B, 70-79=C, else=F", "starterCode": "score = 85\\nif score >= 90:\\n    print(\\"A\\")\\nelif score >= 80:\\n    print(\\"\\")", "solution": "score = 85\\nif score >= 90:\\n    print(\\"A\\")\\nelif score >= 80:\\n    print(\\"B\\")\\nelif score >= 70:\\n    print(\\"C\\")\\nelse:\\n    print(\\"F\\")"}]',
       'code', 20
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Else and Elif' AND section_id = (SELECT id FROM sections WHERE path = 'control-flow'));

-- Functions & Modules lessons
INSERT INTO lessons (title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes)
SELECT 'Creating Functions', 'Learn to define and use functions', 'intermediate', 25, 1,
       (SELECT id FROM sections WHERE path = 'functions-modules'),
       '[{"type": "text", "content": "Functions are reusable blocks of code. Define them with def."}, {"type": "code", "question": "Create a function called greet that prints \\"Hello!\\"", "starterCode": "def greet():\\n    print(\\"\\")", "solution": "def greet():\\n    print(\\"Hello!\\")"}]',
       'code', 20
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Creating Functions' AND section_id = (SELECT id FROM sections WHERE path = 'functions-modules'));

INSERT INTO lessons (title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes)
SELECT 'Function Parameters', 'Passing data to functions', 'intermediate', 28, 2,
       (SELECT id FROM sections WHERE path = 'functions-modules'),
       '[{"type": "text", "content": "Parameters let you pass data into functions for processing."}, {"type": "code", "question": "Create a function add that takes two numbers and returns their sum", "starterCode": "def add(a, b):\\n    return ", "solution": "def add(a, b):\\n    return a + b"}]',
       'code', 18
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Function Parameters' AND section_id = (SELECT id FROM sections WHERE path = 'functions-modules'));

-- Lists & Data Structures lessons
INSERT INTO lessons (title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes)
SELECT 'Python Lists', 'Working with lists in Python', 'intermediate', 25, 1,
       (SELECT id FROM sections WHERE path = 'lists-data-structures'),
       '[{"type": "text", "content": "Lists are ordered, mutable collections of items in Python."}, {"type": "code", "question": "Create a list with three fruits", "starterCode": "fruits = [", "solution": "fruits = [\\"apple\\", \\"banana\\", \\"orange\\"]"}]',
       'code', 20
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Python Lists' AND section_id = (SELECT id FROM sections WHERE path = 'lists-data-structures'));

INSERT INTO lessons (title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes)
SELECT 'List Operations', 'Common list operations and methods', 'intermediate', 30, 2,
       (SELECT id FROM sections WHERE path = 'lists-data-structures'),
       '[{"type": "text", "content": "Learn to append, remove, sort, and access list elements."}, {"type": "multiple-choice", "question": "How do you add an item to the end of a list?", "options": ["list.add()", "list.append()", "list.insert()", "list.push()"], "correctAnswer": "list.append()"}]',
       'traditional', 15
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'List Operations' AND section_id = (SELECT id FROM sections WHERE path = 'lists-data-structures'));

-- Add daily challenges (non-destructive)
INSERT INTO daily_challenges (title, description, difficulty, xp_reward, date, problem)
SELECT 'Python Basics Quiz', 'Test your Python knowledge', 'easy', 40, CURRENT_DATE,
       '{"type": "quiz", "questions": [{"question": "Who created Python?", "options": ["Guido van Rossum", "James Gosling", "Bjarne Stroustrup"], "correctAnswer": "Guido van Rossum"}]}'
WHERE NOT EXISTS (SELECT 1 FROM daily_challenges WHERE date = CURRENT_DATE);

INSERT INTO daily_challenges (title, description, difficulty, xp_reward, date, problem)
SELECT 'Variables Challenge', 'Test your variable skills', 'easy', 50, CURRENT_DATE + INTERVAL '1 day',
       '{"type": "quiz", "questions": [{"question": "How do you create a variable?", "options": ["x = 5", "var x = 5", "x := 5"], "correctAnswer": "x = 5"}]}'
WHERE NOT EXISTS (SELECT 1 FROM daily_challenges WHERE date = CURRENT_DATE + INTERVAL '1 day');

INSERT INTO daily_challenges (title, description, difficulty, xp_reward, date, problem)
SELECT 'Code Challenge: Hello World', 'Write your first program', 'easy', 30, CURRENT_DATE + INTERVAL '2 days',
       '{"type": "code", "question": "Print your name to the console", "starterCode": "print(\\"\\")", "solution": "print(\\"Your Name\\")"}'
WHERE NOT EXISTS (SELECT 1 FROM daily_challenges WHERE date = CURRENT_DATE + INTERVAL '2 days');

-- Final verification
SELECT '=== FINAL VERIFICATION ===' as status;
SELECT
  s.title as section_title,
  COUNT(l.id) as lesson_count,
  s.unlock_requirement_xp,
  CASE WHEN COUNT(l.id) > 0 THEN '✅ Has Lessons' ELSE '❌ No Lessons' END as status
FROM sections s
LEFT JOIN lessons l ON s.id = l.section_id
GROUP BY s.id, s.title, s.unlock_requirement_xp
ORDER BY s.order_index;

SELECT '🎉 SAFE OPERATION COMPLETED!' as result,
       'No existing data was deleted' as safety_note,
       COUNT(*) as total_lessons_added
FROM lessons;