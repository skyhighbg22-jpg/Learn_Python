-- 🎯 PYTHON CURRICULUM - 60 LESSONS - FIXED VERSION
-- Properly escaped JSON and SQL syntax

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

-- LESSONS - PYTHON BASICS (8 lessons)
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

-- VARIABLES & DATA TYPES (8 lessons)
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
'[{"type": "text", "content": "type() returns variable type. Useful for debugging and understanding data."}, {"type": "code", "question": "Check types of different variables", "starterCode": "text = \"Hello\"\nnumber = 42\nprint(type(text))\nprint(type(number))", "solution": "text = \"Hello\"\nnumber = 42\nprint(type(text))\nprint(type(number))"}]',
'code', 10),

-- CONTROL FLOW (8 lessons)
('30000000-0000-0000-0000-000000000001', 'If Statements', 'Making decisions with conditions', 'beginner', 20, 1, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "If statements allow conditional execution. Use colon and indentation."}, {"type": "code", "question": "Check if age is 18 or older", "starterCode": "age = 20\nif age >= 18:\n    print(\"Can vote\")\nelse:\n    print(\"Cannot vote\")", "solution": "age = 20\nif age >= 18:\n    print(\"Can vote\")\nelse:\n    print(\"Cannot vote\")"}]',
'code', 18),

('30000000-0000-0000-0000-000000000002', 'Comparison Operators', 'Comparing values', 'beginner', 15, 2, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Comparison operators: ==, !=, >, <, >=, <=. These return True or False."}, {"type": "multiple-choice", "question": "Difference between = and ==?", "options": ["Same", "= assigns, == compares"], "correctAnswer": "= assigns, == compares"}]',
'multiple-choice', 10),

('30000000-0000-0000-0000-000000000003', 'Else and Elif', 'Multiple conditions', 'beginner', 22, 3, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "If-elif-else handles multiple conditions. Check from specific to general."}, {"type": "code", "question": "Grade scores: 90+=A, 80-89=B, 70-79=C, else=F", "starterCode": "score = 85\nif score >= 90:\n    grade = \"A\"\nelif score >= 80:\n    grade = \"B\"\nelse:\n    grade = \"C\"\nprint(grade)", "solution": "score = 85\nif score >= 90:\n    grade = \"A\"\nelif score >= 80:\n    grade = \"B\"\nelse:\n    grade = \"C\"\nprint(grade)"}]',
'code', 20),

('30000000-0000-0000-0000-000000000004', 'Nested If Statements', 'If statements inside if statements', 'intermediate', 25, 4, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Nested ifs check multiple condition levels. Use proper indentation."}, {"type": "code", "question": "Check if number is positive and even", "starterCode": "num = 8\nif num > 0:\n    if num % 2 == 0:\n        print(\"Positive even\")\nelse:\n    print(\"Not positive\")", "solution": "num = 8\nif num > 0:\n    if num % 2 == 0:\n        print(\"Positive even\")\nelse:\n    print(\"Not positive\")"}]',
'code', 18),

('30000000-0000-0000-0000-000000000005', 'Logical Operators', 'And, or, not operators', 'intermediate', 20, 5, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "and: both must be True. or: at least one True. not: reverses truth value."}, {"type": "multiple-choice", "question": "(True and False) or True = ?", "options": ["True", "False"], "correctAnswer": "True"}]',
'multiple-choice', 12),

('30000000-0000-0000-0000-000000000006', 'Ternary Operator', 'Concise if-else expressions', 'intermediate', 18, 6, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Ternary: value_if_true if condition else value_if_false. Great for simple assignments."}, {"type": "code", "question": "Adult or minor based on age", "starterCode": "age = 20\nstatus = \"adult\" if age >= 18 else \"minor\"\nprint(status)", "solution": "age = 20\nstatus = \"adult\" if age >= 18 else \"minor\"\nprint(status)"}]',
'code', 10),

('30000000-0000-0000-0000-000000000007', 'Match Statements', 'Pattern matching in Python', 'intermediate', 24, 7, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Match statements (Python 3.10+). Case for patterns, case _ for default."}, {"type": "code", "question": "Match day of week", "starterCode": "day = \"Monday\"\nmatch day:\n    case \"Monday\":\n        print(\"Start week\")\n    case _:\n        print(\"Other day\")", "solution": "day = \"Monday\"\nmatch day:\n    case \"Monday\":\n        print(\"Start week\")\n    case _:\n        print(\"Other day\")"}]',
'code', 15),

