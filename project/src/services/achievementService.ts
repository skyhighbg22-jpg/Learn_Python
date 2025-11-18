import { supabase } from '../lib/supabase';

// Achievement type definitions
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'progress' | 'streak' | 'xp' | 'social' | 'special' | 'mastery' | 'legendary';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp_reward: number;
  points: number; // For leaderboard ranking
  secret: boolean; // Hidden until unlocked
  special_rewards: Reward[];
  requirements: {
    type: string;
    value: number;
    condition?: any;
  };
  created_at: string;
}

export interface Reward {
  type: 'avatar' | 'title' | 'badge' | 'theme' | 'feature' | 'sky_personality' | 'celebration' | 'profile_frame';
  value: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  progress: number; // 0-100 percentage
  rarity: string;
  celebration_viewed: boolean;
  shared_externally: boolean;
  rewards_applied: boolean;
}

export interface AchievementProgress {
  achievement: Achievement;
  progress: number;
  current_value: number;
  target_value: number;
  is_unlocked: boolean;
}

export interface AchievementNotification {
  id: string;
  user_id: string;
  achievement_id: string;
  message: string;
  created_at: string;
  read: boolean;
}

class AchievementService {
  private static instance: AchievementService;
  private achievementCache: Map<string, Achievement[]> = new Map();

  private constructor() {}

  public static getInstance(): AchievementService {
    if (!AchievementService.instance) {
      AchievementService.instance = new AchievementService();
    }
    return AchievementService.instance;
  }

