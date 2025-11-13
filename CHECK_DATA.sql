-- 🔍 DIAGNOSTIC SCRIPT - CHECK WHAT'S IN YOUR DATABASE
-- Run this to see if lessons exist and troubleshoot issues

-- Check if sections exist
SELECT 'SECTIONS CHECK' as info, COUNT(*) as count, 'sections' as table_name FROM sections
UNION ALL
SELECT 'LESSONS CHECK' as info, COUNT(*) as count, 'lessons' as table_name FROM lessons
UNION ALL
SELECT 'PROFILES CHECK' as info, COUNT(*) as count, 'profiles' as table_name FROM profiles
UNION ALL
SELECT 'CHALLENGES CHECK' as info, COUNT(*) as count, 'daily_challenges' as table_name FROM daily_challenges;

-- Show sections if they exist
SELECT '=== SECTIONS ===' as info, title as data, NULL as extra FROM sections
UNION ALL
SELECT 'section', description, CAST(unlock_requirement_xp AS TEXT) FROM sections
UNION ALL
SELECT 'lessons_count', CAST(COUNT(l.id) AS TEXT), NULL FROM sections s LEFT JOIN lessons l ON s.id = l.section_id GROUP BY s.id;

-- Show sample lessons if they exist
SELECT '=== LESSONS ===' as info, title as data, CAST(xp_reward AS TEXT) as extra FROM lessons LIMIT 10
UNION ALL
SELECT 'lesson', description, lesson_type FROM lessons LIMIT 5;

-- Check if user progress table exists and has data
SELECT 'USER PROGRESS CHECK' as info, COUNT(*) as count, 'user_lesson_progress' as table_name FROM user_lesson_progress;