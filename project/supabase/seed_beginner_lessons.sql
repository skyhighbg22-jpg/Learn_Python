/*
  # PyLearn Comprehensive Lesson Library - Beginner Lessons

  ## Overview
  15 foundation lessons for absolute beginners covering Python fundamentals
  through interactive drag-drop, puzzle game, and story-based learning.

  ## Structure
  - 5 Drag & Drop Lessons: Hands-on code arrangement
  - 5 Puzzle Game Lessons: Gamified Python quizzes
  - 5 Story Lessons: Narrative-driven learning adventures

  ## Target Audience
  Absolute beginners with no prior programming experience
*/

-- Insert new sections for beginner learning path
INSERT INTO sections (id, title, description, path, order_index, unlock_requirement_xp) VALUES
('section-beginner-dragdrop', 'Python Basics', 'Fundamentals through drag-and-drop exercises', 'python-basics', 1, 0),
('section-beginner-puzzles', 'Logic Puzzles', 'Python thinking through interactive games', 'python-basics', 2, 25),
('section-beginner-stories', 'Coding Adventures', 'Learn Python through engaging stories', 'python-basics', 3, 50)
ON CONFLICT (id) DO NOTHING;

-- =====================================
-- BEGINNER DRAG & DROP LESSONS (5)
-- =====================================

INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, drag_drop_data, estimated_minutes) VALUES
('bd-dragdrop-1', 'Hello World Function', 'Create your first Python function by arranging code blocks', 'beginner', 15, 1, 'section-beginner-dragdrop', 'drag-drop', 15),
('bd-dragdrop-2', 'Variable Magic', 'Learn to declare and use different variable types', 'beginner', 18, 2, 'section-beginner-dragdrop', 'drag-drop', 18),
('bd-dragdrop-3', 'List Adventures', 'Master Python list operations through drag-and-drop', 'beginner', 20, 3, 'section-beginner-dragdrop', 'drag-drop', 20),
('bd-dragdrop-4', 'Loop Logic', 'Arrange code to create working loops', 'beginner', 22, 4, 'section-beginner-dragdrop', 'drag-drop', 22),
('bd-dragdrop-5', 'Conditional Thinking', 'Build if/elif/else statements step by step', 'beginner', 25, 5, 'section-beginner-dragdrop', 'drag-drop', 25)
ON CONFLICT (id) DO NOTHING;

-- Update drag_drop_data for beginner drag-drop lessons
UPDATE lessons SET drag_drop_data = '{
  "instructions": "Create your first Python function! Arrange the code blocks to build a complete function that says Hello World. Remember: functions need a definition, documentation, and a return statement.",
  "code_blocks": [
    {
      "id": "def-hello",
      "content": "def hello_world():",
      "type": "function",
      "indent": 0
    },
    {
      "id": "docstring",
      "content": "\"\"\"This function returns a friendly greeting message.\"\"\"",
      "type": "comment",
      "indent": 4
    },
    {
      "id": "return-statement",
      "content": "return \"Hello, World! Welcome to Python!\"",
      "type": "code",
      "indent": 4
    },
    {
      "id": "print-call",
      "content": "print(hello_world())",
      "type": "code",
      "indent": 0
    }
  ],
  "correct_order": ["def-hello", "docstring", "return-statement", "print-call"],
  "hints": [
    "Functions always start with the 'def' keyword",
    "Documentation (docstring) comes right after the function definition",
    "The return statement provides the function''s output",
    "You can call the function to see the result"
  ],
  "difficulty": "beginner"
}' WHERE id = 'bd-dragdrop-1';

UPDATE lessons SET drag_drop_data = '{
  "instructions": "Create variables of different types and assign them values. Python can store text, numbers, and boolean values. Arrange the code to declare variables and print their types.",
  "code_blocks": [
    {
      "id": "string-var",
      "content": "name = \"Alex\"",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "number-var",
      "content": "age = 25",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "boolean-var",
      "content": "is_student = True",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "print-name",
      "content": "print(f\"Name: {name}, Type: {type(name)}\")",
      "type": "code",
      "indent": 0
    },
    {
      "id": "print-age",
      "content": "print(f\"Age: {age}, Type: {type(age)}\")",
      "type": "code",
      "indent": 0
    },
    {
      "id": "print-student",
      "content": "print(f\"Student: {is_student}, Type: {type(is_student)}\")",
      "type": "code",
      "indent": 0
    }
  ],
  "correct_order": ["string-var", "number-var", "boolean-var", "print-name", "print-age", "print-student"],
  "hints": [
    "In Python, you create variables by simply assigning values",
    "Text values go in quotes, numbers don''t need quotes",
    "Boolean values are True or False (capitalized)",
    "The type() function shows you what type of data each variable holds"
  ],
  "difficulty": "beginner"
}' WHERE id = 'bd-dragdrop-2';

