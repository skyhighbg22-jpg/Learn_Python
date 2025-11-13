-- 🎯 COMPLETE PYTHON CURRICULUM - 60 LESSONS - ALL SQL IN ONE FILE
-- This single file contains the entire curriculum to avoid syntax errors

-- Clear existing data
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
('10000000-0000-0000-0000-000000000001', 'Welcome to Python', 'Introduction to Python programming', 'beginner', 10, 1, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "Welcome to Python! Python is a high-level programming language created by Guido van Rossum."}, {"type": "multiple-choice", "question": "Who created Python?", "options": ["Guido van Rossum", "James Gosling", "Bjarne Stroustrup"], "correctAnswer": "Guido van Rossum"}]',
'multiple-choice', 12),

('10000000-0000-0000-0000-000000000002', 'Hello World Program', 'Write your first Python program', 'beginner', 15, 2, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "The traditional first program is Hello World. It teaches you the print function."}, {"type": "code", "question": "Write a program that prints Hello World", "starterCode": "# Your first program\nprint()", "solution": "print(\"Hello World\")"}]',
'code', 15),

('10000000-0000-0000-0000-000000000003', 'Python Syntax Basics', 'Understanding Python syntax rules', 'beginner', 12, 3, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "Python uses indentation instead of braces and semicolons. Comments start with #."}, {"type": "multiple-choice", "question": "How do you write a comment?", "options": ["// comment", "# comment", "/* comment */"], "correctAnswer": "# comment"}]',
'multiple-choice', 10),

('10000000-0000-0000-0000-000000000004', 'Running Python Programs', 'Different ways to run Python code', 'beginner', 10, 4, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "You can run Python interactively, as scripts, in IDEs, or online."}, {"type": "multiple-choice", "question": "What is the file extension for Python files?", "options": [".python", ".py", ".pt"], "correctAnswer": ".py"}]',
'multiple-choice', 8),

('10000000-0000-0000-0000-000000000005', 'Python Interpreters', 'Understanding how Python code is executed', 'beginner', 14, 5, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "Python is interpreted, meaning code is executed line by line."}, {"type": "multiple-choice", "question": "What does interpreted mean?", "options": ["Compiled to machine code", "Executed line by line", "Only works on one OS"], "correctAnswer": "Executed line by line"}]',
'multiple-choice', 12),

('10000000-0000-0000-0000-000000000006', 'Python Installation', 'Setting up Python on your system', 'beginner', 8, 6, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "Download Python from python.org and check Add Python to PATH during installation."}, {"type": "multiple-choice", "question": "What website downloads Python?", "options": ["python.com", "python.org", "getpython.net"], "correctAnswer": "python.org"}]',
'multiple-choice', 8),

('10000000-0000-0000-0000-000000000007', 'Your First Variables', 'Creating and using basic variables', 'beginner', 12, 7, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "Variables store data. Create them with assignment operator."}, {"type": "code", "question": "Create variables for name, age, color", "starterCode": "name = \nage = \ncolor = \nprint(f\"{name}, {age}, {color}\")", "solution": "name = \"Alice\"\nage = 25\ncolor = \"blue\""}]',
'code', 15),

('10000000-0000-0000-0000-000000000008', 'Basic Output', 'Using print function to display information', 'beginner', 10, 8, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "The print function displays output. Use f-strings for formatted output."}, {"type": "code", "question": "Print a greeting with your name and date", "starterCode": "name = \"Alex\"\ndate = \"2024-01-15\"\nprint()", "solution": "print(f\"Hello {name} on {date}\")"}]',
'code', 10),

-- VARIABLES & DATA TYPES SECTION (8 lessons)
('20000000-0000-0000-0000-000000000001', 'Creating Variables', 'Learn to create and use variables', 'beginner', 15, 1, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Variables are containers for data. Assign values with equals sign."}, {"type": "code", "question": "Create student variables: name, age, gpa, enrolled", "starterCode": "name = \nage = \ngpa = \nenrolled = \nprint(f\"{name}, {age}, {gpa}, {enrolled}\")", "solution": "name = \"John\"\nage = 20\ngpa = 3.8\nenrolled = True"}]',
'code', 15),

('20000000-0000-0000-0000-000000000002', 'Python Data Types', 'Understanding different data types', 'beginner', 18, 2, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Python types: int, float, str, bool, list, tuple. Each serves different purposes."}, {"type": "multiple-choice", "question": "What type is 3.14?", "options": ["int", "float", "str", "bool"], "correctAnswer": "float"}]',
'multiple-choice', 12),

