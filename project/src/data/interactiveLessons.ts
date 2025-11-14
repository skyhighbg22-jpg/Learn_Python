// Interactive coding lessons data structure
// Each lesson includes starter code, hints, expected output, and validation

export interface InteractiveLesson {
  id: string;
  title: string;
  description: string;
  task: string;
  starterCode: string;
  expectedOutput: string;
  hints: Array<{
    id: number;
    text: string;
    revealedText?: string;
  }>;
  solution: string;
  xpReward: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
}

// Interactive coding lessons
export const interactiveLessons: InteractiveLesson[] = [
  // Lesson 1: Hello World with print()
  {
    id: 'interactive-001',
    title: 'Hello World with Print Function',
    description: 'Learn how to use the print() function to display text output in Python',
    task: 'Use the print() function to display "Hello, World!" on the screen',
    starterCode: `# Your Task
print("Hello, World!")`,
    expectedOutput: 'Hello, World!',
    hints: [
      {
        id: 1,
        text: 'The print() function displays text on the screen',
      },
      {
        id: 2,
        text: 'Text must be wrapped in quotes: "like this" or \'like this\'',
      },
      {
        id: 3,
        text: 'print() function syntax: print(argument1, argument2, ...)',
        revealedText: 'Function signature: print(*args)'
      },
    ],
    solution: `print("Hello, World!")`,
    xpReward: 15,
    difficulty: 'beginner',
    sectionId: '00000000-0000-0000-000000000001', // Python Basics section
  },

  // Lesson 2: Variables and User Input
  {
    id: 'interactive-002',
    title: 'Variables and User Input',
    description: 'Learn how to create variables and get user input using the input() function',
    task: 'Create a program that asks for the user\'s name and age, then displays a personalized greeting',
    starterCode: `# Your Task
name = input("What's your name? ")
age = int(input("What's your age? "))

# Display a personalized greeting
print(f"Hello, {name}! You are {age} years old.")`,
    expectedOutput: 'Hello, Alice! You are 25 years old.',
    hints: [
      {
        id: 1,
        text: 'Use input() function to get user input',
      },
      {
        id: 2,
        text: 'Convert age to integer using int() function',
      },
      {
        id: 3,
        text: 'Use f-strings with variables',
        revealedText: 'f-string syntax: f"Hello, {name}!"'
      },
    ],
    solution: `name = input("What's your name? ")
age = int(input("What's your age? "))
print(f"Hello, {name}! You are {age} years old.")`,
    xpReward: 18,
    difficulty: 'beginner',
    sectionId: '00000000-0000-0000-000000000001',
  },

  // Lesson 3: Basic Math Operations
  {
    id: 'interactive-003',
    title: 'Basic Math Operations',
    description: 'Learn how to perform basic arithmetic operations and display results',
    task: 'Create a calculator that performs addition, subtraction, multiplication, and division',
    starterCode: `# Your Task
num1 = 5
num2 = 3

# Perform calculations and display results
result_add = num1 + num2
result_sub = num1 - num2
result_mul = num1 * num2
result_div = num1 / num2

print(f"Addition: {num1} + {num2} = {result_add}")
print(f"Subtraction: {num1} - {num2} = {result_sub}")
print(f"Multiplication: {num1} * {num2} = {result_mul}")
print(f"Division: {num1} / {num2} = {result_div}")`,
    expectedOutput: 'Addition: 5 + 3 = 8\nSubtraction: 5 - 3 = 2\nMultiplication: 5 * 3 = 15\nDivision: 5 / 3 = 1',
    hints: [
      {
        id: 1,
        text: 'Python supports basic arithmetic operators: +, -, *, /',
      },
      {
        id: 2,
        text: 'Division may result in floating point numbers',
      },
      {
        id: 3,
        text: 'Use parentheses to control operation order',
      },
    ],
    solution: `num1 = 5
num2 = 3

result_add = num1 + num2
result_sub = num1 - num2
result_mul = num1 * num2
result_div = num1 / num2

print(f"Addition: {num1} + {num2} = {result_add}")
print(f"Subtraction: {num1} - {num2} = {result_sub}")
print(f"Multiplication: {num1} * {num2} = {result_mul}")
print(f"Division: {num1} / {num2} = {result_div}")`,
    xpReward: 20,
    difficulty: 'beginner',
    sectionId: '00000000-0000-0000-000000000001',
  },

  // Lesson 4: Conditional Statements
  {
    id: 'interactive-004',
    title: 'Conditional Statements',
    description: 'Learn how to use if-else statements to make decisions in your code',
    task: 'Create a program that checks if a number is positive, negative, or zero and displays different messages',
    starterCode: `# Your Task
number = int(input("Enter a number: "))

if number > 0:
    print("The number is positive")
elif number < 0:
    print("The number is negative")
else:
    print("The number is zero")`,
    expectedOutput: 'The number is positive',
    hints: [
      {
        id: 1,
        text: 'Use if-elif-else for multiple conditions',
      },
      {
        id: 2,
        text: 'Comparison operators: >, <, ==, !=',
      },
      {
        id: 3,
        text: 'Code structure: if condition: -> action, elif condition: -> action, else: -> action',
      },
    ],
    solution: `number = int(input("Enter a number: "))

if number > 0:
    print("The number is positive")
elif number < 0:
    print("The number is negative")
else:
    print("The number is zero")`,
    xpReward: 22,
    difficulty: 'beginner',
    sectionId: '00000000-0000-0000-000000000001',
  },

  // Lesson 5: Loops
  {
    id: 'interactive-005',
    title: 'Loops and Iteration',
    description: 'Learn how to use for loops to repeat actions multiple times',
    task: 'Create a program that counts from 1 to 5 and displays each number',
    starterCode: `# Your Task

# Use a for loop to count from 1 to 5
for i in range(1, 6):
    print(f"Count: {i}")`,
    expectedOutput: 'Count: 1\nCount: 2\nCount: 3\nCount: 4\nCount: 5',
    hints: [
      {
        id: 1,
        text: 'for loop syntax: for variable in range(start, stop)',
      },
      {
        id: 2,
        text: 'range() function generates numbers from start to stop-1',
      },
      {
        id: 3,
        text: 'Use enumerate() to get both index and value',
        revealedText: 'enumerate(range(1, 6)) -> (0, 1), (1, 2), (2, 3), (3, 4), (3, 5)'
      },
    ],
    solution: `for i in range(1, 6):
    print(f"Count: {i}")`,
    xpReward: 25,
    difficulty: 'beginner',
    sectionId: '00000000-0000-0000-000000000001',
  },

  // Lesson 6: Lists
  {
    id: 'interactive-006',
    title: 'Working with Lists',
    description: 'Learn how to create, access, and manipulate lists in Python',
    task: 'Create a shopping list program that demonstrates list operations',
    starterCode: `# Your Task
shopping_list = ["milk", "bread", "eggs", "butter"]

# Add items to list
shopping_list.append("cheese")
shopping_list.append("milk")

# Display list contents
print("Shopping list:")
for item in shopping_list:
    print(f"- {item}")

# Get list length
print(f"Total items: {len(shopping_list)}")

# Access specific items
print(f"First item: {shopping_list[0]}")
print(f"Last item: {shopping_list[-1]}")`,
    expectedOutput: 'Shopping list:\n- milk\n- bread\n- eggs\n- butter\n- cheese\n- milk\nTotal items: 5\nFirst item: milk\nLast item: milk',
    hints: [
      {
        id: 1,
        text: 'List methods: append(), len(), accessing by index',
      },
      {
        id: 2,
        text: 'List methods: remove(), pop(), clear()',
        revealedText: 'List indexing: shopping_list[0] = "milk"'
      },
      {
        id: 3,
        text: 'Lists can contain any data type: strings, numbers, other lists',
      },
    ],
    solution: `shopping_list = ["milk", "bread", "eggs", "butter"]

# Add items to list
shopping_list.append("cheese")
shopping_list.append("milk")

# Display list contents
print("Shopping list:")
for item in shopping_list:
    print(f"- {item}")

# Get list length
print(f"Total items: {len(shopping_list)}")

# Access specific items
print(f"First item: {shopping_list[0]}")
print(f"Last item: {shopping_list[-1]}")`,
    xpReward: 28,
    difficulty: 'beginner',
    sectionId: '00000000-0000-0000-000000000001',
  },
];

export default interactiveLessons;