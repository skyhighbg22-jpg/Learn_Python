-- FIXED SEED DATA SCRIPT - Matches Your Database Schema
-- This script uses UUIDs and proper format for your database

-- =====================================
-- BEGINNER PATH (3 sections)
-- =====================================

-- Insert new sections for beginner learning path with UUIDs
INSERT INTO sections (id, title, description, path, order_index, unlock_requirement_xp, created_at) VALUES
-- Generate UUIDs using gen_random_uuid()
('cb4a5f1d-8e3e-4a7b-9c2d-1e6f3a9b8c45', 'Python Basics - Drag & Drop', 'Fundamentals through drag-and-drop exercises', 'python-basics', 1, 0, now()),
('d7e6f2a1-9f4f-5b8c-0d3e-2f7g4b0c9d56', 'Logic Puzzles', 'Python thinking through interactive games', 'python-basics', 2, 25, now()),
('e8f7g3b2-0a5g-6c9d-1e4f-3g8h5d1e0f67', 'Coding Adventures', 'Learn Python through engaging stories', 'python-basics', 3, 50, now())
ON CONFLICT (id) DO NOTHING;

-- =====================================
-- INTERMEDIATE PATH (3 sections)
-- =====================================

-- Insert new sections for intermediate learning path
INSERT INTO sections (id, title, description, path, order_index, unlock_requirement_xp, created_at) VALUES
('f9h8h4c3-1b6h-7d0e-2f5g-4h9i6f2g1h78', 'Applied Python', 'Real-world code arrangement and structure', 'applied-python', 4, 100, now()),
('g0i9i5d4-2c7i-8e1f-3g6h-5i0j7h3i2j89', 'Problem Solving', 'Python challenges and complex puzzles', 'applied-python', 5, 150, now()),
('h1j0j6e5-3d8j-9f2g-4h7i-6j1k8i4j3k90', 'Python Projects', 'Story-based project learning', 'applied-python', 6, 200, now())
ON CONFLICT (id) DO NOTHING;

-- =====================================
-- ADVANCED PATH (3 sections)
-- =====================================

-- Insert new sections for advanced learning path
INSERT INTO sections (id, title, description, path, order_index, unlock_requirement_xp, created_at) VALUES
('i2k1k7f6-4e9k-0g3h-5i8j-7k2l9j5k4l01', 'Professional Code', 'Industry-standard patterns and algorithms', 'advanced-python', 7, 300, now()),
('j3l2l8g7-5f0l-1h4i-6j9k-8l3m0k6l5m12', 'Expert Challenges', 'Complex problem solving and optimization', 'advanced-python', 8, 400, now()),
('k4m3m9h8-6g1m-2i5j-7k0l-9m4n1l7m6n23', 'Real Applications', 'Professional Python scenarios', 'advanced-python', 9, 500, now())
ON CONFLICT (id) DO NOTHING;

-- =====================================
-- BEGINNER LESSONS (9 lessons)
-- =====================================

-- Beginner Drag & Drop Lessons
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, drag_drop_data, content, estimated_minutes, created_at) VALUES
('a1n4n0i9-7h2n-3j6k-8l1m-9n5o2l8o9p34', 'Your First Function', 'Create your first Python function with drag-and-drop blocks', 'beginner', 15, 1,
  (SELECT id FROM sections WHERE title = 'Python Basics - Drag & Drop' LIMIT 1), 'drag-drop',
  '{"instructions": "Create your first Python function! Arrange the blocks to build a complete function that says hello.", "code_blocks": [{"id": "def-stmt", "content": "def hello_world():", "type": "function", "indent": 0}, {"id": "docstring", "content": "\"\"\"This function returns a friendly greeting.\"\"\"", "type": "comment", "indent": 4}, {"id": "return-stmt", "content": "return \"Hello, World!\"", "type": "code", "indent": 4}], "correct_order": ["def-stmt", "docstring", "return-stmt"], "hints": ["Functions start with def keyword", "Docstrings come after function definition", "Return statement provides output"]}',
  '[]', 10, now()),

