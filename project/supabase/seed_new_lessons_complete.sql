-- Complete seeding script for all new PyLearn lessons
-- Run this script in Supabase SQL Editor to populate the database with the expanded lesson library

-- =====================================
-- NEW SECTIONS FOR EXPANDED LEARNING PATHS
-- =====================================

-- Beginner Path Sections
INSERT INTO sections (id, title, description, path, order_index, unlock_requirement_xp) VALUES
('section-beginner-dragdrop', 'Python Basics', 'Fundamentals through drag-and-drop exercises', 'python-basics', 1, 0),
('section-beginner-puzzles', 'Logic Puzzles', 'Python thinking through interactive games', 'python-basics', 2, 25),
('section-beginner-stories', 'Coding Adventures', 'Learn Python through engaging stories', 'python-basics', 3, 50)
ON CONFLICT (id) DO NOTHING;

-- Intermediate Path Sections
INSERT INTO sections (id, title, description, path, order_index, unlock_requirement_xp) VALUES
('section-intermediate-dragdrop', 'Applied Python', 'Real-world code arrangement and structure', 'applied-python', 4, 100),
('section-intermediate-puzzles', 'Problem Solving', 'Python challenges and complex puzzles', 'applied-python', 5, 150),
('section-intermediate-stories', 'Python Projects', 'Story-based project learning', 'applied-python', 6, 200)
ON CONFLICT (id) DO NOTHING;

-- Advanced Path Sections
INSERT INTO sections (id, title, description, path, order_index, unlock_requirement_xp) VALUES
('section-advanced-dragdrop', 'Professional Code', 'Industry-standard patterns and algorithms', 'advanced-python', 7, 300),
('section-advanced-puzzles', 'Expert Challenges', 'Complex problem solving and optimization', 'advanced-python', 8, 400),
('section-advanced-stories', 'Real Applications', 'Professional Python scenarios', 'advanced-python', 9, 500)
ON CONFLICT (id) DO NOTHING;

-- Specialized Module Sections
INSERT INTO sections (id, title, description, path, order_index, unlock_requirement_xp) VALUES
('section-data-science', 'Data Science with Python', 'Learn data analysis, visualization, and machine learning', 'specialized-modules', 10, 600),
('section-web-development', 'Web Development', 'Build web applications with Flask and Django', 'specialized-modules', 11, 650),
('section-automation', 'Python Automation', 'Automate tasks and build productivity tools', 'specialized-modules', 12, 700)
ON CONFLICT (id) DO NOTHING;

-- =====================================
-- BEGINNER PATH LESSONS (15 lessons)
-- =====================================

