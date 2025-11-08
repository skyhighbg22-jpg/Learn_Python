/*
  # PyLearn Comprehensive Lesson Library - Intermediate Lessons

  ## Overview
  20 intermediate lessons covering applied Python concepts and practical problem-solving
  through interactive drag-drop, puzzle game, and story-based learning.

  ## Structure
  - 7 Drag & Drop Lessons: Real-world code arrangement and structure
  - 7 Puzzle Game Lessons: Complex problem-solving and debugging challenges
  - 6 Story Lessons: Project-based learning with professional scenarios

  ## Target Audience
  Learners who understand Python basics and want to apply concepts to real problems
*/

-- Insert new sections for intermediate learning path
INSERT INTO sections (id, title, description, path, order_index, unlock_requirement_xp) VALUES
('section-intermediate-dragdrop', 'Applied Python', 'Real-world code arrangement and structure', 'applied-python', 4, 100),
('section-intermediate-puzzles', 'Problem Solving', 'Python challenges and complex puzzles', 'applied-python', 5, 150),
('section-intermediate-stories', 'Python Projects', 'Story-based project learning', 'applied-python', 6, 200)
ON CONFLICT (id) DO NOTHING;

-- =====================================
-- INTERMEDIATE DRAG & DROP LESSONS (7)
-- =====================================

INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, drag_drop_data, estimated_minutes) VALUES
('im-dragdrop-1', 'Dictionary Master', 'Work with key-value pairs and data mapping', 'intermediate', 28, 1, 'section-intermediate-dragdrop', 'drag-drop', 28),
('im-dragdrop-2', 'File Operations', 'Arrange code for reading and writing files', 'intermediate', 30, 2, 'section-intermediate-dragdrop', 'drag-drop', 30),
('im-dragdrop-3', 'Error Handling', 'Build try/except blocks for robust code', 'intermediate', 32, 3, 'section-intermediate-dragdrop', 'drag-drop', 32),
('im-dragdrop-4', 'List Comprehensions', 'Master advanced list processing techniques', 'intermediate', 35, 4, 'section-intermediate-dragdrop', 'drag-drop', 35),
('im-dragdrop-5', 'Function Parameters', 'Work with default arguments and keyword parameters', 'intermediate', 33, 5, 'section-intermediate-dragdrop', 'drag-drop', 33),
('im-dragdrop-6', 'Class Structure', 'Arrange basic object-oriented programming concepts', 'intermediate', 38, 6, 'section-intermediate-dragdrop', 'drag-drop', 38),
('im-dragdrop-7', 'Module Imports', 'Organize code with imports and namespaces', 'intermediate', 35, 7, 'section-intermediate-dragdrop', 'drag-drop', 35)
ON CONFLICT (id) DO NOTHING;

-- Update drag_drop_data for intermediate drag-drop lessons
UPDATE lessons SET drag_drop_data = '{
  "instructions": "Create a dictionary to store student information and perform operations. Dictionaries are perfect for storing related data with meaningful keys instead of numeric indices.",
  "code_blocks": [
    {
      "id": "create-dict",
      "content": "student = {",
      "type": "code",
      "indent": 0
    },
    {
      "id": "name-key",
      "content": "\"name\": \"Sarah Johnson\",",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "age-key",
      "content": "\"age\": 20,",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "grades-key",
      "content": "\"grades\": [85, 92, 78, 95]",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "close-dict",
      "content": "}",
      "type": "code",
      "indent": 0
    },
    {
      "id": "access-name",
      "content": "print(f\"Student: {student[\"name\"]}\")",
      "type": "code",
      "indent": 0
    },
    {
      "id": "calculate-average",
      "content": "average = sum(student[\"grades\"]) / len(student[\"grades\"])",
      "type": "code",
      "indent": 0
    },
    {
      "id": "print-average",
      "content": "print(f\"Average grade: {average:.1f}\")",
      "type": "code",
      "indent": 0
    }
  ],
  "correct_order": ["create-dict", "name-key", "age-key", "grades-key", "close-dict", "access-name", "calculate-average", "print-average"],
  "hints": [
    "Dictionaries use curly braces {} and key-value pairs",
    "Keys are strings in quotes, followed by colons and values",
    "Access values using square brackets: dictionary[key]",
    "You can perform calculations with dictionary values just like variables"
  ],
  "difficulty": "intermediate"
}' WHERE id = 'im-dragdrop-1';