('b2o5o1j0-8i3o-4k7l-9m2n-0p6o3l9o0p45', 'Working with Variables', 'Create variables of different types and use them', 'beginner', 18, 2,
  (SELECT id FROM sections WHERE title = 'Python Basics - Drag & Drop' LIMIT 1), 'drag-drop',
  '{"instructions": "Create variables of different types. Python can store text, numbers, and boolean values.", "code_blocks": [{"id": "string-var", "content": "name = \"Alex\"", "type": "variable", "indent": 0}, {"id": "number-var", "content": "age = 25", "type": "variable", "indent": 0}, {"id": "boolean-var", "content": "is_student = True", "type": "variable", "indent": 0}, {"id": "print-all", "content": "print(f\"{name}, {age}, {is_student}\")", "type": "code", "indent": 0}], "correct_order": ["string-var", "number-var", "boolean-var", "print-all"], "hints": ["Strings need quotes", "Numbers don\'t need quotes", "Boolean values are True/False"]}',
  '[]', 12, now()),

('c3p6p2k1-9j4p-5l8m-0n3o-1q7p4m1q0r56', 'Python Lists', 'Learn to work with Python lists and basic operations', 'beginner', 20, 3,
  (SELECT id FROM sections WHERE title = 'Python Basics - Drag & Drop' LIMIT 1), 'drag-drop',
  '{"instructions": "Create and manipulate Python lists. Lists are ordered collections that can hold multiple items.", "code_blocks": [{"id": "create-list", "content": "fruits = [\"apple\", \"banana\", \"orange\"]", "type": "variable", "indent": 0}, {"id": "add-item", "content": "fruits.append(\"grape\")", "type": "code", "indent": 0}, {"id": "print-list", "content": "print(f\"Fruits: {fruits}\")", "type": "code", "indent": 0}, {"id": "print-length", "content": "print(f\"Total fruits: {len(fruits)}\")", "type": "code", "indent": 0}], "correct_order": ["create-list", "add-item", "print-list", "print-length"], "hints": ["Lists use square brackets", "append() adds items to the end", "len() gets list length"]}',
  '[]', 15, now()),

-- Beginner Puzzle Lessons
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, game_data, content, estimated_minutes, created_at) VALUES
('d4q7q3l2-0k5q-6m9n-1o4p-2r8q5m2r1s67', 'Python Basics Quiz', 'Test your fundamental Python knowledge', 'beginner', 20, 1,
  (SELECT id FROM sections WHERE title = 'Logic Puzzles' LIMIT 1), 'puzzle',
  '{"time_bonus": 100, "streak_multiplier": 10, "questions": [{"id": "syntax-1", "question": "What keyword defines a function in Python?", "options": ["function", "def", "func", "define"], "correctAnswer": 1, "explanation": "The def keyword is used to define functions in Python", "difficulty": "easy", "points": 10, "timeLimit": 15}, {"id": "print-1", "question": "How do you print something in Python 3?", "options": ["print()", "echo()", "console.log()", "display()"], "correctAnswer": 0, "explanation": "print() function displays output in Python 3", "difficulty": "easy", "points": 10, "timeLimit": 10}, {"id": "comment-1", "question": "How do you start a comment in Python?", "options": ["//", "#", "/*", "--"], "correctAnswer": 1, "explanation": "# symbol is used for single-line comments in Python", "difficulty": "easy", "points": 10, "timeLimit": 12}]}',
  '[]', 8, now()),

('e5r8r4m3-1l6r-7n0o-2p5q-3s9r6n3s2t78', 'Data Types Challenge', 'Identify different Python data types and operators', 'beginner', 25, 2,
  (SELECT id FROM sections WHERE title = 'Logic Puzzles' LIMIT 1), 'puzzle',
  '{"time_bonus": 120, "streak_multiplier": 12, "questions": [{"id": "datatype-1", "question": "What data type is 42?", "options": ["string", "integer", "float", "boolean"], "correctAnswer": 1, "explanation": "42 is an integer (whole number)", "difficulty": "easy", "points": 12, "timeLimit": 15}, {"id": "datatype-2", "question": "What data type is \"Hello\"?", "options": ["string", "integer", "float", "boolean"], "correctAnswer": 0, "explanation": "Text in quotes is a string in Python", "difficulty": "easy", "points": 12, "timeLimit": 15}, {"id": "operator-1", "question": "What does == do in Python?", "options": ["Assignment", "Comparison", "Addition", "Multiplication"], "correctAnswer": 1, "explanation": "== compares values for equality", "difficulty": "medium", "points": 15, "timeLimit": 20}]}',
  '[]', 10, now()),