-- Beginner Drag & Drop Lessons (5)
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, drag_drop_data, estimated_minutes) VALUES
('bd-dragdrop-1', 'Hello World Function', 'Create your first Python function by arranging code blocks', 'beginner', 15, 1, 'section-beginner-dragdrop', 'drag-drop', '{
  "instructions": "Create your first Python function! Arrange the code blocks to build a complete function that says Hello World.",
  "code_blocks": [
    {"id": "def-hello", "content": "def hello_world():", "type": "function", "indent": 0},
    {"id": "docstring", "content": "\"\"\"This function returns a friendly greeting message.\"\"\"", "type": "comment", "indent": 4},
    {"id": "return-statement", "content": "return \"Hello, World! Welcome to Python!\"", "type": "code", "indent": 4}
  ],
  "correct_order": ["def-hello", "docstring", "return-statement"],
  "hints": ["Functions start with the ''def'' keyword", "Docstrings come after function definition", "Return statement provides output"]
}', 15),
('bd-dragdrop-2', 'Variable Magic', 'Learn to declare and use different variable types', 'beginner', 18, 2, 'section-beginner-dragdrop', 'drag-drop', '{
  "instructions": "Create variables of different types and assign them values.",
  "code_blocks": [
    {"id": "string-var", "content": "name = \"Alex\"", "type": "variable", "indent": 0},
    {"id": "number-var", "content": "age = 25", "type": "variable", "indent": 0},
    {"id": "boolean-var", "content": "is_student = True", "type": "variable", "indent": 0}
  ],
  "correct_order": ["string-var", "number-var", "boolean-var"],
  "hints": ["Text needs quotes, numbers don''t", "Boolean values are True/False"]
}', 18),
('bd-dragdrop-3', 'List Adventures', 'Master Python list operations through drag-and-drop', 'beginner', 20, 3, 'section-beginner-dragdrop', 'drag-drop', '{
  "instructions": "Work with Python lists! Create a list and add items to it.",
  "code_blocks": [
    {"id": "create-list", "content": "fruits = [\"apple\", \"banana\", \"orange\"]", "type": "variable", "indent": 0},
    {"id": "add-item", "content": "fruits.append(\"grape\")", "type": "code", "indent": 0},
    {"id": "print-list", "content": "print(f\"Fruits: {fruits}\")", "type": "code", "indent": 0}
  ],
  "correct_order": ["create-list", "add-item", "print-list"],
  "hints": ["Lists use square brackets", "append() adds items to the end"]
}', 20),
('bd-dragdrop-4', 'Loop Logic', 'Arrange code to create working loops', 'beginner', 22, 4, 'section-beginner-dragdrop', 'drag-drop', '{
  "instructions": "Master loops by arranging code that counts from 1 to 5.",
  "code_blocks": [
    {"id": "for-loop", "content": "for i in range(1, 6):", "type": "code", "indent": 0},
    {"id": "print-statement", "content": "print(f\"Count: {i}\")", "type": "code", "indent": 4}
  ],
  "correct_order": ["for-loop", "print-statement"],
  "hints": ["range(1, 6) generates numbers 1-5", "Code inside loops must be indented"]
}', 22),
('bd-dragdrop-5', 'Conditional Thinking', 'Build if/elif/else statements step by step', 'beginner', 25, 5, 'section-beginner-dragdrop', 'drag-drop', '{
  "instructions": "Build a conditional statement that checks age and prints different messages.",
  "code_blocks": [
    {"id": "age-var", "content": "age = 17", "type": "variable", "indent": 0},
    {"id": "if-statement", "content": "if age >= 18:", "type": "code", "indent": 0},
    {"id": "print-adult", "content": "print(\"You are an adult\")", "type": "code", "indent": 4},
    {"id": "else-statement", "content": "else:", "type": "code", "indent": 0},
    {"id": "print-minor", "content": "print(\"You are a minor\")", "type": "code", "indent": 4}
  ],
  "correct_order": ["age-var", "if-statement", "print-adult", "else-statement", "print-minor"],
  "hints": ["if statements check conditions", "else runs when if is False", "Indent code inside if/else blocks"]
}', 25)
ON CONFLICT (id) DO NOTHING;

