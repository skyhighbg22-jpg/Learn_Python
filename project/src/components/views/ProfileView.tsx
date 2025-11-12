import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Flame, Zap, Trophy, Target, Medal, Award, Star, Lock, TrendingUp, Grid3X3 } from 'lucide-react';
import AchievementService, { AchievementProgress } from '../../services/achievementService';

export const ProfileView = () => {
  const { profile } = useAuth();
  const [achievementProgress, setAchievementProgress] = useState<AchievementProgress[]>([]);
  const [achievementStats, setAchievementStats] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  if (!profile) return null;

  const stats = [
    {
      label: 'Total XP',
      value: profile.total_xp,
      icon: Zap,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Current Streak',
      value: `${profile.current_streak} days`,
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Longest Streak',
      value: `${profile.longest_streak} days`,
      icon: Trophy,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Current Level',
      value: profile.current_level,
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-slate-800 rounded-2xl p-8 mb-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            {profile.display_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{profile.display_name}</h1>
            <p className="text-slate-400">@{profile.username}</p>
            <div className="mt-2 inline-block px-4 py-1 bg-blue-900/30 border border-blue-700 rounded-full">
              <span className="text-blue-400 font-semibold capitalize">{profile.league} League</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} border border-slate-700 rounded-lg p-4`}
              >
                <Icon className={`${stat.color} mb-2`} size={24} />
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Learning Progress</h2>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-300">Level {profile.current_level} Progress</span>
              <span className="text-slate-400">{profile.total_xp % 100} / 100 XP</span>
            </div>
            <div className="bg-slate-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                style={{ width: `${(profile.total_xp % 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Daily Goal</h3>
              <p className="text-slate-400 text-sm">{profile.daily_goal_minutes} minutes per day</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Learning Path</h3>
              <p className="text-slate-400 text-sm capitalize">
                {profile.learning_path || 'Not selected'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
