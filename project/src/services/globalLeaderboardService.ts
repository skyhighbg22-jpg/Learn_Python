import { supabase } from '../lib/supabase';

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  display_name: string;
  avatar_character: string;
  avatar_frame?: string;
  title?: string;
  total_xp: number;
  current_level: number;
  current_streak: number;
  achievements_count: number;
  achievement_points: number;
  total_score: number;
  league: string;
  weekly_xp: number;
  country_code?: string;
  join_date: string;
  last_active: string;
  is_friend?: boolean;
  is_current_user?: boolean;
  movement?: {
    rank_change: number;
    direction: 'up' | 'down' | 'same';
  };
}

export interface LeaderboardFilters {
  time_range: 'all_time' | 'yearly' | 'monthly' | 'weekly' | 'daily';
  category: 'overall' | 'xp' | 'streak' | 'achievements' | 'lessons';
  region?: 'global' | 'country' | 'league';
  friends_only?: boolean;
  league_filter?: 'all' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster';
}

export interface LeaderboardStats {
  total_participants: number;
  current_user_rank?: LeaderboardEntry;
  top_achievers: LeaderboardEntry[];
  rising_stars: LeaderboardEntry[];
  streak_masters: LeaderboardEntry[];
  country_distribution: Array<{
    country: string;
    country_name: string;
    participants: number;
    top_rank: number;
  }>;
}

export class GlobalLeaderboardService {
  private static instance: GlobalLeaderboardService;
  private leaderboardCache: Map<string, { data: LeaderboardEntry[]; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): GlobalLeaderboardService {
    if (!GlobalLeaderboardService.instance) {
      GlobalLeaderboardService.instance = new GlobalLeaderboardService();
    }
    return GlobalLeaderboardService.instance;
  }

  /**
   * Get global leaderboard with filters
   */
  async getLeaderboard(
    filters: LeaderboardFilters,
    limit: number = 100,
    offset: number = 0
  ): Promise<LeaderboardEntry[]> {
    const cacheKey = this.generateCacheKey(filters, limit, offset);

    // Check cache
    const cached = this.leaderboardCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      let query = supabase
        .from('enhanced_user_profile')
        .select(`
          *,
          profiles!inner(
            id,
            username,
            display_name,
            avatar_character,
            avatar_frame,
            title,
            league,
            created_at,
            last_active_date
          )
        `);

      // Apply time range filter
      if (filters.time_range !== 'all_time') {
        const timeFilter = this.getTimeFilter(filters.time_range);
        query = query.gte('last_active_date', timeFilter);
      }

      // Apply region filter
      if (filters.region === 'league' && filters.league_filter && filters.league_filter !== 'all') {
        query = query.eq('league', filters.league_filter);
      }

      // Apply friends filter
      if (filters.friends_only) {
        // This would need implementation based on friendships table
        const currentUser = await this.getCurrentUserId();
        if (currentUser) {
          const friendIds = await this.getFriendIds(currentUser);
          query = query.in('id', [...friendIds, currentUser]);
        }
      }

      // Order by category
      query = this.applyCategoryOrdering(query, filters.category);

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) throw error;

      const entries = await this.transformToLeaderboardEntries(data || [], filters);

      // Cache the result
      this.leaderboardCache.set(cacheKey, {
        data: entries,
        timestamp: Date.now()
      });