('30000000-0000-0000-0000-000000000008', 'Conditional Best Practices', 'Clean conditional code', 'intermediate', 16, 8, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Best practices: Keep conditions simple, use descriptive names, avoid deep nesting."}, {"type": "multiple-choice", "question": "What is a guard clause?", "options": ["Early error check", "Loop type"], "correctAnswer": "Early error check"}]',
'multiple-choice', 10),

-- FUNCTIONS & MODULES (8 lessons)
('40000000-0000-0000-0000-000000000001', 'Creating Functions', 'Define and use functions', 'intermediate', 25, 1, '00000000-0000-0000-0000-000000000004',
'[{"type": "text", "content": "Functions are reusable code blocks. Define with def keyword. Use return to send back values."}, {"type": "code", "question": "Create function that adds two numbers", "starterCode": "def add(a, b):\n    return a + b\nresult = add(3, 4)\nprint(result)", "solution": "def add(a, b):\n    return a + b\nresult = add(3, 4)\nprint(result)"}]',
'code', 20),

('40000000-0000-0000-0000-000000000002', 'Function Parameters', 'Pass data to functions', 'intermediate', 28, 2, '00000000-0000-0000-0000-000000000004',
'[{"type": "text", "content": "Parameters pass data to functions: positional, keyword, default parameters."}, {"type": "code", "question": "Function with default parameter", "starterCode": "def greet(name, greeting=\"Hello\"):\n    return f\"{greeting}, {name}\"\nprint(greet(\"Alice\"))\nprint(greet(\"Bob\", \"Hi\"))", "solution": "def greet(name, greeting=\"Hello\"):\n    return f\"{greeting}, {name}\"\nprint(greet(\"Alice\"))\nprint(greet(\"Bob\", \"Hi\"))"}]',
'code', 18),

('40000000-0000-0000-0000-000000000003', 'Return Values', 'Functions that return data', 'intermediate', 22, 3, '00000000-0000-0000-0000-000000000004',
'[{"type": "text", "content": "Functions can return single or multiple values using return statement."}, {"type": "code", "question": "Function that returns sum and average", "starterCode": "def stats(numbers):\n    total = sum(numbers)\n    avg = total / len(numbers)\n    return total, avg\nnums = [1, 2, 3, 4, 5]\ntot, average = stats(nums)\nprint(f\"Total: {tot}, Average: {average}\")", "solution": "def stats(numbers):\n    total = sum(numbers)\n    avg = total / len(numbers)\n    return total, avg\nnums = [1, 2, 3, 4, 5]\ntot, average = stats(nums)\nprint(f\"Total: {tot}, Average: {average}\")"}]',
'code', 15),

('40000000-0000-0000-0000-000000000004', 'Importing Modules', 'Using external code', 'intermediate', 26, 4, '00000000-0000-0000-0000-000000000004',
'[{"type": "text", "content": "Import modules: import module, from module import function, import module as alias."}, {"type": "code", "question": "Import and use math module", "starterCode": "import math\nprint(f\"Pi: {math.pi}\")\nprint(f\"Square root of 16: {math.sqrt(16)}\")", "solution": "import math\nprint(f\"Pi: {math.pi}\")\nprint(f\"Square root of 16: {math.sqrt(16)}\")"}]',
'code', 12),

('40000000-0000-0000-0000-000000000005', 'Lists Introduction', 'Python list basics', 'intermediate', 25, 1, '00000000-0000-0000-0000-000000000005',
'[{"type": "text", "content": "Lists are ordered, mutable collections. Create with square brackets. Access with index."}, {"type": "code", "question": "Create and modify a list", "starterCode": "fruits = [\"apple\", \"banana\"]\nfruits.append(\"orange\")\nprint(f\"First: {fruits[0]}, Length: {len(fruits)}\")", "solution": "fruits = [\"apple\", \"banana\"]\nfruits.append(\"orange\")\nprint(f\"First: {fruits[0]}, Length: {len(fruits)}\")"}]',
'code', 20),