UPDATE lessons SET drag_drop_data = '{
  "instructions": "Work with Python lists! Arrange the code to create a list of fruits, add new items, and print the results. Lists are one of Python''s most useful data structures.",
  "code_blocks": [
    {
      "id": "create-list",
      "content": "fruits = [\"apple\", \"banana\", \"orange\"]",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "print-original",
      "content": "print(\"Original fruits:\", fruits)",
      "type": "code",
      "indent": 0
    },
    {
      "id": "add-grape",
      "content": "fruits.append(\"grape\")",
      "type": "code",
      "indent": 0
    },
    {
      "id": "print-length",
      "content": "print(f\"Total fruits: {len(fruits)}\")",
      "type": "code",
      "indent": 0
    },
    {
      "id": "print-all",
      "content": "print(\"All fruits:\", fruits)",
      "type": "code",
      "indent": 0
    }
  ],
  "correct_order": ["create-list", "print-original", "add-grape", "print-length", "print-all"],
  "hints": [
    "Lists are created with square brackets []",
    "Use append() to add items to the end of a list",
    "len() tells you how many items are in a list",
    "You can print the entire list to see all items"
  ],
  "difficulty": "beginner"
}' WHERE id = 'bd-dragdrop-3';

UPDATE lessons SET drag_drop_data = '{
  "instructions": "Master loops by arranging code that counts from 1 to 5. Loops let you repeat actions without writing the same code over and over.",
  "code_blocks": [
    {
      "id": "for-loop-start",
      "content": "for i in range(1, 6):",
      "type": "code",
      "indent": 0
    },
    {
      "id": "print-statement",
      "content": "print(f\"Count: {i}\")",
      "type": "code",
      "indent": 4
    },
    {
      "id": "print-done",
      "content": "print(\"Loop finished!\")",
      "type": "code",
      "indent": 0
    },
    {
      "id": "comment",
      "content": "# Count from 1 to 5 using a for loop",
      "type": "comment",
      "indent": 0
    }
  ],
  "correct_order": ["comment", "for-loop-start", "print-statement", "print-done"],
  "hints": [
    "range(1, 6) generates numbers from 1 to 5 (6 is not included)",
    "Code inside the loop must be indented (usually 4 spaces)",
    "Each iteration of the loop will have a different value for i",
    "The print statement after the loop is not indented"
  ],
  "difficulty": "beginner"
}' WHERE id = 'bd-dragdrop-4';

UPDATE lessons SET drag_drop_data = '{
  "instructions": "Build a conditional statement that checks a person''s age and prints different messages. Conditional statements let your programs make decisions!",
  "code_blocks": [
    {
      "id": "age-var",
      "content": "age = 17",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "if-statement",
      "content": "if age >= 18:",
      "type": "code",
      "indent": 0
    },
    {
      "id": "print-adult",
      "content": "print(\"You are an adult\")",
      "type": "code",
      "indent": 4
    },
    {
      "id": "else-statement",
      "content": "else:",
      "type": "code",
      "indent": 0
    },
    {
      "id": "print-minor",
      "content": "print(\"You are a minor\")",
      "type": "code",
      "indent": 4
    }
  ],
  "correct_order": ["age-var", "if-statement", "print-adult", "else-statement", "print-minor"],
  "hints": [
    "Conditional statements start with 'if'",
    "The code after 'if' runs only if the condition is True",
    "The code after 'else' runs when the 'if' condition is False",
    "Remember to indent the code blocks inside if/else statements"
  ],
  "difficulty": "beginner"
}' WHERE id = 'bd-dragdrop-5';

-- =====================================
-- BEGINNER PUZZLE GAME LESSONS (5)
-- =====================================

INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, game_data, estimated_minutes) VALUES
('bd-puzzle-1', 'Python Syntax Sprint', 'Fast-paced quiz covering basic Python syntax', 'beginner', 20, 1, 'section-beginner-puzzles', 'puzzle', 20),
('bd-puzzle-2', 'Data Type Detective', 'Identify different Python data types and operators', 'beginner', 22, 2, 'section-beginner-puzzles', 'puzzle', 22),
('bd-puzzle-3', 'Function Finder', 'Match function definitions to their correct outputs', 'beginner', 25, 3, 'section-beginner-puzzles', 'puzzle', 25),
('bd-puzzle-4', 'List Logic Challenge', 'Test your knowledge of Python list operations', 'beginner', 27, 4, 'section-beginner-puzzles', 'puzzle', 27),
('bd-puzzle-5', 'Bug Squash Basics', 'Find and fix simple Python syntax errors', 'beginner', 30, 5, 'section-beginner-puzzles', 'puzzle', 30)
ON CONFLICT (id) DO NOTHING;

-- Update game_data for beginner puzzle lessons
UPDATE lessons SET game_data = '{
  "time_bonus": 100,
  "streak_multiplier": 10,
  "questions": [
    {
      "id": "syntax-1",
      "question": "Which keyword is used to define a function in Python?",
      "code": "# What keyword goes here?\n______ my_function():\n    return \"Hello\"",
      "options": ["function", "def", "func", "define"],
      "correctAnswer": 1,
      "explanation": "The 'def' keyword is used to define functions in Python. It''s short for 'define'.",
      "difficulty": "easy",
      "points": 10,
      "timeLimit": 15
    },
    {
      "id": "syntax-2",
      "question": "How do you print something in Python?",
      "code": "# Print a message\n______ \"Hello, Python!\"",
      "options": ["print", "echo", "display", "show"],
      "correctAnswer": 0,
      "explanation": "The print() function is used to display output in Python 3.",
      "difficulty": "easy",
      "points": 10,
      "timeLimit": 10
    },
    {
      "id": "syntax-3",
      "question": "What symbol is used for comments in Python?",
      "code": "This is a comment",
      "options": ["//", "#", "/*", "--"],
      "correctAnswer": 1,
      "explanation": "The # symbol is used to create single-line comments in Python.",
      "difficulty": "easy",
      "points": 10,
      "timeLimit": 10
    },
    {
      "id": "syntax-4",
      "question": "How do you check the length of a string?",
      "code": "message = \"Hello\"\nprint(len(______))",
      "options": ["message", "\"message\"", "(message)", "string.message"],
      "correctAnswer": 0,
      "explanation": "You pass the variable name directly to the len() function: len(message).",
      "difficulty": "medium",
      "points": 15,
      "timeLimit": 20
    }
  ]
}' WHERE id = 'bd-puzzle-1';

