/*
  # Sample Enhanced Lesson Content

  ## Overview
  Sample content for new lesson types (drag-drop, puzzle, story) with engaging Python exercises.

  ## Usage
  Run this SQL script to populate your database with sample enhanced lessons.
  These lessons demonstrate the new interactive lesson types.
*/

-- Insert sample sections for enhanced learning paths
INSERT INTO sections (id, title, description, path, order_index, unlock_requirement_xp) VALUES
('section-dragdrop', 'Interactive Coding', 'Learn Python through hands-on drag-and-drop exercises', 'web-dev', 1, 0),
('section-puzzles', 'Python Puzzles', 'Challenge yourself with gamified coding puzzles', 'data-science', 2, 50),
('section-stories', 'Story Adventures', 'Follow Python programming adventures with real-world scenarios', 'automation', 3, 100)
ON CONFLICT (id) DO NOTHING;

-- Sample Drag & Drop Lesson: Python Basics
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, drag_drop_data, estimated_minutes) VALUES
('dragdrop-1', 'Build Your First Function', 'Learn Python functions by arranging code blocks in the correct order', 'beginner', 15, 1, 'section-dragdrop', 'drag-drop', 15),
('dragdrop-2', 'Loop Logic', 'Master Python loops by organizing code that processes lists', 'beginner', 20, 2, 'section-dragdrop', 'drag-drop', 20)
ON CONFLICT (id) DO NOTHING;

-- Update drag_drop_data for drag-drop lessons
UPDATE lessons SET drag_drop_data = '{
  "instructions": "Drag and drop the code blocks below to create a complete Python function that greets a user. The function should take a name parameter and return a greeting message.",
  "code_blocks": [
    {
      "id": "def-statement",
      "content": "def greet_user(name):",
      "type": "function",
      "indent": 0
    },
    {
      "id": "return-statement",
      "content": "return f\"Hello, {name}! Welcome to Python!\"",
      "type": "code",
      "indent": 4
    },
    {
      "id": "docstring",
      "content": "\"\"\"This function greets the user with a personalized message.\"\"\"",
      "type": "comment",
      "indent": 4
    }
  ],
  "correct_order": ["def-statement", "docstring", "return-statement"],
  "hints": [
    "Functions start with the 'def' keyword followed by the function name and parameters.",
    "Docstrings (documentation) should come right after the function definition.",
    "The return statement should be the last part of the function."
  ]
}' WHERE id = 'dragdrop-1';

UPDATE lessons SET drag_drop_data = '{
  "instructions": "Arrange the code blocks to create a loop that prints each item in a list of fruits. Make sure the indentation is correct!",
  "code_blocks": [
    {
      "id": "for-loop",
      "content": "for fruit in fruits:",
      "type": "code",
      "indent": 0
    },
    {
      "id": "list-definition",
      "content": "fruits = [\"apple\", \"banana\", \"orange\", \"grape\"]",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "print-statement",
      "content": "print(f\"I love {fruit}!\")",
      "type": "code",
      "indent": 4
    }
  ],
  "correct_order": ["list-definition", "for-loop", "print-statement"],
  "hints": [
    "You need to define the list before you can loop through it.",
    "The for loop comes after the list definition.",
    "Code inside the loop must be indented (usually 4 spaces)."
  ]
}' WHERE id = 'dragdrop-2';

-- Sample Puzzle Game Lessons
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, game_data, estimated_minutes) VALUES
('puzzle-1', 'Python Syntax Challenge', 'Test your Python knowledge with this fast-paced quiz game', 'intermediate', 25, 1, 'section-puzzles', 'puzzle', 25),
('puzzle-2', 'Bug Squashing Game', 'Find and fix Python bugs in this gamified debugging challenge', 'intermediate', 30, 2, 'section-puzzles', 'puzzle', 30)
ON CONFLICT (id) DO NOTHING;

