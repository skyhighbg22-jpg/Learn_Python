-- QUICK SQL FIX - Add lessons that will work with your database
-- This script uses simple, working SQL that matches your schema

-- First, let's add some new sections with simple text IDs
INSERT INTO sections (id, title, description, path, order_index, unlock_requirement_xp, created_at) VALUES
('python-basics-dd', 'Python Basics - Drag & Drop', 'Learn fundamentals through hands-on exercises', 'python-basics', 10, 0, NOW()),
('python-basics-puzzle', 'Python Puzzles', 'Test your knowledge with interactive games', 'python-basics', 11, 25, NOW()),
('applied-python-dd', 'Applied Python', 'Real-world code examples and projects', 'applied-python', 12, 100, NOW()),
('advanced-python-story', 'Advanced Python Stories', 'Professional scenarios and challenges', 'advanced-python', 13, 300, NOW())
ON CONFLICT DO NOTHING;

-- Now add some new lessons - using text IDs that match what your database allows
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, content, estimated_minutes, created_at) VALUES

-- Drag & Drop Lessons
('dd-1', 'Your First Function', 'Create your first Python function with drag-and-drop blocks', 'beginner', 15, 1, 'python-basics-dd', 'drag-drop', '[{"question": "Create a Python function", "type": "drag-drop"}]', 10, NOW()),
('dd-2', 'Working with Variables', 'Learn to create and use Python variables', 'beginner', 18, 2, 'python-basics-dd', 'drag-drop', '[{"question": "Create variables of different types", "type": "drag-drop"}]', 12, NOW()),
('dd-3', 'Python Lists', 'Work with Python lists and basic operations', 'beginner', 20, 3, 'python-basics-dd', 'drag-drop', '[{"question": "Create and use a Python list", "type": "drag-drop"}]', 15, NOW()),
('dd-4', 'Loop Logic', 'Master loops and repetition in Python', 'beginner', 22, 4, 'python-basics-dd', 'drag-drop', '[{"question": "Create a loop that counts to 5", "type": "drag-drop"}]', 18, NOW()),
('dd-5', 'Conditional Thinking', 'Learn if/elif/else statements', 'beginner', 25, 5, 'python-basics-dd', 'drag-drop', '[{"question": "Create conditional logic", "type": "drag-drop"}]', 20, NOW()),

-- Puzzle Games
('puzzle-1', 'Python Basics Quiz', 'Test your Python fundamentals', 'beginner', 20, 1, 'python-basics-puzzle', 'puzzle', '[{"question": "What defines a function?", "options": ["function", "def", "func", "define"], "correct": "def"}, {"question": "How do you print?", "options": ["print()", "echo()", "console.log()"], "correct": "print()"}]', 8, NOW()),
('puzzle-2', 'Data Types Challenge', 'Identify Python data types', 'beginner', 25, 2, 'python-basics-puzzle', 'puzzle', '[{"question": "What type is 42?", "options": ["string", "integer", "float"], "correct": "integer"}, {"question": "What type is \"hello\"?", "options": ["string", "integer", "float"], "correct": "string"}]', 10, NOW()),
('puzzle-3', 'Logic Games', 'Solve Python logic puzzles', 'beginner', 22, 3, 'python-basics-puzzle', 'puzzle', '[{"question": "What is truth value of True?", "options": ["True", "False", "maybe", "undefined"], "correct": "True"}]', 12, NOW()),

-- Code Challenges
('code-1', 'Dictionary Operations', 'Master Python dictionaries', 'intermediate', 30, 1, 'applied-python-dd', 'code', '[{"question": "Create a dictionary", "type": "code", "starter_code": "# Create dictionary"}]', 15, NOW()),
('code-2', 'List Comprehensions', 'Learn advanced list processing', 'intermediate', 35, 2, 'applied-python-dd', 'code', '[{"question": "Square numbers with list comprehension", "type": "code", "starterCode": "# Write list comprehension"}]', 18, NOW()),
('code-3', 'Error Handling', 'Learn to handle errors gracefully', 'intermediate', 32, 3, 'applied-python-dd', 'code', '[{"question": "Add try-catch error handling", "type": "code", "starterCode": "# Add error handling"}]', 16, NOW()),

