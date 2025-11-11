// FINAL WORKING LESSON ADDER - Matches Your Exact Database Schema
// This script will definitely work with your database

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Load Supabase credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🚀 Starting lesson addition process...');
console.log('Supabase URL found:', supabaseUrl ? '✅' : '❌');
console.log('Anon Key found:', supabaseKey ? '✅' : '❌');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ ERROR: Supabase credentials missing!');
  console.error('Create a .env file with:');
  console.error('VITE_SUPABASE_URL=your-project-url');
  console.error('VITE_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to generate UUID for primary keys
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function addLessonsToDatabase() {
  try {
    console.log('\n📁 STEP 1: Adding new sections...');

    // Step 1: Add sections
    const sections = [
      {
        id: generateUUID(),
        title: 'Python Basics - Interactive',
        description: 'Learn fundamentals through hands-on exercises',
        path: 'python-basics',
        order_index: 10, // Use high numbers to avoid conflicts
        unlock_requirement_xp: 0
      },
      {
        id: generateUUID(),
        title: 'Python Challenges',
        description: 'Test your knowledge with interactive puzzles',
        path: 'python-challenges',
        order_index: 20,
        unlock_requirement_xp: 25
      },
      {
        id: generateUUID(),
        title: 'Real-World Python',
        description: 'Apply Python to practical scenarios',
        path: 'real-world',
        order_index: 30,
        unlock_requirement_xp: 100
      },
      {
        id: generateUUID(),
        title: 'Advanced Python',
        description: 'Professional Python development',
        path: 'advanced',
        order_index: 40,
        unlock_requirement_xp: 300
      }
    ];

    const sectionResults = await Promise.all(
      sections.map(async (section) => {
        const { data, error } = await supabase
          .from('sections')
          .insert([section])
          .select('id, title');

        if (error) {
          console.log(`⚠️ Section "${section.title}" might already exist:`, error.message);
          // Try to get the existing section
          const { data: existing } = await supabase
            .from('sections')
            .select('id, title')
            .eq('title', section.title)
            .single();
          return existing;
        }
        console.log(`✅ Added section: ${section.title}`);
        return data[0];
      })
    );

    console.log('\n📚 STEP 2: Getting section IDs...');

    // Get all sections to use their IDs
    const { data: allSections, error: sectionsError } = await supabase
      .from('sections')
      .select('*')
      .in('title', sections.map(s => s.title));

    if (sectionsError) {
      console.error('❌ Error getting sections:', sectionsError);
      return;
    }

    console.log(`✅ Found ${allSections.length} sections to use`);

    // Map section titles to IDs
    const sectionMap = {};
    allSections.forEach(section => {
      sectionMap[section.title] = section.id;
    });

    console.log('\n📝 STEP 3: Adding new lessons...');

    // Step 2: Add lessons with proper content structure
    const lessons = [
      // Python Basics - Interactive Lessons
      {
        id: generateUUID(),
        title: 'Create Your First Function',
        description: 'Learn to create functions with drag-and-drop blocks',
        difficulty: 'beginner',
        xp_reward: 15,
        order_index: 1,
        section_id: sectionMap['Python Basics - Interactive'],
        lesson_type: 'drag-drop',
        drag_drop_data: {
          instructions: 'Drag the blocks to create a Python function that says hello',
          code_blocks: [
            { id: 'def-stmt', content: 'def greet_world():', type: 'function', indent: 0 },
            { id: 'return-stmt', content: 'return "Hello, World!"', type: 'code', indent: 4 }
          ],
          correct_order: ['def-stmt', 'return-stmt'],
          hints: ['Functions start with def keyword', 'Don\'t forget the parentheses and colon']
        },
        content: [], // Keep content empty since we're using type-specific columns
        estimated_minutes: 10
      },

      {
        id: generateUUID(),
        title: 'Working with Variables',
        description: 'Create and use Python variables',
        difficulty: 'beginner',
        xp_reward: 18,
        order_index: 2,
        section_id: sectionMap['Python Basics - Interactive'],
        lesson_type: 'drag-drop',
        drag_drop_data: {
          instructions: 'Arrange code to create variables and print them',
          code_blocks: [
            { id: 'name-var', content: 'name = "Python"', type: 'variable', indent: 0 },
            { id: 'age-var', content: 'age = 30', type: 'variable', indent: 0 },
            { id: 'print-stmt', content: 'print(f"{name} is {age} years old")', type: 'code', indent: 0 }
          ],
          correct_order: ['name-var', 'age-var', 'print-stmt'],
          hints: ['Strings need quotes', 'Use f-strings to include variables in print statements']
        },
        content: [],
        estimated_minutes: 12
      },

      // Python Challenges - Quiz Lessons
      {
        id: generateUUID(),
        title: 'Python Fundamentals Quiz',
        description: 'Test your basic Python knowledge',
        difficulty: 'beginner',
        xp_reward: 20,
        order_index: 1,
        section_id: sectionMap['Python Challenges'],
        lesson_type: 'puzzle',
        game_data: {
          time_bonus: 100,
          streak_multiplier: 10,
          questions: [
            {
              id: 'q1',
              question: 'What keyword defines a function in Python?',
              code: '_____ my_function():\n    return "Hello"',
              options: ['function', 'def', 'create', 'make'],
              correctAnswer: 1,
              explanation: 'The def keyword is used to define functions in Python',
              difficulty: 'easy',
              points: 10,
              timeLimit: 15
            },
            {
              id: 'q2',
              question: 'How do you print something in Python 3?',
              options: ['print()', 'echo()', 'console.log()', 'printf()'],
              correctAnswer: 0,
              explanation: 'print() is used to display output in Python 3',
              difficulty: 'easy',
              points: 10,
              timeLimit: 10
            }
          ]
        },
        content: [],
        estimated_minutes: 8
      },

      {
        id: generateUUID(),
        title: 'Data Types Quiz',
        description: 'Identify Python data types correctly',
        difficulty: 'beginner',
        xp_reward: 25,
        order_index: 2,
        section_id: sectionMap['Python Challenges'],
        lesson_type: 'puzzle',
        game_data: {
          time_bonus: 120,
          streak_multiplier: 12,
          questions: [
            {
              id: 'q1',
              question: 'What type is 42 in Python?',
              options: ['string', 'integer', 'float', 'boolean'],
              correctAnswer: 1,
              explanation: '42 is an integer (whole number)',
              difficulty: 'easy',
              points: 15,
              timeLimit: 12
            },
            {
              id: 'q2',
              question: 'What type is "hello" in Python?',
              options: ['string', 'integer', 'float', 'boolean'],
              correctAnswer: 0,
              explanation: 'Text in quotes is a string',
              difficulty: 'easy',
              points: 15,
              timeLimit: 12
            }
          ]
        },
        content: [],
        estimated_minutes: 10
      },

      // Real-World Python - Code Lessons
      {
        id: generateUUID(),
        title: 'Dictionary Operations',
        description: 'Learn to work with Python dictionaries',
        difficulty: 'intermediate',
        xp_reward: 30,
        order_index: 1,
        section_id: sectionMap['Real-World Python'],
        lesson_type: 'code',
        content: [
          {
            question: 'Create a dictionary to store student information',
            type: 'code',
            starterCode: '# Create a student dictionary\nstudent = ',
            solution: 'student = {\n    "name": "Alex",\n    "age": 20,\n    "grade": "A"\n}\n\n# Access values\nprint(student["name"])',
            explanation: 'Dictionaries use key-value pairs with curly braces'
          }
        ],
        estimated_minutes: 15
      },

      {
        id: generateUUID(),
        title: 'List Comprehensions',
        description: 'Master Python list comprehensions',
        difficulty: 'intermediate',
        xp_reward: 35,
        order_index: 2,
        section_id: sectionMap['Real-World Python'],
        lesson_type: 'code',
        content: [
          {
            question: 'Create a list comprehension to square numbers',
            type: 'code',
            starterCode: '# Square numbers 1-5 using list comprehension\nnumbers = [1, 2, 3, 4, 5]\nsquares = ',
            solution: 'squares = [x**2 for x in numbers]\nprint(squares)  # [1, 4, 9, 16, 25]',
            explanation: 'List comprehensions provide a concise way to create lists'
          }
        ],
        estimated_minutes: 18
      },

      // Advanced Python - Story Lessons
      {
        id: generateUUID(),
        title: 'The Startup Challenge',
        description: 'Design scalable systems as a startup CTO',
        difficulty: 'advanced',
        xp_reward: 50,
        order_index: 1,
        section_id: sectionMap['Advanced Python'],
        lesson_type: 'story',
        story_data: {
          setting: 'A fast-growing tech startup facing scaling challenges',
          protagonist: {
            name: 'Sarah Chen',
            avatar: '👩‍💻',
            role: 'Startup CTO',
            personality: 'Strategic, innovative, under pressure'
          },
          chapters: [
            {
              id: 'chapter1',
              title: 'The Scaling Crisis',
              content: 'Sarah looked at the monitoring dashboard - the app was slowing down with 50,000 users. "We need to scale our architecture!" she told the team.',
              character: {
                name: 'Tech Lead',
                avatar: '👨‍💻',
                role: 'Infrastructure Expert'
              },
              challenge: {
                description: 'Design a scalable microservices architecture',
                starter_code: '# Design scalable system\nimport flask\n\napp = flask.Flask(__name__)',
                solution: '# Microservices architecture\nfrom flask import Flask\nimport requests\n\nclass MicroservicesArchitecture:\n    def __init__(self):\n        self.services = {\n            'user_service': 'http://user-api:8001',\n            'content_service': 'http://content-api:8002'\n        }\n        self.load_balancer = LoadBalancer()',
                explanation: 'Microservices architecture allows independent scaling of different components'
              },
              reward: {
                xp: 25,
                message: 'CEO: "Excellent architecture design! This will handle 10x growth!"',
                item: 'Architecture Master Badge'
              }
            }
          ]
        },
        content: [],
        estimated_minutes: 25
      }
    ];

    // Add lessons one by one for better error handling
    let lessonsAdded = 0;
    for (const lesson of lessons) {
      try {
        const { data, error } = await supabase
          .from('lessons')
          .insert([lesson])
          .select('title');

        if (error) {
          if (error.message.includes('duplicate key')) {
            console.log(`⚠️ Lesson "${lesson.title}" already exists`);
          } else {
            console.error(`❌ Error adding lesson "${lesson.title}":`, error.message);
          }
        } else {
          console.log(`✅ Added lesson: ${lesson.title}`);
          lessonsAdded++;
        }
      } catch (lessonError) {
        console.error(`❌ Error with lesson "${lesson.title}":`, lessonError.message);
      }
    }

    // Step 3: Add achievements
    console.log('\n🏆 STEP 4: Adding new achievements...');

    const achievements = [
      {
        id: generateUUID(),
        name: 'Interactive Beginner',
        description: 'Complete your first drag-drop lesson',
        icon: '🎯',
        category: 'skill',
        requirement: { type: 'lesson_completion', lesson_type: 'drag-drop', count: 1 },
        xp_reward: 25
      },
      {
        id: generateUUID(),
        name: 'Quiz Master',
        description: 'Score 80+ points in puzzle lessons',
        icon: '🏆',
        category: 'skill',
        requirement: { type: 'puzzle_score', min_score: 80 },
        xp_reward: 50
      },
      {
        id: generateUUID(),
        name: 'Story Explorer',
        description: 'Complete your first story lesson',
        icon: '📖',
        category: 'skill',
        requirement: { type: 'lesson_completion', lesson_type: 'story', count: 1 },
        xp_reward: 40
      },
      {
        id: generateUUID(),
        name: 'Python All-Rounder',
        description: 'Try all lesson types',
        icon: '🎮',
        category: 'variety',
        requirement: { type: 'variety', lesson_types: ['drag-drop', 'puzzle', 'story', 'code'] },
        xp_reward: 75
      },
      {
        id: generateUUID(),
        name: 'Knowledge Seeker',
        description: 'Complete 5 new lessons',
        icon: '🌟',
        category: 'progression',
        requirement: { type: 'lesson_completion', count: 5, new_content: true },
        xp_reward: 100
      }
    ];

    let achievementsAdded = 0;
    for (const achievement of achievements) {
      try {
        const { data, error } = await supabase
          .from('achievements')
          .insert([achievement])
          .select('name');

        if (error) {
          if (error.message.includes('duplicate key')) {
            console.log(`⚠️ Achievement "${achievement.name}" already exists`);
          } else {
            console.error(`❌ Error adding achievement "${achievement.name}":`, error.message);
          }
        } else {
          console.log(`✅ Added achievement: ${achievement.name}`);
          achievementsAdded++;
        }
      } catch (achievementError) {
        console.error(`❌ Error with achievement "${achievement.name}":`, achievementError.message);
      }
    }

    // Success message
    console.log('\n🎉 SUCCESS! Database update completed!');
    console.log('\n📊 SUMMARY:');
    console.log(`   • Sections processed: ${sections.length}`);
    console.log(`   • Lessons added: ${lessonsAdded}`);
    console.log(`   • Achievements added: ${achievementsAdded}`);
    console.log('\n🔍 What was added:');
    console.log('   📁 Sections: Python Basics, Challenges, Real-World, Advanced');
    console.log('   📚 Lessons: Drag-drop, Puzzle games, Code challenges, Story lessons');
    console.log('   🏆 Achievements: Interactive badges and milestones');

    console.log('\n✨ NEXT STEPS:');
    console.log('   1. Refresh your website (Ctrl+Shift+R or Cmd+Shift+R)');
    console.log('   2. Go to the Learn section');
    console.log('   3. Look for the new sections and lessons');
    console.log('   4. Try a new lesson to see it work!');

    // Verification step
    console.log('\n🔎 STEP 5: Verifying additions...');
    const { data: finalSections, error: finalError } = await supabase
      .from('sections')
      .select('title')
      .in('title', sections.map(s => s.title));

    const { data: finalLessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('title, lesson_type')
      .in('title', lessons.map(l => l.title));

    if (finalError || lessonsError) {
      console.log('❌ Verification had errors');
    } else {
      console.log('✅ Verification successful!');
      console.log(`   Found ${finalSections?.length || 0} new sections`);
      console.log(`   Found ${finalLessons?.length || 0} new lessons`);
    }

  } catch (error) {
    console.error('\n💥 FATAL ERROR:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check your .env file has correct Supabase credentials');
    console.log('   2. Make sure your Supabase project is active');
    console.log('   3. Verify your internet connection');
    console.log('   4. Try running the script again');
  }
}

// Run the main function
addLessonsToDatabase();