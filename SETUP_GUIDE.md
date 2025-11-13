# 🐍 Learn Python Application Setup Guide

## Quick Setup Steps to See New Lessons

Follow these steps to get the comprehensive lesson content appearing on your frontend:

### Step 1: Environment Configuration ⚙️

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit your `.env` file** and add your Supabase credentials:
   ```env
   # Replace these with your actual Supabase project credentials
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

### Step 2: Database Setup 🗄️

**IMPORTANT: Use the simple script to ensure lessons appear!**

1. **Go to your Supabase Dashboard** → SQL Editor
2. **Run the immediate lesson insertion script:**
   - Copy the entire contents of `ADD_LESSONS_NOW.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute all queries

3. **Verify lessons were added:**
   - Run the diagnostic script: `CHECK_DATA.sql`
   - You should see lesson counts and lesson data

❗ **If lessons still don't appear, run `ADD_LESSONS_NOW.sql` again - it clears old data and inserts fresh lessons.**

### Step 3: Edge Functions Setup (Optional) ⚡

If you want the streak system to work:

1. **Set up environment variables** in Supabase Edge Functions:
   ```bash
   STREAK_MAINTENANCE_SERVICE_KEY=your_secure_service_key
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Deploy the edge functions:**
   ```bash
   cd supabase/functions
   supabase functions deploy streak-maintenance
   ```

### Step 4: Start the Application 🚀

```bash
# Install dependencies (if not done already)
npm install

# Start the development server
npm run dev
```

## What You'll See After Setup

### 📚 Comprehensive Lesson Library

**10 Sections with Rich Content:**

1. **Python Basics** (4 lessons)
   - Welcome to Python
   - Your First Python Program
   - Python Syntax Basics
   - Running Python Programs

2. **Variables & Data Types** (3 lessons)
   - Creating Variables
   - Python Data Types
   - Type Conversion

3. **Control Flow** (3 lessons)
   - If Statements
   - Comparison Operators
   - Else and Elif

4. **Functions & Modules** (Coming Soon)
5. **Lists & Data Structures** (Coming Soon)
6. **Loops & Iteration** (Coming Soon)
7. **String Operations** (Coming Soon)
8. **File Operations** (Coming Soon)
9. **Error Handling** (Coming Soon)
10. **Object-Oriented Programming** (Coming Soon)

### 🎯 Interactive Lesson Types

- **Traditional Lessons**: Text explanations with quizzes
- **Code Lessons**: Interactive coding exercises with hints and solutions
- **Multiple Choice**: Knowledge testing with explanations
- **Puzzle Games**: Coming soon!

### 🏆 Daily Challenges

- **5 Daily Challenges** pre-loaded
- Mix of quiz and coding challenges
- Different difficulty levels (Easy, Medium)
- XP rewards for completion

### ✨ Key Features Now Working

1. **✅ Lessons Display**: All lessons load from database with rich content
2. **✅ Interactive Content**: Code exercises, quizzes, and explanations
3. **✅ Progress Tracking**: XP, levels, and completion status
4. **✅ Challenges View**: Daily challenges with history and leaderboards
5. **✅ Progress Dashboard**: Real data analytics and charts
6. **✅ Error Handling**: User-friendly error messages with retry options

## Troubleshooting 🔧

### Lessons Not Showing Up?

**Check these in order:**

1. **Environment Variables:**
   ```bash
   # Verify your .env file has correct Supabase credentials
   cat .env
   ```

2. **Database Tables:**
   ```sql
   -- Check if lessons exist
   SELECT COUNT(*) FROM lessons;

   -- Check sections exist
   SELECT COUNT(*) FROM sections;
   ```

3. **Network Connection:**
   - Can you access your Supabase dashboard?
   - Is the internet connection working?
   - Check browser console for errors

4. **Restart Development Server:**
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

### White Screen or Errors?

1. **Check Browser Console:**
   - Press F12 → Console tab
   - Look for red error messages

2. **Verify Dependencies:**
   ```bash
   npm install
   # Check for any missing packages
   ```

3. **Clear Browser Cache:**
   - Hard refresh (Ctrl+Shift+R)
   - Clear browser data if needed

## Expected Learning Path 🎓

After setup, users can follow this progression:

1. **Start Here**: Python Basics section (0 XP required)
2. **Next Level**: Variables & Data Types (30 XP required)
3. **Level Up**: Control Flow (80 XP required)
4. **Advanced Topics**: Functions, Lists, Loops (250+ XP required)

Each section unlocks progressively, providing a structured learning experience!

## Need Help? 🆘

If you encounter issues:

1. Check the browser console for error messages
2. Verify all setup steps were completed correctly
3. Ensure Supabase connection is working
4. Review the `FIXES_SUMMARY.md` for technical details

## Ready to Learn! 🚀

Once setup is complete, you'll have access to:
- **11+ rich, interactive lessons**
- **5 daily challenges**
- **Real progress tracking**
- **Achievement system**
- **Interactive coding exercises**

Happy coding and enjoy learning Python! 🐍✨