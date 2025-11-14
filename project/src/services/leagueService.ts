interface LeagueInfo {
  name: string;
  minXP: number;
  maxXP: number;
}

interface UserRanking {
  rank: number;
  username: string;
  xp: number;
  avatar?: string;
  challengesCompleted: number;
}

interface LeagueBenefit {
  name: string;
  description: string;
  icon: string;
  required: string;
}

class LeagueService {
  private readonly LEAGUES: Record<string, LeagueInfo> = {
    bronze: { name: 'Bronze', minXP: 0, maxXP: 999 },
    silver: { name: 'Silver', minXP: 1000, maxXP: 4999 },
    gold: { name: 'Gold', minXP: 5000, maxXP: 14999 },
    platinum: { name: 'Platinum', minXP: 15000, maxXP: Infinity }
  };

  private readonly LEAGUE_BENEFITS: Record<string, LeagueBenefit[]> = {
    bronze: [
      { name: 'Bronze Badge', description: 'Show your Bronze status', icon: '🥉', required: 'Join PyLearn' },
      { name: 'Bronze Leaderboard', description: 'View Bronze rankings', icon: '📊', required: 'Complete 5 lessons' },
      { name: 'Basic Profile Customization', description: 'Customize avatar and profile', icon: '🎨', required: 'Reach 100 XP' }
    ],
    silver: [
      { name: 'Silver Badge', description: 'Display your Silver achievement', icon: '🥈', required: '1000+ XP' },
      { name: 'Silver Leaderboard', description: 'Compete with Silver players', icon: '🏆', required: '1500+ XP' },
      { name: 'Advanced Profile Customization', description: 'Unlock avatar frames', icon: '🖼️', required: '2000+ XP' },
      { name: 'Priority Support', description: 'Get priority support access', icon: '⭐', required: '3000+ XP' }
    ],
    gold: [
      { name: 'Gold Badge', description: 'Display your Gold accomplishment', icon: '🥇', required: '5000+ XP' },
      { name: 'Gold Leaderboard', description: 'Compete with elite players', icon: '👑', required: '6000+ XP' },
      { name: 'Exclusive Challenges', description: 'Access premium challenges', icon: '🏰', required: '7500+ XP' },
      { name: 'Mentor Status', description: 'Help new learners', icon: '🎓', required: '10000+ XP' }
    ],
    platinum: [
      { name: 'Platinum Badge', description: 'Ultimate achievement status', icon: '🏆', required: '15000+ XP' },
      { name: 'Platinum Leaderboard', description: 'Top players leaderboard', icon: '👑‍🚀', required: '15000+ XP' },
      { name: 'Course Creation Access', description: 'Create your own Python courses', icon: '📝', required: '20000+ XP' },
      { name: 'Beta Feature Access', description: 'Try new features first', icon: '🧪', required: '25000+ XP' },
      { name: 'VIP Status', description: 'Maximum platform benefits', icon: '👑‍🏆', required: 'Infinity XP' }
    ]
  };

  // Determine league based on XP
  determineLeague(xp: number): string {
    if (xp >= this.LEAGUES.platinum.minXP) return 'platinum';
    if (xp >= this.LEAGUES.gold.minXP) return 'gold';
    if (xp >= this.LEAGUES.silver.minXP) return 'silver';
    return 'bronze';
  }

  // Calculate XP needed to reach next league
  calculateXPToNextLeague(currentXP: number, currentLeague: string): number {
    const currentLeagueInfo = this.LEAGUES[currentLeague];
    const nextLeague = this.getNextLeague(currentLeague);

    if (!nextLeague) return 0;

    return Math.max(0, nextLeague.minXP - currentXP);
  }

  // Get next league
  getNextLeague(currentLeague: string): string | null {
    const leagueOrder = ['bronze', 'silver', 'gold', 'platinum'];
    const currentIndex = leagueOrder.indexOf(currentLeague);

    if (currentIndex < leagueOrder.length - 1) {
      return leagueOrder[currentIndex + 1];
    }

    return null;
  }

