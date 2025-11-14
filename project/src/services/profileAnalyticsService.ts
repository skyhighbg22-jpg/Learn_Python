interface SkillData {
  name: string;
  icon: string;
  progress: number;
  xp: number;
  totalXP: number;
  color: string;
}

interface ActivityData {
  date: string;
  minutesSpent: number;
  lessonsCompleted: number;
  challengesCompleted: number;
}

interface LearningPathData {
  name: string;
  totalLessons: number;
  completedLessons: number;
  estimatedMinutes: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  icon: string;
  color: string;
}

class ProfileAnalyticsService {
  // Calculate skill progress based on completed lessons
  async calculateSkillProgress(userId: string): Promise<SkillData[]> {
    // In production, this would query the database
    // For now, return sample data

    const skills: SkillData[] = [
      {
        name: 'Python Basics',
        icon: '🐍',
        progress: 85,
        xp: 340,
        totalXP: 400,
        color: 'text-green-400'
      },
      {
        name: 'Variables & Data Types',
        icon: '📦',
        progress: 72,
        xp: 288,
        totalXP: 400,
        color: 'text-blue-400'
      },
      {
        name: 'Control Flow',
        icon: '🔀',
        progress: 60,
        xp: 240,
        totalXP: 400,
        color: 'text-purple-400'
      },
      {
        name: 'Functions',
        icon: '⚡',
        progress: 45,
        xp: 180,
        totalXP: 400,
        color: 'text-yellow-400'
      },
      {
        name: 'Data Structures',
        icon: '🏗️',
        progress: 30,
        xp: 120,
        totalXP: 400,
        color: 'text-orange-400'
      },
      {
        name: 'File Handling',
        icon: '📁',
        progress: 15,
        xp: 60,
        totalXP: 400,
        color: 'text-red-400'
      },
      {
        name: 'Error Handling',
        icon: '🛡️',
        progress: 25,
        xp: 100,
        totalXP: 400,
        color: 'text-indigo-400'
      },
      {
        name: 'Object-Oriented Programming',
        icon: '🎯',
        progress: 10,
        xp: 40,
        totalXP: 400,
        color: 'text-pink-400'
      }
    ];

    return skills;
  }

  // Generate activity heatmap data
  async generateActivityHeatmap(userId: string): Promise<ActivityData[]> {
    // In production, query user activity data
    // For now, return sample data for the last 30 days
    const activities: ActivityData[] = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Generate realistic activity pattern (more activity on weekdays, less on weekends)
      const dayOfWeek = date.getDay();
      const baseMinutes = dayOfWeek === 0 || dayOfWeek === 6 ? 15 : 45; // Less on weekends
      const randomVariation = Math.random() * 30 - 15; // ±15 minutes variation
      const minutesSpent = Math.max(0, baseMinutes + randomVariation);

      activities.push({
        date: date.toISOString().split('T')[0],
        minutesSpent,
        lessonsCompleted: minutesSpent > 20 ? Math.floor(Math.random() * 3) + 1 : 0,
        challengesCompleted: minutesSpent > 30 ? Math.floor(Math.random() * 2) : 0
      });
    }