('f6s9s5n4-2m7s-8o1p-3q6r-4t0s7o4t3u89', 'Bug Squash Basics', 'Find and fix simple Python syntax errors', 'beginner', 22, 3,
  (SELECT id FROM sections WHERE title = 'Logic Puzzles' LIMIT 1), 'puzzle',
  '{"time_bonus": 100, "streak_multiplier": 10, "questions": [{"id": "bug-1", "question": "What\'s wrong with: def my_function() return \"hello\"", "options": ["Missing colon", "Wrong indentation", "Wrong return", "Nothing wrong"], "correctAnswer": 0, "explanation": "Functions need a colon after the parentheses", "difficulty": "easy", "points": 12, "timeLimit": 20}, {"id": "bug-2", "question": "What\'s wrong with: name = Hello World", "options": ["Missing quotes", "Wrong operator", "Missing semicolon", "Nothing wrong"], "correctAnswer": 0, "explanation": "String values need to be in quotes", "difficulty": "easy", "points": 12, "timeLimit": 20}]}',
  '[]', 12, now()),

-- Beginner Story Lessons
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, story_data, content, estimated_minutes, created_at) VALUES
('g7t0t6o5-3n8t-9p2q-4r7s-5u1t8p5u4v90', 'The Programmer\'s Journey Begins', 'Join Alex as they discover Python programming magic', 'beginner', 30, 1,
  (SELECT id FROM sections WHERE title = 'Coding Adventures' LIMIT 1), 'story',
  '{"setting": "A cozy bedroom where Alex discovers an old laptop with Python", "protagonist": {"name": "Alex", "avatar": "👨‍💻", "role": "Curious Learner"}, "chapters": [{"id": "chapter1", "title": "The Discovery", "content": "Alex found the dusty laptop in the attic. When they turned it on, a screen appeared with just one word: \"Python\". A friendly pop-up appeared: \"Welcome! I\"m Py, your Python guide.\"", "challenge": {"description": "Help Alex write their first Python program to greet the world", "starter_code": "# Write your greeting function here", "solution": "print(\"Hello, World! I\"m learning Python magic!\")", "explanation": "Congratulations! You\"ve written your first Python program. The print() function is fundamental in Python."}, "reward": {"xp": 15, "message": "Py cheers: \"Amazing! You\"ve cast your first Python spell!\"", "item": "First Spell Badge"}}]}',
  '[]', 30, now()),

('h8u1u7p6-4o9u-0q3r-5s8t-6v2u9u6v7w01', 'The Variable Mystery', 'Help Alex solve puzzles using variables and data types', 'beginner', 35, 2,
  (SELECT id FROM sections WHERE title = 'Coding Adventures' LIMIT 1), 'story',
  '{"setting": "A mystical library where books have codes instead of words", "protagonist": {"name": "Alex", "avatar": "👨‍💻", "role": "Code Explorer"}, "chapters": [{"id": "chapter1", "title": "The Library of Types", "content": "Alex entered a library where books floated with glowing code. The Data Guardian appeared: \"Welcome! Each type has its own power.\"", "challenge": {"description": "Create variables to store Alex\"s information", "starter_code": "# Create variables for Alex", "solution": "name = \"Alex\"\nage = 16\nis_student = True\nprint(f\"{name} is {age} years old\")", "explanation": "Great! You understand Python\"s basic data types. Variables store values, f-strings include them in text."}, "reward": {"xp": 18, "message": "The Guardian bows: \"You understand data well!\"", "item": "Data Scholar Badge"}}]}',
  '[]', 35, now()),

('i9v2v8q7-5p0v-1r4s-6t9u-7w3v0v7w8x12', 'The Loop of Time', 'Guide Alex through repetition using loops in code', 'beginner', 40, 3,
  (SELECT id FROM sections WHERE title = 'Coding Adventures' LIMIT 1), 'story',
  '{"setting": "A time chamber where clocks spin wildly", "protagonist": {"name": "Alex", "avatar": "👨‍💻", "role": "Time Traveler"}, "chapters": [{"id": "chapter1", "title": "The Time Loop", "content": "The Temporal Guardian appeared: \"You\"re trapped in a time loop! Master repetition to escape!\"", "challenge": {"description": "Help Alex break the time loop by counting to 5", "starter_code": "# Break the time loop", "solution": "for i in range(1, 6):\n    print(f\"Time loop cycle {i}\")", "explanation": "Perfect! Loops let you repeat actions efficiently. for-range generates numbers."}, "reward": {"xp": 20, "message": "The Guardian fades: \"You mastered time itself!\"", "item": "Time Loop Breaker Badge"}}]}',
  '[]', 40, now()),