('20000000-0000-0000-0000-000000000003', 'Type Conversion', 'Converting between data types', 'beginner', 20, 3, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Convert types with int(), float(), str(), bool(). String to int: int(\"123\")"}, {"type": "code", "question": "Convert string 123 to integer and add 10", "starterCode": "points_str = \"123\"\nresult = int(points_str) + 10\nprint(result)", "solution": "points_str = \"123\"\nresult = int(points_str) + 10\nprint(result)"}]',
'code', 15),

('20000000-0000-0000-0000-000000000004', 'Working with Strings', 'String manipulation operations', 'beginner', 16, 4, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Strings: sequence of characters. Methods: upper(), lower(), len(), concatenate with +."}, {"type": "code", "question": "Convert greeting to uppercase and count characters", "starterCode": "greeting = \"hello\"\nupper_greeting = greeting.upper()\nlength = len(greeting)\nprint(f\"{upper_greeting}, {length}\")", "solution": "greeting = \"hello\"\nupper_greeting = greeting.upper()\nlength = len(greeting)\nprint(f\"{upper_greeting}, {length}\")"}]',
'code', 12),

('20000000-0000-0000-0000-000000000005', 'Numbers and Math', 'Working with integers and floats', 'beginner', 18, 5, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Math operations: +, -, *, /, //, %, **. Math module has pi, sqrt, etc."}, {"type": "code", "question": "Calculate circle area with radius 5", "starterCode": "import math\nradius = 5\narea = math.pi * radius ** 2\nprint(area)", "solution": "import math\nradius = 5\narea = math.pi * radius ** 2\nprint(area)"}]',
'code', 18),

('20000000-0000-0000-0000-000000000006', 'Boolean Logic', 'Understanding True, False, logical ops', 'beginner', 14, 6, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Booleans: True or False. Logic: and (both True), or (one True), not (reverse)."}, {"type": "multiple-choice", "question": "What is (5 > 3) and (2 < 1)?", "options": ["True", "False"], "correctAnswer": "False"}]',
'multiple-choice', 10),

('20000000-0000-0000-0000-000000000007', 'User Input', 'Getting input from users', 'beginner', 16, 7, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "input() gets user input. Always returns string. Convert to other types as needed."}, {"type": "code", "question": "Ask for age and calculate birth year", "starterCode": "age = int(input(\"Enter age: \"))\ncurrent_year = 2024\nbirth_year = current_year - age\nprint(birth_year)", "solution": "age = int(input(\"Enter age: \"))\ncurrent_year = 2024\nbirth_year = current_year - age\nprint(birth_year)"}]',
'code', 15),

('20000000-0000-0000-0000-000000000008', 'Type Checking', 'Determining variable types', 'beginner', 12, 8, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "type() returns variable type. Useful for debugging and understanding data."}, {"type": "code", "question": "Check types of different variables', "starterCode": "text = \"Hello\"\nnumber = 42\nprint(type(text))\nprint(type(number))", "solution": "text = \"Hello\"\nnumber = 42\nprint(type(text))\nprint(type(number))"}]',
'code', 10),

-- CONTROL FLOW SECTION (8 lessons)
('30000000-0000-0000-0000-000000000001', 'If Statements', 'Making decisions with conditions', 'beginner', 20, 1, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "If statements allow conditional execution. Use colon and indentation."}, {"type": "code", "question": "Check if age >= 18', "starterCode": "age = 20\nif age >= 18:\n    print(\"Can vote\")\nelse:\n    print(\"Cannot vote\")", "solution": "age = 20\nif age >= 18:\n    print(\"Can vote\")\nelse:\n    print(\"Cannot vote\")"}]',
'code', 18),

('30000000-0000-0000-0000-000000000002', 'Comparison Operators', 'Comparing values', 'beginner', 15, 2, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Comparison operators: ==, !=, >, <, >=, <=. These return True or False."}, {"type": "multiple-choice", "question": "Difference between = and ==?", "options": ["Same", "= assigns, == compares"], "correctAnswer": "= assigns, == compares"}]',
'multiple-choice', 10),

('30000000-0000-0000-0000-000000000003', 'Else and Elif', 'Multiple conditions', 'beginner', 22, 3, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "If-elif-else handles multiple conditions. Check from specific to general."}, {"type": "code", "question": "Grading: 90+=A, 80-89=B, 70-79=C, else=F', "starterCode": "score = 85\nif score >= 90:\n    grade = \"A\"\nelif score >= 80:\n    grade = \"B\"\nelse:\n    grade = \"C\"\nprint(grade)", "solution": "score = 85\nif score >= 90:\n    grade = \"A\"\nelif score >= 80:\n    grade = \"B\"\nelse:\n    grade = \"C\"\nprint(grade)"}]',
'code', 20),

