interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xp_reward: number;
  estimated_minutes: number;
  challenge_type: 'code' | 'quiz' | 'puzzle';
  content: any;
  created_at: string;
}

interface WeeklyRotation {
  week_start: Date;
  challenges: DailyChallenge[];
}

interface UserStreakData {
  current_streak: number;
  longest_streak: number;
  last_completed_date: string;
  weekly_bonus: number;
}

class DailyChallengeService {
  private readonly XP_REWARDS = {
    easy: 30,
    medium: 50,
    hard: 70
  };

  private readonly TIME_ESTIMATES = {
    easy: 5,
    medium: 10,
    hard: 15
  };

  private readonly STREAK_BONUS = 100; // Bonus for 7-day streak

  async getTodayChallenges(): Promise<DailyChallenge[]> {
    try {
      // In production, this would fetch from database
      // For now, return sample challenges
      const today = new Date();
      const dayOfWeek = today.getDay();

      // Add cache busting to prevent stale data
      const cacheBuster = Date.now();
      console.log(`Loading challenges for day ${dayOfWeek} (cache: ${cacheBuster})`);

      // Generate challenges based on day of week for variety
      const challenges = this.generateChallengesForDay(dayOfWeek);

      if (!challenges || challenges.length === 0) {
        throw new Error('No challenges available for today');
      }

      return challenges;
    } catch (error) {
      console.error('Error loading today\'s challenges:', error);
      throw new Error(`Failed to load challenges: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private generateChallengesForDay(dayOfWeek: number): DailyChallenge[] {
    const challengeTemplates = [
      {
        title: "Variable Master",
        description: "Create variables and print your name and age",
        difficulty: 'easy' as const,
        challenge_type: 'code' as const,
        content: {
          starter_code: '# Create variables for name and age\n# Then print both\n',
          hints: [
            'Use assignment operator (=) to create variables',
            'name = "Your Name" and age = 25',
            'print(name) and print(age)'
          ],
          expected_output: 'Your Name\n25'
        }
      },
      {
        title: "Calculator Challenge",
        description: "Create a simple calculator that adds two numbers",
        difficulty: 'medium' as const,
        challenge_type: 'code' as const,
        content: {
          starter_code: '# Create a function that adds two numbers\n',
          hints: [
            'Define a function with def add_numbers(a, b)',
            'Return the sum using return a + b',
            'Test with: result = add_numbers(5, 3)'
          ],
          expected_output: '8'
        }
      },
      {
        title: "Loop Master",
        description: "Use a for loop to print numbers 1-10",
        difficulty: 'hard' as const,
        challenge_type: 'code' as const,
        content: {
          starter_code: '# Use a for loop to print numbers 1 through 10\n',
          hints: [
            'Use for i in range(1, 11):',
            'Remember range(1, 11) includes 1-10',
            'Print each number inside the loop'
          ],
          expected_output: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10'
        }
      }
    ];

    // Rotate challenges based on day
    const easyChallenge = {
      ...challengeTemplates[0],
      id: `easy_${dayOfWeek}`,
      xp_reward: this.XP_REWARDS.easy,
      estimated_minutes: this.TIME_ESTIMATES.easy,
      created_at: new Date().toISOString()
    };

    const mediumChallenge = {
      ...challengeTemplates[1],
      id: `medium_${dayOfWeek}`,
      xp_reward: this.XP_REWARDS.medium,
      estimated_minutes: this.TIME_ESTIMATES.medium,
      created_at: new Date().toISOString()
    };

    const hardChallenge = {
      ...challengeTemplates[2],
      id: `hard_${dayOfWeek}`,
      xp_reward: this.XP_REWARDS.hard,
      estimated_minutes: this.TIME_ESTIMATES.hard,
      created_at: new Date().toISOString()
    };

    return [easyChallenge, mediumChallenge, hardChallenge];
  }

  async updateWeeklyRotation(): Promise<WeeklyRotation> {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1); // Get to Monday

    // Generate 7 challenges for the week
    const weeklyChallenges: DailyChallenge[] = [];
    for (let i = 0; i < 7; i++) {
      const dayChallenges = this.generateChallengesForDay(i);
      weeklyChallenges.push(...dayChallenges);
    }

    return {
      week_start: monday,
      challenges: weeklyChallenges
    };
  }

  async calculateStreakBonus(userId: string): Promise<number> {
    // In production, fetch from database
    // For now, simulate streak calculation
    const streakData = await this.getUserStreakData(userId);

    if (streakData.current_streak >= 7) {
      return this.STREAK_BONUS;
    }

    return 0;
  }

  async getUserStreakData(userId: string): Promise<UserStreakData> {
    // In production, fetch from database
    // For now, return sample data
    return {
      current_streak: 3,
      longest_streak: 12,
      last_completed_date: new Date().toISOString(),
      weekly_bonus: 0
    };
  }

  generateChallenge(
    difficulty: 'easy' | 'medium' | 'hard',
    topic: string
  ): DailyChallenge {
    const challengeTemplates = {
      easy: [
        {
          title: `${topic} Basics`,
          description: `Practice fundamental ${topic.toLowerCase()} concepts`,
          content: { starter_code: `# ${topic} practice\n` }
        }
      ],
      medium: [
        {
          title: `${topic} Practice`,
          description: `Apply ${topic.toLowerCase()} in a practical scenario`,
          content: { starter_code: `# ${topic} application\n` }
        }
      ],
      hard: [
        {
          title: `${topic} Mastery`,
          description: `Advanced ${topic.toLowerCase()} problem solving`,
          content: { starter_code: `# ${topic} challenge\n` }
        }
      ]
    };

