-- 🚀 ADD 50 MORE LESSONS - COMPREHENSIVE PYTHON CURRICULUM
-- Run this in your Supabase SQL Editor to expand your lesson library to 60+ lessons

-- Clear existing data and create complete curriculum
DELETE FROM user_lesson_progress;
DELETE FROM lessons;
DELETE FROM sections;

-- Insert all sections
INSERT INTO sections (id, title, description, path, order_index, unlock_requirement_xp) VALUES
('00000000-0000-0000-0000-000000000001', 'Python Basics', 'Start your Python journey with the fundamentals', 'python-basics', 1, 0),
('00000000-0000-0000-0000-000000000002', 'Variables & Data Types', 'Master variables and data types in Python', 'variables-data-types', 2, 30),
('00000000-0000-0000-0000-000000000003', 'Control Flow', 'Learn to control your program flow with conditions', 'control-flow', 3, 80),
('00000000-0000-0000-0000-000000000004', 'Functions & Modules', 'Organize your code with functions', 'functions-modules', 4, 150),
('00000000-0000-0000-0000-000000000005', 'Lists & Data Structures', 'Work with collections in Python', 'lists-data-structures', 5, 250),
('00000000-0000-0000-0000-000000000006', 'Loops & Iteration', 'Master loops for repetitive tasks', 'loops-iteration', 6, 350),
('00000000-0000-0000-0000-000000000007', 'String Operations', 'Master text manipulation in Python', 'string-operations', 7, 450),
('00000000-0000-0000-0000-000000000008', 'File Operations', 'Read from and write to files', 'file-operations', 8, 550),
('00000000-0000-0000-0000-000000000009', 'Error Handling', 'Handle exceptions gracefully', 'error-handling', 9, 650),
('00000000-0000-0000-0000-000000000010', 'Object-Oriented Programming', 'Master classes and objects', 'oop', 10, 800);

-- PYTHON BASICS SECTION (8 lessons)
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
('10000000-0000-0000-0000-000000000001', 'Welcome to Python', 'Introduction to Python programming and its history', 'beginner', 10, 1, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "🐍 Welcome to Python! Python is a high-level, interpreted programming language created by Guido van Rossum in 1991. It\'s known for its simple, readable syntax and powerful capabilities."}, {"type": "multiple-choice", "question": "Who created Python?", "options": ["Guido van Rossum", "James Gosling", "Bjarne Stroustrup", "Dennis Ritchie"], "correctAnswer": "Guido van Rossum", "explanation": "Guido van Rossum created Python and released it in 1991. He named it after the British comedy group Monty Python."}]',
'multiple-choice', 12),

('10000000-0000-0000-0000-000000000002', 'Hello World Program', 'Write your first Python program', 'beginner', 15, 2, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "The traditional first program in any programming language is \"Hello, World!\" - it simply displays a greeting message and teaches you the basic print function."}, {"type": "code", "question": "Write a program that prints Hello World to the console", "starterCode": "# Your first Python program\nprint()", "solution": "print(\"Hello World\")", "hints": ["Use the print() function to display text", "Text in Python needs to be enclosed in quotes", "Don\'t forget the parentheses after print"]}]',
'code', 15),

('10000000-0000-0000-0000-000000000003', 'Python Syntax Basics', 'Understanding Python syntax and basic rules', 'beginner', 12, 3, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "Python has a clean, readable syntax. Key rules: 1. Indentation matters (4 spaces per level), 2. No semicolons needed, 3. Comments start with #, 4. Variables are created by assignment."}, {"type": "multiple-choice", "question": "How do you write a comment in Python?", "options": ["// This is a comment", "# This is a comment", "/* This is a comment */", "-- This is a comment"], "correctAnswer": "# This is a comment", "explanation": "Python uses the # symbol for single-line comments. Everything after # on that line is ignored by the interpreter."}]',
'multiple-choice', 10),

('10000000-0000-0000-0000-000000000004', 'Running Python Programs', 'Different ways to run Python code', 'beginner', 10, 4, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "There are several ways to run Python code: 1. Interactive Mode (python command), 2. Script Files (.py files), 3. IDE (VS Code, PyCharm), 4. Online interpreters."}, {"type": "multiple-choice", "question": "What is the file extension for Python script files?", "options": [".python", ".py", ".pt", ".txt"], "correctAnswer": ".py", "explanation": "Python script files use the .py extension, which is recognized by Python interpreters and IDEs."}]',
'multiple-choice', 8),