UPDATE lessons SET game_data = '{
  "time_bonus": 120,
  "streak_multiplier": 12,
  "questions": [
    {
      "id": "datatype-1",
      "question": "What data type is this: 42?",
      "code": "x = 42\nprint(type(x))",
      "options": ["string", "integer", "float", "boolean"],
      "correctAnswer": 1,
      "explanation": "42 is an integer (whole number) in Python.",
      "difficulty": "easy",
      "points": 10,
      "timeLimit": 10
    },
    {
      "id": "datatype-2",
      "question": "What data type is this: \"Hello World\"?",
      "code": "message = \"Hello World\"\nprint(type(message))",
      "options": ["character", "text", "string", "word"],
      "correctAnswer": 2,
      "explanation": "Text in quotes is called a string in Python.",
      "difficulty": "easy",
      "points": 10,
      "timeLimit": 10
    },
    {
      "id": "datatype-3",
      "question": "What data type is this: 3.14?",
      "code": "pi = 3.14\nprint(type(pi))",
      "options": ["decimal", "float", "double", "real"],
      "correctAnswer": 1,
      "explanation": "Numbers with decimal points are called floats in Python.",
      "difficulty": "medium",
      "points": 15,
      "timeLimit": 15
    },
    {
      "id": "datatype-4",
      "question": "Which of these is a boolean value?",
      "code": "is_ready = ?",
      "options": ["yes", "on", "true", "True"],
      "correctAnswer": 3,
      "explanation": "Python boolean values are True and False (capitalized).",
      "difficulty": "medium",
      "points": 15,
      "timeLimit": 15
    }
  ]
}' WHERE id = 'bd-puzzle-2';

UPDATE lessons SET game_data = '{
  "time_bonus": 150,
  "streak_multiplier": 15,
  "questions": [
    {
      "id": "function-1",
      "question": "What will this function return?",
      "code": "def add_numbers(a, b):\n    return a + b\n\nresult = add_numbers(3, 5)",
      "options": ["8", "35", "undefined", "error"],
      "correctAnswer": 0,
      "explanation": "The function adds 3 + 5 = 8 and returns the result.",
      "difficulty": "easy",
      "points": 12,
      "timeLimit": 20
    },
    {
      "id": "function-2",
      "question": "What is printed by this code?",
      "code": "def greet(name):\n    return f\"Hello, {name}\"\n\nprint(greet(\"Alex\"))",
      "options": ["Hello, Alex", "Hello, name", "Alex", "greet Alex"],
      "correctAnswer": 0,
      "explanation": "The f-string substitutes {name} with \"Alex\", creating \"Hello, Alex\".",
      "difficulty": "medium",
      "points": 15,
      "timeLimit": 25
    },
    {
      "id": "function-3",
      "question": "How many parameters does this function have?",
      "code": "def calculate_area(length, width):\n    return length * width",
      "options": ["0", "1", "2", "3"],
      "correctAnswer": 2,
      "explanation": "The function has two parameters: length and width.",
      "difficulty": "easy",
      "points": 10,
      "timeLimit": 15
    }
  ]
}' WHERE id = 'bd-puzzle-3';

UPDATE lessons SET game_data = '{
  "time_bonus": 140,
  "streak_multiplier": 12,
  "questions": [
    {
      "id": "list-1",
      "question": "What is the length of this list?",
      "code": "fruits = [\"apple\", \"banana\", \"orange\"]\nprint(len(fruits))",
      "options": ["2", "3", "4", "0"],
      "correctAnswer": 1,
      "explanation": "The list contains 3 items: apple, banana, and orange.",
      "difficulty": "easy",
      "points": 10,
      "timeLimit": 15
    },
    {
      "id": "list-2",
      "question": "What does this code print?",
      "code": "numbers = [10, 20, 30, 40]\nprint(numbers[1])",
      "options": ["10", "20", "30", "40"],
      "correctAnswer": 1,
      "explanation": "List indexing starts at 0, so numbers[1] is the second item (20).",
      "difficulty": "medium",
      "points": 15,
      "timeLimit": 20
    },
    {
      "id": "list-3",
      "question": "What method adds an item to the end of a list?",
      "code": "my_list = [1, 2, 3]\nmy_list.______(4)",
      "options": ["add", "append", "insert", "push"],
      "correctAnswer": 1,
      "explanation": "The append() method adds items to the end of a list.",
      "difficulty": "medium",
      "points": 15,
      "timeLimit": 20
    }
  ]
}' WHERE id = 'bd-puzzle-4';