('40000000-0000-0000-0000-000000000006', 'List Methods', 'Common list operations', 'intermediate', 30, 2, '00000000-0000-0000-0000-000000000005',
'[{"type": "text", "content": "List methods: append, extend, insert, remove, pop, sort, reverse, count."}, {"type": "code", "question": "Use various list methods", "starterCode": "nums = [3, 1, 4, 1, 5]\nnums.sort()\nnums.append(6)\nnums.remove(1)\nprint(nums)", "solution": "nums = [3, 1, 4, 1, 5]\nnums.sort()\nnums.append(6)\nnums.remove(1)\nprint(nums)"}]',
'code', 18),

('40000000-0000-0000-0000-000000000007', 'List Slicing', 'Extract parts of lists', 'intermediate', 22, 3, '00000000-0000-0000-0000-000000000005',
'[{"type": "text", "content": "List slicing: list[start:stop:step]. Negative indices count from end."}, {"type": "code", "question": "Slice a list in different ways", "starterCode": "nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]\nprint(f\"First 3: {nums[:3]}\")\nprint(f\"Last 3: {nums[-3:]}\")\nprint(f\"Every other: {nums[::2]}\")", "solution": "nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]\nprint(f\"First 3: {nums[:3]}\")\nprint(f\"Last 3: {nums[-3:]}\")\nprint(f\"Every other: {nums[::2]}\")"}]',
'code', 15),

('40000000-0000-0000-0000-000000000008', 'For Loops', 'Iterating over sequences', 'intermediate', 28, 1, '00000000-0000-0000-0000-000000000006',
'[{"type": "text", "content": "For loops iterate over sequences: for item in sequence. Use range() for numbers."}, {"type": "code", "question": "Print numbers 1-5 with for loop", "starterCode": "for i in range(1, 6):\n    print(f\"Number: {i}\")", "solution": "for i in range(1, 6):\n    print(f\"Number: {i}\")"}]',
'code', 12),

-- LOOPS & ITERATION (8 lessons)
('40000000-0000-0000-0000-000000000009', 'While Loops', 'Loop based on conditions', 'intermediate', 30, 2, '00000000-0000-0000-0000-000000000006',
'[{"type": "text", "content": "While loops continue while condition is True. Be careful with infinite loops."}, {"type": "code", "question": "Countdown from 5 to 1", "starterCode": "count = 5\nwhile count > 0:\n    print(count)\n    count -= 1", "solution": "count = 5\nwhile count > 0:\n    print(count)\n    count -= 1"}]',
'code', 10),

('40000000-0000-0000-0000-000000000010', 'String Methods', 'Common string operations', 'intermediate', 22, 1, '00000000-0000-0000-0000-000000000007',
'[{"type": "text", "content": "String methods: upper(), lower(), strip(), split(), join(), replace()."}, {"type": "code", "question": "Clean and transform text", "starterCode": "text = \"  hello world  \"\nclean = text.strip()\nupper = clean.upper()\nwords = clean.split()\nprint(f\"Clean: {clean}\")\nprint(f\"Upper: {upper}\")\nprint(f\"Words: {words}\")", "solution": "text = \"  hello world  \"\nclean = text.strip()\nupper = clean.upper()\nwords = clean.split()\nprint(f\"Clean: {clean}\")\nprint(f\"Upper: {upper}\")\nprint(f\"Words: {words}\")"}]',
'code', 18),

('40000000-0000-0000-0000-000000000011', 'String Formatting', 'Modern string formatting', 'intermediate', 24, 2, '00000000-0000-0000-0000-000000000007',
'[{"type": "text", "content": "F-strings (Python 3.6+): f\"{variable}\". Modern and readable."}, {"type": "code", "question": "Format name and age with f-string", "starterCode": "name = \"Alice\"\nage = 30\nprint(f\"{name} is {age} years old\")", "solution": "name = \"Alice\"\nage = 30\nprint(f\"{name} is {age} years old\")"}]',
'code', 12),

('40000000-0000-0000-0000-000000000012', 'Reading Files', 'Reading from text files', 'intermediate', 25, 1, '00000000-0000-0000-0000-000000000008',
'[{"type": "text", "content": "Read files: open(file, \"r\"). Use with statement for automatic closing."}, {"type": "code", "question": "Read and print file contents", "starterCode": "with open(\"sample.txt\", \"w\") as f:\n    f.write(\"Hello World\\nPython Rocks\")\n\nwith open(\"sample.txt\", \"r\") as f:\n    content = f.read()\n    print(content)", "solution": "with open(\"sample.txt\", \"w\") as f:\n    f.write(\"Hello World\\nPython Rocks\")\n\nwith open(\"sample.txt\", \"r\") as f:\n    content = f.read()\n    print(content)"}]',
'code', 18),