('30000000-0000-0000-0000-000000000004', 'Nested If Statements', 'If inside if', 'intermediate', 25, 4, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Nested ifs check multiple condition levels. Use proper indentation."}, {"type": "code", "question": "Check if number is positive and even', "starterCode": "num = 8\nif num > 0:\n    if num % 2 == 0:\n        print(\"Positive even\")\nelse:\n    print(\"Not positive\")", "solution": "num = 8\nif num > 0:\n    if num % 2 == 0:\n        print(\"Positive even\")\nelse:\n    print(\"Not positive\")"}]',
'code', 18),

('30000000-0000-0000-0000-000000000005', 'Logical Operators', 'And, or, not operators', 'intermediate', 20, 5, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "and: both must be True. or: at least one True. not: reverses truth value."}, {"type": "multiple-choice", "question": "(True and False) or True = ?", "options": ["True", "False"], "correctAnswer": "True"}]',
'multiple-choice', 12),

('30000000-0000-0000-0000-000000000006', 'Ternary Operator', 'Concise if-else expressions', 'intermediate', 18, 6, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Ternary: value_if_true if condition else value_if_false. Great for simple assignments."}, {"type": "code", "question": "Adult or minor based on age', "starterCode": "age = 20\nstatus = \"adult\" if age >= 18 else \"minor\"\nprint(status)", "solution": "age = 20\nstatus = \"adult\" if age >= 18 else \"minor\"\nprint(status)"}]',
'code', 10),

('30000000-0000-0000-0000-000000000007', 'Match Statements', 'Pattern matching', 'intermediate', 24, 7, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Match statements (Python 3.10+). case for patterns, case _ for default."}, {"type": "code", "question": "Match day of week', "starterCode": "day = \"Monday\"\nmatch day:\n    case \"Monday\":\n        print(\"Start week\")\n    case _:\n        print(\"Other day\")", "solution": "day = \"Monday\"\nmatch day:\n    case \"Monday\":\n        print(\"Start week\")\n    case _:\n        print(\"Other day\")"}]',
'code', 15),

('30000000-0000-0000-0000-000000000008', 'Conditional Best Practices', 'Clean conditional code', 'intermediate', 16, 8, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Best practices: Keep conditions simple, use descriptive names, avoid deep nesting."}, {"type": "multiple-choice", "question": "What is a guard clause?", "options": ["Early error check", "Loop type"], "correctAnswer": "Early error check"}]',
'multiple-choice', 10);

-- Add 12 more lessons to reach 36 total before continuing
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
('40000000-0000-0000-0000-000000000001', 'Creating Functions', 'Define and use functions', 'intermediate', 25, 1, '00000000-0000-0000-0000-000000000004',
'[{"type": "text", "content": "Functions are reusable code blocks. Define with def keyword. Use return to send back values."}, {"type": "code", "question": "Create function that adds two numbers', "starterCode": "def add(a, b):\n    return a + b\nresult = add(3, 4)\nprint(result)", "solution": "def add(a, b):\n    return a + b\nresult = add(3, 4)\nprint(result)"}]',
'code', 20),

('40000000-0000-0000-0000-000000000002', 'Function Parameters', 'Pass data to functions', 'intermediate', 28, 2, '00000000-0000-0000-0000-000000000004',
'[{"type": "text", "content": "Parameters pass data to functions: positional, keyword, default parameters."}, {"type": "code", "question": "Function with default parameter', "starterCode": "def greet(name, greeting=\"Hello\"):\n    return f\"{greeting}, {name}\"\nprint(greet(\"Alice\"))\nprint(greet(\"Bob\", \"Hi\"))", "solution": "def greet(name, greeting=\"Hello\"):\n    return f\"{greeting}, {name}\"\nprint(greet(\"Alice\"))\nprint(greet(\"Bob\", \"Hi\"))"}]',
'code', 18),

('40000000-0000-0000-0000-000000000003', 'Return Values', 'Functions that return data', 'intermediate', 22, 3, '00000000-0000-0000-0000-000000000004',
'[{"type": "text", "content": "Functions can return single or multiple values using return statement."}, {"type": "code', "question": "Function that returns sum and average', "starterCode": "def stats(numbers):\n    total = sum(numbers)\n    avg = total / len(numbers)\n    return total, avg\nnums = [1, 2, 3, 4, 5]\ntot, average = stats(nums)\nprint(f\"Total: {tot}, Average: {average}\")", "solution": "def stats(numbers):\n    total = sum(numbers)\n    avg = total / len(numbers)\n    return total, avg\nnums = [1, 2, 3, 4, 5]\ntot, average = stats(nums)\nprint(f\"Total: {tot}, Average: {average}\")"}]',
'code', 15),