-- Beginner Puzzle Game Lessons (5)
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, game_data, estimated_minutes) VALUES
('bd-puzzle-1', 'Python Syntax Sprint', 'Fast-paced quiz covering basic Python syntax', 'beginner', 20, 1, 'section-beginner-puzzles', 'puzzle', '{
  "time_bonus": 100,
  "streak_multiplier": 10,
  "questions": [
    {
      "id": "syntax-1",
      "question": "Which keyword is used to define a function in Python?",
      "options": ["function", "def", "func", "define"],
      "correctAnswer": 1,
      "explanation": "The ''def'' keyword is used to define functions in Python.",
      "difficulty": "easy",
      "points": 10,
      "timeLimit": 15
    },
    {
      "id": "syntax-2",
      "question": "How do you print something in Python?",
      "options": ["print", "echo", "display", "show"],
      "correctAnswer": 0,
      "explanation": "The print() function is used to display output in Python 3.",
      "difficulty": "easy",
      "points": 10,
      "timeLimit": 10
    }
  ]
}', 20),
('bd-puzzle-2', 'Data Type Detective', 'Identify different Python data types and operators', 'beginner', 22, 2, 'section-beginner-puzzles', 'puzzle', '{
  "time_bonus": 120,
  "streak_multiplier": 12,
  "questions": [
    {
      "id": "datatype-1",
      "question": "What data type is this: 42?",
      "options": ["string", "integer", "float", "boolean"],
      "correctAnswer": 1,
      "explanation": "42 is an integer (whole number) in Python.",
      "difficulty": "easy",
      "points": 10,
      "timeLimit": 10
    }
  ]
}', 22),
('bd-puzzle-3', 'Function Finder', 'Match function definitions to their correct outputs', 'beginner', 25, 3, 'section-beginner-puzzles', 'puzzle', '{
  "time_bonus": 150,
  "streak_multiplier": 15,
  "questions": [
    {
      "id": "function-1",
      "question": "What will this function return?",
      "code": "def add_numbers(a, b): return a + b",
      "options": ["8", "35", "undefined", "error"],
      "correctAnswer": 0,
      "explanation": "The function adds two numbers together.",
      "difficulty": "easy",
      "points": 12,
      "timeLimit": 20
    }
  ]
}', 25),
('bd-puzzle-4', 'List Logic Challenge', 'Test your knowledge of Python list operations', 'beginner', 27, 4, 'section-beginner-puzzles', 'puzzle', '{
  "time_bonus": 140,
  "streak_multiplier": 12,
  "questions": [
    {
      "id": "list-1",
      "question": "What is the length of this list?",
      "code": "fruits = [\"apple\", \"banana\", \"orange\"]",
      "options": ["2", "3", "4", "0"],
      "correctAnswer": 1,
      "explanation": "The list contains 3 items.",
      "difficulty": "easy",
      "points": 10,
      "timeLimit": 15
    }
  ]
}', 27),
('bd-puzzle-5', 'Bug Squash Basics', 'Find and fix simple Python syntax errors', 'beginner', 30, 5, 'section-beginner-puzzles', 'puzzle', '{
  "time_bonus": 160,
  "streak_multiplier": 15,
  "questions": [
    {
      "id": "bug-1",
      "question": "What is wrong with this code?",
      "code": "def my_function() return \"Hello\"",
      "options": ["Missing colon", "Missing indentation", "Wrong return", "Nothing wrong"],
      "correctAnswer": 0,
      "explanation": "Function definitions need a colon (:) after the parentheses.",
      "difficulty": "easy",
      "points": 12,
      "timeLimit": 20
    }
  ]
}', 30)
ON CONFLICT (id) DO NOTHING;

