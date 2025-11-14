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

      // Get achievement details for XP reward
      const { data: achievement } = await supabase
        .from('achievements')
        .select('xp_reward')
        .eq('id', achievementId)
        .single();

      // Unlock achievement
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievementId,
          progress: 100,
          unlocked_at: new Date().toISOString()
        });

      if (error) throw error;

      // Award XP if achievement has XP reward
      if (achievement?.xp_reward) {
        await this.awardAchievementXP(userId, achievement.xp_reward);
      }

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

  // Get achievement statistics
  async getAchievementStats(userId: string): Promise<{
    total: number;
    unlocked: number;
    completion_rate: number;
    xp_from_achievements: number;
    by_category: Record<string, { total: number; unlocked: number }>;
  }> {
    try {
      const allAchievements = await this.getAllAchievements();
      const userAchievements = await this.getUserAchievements(userId);

      // Calculate XP from achievements
      const achievementIds = userAchievements.map(ua => ua.achievement_id);
      const { data: achievementDetails } = await supabase
        .from('achievements')
        .select('xp_reward, category')
        .in('id', achievementIds);

      const totalXP = achievementDetails?.reduce((sum, a) => sum + (a.xp_reward || 0), 0) || 0;

      // Group by category
      const byCategory: Record<string, { total: number; unlocked: number }> = {};
      allAchievements.forEach(achievement => {
        if (!byCategory[achievement.category]) {
          byCategory[achievement.category] = { total: 0, unlocked: 0 };
        }
        byCategory[achievement.category].total++;

        if (userAchievements.find(ua => ua.achievement_id === achievement.id)) {
          byCategory[achievement.category].unlocked++;
        }
      });

      return {
        total: allAchievements.length,
        unlocked: userAchievements.length,
        completion_rate: Math.floor((userAchievements.length / allAchievements.length) * 100),
        xp_from_achievements: totalXP,
        by_category: byCategory
      };
    } catch (error) {
      console.error('Error fetching achievement stats:', error);
      return {
        total: 0,
        unlocked: 0,
        completion_rate: 0,
        xp_from_achievements: 0,
        by_category: {}
      };
    }
  }
}

export default AchievementService.getInstance();