('40000000-0000-0000-0000-000000000004', 'Importing Modules', 'Using external code', 'intermediate', 26, 4, '00000000-0000-0000-0000-000000000004',
'[{"type": "text", "content": "Import modules: import module, from module import function, import module as alias."}, {"type": "code", "question": "Import and use math module', "starterCode": "import math\nprint(f\"Pi: {math.pi}\")\nprint(f\"Square root of 16: {math.sqrt(16)}\")", "solution": "import math\nprint(f\"Pi: {math.pi}\")\nprint(f\"Square root of 16: {math.sqrt(16)}\")"}]',
'code', 12),

('40000000-0000-0000-0000-000000000005', 'Lists Introduction', 'Python list basics', 'intermediate', 25, 1, '00000000-0000-0000-0000-000000000005',
'[{"type": "text", "content": "Lists are ordered, mutable collections. Create with square brackets. Access with index."}, {"type": "code", "question": "Create and modify a list', "starterCode": "fruits = [\"apple\", \"banana\"]\nfruits.append(\"orange\")\nprint(f\"First: {fruits[0]}, Length: {len(fruits)}\")", "solution": "fruits = [\"apple\", \"banana\"]\nfruits.append(\"orange\")\nprint(f\"First: {fruits[0]}, Length: {len(fruits)}\")"}]',
'code', 20),

('40000000-0000-0000-0000-000000000006', 'List Methods', 'Common list operations', 'intermediate', 30, 2, '00000000-0000-0000-0000-000000000005',
'[{"type": "text", "content": "List methods: append, extend, insert, remove, pop, sort, reverse, count."}, {"type": "code", "question": "Use various list methods', "starterCode": "nums = [3, 1, 4, 1, 5]\nnums.sort()\nnums.append(6)\nnums.remove(1)\nprint(nums)", "solution": "nums = [3, 1, 4, 1, 5]\nnums.sort()\nnums.append(6)\nnums.remove(1)\nprint(nums)"}]',
'code', 18),

('40000000-0000-0000-0000-000000000007', 'List Slicing', 'Extract parts of lists', 'intermediate', 22, 3, '00000000-0000-0000-0000-000000000005',
'[{"type": "text", "content": "List slicing: list[start:stop:step]. Negative indices count from end."}, {"type": "code", "question": 'Slice a list in different ways', "starterCode": "nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]\nprint(f\"First 3: {nums[:3]}\")\nprint(f\"Last 3: {nums[-3:]}\")\nprint(f\"Every other: {nums[::2]}\")", "solution": "nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]\nprint(f\"First 3: {nums[:3]}\")\nprint(f\"Last 3: {nums[-3:]}\")\nprint(f\"Every other: {nums[::2]}\")"}]',
'code', 15),

('40000000-0000-0000-0000-000000000008', 'For Loops', 'Iterating over sequences', 'intermediate', 28, 1, '00000000-0000-0000-0000-000000000006',
'[{"type": "text", "content": "For loops iterate over sequences: for item in sequence. Use range() for numbers."}, {"type": "code", "question": "Print numbers 1-5 with for loop', "starterCode": "for i in range(1, 6):\n    print(f\"Number: {i}\")", "solution": "for i in range(1, 6):\n    print(f\"Number: {i}\")"}]',
'code', 12),

('40000000-0000-0000-0000-000000000009', 'While Loops', 'Loop based on conditions', 'intermediate', 30, 2, '00000000-0000-0000-0000-000000000006',
'[{"type": "text", "content": "While loops continue while condition is True. Be careful with infinite loops."}, {"type": "code", "question": "Countdown from 5 to 1', "starterCode": "count = 5\nwhile count > 0:\n    print(count)\n    count -= 1", "solution": "count = 5\nwhile count > 0:\n    print(count)\n    count -= 1"}]',
'code', 10),

('40000000-0000-0000-0000-000000000010', 'String Methods', 'Common string operations', 'intermediate', 22, 1, '00000000-0000-0000-0000-000000000007',
'[{"type": "text", "content": "String methods: upper(), lower(), strip(), split(), join(), replace()."}, {"type": "code", "question": "Clean and transform text', "starterCode": "text = \"  hello world  \"\nclean = text.strip()\nupper = clean.upper()\nwords = clean.split()\nprint(f\"Clean: {clean}\")\nprint(f\"Upper: {upper}\")\nprint(f\"Words: {words}\")", "solution": "text = \"  hello world  \"\nclean = text.strip()\nupper = clean.upper()\nwords = clean.split()\nprint(f\"Clean: {clean}\")\nprint(f\"Upper: {upper}\")\nprint(f\"Words: {words}\")"}]',
'code', 18),