UPDATE lessons SET drag_drop_data = '{
  "instructions": "Build code to read from a file, process the content, and write results to another file. File operations are essential for real-world data processing tasks.",
  "code_blocks": [
    {
      "id": "open-input",
      "content": "with open(\"input.txt\", \"r\") as input_file:",
      "type": "code",
      "indent": 0
    },
    {
      "id": "read-content",
      "content": "content = input_file.read()",
      "type": "code",
      "indent": 4
    },
    {
      "id": "process-content",
      "content": "processed = content.upper().replace(\" \", \"_\")",
      "type": "code",
      "indent": 0
    },
    {
      "id": "open-output",
      "content": "with open(\"output.txt\", \"w\") as output_file:",
      "type": "code",
      "indent": 0
    },
    {
      "id": "write-output",
      "content": "output_file.write(processed)",
      "type": "code",
      "indent": 4
    },
    {
      "id": "print-success",
      "content": "print(\"File processing complete!\")",
      "type": "code",
      "indent": 0
    }
  ],
  "correct_order": ["open-input", "read-content", "process-content", "open-output", "write-output", "print-success"],
  "hints": [
    "Use 'with open()' for safe file handling",
    "\"r\" mode reads files, \"w\" mode writes files",
    "The 'with' statement automatically closes files",
    "You can chain string methods like .upper().replace()"
  ],
  "difficulty": "intermediate"
}' WHERE id = 'im-dragdrop-2';

UPDATE lessons SET drag_drop_data = '{
  "instructions": "Create robust error handling for a division calculator. Good error handling prevents crashes and provides helpful feedback to users.",
  "code_blocks": [
    {
      "id": "define-function",
      "content": "def safe_divide(a, b):",
      "type": "function",
      "indent": 0
    },
    {
      "id": "try-block",
      "content": "try:",
      "type": "code",
      "indent": 4
    },
    {
      "id": "division-operation",
      "content": "result = a / b",
      "type": "code",
      "indent": 8
    },
    {
      "id": "return-success",
      "content": "return result",
      "type": "code",
      "indent": 8
    },
    {
      "id": "except-zero",
      "content": "except ZeroDivisionError:",
      "type": "code",
      "indent": 4
    },
    {
      "id": "return-error",
      "content": "return \"Error: Cannot divide by zero\"",
      "type": "code",
      "indent": 8
    },
    {
      "id": "except-type",
      "content": "except TypeError:",
      "type": "code",
      "indent": 4
    },
    {
      "id": "return-type-error",
      "content": "return \"Error: Invalid input types\"",
      "type": "code",
      "indent": 8
    },
    {
      "id": "test-function",
      "content": "print(safe_divide(10, 2))  # Should print 5.0",
      "type": "code",
      "indent": 0
    }
  ],
  "correct_order": ["define-function", "try-block", "division-operation", "return-success", "except-zero", "return-error", "except-type", "return-type-error", "test-function"],
  "hints": [
    "Try blocks contain code that might cause errors",
    "Except blocks catch specific types of errors",
    "ZeroDivisionError occurs when dividing by zero",
    "TypeError occurs with incompatible data types"
  ],
  "difficulty": "intermediate"
}' WHERE id = 'im-dragdrop-3';

UPDATE lessons SET drag_drop_data = '{
  "instructions": "Transform a list processing loop into a concise list comprehension. List comprehensions are Pythonic and efficient ways to create new lists.",
  "code_blocks": [
    {
      "id": "original-list",
      "content": "numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "list-comprehension",
      "content": "squares = [x**2 for x in numbers if x % 2 == 0]",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "nested-comprehension",
      "content": "matrix = [[i*j for j in range(3)] for i in range(3)]",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "print-squares",
      "content": "print(f\"Even squares: {squares}\")",
      "type": "code",
      "indent": 0
    },
    {
      "id": "print-matrix",
      "content": "print(\"Multiplication table:\")",
      "type": "code",
      "indent": 0
    },
    {
      "id": "print-rows",
      "content": "for row in matrix:",
      "type": "code",
      "indent": 0
    },
    {
      "id": "print-row-content",
      "content": "print(row)",
      "type": "code",
      "indent": 4
    }
  ],
  "correct_order": ["original-list", "list-comprehension", "nested-comprehension", "print-squares", "print-matrix", "print-rows", "print-row-content"],
  "hints": [
    "List comprehensions follow the pattern: [expression for item in iterable if condition]",
    "They combine loops and conditions into one concise line",
    "Nested comprehensions can create 2D structures",
    "The if clause is optional for filtering"
  ],
  "difficulty": "intermediate"
}' WHERE id = 'im-dragdrop-4';