UPDATE lessons SET game_data = '{
  "time_bonus": 160,
  "streak_multiplier": 15,
  "questions": [
    {
      "id": "bug-1",
      "question": "What is wrong with this code?",
      "code": "def my_function()\n    return \"Hello\"",
      "options": ["Missing colon", "Missing indentation", "Wrong return", "Nothing wrong"],
      "correctAnswer": 0,
      "explanation": "Function definitions need a colon (:) after the parentheses.",
      "difficulty": "easy",
      "points": 12,
      "timeLimit": 20
    },
    {
      "id": "bug-2",
      "question": "What is wrong with this code?",
      "code": "message = Hello World\nprint(message)",
      "options": ["Missing quotes", "Wrong variable name", "Missing print", "Nothing wrong"],
      "correctAnswer": 0,
      "explanation": "String values need to be in quotes: \"Hello World\".",
      "difficulty": "easy",
      "points": 12,
      "timeLimit": 15
    },
    {
      "id": "bug-3",
      "question": "What is wrong with this code?",
      "code": "if age > 18\nprint(\"Adult\")",
      "options": ["Missing colon", "Missing indentation", "Wrong operator", "Nothing wrong"],
      "correctAnswer": 0,
      "explanation": "If statements need a colon (:) after the condition.",
      "difficulty": "easy",
      "points": 12,
      "timeLimit": 15
    }
  ]
}' WHERE id = 'bd-puzzle-5';

-- =====================================
-- BEGINNER STORY LESSONS (5)
-- =====================================

INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, story_data, estimated_minutes) VALUES
('bd-story-1', 'The Programmer\'s Journey Begins', 'Join Alex as they discover the magic of Python programming', 'beginner', 30, 1, 'section-beginner-stories', 'story', 30),
('bd-story-2', 'The Variable Mystery', 'Help Alex solve puzzles using variables and data types', 'beginner', 35, 2, 'section-beginner-stories', 'story', 35),
('bd-story-3', 'The Loop of Time', 'Guide Alex through the time loop using repetition in code', 'beginner', 40, 3, 'section-beginner-stories', 'story', 40),
('bd-story-4', 'The Conditional Path', 'Help Alex make decisions in a coding adventure', 'beginner', 45, 4, 'section-beginner-stories', 'story', 45),
('bd-story-5', 'The Function Workshop', 'Create reusable code with Alex in the inventor\'s workshop', 'beginner', 50, 5, 'section-beginner-stories', 'story', 50)
ON CONFLICT (id) DO NOTHING;

-- Update story_data for beginner story lessons
UPDATE lessons SET story_data = '{
  "setting": "A cozy bedroom where Alex discovers an old laptop with a mysterious programming language called Python",
  "protagonist": {
    "name": "Alex",
    "avatar": "👨‍💻",
    "role": "Curious Learner",
    "personality": "Eager, curious, slightly nervous but excited"
  },
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Discovery",
      "content": "Alex found the dusty laptop in the attic. Grandpa''s old programming machine. When they turned it on, a screen appeared with just one word: 'Python>'. Alex remembered grandpa saying, \"Python is like magic—you can make computers do amazing things with just a few words.\"\n\nA friendly pop-up appeared: \"Welcome! I''m Py, your Python guide. Ready to learn some magic?\"\n\nAlex nodded and typed: \"What can I do?\"\n\nPy replied: \"Let''s start with a simple spell. Try making the computer say hello!\"",
      "character": {
        "name": "Py",
        "avatar": "🐍",
        "role": "Python Guide",
        "personality": "Friendly, patient, encouraging"
      },
      "background": "A magical attic with books, old computers, and floating code symbols",
      "objectives": [
        "Write your first Python print statement",
        "Understand how to display text output",
        "Learn the basic structure of Python commands"
      ],
      "challenge": {
        "description": "Help Alex write their first Python program to greet the world",
        "starter_code": "# Help Alex say hello to the world\n\n# Your code here",
        "solution": "# Help Alex say hello to the world\n\nprint(\"Hello, World! I\"m learning Python magic!\")",
        "hints": [
          "Use the print() function to display text",
          "Text messages need to be in quotes",
          "Python will execute your code line by line"
        ],
        "explanation": "Congratulations! You''ve written your first Python program. The print() function is one of the most fundamental tools in Python—it lets you see what your program is doing and communicate with users."
      },
      "reward": {
        "xp": 15,
        "message": "Py cheers: \"Amazing! You''ve cast your first Python spell! The computer listened to you!\"",
        "item": "First Spell Badge"
      }
    },
    {
      "id": "chapter2",
      "title": "The Magic Words",
      "content": "The laptop screen glowed brighter. \"Excellent!\" said Py. \"Now let''s learn about variables—they''re like magic boxes where you can store things for later.\"\n\nAlex watched as Py demonstrated: \"Watch this! I can put my name in a box called 'greeting': greeting = \"Hello there!\"\"\n\nSuddenly, glowing boxes appeared on screen with labels. \"These are variables,\" Py explained. \"You can store text, numbers, or even true/false values. They help you remember things in your program.\"\n\n\"Can I try?\" Alex asked, fingers ready on the keyboard.",
      "character": {
        "name": "Py",
        "avatar": "🐍",
        "role": "Python Guide",
        "personality": "Enthusiastic teacher"
      },
      "background": "Magical floating boxes labeled with variable names",
      "objectives": [
        "Create and use variables in Python",
        "Store different types of data",
        "Display variable values using print()"
      ],
      "challenge": {
        "description": "Create variables to store Alex''s information and display them",
        "starter_code": "# Create variables for Alex\\'s information\n\nname = \"Alex\"\nage = 16\nloves_python = True\n\n# Print Alex\\'s information",
        "solution": "# Create variables for Alex\\'s information\n\nname = \"Alex\"\nage = 16\nloves_python = True\n\n# Print Alex\\'s information\nprint(f\"Name: {name}\")\nprint(f\"Age: {age}\")\nprint(f\"Loves Python: {loves_python}\")",
        "hints": [
          "Variables are created with: variable_name = value",
          "Use f-strings to include variables in print statements: f\"Text {variable}\"",
          "Boolean values are True or False (capitalized)"
        ],
        "explanation": "Fantastic! You''ve learned to use variables—they''re essential building blocks in programming. Variables let your programs remember and work with different pieces of information."
      },
      "reward": {
        "xp": 15,
        "message": "Py jumps with excitement: \"You''re a natural at this! Variables are your friends now!\"",
        "item": "Variable Master Badge"
      }
    }
  ]
}' WHERE id = 'bd-story-1';

