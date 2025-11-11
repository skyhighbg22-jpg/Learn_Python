// CORRECTED Lesson Adder Script - Works with Your Database Schema
// This script uses UUIDs and matches your exact database structure

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from .env file
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Supabase credentials not found!');
  console.error('Make sure .env file exists with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 Starting to add new lessons to your database...\n');
console.log('📋 Using your exact database schema with UUIDs\n');

// Helper function to generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function addLessons() {
  try {
    // Step 1: Add new sections with UUIDs
    console.log('📁 Step 1: Adding new sections...');

    const sections = [
      {
        id: generateUUID(),
        title: 'Python Basics - Drag & Drop',
        description: 'Learn fundamentals through hands-on drag-and-drop exercises',
        path: 'python-basics',
        order_index: 1,
        unlock_requirement_xp: 0
      },
      {
        id: generateUUID(),
        title: 'Python Puzzles',
        description: 'Test your knowledge with interactive puzzle games',
        path: 'python-basics',
        order_index: 2,
        unlock_requirement_xp: 25
      },
      {
        id: generateUUID(),
        title: 'Applied Python',
        description: 'Real-world Python applications and code structure',
        path: 'applied-python',
        order_index: 3,
        unlock_requirement_xp: 100
      },
      {
        id: generateUUID(),
        title: 'Advanced Python Stories',
        description: 'Professional scenarios and complex challenges',
        path: 'advanced-python',
        order_index: 4,
        unlock_requirement_xp: 300
      }
    ];

    for (const section of sections) {
      const { data, error } = await supabase
        .from('sections')
        .insert([section]);

      if (error) {
        console.error(`❌ Error adding section "${section.title}":`, error.message);
      } else {
        console.log(`✅ Added section: ${section.title}`);
      }
    }

    // Step 2: Get the section IDs we just created
    console.log('\n📚 Step 2: Getting section IDs...');

    const { data: createdSections, error: fetchError } = await supabase
      .from('sections')
      .select('*')
      .in('title', [
        'Python Basics - Drag & Drop',
        'Python Puzzles',
        'Applied Python',
        'Advanced Python Stories'
      ]);

    if (fetchError) {
      console.error('❌ Error fetching sections:', fetchError.message);
      return;
    }

    console.log(`✅ Found ${createdSections.length} sections`);

    // Create a map of titles to IDs
    const sectionIdMap = {};
    createdSections.forEach(section => {
      sectionIdMap[section.title] = section.id;
    });

    // Step 3: Add new lessons
    console.log('\n📚 Step 3: Adding new lessons...');

    const lessons = [
      // Beginner Drag & Drop Lessons
      {
        id: generateUUID(),
        title: 'Your First Function',
        description: 'Create your first Python function with drag-and-drop blocks',
        difficulty: 'beginner',
        xp_reward: 15,
        order_index: 1,
        section_id: sectionIdMap['Python Basics - Drag & Drop'],
        content: [
          {
            question: 'Arrange code blocks to create a complete Python function',
            type: 'drag-drop',
            starterCode: 'def __():',
            solution: 'def greet():\n  return "Hello World"',
            hints: ['Functions start with def keyword', 'Add parentheses and colon']
          }
        ],
        estimated_minutes: 10
      },
      {
        id: generateUUID(),
        title: 'Working with Variables',
        description: 'Learn to create and use Python variables',
        difficulty: 'beginner',
        xp_reward: 18,
        order_index: 2,
        section_id: sectionIdMap['Python Basics - Drag & Drop'],
        content: [
          {
            question: 'Create variables and print them',
            type: 'drag-drop',
            starterCode: 'name = \nage = \nprint("Hello")',
            solution: 'name = "Alex"\nage = 25\nprint(f"{name} is {age}")',
            hints: ['Strings need quotes', 'Use f-strings for variables in print']
          }
        ],
        estimated_minutes: 12
      },
      {
        id: generateUUID(),
        title: 'Python Lists',
        description: 'Learn to work with Python lists and basic operations',
        difficulty: 'beginner',
        xp_reward: 20,
        order_index: 3,
        section_id: sectionIdMap['Python Basics - Drag & Drop'],
        content: [
          {
            question: 'Create and use a list of fruits',
            type: 'drag-drop',
            starterCode: 'fruits = []\nfruits.("apple")\nprint(fruits)',
            solution: 'fruits = ["apple", "banana"]\nfruits.append("orange")\nprint(fruits)',
            hints: ['Lists use square brackets', 'Use append() to add items']
          }
        ],
        estimated_minutes: 15
      },

      // Beginner Puzzle Lessons
      {
        id: generateUUID(),
        title: 'Python Basics Quiz',
        description: 'Test your fundamental Python knowledge',
        difficulty: 'beginner',
        xp_reward: 20,
        order_index: 1,
        section_id: sectionIdMap['Python Puzzles'],
        content: [
          {
            question: 'What keyword defines a function in Python?',
            type: 'multiple-choice',
            options: ['function', 'def', 'create', 'make'],
            correctAnswer: 'def',
            explanation: 'The def keyword is used to define functions in Python'
          },
          {
            question: 'How do you print in Python 3?',
            type: 'multiple-choice',
            options: ['print()', 'echo()', 'console.log()', 'display()'],
            correctAnswer: 'print()',
            explanation: 'print() is used to display output in Python 3'
          }
        ],
        estimated_minutes: 8
      },
      {
        id: generateUUID(),
        title: 'Data Types Challenge',
        description: 'Identify Python data types correctly',
        difficulty: 'beginner',
        xp_reward: 25,
        order_index: 2,
        section_id: sectionIdMap['Python Puzzles'],
        content: [
          {
            question: 'What type is 42 in Python?',
            type: 'multiple-choice',
            options: ['string', 'integer', 'float', 'boolean'],
            correctAnswer: 'integer',
            explanation: '42 is an integer (whole number)'
          },
          {
            question: 'What type is "hello" in Python?',
            type: 'multiple-choice',
            options: ['string', 'integer', 'float', 'boolean'],
            correctAnswer: 'string',
            explanation: 'Text in quotes is a string data type'
          }
        ],
        estimated_minutes: 10
      },
      {
        id: generateUUID(),
        title: 'Python Syntax Quiz',
        description: 'Test your Python syntax knowledge',
        difficulty: 'beginner',
        xp_reward: 22,
        order_index: 3,
        section_id: sectionIdMap['Python Puzzles'],
        content: [
          {
            question: 'How do you start a comment in Python?',
            type: 'multiple-choice',
            options: ['//', '#', '/*', '--'],
            correctAnswer: '#',
            explanation: '# is used for single-line comments in Python'
          },
          {
            question: 'What symbol ends most Python statements?',
            type: 'multiple-choice',
            options: [';', ':', 'newline', '.'],
            correctAnswer: 'newline',
            explanation: 'Python uses newlines to end statements'
          }
        ],
        estimated_minutes: 12
      },

      // Intermediate Drag & Drop Lessons
      {
        id: generateUUID(),
        title: 'Dictionary Operations',
        description: 'Master Python dictionaries and key-value pairs',
        difficulty: 'intermediate',
        xp_reward: 30,
        order_index: 1,
        section_id: sectionIdMap['Applied Python'],
        content: [
          {
            question: 'Create a dictionary with student information',
            type: 'drag-drop',
            starterCode: 'student = {}',
            solution: 'student = {\n  "name": "Sarah",\n  "age": 20,\n  "grade": "A"\n}',
            hints: ['Dictionaries use curly braces', 'Use key: value pairs']
          }
        ],
        estimated_minutes: 15
      },
      {
        id: generateUUID(),
        title: 'List Comprehensions',
        description: 'Learn advanced list processing techniques',
        difficulty: 'intermediate',
        xp_reward: 35,
        order_index: 2,
        section_id: sectionIdMap['Applied Python'],
        content: [
          {
            question: 'Create a list comprehension to square numbers',
            type: 'drag-drop',
            starterCode: 'numbers = [1,2,3,4,5]\nsquares = ',
            solution: 'squares = [x**2 for x in numbers]',
            hints: ['Format: [expression for item in iterable]', 'x**2 means x squared']
          }
        ],
        estimated_minutes: 18
      },
      {
        id: generateUUID(),
        title: 'Error Handling',
        description: 'Learn to handle errors with try-except blocks',
        difficulty: 'intermediate',
        xp_reward: 32,
        order_index: 3,
        section_id: sectionIdMap['Applied Python'],
        content: [
          {
            question: 'Add error handling to handle invalid input',
            type: 'drag-drop',
            starterCode: 'x = int(input("Enter number: "))',
            solution: 'try:\n  x = int(input("Enter number: "))\nexcept ValueError:\n  print("Invalid input!")',
            hints: ['Use try-except blocks', 'Catch ValueError for invalid conversions']
          }
        ],
        estimated_minutes: 16
      },

      // Advanced Story Lessons
      {
        id: generateUUID(),
        title: 'The Startup Challenge',
        description: 'Design scalable systems as a startup CTO facing rapid growth',
        difficulty: 'advanced',
        xp_reward: 50,
        order_index: 1,
        section_id: sectionIdMap['Advanced Python Stories'],
        content: [
          {
            question: 'Write a scalable user registration function',
            type: 'code',
            starterCode: '# Write a registration function\ndef register_user(email, password):\n    # Your code here',
            solution: 'def register_user(email, password):\n    # Validate input\n    if not email or not password:\n        raise ValueError("Email and password required")\n    \n    # Hash password (in real app, use bcrypt)\n    hashed_password = hash_function(password)\n    \n    # Save to database\n    user_id = save_to_database(email, hashed_password)\n    \n    return {"user_id": user_id, "status": "success"}',
            hints: ['Always validate input', 'Hash passwords before storing', 'Return meaningful results']
          }
        ],
        estimated_minutes: 25
      },
      {
        id: generateUUID(),
        title: 'Data Science Competition',
        description: 'Compete in a machine learning challenge with real data',
        difficulty: 'advanced',
        xp_reward: 60,
        order_index: 2,
        section_id: sectionIdMap['Advanced Python Stories'],
        content: [
          {
            question: 'Write a function to calculate statistics for a dataset',
            type: 'code',
            starterCode: '# Calculate dataset statistics\nimport numpy as np\ndef calculate_stats(data):\n    # Your code here',
            solution: 'def calculate_stats(data):\n    """\n    Calculate basic statistics for a list of numbers\n    """\n    if not data:\n        return {"error": "Empty dataset"}\n    \n    return {\n        "mean": np.mean(data),\n        "median": np.median(data),\n        "std": np.std(data),\n        "min": np.min(data),\n        "max": np.max(data),\n        "count": len(data)\n    }',
            hints: ['Use numpy for efficient calculations', 'Handle empty datasets', 'Return meaningful statistics']
          }
        ],
        estimated_minutes: 30
      },
      {
        id: generateUUID(),
        title: 'API Development Task',
        description: 'Build a REST API endpoint for user management',
        difficulty: 'advanced',
        xp_reward: 55,
        order_index: 3,
        section_id: sectionIdMap['Advanced Python Stories'],
        content: [
          {
            question: 'Create a REST API endpoint with proper error handling',
            type: 'code',
            starterCode: '# Create API endpoint\nfrom flask import Flask, jsonify, request\n\napp = Flask(__name__)\n\n@app.route("/api/users", methods=["GET"])\ndef get_users():\n    # Your code here',
            solution: '@app.route("/api/users", methods=["GET"])\ndef get_users():\n    try:\n        # Get query parameters\n        page = request.args.get("page", 1, type=int)\n        limit = min(request.args.get("limit", 10, type=int), 100)\n        \n        # Fetch users from database\n        users = get_users_from_db(page=page, limit=limit)\n        \n        if not users:\n            return jsonify({"error": "No users found"}), 404\n        \n        return jsonify({\n            "users": users,\n            "page": page,\n            "limit": limit,\n            "total": get_total_user_count()\n        })\n        \n    except Exception as e:\n        return jsonify({"error": str(e)}), 500',
            hints: ['Validate query parameters', 'Use try-catch blocks', 'Return proper HTTP status codes']
          }
        ],
        estimated_minutes: 20
      }
    ];

    let successCount = 0;
    for (const lesson of lessons) {
      const { data, error } = await supabase
        .from('lessons')
        .insert([lesson]);

      if (error) {
        console.error(`❌ Error adding lesson "${lesson.title}":`, error.message);
      } else {
        console.log(`✅ Added lesson: ${lesson.title}`);
        successCount++;
      }
    }

    // Step 4: Add new achievements
    console.log('\n🏆 Step 4: Adding new achievements...');

    const achievements = [
      {
        id: generateUUID(),
        name: 'Fresh Start',
        description: 'Complete your first new lesson',
        icon: '🌟',
        category: 'progression',
        requirement: {
          type: 'lesson_completion',
          count: 1,
          new_lessons: true
        },
        xp_reward: 25
      },
      {
        id: generateUUID(),
        name: 'Code Arranger',
        description: 'Complete 3 drag-drop lessons successfully',
        icon: '🎯',
        category: 'skill',
        requirement: {
          type: 'lesson_type_completion',
          lesson_type: 'drag-drop',
          count: 3
        },
        xp_reward: 75
      },
      {
        id: generateUUID(),
        name: 'Quiz Master',
        description: 'Score 100 points in puzzle lessons',
        icon: '🏆',
        category: 'skill',
        requirement: {
          type: 'puzzle_score',
          min_score: 100
        },
        xp_reward: 50
      },
      {
        id: generateUUID(),
        name: 'Narrative Explorer',
        description: 'Complete your first story-based lesson',
        icon: '📖',
        category: 'skill',
        requirement: {
          type: 'lesson_type_completion',
          lesson_type: 'story',
          count: 1
        },
        xp_reward: 40
      },
      {
        id: generateUUID(),
        name: 'Curious Mind',
        description: 'Try all types of lessons',
        icon: '🔍',
        category: 'variety',
        requirement: {
          type: 'variety',
          all_types: ['drag-drop', 'puzzle', 'story', 'multiple-choice', 'code']
        },
        xp_reward: 60
      },
      {
        id: generateUUID(),
        name: 'Python Foundation',
        description: 'Complete all beginner lessons',
        icon: '🎓',
        category: 'path_completion',
        requirement: {
          type: 'path_completion',
          path: 'beginner',
          count: 6
        },
        xp_reward: 100
      },
      {
        id: generateUUID(),
        name: 'Applied Python Expert',
        description: 'Complete all intermediate lessons',
        icon: '⚡',
        category: 'path_completion',
        requirement: {
          type: 'path_completion',
          path: 'intermediate',
          count: 3
        },
        xp_reward: 150
      }
    ];

    let achievementCount = 0;
    for (const achievement of achievements) {
      const { data, error } = await supabase
        .from('achievements')
        .insert([achievement]);

      if (error) {
        console.error(`❌ Error adding achievement "${achievement.name}":`, error.message);
      } else {
        console.log(`✅ Added achievement: ${achievement.name}`);
        achievementCount++;
      }
    }

    // Final success message
    console.log('\n🎉 SUCCESS! All new content has been added to your database!');
    console.log('\n📊 Summary:');
    console.log('   • Added sections: 4 new learning paths');
    console.log(`   • Added lessons: ${successCount} interactive lessons`);
    console.log(`   • Added achievements: ${achievementCount} new badges`);
    console.log('   • All content uses your database UUID schema');

    console.log('\n✨ What was added:');
    console.log('   📁 Sections: Python Basics, Python Puzzles, Applied Python, Advanced Stories');
    console.log('   📚 Lessons: Drag & Drop, Puzzle Games, Code Challenges');
    console.log('   🏆 Achievements: Fresh Start, Code Arranger, Quiz Master, and more');

    console.log('\n🚀 Next steps:');
    console.log('   1. Refresh your website (Ctrl+Shift+R or Cmd+Shift+R)');
    console.log('   2. Go to the Learn section');
    console.log('   3. See your new lessons immediately!');
    console.log('   4. Try a new lesson to unlock achievements!\n');

  } catch (error) {
    console.error('\n❌ An unexpected error occurred:', error.message);
    console.error('\nPlease check:');
    console.error('  • Your .env file has correct Supabase credentials');
    console.error('  • You have network connection');
    console.error('  • Your Supabase project is active');
  }
}

// Run the script
addLessons();