-- Beginner Story Lessons (5)
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, story_data, estimated_minutes) VALUES
('bd-story-1', 'The Programmer''s Journey Begins', 'Join Alex as they discover the magic of Python programming', 'beginner', 30, 1, 'section-beginner-stories', 'story', '{
  "setting": "A cozy bedroom where Alex discovers an old laptop with Python",
  "protagonist": {
    "name": "Alex",
    "avatar": "👨‍💻",
    "role": "Curious Learner"
  },
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Discovery",
      "content": "Alex found the dusty laptop in the attic. When they turned it on, a screen appeared with just one word: ''Python''. A friendly pop-up appeared: \"Welcome! I''m Py, your Python guide.\"",
      "challenge": {
        "description": "Help Alex write their first Python program to greet the world",
        "starter_code": "# Write your greeting function here",
        "solution": "print(\"Hello, World! I\"m learning Python magic!\")",
        "explanation": "Congratulations! You''ve written your first Python program."
      },
      "reward": {"xp": 15, "message": "Py cheers: \"Amazing! You''ve cast your first Python spell!\"", "item": "First Spell Badge"}
    }
  ]
}', 30),
('bd-story-2', 'The Variable Mystery', 'Help Alex solve puzzles using variables and data types', 'beginner', 35, 2, 'section-beginner-stories', 'story', '{
  "setting": "A mystical library where books have codes instead of words",
  "protagonist": {"name": "Alex", "avatar": "👨‍💻", "role": "Code Explorer"},
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Library of Types",
      "content": "Alex entered a library where books floated with glowing code. The Data Guardian appeared: \"Welcome! Each type has its own power.\"",
      "challenge": {
        "description": "Create variables to store Alex''s information",
        "starter_code": "# Create variables for Alex",
        "solution": "name = \"Alex\"\nage = 16\nis_student = True",
        "explanation": "Great! You understand Python''s basic data types."
      },
      "reward": {"xp": 18, "message": "The Guardian bows: \"You understand data well!\"", "item": "Data Scholar Badge"}
    }
  ]
}', 35),
('bd-story-3', 'The Loop of Time', 'Guide Alex through the time loop using repetition in code', 'beginner', 40, 3, 'section-beginner-stories', 'story', '{
  "setting": "A time chamber where clocks spin wildly",
  "protagonist": {"name": "Alex", "avatar": "👨‍💻", "role": "Time Traveler"},
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Time Loop",
      "content": "The Temporal Guardian appeared: \"You''re trapped in a time loop! Master repetition to escape!\"",
      "challenge": {
        "description": "Help Alex break the time loop by counting to 5",
        "starter_code": "# Break the time loop",
        "solution": "for i in range(1, 6):\n    print(f\"Time loop cycle {i}\")",
        "explanation": "You did it! Loops let you repeat actions efficiently."
      },
      "reward": {"xp": 20, "message": "The Guardian fades: \"You mastered time itself!\"", "item": "Time Loop Breaker Badge"}
    }
  ]
}', 40),
('bd-story-4', 'The Conditional Path', 'Help Alex make decisions in a coding adventure', 'beginner', 45, 4, 'section-beginner-stories', 'story', '{
  "setting": "A crossroads where three paths diverge",
  "protagonist": {"name": "Alex", "avatar": "👨‍💻", "role": "Decision Maker"},
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Path of Choices",
      "content": "The Logic Guardian appeared with scales: \"Choose your path based on conditions!\"",
      "challenge": {
        "description": "Help Alex choose the right path based on their abilities",
        "starter_code": "# Help Alex choose their path",
        "solution": "age = 16\nif age >= 18:\n    print(\"You can take the Path of Fire!\")\nelse:\n    print(\"You need to train more\")",
        "explanation": "Perfect! Conditional logic lets your programs make decisions."
      },
      "reward": {"xp": 23, "message": "The Logic Guardian nods: \"Your logic is sound!\"", "item": "Decision Maker Badge"}
    }
  ]
}', 45),
('bd-story-5', 'The Function Workshop', 'Create reusable code with Alex in the inventor''s workshop', 'beginner', 50, 5, 'section-beginner-stories', 'story', '{
  "setting": "An inventor''s workshop with strange devices",
  "protagonist": {"name": "Alex", "avatar": "👨‍💻", "role": "Apprentice Inventor"},
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Workshop of Reusability",
      "content": "The Function Master appeared: \"Functions are like machines—inputs, processing, outputs!\"",
      "challenge": {
        "description": "Help Alex build their first function machine",
        "starter_code": "# Build Alex''s first function",
        "solution": "def greet_person(name):\n    return f\"Hello, {name}! Welcome to the workshop!\"",
        "explanation": "Excellent! Functions are fundamental building blocks in programming."
      },
      "reward": {"xp": 25, "message": "The Function Master high-fives you: \"You''re an inventor now!\"", "item": "Function Builder Badge"}
    }
  ]
}', 50)
ON CONFLICT (id) DO NOTHING;

-- =====================================
-- SAMPLE INTERMEDIATE LESSONS (3 examples)
-- =====================================

-- Intermediate Drag & Drop Lesson
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, drag_drop_data, estimated_minutes) VALUES
('im-dragdrop-1', 'Dictionary Master', 'Work with key-value pairs and data mapping', 'intermediate', 28, 1, 'section-intermediate-dragdrop', 'drag-drop', '{
  "instructions": "Create a dictionary to store student information and perform operations.",
  "code_blocks": [
    {"id": "create-dict", "content": "student = {", "type": "code", "indent": 0},
    {"id": "name-key", "content": "\"name\": \"Sarah Johnson\",", "type": "variable", "indent": 4},
    {"id": "age-key", "content": "\"age\": 20,", "type": "variable", "indent": 4},
    {"id": "grades-key", "content": "\"grades\": [85, 92, 78, 95]", "type": "variable", "indent": 4},
    {"id": "close-dict", "content": "}", "type": "code", "indent": 0}
  ],
  "correct_order": ["create-dict", "name-key", "age-key", "grades-key", "close-dict"],
  "hints": ["Dictionaries use curly braces {}", "Keys are strings in quotes", "Use colons to separate keys and values"]
}', 28)
ON CONFLICT (id) DO NOTHING;

