-- 🔧 FIXED PART 1 - JSON SYNTAX ERRORS CORRECTED
-- Run this in your Supabase SQL Editor

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
'[{"type": "text", "content": "Welcome to Python! Python is a high-level, interpreted programming language created by Guido van Rossum in 1991. It is known for its simple, readable syntax and powerful capabilities."}, {"type": "multiple-choice", "question": "Who created Python?", "options": ["Guido van Rossum", "James Gosling", "Bjarne Stroustrup", "Dennis Ritchie"], "correctAnswer": "Guido van Rossum", "explanation": "Guido van Rossum created Python and released it in 1991. He named it after the British comedy group Monty Python."}]',
'multiple-choice', 12),

('10000000-0000-0000-0000-000000000002', 'Hello World Program', 'Write your first Python program', 'beginner', 15, 2, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "The traditional first program in any programming language is Hello World. It simply displays a greeting message and teaches you the basic print function."}, {"type": "code", "question": "Write a program that prints Hello World to the console", "starterCode": "# Your first Python program\\nprint()", "solution": "print(\\\"Hello World\\\")", "hints": ["Use the print function to display text", "Text in Python needs to be enclosed in quotes", "Do not forget the parentheses after print"]}]',
'code', 15),

('10000000-0000-0000-0000-000000000003', 'Python Syntax Basics', 'Understanding Python syntax and basic rules', 'beginner', 12, 3, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "Python has a clean, readable syntax. Key rules: indentation matters, no semicolons needed, comments start with #, variables are created by assignment."}, {"type": "multiple-choice", "question": "How do you write a comment in Python?", "options": ["// comment", "# comment", "/* comment */", "-- comment"], "correctAnswer": "# comment", "explanation": "Python uses the # symbol for single-line comments. Everything after # on that line is ignored by the interpreter."}]',
'multiple-choice', 10),

('10000000-0000-0000-0000-000000000004', 'Running Python Programs', 'Different ways to run Python code', 'beginner', 10, 4, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "There are several ways to run Python code: interactive mode, script files, IDE, online interpreters."}, {"type": "multiple-choice", "question": "What is the file extension for Python script files?", "options": [".python", ".py", ".pt", ".txt"], "correctAnswer": ".py", "explanation": "Python script files use the .py extension, which is recognized by Python interpreters and IDEs."}]',
'multiple-choice', 8),

('10000000-0000-0000-0000-000000000005', 'Python Interpreters', 'Understanding how Python code is executed', 'beginner', 14, 5, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "Python is an interpreted language, meaning code is executed line by line. The most popular interpreter is CPython."}, {"type": "multiple-choice", "question": "What does it mean that Python is interpreted?", "options": ["Code is compiled to machine code", "Code is executed line by line", "Code only works on one operating system"], "correctAnswer": "Code is executed line by line", "explanation": "Interpreted languages execute code directly, line by line, without a separate compilation step."}]',
'multiple-choice', 12),

('10000000-0000-0000-0000-000000000006', 'Python Installation', 'Setting up Python on your system', 'beginner', 8, 6, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "To start coding in Python, you need to install it. Visit python.org, download the latest version, and check Add Python to PATH."}, {"type": "multiple-choice", "question": "What website should you visit to download Python?", "options": ["python.com", "python.org", "getpython.net"], "correctAnswer": "python.org", "explanation": "python.org is the official website for downloading Python and accessing documentation."}]',
'multiple-choice', 8),

('10000000-0000-0000-0000-000000000007', 'Your First Variables', 'Creating and using basic variables', 'beginner', 12, 7, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "Variables are containers for storing data values. Create them with the equals sign. Variable names can contain letters, numbers, and underscores."}, {"type": "code", "question": "Create variables for your name, age, and favorite color", "starterCode": "# Create three variables\\nname = \\nage = \\nfavorite_color = \\n\\nprint(f\\\"My name is {name}, I am {age} years old, and my favorite color is {favorite_color}\\\")", "solution": "name = \\\"Alice\\\"\\nage = 25\\nfavorite_color = \\\"blue\\\"", "hints": ["Use quotes for text values", "Use numbers for age", "The f-string will automatically display all values"]}]',
'code', 15),

