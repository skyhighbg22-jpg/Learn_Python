# 🚀 Setup Instructions for Learn Python App

## ✅ What's Already Done:
- Database populated with 32 lessons (4 sections × 8 lessons each)
- Code updated to handle all lesson types
- Development server running at http://localhost:5173/

## 🔑 What You Need to Do:

### 1. Configure Supabase Connection

**Steps:**
1. Go to your Supabase project dashboard
2. Navigate to **Settings > API**
3. Find your **Project URL** and **anon public key**
4. Edit the `.env` file and replace the placeholders:

```bash
# Replace these with your actual Supabase credentials:
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Restart the Development Server

After updating the `.env` file, restart the server:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 📚 What You'll See After Setup:

### **4 Sections with 8 Lessons Each:**

1. **Python Basics** (0 XP required)
   - Welcome to Python
   - Hello World Program
   - Python Syntax Basics
   - Running Python Programs
   - Python Interpreters
   - Python Installation
   - Your First Variables
   - Basic Output

2. **Variables & Data Types** (30 XP required)
   - Creating Variables
   - Python Data Types
   - Type Conversion
   - Working with Strings
   - Numbers and Math
   - Boolean Logic
   - User Input
   - Type Checking

3. **Control Flow** (80 XP required)
   - If Statements
   - Comparison Operators
   - Else and Elif
   - Nested If Statements
   - Logical Operators
   - Ternary Operator
   - Match Statements
   - Conditional Best Practices

4. **Functions & Modules** (150 XP required)
   - Creating Functions
   - Function Parameters
   - Return Values
   - Importing Modules
   - Lists Introduction
   - List Methods
   - List Slicing
   - For Loops

## 🎮 Interactive Features:

- **Lesson Cards**: Beautiful cards showing lesson info, XP, difficulty
- **Unlock System**: Lessons unlock based on your total XP
- **Two Lesson Types**:
  - Multiple choice questions with instant feedback
  - Coding exercises with starter code and solutions
- **Progress Tracking**: Your progress is saved automatically
- **XP & Levels**: Earn XP for completing lessons and level up

## 🔧 Troubleshooting:

**If lessons don't appear:**
1. Check that your `.env` file has correct Supabase credentials
2. Verify the lessons were successfully loaded to your database
3. Check browser console for any error messages

**If you get connection errors:**
1. Verify Supabase URL is correct (should end with .supabase.co)
2. Check that your anon key is valid and not expired
3. Make sure your Supabase project is active

The app is ready to go once you add your Supabase credentials!