/*
  # PyLearn Lesson Library - Additional Achievements

  ## Overview
  Additional achievements for the expanded lesson library covering beginner,
  intermediate, advanced, and specialized learning paths.

  ## New Achievement Categories
  - Path completion achievements
  - Skill level achievements
  - Specialization achievements
  - Comprehensive learning achievements
*/

-- Insert achievements for completing learning paths
INSERT INTO achievements (id, name, description, icon, category, requirement, xp_reward) VALUES
('beginner_complete', 'Python Foundation', 'Complete all beginner lessons', '🎓', 'path_completion', '{"type": "path_completion", "path": "beginner", "count": 15}', 100),
('intermediate_complete', 'Python Practitioner', 'Complete all intermediate lessons', '⚡', 'path_completion', '{"type": "path_completion", "path": "intermediate", "count": 20}', 150),
('advanced_complete', 'Python Master', 'Complete all advanced lessons', '👑', 'path_completion', '{"type": "path_completion", "path": "advanced", "count": 15}', 200),
('specialized_complete', 'Specialist', 'Complete a specialized module', '🏅', 'specialization', '{"type": "specialization_completion", "any_module": true, "count": 5}', 120),

-- Skill-specific achievements
('data_science_novice', 'Data Explorer', 'Complete 3 data science lessons', '📊', 'skill', '{"type": "lesson_completion", "path": "data-science", "count": 3}', 60),
('data_science_expert', 'Data Scientist', 'Complete all data science lessons', '🔬', 'skill', '{"type": "lesson_completion", "path": "data-science", "count": 5}', 100),
('web_developer_novice', 'Web Builder', 'Complete 3 web development lessons', '🌐', 'skill', '{"type": "lesson_completion", "path": "web-development", "count": 3}', 60),
('web_developer_expert', 'Web Architect', 'Complete all web development lessons', '🏗️', 'skill', '{"type": "lesson_completion", "path": "web-development", "count": 5}', 100),
('automation_novice', 'Task Automator', 'Complete 3 automation lessons', '🤖', 'skill', '{"type": "lesson_completion", "path": "automation", "count": 3}', 60),
('automation_expert', 'Automation Master', 'Complete all automation lessons', '⚙️', 'skill', '{"type": "lesson_completion", "path": "automation", "count": 5}', 100),

-- Comprehensive learning achievements
('comprehensive_learner', 'Comprehensive Learner', 'Complete lessons from all paths', '📚', 'comprehensive', '{"type": "path_variety", "paths": ["beginner", "intermediate", "advanced"], "min_per_path": 3}', 180),
('specialist_collector', 'Specialist Collector', 'Complete lessons from 2 specialized modules', '🏆', 'comprehensive', '{"type": "specialization_variety", "count": 2, "min_per_module": 3}', 150),
('full_stack_python', 'Full Stack Python', 'Complete web development and data science modules', '💻', 'comprehensive', '{"type": "module_combination", "modules": ["web-development", "data-science"], "complete_all": true}', 200),

-- Performance achievements
('speed_learner', 'Speed Learner', 'Complete 10 lessons in under 30 minutes each', '⚡', 'performance', '{"type": "completion_speed", "count": 10, "max_time_minutes": 30}', 80),
('perfect_scores', 'Perfect Student', 'Score 100% on 5 different puzzle lessons', '💯', 'performance', '{"type": "perfect_puzzles", "count": 5}', 90),
('streak_master', 'Streak Master', 'Complete 7 lessons in 7 consecutive days', '🔥', 'performance', '{"type": "daily_streak", "length": 7}', 100),

-- Interactive lesson mastery
('drag_drop_specialist', 'Drag & Drop Specialist', 'Complete 20 drag-drop lessons with 90%+ accuracy', '🎯', 'interactive_mastery', '{"type": "lesson_type_mastery", "lesson_type": "drag-drop", "count": 20, "min_accuracy": 90}', 120),
('puzzle_mastermind', 'Puzzle Mastermind', 'Score above 1500 points in 10 different puzzles', '🧩', 'interactive_mastery', '{"type": "puzzle_excellence", "count": 10, "min_score": 1500}', 140),
('story_teller', 'Story Teller', 'Complete all story lessons across all paths', '📖', 'interactive_mastery', '{"type": "lesson_type_completion", "lesson_type": "story", "all_paths": true}', 130),

-- XP and progression achievements
('xp_collector', 'XP Collector', 'Earn 1000 total XP', '⭐', 'progression', '{"type": "total_xp", "min_xp": 1000}', 50),
('xp_champion', 'XP Champion', 'Earn 2500 total XP', '🌟', 'progression', '{"type": "total_xp", "min_xp": 2500}', 100),
('xp_legend', 'XP Legend', 'Earn 5000 total XP', '👑', 'progression', '{"type": "total_xp", "min_xp": 5000}', 200),

-- Variety and exploration achievements
('lesson_explorer', 'Lesson Explorer', 'Try at least one lesson from each category', '🗺️', 'variety', '{"type": "category_exploration", "categories": ["drag-drop", "puzzle", "story", "multiple-choice", "code"]}', 80),
('difficulty_diver', 'Difficulty Diver', 'Complete lessons from beginner, intermediate, and advanced levels', '📈', 'variety', '{"type": "difficulty_variety", "levels": ["beginner", "intermediate", "advanced"], "min_per_level": 2}', 90),
('module_jumper', 'Module Jumper', 'Complete lessons from 3 different specialized modules', '🔀', 'variety', '{"type": "module_variety", "count": 3, "min_per_module": 2}', 110)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for achievement queries
CREATE INDEX IF NOT EXISTS idx_achievements_category_requirement ON achievements(category, requirement);
CREATE INDEX IF NOT EXISTS idx_achievements_xp_reward ON achievements(xp_reward);

-- Add comments for documentation
COMMENT ON TABLE achievements IS 'Achievement system with JSON-based requirements for flexible validation logic';

-- Verify achievements were inserted
SELECT
  category,
  COUNT(*) as achievement_count,
  STRING_AGG(name, ', ' ORDER BY xp_reward) as achievements
FROM achievements
GROUP BY category
ORDER BY category;