-- Update game_data for puzzle lessons
UPDATE lessons SET game_data = '{
  "time_bonus": 100,
  "streak_multiplier": 15,
  "questions": [
    {
      "id": "q1",
      "question": "What will this code print: print(len(\"Python\"))?",
      "code": "print(len(\"Python\"))",
      "options": ["5", "6", "7", "Error"],
      "correctAnswer": 1,
      "explanation": "The len() function returns the length of the string. 'Python' has 6 characters.",
      "difficulty": "easy",
      "points": 10,
      "timeLimit": 15
    },
    {
      "id": "q2",
      "question": "What keyword is used to define a function in Python?",
      "code": "# What keyword goes here?\n______ my_function():\n    return \"Hello\"",
      "options": ["function", "def", "func", "define"],
      "correctAnswer": 1,
      "explanation": "The 'def' keyword is used to define functions in Python.",
      "difficulty": "easy",
      "points": 10,
      "timeLimit": 15
    },
    {
      "id": "q3",
      "question": "What will be printed by this code?",
      "code": "numbers = [1, 2, 3]\nnumbers.append(4)\nprint(len(numbers))",
      "options": ["3", "4", "5", "Error"],
      "correctAnswer": 1,
      "explanation": "The list starts with 3 elements, append() adds 1 more, so len() returns 4.",
      "difficulty": "medium",
      "points": 15,
      "timeLimit": 20
    }
  ]
}' WHERE id = 'puzzle-1';

-- Sample Story Lesson
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, story_data, estimated_minutes) VALUES
('story-1', 'The Python Adventure Begins', 'Join Alex on a quest to learn Python programming through an exciting story', 'beginner', 35, 1, 'section-stories', 'story', 35),
('story-2', 'The Data Detective', 'Help Sarah solve mysteries using Python data analysis skills', 'intermediate', 40, 2, 'section-stories', 'story', 40)
ON CONFLICT (id) DO NOTHING;

-- Update story_data for story lessons
UPDATE lessons SET story_data = '{
  "setting": "A cozy coding cafe where Alex meets a mysterious programmer who needs help with a Python project",
  "protagonist": {
    "name": "Alex",
    "avatar": "👨‍💻",
    "role": "Python Learner",
    "personality": "Curious and eager to learn"
  },
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Meeting",
      "content": "Alex walked into the Code Bean Cafe, laptop in hand, ready for another day of Python practice. The cafe smelled of fresh coffee and keyboard cleaner. As Alex sat down, a stranger with a hoodie and glowing keyboard approached their table.\n\n\"I hear you know Python,\" the stranger said. \"I have a problem that only someone with your skills can solve. I need to create a program that greets users by name, but I am stuck on the basics.\"\n\nAlex nodded eagerly. \"I have been practicing functions and strings! I think I can help.\"",
      "character": {
        "name": "Mysterious Coder",
        "avatar": "🦹‍♂️",
        "role": "Tech Mentor",
        "personality": "Mysterious but helpful"
      },
      "background": "A modern coffee shop with computers and learning materials",
      "objectives": [
        "Create a simple Python function",
        "Use string formatting in Python",
        "Understand function parameters"
      ],
      "challenge": {
        "description": "Help Alex create a function that greets users by their name",
        "starter_code": "# Write your greeting function here\n\ndef greet_user():\n    pass  # Your code here",
        "solution": "# Write your greeting function here\n\ndef greet_user(name):\n    return f\"Hello, {name}! Welcome to Python programming!\"",
        "hints": [
          "Functions can take parameters inside the parentheses",
          "Use f-strings to include variables in strings: f\"Hello, {name}\"",
          "Don't forget to return the result from your function"
        ],
        "explanation": "Great! You have created a function that takes a name parameter and returns a personalized greeting. This is a fundamental Python concept that you'll use in almost every program you write!"
      },
      "reward": {
        "xp": 20,
        "message": "You have helped Alex complete their first function! The mysterious coder is impressed.",
        "item": "Beginner Programmer Badge"
      }
    },
    {
      "id": "chapter2",
      "title": "The Challenge",
      "content": "\"Impressive!\" said the mysterious coder, nodding at Alex's work. \"But I have another challenge. What if we need to greet multiple people at once? We need to process a list of names and greet each one individually.\"\n\nAlex's eyes lit up. \"Lists! I have been studying loops and list processing. Let me try to create a function that can handle multiple names.\"\n\nThe mysterious coder smiled. \"Perfect. This is exactly the kind of problem-solving skill that makes a great programmer. Show me what you can do!\"",
      "character": {
        "name": "Mysterious Coder",
        "avatar": "🦹‍♂️",
        "role": "Tech Mentor",
        "personality": "Encouraging and challenging"
      },
      "background": "The same coffee shop, now with more people and computers",
      "objectives": [
        "Work with Python lists",
        "Use loops to process multiple items",
        "Combine functions and loops"
      ],
      "challenge": {
        "description": "Create a function that greets multiple people from a list",
        "starterCode": "# Write a function that greets multiple people\n\ndef greet_everyone(names):\n    # Process each name in the list\n    pass",
        "solution": "# Write a function that greets multiple people\n\ndef greet_everyone(names):\n    greetings = []\n    for name in names:\n        greetings.append(f\"Hello, {name}! Welcome to Python!\")\n    return greetings",
        "hints": [
          "You can use a for loop to process each name in the list",
          "Consider storing the greetings in a list before returning them",
          "Remember that you can append items to a list using the append() method"
        ],
        "explanation": "Excellent! You have successfully combined loops, lists, and functions to create a more complex program. This is a major step forward in your Python journey!"
      },
      "reward": {
        "xp": 15,
        "message": "Amazing work! The mysterious coder reveals themselves as a Python instructor and offers you an apprenticeship.",
        "item": "Loop Master Badge"
      }
    }
  ]
}' WHERE id = 'story-1';