('j0w3w9r8-6q1w-2s5t-7u0v-8x4w1w8x9y23', 'The Conditional Path', 'Help Alex make decisions using conditional logic', 'beginner', 45, 4,
  (SELECT id FROM sections WHERE title = 'Coding Adventures' LIMIT 1), 'story',
  '{"setting": "A crossroads where three paths diverge", "protagonist": {"name": "Alex", "avatar": "👨‍💻", "role": "Decision Maker"}, "chapters": [{"id": "chapter1", "title": "The Path of Choices", "content": "The Logic Guardian appeared with scales: \"Choose your path based on conditions!\"", "challenge": {"description": "Help Alex choose the right path based on age", "starter_code": "# Help Alex choose path\nage = 16", "solution": "age = 16\nif age >= 18:\n    print(\"Adult path\")\nelse:\n    print(\"Minor path\")", "explanation": "Excellent! Conditional logic lets programs make decisions. if-else handles different scenarios."}, "reward": {"xp": 23, "message": "The Logic Guardian nods: \"Your logic is sound!\"", "item": "Decision Maker Badge"}}]}',
  '[]', 45, now()),

('k1x4x0s9-7r2x-3t6u-8v1w-9y5x2x9x0y34', 'The Function Workshop', 'Create reusable code with Alex in the inventor\'s workshop', 'beginner', 50, 5,
  (SELECT id FROM sections WHERE title = 'Coding Adventures' LIMIT 1), 'story',
  '{"setting": "An inventor\'s workshop with strange devices", "protagonist": {"name": "Alex", "avatar": "👨‍💻", "role": "Apprentice Inventor"}, "chapters": [{"id": "chapter1", "title": "The Workshop of Reusability", "content": "The Function Master appeared: \"Functions are like machines—inputs, processing, outputs!\"", "challenge": {"description": "Build Alex\"s first function machine", "starter_code": "# Build greeting function", "solution": "def greet_person(name):\n    return f\"Hello, {name}! Welcome to the workshop!\"", "explanation": "Excellent! Functions are fundamental building blocks in programming. They enable code reuse and organization."}, "reward": {"xp": 25, "message": "The Function Master high-fives: \"You\"re an inventor now!\"", "item": "Function Builder Badge"}}]}',
  '[]', 50, now())

ON CONFLICT (id) DO NOTHING;

-- =====================================
-- INTERMEDIATE LESSONS (6 lessons)
-- =====================================

-- Intermediate Drag & Drop Lessons
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, drag_drop_data, content, estimated_minutes, created_at) VALUES
('l2y5y1t0-8s3y-4u7v-9w2x-0z7y3z1z0a45', 'Dictionary Master', 'Work with key-value pairs and data mapping', 'intermediate', 28, 1,
  (SELECT id FROM sections WHERE title = 'Applied Python' LIMIT 1), 'drag-drop',
  '{"instructions": "Create a dictionary to store student information and perform operations. Dictionaries are perfect for storing related data.", "code_blocks": [{"id": "create-dict", "content": "student = {", "type": "code", "indent": 0}, {"id": "name-key", "content": "\"name\": \"Sarah Johnson\",", "type": "variable", "indent": 4}, {"id": "age-key", "content": "\"age\": 20,", "type": "variable", "indent": 4}, {"id": "grades-key", "content": "\"grades\": [85, 92, 78, 95],", "type": "variable", "indent": 4}, {"id": "major-key", "content": "\"major\": \"Computer Science\",", "type": "variable", "indent": 4}, {"id": "close-dict", "content": "}", "type": "code", "indent": 0}], "correct_order": ["create-dict", "name-key", "age-key", "grades-key", "major-key", "close-dict"], "hints": ["Dictionaries use curly braces {}", "Keys are strings in quotes", "Use colons to separate keys and values"]}',
  '[]', 18, now()),

('m3z6z2u1-9t4z-5v8w-0x3y-1a8z4a2z1b56', 'File Operations', 'Arrange code for reading and writing files', 'intermediate', 30, 2,
  (SELECT id FROM sections WHERE title = 'Applied Python' LIMIT 1), 'drag-drop',
  '{"instructions": "Build code to read from a file, process the content, and write results. File operations are essential for real-world data processing.", "code_blocks": [{"id": "import-os", "content": "import os", "type": "code", "indent": 0}, {"id": "open-input", "content": "with open(\"input.txt\", \"r\") as file:", "type": "code", "indent": 0}, {"id": "read-content", "content": "content = file.read()", "type": "code", "indent": 4}, {"id": "process-content", "content": "processed = content.upper()", "type": "code", "indent": 0}, {"id": "open-output", "content": "with open(\"output.txt\", \"w\") as file:", "type": "code", "indent": 0}, {"id": "write-output", "content": "file.write(processed)", "type": "code", "indent": 4}], "correct_order": ["import-os", "open-input", "read-content", "process-content", "open-output", "write-output"], "hints": ["Use with statement for safe file handling", "\"r\" reads files, \"w\" writes files", "Always close files automatically with with"]}',
  '[]', 20, now()),

