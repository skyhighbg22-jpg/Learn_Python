// Automatic Lesson Adder Script
// This script automatically adds new lessons to your Supabase database

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

async function addLessons() {
  try {
    // Step 1: Add new sections
    console.log('📁 Step 1: Adding new sections...');

    const sections = [
      {
        id: 'sec-basics-dd',
        title: 'Python Basics - Drag & Drop',
        description: 'Learn fundamentals through hands-on exercises',
        path: 'python-basics',
        order_index: 1,
        unlock_requirement_xp: 0
      },
      {
        id: 'sec-basics-puzzle',
        title: 'Python Puzzles',
        description: 'Test your knowledge with interactive games',
        path: 'python-basics',
        order_index: 2,
        unlock_requirement_xp: 25
      },
      {
        id: 'sec-intermediate-dd',
        title: 'Applied Python',
        description: 'Real-world Python applications',
        path: 'applied-python',
        order_index: 3,
        unlock_requirement_xp: 100
      },
      {
        id: 'sec-advanced-story',
        title: 'Advanced Python Stories',
        description: 'Professional scenarios and challenges',
        path: 'advanced-python',
        order_index: 4,
        unlock_requirement_xp: 300
      }
    ];

    const { data: sectionsData, error: sectionsError } = await supabase
      .from('sections')
      .upsert(sections, { onConflict: 'id' });

    if (sectionsError) {
      console.error('❌ Error adding sections:', sectionsError.message);
    } else {
      console.log('✅ Successfully added 4 new sections!');
    }

    // Step 2: Add new lessons
    console.log('\n📚 Step 2: Adding new lessons...');

    const lessons = [
      // Beginner Drag & Drop Lessons
      {
        id: 'les-bd-1',
        title: 'Your First Function',
        description: 'Create your first Python function with drag-and-drop blocks',
        difficulty: 'beginner',
        xp_reward: 15,
        order_index: 1,
        section_id: 'sec-basics-dd',
        lesson_type: 'drag-drop',
        content: [{ question: 'Arrange code blocks to create a function', answer: 'def greet(): return "Hello World"' }],
        estimated_minutes: 10
      },
      {
        id: 'les-bd-2',
        title: 'Working with Variables',
        description: 'Learn to create and use Python variables',
        difficulty: 'beginner',
        xp_reward: 18,
        order_index: 2,
        section_id: 'sec-basics-dd',
        lesson_type: 'drag-drop',
        content: [{ question: 'Create variables', answer: 'name = "Alex"; age = 25' }],
        estimated_minutes: 12
      },
      {
        id: 'les-bd-3',
        title: 'Python Lists',
        description: 'Learn to work with Python lists',
        difficulty: 'beginner',
        xp_reward: 20,
        order_index: 3,
        section_id: 'sec-basics-dd',
        lesson_type: 'drag-drop',
        content: [{ question: 'Create and use a list', answer: 'fruits = ["apple"]; fruits.append("banana")' }],
        estimated_minutes: 15
      },

      // Beginner Puzzle Lessons
      {
        id: 'les-bp-1',
        title: 'Python Basics Quiz',
        description: 'Test your fundamental Python knowledge',
        difficulty: 'beginner',
        xp_reward: 20,
        order_index: 1,
        section_id: 'sec-basics-puzzle',
        lesson_type: 'multiple-choice',
        content: [
          {
            question: 'What keyword defines a function in Python?',
            type: 'multiple-choice',
            options: ['function', 'def', 'create', 'make'],
            correctAnswer: 'def'
          },
          {
            question: 'How do you print in Python 3?',
            type: 'multiple-choice',
            options: ['print()', 'echo()', 'console.log()', 'display()'],
            correctAnswer: 'print()'
          }
        ],
        estimated_minutes: 8
      },
      {
        id: 'les-bp-2',
        title: 'Data Types Challenge',
        description: 'Identify Python data types correctly',
        difficulty: 'beginner',
        xp_reward: 25,
        order_index: 2,
        section_id: 'sec-basics-puzzle',
        lesson_type: 'multiple-choice',
        content: [
          {
            question: 'What type is 42 in Python?',
            type: 'multiple-choice',
            options: ['string', 'integer', 'float', 'boolean'],
            correctAnswer: 'integer'
          }
        ],
        estimated_minutes: 10
      },
      {
        id: 'les-bp-3',
        title: 'Python Syntax Quiz',
        description: 'Test your Python syntax knowledge',
        difficulty: 'beginner',
        xp_reward: 22,
        order_index: 3,
        section_id: 'sec-basics-puzzle',
        lesson_type: 'multiple-choice',
        content: [
          {
            question: 'How do you start a comment in Python?',
            type: 'multiple-choice',
            options: ['//', '#', '/*', '--'],
            correctAnswer: '#'
          }
        ],
        estimated_minutes: 12
      },

      // Intermediate Lessons
      {
        id: 'les-im-1',
        title: 'Dictionary Operations',
        description: 'Master Python dictionaries',
        difficulty: 'intermediate',
        xp_reward: 30,
        order_index: 1,
        section_id: 'sec-intermediate-dd',
        lesson_type: 'drag-drop',
        content: [{ question: 'Create a dictionary', answer: 'student = {"name": "Sarah", "age": 20}' }],
        estimated_minutes: 15
      },
      {
        id: 'les-im-2',
        title: 'List Comprehensions',
        description: 'Learn advanced list processing',
        difficulty: 'intermediate',
        xp_reward: 35,
        order_index: 2,
        section_id: 'sec-intermediate-dd',
        lesson_type: 'drag-drop',
        content: [{ question: 'Square numbers', answer: 'squares = [x**2 for x in numbers]' }],
        estimated_minutes: 18
      },
      {
        id: 'les-im-3',
        title: 'Error Handling',
        description: 'Learn to handle errors with try-except',
        difficulty: 'intermediate',
        xp_reward: 32,
        order_index: 3,
        section_id: 'sec-intermediate-dd',
        lesson_type: 'drag-drop',
        content: [{ question: 'Add error handling', answer: 'try: x = int(input()); except: print("Error")' }],
        estimated_minutes: 16
      },

      // Advanced Lessons
      {
        id: 'les-as-1',
        title: 'The Startup Challenge',
        description: 'Design scalable systems as a startup CTO',
        difficulty: 'advanced',
        xp_reward: 50,
        order_index: 1,
        section_id: 'sec-advanced-story',
        lesson_type: 'code',
        content: [{ question: 'Write a registration function', type: 'code', starterCode: '# Write function' }],
        estimated_minutes: 25
      },
      {
        id: 'les-as-2',
        title: 'Data Science Competition',
        description: 'Compete in a machine learning challenge',
        difficulty: 'advanced',
        xp_reward: 60,
        order_index: 2,
        section_id: 'sec-advanced-story',
        lesson_type: 'code',
        content: [{ question: 'Calculate mean', type: 'code', starterCode: '# Calculate mean' }],
        estimated_minutes: 30
      },
      {
        id: 'les-as-3',
        title: 'API Development Task',
        description: 'Build a REST API endpoint',
        difficulty: 'advanced',
        xp_reward: 55,
        order_index: 3,
        section_id: 'sec-advanced-story',
        lesson_type: 'code',
        content: [{ question: 'Create API endpoint', type: 'code', starterCode: '# Create endpoint' }],
        estimated_minutes: 20
      }
    ];

    const { data: lessonsData, error: lessonsError } = await supabase
      .from('lessons')
      .upsert(lessons, { onConflict: 'id' });

    if (lessonsError) {
      console.error('❌ Error adding lessons:', lessonsError.message);
    } else {
      console.log('✅ Successfully added 12 new lessons!');
    }

    // Step 3: Add new achievements
    console.log('\n🏆 Step 3: Adding new achievements...');

    const achievements = [
      {
        id: 'ach-new',
        name: 'Fresh Start',
        description: 'Complete your first new lesson',
        icon: '🌟',
        category: 'progression',
        requirement: { type: 'complete_lesson', count: 1 },
        xp_reward: 25
      },
      {
        id: 'ach-dd',
        name: 'Code Arranger',
        description: 'Complete 3 drag-drop lessons',
        icon: '🎯',
        category: 'skill',
        requirement: { type: 'drag_drop', count: 3 },
        xp_reward: 75
      },
      {
        id: 'ach-puzzle',
        name: 'Quiz Master',
        description: 'Score well in puzzle lessons',
        icon: '🏆',
        category: 'skill',
        requirement: { type: 'puzzle_score', score: 100 },
        xp_reward: 50
      },
      {
        id: 'ach-story',
        name: 'Narrative Explorer',
        description: 'Complete a story lesson',
        icon: '📖',
        category: 'skill',
        requirement: { type: 'story', count: 1 },
        xp_reward: 40
      },
      {
        id: 'ach-types',
        name: 'Curious Mind',
        description: 'Try all lesson types',
        icon: '🔍',
        category: 'variety',
        requirement: { type: 'variety', all: true },
        xp_reward: 60
      }
    ];

    const { data: achievementsData, error: achievementsError } = await supabase
      .from('achievements')
      .upsert(achievements, { onConflict: 'id' });

    if (achievementsError) {
      console.error('❌ Error adding achievements:', achievementsError.message);
    } else {
      console.log('✅ Successfully added 5 new achievements!');
    }

    // Final success message
    console.log('\n🎉 SUCCESS! All new content has been added to your database!');
    console.log('\n📊 Summary:');
    console.log('   • 4 new sections added');
    console.log('   • 12 new lessons added');
    console.log('   • 5 new achievements added');
    console.log('\n✨ Next step: Refresh your website to see the new lessons!');
    console.log('   (Press Ctrl+Shift+R or Cmd+Shift+R to hard refresh)\n');

  } catch (error) {
    console.error('\n❌ An unexpected error occurred:', error.message);
    console.error('\nPlease check your Supabase credentials and try again.');
  }
}

// Run the script
addLessons();