    return activities;
  }

  // Calculate learning path progress
  async calculateLearningPaths(userId: string): Promise<LearningPathData[]> {
    // In production, query user progress through different learning paths
    const paths: LearningPathData[] = [
      {
        name: 'Python Fundamentals',
        totalLessons: 25,
        completedLessons: 20,
        estimatedMinutes: 480, // 8 hours
        difficulty: 'BEGINNER',
        icon: '📚',
        color: 'from-green-500 to-emerald-500'
      },
      {
        name: 'Control Flow Basics',
        totalLessons: 20,
        completedLessons: 12,
        estimatedMinutes: 600, // 10 hours
        difficulty: 'BEGINNER',
        icon: '🔀',
        color: 'from-blue-500 to-cyan-500'
      },
      {
        name: 'Data Structures',
        totalLessons: 30,
        completedLessons: 8,
        estimatedMinutes: 900, // 15 hours
        difficulty: 'INTERMEDIATE',
        icon: '🏗️',
        color: 'from-purple-500 to-pink-500'
      },
      {
        name: 'Advanced Python',
        totalLessons: 35,
        completedLessons: 3,
        estimatedMinutes: 1200, // 20 hours
        difficulty: 'ADVANCED',
        icon: '🚀',
        color: 'from-orange-500 to-red-500'
      }
    ];

    return paths;
  }

  // Generate social sharing data
  async generateSocialShareData(userId: string): Promise<any> {
    // In production, get user's actual achievements
    return {
      linkedIn: {
        title: 'Just completed Python Fundamentals on PyLearn! 🐍',
        description: 'Mastered Python basics with 85% proficiency. Completed 20 lessons and earned 340 XP.',
        url: 'https://pylearn.com/profile/username'
      },
      twitter: {
        text: '🎉 Just hit Level 5 in Python! 🐍 Learned variables, functions, and control flow. #PythonLearning #CodingJourney @PyLearnApp',
        url: 'https://pylearn.com/profile/username'
      },
      facebook: {
        title: 'Python Learning Milestone!',
        description: 'Excited to share that I\'ve been learning Python with PyLearn and making great progress!',
        url: 'https://pylearn.com/profile/username'
      }
    };
  }

  // Calculate profile statistics
  async calculateProfileStats(userId: string): Promise<any> {
    // In production, aggregate from database
    return {
      totalXP: 850,
      currentLevel: 9,
      xpToNextLevel: 50,
      levelProgress: 94, // 850 % 100 = 50 XP to next level
      weeklyXP: 210,
      dailyAverage: 30, // minutes per day
      longestSession: 120, // minutes
      favoriteTopic: 'Variables & Data Types',
      improvementRate: 15, // percentage improvement over last week
      consistencyDays: 23, // days active in last 30
      currentStreak: 5,
      longestStreak: 12
    };
  }

  // Get achievement unlock tracking
  async getAchievementInsights(userId: string): Promise<any> {
    // In production, analyze achievement patterns
    return {
      totalAchievements: 24,
      unlockedAchievements: 18,
      rareAchievements: 3,
      epicAchievements: 1,
      legendaryAchievements: 0,
      recentUnlocks: [
        {
          name: 'Week Warrior',
          unlockedAt: new Date(Date.now() - 86400000).toISOString(),
          rarity: 'rare'
        },
        {
          name: 'Function Master',
          unlockedAt: new Date(Date.now() - 172800000).toISOString(),
          rarity: 'common'
        }
      ],
      nextMilestones: [
        {
          name: 'Python Expert',
          requirement: 'Complete 50 lessons',
          progress: 35,
          total: 50
        },
        {
          name: 'Speed Demon',
          requirement: 'Complete 10 challenges in under 5 minutes each',
          progress: 6,
          total: 10
        }
      ]
    };
  }

  // Generate personalized recommendations
  async generateRecommendations(userId: string): Promise<any[]> {
    // In production, use ML or rule-based system
    return [
      {
        type: 'lesson',
        title: 'Practice Loops and Conditionals',
        reason: 'You\'ve excelled at basics but struggled with control flow challenges',
        priority: 'high'
      },
      {
        type: 'challenge',
        title: 'Try Today\'s Medium Challenge',
        reason: 'Your problem-solving speed has improved 25% this week',
        priority: 'medium'
      },
      {
        type: 'review',
        title: 'Review Python Functions',
        reason: 'It\'s been 14 days since you last practiced functions',
        priority: 'low'
      }
    ];
  }

  // Helper method to get difficulty color
  getDifficultyColor(difficulty: string): string {
    const colors = {
      'BEGINNER': 'from-green-500 to-emerald-500',
      'INTERMEDIATE': 'from-blue-500 to-purple-500',
      'ADVANCED': 'from-orange-500 to-red-500'
    };
    return colors[difficulty as keyof typeof colors] || colors.BEGINNER;
  }

  // Helper method to format time
  formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }

  // Helper method to calculate progress percentage
  calculateProgress(completed: number, total: number): number {
    return Math.round((completed / total)) * 100);
  }
}

export const profileAnalyticsService = new ProfileAnalyticsService();
export type { SkillData, ActivityData, LearningPathData };