    const template = challengeTemplates[difficulty][0];

    return {
      id: `${difficulty}_${topic}_${Date.now()}`,
      title: template.title,
      description: template.description,
      difficulty,
      xp_reward: this.XP_REWARDS[difficulty],
      estimated_minutes: this.TIME_ESTIMATES[difficulty],
      challenge_type: 'code',
      content: template.content,
      created_at: new Date().toISOString()
    };
  }

  async trackChallengeCompletion(
    userId: string,
    challengeId: string,
    score: number,
    timeSpentMinutes: number,
    hintsUsed: number = 0
  ): Promise<void> {
    // In production, save to database
    console.log('Tracking challenge completion:', {
      userId,
      challengeId,
      score,
      timeSpentMinutes,
      hintsUsed
    });

    // Check for streak bonus
    const streakBonus = await this.calculateStreakBonus(userId);
    if (streakBonus > 0) {
      console.log(`Awarding streak bonus: ${streakBonus} XP`);
    }
  }

  getDifficultyColor(difficulty: string): string {
    const colors = {
      easy: 'text-green-400 bg-green-400 bg-opacity-20 border-green-400 border-opacity-30',
      medium: 'text-yellow-400 bg-yellow-400 bg-opacity-20 border-yellow-400 border-opacity-30',
      hard: 'text-red-400 bg-red-400 bg-opacity-20 border-red-400 border-opacity-30'
    };
    return colors[difficulty as keyof typeof colors] || colors.easy;
  }

  getDifficultyLabel(difficulty: string): string {
    const labels = {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard'
    };
    return labels[difficulty as keyof typeof labels] || 'Easy';
  }

  getTimeEstimateText(minutes: number): string {
    if (minutes < 10) {
      return `${minutes} min`;
    }
    return `${minutes} mins`;
  }

  async getChallengeHistory(userId: string): Promise<any[]> {
    // In production, fetch from database
    // Return sample data for now
    return [
      {
        challenge_id: 'easy_1',
        completed_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        score: 100,
        time_spent_minutes: 6,
        hints_used: 1,
        xp_earned: 30
      },
      {
        challenge_id: 'medium_1',
        completed_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        score: 85,
        time_spent_minutes: 12,
        hints_used: 2,
        xp_earned: 35 // Reduced due to hints
      }
    ];
  }

  async getWeeklyLeaderboard(): Promise<any[]> {
    // In production, fetch from database
    return [
      { rank: 1, username: "CodeMaster", score: 2850, challenges_completed: 21 },
      { rank: 2, username: "PythonNinja", score: 2650, challenges_completed: 19 },
      { rank: 3, username: "SyntaxHero", score: 2400, challenges_completed: 18 },
      { rank: 4, username: "You", score: 2100, challenges_completed: 16, is_current_user: true }
    ];
  }

  calculatePerformanceScore(
    timeSpentMinutes: number,
    estimatedMinutes: number,
    hintsUsed: number,
    maxHints: number = 3
  ): number {
    const timeScore = Math.max(0, 100 - ((timeSpentMinutes - estimatedMinutes) / estimatedMinutes) * 50);
    const hintScore = Math.max(0, 100 - (hintsUsed / maxHints) * 30);

    return Math.round((timeScore + hintScore) / 2);
  }
}

export const dailyChallengeService = new DailyChallengeService();
export type { DailyChallenge, WeeklyRotation, UserStreakData };