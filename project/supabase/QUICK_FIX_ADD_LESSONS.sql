-- QUICK FIX: Add New Lessons to Make Them Appear on Website
-- Run this entire script in Supabase SQL Editor to immediately add new lessons

-- First, add new sections
INSERT INTO sections (id, title, description, path, order_index, unlock_requirement_xp) VALUES
('section-beginner-dragdrop', 'Python Basics - Drag & Drop', 'Learn fundamentals through hands-on drag-and-drop exercises', 'python-basics', 1, 0),
('section-beginner-puzzles', 'Python Puzzles', 'Test your knowledge with interactive puzzle games', 'python-basics', 2, 25),
('section-intermediate-dragdrop', 'Applied Python', 'Real-world Python applications and code structure', 'applied-python', 3, 100),
('section-advanced-stories', 'Advanced Python Stories', 'Professional scenarios and complex challenges', 'advanced-python', 4, 300)
ON CONFLICT (id) DO NOTHING;

-- Add several new lessons immediately
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, drag_drop_data, estimated_minutes) VALUES

-- Beginner Drag & Drop Lessons
('bd-1', 'Your First Function', 'Create your first Python function with drag-and-drop blocks', 'beginner', 15, 1, 'section-beginner-dragdrop', 'drag-drop', '{
  "instructions": "Drag the blocks to create a complete Python function",
  "code_blocks": [
    {"id": "def-line", "content": "def greet():", "type": "function", "indent": 0},
    {"id": "return-line", "content": "return \"Hello, Python!\"", "type": "code", "indent": 4}
  ],
  "correct_order": ["def-line", "return-line"],
  "hints": ["Functions start with def keyword", "Return values with return statement"]
}', 10),

('bd-2', 'Working with Variables', 'Learn to create and use Python variables', 'beginner', 18, 2, 'section-beginner-dragdrop', 'drag-drop', '{
  "instructions": "Arrange code to create and use variables",
  "code_blocks": [
    {"id": "name-var", "content": "name = \"Alex\"", "type": "variable", "indent": 0},
    {"id": "age-var", "content": "age = 25", "type": "variable", "indent": 0},
    {"id": "print-line", "content": "print(f\"{name} is {age} years old\")", "type": "code", "indent": 0}
  ],
  "correct_order": ["name-var", "age-var", "print-line"],
  "hints": ["Variables store values", "Use f-strings to include variables in text"]
}', 12),

-- Beginner Puzzle Lessons
('bp-1', 'Python Basics Quiz', 'Test your fundamental Python knowledge', 'beginner', 20, 1, 'section-beginner-puzzles', 'puzzle', '{
  "time_bonus": 100,
  "streak_multiplier": 10,
  "questions": [
    {
      "id": "q1",
      "question": "What keyword defines a function in Python?",
      "options": ["function", "def", "create", "make"],
      "correctAnswer": 1,
      "explanation": "The def keyword is used to define functions in Python",
      "difficulty": "easy",
      "points": 10,
      "timeLimit": 15
    },
    {
      "id": "q2",
      "question": "How do you print in Python 3?",
      "options": ["print()", "echo()", "console.log()", "display()"],
      "correctAnswer": 0,
      "explanation": "print() is used to display output in Python 3",
      "difficulty": "easy",
      "points": 10,
      "timeLimit": 10
    }
  ]
}', 8),

('bp-2', 'Data Types Challenge', 'Identify Python data types correctly', 'beginner', 25, 2, 'section-beginner-puzzles', 'puzzle', '{
  "time_bonus": 120,
  "streak_multiplier": 12,
  "questions": [
    {
      "id": "q1",
      "question": "What type is 42 in Python?",
      "options": ["string", "integer", "float", "boolean"],
      "correctAnswer": 1,
      "explanation": "42 is an integer (whole number)",
      "difficulty": "easy",
      "points": 12,
      "timeLimit": 12
    }
  ]
}', 10),

-- Intermediate Drag & Drop Lessons
('im-1', 'Dictionary Operations', 'Master Python dictionaries and key-value pairs', 'intermediate', 30, 1, 'section-intermediate-dragdrop', 'drag-drop', '{
  "instructions": "Create a dictionary to store student information",
  "code_blocks": [
    {"id": "create-dict", "content": "student = {", "type": "code", "indent": 0},
    {"id": "name-entry", "content": "\"name\": \"Sarah\",", "type": "variable", "indent": 4},
    {"id": "age-entry", "content": "\"age\": 20,", "type": "variable", "indent": 4},
    {"id": "close-dict", "content": "}", "type": "code", "indent": 0}
  ],
  "correct_order": ["create-dict", "name-entry", "age-entry", "close-dict"],
  "hints": ["Dictionaries use curly braces {}", "Keys are strings in quotes"]
}', 15),