-- Intermediate Puzzle Game Lesson
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, game_data, estimated_minutes) VALUES
('im-puzzle-1', 'Algorithm Challenge', 'Solve simple algorithm problems and optimization tasks', 'intermediate', 35, 1, 'section-intermediate-puzzles', 'puzzle', '{
  "time_bonus": 200,
  "streak_multiplier": 20,
  "questions": [
    {
      "id": "algorithm-1",
      "question": "What is the time complexity of this algorithm?",
      "code": "def find_max(numbers):\n    max_val = numbers[0]\n    for num in numbers:\n        if num > max_val:\n            max_val = num\n    return max_val",
      "options": ["O(1)", "O(n)", "O(n²)", "O(log n)"],
      "correctAnswer": 1,
      "explanation": "The algorithm visits each element exactly once, making it O(n) linear time.",
      "difficulty": "medium",
      "points": 20,
      "timeLimit": 30
    }
  ]
}', 35)
ON CONFLICT (id) DO NOTHING;

-- Intermediate Story Lesson
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, story_data, estimated_minutes) VALUES
('im-story-1', 'The Data Scientist''s Assistant', 'Help analyze real data using Python data science tools', 'intermediate', 45, 1, 'section-intermediate-stories', 'story', '{
  "setting": "A modern data science lab where Alex meets Dr. Sarah Chen",
  "protagonist": {"name": "Alex", "avatar": "👨‍💻", "role": "Data Science Assistant"},
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Data Analysis Challenge",
      "content": "Dr. Chen looked up from her keyboard: \"I have thousands of customer records, but I need to analyze them quickly. Can you help me write some Python scripts?\"",
      "challenge": {
        "description": "Help Dr. Chen analyze customer data to find business insights",
        "starter_code": "# Customer data analysis\ncustomers = [\n    {\"name\": \"Alice\", \"age\": 25, \"purchases\": [120, 89, 200]},\n    {\"name\": \"Bob\", \"age\": 32, \"purchases\": [50, 75, 100, 125]}\n]",
        "solution": "# Analyze average purchase by age group\ndef analyze_by_age_group(customers):\n    age_groups = {\"20-29\": [], \"30-39\": []}\n    for customer in customers:\n        avg_purchase = sum(customer[\"purchases\"]) / len(customer[\"purchases\"])\n        if 20 <= customer[\"age\"] <= 29:\n            age_groups[\"20-29\"].append(avg_purchase)\n        else:\n            age_groups[\"30-39\"].append(avg_purchase)\n    return age_groups",
        "explanation": "Fantastic! You''ve just performed real data analysis. This type of customer segmentation helps businesses."
      },
      "reward": {"xp": 23, "message": "Dr. Chen smiles: \"Fantastic analysis! These insights will help us target marketing better.\"", "item": "Data Analyst Badge"}
    }
  ]
}', 45)
ON CONFLICT (id) DO NOTHING;

-- =====================================
-- SAMPLE ADVANCED LESSONS (2 examples)
-- =====================================

-- Advanced Drag & Drop Lesson
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, drag_drop_data, estimated_minutes) VALUES
('ad-dragdrop-1', 'Algorithm Implementation', 'Arrange sorting and searching algorithms', 'advanced', 50, 1, 'section-advanced-dragdrop', 'drag-drop', '{
  "instructions": "Implement binary search algorithm for efficient data searching.",
  "code_blocks": [
    {"id": "binary-search-header", "content": "def binary_search(arr, target):", "type": "function", "indent": 0},
    {"id": "binary-vars", "content": "left, right = 0, len(arr) - 1", "type": "variable", "indent": 4},
    {"id": "binary-while", "content": "while left <= right:", "type": "code", "indent": 4},
    {"id": "binary-mid", "content": "mid = (left + right) // 2", "type": "variable", "indent": 8},
    {"id": "binary-check", "content": "if arr[mid] == target: return mid", "type": "code", "indent": 8}
  ],
  "correct_order": ["binary-search-header", "binary-vars", "binary-while", "binary-mid", "binary-check"],
  "hints": ["Binary search requires sorted data", "Time complexity is O(log n)", "Eliminates half the remaining elements each iteration"]
}', 50)
ON CONFLICT (id) DO NOTHING;