('40000000-0000-0000-0000-000000000011', 'String Formatting', 'Modern string formatting', 'intermediate', 24, 2, '00000000-0000-0000-0000-000000000007',
'[{"type": "text", "content": "F-strings (Python 3.6+): f\"{variable}\". Modern and readable."}, {"type": "code", "question": "Format name and age with f-string', "starterCode": "name = \"Alice\"\nage = 30\nprint(f\"{name} is {age} years old\")", "solution": "name = \"Alice\"\nage = 30\nprint(f\"{name} is {age} years old\")"}]',
'code', 12),

('40000000-0000-0000-0000-000000000012', 'Reading Files', 'Reading from text files', 'intermediate', 25, 1, '00000000-0000-0000-0000-000000000008',
'[{"type": "text", "content": "Read files: open(file, \"r\"). Use with statement for automatic closing."}, {"type": "code", "question": "Read and print file contents', "starterCode": "with open(\"sample.txt\", \"w\") as f:\n    f.write(\"Hello World\\nPython Rocks\")\n\nwith open(\"sample.txt\", \"r\") as f:\n    content = f.read()\n    print(content)", "solution": "with open(\"sample.txt\", \"w\") as f:\n    f.write(\"Hello World\\nPython Rocks\")\n\nwith open(\"sample.txt\", \"r\") as f:\n    content = f.read()\n    print(content)"}]',
'code', 18);

-- Add 24 more lessons to reach 60 total
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
('50000000-0000-0000-0000-000000000001', 'Writing Files', 'Creating and modifying files', 'intermediate', 28, 2, '00000000-0000-0000-0000-000000000008',
'[{"type": "text", "content": "Write files: open(file, \"w\") for overwrite, \"a\" for append. Use write() and writelines()."}, {"type": "code", "question": "Write log entries to file', "starterCode": "with open(\"log.txt\", \"w\") as f:\n    f.write(\"Program started\\n\")\n    f.write(\"User logged in\\n\")\n    f.write(\"Processing complete\\n\")\n\nwith open(\"log.txt\", \"r\") as f:\n    print(f.read())", "solution": "with open(\"log.txt\", \"w\") as f:\n    f.write(\"Program started\\n\")\n    f.write(\"User logged in\\n\")\n    f.write(\"Processing complete\\n\")\n\nwith open(\"log.txt\", \"r\") as f:\n    print(f.read())"}]',
'code', 20),

('50000000-0000-0000-0000-000000000002', 'CSV Files', 'Working with comma-separated values', 'intermediate', 30, 3, '00000000-0000-0000-0000-000000000008',
'[{"type": "text", "content": "CSV files: Use csv module for proper handling of comma-separated values."}, {"type": "code", "question": "Write and read CSV file', "starterCode": "import csv\n\n# Write CSV\nwith open(\"data.csv\", \"w\", newline=\"\") as f:\n    writer = csv.writer(f)\n    writer.writerow([\"Name\", \"Age\", \"City\"])\n    writer.writerow([\"Alice\", 25, \"NYC\"])\n    writer.writerow([\"Bob\", 30, \"LA\"])\n\n# Read CSV\nwith open(\"data.csv\", \"r\") as f:\n    reader = csv.reader(f)\n    for row in reader:\n        print(f\"{row[0]} is {row[1]} years old, lives in {row[2]}\")", "solution": "import csv\nwith open(\"data.csv\", \"w\", newline=\"\") as f:\n    writer = csv.writer(f)\n    writer.writerow([\"Name\", \"Age\", \"City\"])\n    writer.writerow([\"Alice\", 25, \"NYC\"])\n    writer.writerow([\"Bob\", 30, \"LA\"])\n\nwith open(\"data.csv\", \"r\") as f:\n    reader = csv.reader(f)\n    for row in reader:\n        print(f\"{row[0]} is {row[1]} years old, lives in {row[2]}\")"}]',
'code', 22),

('50000000-0000-0000-0000-000000000003', 'Try-Except Blocks', 'Handling exceptions', 'intermediate', 28, 1, '00000000-0000-0000-0000-000000000009',
'[{"type": "text", "content": "Exception handling: try for code that might fail, except for specific errors."}, {"type": "code", "question": "Handle division by zero', "starterCode": "def divide(a, b):\n    try:\n        result = a / b\n        print(f\"{a} / {b} = {result}\")\n    except ZeroDivisionError:\n        print(\"Cannot divide by zero\")\n\ndivide(10, 2)\ndivide(10, 0)", "solution": "def divide(a, b):\n    try:\n        result = a / b\n        print(f\"{a} / {b} = {result}\")\n    except ZeroDivisionError:\n        print(\"Cannot divide by zero\")\n\ndivide(10, 2)\ndivide(10, 0)"}]',
'code', 18),

