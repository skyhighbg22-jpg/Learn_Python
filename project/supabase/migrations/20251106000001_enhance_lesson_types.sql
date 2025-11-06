/*
  # Enhanced Lesson Types Migration

  ## Overview
  Adds support for new interactive lesson types (drag-drop, puzzle, story) and related achievements.

  ## Changes
  - Add lesson_type column to lessons table
  - Add JSONB columns for lesson-specific data
  - Insert new achievements for interactive lesson types
*/

-- Add lesson_type column to lessons table
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS lesson_type VARCHAR(20) DEFAULT 'multiple-choice'
CHECK (lesson_type IN ('multiple-choice', 'code', 'drag-drop', 'puzzle', 'story'));

-- Add JSONB columns for different lesson types
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS game_data JSONB, -- For puzzle game configurations
ADD COLUMN IF NOT EXISTS story_data JSONB, -- For story content and chapters
ADD COLUMN IF NOT EXISTS drag_drop_data JSONB; -- For drag-drop configurations

-- Insert achievements for new lesson types
INSERT INTO achievements (id, name, description, icon, category, requirement, xp_reward) VALUES
('drag_drop_master', 'Drag & Drop Master', 'Complete 10 drag-drop lessons', '🎯', 'skill', '{"type": "lesson_completion", "lesson_type": "drag-drop", "count": 10}', 50),
('puzzle_champion', 'Puzzle Champion', 'Score 1000+ points in puzzle games', '🏆', 'skill', '{"type": "puzzle_score", "min_score": 1000}', 100),
('story_hero', 'Story Hero', 'Complete your first story quest', '📖', 'skill', '{"type": "lesson_completion", "lesson_type": "story", "count": 1}', 75),
('drag_drop_expert', 'Drag & Drop Expert', 'Complete 25 drag-drop lessons without hints', '⚡', 'skill', '{"type": "lesson_completion", "lesson_type": "drag-drop", "count": 25, "no_hints": true}', 150),
('puzzle_speedster', 'Puzzle Speedster', 'Complete 5 puzzles in under 2 minutes each', '⚡', 'skill', '{"type": "puzzle_speed", "count": 5, "max_time_seconds": 120}', 75),
('story_master', 'Story Master', 'Complete all story lessons in a learning path', '👑', 'skill', '{"type": "story_completion", "all_paths": true}', 200),
('interactive_learner', 'Interactive Learner', 'Try all lesson types', '🎮', 'skill', '{"type": "variety", "lesson_types": ["multiple-choice", "code", "drag-drop", "puzzle", "story"]}', 100);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lessons_lesson_type ON lessons(lesson_type);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);

-- Update existing lessons to have lesson_type (keeping current functionality)
UPDATE lessons
SET lesson_type = 'multiple-choice'
WHERE lesson_type IS NULL OR lesson_type = '';

-- Add comment to document the new columns
COMMENT ON COLUMN lessons.lesson_type IS 'Type of lesson: multiple-choice, code, drag-drop, puzzle, or story';
COMMENT ON COLUMN lessons.game_data IS 'JSON data for puzzle game configurations including scoring, timer, and rules';
COMMENT ON COLUMN lessons.story_data IS 'JSON data for story lessons including chapters, characters, and narrative elements';
COMMENT ON COLUMN lessons.drag_drop_data IS 'JSON data for drag-drop lessons including code blocks, validation rules, and shuffle patterns';