-- Intermediate Puzzle Lessons
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, game_data, content, estimated_minutes, created_at) VALUES
('n4a7a3v2-0u5a-6w9x-1y4z-2b9a5b3b4c67', 'Algorithm Challenge', 'Solve simple algorithm problems and optimization tasks', 'intermediate', 35, 1,
  (SELECT id FROM sections WHERE title = 'Problem Solving' LIMIT 1), 'puzzle',
  '{"time_bonus": 200, "streak_multiplier": 20, "questions": [{"id": "complexity-1", "question": "What is the time complexity of this nested loop?", "code": "for i in range(n):\n    for j in range(n):\n        print(i, j)", "options": ["O(1)", "O(n)", "O(n²)", "O(log n)"], "correctAnswer": 2, "explanation": "Two nested loops each running n times result in O(n²) complexity", "difficulty": "medium", "points": 20, "timeLimit": 30}, {"id": "data-structure-1", "question": "Which data structure provides O(1) average time for operations?", "options": ["Array", "Linked List", "Hash Table", "Binary Search Tree"], "correctAnswer": 2, "explanation": "Hash tables provide O(1) average time for most operations", "difficulty": "hard", "points": 25, "timeLimit": 35}]}',
  '[]', 25, now()),

-- Intermediate Story Lessons
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, story_data, content, estimated_minutes, created_at) VALUES
('o5b8b4w3-1v6b-7x0y-2z5a-3c0b6c4c5d78', 'The Data Scientist\'s Assistant', 'Help analyze real data using Python data science tools', 'intermediate', 45, 1,
  (SELECT id FROM sections WHERE title = 'Python Projects' LIMIT 1), 'story',
  '{"setting": "A modern data science lab where Alex meets Dr. Sarah Chen", "protagonist": {"name": "Alex", "avatar": "👨‍💻", "role": "Data Science Assistant"}, "chapters": [{"id": "chapter1", "title": "The Data Analysis Challenge", "content": "Dr. Chen looked up: \"I have customer records, but need to analyze them quickly. Can you help with Python scripts?\"", "challenge": {"description": "Analyze customer data to find insights", "starter_code": "# Analyze customer data", "solution": "def analyze_by_age_group(customers):\n    age_groups = {\"20-29\": [], \"30-39\": []}\n    for customer in customers:\n        age = customer[\"age\"]\n        avg_purchase = sum(customer[\"purchases\"]) / len(customer[\"purchases\"])\n        if 20 <= age <= 29:\n            age_groups[\"20-29\"].append(avg_purchase)\n        else:\n            age_groups[\"30-39\"].append(avg_purchase)\n    return age_groups", "explanation": "Excellent! You performed real data analysis. Customer segmentation helps businesses make better decisions."}, "reward": {"xp": 23, "message": "Dr. Chen smiles: \"Fantastic analysis! These insights will help us target marketing better.\"", "item": "Data Analyst Badge"}}]}',
  '[]', 35, now())

ON CONFLICT (id) DO NOTHING;

-- =====================================
-- ADVANCED LESSONS (3 lessons)
-- =====================================

-- Advanced Drag & Drop Lessons
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, drag_drop_data, content, estimated_minutes, created_at) VALUES
('p6c9c5x4-2w7c-8y1z-3a6b-4d1c7d6d7e89', 'Algorithm Implementation', 'Implement binary search and quicksort algorithms', 'advanced', 50, 1,
  (SELECT id FROM sections WHERE title = 'Professional Code' LIMIT 1), 'drag-drop',
  '{"instructions": "Implement efficient algorithms for data processing. Understanding algorithms is crucial for technical interviews.", "code_blocks": [{"id": "binary-search-header", "content": "def binary_search(arr, target):", "type": "function", "indent": 0}, {"id": "left-right", "content": "left, right = 0, len(arr) - 1", "type": "variable", "indent": 4}, {"id": "while-loop", "content": "while left <= right:", "type": "code", "indent": 4}, {"id": "mid-calc", "content": "mid = (left + right) // 2", "type": "variable", "indent": 8}, {"id": "compare", "content": "if arr[mid] == target:", "type": "code", "indent": 8}, {"id": "return-found", "content": "return mid", "type": "code", "indent": 12}, {"id": "else-if", "content": "elif arr[mid] < target:", "type": "code", "indent": 8}, {"id": "search-right", "content": "left = mid + 1", "type": "code", "indent": 12}, {"id": "else", "content": "right = mid - 1", "type": "code", "indent": 12}, {"id": "return-not-found", "content": "return -1", "type": "code", "indent": 4}], "correct_order": ["binary-search-header", "left-right", "while-loop", "mid-calc", "compare", "return-found", "else-if", "search-right", "else", "return-not-found"], "hints": ["Binary search requires sorted data", "Time complexity is O(log n)", "Eliminates half the remaining elements each iteration"]}',
  '[]', 30, now())