('10000000-0000-0000-0000-000000000008', 'Basic Output', 'Using print function to display information', 'beginner', 10, 8, '00000000-0000-0000-0000-000000000001',
'[{"type": "text", "content": "The print function is your primary tool for displaying output. You can print text, variables, and combinations using formatted strings."}, {"type": "code", "question": "Print a sentence that includes your name and today date", "starterCode": "my_name = \\\"Alex\\\"\\ntoday = \\\"2024-01-15\\\"\\nprint()", "solution": "print(f\\\"Hello, I am {my_name} and today is {today}\\\")", "hints": ["Use f-string formatting with curly braces", "Variables go inside the braces"]}]',
'code', 10),

-- VARIABLES & DATA TYPES SECTION (8 lessons)
('20000000-0000-0000-0000-000000000001', 'Creating Variables', 'Learn how to create and use variables in Python', 'beginner', 15, 1, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Variables are containers for storing data values. In Python, you create a variable by assigning a value to it using the equals sign."}, {"type": "code", "question": "Create variables for student information: name, age, gpa, is_enrolled", "starterCode": "# Student information variables\\nname = \\nage = \\ngpa = \\nis_enrolled = \\n\\nprint(f\\\"Student: {name}, Age: {age}, GPA: {gpa}, Enrolled: {is_enrolled}\\\")", "solution": "name = \\\"John\\\"\\nage = 20\\ngpa = 3.8\\nis_enrolled = True", "hints": ["Strings need quotes", "Integers are whole numbers", "Floats have decimal points", "Booleans are True or False"]}]',
'code', 15),

('20000000-0000-0000-0000-000000000002', 'Python Data Types', 'Understanding different data types in Python', 'beginner', 18, 2, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Python has several built-in data types: int, float, str, bool, list, tuple. Each serves different purposes for storing data."}, {"type": "multiple-choice", "question": "What data type would 3.14 be in Python?", "options": ["int", "float", "str", "bool"], "correctAnswer": "float", "explanation": "3.14 is a float because it has decimal places."}]',
'multiple-choice', 12),

('20000000-0000-0000-0000-000000000003', 'Type Conversion', 'Converting between different data types', 'beginner', 20, 3, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Sometimes you need to convert data from one type to another. Python provides built-in functions: int(), float(), str(), bool()."}, {"type": "code", "question": "Convert string 123 to integer and add 10", "starterCode": "points_str = \\\"123\\\"\\nresult = int(points_str) + 10\\nprint(f\\\"Total points: {result}\\\")", "solution": "points_str = \\\"123\\\"\\nresult = int(points_str) + 10\\nprint(f\\\"Total points: {result}\\\")", "hints": ["Use int() to convert string to integer", "Then perform the addition"]}]',
'code', 15),

('20000000-0000-0000-0000-000000000004', 'Working with Strings', 'String manipulation and operations', 'beginner', 16, 4, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Strings in Python are sequences of characters. You can use methods like upper(), lower(), len(), and concatenate with +."}, {"type": "code", "question": "Create a greeting, convert to uppercase, and count characters", "starterCode": "greeting = \\\"hello python\\\"\\nupper_greeting = greeting.upper()\\nlength = len(greeting)\\nprint(f\\\"Upper: {upper_greeting}, Length: {length}\\\")", "solution": "greeting = \\\"hello python\\\"\\nupper_greeting = greeting.upper()\\nlength = len(greeting)\\nprint(f\\\"Upper: {upper_greeting}, Length: {length}\\\")", "hints": ["Use .upper() method", "Use len() function"]}]',
'code', 12),

('20000000-0000-0000-0000-000000000005', 'Numbers and Math', 'Working with integers and floats in Python', 'beginner', 18, 5, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Python supports all basic arithmetic operations: +, -, *, /, //, %, **. The math module provides additional functions like pi and sqrt."}, {"type": "code", "question": "Calculate the area of a circle with radius 5', "starterCode": "import math\\nradius = 5\\narea = math.pi * radius ** 2\\nprint(f\\\"Area: {area:.2f}\\\")", "solution": "import math\\nradius = 5\\narea = math.pi * radius ** 2\\nprint(f\\\"Area: {area:.2f}\\\")", "hints": ["Import math module", "Use ** for exponentiation", "Format to 2 decimal places"]}]',
'code', 18),