-- Advanced Story Lesson
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, story_data, estimated_minutes) VALUES
('ad-story-1', 'The Startup CTO''s Dilemma', 'Build a scalable application architecture', 'advanced', 80, 1, 'section-advanced-stories', 'story', '{
  "setting": "A fast-growing startup where Alex faces scaling challenges",
  "protagonist": {"name": "Alex", "avatar": "👨‍💻", "role": "Startup CTO"},
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Scaling Crisis",
      "content": "The CEO burst into the office: \"We''re getting complaints about slow response times! The app is slowing down as users climb past 100,000. We need to fix this now!\"",
      "challenge": {
        "description": "Design a scalable architecture to handle millions of users",
        "starter_code": "# Scalable Architecture Design\nclass ScalableArchitecture:\n    def __init__(self):\n        self.services = {}\n        self.cache_layer = None",
        "solution": "# Design microservices architecture\nclass ScalableArchitecture:\n    def __init__(self):\n        self.services = {\n            ''user_service'': ''http://user-service:8001'',\n            ''content_service'': ''http://content-service:8002''\n        }\n        self.cache_layer = RedisCache()\n        self.load_balancer = LoadBalancer()",
        "explanation": "Excellent architecture design! You''ve created a scalable system that can handle millions of users."
      },
      "reward": {"xp": 40, "message": "The CEO beams: \"This is exactly what we needed! With this architecture, we can handle 10x growth!\"", "item": "Scalability Architect Badge"}
    }
  ]
}', 80)
ON CONFLICT (id) DO NOTHING;

-- =====================================
-- SAMPLE SPECIALIZED LESSONS (2 examples)
-- =====================================

-- Data Science Lesson
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, drag_drop_data, estimated_minutes) VALUES
('ds-dragdrop-1', 'NumPy Array Operations', 'Master array manipulation and numerical computing', 'intermediate', 50, 1, 'section-data-science', 'drag-drop', '{
  "instructions": "Arrange NumPy operations to perform data analysis on a dataset.",
  "code_blocks": [
    {"id": "import-numpy", "content": "import numpy as np", "type": "code", "indent": 0},
    {"id": "create-array", "content": "data = np.array([23, 45, 67, 89, 12, 34, 56, 78, 90, 43])", "type": "variable", "indent": 0},
    {"id": "calculate-mean", "content": "mean_val = np.mean(data)", "type": "variable", "indent": 0},
    {"id": "boolean-filter", "content": "high_values = data[data > np.mean(data)]", "type": "variable", "indent": 0}
  ],
  "correct_order": ["import-numpy", "create-array", "calculate-mean", "boolean-filter"],
  "hints": ["NumPy arrays are faster than Python lists", "Boolean indexing filters arrays based on conditions"]
}', 50)
ON CONFLICT (id) DO NOTHING;

-- Web Development Lesson
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, drag_drop_data, estimated_minutes) VALUES
('web-dragdrop-1', 'Flask Web Applications', 'Build dynamic web applications with Flask', 'intermediate', 52, 1, 'section-web-development', 'drag-drop', '{
  "instructions": "Build a complete Flask web application with routes and templates.",
  "code_blocks": [
    {"id": "import-flask", "content": "from flask import Flask, render_template", "type": "code", "indent": 0},
    {"id": "create-app", "content": "app = Flask(__name__)", "type": "variable", "indent": 0},
    {"id": "home-route", "content": "@app.route(''/'')", "type": "code", "indent": 0},
    {"id": "home-function", "content": "def home():", "type": "function", "indent": 4},
    {"id": "home-return", "content": "return render_template(''home.html'')", "type": "code", "indent": 8}
  ],
  "correct_order": ["import-flask", "create-app", "home-route", "home-function", "home-return"],
  "hints": ["Flask routes map URLs to Python functions", "Use render_template to serve HTML files"]
}', 52)
ON CONFLICT (id) DO NOTHING;

-- =====================================
-- NEW ACHIEVEMENTS
-- =====================================

