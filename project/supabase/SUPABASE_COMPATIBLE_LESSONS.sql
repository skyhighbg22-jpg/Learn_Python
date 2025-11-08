-- SUPABASE COMPATIBLE: Add New Lessons to Make Them Appear on Website
-- This version uses simple text instead of complex JSON to work in Supabase SQL Editor

-- First, add new sections
INSERT INTO sections (id, title, description, path, order_index, unlock_requirement_xp) VALUES
('section-beginner-dd', 'Python Basics - Drag & Drop', 'Learn fundamentals through hands-on drag-and-drop exercises', 'python-basics', 1, 0),
('section-beginner-puzzle', 'Python Puzzles', 'Test your knowledge with interactive puzzle games', 'python-basics', 2, 25),
('section-intermediate-dd', 'Applied Python', 'Real-world Python applications and code structure', 'applied-python', 3, 100),
('section-advanced-story', 'Advanced Stories', 'Professional scenarios and complex challenges', 'advanced-python', 4, 300)
ON CONFLICT (id) DO NOTHING;

-- Add new lessons with simple text content (no complex JSON)
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, content, estimated_minutes) VALUES

-- Beginner Drag & Drop Lessons (using content field instead of drag_drop_data)
('bd-1', 'Your First Function', 'Create your first Python function with drag-and-drop blocks', 'beginner', 15, 1, 'section-beginner-dd', 'drag-drop', '[{"question": "Arrange code blocks to create a function", "type": "drag-drop", "starter": "def __():", "solution": "def greet():\\nreturn \"Hello\""}]', 10),

('bd-2', 'Working with Variables', 'Learn to create and use Python variables', 'beginner', 18, 2, 'section-beginner-dd', 'drag-drop', '[{"question": "Arrange code to create and use variables", "type": "drag-drop", "starter": "name = \\nprint(name)", "solution": "name = \"Alex\"\\nprint(name)"}]', 12),

('bd-3', 'Python Lists', 'Learn to work with Python lists and basic operations', 'beginner', 20, 3, 'section-beginner-dd', 'drag-drop', '[{"question": "Create and use a list", "type": "drag-drop", "starter": "fruits = []\\nfruits.append()", "solution": "fruits = [\"apple\", \"banana\"]\\nfruits.append(\"orange\")"}]', 15),

-- Beginner Puzzle Lessons (using content field)
('bp-1', 'Python Basics Quiz', 'Test your fundamental Python knowledge', 'beginner', 20, 1, 'section-beginner-puzzle', 'multiple-choice', '[{"question": "What keyword defines a function?", "options": ["function", "def", "create", "make"], "correct": "def"}, {"question": "How do you print in Python 3?", "options": ["print()", "echo()", "console.log()", "display()"], "correct": "print()"}]', 8),

('bp-2', 'Data Types Challenge', 'Identify Python data types correctly', 'beginner', 25, 2, 'section-beginner-puzzle', 'multiple-choice', '[{"question": "What type is 42?", "options": ["string", "integer", "float", "boolean"], "correct": "integer"}, {"question": "What type is \"hello\"?", "options": ["string", "integer", "float", "boolean"], "correct": "string"}]', 10),

('bp-3', 'Python Syntax Quiz', 'Test your Python syntax knowledge', 'beginner', 22, 3, 'section-beginner-puzzle', 'multiple-choice', '[{"question": "How do you start a comment in Python?", "options": ["//", "#", "/*", "--"], "correct": "#"}, {"question": "What ends a Python statement?", "options": [";", ":", "newline", "."], "correct": "newline"}]', 12),

-- Intermediate Drag & Drop Lessons
('im-1', 'Dictionary Operations', 'Master Python dictionaries and key-value pairs', 'intermediate', 30, 1, 'section-intermediate-dd', 'drag-drop', '[{"question": "Create a dictionary with student info", "type": "drag-drop", "starter": "student = {}", "solution": "student = {\"name\": \"Sarah\", \"age\": 20}"}]', 15),

('im-2', 'List Comprehensions', 'Learn advanced list processing techniques', 'intermediate', 35, 2, 'section-intermediate-dd', 'drag-drop', '[{"question": "Create a list comprehension to square numbers", "type": "drag-drop", "starter": "numbers = [1,2,3,4,5]\\nsquares = ", "solution": "numbers = [1,2,3,4,5]\\nsquares = [x**2 for x in numbers]"}]', 18),