UPDATE lessons SET story_data = '{
  "setting": "A mystical library where books have codes instead of words, and Alex meets the Data Guardian",
  "protagonist": {
    "name": "Alex",
    "avatar": "👨‍💻",
    "role": "Code Explorer",
    "personality": "Growing in confidence, curious about patterns"
  },
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Library of Types",
      "content": "Alex stepped into a library unlike any other—books floated in the air, and each page showed glowing code instead of words. A figure in a blue robe approached.\n\n\"Welcome, young programmer,\" said the Data Guardian. \"I am the keeper of Python''s data types. Each type has its own power and purpose.\"\n\nThe Guardian waved a hand, and three glowing orbs appeared:\n\n\"Text orbs (strings) hold words and sentences,\" the Guardian explained, touching a red orb that showed \"Hello\".\n\n\"Number orbs (integers and floats) hold mathematical values,\" a blue orb displayed 42.\n\n\"Truth orbs (booleans) hold only True or False,\" a green orb pulsed with True.",
      "character": {
        "name": "Data Guardian",
        "avatar": "🧙‍♂️",
        "role": "Knowledge Keeper",
        "personality": "Wise, patient, mysterious"
      },
      "background": "Ancient library with floating code books and magical data orbs",
      "objectives": [
        "Understand different Python data types",
        "Create variables of each type",
        "Use the type() function to identify data types"
      ],
      "challenge": {
        "description": "Help Alex collect different data types for the Guardian''s collection",
        "starter_code": "# Alex needs to collect different data types\n\n# Create a string variable\ntreasure_name = \n\n# Create an integer variable\ntreasure_value = \n\n# Create a boolean variable\nis_magical = \n\n# Show the types to the Guardian",
        "solution": "# Alex needs to collect different data types\n\n# Create a string variable\ntreasure_name = \"Crystal of Code\"\n\n# Create an integer variable\ntreasure_value = 100\n\n# Create a boolean variable\nis_magical = True\n\n# Show the types to the Guardian\nprint(f\"Treasure: {treasure_name} (Type: {type(treasure_name)})\")\nprint(f\"Value: {treasure_value} (Type: {type(treasure_value)})\")\nprint(f\"Magical: {is_magical} (Type: {type(is_magical)})\")",
        "hints": [
          "Strings need quotes: \"text\" or ''text''",
          "Integers are whole numbers without decimals",
          "Booleans are only True or False (capitalized)",
          "The type() function tells you what type of data you have"
        ],
        "explanation": "Excellent! You''ve mastered Python''s basic data types. Understanding data types is crucial because different types of data behave differently in your programs."
      },
      "reward": {
        "xp": 18,
        "message": "The Guardian bows: \"You understand the nature of data well. This knowledge will serve you greatly.\"",
        "item": "Data Scholar Badge"
      }
    },
    {
      "id": "chapter2",
      "title": "The Type Transformation",
      "content": "The Data Guardian led Alex to a chamber with a magical pool. \"This is the Pool of Transformation,\" they said. \"Sometimes you need to change data from one type to another.\"\n\n\"Can you really change types?\" Alex asked, amazed.\n\n\"Indeed! Watch.\" The Guardian picked up a string \"123\" and dropped it in the pool. It emerged as the number 123. \"You can convert text to numbers, numbers to text, and more. This is called type casting.\"",
      "character": {
        "name": "Data Guardian",
        "avatar": "🧙‍♂️",
        "role": "Transformation Guide",
        "personality": "Mystical, wise teacher"
      },
      "background": "Magical chamber with transformation pool and floating type symbols",
      "objectives": [
        "Learn type conversion functions",
        "Convert between strings and numbers",
        "Understand when and why to convert types"
      ],
      "challenge": {
        "description": "Help Alex transform data types to solve puzzles",
        "starter_code": "# Help Alex transform data types\n\ntext_number = \"42\"\ntext_decimal = \"3.14\"\nnumber = 10\n\n# Convert and combine to get 52.14\nresult = ",
        "solution": "# Help Alex transform data types\n\ntext_number = \"42\"\ntext_decimal = \"3.14\"\nnumber = 10\n\n# Convert and combine to get 52.14\nconverted_int = int(text_number)\nconverted_float = float(text_decimal)\nresult = converted_int + converted_float + number\n\nprint(f\"Final result: {result}\")",
        "hints": [
          "Use int() to convert strings to integers",
          "Use float() to convert strings to decimal numbers",
          "Use str() to convert numbers to strings",
          "Make sure to convert before doing math operations"
        ],
        "explanation": "Perfect! Type casting is a powerful technique that allows you to work with different data types together. Just remember that you can only convert valid data (you can''t convert \"hello\" to a number!)."
      },
      "reward": {
        "xp": 17,
        "message": "The Guardian smiles: \"You now wield the power of transformation! Use it wisely.\"",
        "item": "Type Transformer Badge"
      }
    }
  ]
}' WHERE id = 'bd-story-2';

