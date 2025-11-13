# 🔧 Troubleshooting Guide - Lessons Not Showing

## Quick Fix Steps

### Step 1: Run This Script First 🚀
Copy and paste the entire contents of `ADD_LESSONS_NOW.sql` into your Supabase SQL Editor and run it. This script:

✅ **Deletes old conflicting data**
✅ **Adds 5 complete sections**
✅ **Adds 13+ interactive lessons**
✅ **Adds 3 daily challenges**

### Step 2: Check Your Environment Variables ⚙️
Make sure your `.env` file has correct Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Restart the Development Server 🔄
```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Step 4: Check Browser Console 📱
- Press F12 → Console tab
- Look for any red error messages
- Check for connection errors to Supabase

## What You Should See After Setup

### ✅ 5 Complete Sections:
1. **Python Basics** (0 XP required) - 4 lessons
2. **Variables & Data Types** (30 XP required) - 3 lessons
3. **Control Flow** (80 XP required) - 3 lessons
4. **Functions & Modules** (150 XP required) - 2 lessons
5. **Lists & Data Structures** (250 XP required) - 2 lessons

### ✅ 13+ Interactive Lessons:
- Traditional lessons with text explanations
- Coding lessons with interactive exercises
- Multiple choice quizzes
- Mix of beginner and intermediate difficulty

### ✅ 3 Daily Challenges:
- Python Basics Quiz (Today)
- Variables Challenge (Tomorrow)
- Code Challenge: Hello World (In 2 days)

## Still Not Working? 🆘

### Diagnostic Check:
Run `CHECK_DATA.sql` in Supabase SQL Editor:
- You should see section counts
- You should see lesson data
- If no data appears, run `ADD_LESSONS_NOW.sql` again

### Common Issues:

**Issue: "No lessons available yet" message**
✅ **Fix**: Run `ADD_LESSONS_NOW.sql` - it clears and refreshes data

**Issue: White screen or loading forever**
✅ **Fix**: Check browser console for Supabase connection errors

**Issue: Lessons show but can't click them**
✅ **Fix**: Make sure you're logged in and have enough XP

**Issue: Environment variable errors**
✅ **Fix**: Double-check your `.env` file has correct Supabase URL and keys

## Test Your Setup 🧪

After running the setup script:

1. **Start the app**: `npm run dev`
2. **Go to Learn tab**: You should see 5 sections
3. **First section unlocked**: Python Basics should be available (0 XP required)
4. **Click a lesson**: Try "Welcome to Python" or "Hello World Program"
5. **Check challenges**: Go to Challenges tab to see daily challenges

## Success Checklist ✅

- [ ] Ran `ADD_LESSONS_NOW.sql` script
- [ ] Environment variables configured correctly
- [ ] Development server restarted
- [ ] Browser console shows no errors
- [ ] 5 sections visible in Learn tab
- [ ] Lessons can be clicked and opened
- [ ] Daily challenges appear in Challenges tab

If all boxes are checked, you're all set! 🎉

---

**Still having issues?** The `ADD_LESSONS_NOW.sql` script is designed to work reliably - run it multiple times if needed as it clears old data each time.