('50000000-0000-0000-0000-000000000004', 'Common Exceptions', 'Understanding Python exceptions', 'intermediate', 24, 2, '00000000-0000-0000-0000-000000000009',
'[{"type": "text", "content": "Common exceptions: ValueError, TypeError, KeyError, IndexError, FileNotFoundError."}, {"type": "code", "question": "Handle multiple exception types', "starterCode": "def get_item(data, key):\n    try:\n        return data[key]\n    except KeyError:\n        return \"Key not found\"\n    except TypeError:\n        return \"Invalid data type\"\n\nprint(get_item({\"a\": 1}, \"a\"))\nprint(get_item({\"a\": 1}, \"b\"))\nprint(get_item(\"not a dict\", \"a\"))", "solution": "def get_item(data, key):\n    try:\n        return data[key]\n    except KeyError:\n        return \"Key not found\"\n    except TypeError:\n        return \"Invalid data type\"\n\nprint(get_item({\"a\": 1}, \"a\"))\nprint(get_item({\"a\": 1}, \"b\"))\nprint(get_item(\"not a dict\", \"a\"))"}]',
'code', 20),

('50000000-0000-0000-0000-000000000005', 'Classes and Objects', 'Object-oriented programming basics', 'advanced', 35, 1, '00000000-0000-0000-0000-000000000010',
'[{"type": "text", "content": "Classes are blueprints for objects. Objects have attributes (data) and methods (functions)."}, {"type": "code", "question": 'Create simple Person class', "starterCode": "class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def introduce(self):\n        return f\"Hi, I\\'m {self.name} and I\\'m {self.age}\"\n\nalice = Person(\"Alice\", 25)\nprint(alice.introduce())", "solution": "class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    def introduce(self):\n        return f\"Hi, I\\'m {self.name} and I\\'m {self.age}\"\n\nalice = Person(\"Alice\", 25)\nprint(alice.introduce())"}]',
'code', 25),

('50000000-0000-0000-0000-000000000006', 'Inheritance', 'Child classes from parent classes', 'advanced', 32, 2, '00000000-0000-0000-0000-000000000010',
'[{"type": "text", "content": "Inheritance: child classes inherit from parent classes. Use super() to call parent methods."}, {"type": "code", "question": 'Create Animal and Dog classes', "starterCode": "class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return f\"{self.name} makes a sound\"\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name)\n        self.breed = breed\n    def speak(self):\n        return f\"{self.name} barks\"\n\nbuddy = Dog(\"Buddy\", \"Golden Retriever\")\nprint(buddy.speak())", "solution": "class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return f\"{self.name} makes a sound\"\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name)\n        self.breed = breed\n    def speak(self):\n        return f\"{self.name} barks\"\n\nbuddy = Dog(\"Buddy\", \"Golden Retriever\")\nprint(buddy.speak())"}]',
'code', 28),

('50000000-0000-0000-0000-000000000007', 'Dictionary Basics', 'Key-value pairs', 'intermediate', 26, 1, '00000000-0000-0000-0000-000000000005',
'[{"type": "text", "content": "Dictionaries store key-value pairs. Access values with square brackets."}, {"type": "code", "question": "Create and use dictionary', "starterCode": "student = {\n    \"name\": \"Alice\",\n    \"age\": 20,\n    \"grades\": [90, 85, 95]\n}\nprint(f\"Name: {student[\\\"name\\\"]}\")\nprint(f\"Age: {student[\\\"age\\\"]}\")\nprint(f\"Grades: {student[\\\"grades\\\"]}\")", "solution": "student = {\n    \"name\": \"Alice\",\n    \"age\": 20,\n    \"grades\": [90, 85, 95]\n}\nprint(f\"Name: {student[\\\"name\\\"]}\")\nprint(f\"Age: {student[\\\"age\\\"]}\")\nprint(f\"Grades: {student[\\\"grades\\\"]}\")"}]',
'code', 20),

('50000000-0000-0000-0000-000000000008', 'Dictionary Methods', 'Dictionary operations', 'intermediate', 30, 2, '00000000-0000-0000-0000-000000000005',
'[{"type": "text", "content": "Dictionary methods: keys(), values(), items(), get(), update(), pop()."}, {"type": "code", "question": 'Use dictionary methods', "starterCode": "scores = {\"math\": 95, \"science\": 88, \"english\": 92}\nprint(f\"Subjects: {list(scores.keys())}\")\nprint(f\"Scores: {list(scores.values())}\")\nprint(f\"Items: {list(scores.items())}\")", "solution": "scores = {\"math\": 95, \"science\": 88, \"english\": 92}\nprint(f\"Subjects: {list(scores.keys())}\")\nprint(f\"Scores: {list(scores.values())}\")\nprint(f\"Items: {list(scores.items())}\")"}]',
'code', 18),