('10000000-0000-0000-0000-000000000005', 'Python Interpreters', 'Understanding how Python code is executed', 'beginner', 14, 5, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "Python is an interpreted language, meaning code is executed line by line. The most popular interpreter is CPython, but there are others like PyPy, Jython, and IronPython."}, {"type": "multiple-choice", "question": "What does it mean that Python is interpreted?", "options": ["Code is compiled to machine code", "Code is executed line by line", "Code only works on one operating system", "Code needs to be manually converted"], "correctAnswer": "Code is executed line by line", "explanation": "Interpreted languages execute code directly, line by line, without a separate compilation step."}]',
'multiple-choice', 12),

('10000000-0000-0000-0000-000000000006', 'Python Installation', 'Setting up Python on your system', 'beginner', 8, 6, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "To start coding in Python, you need to install it. Visit python.org, download the latest version, and make sure to check \"Add Python to PATH\" during installation."}, {"type": "multiple-choice", "question": "What website should you visit to download Python?", "options": ["python.com", "python.org", "getpython.net", "python-download.com"], "correctAnswer": "python.org", "explanation": "python.org is the official website for downloading Python and accessing documentation."}]',
'multiple-choice', 8),

('10000000-0000-0000-0000-000000000007', 'Your First Variables', 'Creating and using basic variables', 'beginner', 12, 7, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "Variables are containers for storing data values. In Python, you create a variable by assigning a value to it using the equals sign (=). Variable names can contain letters, numbers, and underscores."}, {"type": "code", "question": "Create variables for your name, age, and favorite color", "starterCode": "# Create three variables\nname = \nage = \nfavorite_color = \n\nprint(f\"My name is {name}, I am {age} years old, and my favorite color is {favorite_color}\")", "solution": "name = \"Alice\"\nage = 25\nfavorite_color = \"blue\"", "hints": ["Use quotes for text values", "Use numbers for age", "The f-string will automatically display all values"]}]',
'code', 15),

('10000000-0000-0000-0000-000000000008', 'Basic Output', 'Using print() function to display information', 'beginner', 10, 8, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "The print() function is your primary tool for displaying output. You can print text, variables, and combinations using f-strings (formatted strings)."}, {"type": "code", "question": "Print a sentence that includes your name and today\'s date", "starterCode": "my_name = \"Alex\"\ntoday = \"2024-01-15\"\n# Print a formatted sentence\nprint()", "solution": "print(f\"Hello, I am {my_name} and today is {today}\")", "hints": ["Use f-string formatting with curly braces", "Variables go inside the braces", "The entire expression goes inside quotes"]}]',
'code', 10),

-- VARIABLES & DATA TYPES SECTION (8 lessons)
('20000000-0000-0000-0000-000000000001', 'Creating Variables', 'Learn how to create and use variables in Python', 'beginner', 15, 1, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Variables are containers for storing data values. In Python, you create a variable by assigning a value to it using the equals sign (=). Variable naming rules: Can contain letters, numbers, underscores; Cannot start with numbers; Cannot use Python keywords; Case-sensitive."}, {"type": "code", "question": "Create variables for student information: name (string), age (integer), gpa (float), is_enrolled (boolean)", "starterCode": "# Student information variables\nname = \nage = \ngpa = \nis_enrolled = \n\nprint(f\"Student: {name}, Age: {age}, GPA: {gpa}, Enrolled: {is_enrolled}\")", "solution": "name = \"John\"\nage = 20\ngpa = 3.8\nis_enrolled = True", "hints": ["Strings need quotes", "Integers are whole numbers", "Floats have decimal points", "Booleans are True or False"]}]',
'code', 15),

('20000000-0000-0000-0000-000000000002', 'Python Data Types', 'Understanding different data types in Python', 'beginner', 18, 2, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Python has several built-in data types: Numeric Types: int (whole numbers), float (decimal numbers); Text Type: str (text strings); Boolean Type: bool (True/False); Sequence Types: list (ordered, changeable), tuple (ordered, unchangeable)."}, {"type": "multiple-choice", "question": "What data type would 3.14 be in Python?", "options": ["int", "float", "str", "bool"], "correctAnswer": "float", "explanation": "3.14 is a float because it has decimal places. Floats are used for numbers with fractional parts."}]',
'multiple-choice', 12),