UPDATE lessons SET story_data = '{
  "setting": "A time chamber where Alex is trapped in a time loop and must use loops to escape",
  "protagonist": {
    "name": "Alex",
    "avatar": "👨‍💻",
    "role": "Time Traveler",
    "personality": "Determined, problem-solver, learning to think systematically"
  },
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Time Loop",
      "content": "Suddenly, Alex found themselves in a strange room where clocks spun wildly. A glowing figure appeared—a being made of pure temporal energy.\n\n\"Welcome to the Loop Chamber,\" said the Temporal Guardian. \"You are trapped in a time loop, reliving the same moment over and over. To escape, you must master the power of repetition—loops!\"\n\nAlex looked around and saw numbers floating in the air: 1, 2, 3, 4, 5. \"What do these mean?\" they asked.\n\n\"They are the key to your escape,\" the Guardian explained. \"In programming, loops let you repeat actions efficiently. Instead of writing the same code five times, you write it once and let the loop handle the repetition.\"",
      "character": {
        "name": "Temporal Guardian",
        "avatar": "⏰",
        "role": "Time Keeper",
        "personality": "Mysterious, ancient, speaks in riddles"
      },
      "background": "Circular chamber with spinning clocks and floating numbers",
      "objectives": [
        "Understand the concept of loops in programming",
        "Write a basic for loop",
        "Use range() to control loop iterations"
      ],
      "challenge": {
        "description": "Help Alex break the time loop by counting from 1 to 5",
        "starter_code": "# Break the time loop by counting to 5\n\n# Your loop code here",
        "solution": "# Break the time loop by counting to 5\n\nfor i in range(1, 6):\n    print(f\"Time loop cycle {i}\")\n\nprint(\"Time loop broken! Free!\")",
        "hints": [
          "Use for loops when you know how many times to repeat",
          "range(1, 6) generates numbers 1, 2, 3, 4, 5",
          "Code inside the loop must be indented",
          "Each iteration will have a different value for i"
        ],
        "explanation": "You did it! The time loop is broken! Loops are fundamental to programming because they let you automate repetitive tasks efficiently."
      },
      "reward": {
        "xp": 20,
        "message": "The Temporal Guardian fades away: \"You have mastered time itself... well, programming time anyway!\"",
        "item": "Time Loop Breaker Badge"
      }
    },
    {
      "id": "chapter2",
      "title": "The Collection Clock",
      "content": "Free from the time loop, Alex entered the next chamber where they found the Collection Clock—a massive clock face with slots for items. The Temporal Guardian''s voice echoed: \"Impressive! Now let''s learn about iterating through collections.\"\n\nThe clock showed different items in each hour slot: apples, books, stars, coins. \"Sometimes you need to process each item in a collection,\" the Guardian explained. \"Python makes this elegant with simple loops.\"\n\nAlex approached the clock and saw it could hold any type of items. \"Can I try processing different collections?\" they asked.",
      "character": {
        "name": "Temporal Guardian",
        "avatar": "⏰",
        "role": "Collection Guide",
        "personality": "Teaching through metaphors of time and organization"
      },
      "background": "Giant clock with compartments for different items",
      "objectives": [
        "Loop through lists and other collections",
        "Access individual items in loops",
        "Process collections efficiently"
      ],
      "challenge": {
        "description": "Help Alex organize items in the Collection Clock",
        "starter_code": "# Organize items in the Collection Clock\n\nclock_items = [\"apple\", \"book\", \"star\", \"coin\", \"crystal\"]\n\n# Process each item\nfor item in clock_items:\n    # Your code here",
        "solution": "# Organize items in the Collection Clock\n\nclock_items = [\"apple\", \"book\", \"star\", \"coin\", \"crystal\"]\n\n# Process each item\nfor item in clock_items:\n    print(f\"Processing {item}...\")\n    print(f\"{item.title()} is ready!\")\n\nprint(\"All items organized successfully!\")",
        "hints": [
          "When looping through a list, each item gets assigned to the loop variable",
          "You can do any processing inside the loop",
          "Use the loop variable to access the current item",
          "All indented code inside the loop will repeat for each item"
        ],
        "explanation": "Brilliant! You''ve learned to iterate through collections efficiently. This is one of the most powerful concepts in programming—it lets you work with any amount of data using the same code."
      },
      "reward": {
        "xp": 20,
        "message": "The Collection Clock chimes: \"Organization mastered! The temporal forces approve!\"",
        "item": "Collection Organizer Badge"
      }
    }
  ]
}' WHERE id = 'bd-story-3';