UPDATE lessons SET drag_drop_data = '{
  "instructions": "Create a flexible function with default parameters and keyword arguments. This makes functions more versatile and easier to use.",
  "code_blocks": [
    {
      "id": "function-header",
      "content": "def create_user_profile(username, email, age=None, role=\"user\", **kwargs):",
      "type": "function",
      "indent": 0
    },
    {
      "id": "profile-dict",
      "content": "profile = {",
      "type": "code",
      "indent": 4
    },
    {
      "id": "required-fields",
      "content": "\"username\": username, \"email\": email,",
      "type": "variable",
      "indent": 8
    },
    {
      "id": "optional-age",
      "content": "\"age\": age,",
      "type": "variable",
      "indent": 8
    },
    {
      "id": "default-role",
      "content": "\"role\": role",
      "type": "variable",
      "indent": 8
    },
    {
      "id": "update-kwargs",
      "content": "profile.update(kwargs)",
      "type": "code",
      "indent": 4
    },
    {
      "id": "close-dict",
      "content": "}",
      "type": "code",
      "indent": 4
    },
    {
      "id": "return-profile",
      "content": "return profile",
      "type": "code",
      "indent": 4
    },
    {
      "id": "test-calls",
      "content": "# Test different ways to call the function",
      "type": "comment",
      "indent": 0
    }
  ],
  "correct_order": ["function-header", "profile-dict", "required-fields", "optional-age", "default-role", "update-kwargs", "close-dict", "return-profile", "test-calls"],
  "hints": [
    "Default parameters (age=None, role=\"user\") are optional",
    "**kwargs captures any additional keyword arguments",
    "Use .update() to merge dictionaries",
    "Functions can be called with positional or keyword arguments"
  ],
  "difficulty": "intermediate"
}' WHERE id = 'im-dragdrop-5';

UPDATE lessons SET drag_drop_data = '{
  "instructions": "Arrange code to create a basic class with methods and attributes. Classes are blueprints for creating objects with shared properties and behaviors.",
  "code_blocks": [
    {
      "id": "class-definition",
      "content": "class BankAccount:",
      "type": "code",
      "indent": 0
    },
    {
      "id": "init-method",
      "content": "def __init__(self, account_holder, initial_balance=0):",
      "type": "function",
      "indent": 4
    },
    {
      "id": "assign-attributes",
      "content": "self.account_holder = account_holder",
      "type": "code",
      "indent": 8
    },
    {
      "id": "assign-balance",
      "content": "self.balance = initial_balance",
      "type": "code",
      "indent": 8
    },
    {
      "id": "deposit-method",
      "content": "def deposit(self, amount):",
      "type": "function",
      "indent": 4
    },
    {
      "id": "deposit-logic",
      "content": "if amount > 0: self.balance += amount",
      "type": "code",
      "indent": 8
    },
    {
      "id": "withdraw-method",
      "content": "def withdraw(self, amount):",
      "type": "function",
      "indent": 4
    },
    {
      "id": "withdraw-logic",
      "content": "if 0 < amount <= self.balance: self.balance -= amount",
      "type": "code",
      "indent": 8
    },
    {
      "id": "str-method",
      "content": "def __str__(self):",
      "type": "function",
      "indent": 4
    },
    {
      "id": "str-return",
      "content": "return f\"{self.account_holder}: ${self.balance:.2f}\"",
      "type": "code",
      "indent": 8
    }
  ],
  "correct_order": ["class-definition", "init-method", "assign-attributes", "assign-balance", "deposit-method", "deposit-logic", "withdraw-method", "withdraw-logic", "str-method", "str-return"],
  "hints": [
    "__init__ is the constructor method called when creating objects",
    "self refers to the instance being created",
    "Methods are functions defined inside classes",
    "__str__ defines the string representation of objects"
  ],
  "difficulty": "intermediate"
}' WHERE id = 'im-dragdrop-6';

UPDATE lessons SET drag_drop_data = '{
  "instructions": "Organize code using imports and understand module namespaces. Imports let you use code from other modules and libraries.",
  "code_blocks": [
    {
      "id": "import-random",
      "content": "import random",
      "type": "code",
      "indent": 0
    },
    {
      "id": "import-specific",
      "content": "from datetime import datetime, timedelta",
      "type": "code",
      "indent": 0
    },
    {
      "id": "import-with-alias",
      "content": "import numpy as np",
      "type": "code",
      "indent": 0
    },
    {
      "id": "use-random",
      "content": "numbers = [random.randint(1, 100) for _ in range(5)]",
      "type": "code",
      "indent": 0
    },
    {
      "id": "use-datetime",
      "content": "now = datetime.now()",
      "type": "code",
      "indent": 0
    },
    {
      "id": "future-date",
      "content": "future = now + timedelta(days=30)",
      "type": "code",
      "indent": 0
    },
    {
      "id": "use-numpy",
      "content": "array = np.array([1, 2, 3, 4, 5])",
      "type": "code",
      "indent": 0
    },
    {
      "id": "print-results",
      "content": "print(f\"Random numbers: {numbers}\")",
      "type": "code",
      "indent": 0
    }
  ],
  "correct_order": ["import-random", "import-specific", "import-with-alias", "use-random", "use-datetime", "future-date", "use-numpy", "print-results"],
  "hints": [
    "import module brings in entire module",
    "from module import item brings in specific items",
    "import module as alias creates a shorter name",
    "Use module.item or alias.item to access imported content"
  ],
  "difficulty": "intermediate"
}' WHERE id = 'im-dragdrop-7';

-- =====================================
-- INTERMEDIATE PUZZLE GAME LESSONS (7)
-- =====================================

INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, game_data, estimated_minutes) VALUES
('im-puzzle-1', 'Algorithm Challenge', 'Solve simple algorithm problems and optimization tasks', 'intermediate', 35, 1, 'section-intermediate-puzzles', 'puzzle', 35),
('im-puzzle-2', 'String Manipulation Masters', 'Advanced string operations and text processing', 'intermediate', 38, 2, 'section-intermediate-puzzles', 'puzzle', 38),
('im-puzzle-3', 'Data Structure Dash', 'Quick identification of lists, tuples, sets, and dictionaries', 'intermediate', 40, 3, 'section-intermediate-puzzles', 'puzzle', 40),
('im-puzzle-4', 'Error Detection Expert', 'Find logical errors in complex code snippets', 'intermediate', 42, 4, 'section-intermediate-puzzles', 'puzzle', 42),
('im-puzzle-5', 'Code Optimization Race', 'Choose the most efficient solution for problems', 'intermediate', 45, 5, 'section-intermediate-puzzles', 'puzzle', 45),
('im-puzzle-6', 'Python Standard Library', 'Identify correct imports and functions for tasks', 'intermediate', 43, 6, 'section-intermediate-puzzles', 'puzzle', 43),
('im-puzzle-7', 'Debugging Detective', 'Complex bug finding in real-world scenarios', 'intermediate', 48, 7, 'section-intermediate-puzzles', 'puzzle', 48)
ON CONFLICT (id) DO NOTHING;

-- Update game_data for intermediate puzzle lessons
UPDATE lessons SET game_data = '{
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
    },
    {
      "id": "algorithm-2",
      "question": "Which approach is more efficient for finding if a number exists in a sorted list?",
      "code": "# List: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]",
      "options": ["Linear search from start", "Binary search dividing the list", "Check random positions", "Sort then search"],
      "correctAnswer": 1,
      "explanation": "Binary search on sorted lists has O(log n) complexity, much better than O(n) linear search.",
      "difficulty": "medium",
      "points": 25,
      "timeLimit": 35
    },
    {
      "id": "algorithm-3",
      "question": "What does this function calculate?",
      "code": "def mystery_func(n):\n    if n <= 1:\n        return n\n    return mystery_func(n-1) + mystery_func(n-2)",
      "options": ["Factorial", "Fibonacci", "Sum of numbers", "Power of 2"],
      "correctAnswer": 1,
      "explanation": "This is the classic recursive Fibonacci sequence calculation.",
      "difficulty": "hard",
      "points": 30,
      "timeLimit": 40
    }
  ]
}' WHERE id = 'im-puzzle-1';

UPDATE lessons SET game_data = '{
  "time_bonus": 180,
  "streak_multiplier": 18,
  "questions": [
    {
      "id": "string-1",
      "question": "What is the result of this string operation?",
      "code": "text = \"Python Programming\"\nresult = text[:6] + text[11:]",
      "options": ["Python Programming", "Python Program", "Pythonogramming", "Pythonming"],
      "correctAnswer": 2,
      "explanation": "text[:6] gets 'Python' and text[11:] gets 'ogramming', combining to 'Pythonogramming'.",
      "difficulty": "medium",
      "points": 18,
      "timeLimit": 25
    },
    {
      "id": "string-2",
      "question": "Which method removes whitespace from both ends of a string?",
      "code": "text = \"   Hello World   \"\ncleaned = text._____()",
      "options": ["clean()", "strip()", "trim()", "remove()"],
      "correctAnswer": 1,
      "explanation": "The strip() method removes leading and trailing whitespace from strings.",
      "difficulty": "medium",
      "points": 20,
      "timeLimit": 20
    },
    {
      "id": "string-3",
      "question": "What does this regular expression find?",
      "code": "import re\npattern = r\"\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b\"",
      "options": ["Phone numbers", "Email addresses", "URLs", "Postal codes"],
      "correctAnswer": 1,
      "explanation": "This regex pattern matches the standard format of email addresses.",
      "difficulty": "hard",
      "points": 25,
      "timeLimit": 30
    }
  ]
}' WHERE id = 'im-puzzle-2';

UPDATE lessons SET game_data = '{
  "time_bonus": 190,
  "streak_multiplier": 19,
  "questions": [
    {
      "id": "data-structure-1",
      "question": "Which data structure does not allow duplicate elements?",
      "code": "numbers = [1, 2, 2, 3, 3, 3, 4]\nunique_numbers = _____(numbers)",
      "options": ["list()", "tuple()", "set()", "dict()"],
      "correctAnswer": 2,
      "explanation": "Sets automatically remove duplicate elements, keeping only unique values.",
      "difficulty": "easy",
      "points": 15,
      "timeLimit": 20
    },
    {
      "id": "data-structure-2",
      "question": "What is the main difference between lists and tuples?",
      "code": "# Mutable vs Immutable",
      "options": ["Lists are faster", "Tuples can be changed", "Lists are mutable, tuples are immutable", "Tuples have more methods"],
      "correctAnswer": 2,
      "explanation": "Lists can be modified after creation (mutable), while tuples cannot be changed (immutable).",
      "difficulty": "medium",
      "points": 18,
      "timeLimit": 25
    },
    {
      "id": "data-structure-3",
      "question": "Which data structure would be best for counting word frequencies?",
      "code": "text = \"hello world hello python world\"",
      "options": ["List", "Tuple", "Set", "Dictionary"],
      "correctAnswer": 3,
      "explanation": "Dictionaries are perfect for counting frequencies with words as keys and counts as values.",
      "difficulty": "medium",
      "points": 20,
      "timeLimit": 25
    }
  ]
}' WHERE id = 'im-puzzle-3';