INSERT INTO achievements (id, name, description, icon, category, requirement, xp_reward) VALUES
('beginner_complete', 'Python Foundation', 'Complete all beginner lessons', '🎓', 'path_completion', '{"type": "path_completion", "path": "beginner", "count": 15}', 100),
('intermediate_complete', 'Python Practitioner', 'Complete all intermediate lessons', '⚡', 'path_completion', '{"type": "path_completion", "path": "intermediate", "count": 20}', 150),
('advanced_complete', 'Python Master', 'Complete all advanced lessons', '👑', 'path_completion', '{"type": "path_completion", "path": "advanced", "count": 15}', 200),
('data_science_expert', 'Data Scientist', 'Complete all data science lessons', '🔬', 'skill', '{"type": "lesson_completion", "path": "data-science", "count": 5}', 100),
('web_developer_expert', 'Web Architect', 'Complete all web development lessons', '🏗️', 'skill', '{"type": "lesson_completion", "path": "web-development", "count": 5}', 100),
('automation_expert', 'Automation Master', 'Complete all automation lessons', '⚙️', 'skill', '{"type": "lesson_completion", "path": "automation", "count": 5}', 100),
('comprehensive_learner', 'Comprehensive Learner', 'Complete lessons from all paths', '📚', 'comprehensive', '{"type": "path_variety", "paths": ["beginner", "intermediate", "advanced"], "min_per_path": 3}', 180),
('full_stack_python', 'Full Stack Python', 'Complete web development and data science modules', '💻', 'comprehensive', '{"type": "module_combination", "modules": ["web-development", "data-science"], "complete_all": true}', 200),
('drag_drop_specialist', 'Drag & Drop Specialist', 'Complete 10 drag-drop lessons with 90%+ accuracy', '🎯', 'interactive_mastery', '{"type": "lesson_type_mastery", "lesson_type": "drag-drop", "count": 10, "min_accuracy": 90}', 120),
('puzzle_mastermind', 'Puzzle Mastermind', 'Score above 1500 points in 10 different puzzles', '🧩', 'interactive_mastery', '{"type": "puzzle_excellence", "count": 10, "min_score": 1500}', 140),
('story_teller', 'Story Teller', 'Complete all story lessons across all paths', '📖', 'interactive_mastery', '{"type": "lesson_type_completion", "lesson_type": "story", "all_paths": true}', 130),
('lesson_explorer', 'Lesson Explorer', 'Try at least one lesson from each category', '🗺️', 'variety', '{"type": "category_exploration", "categories": ["drag-drop", "puzzle", "story", "multiple-choice", "code"]}', 80),
('difficulty_diver', 'Difficulty Diver', 'Complete lessons from beginner, intermediate, and advanced levels', '📈', 'variety', '{"type": "difficulty_variety", "levels": ["beginner", "intermediate", "advanced"], "min_per_level": 2}', 90),
('xp_collector', 'XP Collector', 'Earn 1000 total XP', '⭐', 'progression', '{"type": "total_xp", "min_xp": 1000}', 50),
('xp_champion', 'XP Champion', 'Earn 2500 total XP', '🌟', 'progression', '{"type": "total_xp", "min_xp": 2500}', 100),
('xp_legend', 'XP Legend', 'Earn 5000 total XP', '👑', 'progression', '{"type": "total_xp", "min_xp": 5000}', 200)
ON CONFLICT (id) DO NOTHING;

-- =====================================
-- VERIFICATION QUERY
-- =====================================

-- Display summary of what was added
SELECT
    'SECTIONS ADDED' as category,
    COUNT(*) as count,
    STRING_AGG(title, ', ' ORDER BY order_index) as items
FROM sections
WHERE id LIKE 'section-%' AND path IN ('python-basics', 'applied-python', 'advanced-python', 'specialized-modules')

UNION ALL

SELECT
    'LESSONS ADDED' as category,
    COUNT(*) as count,
    STRING_AGG(title, ', ' ORDER BY order_index) as items
FROM lessons
WHERE section_id LIKE 'section-%' AND section_id IN (
    'section-beginner-dragdrop', 'section-beginner-puzzles', 'section-beginner-stories',
    'section-intermediate-dragdrop', 'section-intermediate-puzzles', 'section-intermediate-stories',
    'section-advanced-dragdrop', 'section-advanced-puzzles', 'section-advanced-stories',
    'section-data-science', 'section-web-development', 'section-automation'
)

UNION ALL

SELECT
    'ACHIEVEMENTS ADDED' as category,
    COUNT(*) as count,
    STRING_AGG(name, ', ' ORDER BY xp_reward) as items
FROM achievements
WHERE id IN (
    'beginner_complete', 'intermediate_complete', 'advanced_complete',
    'data_science_expert', 'web_developer_expert', 'automation_expert',
    'comprehensive_learner', 'full_stack_python', 'drag_drop_specialist',
    'puzzle_mastermind', 'story_teller', 'lesson_explorer', 'difficulty_diver',
    'xp_collector', 'xp_champion', 'xp_legend'
);