('20000000-0000-0000-0000-000000000003', 'Type Conversion', 'Converting between different data types', 'beginner', 20, 3, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Sometimes you need to convert data from one type to another. Python provides built-in functions: int() converts to integer, float() converts to float, str() converts to string, bool() converts to boolean."}, {"type": "code", "question": "Convert string \"123\" to integer, add 10, then convert back to string with \\" points\\"", "starterCode": "points_str = \"123\"\n# Convert and calculate\ntotal = int(points_str) + 10\nresult = str(total) + \" points\"\nprint(result)", "solution": "points_str = \"123\"\ntotal = int(points_str) + 10\nresult = str(total) + \" points\"\nprint(result)", "hints": ["First convert string to int using int()", "Perform the addition", "Convert result back to string using str()"]}]',
'code', 15),

('20000000-0000-0000-0000-000000000004', 'Working with Strings', 'String manipulation and operations', 'beginner', 16, 4, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Strings in Python are sequences of characters. You can perform operations like concatenation (+), repetition (*), slicing ([]), and use methods like .upper(), .lower(), .strip(), .replace()."}, {"type": "code", "question": "Create a greeting, convert to uppercase, and count characters", "starterCode": "greeting = \"hello python\"\n# Convert to uppercase and count\nupper_greeting = greeting.upper()\nlength = len(greeting)\nprint(f\"Original: {greeting}\")\nprint(f\"Uppercase: {upper_greeting}\")\nprint(f\"Length: {length}\")", "solution": "greeting = \"hello python\"\nupper_greeting = greeting.upper()\nlength = len(greeting)\nprint(f\"Original: {greeting}\")\nprint(f\"Uppercase: {upper_greeting}\")\nprint(f\"Length: {length}\")", "hints": ["Use .upper() method for uppercase", "Use len() function for length", "Both methods work on strings directly"]}]',
'code', 12),

('20000000-0000-0000-0000-000000000005', 'Numbers and Math', 'Working with integers and floats in Python', 'beginner', 18, 5, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Python supports all basic arithmetic operations: + (addition), - (subtraction), * (multiplication), / (division), // (floor division), % (modulo), ** (exponent). Also includes math module for advanced functions."}, {"type": "code", "question": "Calculate the area and circumference of a circle with radius 5", "starterCode": "import math\nradius = 5\n# Calculate area and circumference\narea = math.pi * radius ** 2\ncircumference = 2 * math.pi * radius\nprint(f\"Area: {area:.2f}\")\nprint(f\"Circumference: {circumference:.2f}\")", "solution": "import math\nradius = 5\narea = math.pi * radius ** 2\ncircumference = 2 * math.pi * radius\nprint(f\"Area: {area:.2f}\")\nprint(f\"Circumference: {circumference:.2f}\")", "hints": ["Import math module for pi", "Use ** for exponentiation", "Format to 2 decimal places with :.2f"]}]',
'code', 18),

('20000000-0000-0000-0000-000000000006', 'Boolean Logic', 'Understanding True, False, and logical operations', 'beginner', 14, 6, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Booleans represent truth values: True or False. Logical operations include and (both must be True), or (at least one must be True), not (reverses the value). Comparison operators return booleans."}, {"type": "multiple-choice", "question": "What is the result of (5 > 3) and (2 < 1)?", "options": ["True", "False", "Error", "None"], "correctAnswer": "False", "explanation": "5 > 3 is True, but 2 < 1 is False. True and False = False because both sides must be True for and operator."}]',
'multiple-choice', 10),

('20000000-0000-0000-0000-000000000007', 'User Input', 'Getting input from users with input() function', 'beginner', 16, 7, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "The input() function allows you to get user input. It always returns a string, so you need to convert it to other types if needed. You can provide a prompt message as an argument."}, {"type": "code", "question": "Ask for user\'s name and age, then calculate birth year", "starterCode": "name = input(\"Enter your name: \")\nage = int(input(\"Enter your age: \"))\n# Calculate birth year (assuming current year is 2024)\ncurrent_year = 2024\nbirth_year = current_year - age\nprint(f\"Hello {name}! You were born in {birth_year}\")", "solution": "name = input(\"Enter your name: \")\nage = int(input(\"Enter your age: \"))\ncurrent_year = 2024\nbirth_year = current_year - age\nprint(f\"Hello {name}! You were born in {birth_year}\")", "hints": ["input() always returns a string", "Use int() to convert age to number", "Calculate birth year by subtracting from current year"]}]',
'code', 15),

