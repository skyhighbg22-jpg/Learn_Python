-- NO JSON VERSION: Add New Lessons for Supabase
-- This version uses only basic SQL - no JSON at all

-- Add new sections
INSERT INTO sections (id, title, description, path, order_index, unlock_requirement_xp) VALUES
('sec-basics-dd', 'Python Basics - Drag & Drop', 'Learn fundamentals through hands-on exercises', 'python-basics', 1, 0),
('sec-basics-puzzle', 'Python Puzzles', 'Test your knowledge with interactive games', 'python-basics', 2, 25),
('sec-intermediate-dd', 'Applied Python', 'Real-world Python applications', 'applied-python', 3, 100),
('sec-advanced-story', 'Advanced Python Stories', 'Professional scenarios and challenges', 'advanced-python', 4, 300)
ON CONFLICT (id) DO NOTHING;

-- Add new lessons - Using plain text content, no JSON
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, content, estimated_minutes) VALUES

-- Beginner Drag & Drop Lessons
('les-bd-1', 'Your First Function', 'Create your first Python function with drag-and-drop blocks', 'beginner', 15, 1, 'sec-basics-dd', 'drag-drop', 'Question: Arrange code blocks to create a function
Answer: def greet(): return "Hello World"
Hint: Functions start with def keyword', 10),

('les-bd-2', 'Working with Variables', 'Learn to create and use Python variables', 'beginner', 18, 2, 'sec-basics-dd', 'drag-drop', 'Question: Arrange code to create and use variables
Answer: name = "Alex"; age = 25; print(f"{name} is {age}")
Hint: Variables store values, use f-strings for formatting', 12),

('les-bd-3', 'Python Lists', 'Learn to work with Python lists', 'beginner', 20, 3, 'sec-basics-dd', 'drag-drop', 'Question: Create and use a list
Answer: fruits = ["apple", "banana"]; fruits.append("orange"); print(fruits)
Hint: Lists use square brackets, append() adds items', 15),

-- Beginner Puzzle Lessons (Multiple Choice)
('les-bp-1', 'Python Basics Quiz', 'Test your fundamental Python knowledge', 'beginner', 20, 1, 'sec-basics-puzzle', 'multiple-choice', 'Question: What keyword defines a function in Python?
Options: function, def, create, make
Correct: def
Explanation: The def keyword is used to define functions in Python

Question: How do you print in Python 3?
Options: print(), echo(), console.log(), display()
Correct: print()
Explanation: print() is used to display output in Python 3', 8),

('les-bp-2', 'Data Types Challenge', 'Identify Python data types correctly', 'beginner', 25, 2, 'sec-basics-puzzle', 'multiple-choice', 'Question: What type is 42 in Python?
Options: string, integer, float, boolean
Correct: integer
Explanation: 42 is an integer (whole number)

Question: What type is "hello"?
Options: string, integer, float, boolean
Correct: string
Explanation: Text in quotes is a string data type', 10),

('les-bp-3', 'Python Syntax Quiz', 'Test your Python syntax knowledge', 'beginner', 22, 3, 'sec-basics-puzzle', 'multiple-choice', 'Question: How do you start a comment in Python?
Options: //, #, /*, --
Correct: #
Explanation: # is used for single-line comments in Python

Question: What symbol ends most Python statements?
Options: ;, :, newline, .
Correct: newline
Explanation: Python uses newlines to end statements', 12),

-- Intermediate Drag & Drop Lessons
('les-im-1', 'Dictionary Operations', 'Master Python dictionaries', 'intermediate', 30, 1, 'sec-intermediate-dd', 'drag-drop', 'Question: Create a dictionary with student info
Answer: student = {"name": "Sarah", "age": 20}
Hint: Dictionaries use curly braces and key-value pairs', 15),

('les-im-2', 'List Comprehensions', 'Learn advanced list processing', 'intermediate', 35, 2, 'sec-intermediate-dd', 'drag-drop', 'Question: Create a list comprehension to square numbers
Answer: numbers = [1,2,3,4,5]; squares = [x**2 for x in numbers]
Hint: List comprehensions: [expression for item in iterable]', 18),

('les-im-3', 'Error Handling', 'Learn to handle errors with try-except', 'intermediate', 32, 3, 'sec-intermediate-dd', 'drag-drop', 'Question: Add error handling to this code
Answer: try: x = int(input()); except ValueError: print("Error")
Hint: Use try-except blocks to handle potential errors', 16),

-- Advanced Story Lessons (Code type)
('les-as-1', 'The Startup Challenge', 'Design scalable systems as a startup CTO', 'advanced', 50, 1, 'sec-advanced-story', 'code', 'Question: Write a function to handle user registration
Starter: # Write registration function
Solution: def register_user(email, password):
    # Validate input
    # Hash password
    # Save to database
    return user_id', 25),

('les-as-2', 'Data Science Competition', 'Compete in a machine learning challenge', 'advanced', 60, 2, 'sec-advanced-story', 'code', 'Question: Write a function to calculate mean of a list
Starter: # Calculate mean function
Solution: def calculate_mean(numbers):
    return sum(numbers) / len(numbers)', 30),

('les-as-3', 'API Development Task', 'Build a REST API endpoint', 'advanced', 55, 3, 'sec-advanced-story', 'code', 'Question: Create a simple API endpoint
Starter: # Create API endpoint
Solution: @app.route("/api/users")
def get_users():
    users = get_all_users()
    return jsonify(users)', 20)

ON CONFLICT (id) DO NOTHING;

-- Add new achievements (using simple text for requirements)
INSERT INTO achievements (id, name, description, icon, category, requirement, xp_reward) VALUES
('ach-new', 'Fresh Start', 'Complete your first new lesson', '🌟', 'progression', 'complete_new_lesson', 25),
('ach-dd', 'Code Arranger', 'Complete 3 drag-drop lessons', '🎯', 'skill', 'complete_drag_drop_3', 75),
('ach-puzzle', 'Quiz Master', 'Score well in puzzle lessons', '🏆', 'skill', 'puzzle_high_score', 50),
('ach-story', 'Narrative Explorer', 'Complete a story lesson', '📖', 'skill', 'complete_story_lesson', 40),
('ach-types', 'Curious Mind', 'Try all lesson types', '🔍', 'variety', 'try_all_lesson_types', 60),
('ach-beginner', 'Python Foundation', 'Complete all beginner lessons', '🎓', 'path_completion', 'complete_beginner_path', 100),
('ach-intermediate', 'Python Practitioner', 'Complete intermediate lessons', '⚡', 'path_completion', 'complete_intermediate_path', 150)
ON CONFLICT (id) DO NOTHING;

-- Simple verification queries
SELECT 'SUCCESS: New sections added' as result, COUNT(*) as count
FROM sections
WHERE id IN ('sec-basics-dd', 'sec-basics-puzzle', 'sec-intermediate-dd', 'sec-advanced-story');

SELECT 'SUCCESS: New lessons added' as result, COUNT(*) as count
FROM lessons
WHERE id IN ('les-bd-1', 'les-bd-2', 'les-bd-3', 'les-bp-1', 'les-bp-2', 'les-bp-3', 'les-im-1', 'les-im-2', 'les-im-3', 'les-as-1', 'les-as-2', 'les-as-3');

SELECT 'SUCCESS: New achievements added' as result, COUNT(*) as count
FROM achievements
WHERE id IN ('ach-new', 'ach-dd', 'ach-puzzle', 'ach-story', 'ach-types', 'ach-beginner', 'ach-intermediate');

-- Show the new sections that were created
SELECT 'NEW SECTIONS CREATED:' as info, id, title, unlock_requirement_xp as xp_needed
FROM sections
WHERE id IN ('sec-basics-dd', 'sec-basics-puzzle', 'sec-intermediate-dd', 'sec-advanced-story')
ORDER BY order_index;