-- Insert additional traditional lessons for variety
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, content, estimated_minutes) VALUES
('traditional-1', 'Python Variables and Types', 'Learn the fundamentals of Python variables and data types', 'beginner', 10, 1, 'section-dragdrop', 'multiple-choice', '[{"question": "What is the correct way to create a variable in Python?", "type": "multiple-choice", "options": ["variable_name = value", "var variable_name = value", "create variable_name = value", "set variable_name = value"], "correctAnswer": "variable_name = value"}, {"question": "Which of these is a string data type in Python?", "type": "multiple-choice", "options": ["123", "true", "hello", "3.14"], "correctAnswer": "hello"}]', 10),
('traditional-2', 'Basic Python Operations', 'Practice fundamental Python operations and expressions', 'beginner', 12, 2, 'section-dragdrop', 'code', '[{"question": "Write a Python expression that adds two numbers together", "type": "code", "code": "# Write code to add 5 and 3", "starterCode": "# Your code here\nresult = "}, {"question": "Create a variable that stores your name", "type": "code", "code": "# Create a variable with your name", "starterCode": "# Your code here\nmy_name = "}]]', 12)
ON CONFLICT (id) DO NOTHING;

-- Add some variety of coding lessons
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, content, estimated_minutes) VALUES
('code-1', 'First Python Program', 'Write and run your very first Python program', 'beginner', 15, 3, 'section-dragdrop', 'code', '[{"question": "Write a Python program that prints \"Hello, World!\"", "type": "code", "code": "# Write your Hello World program", "starterCode": "# Your code here"}, {"question": "Create a variable with your age and print it", "type": "code", "code": "# Create and print your age", "starterCode": "# Your code here"}]]', 15)
ON CONFLICT (id) DO NOTHING;

-- Add achievements for completing enhanced lessons
INSERT INTO achievements (id, name, description, icon, category, requirement, xp_reward) VALUES
('drag_drop_first', 'First Drag & Drop', 'Complete your first drag-and-drop coding lesson', '🎯', 'skill', '{"type": "lesson_completion", "lesson_type": "drag-drop", "count": 1}', 25),
('puzzle_winner', 'Puzzle Winner', 'Score over 500 points in a puzzle game lesson', '🏆', 'skill', '{"type": "puzzle_score", "min_score": 500}', 30),
('story_explorer', 'Story Explorer', 'Complete your first story-based lesson', '📚', 'skill', '{"type": "lesson_completion", "lesson_type": "story", "count": 1}', 35),
('enhanced_learner', 'Enhanced Learner', 'Try at least one lesson of each new type', '🌟', 'variety', '{"type": "lesson_type_variety", "types": ["drag-drop", "puzzle", "story"]}', 50)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lessons_section_type ON lessons(section_id, lesson_type);
CREATE INDEX IF NOT EXISTS idx_lesson_types ON lessons(lesson_type);

-- Verify the data was inserted
SELECT
  l.title,
  l.lesson_type,
  l.xp_reward,
  s.title as section_title,
  CASE l.lesson_type
    WHEN 'drag-drop' THEN '🎯'
    WHEN 'puzzle' THEN '🏆'
    WHEN 'story' THEN '📚'
    WHEN 'multiple-choice' THEN '📝'
    WHEN 'code' THEN '💻'
    ELSE '📖'
  END as lesson_emoji
FROM lessons l
JOIN sections s ON l.section_id = s.id
WHERE l.lesson_type IN ('drag-drop', 'puzzle', 'story')
ORDER BY s.order_index, l.order_index;