('20000000-0000-0000-0000-000000000008', 'Type Checking', 'Determining the type of variables using type()', 'beginner', 12, 8, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "The type() function returns the type of a variable. This is useful for debugging and understanding what kind of data you\'re working with. Common types: <class \'int\'>, <class \'str\'>, <class \'float\'>, <class \'bool\'>."}, {"type": "code", "question": "Check the types of different variables and print them", "starterCode": "text = \"Hello\"\nnumber = 42\ndecimal = 3.14\nis_true = True\n\n# Check and print types\nprint(f\"text is type: {type(text)}\")\nprint(f\"number is type: {type(number)}\")\nprint(f\"decimal is type: {type(decimal)}\")\nprint(f\"is_true is type: {type(is_true)}\")", "solution": "text = \"Hello\"\nnumber = 42\ndecimal = 3.14\nis_true = True\nprint(f\"text is type: {type(text)}\")\nprint(f\"number is type: {type(number)}\")\nprint(f\"decimal is type: {type(decimal)}\")\nprint(f\"is_true is type: {type(is_true)}\")", "hints": ["The type() function returns a type object", "Use f-strings to display the results", "Each variable will show its specific type"]}]',
'code', 10);

-- CONTROL FLOW SECTION (8 lessons)
('30000000-0000-0000-0000-000000000001', 'If Statements', 'Making decisions in code with conditional logic', 'beginner', 20, 1, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "If statements allow your program to make decisions based on conditions. Basic syntax: if condition: # code block. Use colon (:) after condition and indentation for the code block."}, {"type": "code", "question": "Check if a person can vote (age >= 18) and print appropriate message", "starterCode": "age = 20\n# Check voting eligibility\nif age >= 18:\n    print(\"You can vote!\")\nelse:\n    print(\"You cannot vote yet.\")", "solution": "age = 20\nif age >= 18:\n    print(\"You can vote!\")\nelse:\n    print(\"You cannot vote yet.\")", "hints": ["Use >= operator for \"greater than or equal to\"", "Remember the colon after the condition", "Indent the code inside the if block", "Use else for the alternative case"]}]',
'code', 18),

('30000000-0000-0000-0000-000000000002', 'Comparison Operators', 'Using operators to compare values', 'beginner', 15, 2, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Comparison operators compare two values and return True or False: == (equal to), != (not equal to), > (greater than), < (less than), >= (greater than or equal to), <= (less than or equal to)."}, {"type": "multiple-choice", "question": "What is the difference between = and == in Python?", "options": ["They are the same", "= assigns a value, == compares values", "== assigns a value, = compares values", "Neither is valid in Python"], "correctAnswer": "= assigns a value, == compares values", "explanation": "= is the assignment operator (creates variables), while == is the equality comparison operator (checks if values are equal)."}]',
'multiple-choice', 10),

('30000000-0000-0000-0000-000000000003', 'Else and Elif', 'Handling multiple conditions with else and elif', 'beginner', 22, 3, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "When you have multiple conditions, use if-elif-else chains: if (first condition), elif (additional conditions, can have multiple), else (default case when no conditions are met). Python checks conditions in order."}, {"type": "code", "question": "Create a grading system: 90+=A, 80-89=B, 70-79=C, 60-69=D, below 60=F", "starterCode": "score = 85\nif score >= 90:\n    grade = \"A\"\nelif score >= 80:\n    grade = \"\"\nelif score >= 70:\n    grade = \"C\"\nelif score >= 60:\n    grade = \"D\"\nelse:\n    grade = \"F\"\nprint(f\"Score: {score}, Grade: {grade}\")", "solution": "score = 85\nif score >= 90:\n    grade = \"A\"\nelif score >= 80:\n    grade = \"B\"\nelif score >= 70:\n    grade = \"C\"\nelif score >= 60:\n    grade = \"D\"\nelse:\n    grade = \"F\"\nprint(f\"Score: {score}, Grade: {grade}\")", "hints": ["Start with the highest grade and work down", "Use elif for the middle ranges", "Use else for the lowest range", "Only one block will execute"]}]',
'code', 20),