UPDATE lessons SET game_data = '{
  "time_bonus": 210,
  "streak_multiplier": 22,
  "questions": [
    {
      "id": "error-1",
      "question": "What is wrong with this list comprehension?",
      "code": "numbers = [1, 2, 3, 4, 5]\nsquares = [x**2 for x in numbers if x > 0]",
      "options": ["Syntax error", "Logic error", "Performance issue", "Nothing wrong"],
      "correctAnswer": 3,
      "explanation": "This code is actually correct! It creates squares of positive numbers.",
      "difficulty": "medium",
      "points": 20,
      "timeLimit": 30
    },
    {
      "id": "error-2",
      "question": "What logical error exists in this code?",
      "code": "def calculate_average(numbers):\n    total = 0\n    for num in numbers:\n        total += num\n    return total / len(numbers)",
      "options": ["Division by zero possible", "Off-by-one error", "Wrong calculation", "Type error"],
      "correctAnswer": 0,
      "explanation": "If numbers is an empty list, len(numbers) is 0, causing division by zero.",
      "difficulty": "hard",
      "points": 25,
      "timeLimit": 35
    },
    {
      "id": "error-3",
      "question": "What's wrong with this file handling code?",
      "code": "data = read_file(\"data.txt\")\nprocessed = data.upper()\nwrite_file(\"output.txt\", processed)",
      "options": "File not closed, Missing error handling, Wrong order, All of the above",
      "options": ["File not closed", "Missing error handling", "Wrong order", "All of the above"],
      "correctAnswer": 3,
      "explanation": "The code lacks proper file closing, error handling, and should use 'with' statements.",
      "difficulty": "hard",
      "points": 28,
      "timeLimit": 40
    }
  ]
}' WHERE id = 'im-puzzle-4';

UPDATE lessons SET game_data = '{
  "time_bonus": 220,
  "streak_multiplier": 25,
  "questions": [
    {
      "id": "optimization-1",
      "question": "Which is more efficient for checking membership?",
      "code": "# Check if 'item' exists in collection",
      "options": ["item in my_list", "item in my_set", "item in my_tuple", "item in my_string"],
      "correctAnswer": 1,
      "explanation": "Set membership testing is O(1) average time, while list/tuple is O(n) linear time.",
      "difficulty": "medium",
      "points": 22,
      "timeLimit": 30
    },
    {
      "id": "optimization-2",
      "question": "Which approach is better for building a large string?",
      "code": "# Building a 1000-character string",
      "options": ["String concatenation with +", "List and join()", "String formatting", "Repeated replacement"],
      "correctAnswer": 1,
      "explanation": "Building a list and joining is much faster than repeated string concatenation.",
      "difficulty": "medium",
      "points": 25,
      "timeLimit": 35
    }
  ]
}' WHERE id = 'im-puzzle-5';

UPDATE lessons SET game_data = '{
  "time_bonus": 200,
  "streak_multiplier": 20,
  "questions": [
    {
      "id": "stdlib-1",
      "question": "Which module would you use for working with dates and times?",
      "options": ["time", "datetime", "calendar", "All of the above"],
      "correctAnswer": 3,
      "explanation": "Python has multiple modules for date/time work: time, datetime, and calendar.",
      "difficulty": "easy",
      "points": 15,
      "timeLimit": 20
    },
    {
      "id": "stdlib-2",
      "question": "Which function would you use to get the current working directory?",
      "code": "import os\ncwd = os._____()",
      "options": ["get_path()", "current_dir()", "getcwd()", "working_directory()"],
      "correctAnswer": 2,
      "explanation": "os.getcwd() returns the current working directory path.",
      "difficulty": "medium",
      "points": 18,
      "timeLimit": 25
    }
  ]
}' WHERE id = 'im-puzzle-6';

UPDATE lessons SET game_data = '{
  "time_bonus": 230,
  "streak_multiplier": 25,
  "questions": [
    {
      "id": "debug-1",
      "question": "Why does this code produce unexpected results?",
      "code": "def add_item(item, items=[]):\n    items.append(item)\n    return items\n\nprint(add_item(1))  # [1]\nprint(add_item(2))  # [1, 2] ??",
      "options": ["List is shared between calls", "Append returns wrong value", "Function signature wrong", "Scope issue"],
      "correctAnswer": 0,
      "explanation": "Default mutable arguments (like lists) are created once and shared between function calls.",
      "difficulty": "hard",
      "points": 30,
      "timeLimit": 40
    }
  ]
}' WHERE id = 'im-puzzle-7';