  // Fetch all achievements
  async getAllAchievements(): Promise<Achievement[]> {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Cache achievements for performance
      this.achievementCache.set('all', data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  }

  // Get user's achievements
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }
  }

  // Get achievement progress for user
  async getAchievementProgress(userId: string): Promise<AchievementProgress[]> {
    try {
      const achievements = await this.getAllAchievements();
      const userAchievements = await this.getUserAchievements(userId);
      const userProfile = await this.getUserProfile(userId);

      const progress: AchievementProgress[] = [];

      for (const achievement of achievements) {
        const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id);
        const currentProgress = await this.calculateProgress(achievement, userProfile);

        progress.push({
          achievement,
          progress: currentProgress.percentage,
          current_value: currentProgress.current,
          target_value: currentProgress.target,
          is_unlocked: !!userAchievement
        });
      }

      return progress.sort((a, b) => {
        // Sort by locked status first, then by progress percentage
        if (a.is_unlocked !== b.is_unlocked) {
          return a.is_unlocked ? 1 : -1;
        }
        return b.progress - a.progress;
      });
    } catch (error) {
      console.error('Error fetching achievement progress:', error);
      return [];
    }
  }

  // Calculate progress for a specific achievement
  private async calculateProgress(
    achievement: Achievement,
    userProfile: any
  ): Promise<{ percentage: number; current: number; target: number }> {
    const { type, value: target } = achievement.requirements;
    let current = 0;

    try {
      switch (type) {
        case 'lessons_completed':
          current = await this.getLessonsCompletedCount(userProfile.id);
          break;
        case 'total_xp':
          current = userProfile.total_xp || 0;
          break;
        case 'current_streak':
          current = userProfile.current_streak || 0;
          break;
        case 'longest_streak':
          current = userProfile.longest_streak || 0;
          break;
        case 'perfect_lesson':
          current = await this.getPerfectLessonsCount(userProfile.id);
          break;
        case 'daily_challenges':
          current = await this.getDailyChallengesCount(userProfile.id);
          break;
        case 'code_challenges':
          current = await this.getCodeChallengesCount(userProfile.id);
          break;
        case 'friends_added':
          current = await this.getFriendsCount(userProfile.id);
          break;
        case 'level_reached':
          current = userProfile.level || 1;
          break;
        case 'consecutive_days':
          current = await this.getConsecutiveDaysCount(userProfile.id);
          break;
        default:
          current = 0;
      }

      const percentage = Math.min(100, Math.floor((current / target) * 100));

      return { percentage, current, target };
    } catch (error) {
      console.error('Error calculating progress:', error);
      return { percentage: 0, current: 0, target };
    }
  }

  // Check and unlock achievements
  async checkAndUnlockAchievements(userId: string): Promise<Achievement[]> {
    try {
      const progress = await this.getAchievementProgress(userId);
      const newlyUnlocked: Achievement[] = [];

      for (const item of progress) {
        if (!item.is_unlocked && item.progress >= 100) {
          const unlocked = await this.unlockAchievement(userId, item.achievement.id);
          if (unlocked) {
            newlyUnlocked.push(item.achievement);
            await this.createAchievementNotification(userId, item.achievement);
          }
        }
      }

      return newlyUnlocked;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }

  // Unlock a specific achievement
  async unlockAchievement(userId: string, achievementId: string): Promise<boolean> {
    try {
      // Check if already unlocked
      const { data: existing } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .eq('achievement_id', achievementId)
        .single();

      if (existing) return false;

      // Get achievement details for XP reward and rarity
      const { data: achievement } = await supabase
        .from('achievements')
        .select('xp_reward, rarity')
        .eq('id', achievementId)
        .single();

      // Unlock achievement with enhanced fields
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievementId,
          progress: 100,
          unlocked_at: new Date().toISOString(),
          rarity: achievement?.rarity || 'common',
          celebration_viewed: false,
          shared_externally: false,
          rewards_applied: false
        });

      if (error) throw error;

      // Award XP if achievement has XP reward
      if (achievement?.xp_reward) {
        await this.awardAchievementXP(userId, achievement.xp_reward);
      }

      // Apply special rewards
      await this.applySpecialRewards(userId, achievementId);

      return true;
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      return false;
    }
  }

  // Award XP from achievements
  private async awardAchievementXP(userId: string, xpAmount: number): Promise<void> {
    try {
      const { error } = await supabase.rpc('award_achievement_xp', {
        p_user_id: userId,
        p_xp_amount: xpAmount
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error awarding achievement XP:', error);
    }
  }

  // Create achievement notification
  private async createAchievementNotification(
    userId: string,
    achievement: Achievement
  ): Promise<void> {
    try {
      const rarityColors = {
        common: '#gray',
        rare: '#blue',
        epic: '#purple',
        legendary: '#gold'
      };

      const message = `🏆 Achievement Unlocked: ${achievement.title} (${achievement.rarity.toUpperCase()})`;

      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'achievement',
          title: 'Achievement Unlocked!',
          message,
          metadata: {
            achievement_id: achievement.id,
            achievement_title: achievement.title,
            rarity: achievement.rarity,
            xp_reward: achievement.xp_reward,
            color: rarityColors[achievement.rarity]
          },
          read: false,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating achievement notification:', error);
    }
  }

  // Get achievement notifications
  async getAchievementNotifications(userId: string): Promise<AchievementNotification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('type', 'achievement')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching achievement notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  async markNotificationRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Helper methods for progress calculation
  private async getLessonsCompletedCount(userId: string): Promise<number> {
    try {
      const { count } = await supabase
        .from('user_lessons')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('completed', true);

      return count || 0;
    } catch (error) {
      return 0;
    }
  }

  private async getPerfectLessonsCount(userId: string): Promise<number> {
    try {
      const { count } = await supabase
        .from('user_lessons')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('completed', true)
        .eq('score', 100);

      return count || 0;
    } catch (error) {
      return 0;
    }
  }

  private async getDailyChallengesCount(userId: string): Promise<number> {
    try {
      const { count } = await supabase
        .from('daily_challenge_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('completed', true);

      return count || 0;
    } catch (error) {
      return 0;
    }
  }

  private async getCodeChallengesCount(userId: string): Promise<number> {
    try {
      const { count } = await supabase
        .from('user_code_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('passed', true);

      return count || 0;
    } catch (error) {
      return 0;
    }
  }

  private async getFriendsCount(userId: string): Promise<number> {
    try {
      const { count } = await supabase
        .from('friendships')
        .select('*', { count: 'exact', head: true })
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq('status', 'accepted');

      return count || 0;
    } catch (error) {
      return 0;
    }
  }

  private async getConsecutiveDaysCount(userId: string): Promise<number> {
    try {
      // This would need to be implemented based on user activity tracking
      // For now, return current streak as a placeholder
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_streak')
        .eq('id', userId)
        .single();

      return profile?.current_streak || 0;
    } catch (error) {
      return 0;
    }
  }

  private async getUserProfile(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {};
    }
  }

  // Enhanced achievement statistics with rarity breakdown
  async getAchievementStats(userId: string): Promise<{
    total: number;
    unlocked: number;
    completion_rate: number;
    xp_from_achievements: number;
    total_points: number;
    by_rarity: Record<string, { total: number; unlocked: number; points: number }>;
    by_category: Record<string, { total: number; unlocked: number }>;
    secret_unlocked: number;
    rewards_claimed: Reward[];
  }> {
    try {
      const allAchievements = await this.getAllAchievements();
      const userAchievements = await this.getUserAchievements(userId);

      // Calculate XP and points from achievements
      const achievementIds = userAchievements.map(ua => ua.achievement_id);
      const { data: achievementDetails } = await supabase
        .from('achievements')
        .select('xp_reward, category, points, rarity, secret, special_rewards')
        .in('id', achievementIds);

      const totalXP = achievementDetails?.reduce((sum, a) => sum + (a.xp_reward || 0), 0) || 0;
      const totalPoints = achievementDetails?.reduce((sum, a) => sum + (a.points || 0), 0) || 0;

      // Group by rarity and category
      const byRarity: Record<string, { total: number; unlocked: number; points: number }> = {};
      const byCategory: Record<string, { total: number; unlocked: number }> = {};
      let secretUnlocked = 0;
      const allRewards: Reward[] = [];

      allAchievements.forEach(achievement => {
        // Group by rarity
        if (!byRarity[achievement.rarity]) {
          byRarity[achievement.rarity] = { total: 0, unlocked: 0, points: 0 };
        }
        byRarity[achievement.rarity].total++;

        // Group by category
        if (!byCategory[achievement.category]) {
          byCategory[achievement.category] = { total: 0, unlocked: 0 };
        }
        byCategory[achievement.category].total++;

        const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id);
        if (userAchievement) {
          byRarity[achievement.rarity].unlocked++;
          byRarity[achievement.rarity].points += achievement.points || 0;
          byCategory[achievement.category].unlocked++;

          if (achievement.secret) {
            secretUnlocked++;
          }

          // Collect rewards from this achievement
          if (achievement.special_rewards && Array.isArray(achievement.special_rewards)) {
            allRewards.push(...achievement.special_rewards);
          }
        }
      });

      return {
        total: allAchievements.length,
        unlocked: userAchievements.length,
        completion_rate: Math.floor((userAchievements.length / allAchievements.length) * 100),
        xp_from_achievements: totalXP,
        total_points: totalPoints,
        by_rarity: byRarity,
        by_category: byCategory,
        secret_unlocked: secretUnlocked,
        rewards_claimed: allRewards
      };
    } catch (error) {
      console.error('Error fetching achievement stats:', error);
      return {
        total: 0,
        unlocked: 0,
        completion_rate: 0,
        xp_from_achievements: 0,
        total_points: 0,
        by_rarity: {},
        by_category: {},
        secret_unlocked: 0,
        rewards_claimed: []
      };
    }
  }

  // Apply special rewards when achievement is unlocked
  async applySpecialRewards(userId: string, achievementId: string): Promise<boolean> {
    try {
      const { data: achievement } = await supabase
        .from('achievements')
        .select('special_rewards')
        .eq('id', achievementId)
        .single();

      if (!achievement || !achievement.special_rewards) return true;

      const rewards = achievement.special_rewards as Reward[];
      const profile = await this.getUserProfile(userId);

      const updates: any = {};
      const preferences = profile.preferences || {};

      for (const reward of rewards) {
        switch (reward.type) {
          case 'avatar':
            updates.avatar_character = reward.value;
            break;
          case 'title':
            updates.title = reward.value;
            break;
          case 'profile_frame':
            updates.avatar_frame = reward.value;
            break;
          case 'theme':
            preferences.theme = reward.value;
            break;
          case 'sky_personality':
            preferences.sky_personality = reward.value;
            break;
          case 'feature':
            preferences.unlocked_features = [
              ...(preferences.unlocked_features || []),
              reward.value
            ];
            break;
          case 'celebration':
            preferences.unlocked_celebrations = [
              ...(preferences.unlocked_celebrations || []),
              reward.value
            ];
            break;
        }
      }

      if (Object.keys(updates).length > 0) {
        await supabase
          .from('profiles')
          .update(updates)
          .eq('id', userId);
      }

      if (Object.keys(preferences).length > 0) {
        await supabase
          .from('profiles')
          .update({ preferences })
          .eq('id', userId);
      }

      // Mark rewards as applied
      await supabase
        .from('user_achievements')
        .update({ rewards_applied: true })
        .eq('user_id', userId)
        .eq('achievement_id', achievementId);

      return true;
    } catch (error) {
      console.error('Error applying special rewards:', error);
      return false;
    }
  }

  // Get rarity visual properties for UI
  getRarityProperties(rarity: string): {
    color: string;
    borderColor: string;
    bgColor: string;
    glowColor: string;
    animation?: string;
  } {
    switch (rarity) {
      case 'common':
        return {
          color: 'text-gray-300',
          borderColor: 'border-gray-500',
          bgColor: 'from-gray-600 to-gray-700',
          glowColor: 'rgba(156, 163, 175, 0.3)'
        };
      case 'rare':
        return {
          color: 'text-blue-300',
          borderColor: 'border-blue-500',
          bgColor: 'from-blue-600 to-blue-700',
          glowColor: 'rgba(59, 130, 246, 0.4)',
          animation: 'pulse-blue'
        };
      case 'epic':
        return {
          color: 'text-purple-300',
          borderColor: 'border-purple-500',
          bgColor: 'from-purple-600 to-purple-700',
          glowColor: 'rgba(147, 51, 234, 0.5)',
          animation: 'pulse-purple'
        };
      case 'legendary':
        return {
          color: 'text-yellow-300',
          borderColor: 'border-yellow-500',
          bgColor: 'from-yellow-600 to-orange-600',
          glowColor: 'rgba(251, 191, 36, 0.6)',
          animation: 'pulse-gold'
        };
      default:
        return {
          color: 'text-gray-300',
          borderColor: 'border-gray-500',
          bgColor: 'from-gray-600 to-gray-700',
          glowColor: 'rgba(156, 163, 175, 0.3)'
        };
    }
  }

  // Get special rewards for a user
  async getSpecialRewards(userId: string): Promise<Reward[]> {
    try {
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);

      if (!userAchievements) return [];

      const achievementIds = userAchievements.map(ua => ua.achievement_id);

      const { data: achievements } = await supabase
        .from('achievements')
        .select('special_rewards')
        .in('id', achievementIds);

      if (!achievements) return [];

      const allRewards = achievements
        .flatMap(a => a.special_rewards as Reward[])
        .filter(reward => reward !== null);

      return allRewards;
    } catch (error) {
      console.error('Error fetching special rewards:', error);
      return [];
    }
  }

  // Get leaderboard points for achievement rarity
  getLeaderboardPoints(rarity: string): number {
    switch (rarity) {
      case 'common': return 10;
      case 'rare': return 50;
      case 'epic': return 150;
      case 'legendary': return 500;
      default: return 10;
    }
  }

  // Mark achievement celebration as viewed
  async markCelebrationViewed(userId: string, achievementId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_achievements')
        .update({ celebration_viewed: true })
        .eq('user_id', userId)
        .eq('achievement_id', achievementId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking celebration as viewed:', error);
      return false;
    }
  }

  // Get unviewed achievement celebrations
  async getUnviewedCelebrations(userId: string): Promise<Achievement[]> {
    try {
      const { data } = await supabase
        .from('user_achievements')
        .select(`
          achievement_id,
          achievements!inner(
            id,
            title,
            description,
            icon,
            rarity,
            special_rewards
          )
        `)
        .eq('user_id', userId)
        .eq('celebration_viewed', false);

      return data?.map(ua => ua.achievements) || [];
    } catch (error) {
      console.error('Error fetching unviewed celebrations:', error);
      return [];
    }
  }

  // Share achievement externally
  async shareAchievement(userId: string, achievementId: string, platform: 'twitter' | 'linkedin' | 'facebook'): Promise<string> {
    try {
      const { data: achievement } = await supabase
        .from('achievements')
        .select('title, rarity, description')
        .eq('id', achievementId)
        .single();

      if (!achievement) return '';

      // Mark as shared
      await supabase
        .from('user_achievements')
        .update({ shared_externally: true })
        .eq('user_id', userId)
        .eq('achievement_id', achievementId);

      const rarityEmojis = {
        common: '🔹',
        rare: '🔷',
        epic: '🟣',
        legendary: '⭐'
      };

      const messages = {
        twitter: `Just unlocked the ${rarityEmojis[achievement.rarity]} ${achievement.title} achievement in PyLearn! ${achievement.description} 🐍 #Python #LearnToCode`,
        linkedin: `I'm excited to share that I've earned the ${achievement.title} achievement on my Python learning journey with PyLearn! ${achievement.description} #PythonProgramming #ProfessionalDevelopment`,
        facebook: `🎉 Achievement Unlocked! I just earned the ${achievement.title} achievement in PyLearn while learning Python. ${achievement.description} #CodingJourney`
      };

      return messages[platform];
    } catch (error) {
      console.error('Error sharing achievement:', error);
      return '';
    }
  }

  // Get recommended achievements to pursue
  async getRecommendedAchievements(userId: string, limit: number = 3): Promise<AchievementProgress[]> {
    try {
      const progress = await this.getAchievementProgress(userId);
      const unlocked = progress.filter(p => p.is_unlocked);
      const inProgress = progress.filter(p => !p.is_unlocked && p.progress > 0);
      const locked = progress.filter(p => !p.is_unlocked && p.progress === 0);

      // Prioritize: almost complete > in progress > easy to start
      const recommended = [
        ...inProgress.filter(p => p.progress >= 70).sort((a, b) => b.progress - a.progress),
        ...inProgress.filter(p => p.progress < 70).sort((a, b) => b.progress - a.progress),
        ...locked.filter(p => p.achievement.requirements.type === 'lessons_completed').slice(0, 2)
      ];

      return recommended.slice(0, limit);
    } catch (error) {
      console.error('Error getting recommended achievements:', error);
      return [];
    }
  }

  // Check for secret achievement triggers
  async checkSecretAchievements(userId: string, action: string, context: any): Promise<Achievement[]> {
    const secretAchievements = [
      {
        id: 'speed_demon',
        title: 'Speed Demon',
        description: 'Complete 5 lessons in under 2 minutes',
        icon: '⚡',
        category: 'mastery' as const,
        rarity: 'rare' as const,
        xp_reward: 500,
        points: 100,
        secret: true,
        special_rewards: [
          {
            type: 'theme' as const,
            value: 'lightning',
            description: 'Lightning Theme',
            rarity: 'rare' as const
          }
        ],
        requirements: {
          type: 'speed_run',
          value: 5,
          condition: { time_limit: 120 } // 2 minutes
        },
        created_at: new Date().toISOString()
      },
      {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Complete 20 lessons without any mistakes',
        icon: '💎',
        category: 'mastery' as const,
        rarity: 'epic' as const,
        xp_reward: 1000,
        points: 200,
        secret: true,
        special_rewards: [
          {
            type: 'title' as const,
            value: 'The Perfect',
            description: 'Perfect title',
            rarity: 'epic' as const
          },
          {
            type: 'celebration' as const,
            value: 'diamond',
            description: 'Diamond celebration',
            rarity: 'epic' as const
          }
        ],
        requirements: {
          type: 'perfect_run',
          value: 20,
          condition: { no_hints: true }
        },
        created_at: new Date().toISOString()
      }
    ];

    const newlyUnlocked: Achievement[] = [];

    for (const achievement of secretAchievements) {
      if (await this.checkSecretRequirement(achievement, userId, action, context)) {
        await this.unlockAchievement(userId, achievement.id);
        await this.applySpecialRewards(userId, achievement.id);
        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  }

  // Check if secret achievement requirement is met
  private async checkSecretRequirement(
    achievement: any,
    userId: string,
    action: string,
    context: any
  ): Promise<boolean> {
    const { type, value, condition } = achievement.requirements;

    switch (type) {
      case 'speed_run':
        // This would need timing implementation
        return false;
      case 'perfect_run':
        if (action === 'lesson_complete' && context.perfect) {
          const perfectCount = await this.getPerfectRunCount(userId);
          return perfectCount >= value;
        }
        return false;
      default:
        return false;
    }
  }

  private async getPerfectRunCount(userId: string): Promise<number> {
    try {
      const { count } = await supabase
        .from('user_lesson_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('perfect_completion', true)
        .eq('hints_revealed', 0);

      return count || 0;
    } catch (error) {
      return 0;
    }
  }
}

export default AchievementService.getInstance();