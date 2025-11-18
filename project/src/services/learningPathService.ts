import { supabase } from '../lib/supabase';

export interface LearningPathData {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  totalLessons: number;
  completedLessons: number;
  estimatedMinutes: number;
  averageTimePerLesson: number;
  progressPercentage: number;
  status: 'not_started' | 'in_progress' | 'completed';
  prerequisites: string[];
  skills: Array<{
    name: string;
    level: number;
  }>;
  isUnlocked: boolean;
  timeToComplete: string;
  xpReward: number;
  category: string;
}

export interface LearningPathRecommendation {
  pathId: string;
  reason: string;
  confidence: number;
  estimatedTime: string;
  difficulty: string;
}

export class LearningPathService {
  private instance: LearningPathService;

  constructor() {
    this.instance = this;
  }

  /**
   * Calculate learning paths for a user based on their progress
   */
  async calculateLearningPaths(userId: string): Promise<LearningPathData[]> {
    try {
      // Get user's profile and progress
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: userProgress } = await supabase
        .from('user_lesson_progress')
        .select(`
          *,
          lesson:lessons(
            id,
            title,
            section_id,
            section:sections(id, title, path, order_index, unlock_requirement_xp)
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'completed');

      // Get all sections for path calculation
      const { data: sections } = await supabase
        .from('sections')
        .select('*')
        .order('order_index');

      // Calculate learning paths based on completed sections and lessons
      const paths: LearningPathData[] = [];

      if (sections && profile) {
        // Path 1: Python Fundamentals (first 3 sections)
        const fundamentalSections = sections.slice(0, 3);
        const fundamentalProgress = this.calculatePathProgress(
          fundamentalSections,
          userProgress || []
        );

        paths.push({
          id: 'python-fundamentals',
          name: 'Python Fundamentals',
          description: 'Master the basics of Python programming from variables to functions',
          icon: '🐍',
          color: 'from-green-500 to-emerald-500',
          difficulty: 'BEGINNER',
          totalLessons: fundamentalSections.reduce((sum, section) => {
            return sum + (section.lesson_count || 5); // Estimate if not available
          }, 0),
          completedLessons: fundamentalProgress.completedLessons,
          estimatedMinutes: fundamentalSections.reduce((sum, section) => {
            return sum + (section.estimated_time || 160); // 8 sections * 20 min avg
          }, 0),
          averageTimePerLesson: 18,
          progressPercentage: fundamentalProgress.progressPercentage,
          status: fundamentalProgress.status,
          prerequisites: [],
          skills: [
            { name: 'Variables', level: 0 },
            { name: 'Data Types', level: 0 },
            { name: 'Control Flow', level: 0 }
          ],
          isUnlocked: true,
          timeToComplete: this.formatTime(fundamentalProgress.remainingTime),
          xpReward: 500,
          category: 'Core Skills'
        });

        // Path 2: Control Flow Mastery (next 2 sections)
        const controlFlowSections = sections.slice(3, 5);
        if (controlFlowSections.length > 0) {
          const controlFlowProgress = this.calculatePathProgress(
            controlFlowSections,
            userProgress || []
          );

          // Enhanced unlock logic: XP requirement + prerequisite completion
          const hasPrerequisites = fundamentalProgress.progressPercentage >= 80; // 80% of fundamentals
          const isUnlocked = profile.total_xp >= 200 && hasPrerequisites;

          // Debug logging for unlock logic
          console.log('Control Flow Unlock Check:', {
            userXP: profile.total_xp,
            xpRequired: 200,
            fundamentalProgress: fundamentalProgress.progressPercentage,
            hasPrerequisites,
            isUnlocked
          });

          paths.push({
            id: 'control-flow-mastery',
            name: 'Control Flow Mastery',
            description: 'Learn conditional statements, loops, and logical operators',
            icon: '🔀',
            color: 'from-blue-500 to-cyan-500',
            difficulty: 'BEGINNER',
            totalLessons: controlFlowSections.reduce((sum, section) => {
              return sum + (section.lesson_count || 4);
            }, 0),
            completedLessons: controlFlowProgress.completedLessons,
            estimatedMinutes: controlFlowSections.reduce((sum, section) => {
              return sum + (section.estimated_time || 120);
            }, 0),
            averageTimePerLesson: 20,
            progressPercentage: isUnlocked ? controlFlowProgress.progressPercentage : 0,
            status: isUnlocked ? controlFlowProgress.status : 'not_started',
            prerequisites: ['python-fundamentals'],
            skills: [
              { name: 'If Statements', level: 0 },
              { name: 'Loops', level: 0 },
              { name: 'Logical Operators', level: 0 }
            ],
            isUnlocked,
            timeToComplete: isUnlocked ?
              this.formatTime(controlFlowProgress.remainingTime) :
              this.formatTime(controlFlowSections.reduce((sum, section) => sum + (section.estimated_time || 120), 0)),
            xpReward: 600,
            category: 'Programming Logic'
          });
        }

        // Path 3: Data Structures (next sections)
        const dataStructuresSections = sections.slice(5, 7);
        if (dataStructuresSections.length > 0) {
          const dataStructuresProgress = this.calculatePathProgress(
            dataStructuresSections,
            userProgress || []
          );

          // Enhanced unlock logic: XP requirement + prerequisite completion
          const hasPrerequisites = controlFlowProgress.progressPercentage >= 80; // 80% of control flow
          const isUnlocked = profile.total_xp >= 800 && hasPrerequisites;

          // Debug logging for unlock logic
          console.log('Data Structures Unlock Check:', {
            userXP: profile.total_xp,
            xpRequired: 800,
            controlFlowProgress: controlFlowProgress.progressPercentage,
            hasPrerequisites,
            isUnlocked
          });

          paths.push({
            id: 'data-structures-algorithms',
            name: 'Data Structures & Algorithms',
            description: 'Master lists, dictionaries, sets, and essential algorithms',
            icon: '🏗️',
            color: 'from-purple-500 to-pink-500',
            difficulty: 'INTERMEDIATE',
            totalLessons: dataStructuresSections.reduce((sum, section) => {
              return sum + (section.lesson_count || 6);
            }, 0),
            completedLessons: dataStructuresProgress.completedLessons,
            estimatedMinutes: dataStructuresSections.reduce((sum, section) => {
              return sum + (section.estimated_time || 180);
            }, 0),
            averageTimePerLesson: 25,
            progressPercentage: isUnlocked ? dataStructuresProgress.progressPercentage : 0,
            status: isUnlocked ? dataStructuresProgress.status : 'not_started',
            prerequisites: ['control-flow-mastery'],
            skills: [
              { name: 'Lists', level: 0 },
              { name: 'Dictionaries', level: 0 },
              { name: 'Algorithms', level: 0 }
            ],
            isUnlocked,
            timeToComplete: isUnlocked ?
              this.formatTime(dataStructuresProgress.remainingTime) :
              this.formatTime(dataStructuresSections.reduce((sum, section) => sum + (section.estimated_time || 180), 0)),
            xpReward: 800,
            category: 'Advanced Topics'
          });
        }

        // Path 4: String Operations (specialized)
        const stringSections = sections.filter(section => section.path === 'string-operations');
        if (stringSections.length > 0) {
          const stringProgress = this.calculatePathProgress(
            stringSections,
            userProgress || []
          );

          // String operations unlock after fundamentals (60% progress)
          const hasPrerequisites = fundamentalProgress.progressPercentage >= 60;
          const isUnlocked = profile.total_xp >= 300 && hasPrerequisites;

          console.log('String Operations Unlock Check:', {
            userXP: profile.total_xp,
            xpRequired: 300,
            fundamentalProgress: fundamentalProgress.progressPercentage,
            hasPrerequisites,
            isUnlocked
          });

          paths.push({
            id: 'string-operations',
            name: 'String Operations',
            description: 'Master text manipulation, string methods, and text processing techniques',
            icon: '📝',
            color: 'from-indigo-500 to-purple-500',
            difficulty: 'INTERMEDIATE',
            totalLessons: stringSections.reduce((sum, section) => {
              return sum + (section.lesson_count || 10);
            }, 0),
            completedLessons: stringProgress.completedLessons,
            estimatedMinutes: stringSections.reduce((sum, section) => {
              return sum + (section.estimated_time || 200);
            }, 0),
            averageTimePerLesson: 20,
            progressPercentage: isUnlocked ? stringProgress.progressPercentage : 0,
            status: isUnlocked ? stringProgress.status : 'not_started',
            prerequisites: ['python-fundamentals'],
            skills: [
              { name: 'String Methods', level: 0 },
              { name: 'Text Processing', level: 0 },
              { name: 'Regular Expressions', level: 0 }
            ],
            isUnlocked,
            timeToComplete: isUnlocked ?
              this.formatTime(stringProgress.remainingTime) :
              this.formatTime(stringSections.reduce((sum, section) => sum + (section.estimated_time || 200), 0)),
            xpReward: 700,
            category: 'Specialized Skills'
          });
        }

        // Path 5: File Operations (specialized)
        const fileSections = sections.filter(section => section.path === 'file-operations');
        if (fileSections.length > 0) {
          const fileProgress = this.calculatePathProgress(
            fileSections,
            userProgress || []
          );

          // File operations unlock after fundamentals and control flow (70% combined progress)
          const combinedFundamentalProgress = (fundamentalProgress.progressPercentage + controlFlowProgress.progressPercentage) / 2;
          const hasPrerequisites = combinedFundamentalProgress >= 70;
          const isUnlocked = profile.total_xp >= 500 && hasPrerequisites;

          console.log('File Operations Unlock Check:', {
            userXP: profile.total_xp,
            xpRequired: 500,
            combinedFundamentalProgress,
            hasPrerequisites,
            isUnlocked
          });

          paths.push({
            id: 'file-operations',
            name: 'File Operations',
            description: 'Learn to read, write, and manage files and directories with Python',
            icon: '📁',
            color: 'from-teal-500 to-green-500',
            difficulty: 'INTERMEDIATE',
            totalLessons: fileSections.reduce((sum, section) => {
              return sum + (section.lesson_count || 10);
            }, 0),
            completedLessons: fileProgress.completedLessons,
            estimatedMinutes: fileSections.reduce((sum, section) => {
              return sum + (section.estimated_time || 220);
            }, 0),
            averageTimePerLesson: 22,
            progressPercentage: isUnlocked ? fileProgress.progressPercentage : 0,
            status: isUnlocked ? fileProgress.status : 'not_started',
            prerequisites: ['python-fundamentals', 'control-flow-mastery'],
            skills: [
              { name: 'File I/O', level: 0 },
              { name: 'Directory Management', level: 0 },
              { name: 'Error Handling', level: 0 }
            ],
            isUnlocked,
            timeToComplete: isUnlocked ?
              this.formatTime(fileProgress.remainingTime) :
              this.formatTime(fileSections.reduce((sum, section) => sum + (section.estimated_time || 220), 0)),
            xpReward: 800,
            category: 'Specialized Skills'
          });
        }

        // Path 6: Advanced Python
        const advancedSections = sections.filter(section =>
          !['python-basics', 'variables-data-types', 'control-flow', 'functions-modules',
            'lists-data-structures', 'loops-iteration', 'string-operations', 'file-operations'].includes(section.path)
        );
        if (advancedSections.length > 0) {
          const advancedProgress = this.calculatePathProgress(
            advancedSections,
            userProgress || []
          );

          // Enhanced unlock logic: XP requirement + prerequisite completion
          const hasPrerequisites = dataStructuresProgress.progressPercentage >= 80; // 80% of data structures
          const isUnlocked = profile.total_xp >= 1500 && hasPrerequisites;

          // Debug logging for unlock logic
          console.log('Advanced Python Unlock Check:', {
            userXP: profile.total_xp,
            xpRequired: 1500,
            dataStructuresProgress: dataStructuresProgress.progressPercentage,
            hasPrerequisites,
            isUnlocked
          });

          paths.push({
            id: 'advanced-python',
            name: 'Advanced Python',
            description: 'Advanced topics including OOP, decorators, and best practices',
            icon: '🚀',
            color: 'from-orange-500 to-red-500',
            difficulty: 'ADVANCED',
            totalLessons: advancedSections.reduce((sum, section) => {
              return sum + (section.lesson_count || 8);
            }, 0),
            completedLessons: advancedProgress.completedLessons,
            estimatedMinutes: advancedSections.reduce((sum, section) => {
              return sum + (section.estimated_time || 240);
            }, 0),
            averageTimePerLesson: 30,
            progressPercentage: isUnlocked ? advancedProgress.progressPercentage : 0,
            status: isUnlocked ? advancedProgress.status : 'not_started',
            prerequisites: ['data-structures-algorithms'],
            skills: [
              { name: 'Classes', level: 0 },
              { name: 'Decorators', level: 0 },
              { name: 'Advanced Patterns', level: 0 }
            ],
            isUnlocked,
            timeToComplete: isUnlocked ?
              this.formatTime(advancedProgress.remainingTime) :
              this.formatTime(advancedSections.reduce((sum, section) => sum + (section.estimated_time || 240), 0)),
            xpReward: 1200,
            category: 'Expert Level'
          });
        }
      }

      return paths;
    } catch (error) {
      console.error('Error calculating learning paths:', error);
      return [];
    }
  }

  /**
   * Get personalized learning path recommendations
   */
  async getRecommendations(userId: string): Promise<LearningPathRecommendation[]> {
    const paths = await this.calculateLearningPaths(userId);
    const recommendations: LearningPathRecommendation[] = [];

    paths.forEach(path => {
      if (path.isUnlocked && path.status !== 'completed') {
        let reason = '';
        let confidence = 0.5;

        if (path.status === 'not_started') {
          reason = `Ready to start ${path.name} - perfect next step in your Python journey!`;
          confidence = 0.9;
        } else if (path.status === 'in_progress') {
          const remainingPercentage = 100 - path.progressPercentage;
          reason = `Continue ${path.name} - only ${remainingPercentage}% left to complete!`;
          confidence = 0.95;
        }

        recommendations.push({
          pathId: path.id,
          reason,
          confidence,
          estimatedTime: path.timeToComplete,
          difficulty: path.difficulty
        });
      }
    });

    // Sort by confidence and difficulty
    return recommendations.sort((a, b) => {
      if (a.confidence !== b.confidence) {
        return b.confidence - a.confidence;
      }
      return a.difficulty.localeCompare(b.difficulty);
    });
  }

  /**
   * Calculate progress for a specific path
   */
  private calculatePathProgress(
    sections: any[],
    userProgress: any[]
  ): {
    completedLessons: number;
    totalLessons: number;
    progressPercentage: number;
    status: 'not_started' | 'in_progress' | 'completed';
    remainingTime: number;
  } {
    const sectionIds = sections.map(section => section.id);
    const pathProgress = userProgress.filter(progress =>
      sectionIds.includes(progress.lesson?.section_id)
    );

    const completedLessons = pathProgress.length;
    const totalLessons = sections.reduce((sum, section) => {
      return sum + (section.lesson_count || 5); // Default to 5 lessons per section
    }, 0);

    const progressPercentage = totalLessons > 0 ?
      Math.round((completedLessons / totalLessons) * 100) : 0;

    let status: 'not_started' | 'in_progress' | 'completed' = 'not_started';
    if (progressPercentage === 0) {
      status = 'not_started';
    } else if (progressPercentage === 100) {
      status = 'completed';
    } else {
      status = 'in_progress';
    }

    // Calculate remaining time based on average lesson time
    const averageTimePerLesson = 20; // minutes
    const remainingLessons = totalLessons - completedLessons;
    const remainingTime = remainingLessons * averageTimePerLesson;

    return {
      completedLessons,
      totalLessons,
      progressPercentage,
      status,
      remainingTime
    };
  }

  /**
   * Format time in human readable format
   */
  formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
  }

  /**
   * Get time-based recommendations
   */
  getTimeBasedRecommendation(paths: LearningPathData[], availableTimeMinutes: number): LearningPathData | null {
    // Find paths that can be completed within available time
    const suitablePaths = paths.filter(path =>
      path.isUnlocked &&
      path.status === 'in_progress' &&
      path.estimatedMinutes <= availableTimeMinutes
    );

    if (suitablePaths.length > 0) {
      // Return the path with highest progress
      return suitablePaths.reduce((prev, current) =>
        prev.progressPercentage > current.progressPercentage ? prev : current
      );
    }

    // If no in-progress paths fit, suggest a new one
    const newPaths = paths.filter(path =>
      path.isUnlocked &&
      path.status === 'not_started' &&
      path.estimatedMinutes <= availableTimeMinutes
    );

    return newPaths.length > 0 ? newPaths[0] : null;
  }

  /**
   * Calculate daily goal recommendations
   */
  async getDailyGoalRecommendation(userId: string): Promise<{
    recommendedMinutes: number;
    suggestedPaths: string[];
    achievableLessons: number;
    message: string;
  }> {
    const paths = await this.calculateLearningPaths(userId);
    const inProgressPaths = paths.filter(path => path.status === 'in_progress');

    // Base recommendation on current activity
    let recommendedMinutes = 30; // Default

    if (inProgressPaths.length > 0) {
      // User is active, recommend slightly more time
      recommendedMinutes = 45;
    }

    // Calculate achievable lessons in recommended time
    const averageTimePerLesson = 20;
    const achievableLessons = Math.floor(recommendedMinutes / averageTimePerLesson);

    // Suggest paths to focus on
    const suggestedPaths = inProgressPaths
      .slice(0, 2)
      .map(path => path.id);

    let message = '';
    if (inProgressPaths.length === 0) {
      message = `Start your Python journey with ${recommendedMinutes} minutes of learning today!`;
    } else {
      message = `Great progress! ${recommendedMinutes} minutes today will help you complete ${inProgressPaths.length} path${inProgressPaths.length > 1 ? 's' : ''}.`;
    }

    return {
      recommendedMinutes,
      suggestedPaths,
      achievableLessons,
      message
    };
  }
}

export const learningPathService = new LearningPathService();