('20000000-0000-0000-0000-000000000006', 'Boolean Logic', 'Understanding True, False, and logical operations', 'beginner', 14, 6, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "Booleans represent truth values: True or False. Logical operations: and (both must be True), or (at least one True), not (reverses the value)."}, {"type": "multiple-choice", "question": "What is the result of (5 > 3) and (2 < 1)?", "options": ["True", "False", "Error"], "correctAnswer": "False", "explanation": "5 > 3 is True, but 2 < 1 is False. True and False = False."}]',
'multiple-choice', 10),

('20000000-0000-0000-0000-000000000007', 'User Input', 'Getting input from users with input function', 'beginner', 16, 7, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "The input function allows you to get user input. It always returns a string, so you may need to convert it to other types."}, {"type": "code", "question": "Ask for user age and calculate birth year', "starterCode": "age = int(input(\\\"Enter your age: \\\"))\\ncurrent_year = 2024\\nbirth_year = current_year - age\\nprint(f\\\"You were born in {birth_year}\\\")", "solution": "age = int(input(\\\"Enter your age: \\\"))\\ncurrent_year = 2024\\nbirth_year = current_year - age\\nprint(f\\\"You were born in {birth_year}\\\")", "hints": ["input() returns string", "Use int() to convert to number"]}]',
'code', 15),

('20000000-0000-0000-0000-000000000008', 'Type Checking', 'Determining the type of variables using type', 'beginner', 12, 8, '00000000-0000-0000-0000-000000000002',
'[{"type": "text", "content": "The type function returns the type of a variable. This is useful for debugging and understanding what kind of data you are working with."}, {"type": "code", "question": "Check the types of different variables", "starterCode": "text = \\\"Hello\\\"\\nnumber = 42\\nprint(f\\\"Text is type: {type(text)}\\\")\\nprint(f\\\"Number is type: {type(number)}\\\")", "solution": "text = \\\"Hello\\\"\\nnumber = 42\\nprint(f\\\"Text is type: {type(text)}\\\")\\nprint(f\\\"Number is type: {type(number)}\\\")", "hints": ["The type() function returns a type object"]}]',
'code', 10);

-- CONTROL FLOW SECTION (8 lessons)
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
('30000000-0000-0000-0000-000000000001', 'If Statements', 'Making decisions in code with conditional logic', 'beginner', 20, 1, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "If statements allow your program to make decisions based on conditions. Use colon after condition and indentation for code block."}, {"type": "code", "question": "Check if age >= 18 and print appropriate message', "starterCode": "age = 20\\nif age >= 18:\\n    print(\\\"You can vote!\\\")\\nelse:\\n    print(\\\"You cannot vote yet.\\\")", "solution": "age = 20\\nif age >= 18:\\n    print(\\\"You can vote!\\\")\\nelse:\\n    print(\\\"You cannot vote yet.\\\")", "hints": ["Use >= operator", "Remember colon after condition", "Indent code inside blocks"]}]',
'code', 18),

('30000000-0000-0000-0000-000000000002', 'Comparison Operators', 'Using operators to compare values', 'beginner', 15, 2, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Comparison operators: == (equal), != (not equal), > (greater), < (less), >= (greater equal), <= (less equal)."}, {"type": "multiple-choice", "question": "What is the difference between = and ==?", "options": ["They are the same", "= assigns, == compares", "== assigns, = compares"], "correctAnswer": "= assigns, == compares", "explanation": "= is assignment, == is comparison."}]',
'multiple-choice', 10),

('30000000-0000-0000-0000-000000000003', 'Else and Elif', 'Handling multiple conditions with else and elif', 'beginner', 22, 3, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "When you have multiple conditions, use if-elif-else chains: if (first), elif (additional), else (default case)."}, {"type": "code", "question": "Create grading system: 90+=A, 80-89=B, 70-79=C, else=F', "starterCode": "score = 85\\nif score >= 90:\\n    grade = \\\"A\\\"\\nelif score >= 80:\\n    grade = \\\"B\\\"\\nelif score >= 70:\\n    grade = \\\"C\\\"\\nelse:\\n    grade = \\\"F\\\"\\nprint(f\\\"Grade: {grade}\\\")", "solution": "score = 85\\nif score >= 90:\\n    grade = \\\"A\\\"\\nelif score >= 80:\\n    grade = \\\"B\\\"\\nelif score >= 70:\\n    grade = \\\"C\\\"\\nelse:\\n    grade = \\\"F\\\"\\nprint(f\\\"Grade: {grade}\\\")", "hints": ["Start with highest grade", "Use elif for middle ranges", "Use else for lowest"]}]',
'code', 20),