-- =====================================
-- INTERMEDIATE STORY LESSONS (6)
-- =====================================

INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, story_data, estimated_minutes) VALUES
('im-story-1', 'The Data Scientist\'s Assistant', 'Help analyze real data using Python data science tools', 'intermediate', 45, 1, 'section-intermediate-stories', 'story', 45),
('im-story-2', 'The Web Scraper\'s Adventure', 'Extract information from websites using Python', 'intermediate', 50, 2, 'section-intermediate-stories', 'story', 50),
('im-story-3', 'The File Manager\'s Quest', 'Organize digital files programmatically', 'intermediate', 55, 3, 'section-intermediate-stories', 'story', 55),
('im-story-4', 'The API Integration Mystery', 'Connect to external services and APIs', 'intermediate', 60, 4, 'section-intermediate-stories', 'story', 60),
('im-story-5', 'The Automation Hero', 'Automate repetitive tasks with Python scripts', 'intermediate', 65, 5, 'section-intermediate-stories', 'story', 65),
('im-story-6', 'The Game Developer', 'Create simple games using Python programming', 'intermediate', 70, 6, 'section-intermediate-stories', 'story', 70)
ON CONFLICT (id) DO NOTHING;

-- Update story_data for intermediate story lessons
UPDATE lessons SET story_data = '{
  "setting": "A modern data science lab where Alex meets Dr. Sarah Chen, a data scientist working on analyzing customer behavior patterns",
  "protagonist": {
    "name": "Alex",
    "avatar": "👨‍💻",
    "role": "Data Science Assistant",
    "personality": "Analytical, detail-oriented, excited about real-world applications"
  },
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Data Analysis Challenge",
      "content": "Alex entered the sleek data science lab, where monitors displayed colorful charts and graphs. Dr. Chen looked up from her keyboard, eyes bright with excitement.\n\n\"Perfect timing!\" she said. \"I have thousands of customer records, but I need to analyze them quickly. Can you help me write some Python scripts to process this data?\"\n\nOn the screen, Alex saw rows of customer information: names, ages, purchase amounts, and dates. \"This looks like real business data!\" Alex said. \"What exactly do you need to find out?\"\n\n\"I need to calculate average purchase amounts by age group, find our most valuable customers, and identify trends over time,\" Dr. Chen explained. \"This will help us make better business decisions.\"",
      "character": {
        "name": "Dr. Sarah Chen",
        "avatar": "👩‍🔬",
        "role": "Data Scientist",
        "personality": "Enthusiastic, practical, loves turning data into insights"
      },
      "background": "Modern data science lab with multiple monitors showing data visualizations",
      "objectives": [
        "Process real-world data using Python dictionaries and lists",
        "Calculate statistics and group data by categories",
        "Create data aggregation functions"
      ],
      "challenge": {
        "description": "Help Dr. Chen analyze customer data to find valuable business insights",
        "starter_code": "# Customer data analysis\n\ncustomers = [\n    {\"name\": \"Alice\", \"age\": 25, \"purchases\": [120, 89, 200]},\n    {\"name\": \"Bob\", \"age\": 32, \"purchases\": [50, 75, 100, 125]},\n    {\"name\": \"Carol\", \"age\": 28, \"purchases\": [300, 150]}\n]\n\n# Calculate average purchase by age group\ndef analyze_by_age_group(customers):\n    # Your analysis code here\n    pass",
        "solution": "# Customer data analysis\n\ncustomers = [\n    {\"name\": \"Alice\", \"age\": 25, \"purchases\": [120, 89, 200]},\n    {\"name\": \"Bob\", \"age\": 32, \"purchases\": [50, 75, 100, 125]},\n    {\"name\": \"Carol\", \"age\": 28, \"purchases\": [300, 150]}\n]\n\n# Calculate average purchase by age group\ndef analyze_by_age_group(customers):\n    age_groups = {\"20-29\": [], \"30-39\": []}\n    \n    for customer in customers:\n        age = customer[\"age\"]\n        avg_purchase = sum(customer[\"purchases\"]) / len(customer[\"purchases\"])\n        \n        if 20 <= age <= 29:\n            age_groups[\"20-29\"].append(avg_purchase)\n        elif 30 <= age <= 39:\n            age_groups[\"30-39\"].append(avg_purchase)\n    \n    return {\n        group: sum(values) / len(values) \n        for group, values in age_groups.items() if values\n    }\n\nresults = analyze_by_age_group(customers)\nprint(\"Average purchases by age group:\", results)",
        "hints": [
          "Group customers by age ranges (20-29, 30-39, etc.)",
          "Calculate average purchase for each customer first",
          "Then calculate averages within each age group",
          "Use dictionaries to store grouped data"
        ],
        "explanation": "Excellent! You''ve just performed real data analysis! This type of customer segmentation helps businesses understand different customer groups and tailor their strategies accordingly."
      },
      "reward": {
        "xp": 23,
        "message": "Dr. Chen smiles: \"Fantastic analysis! These insights will help us target our marketing better. You have a talent for data science!\"",
        "item": "Data Analyst Badge"
      }
    }
  ]
}' WHERE id = 'im-story-1';

