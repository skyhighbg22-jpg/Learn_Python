import { createClient } from '@supabase/supabase-js';
import { getSuperbaseConfigFromRuntime } from '../utils/runtimeConfig';

// Try to get config from runtime (Docker container), fallback to import.meta.env (dev)
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

try {
  const runtimeConfig = getSuperbaseConfigFromRuntime();
  if (runtimeConfig.url) supabaseUrl = runtimeConfig.url;
  if (runtimeConfig.anonKey) supabaseAnonKey = runtimeConfig.anonKey;
} catch {
  // Config not loaded yet, use env vars
  console.log('Using Supabase config from env vars');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  display_name: string;
  avatar_character: string;
  avatar_url?: string;
  current_streak: number;
  longest_streak: number;
  total_xp: number;
  current_level: number;
  hearts: number;
  last_heart_reset: string;
  league: string;
  learning_path: string | null;
  daily_goal_minutes: number;
  created_at: string;
  updated_at: string;
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  xp_reward: number;
  order_index: number;
  section_id: string;
  content: {
    type: string;
    question: string;
    options?: string[];
    correctAnswer?: string;
    code?: string;
    starterCode?: string;
    solution?: string;
  }[];
  lesson_type?: 'multiple-choice' | 'code' | 'drag-drop' | 'puzzle' | 'story';
  estimated_minutes: number;
  drag_drop_data?: any;
  game_data?: any;
  story_data?: any;
};

export type Section = {
  id: string;
  title: string;
  description: string;
  path: string;
  order_index: number;
  unlock_requirement_xp: number;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement: Record<string, unknown>;
  xp_reward: number;
};

export type DailyChallenge = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  xp_reward: number;
  date: string;
  problem: {
    question: string;
    starterCode: string;
    testCases: Array<{ input: string; expectedOutput: string }>;
  };
};