-- Story Lessons
('story-1', 'The Tech Adventure', 'Join Alex on a Python coding journey', 'beginner', 30, 1, 'advanced-python-story', 'story', '[{"question": "Read Alex\"s story", "type": "story", "content": "Chapter 1 of Alex\"s journey"}]', 30, NOW()),
('story-2', 'Data Science Challenge', 'Help analyze real-world data', 'intermediate', 45, 2, 'advanced-python-story', 'story', '[{"question": "Complete the data science story", "type": "story", "content": "Data analysis chapter"}]', 25, NOW()),
('story-3', 'Web Development', 'Build web applications', 'advanced', 55, 3, 'advanced-python-story', 'story', '[{"question": "Full-stack web dev story", "type": "story", "content": "Web development journey"}]', 20, NOW()),

-- Specialized Lessons
('data-science-1', 'NumPy Basics', 'Learn numerical computing', 'intermediate', 50, 1, 'section-data-science', 'code', '[{"question": "Use NumPy for data analysis", "type": "code", "starterCode": "# Import NumPy"}]', 25, NOW()),
('web-dev-1', 'Flask Web Apps', 'Build web applications', 'intermediate', 52, 1, 'section-web-development', 'code', '[{"question": "Create a Flask app", "type": "code", "starterCode": "# Create Flask app"}]', 20, NOW()),
('automation-1', 'File Automation', 'Automate file system tasks', 'intermediate', 48, 1, 'section-automation', 'code', '[{"question": "Automate file operations", "type": "code", "starterCode": "# Write file automation script"}]', 18, NOW())

ON CONFLICT (id) DO NOTHING;

-- Add some new achievements
INSERT INTO achievements (id, name, description, icon, category, requirement, xp_reward, created_at) VALUES
('drag-drop-beginner', 'Drag & Drop Explorer', 'Complete your first drag-drop lesson', '🎯', 'skill', '{"type": "drag-drop-completion", "count": 1}', 25, NOW()),
('puzzle-master', 'Quiz Champion', 'Score 80+ points in puzzle games', '🏆', 'skill', '{"type": "puzzle-high-score", "min_score": 80}', 50, NOW()),
('story-hero', 'Narrative Adventurer', 'Complete your first story lesson', '📖', 'skill', '{"type": "story-completion", "count": 1}', 40, NOW()),
('code-warrior', 'Code Master', 'Complete 3 code challenges', '💻', 'skill', '{"type": "code-completion", "count": 3}', 75, NOW()),
('all-around-python', 'Python Expert', 'Try all lesson types', '🌟', 'variety', '{"type": "variety", "all_types": true}', 100, NOW()),
('beginner-path', 'Foundation Achiever', 'Complete all beginner lessons', '🎓', 'path', '{"type": "beginner-complete", "count": 5}', 150, NOW()),
('intermediate-path', 'Applied Python', 'Master intermediate content', '⚡', 'path', '{"type": "intermediate-complete", "count": 6}', 200, NOW())

ON CONFLICT (name) DO NOTHING;

-- Show what was added
SELECT
    'SUCCESS!' as status,
    'New sections added to your database' as message
UNION ALL

SELECT
    'SECTIONS:' as type,
    COUNT(*) as count,
    STRING_AGG(title, ', ' ORDER BY order_index) as details
FROM sections
WHERE id IN ('python-basics-dd', 'python-basics-puzzle', 'applied-python-dd', 'advanced-python-story')
GROUP BY 'SECTIONS:'

UNION ALL

SELECT
    'LESSONS:' as type,
    COUNT(*) as count,
    STRING_AGG(CONCAT(title, ' (', lesson_type, ')'), ', ' ORDER BY order_index) as details
FROM lessons
WHERE id IN (
    'dd-1', 'dd-2', 'dd-3', 'dd-4', 'dd-5',
    'puzzle-1', 'puzzle-2', 'puzzle-3',
    'code-1', 'code-2', 'code-3',
    'story-1', 'story-2', 'story-3',
    'data-science-1', 'web-dev-1', 'automation-1'
)
GROUP BY 'LESSONS:'

UNION ALL

SELECT
    'ACHIEVEMENTS:' as type,
    COUNT(*) as count,
    STRING_AGG(name, ', ' ORDER BY xp_reward) as details
FROM achievements
WHERE id IN (
    'drag-drop-beginner', 'puzzle-master', 'story-hero', 'code-warrior', 'all-around-python',
    'beginner-path', 'intermediate-path'
)
GROUP BY 'ACHIEVEMENTS:'

UNION ALL

SELECT
    'NEXT STEPS:' as type,
    '1. Refresh your website (Ctrl+Shift+R)' as step1,
    '2. Go to the Learn section' as step2,
    '3. See your new lessons!' as step3
FROM (SELECT 1) as dummy;