('im-3', 'Error Handling', 'Learn to handle errors with try-except blocks', 'intermediate', 32, 3, 'section-intermediate-dd', 'drag-drop', '[{"question": "Add error handling to this code", "type": "drag-drop", "starter": "x = int(user_input)", "solution": "try:\\n    x = int(user_input)\\nexcept ValueError:\\n    print(\"Invalid input\")"}]', 16),

-- Advanced Story Lessons (using simple text content)
('as-1', 'The Startup Challenge', 'Design scalable systems as a startup CTO', 'advanced', 50, 1, 'section-advanced-story', 'code', '[{"question": "Write a function to handle user registration", "type": "code", "starter": "# Write registration function", "solution": "def register_user(email, password):\\n    # Validate input\\n    # Hash password\\n    # Save to database\\n    return user_id"}]', 25),

('as-2', 'Data Science Competition', 'Compete in a machine learning challenge', 'advanced', 60, 2, 'section-advanced-story', 'code', '[{"question": "Write a function to calculate mean of a list", "type": "code", "starter": "# Calculate mean function", "solution": "def calculate_mean(numbers):\\n    return sum(numbers) / len(numbers)"}]', 30),

('as-3', 'API Development Task', 'Build a REST API endpoint', 'advanced', 55, 3, 'section-advanced-story', 'code', '[{"question": "Create a simple API endpoint", "type": "code", "starter": "# Create API endpoint", "solution": "@app.route(\"/api/users\")\\ndef get_users():\\n    users = get_all_users()\\n    return jsonify(users)"}]', 20)

ON CONFLICT (id) DO NOTHING;

-- Add new achievements (simple text)
INSERT INTO achievements (id, name, description, icon, category, requirement, xp_reward) VALUES
('new_learner', 'Fresh Start', 'Complete your first new lesson', '🌟', 'progression', 'complete_1_new_lesson', 25),
('drag_drop_master', 'Code Arranger', 'Complete 3 drag-drop lessons', '🎯', 'skill', 'complete_3_drag_drop', 75),
('puzzle_champion', 'Quiz Master', 'Score 100 points in puzzle lessons', '🏆', 'skill', 'score_100_puzzles', 50),
('story_hero', 'Narrative Explorer', 'Complete a story lesson', '📖', 'skill', 'complete_1_story', 40),
('python_explorer', 'Curious Mind', 'Try all lesson types', '🔍', 'variety', 'try_all_types', 60),
('beginner_complete', 'Python Foundation', 'Complete all beginner lessons', '🎓', 'path_completion', 'complete_all_beginner', 100),
('intermediate_complete', 'Python Practitioner', 'Complete all intermediate lessons', '⚡', 'path_completion', 'complete_all_intermediate', 150)
ON CONFLICT (id) DO NOTHING;

-- Verification: Show what was added
SELECT 'SECTIONS ADDED' as result_type, COUNT(*) as count, 'New learning sections created' as details
FROM sections
WHERE id IN ('section-beginner-dd', 'section-beginner-puzzle', 'section-intermediate-dd', 'section-advanced-story')

UNION ALL

SELECT 'LESSONS ADDED' as result_type, COUNT(*) as count, 'New interactive lessons created' as details
FROM lessons
WHERE id IN ('bd-1', 'bd-2', 'bd-3', 'bp-1', 'bp-2', 'bp-3', 'im-1', 'im-2', 'im-3', 'as-1', 'as-2', 'as-3')

UNION ALL

SELECT 'ACHIEVEMENTS ADDED' as result_type, COUNT(*) as count, 'New achievement badges created' as details
FROM achievements
WHERE id IN ('new_learner', 'drag_drop_master', 'puzzle_champion', 'story_hero', 'python_explorer', 'beginner_complete', 'intermediate_complete');

-- Show the new sections
SELECT 'NEW SECTIONS:' as info, id, title, unlock_requirement_xp
FROM sections
WHERE id IN ('section-beginner-dd', 'section-beginner-puzzle', 'section-intermediate-dd', 'section-advanced-story')
ORDER BY order_index;