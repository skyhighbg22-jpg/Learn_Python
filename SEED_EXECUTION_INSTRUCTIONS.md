# Database Seed Execution Guide

## Overview
This document explains how to execute the SQL seed files to populate the database with comprehensive content for the Python learning application.

## Available Seed Files

### 🗄️ Schema & Core Content
- `project/database_schema.sql` - Complete database schema
- `project/supabase/migrations/20251101101334_create_pylearn_schema.sql` - Base schema
- `project/supabase/migrations/20251102130045_add_practice_tables.sql` - Practice tables

### 📚 Lesson Content
- `FULL_CURRICULUM.sql` - **PRIORITY** - Complete 60-lesson curriculum
- `CURRICULUM_FIXED.sql` - Fixed lesson content
- `project/supabase/seed_beginner_lessons.sql` - Beginner lessons
- `project/supabase/seed_all_lessons.sql` - All lessons
- `project/supabase/seed_enhanced_lessons.sql` - Enhanced lessons

### 🏋 Practice Content
- `project/supabase/seed_code_challenges.sql` - **PRIORITY** - 25+ coding challenges
- `project/supabase/seed_algorithm_problems.sql` - **PRIORITY** - 20+ algorithm problems
- `project/supabase/seed_project_templates.sql` - **PRIORITY** - 10+ project templates

### 🏆 Additional Content
- `project/supabase/seed_new_achievements.sql` - Achievements
- `project/supabase/seed_daily_challenges.sql` - Daily challenges
- `project/supabase/seed_interview_questions.sql` - Interview questions

## Execution Methods

### Method 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the content from each seed file in priority order
4. Execute each file

**Priority Order:**
1. `database_schema.sql` (create tables)
2. `FULL_CURRICULUM.sql` (all lessons)
3. `seed_code_challenges.sql` (practice problems)
4. `seed_algorithm_problems.sql` (algorithm problems)
5. `seed_project_templates.sql` (project templates)

### Method 2: Command Line (Advanced)
If you have the Supabase CLI installed:

```bash
# Set up environment
export SUPABASE_URL=your_project_url
export SUPABASE_SERVICE_KEY=your_service_key

# Execute seeds
supabase db push --schema=project/database_schema.sql
supabase db push --data=FULL_CURRICULUM.sql
supabase db push --data=project/supabase/seed_code_challenges.sql
supabase db push --data=project/supabase/seed_algorithm_problems.sql
supabase db push --data=project/supabase/seed_project_templates.sql
```

### Method 3: Using psql (Direct Database)
If you have direct database access:

```bash
# Connect to your database
psql "postgresql://user:password@host:port/database"

# Execute seed files
\i project/database_schema.sql
\i FULL_CURRICULUM.sql
\i project/supabase/seed_code_challenges.sql
\i project/supabase/seed_algorithm_problems.sql
\i project/supabase/seed_project_templates.sql
```

## What Each Seed Provides

### `FULL_CURRICULUM.sql`
- ✅ 10 Sections (Python Basics through OOP)
- ✅ 60 Lessons across all sections
- ✅ Complete String Operations section (8-10 lessons)
- ✅ Lesson progression and XP rewards
- ✅ Multiple lesson types (coding, multiple-choice, etc.)

### `seed_code_challenges.sql`
- ✅ 25+ coding challenges (beginner to advanced)
- ✅ Categories: Basic concepts, algorithms, data structures
- ✅ Complete test cases and solutions
- ✅ XP rewards and difficulty levels

### `seed_algorithm_problems.sql`
- ✅ 20+ algorithm problems
- ✅ Sorting, dynamic programming, graphs, greedy
- ✅ Time/space complexity analysis
- ✅ Detailed explanations and approaches

### `seed_project_templates.sql`
- ✅ 10+ project templates
- ✅ Web development, data science, automation projects
- ✅ Complete starter code and learning objectives
- ✅ Project difficulty and time estimates

## Verification Queries

After execution, run these queries to verify data:

```sql
-- Check sections
SELECT COUNT(*) as section_count FROM sections;
-- Expected: 10

-- Check lessons
SELECT COUNT(*) as lesson_count FROM lessons;
-- Expected: 60+

-- Check String Operations lessons
SELECT COUNT(*) as string_lessons
FROM lessons
WHERE section_id = '00000000-0000-0000-0000-000000000007';
-- Expected: 8-10

-- Check code challenges
SELECT COUNT(*) as challenge_count FROM code_challenges;
-- Expected: 25+

-- Check algorithm problems
SELECT COUNT(*) as algorithm_count FROM algorithm_problems;
-- Expected: 20+

-- Check project templates
SELECT COUNT(*) as project_count FROM project_templates;
-- Expected: 10+
```

## Expected Results

After proper execution, users should see:

✅ **All 4 practice modes populated** with actual content
✅ **String Operations section** with 8-10 lessons
✅ **Complete learning path** from basics to advanced
✅ **No more "No problems available yet"** messages
✅ **Proper XP and progression** system working

## Troubleshooting

### If lessons don't appear:
1. Check that sections and lessons tables have data
2. Verify section_id foreign keys are correct
3. Check that the app is properly fetching from the database

### If practice sections are empty:
1. Verify practice tables were created (`code_challenges`, `algorithm_problems`, etc.)
2. Check RLS policies allow authenticated users to read data
3. Confirm seed files executed without errors

### If you get foreign key errors:
1. Ensure database schema executed first
2. Check that UUIDs are properly formatted
3. Verify dependent tables exist before inserting data

## Quick Start Script

For testing purposes, you can execute just the essential content:

```sql
-- 1. Essential schema (if not already created)
CREATE TABLE IF NOT EXISTS sections (...);
CREATE TABLE IF NOT EXISTS lessons (...);
CREATE TABLE IF NOT EXISTS code_challenges (...);

-- 2. Basic content
INSERT INTO sections (...) VALUES (...);  -- Python Basics
INSERT INTO lessons (...) VALUES (...);  -- First few lessons
INSERT INTO code_challenges (...) VALUES (...);  -- First few challenges
```

This should resolve the immediate issues and allow users to access content while you execute the full seed files.