  // Calculate user's rank within their league
  calculateUserRank(userId: string, currentXP: number): Promise<UserRanking> {
    // In production, this would query the database for rankings
    // For now, return sample data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          rank: 42,
          username: 'You',
          xp: currentXP,
          avatar: 'https://example.com/avatar.jpg',
          challengesCompleted: 16
        });
      }, 100);
    });
  }

  // Get top 10 users in user's league
  getLeagueLeaderboard(userId: string, currentXP: number): Promise<UserRanking[]> {
    // In production, this would query the database
    // For now, return sample data that includes "You"
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { rank: 1, username: 'CodeMaster', xp: 14500, challengesCompleted: 89 },
          { rank: 2, username: 'PythonNinja', xp: 13200, challengesCompleted: 76 },
          { rank: 3, username: 'SyntaxHero', xp: 12800, challengesCompleted: 68 },
          { rank: 4, username: 'AlgorithmKing', xp: 11500, challengesCompleted: 54 },
          { rank: 5, username: 'DataWizard', xp: 10900, challengesCompleted: 49 },
          { rank: 6, username: 'BugHunter', xp: 9800, challengesCompleted: 42 },
          { rank: 7, username: 'LoopMaster', xp: 8700, challengesCompleted: 35 },
          { rank: 8, username: 'FunctionGuru', xp: 7600, challengesCompleted: 28 },
          { rank: 9, username: 'You', xp: 6500, challengesCompleted: 16 }, // Current user
          { rank: 10, username: 'BytePusher', xp: 5400, challengesCompleted: 12 }
        ]);
      }, 150);
    });
  }

  // Get total users in current league
  getLeagueSize(userId: string, currentXP: number): Promise<number> {
    // In production, this would query the database
    // For now, return sample data
    const userLeague = this.determineLeague(currentXP);

    return new Promise((resolve) => {
      setTimeout(() => {
        switch (userLeague) {
          case 'bronze': resolve(2847); break;
          case 'silver': resolve(1253); break;
          case 'gold': resolve(487); break;
          case 'platinum': resolve(92); break;
          default: resolve(100);
        }
      }, 100);
    });
  }

  // Check if user can promote
  canPromoteToNextLeague(currentXP: number, currentLeague: string): boolean {
    const nextLeague = this.getNextLeague(currentLeague);
    return nextLeague !== null && currentXP >= nextLeague.minXP;
  }

  // Get league benefits
  getLeagueBenefits(league: string): LeagueBenefit[] {
    return this.LEAGUE_BENEFITS[league] || this.LEAGUE_BENEFITS.bronze;
  }

  // Get league percentage rank
  getLeagueRankPercentile(userRank: number, totalInLeague: number): number {
    if (totalInLeague === 0) return 0;
    return Math.round((1 - (userRank - 1) / totalInLeague) * 100);
  }

  // Calculate historical league progression
  async getLeagueProgression(userId: string): Promise<any[]> {
    // In production, this would query the database
    // For now, return sample data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            date: '2024-01-15',
            league: 'bronze',
            xp: 450,
            rank_in_league: 1203,
            total_in_league: 1450
          },
          {
            date: '2024-02-20',
            league: 'bronze',
            xp: 890,
            rank_in_league: 945,
            total_in_league: 1620
          },
          {
            date: '2024-03-28',
            league: 'silver',
            xp: 1580,
            rank_in_league: 892,
            total_in_league: 1780
          },
          {
            date: '2024-04-25',
            league: 'silver',
            xp: 3240,
            rank_in_league: 421,
            total_in_league: 1920
          }
        ]);
      }, 100);
    });
  }

  // Update weekly leaderboards (should be called by scheduled job)
  async updateWeeklyLeaderboards(): Promise<void> {
    // In production, this would recalculate and update weekly rankings
    console.log('Updating weekly leaderboards...');

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  // Check for league promotion and trigger celebration
  async checkLeaguePromotion(userId: string, oldXP: number, newXP: number): Promise<boolean> {
    const oldLeague = this.determineLeague(oldXP);
    const newLeague = this.determineLeague(newXP);
    const promoted = oldLeague !== newLeague && this.canPromoteToNextLeague(newXP, oldLeague);

    if (promoted) {
      // Trigger celebration and notification
      console.log(`User promoted from ${oldLeague} to ${newLeague}!`);

      // In production, this would also:
      // - Send notification
      // - Award bonus XP
      // - Update database
      // - Trigger celebration animation
    }

    return promoted;
  }

  // Get league statistics
  async getLeagueStatistics(): Promise<any> {
    // In production, this would aggregate data across all users
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          total_users: 4892,
          bronze_users: 2847,
          silver_users: 1253,
          gold_users: 487,
          platinum_users: 92,
          average_xp: 3420,
          most_active_league: 'silver',
          promotions_this_week: 156,
          retention_rate: 0.73
        });
      }, 100);
    });
  }
}

export const leagueService = new LeagueService();
export type { LeagueInfo, UserRanking, LeagueBenefit };