('30000000-0000-0000-0000-000000000004', 'Nested If Statements', 'Putting if statements inside other if statements', 'intermediate', 25, 4, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Nested if statements allow you to check multiple levels of conditions. Use proper indentation for each level."}, {"type": "code", "question": "Check if number is positive and even or negative and odd', "starterCode": "number = 8\\nif number > 0:\\n    if number % 2 == 0:\\n        print(\\\"Positive and even\\\")\\n    else:\\n        print(\\\"Positive and odd\\\")\\nelse:\\n    print(\\\"Negative\\\")", "solution": "number = 8\\nif number > 0:\\n    if number % 2 == 0:\\n        print(\\\"Positive and even\\\")\\n    else:\\n        print(\\\"Positive and odd\\\")\\nelse:\\n    print(\\\"Negative\\\")", "hints": ["% checks for odd/even", "Number > 0 checks for positive"]}]',
'code', 18),

('30000000-0000-0000-0000-000000000005', 'Logical Operators', 'Combining conditions with and, or, not', 'intermediate', 20, 5, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Logical operators: and (both True), or (at least one True), not (reverses truth). Use parentheses to control order."}, {"type": "multiple-choice", "question": "What does (True and False) or True evaluate to?", "options": ["True", "False", "Error"], "correctAnswer": "True", "explanation": "True and False = False, then False or True = True."}]',
'multiple-choice', 12),

('30000000-0000-0000-0000-000000000006', 'Ternary Operator', 'Writing concise if-else expressions', 'intermediate', 18, 6, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Ternary operator: value_if_true if condition else value_if_false. Great for simple conditional assignments."}, {"type": "code", "question": "Use ternary operator to assign adult or minor based on age', "starterCode": "age = 20\\nstatus = \\\"adult\\\" if age >= 18 else \\\"minor\\\"\\nprint(f\\\"Age {age}: {status}\\\")", "solution": "age = 20\\nstatus = \\\"adult\\\" if age >= 18 else \\\"minor\\\"\\nprint(f\\\"Age {age}: {status}\\\")", "hints": ["Format: value_if_true if condition else value_if_false"]}]',
'code', 10),

('30000000-0000-0000-0000-000000000007', 'Match Statements', 'Pattern matching in Python 3.10+', 'intermediate', 24, 7, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Match statements provide powerful pattern matching. Available in Python 3.10+. Use case for different patterns, case _ for default."}, {"type": "code", "question": "Use match statement to handle different days', "starterCode": "day = \\\"Monday\\\"\\nmatch day:\\n    case \\\"Monday\\\":\\n        print(\\\"Start of week\\\")\\n    case \\\"Friday\\\":\\n        print(\\\"Almost weekend!\\\")\\n    case \\\"Saturday\\\" | \\\"Sunday\\\":\\n        print(\\\"Weekend!\\\")\\n    case _:\\n        print(\\\"Regular day\\\")", "solution": "day = \\\"Monday\\\"\\nmatch day:\\n    case \\\"Monday\\\":\\n        print(\\\"Start of week\\\")\\n    case \\\"Friday\\\":\\n        print(\\\"Almost weekend!\\\")\\n    case \\\"Saturday\\\" | \\\"Sunday\\\":\\n        print(\\\"Weekend!\\\")\\n    case _:\\n        print(\\\"Regular day\\\")", "hints": ["case _ is like default", "| combines multiple cases"]}]',
'code', 15),

('30000000-0000-0000-0000-000000000008', 'Conditional Best Practices', 'Writing clean conditional code', 'intermediate', 16, 8, '00000000-0000-0000-0000-000000000003',
'[{"type": "text", "content": "Best practices: Keep conditions simple, use descriptive names, avoid deep nesting, use early returns, consider guard clauses."}, {"type": "multiple-choice", "question": "What is a guard clause?", "options": ["Special type of loop", "Early return that checks for errors", "Security feature"], "correctAnswer": "Early return that checks for errors", "explanation": "Guard clauses check for error conditions early, making main logic cleaner."}]',
'multiple-choice', 10);

SELECT 'SUCCESS: First 24 lessons added!' as message,
       COUNT(*) as total_lessons
FROM lessons;