UPDATE lessons SET story_data = '{
  "setting": "A tech startup office where Alex meets Jamie, a web developer trying to gather data from competitor websites for market research",
  "protagonist": {
    "name": "Alex",
    "avatar": "👨‍💻",
    "role": "Web Scraping Assistant",
    "personality": "Curious about web technologies, ethical and careful"
  },
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Web Data Quest",
      "content": "Alex found Jamie in the startup''s bustling office, surrounded by monitors showing different websites. \"I need your help,\" Jamie said, pointing to a screen.\n\n\"We need to gather pricing data from competitor websites, but doing it manually would take weeks,\" Jamie explained. \"I heard Python can automatically extract information from web pages.\"\n\n\"Web scraping!\" Alex said excitedly. \"I''ve read about that. But we need to be careful and ethical, right?\"\n\n\"Absolutely!\" Jamie nodded. \"We only scrape public pricing pages, we respect rate limits, and we check each site''s robots.txt file. Can you help me write a script to extract product names and prices?\"",
      "character": {
        "name": "Jamie",
        "avatar": "🌐",
        "role": "Web Developer",
        "personality": "Ethical hacker, practical, respects web etiquette"
      },
      "background": "Modern startup office with website dashboards and code editors",
      "objectives": [
        "Understand ethical web scraping practices",
        "Parse HTML content to extract specific information",
        "Handle different HTML structures gracefully"
      ],
      "challenge": {
        "description": "Create a web scraping script to extract product information ethically",
        "starter_code": "# Ethical web scraping example\n\n# Simulated HTML content (in real scraping, you''d use requests library)\nhtml_content = \"\"\"\n<html>\n<body>\n    <div class=\"product\">\n        <h2 class=\"product-name\">Python Book</h2>\n        <span class=\"price\">$29.99</span>\n    </div>\n    <div class=\"product\">\n        <h2 class=\"product-name\">Java Guide</h2>\n        <span class=\"price\">$34.99</span>\n    </div>\n</body>\n</html>\n\"\"\"\n\n# Parse and extract product data\ndef extract_products(html):\n    # Your parsing logic here\n    pass",
        "solution": "# Ethical web scraping example\n\n# Simulated HTML content\nhtml_content = \"\"\"\n<html>\n<body>\n    <div class=\"product\">\n        <h2 class=\"product-name\">Python Book</h2>\n        <span class=\"price\">$29.99</span>\n    </div>\n    <div class=\"product\">\n        <h2 class=\"product-name\">Java Guide</h2>\n        <span class=\"price\">$34.99</span>\n    </div>\n</body>\n</html>\n\"\"\"\n\n# Parse and extract product data\ndef extract_products(html):\n    products = []\n    \n    # Split HTML by product divs\n    product_sections = html.split(\"<div class=\\\"product\\\">\")[1:]\n    \n    for section in product_sections:\n        # Extract product name\n        name_start = section.find(\"<h2 class=\\\"product-name\\\">\") + len(\"<h2 class=\\\"product-name\\\">\")\n        name_end = section.find(\"</h2>\")\n        name = section[name_start:name_end]\n        \n        # Extract price\n        price_start = section.find(\"<span class=\\\"price\\\">\") + len(\"<span class=\\\"price\\\">\")\n        price_end = section.find(\"</span>\")\n        price = section[price_start:price_end]\n        \n        products.append({\"name\": name, \"price\": price})\n    \n    return products\n\n# Extract and display products\nproducts = extract_products(html_content)\nfor product in products:\n    print(f\"Product: {product[\"name\"]}, Price: {product[\"price\"]}\")\n\nprint(\"\\nRemember: Always check robots.txt and respect rate limits when scraping!\")",
        "hints": [
          "In real scraping, use libraries like BeautifulSoup or lxml",
          "Always respect robots.txt files and website terms of service",
          "Implement rate limiting to avoid overwhelming servers",
          "Handle HTML variations and missing elements gracefully"
        ],
        "explanation": "Perfect! You''ve learned the fundamentals of web scraping. Remember that ethical scraping is crucial—always respect website policies and implement proper rate limiting in real applications."
      },
      "reward": {
        "xp": 25,
        "message": "Jamie high-fives you: \"Awesome work! With this approach, we can gather market data efficiently and ethically. You''re becoming a real data ninja!\"",
        "item": "Web Scraper Badge"
      }
    }
  ]
}' WHERE id = 'im-story-2';