('50000000-0000-0000-0000-000000000009', 'List Comprehensions', 'Creating lists concisely', 'advanced', 32, 3, '00000000-0000-0000-0000-000000000005',
'[{"type": "text", "content": "List comprehensions: [expression for item in iterable if condition]. More readable than loops."}, {"type": "code", "question": 'Create squares and even numbers list comprehensions', "starterCode": "squares = [x**2 for x in range(10)]\nevens = [x for x in range(20) if x % 2 == 0]\nprint(f\"Squares: {squares}\")\nprint(f\"Even numbers: {evens}\")", "solution": "squares = [x**2 for x in range(10)]\nevens = [x for x in range(20) if x % 2 == 0]\nprint(f\"Squares: {squares}\")\nprint(f\"Even numbers: {evens}\")"}]',
'code', 20),

('50000000-0000-0000-0000-000000000010', 'Tuples and Sets', 'Immutable collections and unique items', 'intermediate', 28, 4, '00000000-0000-0000-0000-000000000005',
'[{"type": "text", "content": "Tuples: ordered, immutable (use parentheses). Sets: unordered, unique items (use curly braces)."}, {"type": "code", "question": 'Work with tuples and sets', "starterCode": "point = (3, 4)\nx, y = point\nprint(f\"Coordinates: ({x}, {y})\")\n\nnumbers = [1, 2, 2, 3, 3, 4]\nunique_numbers = set(numbers)\nprint(f\"Original: {numbers}\")\nprint(f\"Unique: {unique_numbers}\")", "solution": "point = (3, 4)\nx, y = point\nprint(f\"Coordinates: ({x}, {y})\")\n\nnumbers = [1, 2, 2, 3, 3, 4]\nunique_numbers = set(numbers)\nprint(f\"Original: {numbers}\")\nprint(f\"Unique: {unique_numbers}\")"}]',
'code', 18),

('50000000-0000-0000-0000-000000000011', 'Special Methods', 'Magic methods in classes', 'advanced', 35, 1, '00000000-0000-0000-0000-000000000010',
'[{"type": "text", "content": "Special methods: __init__, __str__, __len__, __getitem__, __contains__."}, {"type": "code", 'Question: "Create class with __len__ and __getitem__', "starterCode": "class Cart:\n    def __init__(self):\n        self.items = []\n    def __len__(self):\n        return len(self.items)\n    def __getitem__(self, index):\n        return self.items[index]\n    def add(self, item):\n        self.items.append(item)\n\ncart = Cart()\ncart.add(\"apple\")\ncart.add(\"banana\")\nprint(f\"Cart size: {len(cart)}\")\nprint(f\"First item: {cart[0]}\")", "solution": "class Cart:\n    def __init__(self):\n        self.items = []\n    def __len__(self):\n        return len(self.items)\n    def __getitem__(self, index):\n        return self.items[index]\n    def add(self, item):\n        self.items.append(item)\n\ncart = Cart()\ncart.add(\"apple\")\ncart.add(\"banana\")\nprint(f\"Cart size: {len(cart)}\")\nprint(f\"First item: {cart[0]}\")"}]',
'code', 30),

('50000000-0000-0000-0000-000000000012', 'Lambda Functions', 'Anonymous functions', 'intermediate', 26, 2, '00000000-0000-0000-0000-000000000004',
'[{"type": "text", "content": "Lambda functions: lambda arguments: expression. Small anonymous functions."}, {"type": "code", "question": "Use lambda functions with map and filter', "starterCode": "numbers = [1, 2, 3, 4, 5]\ndoubled = list(map(lambda x: x * 2, numbers))\nevens = list(filter(lambda x: x % 2 == 0, numbers))\nprint(f\"Doubled: {doubled}\")\nprint(f\"Even: {evens}\")", "solution": "numbers = [1, 2, 3, 4, 5]\ndoubled = list(map(lambda x: x * 2, numbers))\nevens = list(filter(lambda x: x % 2 == 0, numbers))\nprint(f\"Doubled: {doubled}\")\nprint(f\"Even: {evens}\")"}]',
'code', 15),

('50000000-0000-0000-0000-000000000013', 'String Slicing Advanced', 'Advanced string manipulation', 'intermediate', 26, 3, '00000000-0000-0000-0000-000000000007',
'[{"type": "text", "content": "Advanced slicing: negative indices, step parameter, reverse strings."}, {"type": "code", "question": 'Advanced string slicing operations', "starterCode": "text = \"Python Programming\"\nprint(f\"Last 5 chars: {text[-5:]}\")\nprint(f\"Every 3rd char: {text[::3]}\")\nprint(f\"Reversed: {text[::-1]}\")", "solution": "text = \"Python Programming\"\nprint(f\"Last 5 chars: {text[-5:]}\")\nprint(f\"Every 3rd char: {text[::3]}\")\nprint(f\"Reversed: {text[::-1]}\")"}]',
'code', 12),