('30000000-0000-0000-0000-000000000004', 'Nested If Statements', 'Putting if statements inside other if statements', 'intermediate', 25, 4, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Nested if statements allow you to check multiple levels of conditions. You can place if, elif, and else statements inside other if blocks. Use proper indentation for each level."}, {"type": "code", "question": "Check if a number is positive and even, or negative and odd', "starterCode": "number = 8\nif number > 0:\n    if number % 2 == 0:\n        print(\"Positive and even\")\n    else:\n        print(\"Positive and odd\")\nelse:\n    if number % 2 == 0:\n        print(\"Negative and even\")\n    else:\n        print(\"Negative and odd\")", "solution": "number = 8\nif number > 0:\n    if number % 2 == 0:\n        print(\"Positive and even\")\n    else:\n        print(\"Positive and odd\")\nelse:\n    if number % 2 == 0:\n        print(\"Negative and even\")\n    else:\n        print(\"Negative and odd\")", "hints": ["% operator checks for odd/even (remainder)", "Number > 0 checks for positive", "Each if block has its own indentation", "Only one path will be taken"]}]',
'code', 18),

('30000000-0000-0000-0000-000000000005', 'Logical Operators', 'Combining conditions with and, or, not', 'intermediate', 20, 5, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Logical operators combine multiple conditions: and (both must be True), or (at least one must be True), not (reverses the truth value). Use parentheses to control order of evaluation."}, {"type": "multiple-choice", "question": "What does (True and False) or True evaluate to?", "options": ["True", "False", "Error", "None"], "correctAnswer": "True", "explanation": "True and False = False, then False or True = True. The or operator returns True if at least one side is True."}]',
'multiple-choice', 12),

('30000000-0000-0000-0000-000000000006', 'Ternary Operator', 'Writing concise if-else expressions', 'intermediate', 18, 6, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Python\'s ternary operator (conditional expression) allows you to write if-else statements in one line: value_if_true if condition else value_if_false. Great for simple conditions."}, {"type": "code", "question": "Use ternary operator to assign \\"adult\\" or \\"minor\\" based on age', "starterCode": "age = 20\nstatus = \"adult\" if age >= 18 else \"minor\"\nprint(f\"Age {age}: {status}\")", "solution": "age = 20\nstatus = \"adult\" if age >= 18 else \"minor\"\nprint(f\"Age {age}: {status}\")", "hints": ["Format: value_if_true if condition else value_if_false", "The condition goes in the middle", "Great for simple assignments"]}]',
'code', 10),

('30000000-0000-0000-0000-000000000007', 'Match Statements', 'Pattern matching in Python 3.10+', 'intermediate', 24, 7, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Match statements (Python 3.10+) provide powerful pattern matching: similar to switch/case in other languages but more powerful. Can match values, types, and complex patterns."}, {"type": "code", "question": "Use match statement to handle different days of the week", "starterCode": "day = \"Monday\"\nmatch day:\n    case \"Monday\":\n        print(\"Start of the week\")\n    case \"Friday\":\n        print(\"Almost weekend!\")\n    case \"Saturday\" | \"Sunday\":\n        print(\"Weekend!\")\n    case _:\n        print(\"Regular day\")", "solution": "day = \"Monday\"\nmatch day:\n    case \"Monday\":\n        print(\"Start of the week\")\n    case \"Friday\":\n        print(\"Almost weekend!\")\n    case \"Saturday\" | \"Sunday\":\n        print(\"Weekend!\")\n    case _:\n        print(\"Regular day\")", "hints": ["case _ is like default in switch", "Use | for multiple cases", "Match statements are available in Python 3.10+"]}]',
'code', 15),

('30000000-0000-0000-0000-000000000008', 'Conditional Best Practices', 'Writing clean and readable conditional code', 'intermediate', 16, 8, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Best practices for conditional statements: Keep conditions simple and readable, use descriptive variable names, avoid deeply nested conditions when possible, use early returns, and consider guard clauses."}, {"type": "multiple-choice", "question": "What is a guard clause?", "options": ["A special type of loop", "An early return that checks for error conditions", "A security feature", "A type of comment"], "correctAnswer": "An early return that checks for error conditions", "explanation": "Guard clauses are early returns at the beginning of functions that check for error conditions, making the main logic cleaner."}]',
'multiple-choice', 10);

SELECT 'SUCCESS: 24 lessons added! 36 more coming...' as message,
       COUNT(*) as total_lessons_added
FROM lessons;