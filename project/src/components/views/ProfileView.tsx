import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Flame, Zap, Trophy, Target, Medal, Award, Star, Lock, TrendingUp, Grid3X3, Calendar, Activity, Share2, BarChart3 } from 'lucide-react';
import AchievementService, { AchievementProgress } from '../../services/achievementService';
import { ProfilePictureUpload } from '../ui/ProfilePictureUpload';
import { SkillProgress } from '../ui/SkillProgress';
import { profileAnalyticsService, SkillData, LearningPathData } from '../../services/profileAnalyticsService';

export const ProfileView = () => {
  const { profile, loading: authLoading, refreshProfile, updateProfileAvatar } = useAuth();
  const [achievementProgress, setAchievementProgress] = useState<AchievementProgress[]>([]);
  const [achievementStats, setAchievementStats] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPathData[]>([]);
  const [profileStats, setProfileStats] = useState<any>(null);
  const [showSocialShare, setShowSocialShare] = useState(false);

  // Handle auth loading state
  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Handle missing profile with error state and retry
  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex flex-col items-center justify-center h-64 bg-slate-800 rounded-2xl p-8">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Profile Unavailable</h2>
          <p className="text-slate-400 mb-6 text-center max-w-md">
            We couldn't load your profile data. This might be due to a connection issue or temporary server problem.
          </p>
          <button
            onClick={async () => {
              setRefreshing(true);
              try {
                await refreshProfile();
              } catch (error) {
                console.error('Failed to refresh profile:', error);
              } finally {
                setRefreshing(false);
              }
            }}
            disabled={refreshing}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {refreshing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Refreshing...
              </>
            ) : (
              'Try Again'
            )}
          </button>
        </div>
      </div>
    );
  }

  // Load profile data
  useEffect(() => {
    const loadProfileData = async () => {
      if (!profile?.id) return;

      try {
        setLoading(true);
        const [progress, stats, skillData, pathData, analytics] = await Promise.all([
          AchievementService.getAchievementProgress(profile.id),
          AchievementService.getAchievementStats(profile.id),
          profileAnalyticsService.calculateSkillProgress(profile.id),
          profileAnalyticsService.calculateLearningPaths(profile.id),
          profileAnalyticsService.calculateProfileStats(profile.id)
        ]);

        setAchievementProgress(progress);
        setAchievementStats(stats);
        setSkills(skillData);
        setLearningPaths(pathData);
        setProfileStats(analytics);
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [profile?.id]);

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
      label: 'Achievements',
      value: `${achievementStats?.unlocked || 0}/${achievementStats?.total || 0}`,
      icon: Medal,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20';
      case 'rare': return 'bg-blue-500/20';
      case 'epic': return 'bg-purple-500/20';
      case 'legendary': return 'bg-yellow-500/20';
      default: return 'bg-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'progress': return <TrendingUp className="w-4 h-4" />;
      case 'streak': return <Flame className="w-4 h-4" />;
      case 'xp': return <Zap className="w-4 h-4" />;
      case 'social': return <Star className="w-4 h-4" />;
      case 'special': return <Award className="w-4 h-4" />;
      default: return <Medal className="w-4 h-4" />;
    }
  };

  const filteredAchievements = selectedCategory === 'all'
    ? achievementProgress
    : achievementProgress.filter(a => a.achievement.category === selectedCategory);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-slate-800 rounded-2xl p-8 mb-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full overflow-hidden flex items-center justify-center">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-white text-4xl font-bold">
                {profile.display_name.charAt(0).toUpperCase()}
              </div>
            )}
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

      {/* Achievements Section */}
      <div className="bg-slate-800 rounded-2xl p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Achievements</h2>
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-slate-400" />
            <span className="text-slate-400">
              {achievementStats?.completion_rate || 0}% Complete
            </span>
          </div>
        </div>

        {/* Achievement Stats Overview */}
        {achievementStats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {Object.entries(achievementStats.by_category).map(([category, stats]: [string, any]) => (
              <div key={category} className="bg-slate-700 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryIcon(category)}
                  <span className="text-white text-sm font-semibold capitalize">
                    {category}
                  </span>
                </div>
                <p className="text-slate-400 text-xs">
                  {stats.unlocked}/{stats.total}
                </p>
                <div className="mt-2 bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(stats.unlocked / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All ({achievementProgress.length})
          </button>
          {['progress', 'streak', 'xp', 'social', 'special'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize flex items-center gap-2 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {getCategoryIcon(category)}
              {category}
              <span className="text-xs">
                ({achievementProgress.filter(a => a.achievement.category === category).length})
              </span>
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.achievement.id}
              className={`relative border rounded-lg p-4 transition-all ${
                achievement.is_unlocked
                  ? `${getRarityBg(achievement.achievement.rarity)} ${getRarityColor(achievement.achievement.rarity)} border-${achievement.achievement.rarity === 'legendary' ? 'yellow' : achievement.achievement.rarity === 'epic' ? 'purple' : achievement.achievement.rarity === 'rare' ? 'blue' : 'gray'}-500/30`
                  : 'bg-slate-700/50 border-slate-600 opacity-60'
              }`}
            >
              {/* Achievement Icon */}
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${
                  achievement.is_unlocked
                    ? getRarityBg(achievement.achievement.rarity)
                    : 'bg-slate-600'
                }`}>
                  {achievement.is_unlocked ? (
                    <Trophy className={`w-6 h-6 ${getRarityColor(achievement.achievement.rarity)}`} />
                  ) : (
                    <Lock className="w-6 h-6 text-slate-500" />
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  achievement.is_unlocked
                    ? getRarityBg(achievement.achievement.rarity)
                    : 'bg-slate-600'
                }`}>
                  {achievement.achievement.rarity.toUpperCase()}
                </span>
              </div>

              {/* Achievement Info */}
              <h3 className={`font-semibold mb-1 ${
                achievement.is_unlocked ? 'text-white' : 'text-slate-400'
              }`}>
                {achievement.achievement.title}
              </h3>
              <p className={`text-sm mb-3 ${
                achievement.is_unlocked ? 'text-slate-300' : 'text-slate-500'
              }`}>
                {achievement.achievement.description}
              </p>

              {/* Progress Bar */}
              {!achievement.is_unlocked && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-slate-400">
                      {achievement.current_value}/{achievement.target_value}
                    </span>
                  </div>
                  <div className="bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* XP Reward */}
              {achievement.achievement.xp_reward > 0 && (
                <div className={`flex items-center gap-1 mt-2 text-xs ${
                  achievement.is_unlocked ? 'text-yellow-400' : 'text-slate-500'
                }`}>
                  <Zap className="w-3 h-3" />
                  +{achievement.achievement.xp_reward} XP
                </div>
              )}

              {/* Unlocked Badge */}
              {achievement.is_unlocked && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-8">
            <Lock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No achievements found in this category</p>
          </div>
        )}
      </div>

      {/* Learning Progress Section */}
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