UPDATE lessons SET story_data = '{
  "setting": "A crossroads where Alex must make choices that determine their path, learning conditional logic",
  "protagonist": {
    "name": "Alex",
    "avatar": "👨‍💻",
    "role": "Decision Maker",
    "personality": " thoughtful, learning to weigh options and consequences"
  },
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Path of Choices",
      "content": "Alex stood at a mystical crossroads where three paths diverged. A figure in gray robes—the Logic Guardian—appeared with a set of scales.\n\n\"Welcome, traveler,\" said the Logic Guardian. \"Before you lie three paths, each with different challenges. But you can only choose one based on the conditions you meet.\"\n\nThe Guardian showed Alex the requirements:\n- Path of Fire: Requires strength (age ≥ 18)\n- Path of Water: Requires wisdom (knowledge ≥ 10)\n- Path of Earth: Requires patience (experience ≥ 5)\n\n\"Programming is just like this,\" the Guardian explained. \"You make decisions based on conditions. If something is true, you do one thing; if it''s false, you do another. This is the power of conditional statements.\"",
      "character": {
        "name": "Logic Guardian",
        "avatar": "⚖️",
        "role": "Decision Guide",
        "personality": "Balanced, logical, teaches through choices"
      },
      "background": "Magical crossroads with three distinct paths glowing different colors",
      "objectives": [
        "Understand if statements and conditions",
        "Write basic conditional logic",
        "Learn comparison operators (>, <, >=, <=, ==, !=)"
      ],
      "challenge": {
        "description": "Help Alex choose the right path based on their abilities",
        "starter_code": "# Help Alex choose their path\n\nage = 16\nknowledge = 12\nexperience = 7\n\n# Check which path Alex can take\nif age >= 18:\n    print(\"You can take the Path of Fire!\")\nelif knowledge >= 10:\n    print(\"You can take the Path of Water!\")\n# Add more conditions",
        "solution": "# Help Alex choose their path\n\nage = 16\nknowledge = 12\nexperience = 7\n\n# Check which path Alex can take\nif age >= 18:\n    print(\"You can take the Path of Fire!\")\nelif knowledge >= 10:\n    print(\"You can take the Path of Water!\")\nelif experience >= 5:\n    print(\"You can take the Path of Earth!\")\nelse:\n    print(\"You need to train more before choosing a path\")",
        "hints": [
          "if statements check if a condition is True",
          "elif checks other conditions if the previous ones were False",
          "else runs if none of the above conditions were True",
          "Comparison operators: >= (greater or equal), <= (less or equal), == (equal)"
        ],
        "explanation": "Excellent choice! You''ve mastered conditional logic—this lets your programs make decisions and respond differently based on different situations."
      },
      "reward": {
        "xp": 23,
        "message": "The Logic Guardian nods: \"You understand the balance of choices. Your logic is sound!\"",
        "item": "Decision Maker Badge"
      }
    },
    {
      "id": "chapter2",
      "title": "The Gates of And/Or",
      "content": "Beyond the first choice, Alex encountered the Gates of And/Or—two massive gates that required specific combinations of conditions to open.\n\nThe Logic Guardian reappeared: \"Sometimes decisions are more complex. You need multiple conditions to be true, or just one of several conditions. This is where AND and OR logic comes in.\"\n\n\"AND logic means ALL conditions must be true,\" the Guardian said, pointing to the gate glowing blue.\n\n\"OR logic means AT LEAST ONE condition must be true,\" indicating the gate glowing red.\n\nAlex studied the gates carefully. This was getting complex, but exciting!",
      "character": {
        "name": "Logic Guardian",
        "avatar": "⚖️",
        "role": "Complex Logic Teacher",
        "personality": "Patient, breaks down complex ideas into simple terms"
      },
      "background": "Two giant gates with complex rune patterns showing AND/OR logic",
      "objectives": [
        "Combine multiple conditions with and/or",
        "Understand complex conditional logic",
        "Make decisions based on multiple factors"
      ],
      "challenge": {
        "description": "Help Alex open the gates by meeting complex conditions",
        "starter_code": "# Help Alex open the Gates of And/Or\n\nhas_key = True\nknows_spell = False\nis_strong = True\nis_brave = True\n\n# AND Gate: All conditions must be True\nif has_key and knows_spell:\n    print(\"AND Gate opened!\")\nelse:\n    print(\"AND Gate remains closed\")\n\n# OR Gate: At least one condition must be True",
        "solution": "# Help Alex open the Gates of And/Or\n\nhas_key = True\nknows_spell = False\nis_strong = True\nis_brave = True\n\n# AND Gate: All conditions must be True\nif has_key and knows_spell:\n    print(\"AND Gate opened!\")\nelse:\n    print(\"AND Gate remains closed - need both key and spell knowledge\")\n\n# OR Gate: At least one condition must be True\nif is_strong or is_brave:\n    print(\"OR Gate opened - strength or bravery is enough!\")\nelse:\n    print(\"OR Gate remains closed\")",
        "hints": [
          "and: All conditions must be True for the whole expression to be True",
          "or: At least one condition must be True for the whole expression to be True",
          "You can combine multiple and/or operators in one condition",
          "Use parentheses to group conditions when needed: (A and B) or C"
        ],
        "explanation": "Incredible! You''ve mastered complex conditional logic. The ability to combine conditions makes your programs much more powerful and flexible."
      },
      "reward": {
        "xp": 22,
        "message": "Both gates swing open! The Logic Guardian bows: \"Complex logic is your ally now!\"",
        "item": "Logic Master Badge"
      }
    }
  ]
}' WHERE id = 'bd-story-4';