      return entries;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }

  /**
   * Get user's position in leaderboard
   */
  async getUserLeaderboardPosition(
    userId: string,
    filters: LeaderboardFilters
  ): Promise<LeaderboardEntry | null> {
    try {
      // First get the user's score
      const userQuery = this.applyCategoryOrdering(
        supabase
          .from('enhanced_user_profile')
          .select(`
            *,
            profiles!inner(
              id,
              username,
              display_name,
              avatar_character,
              avatar_frame,
              title,
              league,
              created_at,
              last_active_date
            )
          `)
          .eq('id', userId),
        filters.category
      );

      const { data: userData, error: userError } = await userQuery.single();

      if (userError || !userData) return null;

      // Then get users with higher score to calculate rank
      const higherScoreQuery = this.applyCategoryOrdering(
        supabase
          .from('enhanced_user_profile')
          .select('id', { count: 'exact', head: true })
          .gt(this.getScoreColumn(filters.category), this.getUserScore(userData, filters.category)),
        filters.category
      );

      const { count: higherCount } = await higherScoreQuery;

      const rank = (higherCount || 0) + 1;

      const userEntry: LeaderboardEntry = {
        rank,
        user_id: userData.id,
        username: userData.profiles.username,
        display_name: userData.profiles.display_name,
        avatar_character: userData.profiles.avatar_character,
        avatar_frame: userData.profiles.avatar_frame,
        title: userData.profiles.title,
        total_xp: userData.total_xp || 0,
        current_level: userData.current_level || 1,
        current_streak: userData.current_streak || 0,
        achievements_count: userData.total_achievements || 0,
        achievement_points: userData.total_points || 0,
        total_score: this.getUserScore(userData, filters.category),
        league: userData.profiles.league || 'bronze',
        weekly_xp: userData.weekly_xp || 0,
        join_date: userData.profiles.created_at,
        last_active: userData.profiles.last_active_date || userData.profiles.created_at,
        is_current_user: true
      };

      return userEntry;
    } catch (error) {
      console.error('Error getting user leaderboard position:', error);
      return null;
    }
  }

  /**
   * Get comprehensive leaderboard statistics
   */
  async getLeaderboardStats(filters: LeaderboardFilters): Promise<LeaderboardStats> {
    try {
      // Get total participants
      const { count: totalParticipants } = await supabase
        .from('enhanced_user_profile')
        .select('*', { count: 'exact', head: true });

      // Get current user's position
      const currentUserId = await this.getCurrentUserId();
      let currentUserRank: LeaderboardEntry | undefined;

      if (currentUserId) {
        currentUserRank = await this.getUserLeaderboardPosition(currentUserId, filters);
      }

      // Get top achievers (highest achievement points)
      const { data: topAchievers } = await supabase
        .from('enhanced_user_profile')
        .select(`
          *,
          profiles!inner(
            username,
            display_name,
            avatar_character,
            avatar_frame,
            title
          )
        `)
        .not('total_points', 'is', null)
        .order('total_points', { ascending: false })
        .limit(10);

      // Get rising stars (biggest rank improvement this week)
      const { data: risingStars } = await supabase
        .from('weekly_leaderboard_history')
        .select(`
          current_rank,
          previous_rank,
          user:profiles(
            username,
            display_name,
            avatar_character,
            avatar_frame,
            title
          )
        `)
        .gte('rank_change', 10)
        .order('rank_change', { ascending: false })
        .limit(10);

      // Get streak masters
      const { data: streakMasters } = await supabase
        .from('enhanced_user_profile')
        .select(`
          current_streak,
          profiles!inner(
            username,
            display_name,
            avatar_character,
            avatar_frame,
            title
          )
        `)
        .gt('current_streak', 7)
        .order('current_streak', { ascending: false })
        .limit(10);

      // Get country distribution (if country data is available)
      const { data: countryData } = await supabase
        .from('profiles')
        .select('country_code', { count: 'exact', head: true })
        .not('country_code', 'is', null)
        .group('country_code')
        .order('count', { ascending: false })
        .limit(10);

      const countryDistribution = countryData?.map((item: any, index: number) => ({
        country: item.country_code,
        country_name: this.getCountryName(item.country_code),
        participants: item.count,
        top_rank: index + 1
      })) || [];

      return {
        total_participants: totalParticipants || 0,
        current_user_rank: currentUserRank || undefined,
        top_achievers: await this.transformToLeaderboardEntries(topAchievers || [], filters),
        rising_stars: await this.transformToLeaderboardEntries(risingStars || [], filters),
        streak_masters: await this.transformToLeaderboardEntries(streakMasters || [], filters),
        country_distribution: countryDistribution
      };
    } catch (error) {
      console.error('Error getting leaderboard stats:', error);
      return {
        total_participants: 0,
        top_achievers: [],
        rising_stars: [],
        streak_masters: [],
        country_distribution: []
      };
    }
  }

  /**
   * Update user's leaderboard position
   */
  async updateUserLeaderboardData(userId: string): Promise<void> {
    try {
      // This would be called when user XP, achievements, or other metrics change
      // The enhanced_user_profile view should automatically reflect changes
      // But we might need to trigger a refresh or update certain calculations

      await supabase
        .rpc('update_user_leaderboard_stats', { p_user_id: userId });
    } catch (error) {
      console.error('Error updating user leaderboard data:', error);
    }
  }

  /**
   * Clear leaderboard cache
   */
  clearCache(): void {
    this.leaderboardCache.clear();
  }

  /**
   * Get leaderboard movement for a user
   */
  async getUserRankMovement(
    userId: string,
    filters: LeaderboardFilters
  ): Promise<{ rank_change: number; direction: 'up' | 'down' | 'same' }> {
    try {
      // Get current rank
      const currentRank = await this.getUserLeaderboardPosition(userId, filters);
      if (!currentRank) return { rank_change: 0, direction: 'same' };

      // Get previous rank from history
      const { data: historyData } = await supabase
        .from('weekly_leaderboard_history')
        .select('rank')
        .eq('user_id', userId)
        .eq('time_range', filters.time_range)
        .eq('category', filters.category)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!historyData) {
        return { rank_change: 0, direction: 'same' };
      }

      const rankChange = currentRank.rank - historyData.rank;
      let direction: 'up' | 'down' | 'same' = 'same';

      if (rankChange < 0) {
        direction = 'up';
      } else if (rankChange > 0) {
        direction = 'down';
      }

      return {
        rank_change: Math.abs(rankChange),
        direction
      };
    } catch (error) {
      console.error('Error getting user rank movement:', error);
      return { rank_change: 0, direction: 'same' };
    }
  }

  /**
   * Search for users in leaderboard
   */
  async searchLeaderboardUsers(
    searchTerm: string,
    filters: LeaderboardFilters,
    limit: number = 20
  ): Promise<LeaderboardEntry[]> {
    try {
      let query = supabase
        .from('enhanced_user_profile')
        .select(`
          *,
          profiles!inner(
            id,
            username,
            display_name,
            avatar_character,
            avatar_frame,
            title,
            league,
            created_at,
            last_active_date
          )
        `)
        .or(`profiles.username.ilike.%${searchTerm}%,profiles.display_name.ilike.%${searchTerm}%`);

      query = this.applyCategoryOrdering(query, filters);
      query = query.limit(limit);

      const { data, error } = await query;

      if (error) throw error;

      return await this.transformToLeaderboardEntries(data || [], filters);
    } catch (error) {
      console.error('Error searching leaderboard users:', error);
      return [];
    }
  }

  // Private helper methods

  private generateCacheKey(
    filters: LeaderboardFilters,
    limit: number,
    offset: number
  ): string {
    return `${JSON.stringify(filters)}_${limit}_${offset}`;
  }

  private getTimeFilter(timeRange: string): string {
    const now = new Date();
    switch (timeRange) {
      case 'daily':
        return new Date(now.setDate(now.getDate() - 1)).toISOString();
      case 'weekly':
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case 'monthly':
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      case 'yearly':
        return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
      default:
        return new Date(0).toISOString();
    }
  }

  private applyCategoryOrdering(query: any, category: string): any {
    switch (category) {
      case 'xp':
        return query.order('total_xp', { ascending: false });
      case 'streak':
        return query.order('current_streak', { ascending: false });
      case 'achievements':
        return query.order('total_points', { ascending: false });
      case 'lessons':
        return query.order('completed_lessons', { ascending: false });
      default: // overall
        return query.order('total_score', { ascending: false });
    }
  }

  private getScoreColumn(category: string): string {
    switch (category) {
      case 'xp': return 'total_xp';
      case 'streak': return 'current_streak';
      case 'achievements': return 'total_points';
      case 'lessons': return 'completed_lessons';
      default: return 'total_score';
    }
  }

  private getUserScore(userData: any, category: string): number {
    switch (category) {
      case 'xp': return userData.total_xp || 0;
      case 'streak': return userData.current_streak || 0;
      case 'achievements': return userData.total_points || 0;
      case 'lessons': return userData.completed_lessons || 0;
      default: return userData.total_score || 0;
    }
  }

  private async transformToLeaderboardEntries(
    data: any[],
    filters: LeaderboardFilters
  ): Promise<LeaderboardEntry[]> {
    const currentUserId = await this.getCurrentUserId();

    return data.map((item, index) => ({
      rank: index + 1,
      user_id: item.id || item.user_id,
      username: item.profiles?.username || item.username,
      display_name: item.profiles?.display_name || item.display_name,
      avatar_character: item.profiles?.avatar_character || item.avatar_character,
      avatar_frame: item.profiles?.avatar_frame || item.avatar_frame,
      title: item.profiles?.title || item.title,
      total_xp: item.total_xp || 0,
      current_level: item.current_level || 1,
      current_streak: item.current_streak || 0,
      achievements_count: item.total_achievements || 0,
      achievement_points: item.total_points || 0,
      total_score: this.getUserScore(item, filters.category),
      league: item.league || item.profiles?.league || 'bronze',
      weekly_xp: item.weekly_xp || 0,
      join_date: item.created_at || item.profiles?.created_at,
      last_active: item.last_active_date || item.profiles?.last_active_date,
      is_friend: false, // Would need friendship check
      is_current_user: item.id === currentUserId || item.user_id === currentUserId
    }));
  }

  private async getCurrentUserId(): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id || null;
    } catch {
      return null;
    }
  }

  private async getFriendIds(userId: string): Promise<string[]> {
    try {
      const { data } = await supabase
        .from('friendships')
        .select('friend_id')
        .eq('user_id', userId)
        .eq('status', 'accepted');

      return data?.map(f => f.friend_id) || [];
    } catch {
      return [];
    }
  }

  private getCountryName(countryCode: string): string {
    // This would ideally use a proper country mapping library
    const countryMap: Record<string, string> = {
      'US': 'United States',
      'GB': 'United Kingdom',
      'CA': 'Canada',
      'AU': 'Australia',
      'DE': 'Germany',
      'FR': 'France',
      'IN': 'India',
      'JP': 'Japan',
      'BR': 'Brazil',
      'MX': 'Mexico'
    };
    return countryMap[countryCode] || countryCode;
  }
}

export const globalLeaderboardService = GlobalLeaderboardService.getInstance();