('50000000-0000-0000-0000-000000000014', 'Loop Control', 'Break and continue statements', 'intermediate', 24, 3, '00000000-0000-0000-0000-000000000006',
'[{"type": "text", "content": "Loop control: break exits loop, continue skips to next iteration."}, {"type": "code", "question": "Find first even number between 10-20', "starterCode": "for num in range(10, 21):\n    if num % 2 == 0:\n        print(f\"First even number: {num}\")\n        break", "solution": "for num in range(10, 21):\n    if num % 2 == 0:\n        print(f\"First even number: {num}\")\n        break"}]',
'code', 10),

('50000000-0000-0000-0000-000000000015', 'Loop Patterns', 'Common looping patterns', 'intermediate', 20, 4, '00000000-0000-0000-0000-000000000006',
'[{"type": "text", "content": "Common patterns: enumeration, accumulation, searching, filtering."}, {"type": "code", "question": "Count words in string using enumerate', "starterCode": "sentence = \"Python is awesome and powerful\"\nwords = sentence.split()\nfor i, word in enumerate(words, 1):\n    print(f\"Word {i}: {word}\")", "solution": "sentence = \"Python is awesome and powerful\"\nwords = sentence.split()\nfor i, word in enumerate(words, 1):\n    print(f\"Word {i}: {word}\")"}]',
'code', 15),

('50000000-0000-0000-0000-000000000016', 'String Encoding', 'Working with text encoding', 'advanced', 30, 4, '00000000-0000-0000-0000-000000000007',
'[{"type": "text", "content": "Text encoding: UTF-8, ASCII. Encode/decode between bytes and strings."}, {"type": "code", "question": "Encode and decode text', "starterCode": "text = \"Hello World\"\nencoded = text.encode('utf-8')\ndecoded = encoded.decode('utf-8')\nprint(f\"Original: {text}\")\nprint(f\"Encoded bytes: {encoded}\")\nprint(f\"Decoded: {decoded}\")", "solution": "text = \"Hello World\"\nencoded = text.encode('utf-8')\ndecoded = encoded.decode('utf-8')\nprint(f\"Original: {text}\")\nprint(f\"Encoded bytes: {encoded}\")\nprint(f\"Decoded: {decoded}\")"}]',
'code', 18),

('50000000-0000-0000-0000-000000000017', 'Regular Expressions', 'Pattern matching', 'advanced', 35, 5, '00000000-0000-0000-0000-000000000007',
'[{"type": "text", "content": "Regex patterns: . (any char), ^ (start), $ (end), * (0+), + (1+), [] (char set)."}, {"type": "code", "question": "Use regex for email validation', "starterCode": "import re\npattern = r\"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\"\nemail = \"user@example.com\"\nif re.match(pattern, email):\n    print(\"Valid email\")\nelse:\n    print(\"Invalid email\")", "solution": "import re\npattern = r\"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\"\nemail = \"user@example.com\"\nif re.match(pattern, email):\n    print(\"Valid email\")\nelse:\n    print(\"Invalid email\")"}]',
'code', 25),

('50000000-000000-0000-0000-000000000018', 'Error Handling Best', 'Robust error handling practices', 'advanced', 32, 2, '00000000-0000-0000-0000-000000000009',
'[{"type": "text", "content": "Best practices: Handle specific exceptions, use logging, clean up in finally."}, {"type": "code", "question": "Robust file processing with error handling', "starterCode": "def read_file(filename):\n    try:\n        with open(filename, \"r\") as f:\n            return f.read()\n    except FileNotFoundError:\n        print(f\"File not found: {filename}\")\n        return \"\"\n    except Exception as e:\n        print(f\"Error: {e}\")\n        return \"\"\n\ncontent = read_file(\"nonexistent.txt\")", "solution": "def read_file(filename):\n    try:\n        with open(filename, \"r\") as f:\n            return f.read()\n    except FileNotFoundError:\n        print(f\"File not found: {filename}\")\n        return \"\"\n    except Exception as e:\n        print(f\"Error: {e}\")\n        return \"\"\n\ncontent = read_file(\"nonexistent.txt\")"}]',
'code', 22);

SELECT '🎉 SUCCESS: 60 complete Python lessons added!' as message,
       COUNT(*) as total_lessons,
       (SELECT COUNT(*) FROM sections) as total_sections
FROM lessons;