UPDATE lessons SET story_data = '{
  "setting": "A chaotic office with thousands of disorganized digital files where Alex meets an overwhelmed office manager named Marcus",
  "protagonist": {
    "name": "Alex",
    "avatar": "👨‍💻",
    "role": "File Organization Specialist",
    "personality": "Organized, systematic, enjoys bringing order to chaos"
  },
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Digital Chaos",
      "content": "Alex walked into Marcus''s office and stopped in shock. The desktop was covered in hundreds of randomly named files, and folders were nested twenty levels deep.\n\n\"Help me!\" Marcus pleaded, pointing at his monitor. \"I have five years of documents everywhere! Contracts are mixed with photos, invoices with personal notes. I can''t find anything!\"\n\n\"How did it get this bad?\" Alex asked, examining the file structure.\n\n\"Every time I needed to save something quickly, I just put it on the desktop or in the first folder I found,\" Marcus admitted. \"Now I spend hours looking for specific documents.\"\n\nAlex smiled. \"Don''t worry. Python can organize files automatically. We can create a script that sorts files by type, date, and content. It''ll be like having a personal digital assistant!\"",
      "character": {
        "name": "Marcus",
        "avatar": "📁",
        "role": "Office Manager",
        "personality": "Overwhelmed but organized at heart, ready for a solution"
      },
      "background": "Cluttered office space with stacks of papers and chaotic computer desktop",
      "objectives": [
        "Organize files by type and date automatically",
        "Create folder structures programmatically",
        "Handle file operations safely and efficiently"
      ],
      "challenge": {
        "description": "Create a file organization script to clean up Marcus''s digital mess",
        "starter_code": "# File organization script\n\nimport os\nfrom datetime import datetime\n\n# Simulated file list (in real use, you''d scan actual directories)\nfiles = [\n    {\"name\": \"contract_2023.pdf\", \"type\": \"pdf\", \"date\": \"2023-03-15\"},\n    {\"name\": \"meeting_notes.docx\", \"type\": \"docx\", \"date\": \"2023-06-20\"},\n    {\"name\": \"invoice_001.pdf\", \"type\": \"pdf\", \"date\": \"2023-01-10\"},\n    {\"name\": \"photo_vacation.jpg\", \"type\": \"jpg\", \"date\": \"2023-08-05\"}\n]\n\n# Organize files by type and year\ndef organize_files(file_list):\n    # Your organization logic here\n    pass",
        "solution": "# File organization script\n\nimport os\nfrom datetime import datetime\n\n# Simulated file list\nfiles = [\n    {\"name\": \"contract_2023.pdf\", \"type\": \"pdf\", \"date\": \"2023-03-15\"},\n    {\"name\": \"meeting_notes.docx\", \"type\": \"docx\", \"date\": \"2023-06-20\"},\n    {\"name\": \"invoice_001.pdf\", \"type\": \"pdf\", \"date\": \"2023-01-10\"},\n    {\"name\": \"photo_vacation.jpg\", \"type\": \"jpg\", \"date\": \"2023-08-05\"}\n]\n\n# Organize files by type and year\ndef organize_files(file_list):\n    organized = {}\n    \n    for file_info in file_list:\n        file_type = file_info[\"type\"]\n        year = file_info[\"date\"][:4]  # Extract year from date\n        \n        # Create nested structure: organized[type][year]\n        if file_type not in organized:\n            organized[file_type] = {}\n        if year not in organized[file_type]:\n            organized[file_type][year] = []\n            \n        organized[file_type][year].append(file_info[\"name\"])\n    \n    return organized\n\n# Organize and display structure\norganized_files = organize_files(files)\n\nprint(\"File Organization Structure:\")\nfor file_type, years in organized_files.items():\n    print(f\"📁 {file_type.upper()} Files/\")\n    for year, file_list in years.items():\n        print(f\"  📁 {year}/\")\n        for file_name in file_list:\n            print(f\"    📄 {file_name}\")\n    print()\n\nprint(\"✅ File organization complete! Everything is now structured and easy to find!\")",
        "hints": [
          "Create a hierarchical structure: type > year > files",
          "Use dictionaries to represent folder structures",
          "Group files by type first, then by year",
          "Consider creating separate folders for different document categories"
        ],
        "explanation": "Excellent! You''ve created a systematic file organization system. This approach can save hours of searching and make digital workflows much more efficient. In real applications, you would use the os and shutil modules to actually move files."
      },
      "reward": {
        "xp": 28,
        "message": "Marcus dances around the office: \"This is amazing! My digital life is finally organized! You\\'re a file organization wizard!\"",
        "item": "File Organization Master Badge"
      }
    }
  ]
}' WHERE id = 'im-story-3';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_intermediate_lessons ON lessons(section_id, lesson_type);
CREATE INDEX IF NOT EXISTS idx_intermediate_sections ON sections(path);

-- Verify the data was inserted
SELECT
  s.title as section_title,
  COUNT(l.id) as lesson_count,
  STRING_AGG(DISTINCT l.lesson_type, ', ') as lesson_types
FROM lessons l
JOIN sections s ON l.section_id = s.id
WHERE s.id LIKE 'section-intermediate-%'
GROUP BY s.title
ORDER BY s.order_index;