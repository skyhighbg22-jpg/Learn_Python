import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, Award, Target, Calendar, Clock, BookOpen, Zap, Flame,
  Trophy, Star, Activity, Users, Code, FileText
} from 'lucide-react';

interface ProgressData {
  date: string;
  xp: number;
  lessons_completed: number;
  study_time: number;
  streak: number;
}

interface SkillData {
  skill: string;
  level: number;
  maxLevel: number;
  category: string;
}

interface WeeklyStats {
  week: string;
  lessons: number;
  xp: number;
  time: number;
  accuracy: number;
}

const ProgressDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [skillData, setSkillData] = useState<SkillData[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [learningStreak, setLearningStreak] = useState(0);

  // Generate mock data for demonstration
  useEffect(() => {
    const generateMockData = () => {
      setLoading(true);

      // Generate progress data based on time range
      const dataPoints = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
      const data: ProgressData[] = [];

      for (let i = dataPoints - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          xp: Math.floor(Math.random() * 50) + 10,
          lessons_completed: Math.floor(Math.random() * 3),
          study_time: Math.floor(Math.random() * 60) + 15,
          streak: Math.max(0, learningStreak - i)
        });
      }

      // Generate skill data
      const skills: SkillData[] = [
        { skill: 'Python Basics', level: 8, maxLevel: 10, category: 'fundamentals' },
        { skill: 'Data Structures', level: 6, maxLevel: 10, category: 'fundamentals' },
        { skill: 'Algorithms', level: 5, maxLevel: 10, category: 'problem-solving' },
        { skill: 'Web Development', level: 4, maxLevel: 10, category: 'applications' },
        { skill: 'Data Science', level: 3, maxLevel: 10, category: 'applications' },
        { skill: 'Testing', level: 7, maxLevel: 10, category: 'practices' },
        { skill: 'OOP', level: 6, maxLevel: 10, category: 'fundamentals' },
        { skill: 'APIs', level: 5, maxLevel: 10, category: 'applications' }
      ];

      // Generate weekly stats
      const weeks: WeeklyStats[] = [];
      for (let i = 4; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - (i * 7));

        weeks.push({
          week: `Week ${5 - i}`,
          lessons: Math.floor(Math.random() * 10) + 5,
          xp: Math.floor(Math.random() * 500) + 200,
          time: Math.floor(Math.random() * 300) + 120,
          accuracy: Math.floor(Math.random() * 20) + 75
        });
      }

      setProgressData(data);
      setSkillData(skills);
      setWeeklyStats(weeks);
      setLearningStreak(profile?.current_streak || 0);

      setTimeout(() => setLoading(false), 500);
    };

    generateMockData();
  }, [timeRange, profile?.current_streak]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Color palette for charts
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  const skillLevels = skillData.map(skill => ({
    skill: skill.skill.replace(' ', '\\n'),
    level: skill.level,
    fullMark: 10
  }));

  const categoryData = skillData.reduce((acc, skill) => {
    const existing = acc.find(item => item.category === skill.category);
    if (existing) {
      existing.value += skill.level;
      existing.count += 1;
    } else {
      acc.push({
        category: skill.category,
        value: skill.level,
        count: 1
      });
    }
    return acc;
  }, [] as Array<{ category: string; value: number; count: number }>);

  const averageCategoryData = categoryData.map(cat => ({
    ...cat,
    average: Math.round((cat.value / cat.count) * 10) / 10
  }));

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Progress Dashboard</h2>
          <p className="text-slate-400">Track your learning journey and achievements</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-700 rounded-lg p-1">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md font-medium capitalize transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8" />
            <span className="text-2xl font-bold">{profile?.total_xp || 0}</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Total XP</h3>
          <p className="text-blue-100 text-sm">Level {profile?.current_level || 1}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Flame className="w-8 h-8" />
            <span className="text-2xl font-bold">{learningStreak}</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Current Streak</h3>
          <p className="text-orange-100 text-sm">Days in a row</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="w-8 h-8" />
            <span className="text-2xl font-bold">
              {progressData.reduce((sum, day) => sum + day.lessons_completed, 0)}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Lessons Completed</h3>
          <p className="text-green-100 text-sm">This {timeRange}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8" />
            <span className="text-2xl font-bold">
              {Math.floor(progressData.reduce((sum, day) => sum + day.study_time, 0) / 60)}h
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Study Time</h3>
          <p className="text-purple-100 text-sm">This {timeRange}</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* XP Progress */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            XP Progress
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Area
                type="monotone"
                dataKey="xp"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Radar */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Skills Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={skillLevels}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="skill" stroke="#9ca3af" />
              <PolarRadiusAxis angle={90} domain={[0, 10]} stroke="#9ca3af" />
              <Radar
                name="Skill Level"
                dataKey="level"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Performance */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Weekly Performance
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Bar dataKey="lessons" fill="#10b981" />
              <Bar dataKey="xp" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Skill Categories
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={averageCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, average }) => `${category}: ${average}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="average"
              >
                {averageCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Learning Activity */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-400" />
            Activity Stats
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Daily Average</span>
                <span className="text-white font-semibold">
                  {Math.round(progressData.reduce((sum, day) => sum + day.study_time, 0) / progressData.length)} min
                </span>
              </div>
              <div className="bg-slate-700 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{ width: '75%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Accuracy Rate</span>
                <span className="text-white font-semibold">87%</span>
              </div>
              <div className="bg-slate-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: '87%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Goal Progress</span>
                <span className="text-white font-semibold">92%</span>
              </div>
              <div className="bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: '92%' }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Next Milestone</span>
                <span className="text-blue-400 text-sm font-semibold">Level {((profile?.current_level || 1) + 1)}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-slate-400 text-sm">XP to Level Up</span>
                <span className="text-yellow-400 text-sm font-semibold">
                  {100 - ((profile?.total_xp || 0) % 100)} XP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Recent Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'First Steps', description: 'Complete your first lesson', icon: '🎯', earned: true },
            { title: 'Week Warrior', description: '7-day streak achieved', icon: '🔥', earned: true },
            { title: 'Code Master', description: 'Complete 10 coding challenges', icon: '💻', earned: false },
            { title: 'Quick Learner', description: 'Complete 5 lessons in one day', icon: '⚡', earned: true },
            { title: 'Knowledge Seeker', description: 'Reach Level 5', icon: '📚', earned: false },
            { title: 'Perfectionist', description: 'Score 100% on 3 lessons', icon: '💯', earned: false }
          ].map((achievement, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 transition-all ${
                achievement.earned
                  ? 'bg-green-900/20 border-green-700/30'
                  : 'bg-slate-700/30 border-slate-600 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{achievement.icon}</span>
                {achievement.earned && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <h4 className={`font-semibold mb-1 ${achievement.earned ? 'text-white' : 'text-slate-400'}`}>
                {achievement.title}
              </h4>
              <p className={`text-sm ${achievement.earned ? 'text-slate-300' : 'text-slate-500'}`}>
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;