UPDATE lessons SET story_data = '{
  "setting": "An inventor\'s workshop filled with strange devices and blueprints, where Alex meets the Function Master",
  "protagonist": {
    "name": "Alex",
    "avatar": "👨‍💻",
    "role": "Apprentice Inventor",
    "personality": "Creative, thinking about efficiency and reusability"
  },
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Workshop of Reusability",
      "content": "Alex entered a workshop unlike any other—half-finished inventions floated in the air, and blueprints covered every wall. A figure with goggles and a tool belt approached.\n\n\"Welcome! I''m the Function Master,\" they said, adjusting their goggles. \"This is where we create reusable code—functions! Instead of doing the same work over and over, we build machines that do the work for us.\"\n\nThe Function Master picked up a blueprint. \"See this? A function is like a machine: you put inputs in, it does something, and you get outputs out. Once built, you can use it over and over!\"\n\nAlex looked around the workshop at devices labeled with names like 'greet()', 'calculate()', 'transform()'. Each one was a self-contained tool for a specific job.",
      "character": {
        "name": "Function Master",
        "avatar": "🔧",
        "role": "Code Inventor",
        "personality": "Energetic, practical, loves efficiency and good design"
      },
      "background": "Busy workshop with floating tools, blueprints, and half-finished function machines",
      "objectives": [
        "Understand what functions are and why they''re useful",
        "Write a basic function with parameters",
        "Call functions and use their return values"
      ],
      "challenge": {
        "description": "Help Alex build their first function machine",
        "starter_code": "# Build Alex\\'s first function machine\n\ndef greet_person(name):\n    # Your function body here\n    \n# Test the function\nresult = greet_person(\"Alex\")\nprint(result)",
        "solution": "# Build Alex\\'s first function machine\n\ndef greet_person(name):\n    return f\"Hello, {name}! Welcome to the workshop!\"\n    \n# Test the function\nresult = greet_person(\"Alex\")\nprint(result)",
        "hints": [
          "Functions start with def, followed by the function name and parameters",
          "Parameters go in parentheses and act as inputs to your function",
          "Use return to send a value back from the function",
          "Once defined, you can call the function by name with arguments"
        ],
        "explanation": "Fantastic! You''ve built your first function! Functions are fundamental to programming because they let you reuse code, keep your programs organized, and break complex problems into smaller pieces."
      },
      "reward": {
        "xp": 25,
        "message": "The Function Master high-fives you: \"You\\'ve got the inventor\\'s spirit! Functions are your tools now!\"",
        "item": "Function Builder Badge"
      }
    },
    {
      "id": "chapter2",
      "title": "The Assembly Line",
      "content": "The Function Master led Alex to a massive assembly line where function machines were being combined. \"Impressive! Now let''s learn about creating specialized tools. Functions can have different numbers of parameters and default values.\"\n\nAlex watched as machines with different configurations passed by:\n- A simple greeter (1 parameter)\n- A calculator (2 parameters)  \n- A multi-tool (many parameters with defaults)\n\n\"Great inventors don''t just build one-size-fits-all tools,\" the Master explained. \"They create flexible functions that can handle different situations. You can give parameters default values, or even accept any number of inputs!\"",
      "character": {
        "name": "Function Master",
        "avatar": "🔧",
        "role": "Advanced Function Designer",
        "personality": "Passionate about good design and flexibility"
      },
      "background": "Assembly line with various function machines being assembled and tested",
      "objectives": [
        "Create functions with multiple parameters",
        "Use default parameter values",
        "Understand function flexibility and design"
      ],
      "challenge": {
        "description": "Help Alex design flexible function machines",
        "starter_code": "# Design flexible function machines\n\ndef create_profile(name, role, experience_level=\"beginner\"):\n    # Create a user profile with default values\n    \ndef calculate_sum(a, b, c=0):\n    # Add three numbers, with c defaulting to 0\n    \n# Test both functions\nprint(create_profile(\"Alex\", \"Learner\"))\nprint(calculate_sum(5, 10))",
        "solution": "# Design flexible function machines\n\ndef create_profile(name, role, experience_level=\"beginner\"):\n    return f\"{name} - {role} ({experience_level})\"\n    \ndef calculate_sum(a, b, c=0):\n    return a + b + c\n    \n# Test both functions\nprint(create_profile(\"Alex\", \"Learner\"))\nprint(create_profile(\"Sam\", \"Developer\", \"expert\"))\nprint(calculate_sum(5, 10))\nprint(calculate_sum(5, 10, 15))",
        "hints": [
          "Default values are used when arguments aren''t provided",
          "You can mix required and optional parameters",
          "Functions become more flexible with well-chosen defaults",
          "Call functions with positional or keyword arguments"
        ],
        "explanation": "Brilliant work! You''ve learned to create flexible, reusable functions. This is a key skill for writing clean, maintainable code that other programmers (and future you!) will appreciate."
      },
      "reward": {
        "xp": 25,
        "message": "The Function Master hands you a golden wrench: \"You\\'re ready to invent! Build amazing things with functions!\"",
        "item": "Master Inventor Badge"
      }
    }
  ]
}' WHERE id = 'bd-story-5';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_beginner_lessons ON lessons(section_id, lesson_type);
CREATE INDEX IF NOT EXISTS idx_beginner_sections ON sections(path);

-- Verify the data was inserted
SELECT
  s.title as section_title,
  COUNT(l.id) as lesson_count,
  STRING_AGG(DISTINCT l.lesson_type, ', ') as lesson_types
FROM lessons l
JOIN sections s ON l.section_id = s.id
WHERE s.id LIKE 'section-beginner-%'
GROUP BY s.title
ORDER BY s.order_index;