('im-2', 'List Comprehensions', 'Learn advanced list processing techniques', 'intermediate', 35, 2, 'section-intermediate-dragdrop', 'drag-drop', '{
  "instructions": "Create a list comprehension to square numbers",
  "code_blocks": [
    {"id": "numbers-list", "content": "numbers = [1, 2, 3, 4, 5]", "type": "variable", "indent": 0},
    {"id": "comprehension", "content": "squares = [x**2 for x in numbers]", "type": "variable", "indent": 0}
  ],
  "correct_order": ["numbers-list", "comprehension"],
  "hints": ["List comprehensions create new lists from existing ones", "Format: [expression for item in iterable]"]
}', 18),

-- Advanced Story Lessons
('as-1', 'The Startup Challenge', 'Design scalable systems as a startup CTO', 'advanced', 50, 1, 'section-advanced-stories', 'story', '{
  "setting": "A fast-growing startup facing scaling challenges",
  "protagonist": {"name": "Alex", "avatar": "👨‍💻", "role": "Startup CTO"},
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Scaling Crisis",
      "content": "The CEO rushed in: \"Users are complaining about slow response times! We need to scale now!\"",
      "challenge": {
        "description": "Design a scalable architecture",
        "starter_code": "# Design scalable system\nclass ScalableSystem:\n    def __init__(self):",
        "solution": "# Design microservices architecture\nclass ScalableSystem:\n    def __init__(self):\n        self.services = {\n            ''user_service'': ''http://user-api:8001'',\n            ''content_service'': ''http://content-api:8002''\n        }",
        "explanation": "Microservices architecture allows independent scaling of different components"
      },
      "reward": {"xp": 25, "message": "CEO: \"Excellent! This architecture can handle our growth!\"", "item": "Architecture Badge"}
    }
  ]
}', 25),

('as-2', 'Data Science Competition', 'Compete in a machine learning challenge', 'advanced', 60, 2, 'section-advanced-stories', 'story', '{
  "setting": "International data science hackathon with real-world problems",
  "protagonist": {"name": "Alex", "avatar": "👨‍💻", "role": "Data Scientist"},
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Housing Price Challenge",
      "content": "The announcer explained: \"Predict house prices from features. 50,000 houses, 80 features each. You have 48 hours!\"",
      "challenge": {
        "description": "Build a machine learning pipeline for house price prediction",
        "starter_code": "# House price prediction\nimport pandas as pd\nfrom sklearn.ensemble import RandomForestRegressor",
        "solution": "# Complete ML pipeline\ndef predict_prices(X_train, y_train, X_test):\n    model = RandomForestRegressor(n_estimators=100)\n    model.fit(X_train, y_train)\n    return model.predict(X_test)",
        "explanation": "You built a complete ML pipeline with data preprocessing and model training"
      },
      "reward": {"xp": 30, "message": "Judge: \"Outstanding work! Your model achieved 92% accuracy!\"", "item": "ML Champion Badge"}
    }
  ]
}', 30)

ON CONFLICT (id) DO NOTHING;

-- Add some new achievements
INSERT INTO achievements (id, name, description, icon, category, requirement, xp_reward) VALUES
('new_learner', 'Fresh Start', 'Complete your first new lesson', '🌟', 'progression', '{"type": "lesson_completion", "new_lessons": 1}', 25),
('drag_drop_master', 'Code Arranger', 'Complete 3 drag-drop lessons', '🎯', 'skill', '{"type": "lesson_completion", "lesson_type": "drag-drop", "count": 3}', 75),
('puzzle_champion', 'Quiz Master', 'Score 100 points in puzzle lessons', '🏆', 'skill', '{"type": "puzzle_score", "min_score": 100}', 50),
('story_hero', 'Narrative Explorer', 'Complete a story lesson', '📖', 'skill', '{"type": "lesson_completion", "lesson_type": "story", "count": 1}', 40),
('python_explorer', 'Curious Mind', 'Try all lesson types', '🔍', 'variety', '{"type": "lesson_type_variety", "types": ["drag-drop", "puzzle", "story"]}', 60)
ON CONFLICT (id) DO NOTHING;

-- Verification: Show what was added
SELECT
    'SECTIONS ADDED' as type,
    COUNT(*) as count,
    STRING_AGG(title, ', ' ORDER BY order_index) as details
FROM sections
WHERE id IN ('section-beginner-dragdrop', 'section-beginner-puzzles', 'section-intermediate-dragdrop', 'section-advanced-stories')

UNION ALL

SELECT
    'LESSONS ADDED' as type,
    COUNT(*) as count,
    STRING_AGG(title, ', ' ORDER BY order_index) as details
FROM lessons
WHERE id IN ('bd-1', 'bd-2', 'bp-1', 'bp-2', 'im-1', 'im-2', 'as-1', 'as-2')

UNION ALL

SELECT
    'ACHIEVEMENTS ADDED' as type,
    COUNT(*) as count,
    STRING_AGG(name, ', ' ORDER BY xp_reward) as details
FROM achievements
WHERE id IN ('new_learner', 'drag_drop_master', 'puzzle_champion', 'story_hero', 'python_explorer');