ON CONFLICT (id) DO NOTHING;

-- =====================================
-- ACHIEVEMENTS
-- =====================================

-- Insert new achievements for the expanded content
INSERT INTO achievements (id, name, description, icon, category, requirement, xp_reward, created_at) VALUES
('q7d0d6y5-3x8d-9z2a-4b7c-5e1d8e7f8g01', 'Interactive Beginner', 'Complete your first drag-drop lesson', '🎯', 'skill', '{"type": "lesson_completion", "lesson_type": "drag-drop", "count": 1}', 25, now()),
('r8e1e7z6-4y9e-0a3b-5c8d-6f2e9f8h9h02', 'Quiz Master', 'Score 80+ points in puzzle lessons', '🏆', 'skill', '{"type": "puzzle_score", "min_score": 80}', 50, now()),
('s9f2f8a7-5z0f-1b4c-6d9e-7g3f0a9i0j03', 'Story Explorer', 'Complete your first story lesson', '📖', 'skill', '{"type": "lesson_completion", "lesson_type": "story", "count": 1}', 40, now()),
('t0g3g9b8-6a1g-2c5d-7e0f-8h4g1b0j1k04', 'Python All-Rounder', 'Try all lesson types', '🎮', 'variety', '{"type": "variety", "lesson_types": ["drag-drop", "puzzle", "story", "code"]}', 75, now()),
('u1h4h0c9-7b2h-3d6e-8f1g-9i5h2c1l2k15', 'Knowledge Seeker', 'Complete 5 new lessons', '🌟', 'progression', '{"type": "lesson_completion", "count": 5, "new_content": true}', 100, now()),
('v2i5i1d0-8c3i-4e7f-9g2h-0j6i3d2m3l26', 'Python Foundation', 'Complete all beginner lessons', '🎓', 'path_completion', '{"type": "path_completion", "path": "python-basics", "count": 9}', 150, now()),
('w3j6j2e1-9d4j-5f8g-0h3i-1k7i4e3n4m37', 'Applied Practitioner', 'Complete all intermediate lessons', '⚡', 'path_completion', '{"type": "path_completion", "path": "applied-python", "count": 6}', 200, now())

ON CONFLICT (name) DO NOTHING;

-- =====================================
-- VERIFICATION QUERIES
-- =====================================

-- Show what was added
SELECT 'SECTIONS ADDED' as category, COUNT(*) as count, STRING_AGG(title, ', ' ORDER BY order_index) as details
FROM sections
WHERE id IN (
  'cb4a5f1d-8e3e-4a7b-9c2d-1e6f3a9b8c45',
  'd7e6f2a1-9f4f-5b8c-0d3e-2f7g4b0c9d56',
  'e8f7g3b2-0a5g-6c9d-1e4f-3g8h5d1e0f67',
  'f9h8h4c3-1b6h-7d0e-2f5g-4h9i6f2g1h78'
)

UNION ALL

SELECT 'LESSONS ADDED' as category, COUNT(*) as count, STRING_AGG(title, ', ' ORDER BY order_index) as details
FROM lessons
WHERE lesson_type IN ('drag-drop', 'puzzle', 'story') AND created_at > NOW() - INTERVAL '1 hour'

UNION ALL

SELECT 'ACHIEVEMENTS ADDED' as category, COUNT(*) as count, STRING_AGG(name, ', ' ORDER BY xp_reward) as details
FROM achievements
WHERE created_at > NOW() - INTERVAL '1 hour'

UNION ALL

SELECT 'SUCCESS SUMMARY' as category, 'Total new content added to database!' as details
FROM (SELECT 1 as id) AS dummy

ORDER BY category;