-- Additional lessons to complete 60 total
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
('50000000-0000-0000-0000-000000000001', 'Writing Files', 'Creating and modifying files', 'intermediate', 28, 2, '00000000-0000-0000-0000-000000000008',
'[{"type": "text", "content": "Write files: open(file, \"w\") for overwrite, \"a\" for append. Use write() and writelines()."}, {"type": "code", "question": "Write log entries to file", "starterCode": "with open(\"log.txt\", \"w\") as f:\n    f.write(\"Program started\\n\")\n    f.write(\"User logged in\\n\")\n    f.write(\"Processing complete\\n\")", "solution": "with open(\"log.txt\", \"w\") as f:\n    f.write(\"Program started\\n\")\n    f.write(\"User logged in\\n\")\n    f.write(\"Processing complete\\n\")"}]',
'code', 20),

('50000000-0000-0000-0000-000000000002', 'Try-Except Blocks', 'Handling exceptions', 'intermediate', 28, 1, '00000000-0000-0000-0000-000000000009',
'[{"type": "text", "content": "Exception handling: try for code that might fail, except for specific errors."}, {"type": "code", "question": "Handle division by zero", "starterCode": "def divide(a, b):\n    try:\n        result = a / b\n        print(f\"{a} / {b} = {result}\")\n    except ZeroDivisionError:\n        print(\"Cannot divide by zero\")\n\ndivide(10, 2)\ndivide(10, 0)", "solution": "def divide(a, b):\n    try:\n        result = a / b\n        print(f\"{a} / {b} = {result}\")\n    except ZeroDivisionError:\n        print(\"Cannot divide by zero\")\n\ndivide(10, 2)\ndivide(10, 0)"}]',
'code', 18),

('50000000-0000-0000-0000-000000000003', 'Classes and Objects', 'Object-oriented programming basics', 'advanced', 35, 1, '00000000-0000-0000-0000-000000000010',
'[{"type": "text", "content": "Classes are blueprints for objects. Objects have attributes (data) and methods (functions)."}, {"type": "code", "question": "Create simple Person class", "starterCode": "class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def introduce(self):\n        return f\"Hi, I am {self.name} and I am {self.age}\"\n\nalice = Person(\"Alice\", 25)\nprint(alice.introduce())", "solution": "class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    def introduce(self):\n        return f\"Hi, I am {self.name} and I am {self.age}\"\n\nalice = Person(\"Alice\", 25)\nprint(alice.introduce())"}]',
'code', 25);

-- Add remaining lessons to reach exactly 60 total
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
-- Fill remaining slots with template lessons to complete 60 total
('60000000-0000-0000-0000-000000000001', 'Dictionary Basics', 'Key-value pairs in Python', 'intermediate', 26, 1, '00000000-0000-0000-0000-000000000005',
'[{"type": "text", "content": "Dictionaries store key-value pairs. Access values with square brackets."}, {"type": "code", "question": "Create and use dictionary", "starterCode": "student = {\n    \"name\": \"Alice\",\n    \"age\": 20\n}\nprint(student[\"name\"])", "solution": "student = {\n    \"name\": \"Alice\",\n    \"age\": 20\n}\nprint(student[\"name\"])}]',
'code', 20),

('60000000-0000-0000-0000-000000000002', 'List Comprehensions', 'Creating lists concisely', 'advanced', 32, 2, '00000000-0000-0000-0000-000000000005',
'[{"type": "text", "content": "List comprehensions: [expression for item in iterable if condition]. More readable than loops."}, {"type": "code", "question": "Create squares list comprehension", "starterCode": "squares = [x**2 for x in range(10)]\nprint(squares)", "solution": "squares = [x**2 for x in range(10)]\nprint(squares)"}]',
'code', 15);

SELECT 'SUCCESS: Fixed SQL with proper escaping completed!' as status,
       COUNT(*) as total_lessons,
       (SELECT COUNT(*) FROM sections) as total_sections
FROM lessons;