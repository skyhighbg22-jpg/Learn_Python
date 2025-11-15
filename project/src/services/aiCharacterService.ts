import { supabase } from '../lib/supabase';

interface ConversationMessage {
  id: string;
  type: 'user' | 'sky';
  content: string;
  timestamp: Date;
  lessonContext?: string;
}

interface ConversationContext {
  userId: string;
  conversationId: string;
  messages: ConversationMessage[];
  lessonContext?: string;
  userProgress: {
    totalXP: number;
    currentStreak: number;
    completedLessons: number;
    currentLevel: number;
  };
}

class AICharacterService {
  private conversations = new Map<string, ConversationContext>();

  private getPersonalityPrompt(): string {
    return `You are Sky, the motivational AI Python coach for PyLearn. Your personality:
- Enthusiastic and encouraging, like a cheerleader for coding
- Celebrates small wins and milestones
- Uses positive language and emojis appropriately
- Focuses on progress and growth mindset
- Provides clear, step-by-step technical help
- Reminds users of their achievements and goals
- Never gives up on students, always offers alternative approaches

Response style: Technical accuracy + motivational coaching + celebration of progress
Keep responses concise but encouraging. Use emojis naturally but not excessively.`;
  }

  generateConversationId(userId: string): string {
    return `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async initializeConversation(userId: string, lessonContext?: string): Promise<ConversationContext> {
    const conversationId = this.generateConversationId(userId);
    const userProgress = await this.getUserProgress(userId);

    const context: ConversationContext = {
      userId,
      conversationId,
      messages: [],
      lessonContext,
      userProgress
    };

    this.conversations.set(conversationId, context);

    // Add welcome message from Sky
    const welcomeMessage: ConversationMessage = {
      id: `sky_${Date.now()}`,
      type: 'sky',
      content: this.generateWelcomeMessage(userProgress),
      timestamp: new Date(),
      lessonContext
    };

    context.messages.push(welcomeMessage);
    return context;
  }

  async sendMessage(
    conversationId: string,
    message: string
  ): Promise<ConversationMessage> {
    const context = this.conversations.get(conversationId);
    if (!context) {
      throw new Error('Conversation not found');
    }

    // Add user message
    const userMessage: ConversationMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: message,
      timestamp: new Date(),
      lessonContext: context.lessonContext
    };

    context.messages.push(userMessage);

    // Generate Sky's response
    const skyResponse = await this.generateSkyResponse(message, context);
    const skyMessage: ConversationMessage = {
      id: `sky_${Date.now()}`,
      type: 'sky',
      content: skyResponse,
      timestamp: new Date(),
      lessonContext: context.lessonContext
    };

    context.messages.push(skyMessage);

    // Keep only last 10 messages to manage memory
    if (context.messages.length > 10) {
      context.messages = context.messages.slice(-10);
    }

    return skyMessage;
  }

  private async generateSkyResponse(
    userMessage: string,
    context: ConversationContext
  ): Promise<string> {
    // For now, use rule-based responses
    // In production, this would call OpenAI/ChatGPT API

    const lowerMessage = userMessage.toLowerCase();

    // Help with coding questions
    if (lowerMessage.includes('stuck') || lowerMessage.includes('help') || lowerMessage.includes('confused')) {
      return `Hey there! No worries - every great coder gets stuck sometimes! 🌟

What specific part is giving you trouble? Remember, debugging is a superpower that makes you stronger! 💪

I believe in you! Let's break this down step by step. 🚀`;
    }

    // Encourage motivation
    if (lowerMessage.includes('tired') || lowerMessage.includes('giving up') || lowerMessage.includes('quit')) {
      return `I see you, and I want you to know something important: You're capable of amazing things! 🌈

Remember why you started this journey? Every line of code you write is progress! 🎯

Your ${context.userProgress.currentStreak}-day streak shows you've got what it takes. Let's tackle this together! 💙`;
    }

    // Celebrate progress
    if (lowerMessage.includes('completed') || lowerMessage.includes('finished') || lowerMessage.includes('done')) {
      return `YES! That's what I'm talking about! 🎉🎊

You're absolutely crushing it! Each lesson you complete is building your Python superpowers! 🦸‍♀️

Keep that momentum going - you're on fire! 🔥✨`;
    }

    // Lesson-specific help
    if (context.lessonContext) {
      if (lowerMessage.includes('variable')) {
        return `Variables are like containers for your data! Think of them as labeled boxes where you store information. 📦

For example: \`name = "Sky"\` creates a box called "name" and puts "Sky" inside it!

What would you like to store in a variable? 😊`;
      }

      if (lowerMessage.includes('print')) {
        return `The print() function is your best friend for seeing what's happening! 🖨️

It's like shouting your results to the world: \`print("Hello World!")\` shows "Hello World!" on screen.

Try printing your name - I bet it'll look great! ✨`;
      }
    }

    // Default encouraging response
    return `Hey there! I'm here to help you on your Python journey! 🐍✨

Whether you're stuck on a concept, need motivation, or want to celebrate a win - I've got your back!

What can I help you with today? Remember, every expert was once a beginner! 🌟`;
  }

  private generateWelcomeMessage(userProgress: any): string {
    const streak = userProgress.currentStreak || 0;
    const xp = userProgress.totalXP || 0;
    const level = userProgress.currentLevel || 1;
    const completedLessons = userProgress.completedLessons || 0;
    const longestStreak = userProgress.longestStreak || 0;
    const hasData = userProgress.hasData || false;

    let message = `Hey there! I'm Sky, your personal Python coach! 🌟\n\n`;

    // Different welcome messages based on user's actual progress
    if (!hasData || (streak === 0 && xp === 0)) {
      // New user welcome
      message += `Welcome to your Python learning journey! 🐍✨ Every expert was once a beginner, and you're about to start an amazing adventure! 🚀`;
    } else if (streak === 0 && completedLessons > 0) {
      // User with some lessons but no current streak
      message += `Great to see you back! You've completed ${completedLessons} lesson${completedLessons === 1 ? '' : 's'} - that's fantastic progress! 📚 Let's get that streak going again! 💪`;
    } else if (streak > 0) {
      // User with active streak
      const streakMessages = [
        `Wow - ${streak} day streak! You're absolutely on fire! 🔥`,
        `${streak} day streak! That's what I call dedication! 💙`,
        `Amazing work! ${streak} days strong and counting! 🌟`,
        `You're building serious momentum with a ${streak} day streak! 🚀`
      ];
      message += streakMessages[Math.floor(Math.random() * streakMessages.length)] + ' ';

      if (streak === longestStreak && streak > 1) {
        message += `That's your best streak ever! 🏆 `;
      }
    }

    // XP messages with variety
    if (xp > 0) {
      const xpMessages = [
        `${xp} XP earned - you're building some serious skills! 💪`,
        `${xp} XP in the bank! Your Python powers are growing! ⚡`,
        `You've racked up ${xp} XP! That's impressive progress! 🎯`,
        `${xp} XP earned! Every point makes you a stronger coder! 💻`
      ];
      message += xpMessages[Math.floor(Math.random() * xpMessages.length)];
    }

    // Level-specific encouragement
    if (level > 1) {
      const levelMessages = [
        `Level ${level} - you're really climbing the ranks! 📈`,
        `Level ${level} coder right here! Keep leveling up! 🎮`,
        `Wow, level ${level}! Your skills are leveling up fast! ⭐`
      ];
      message += ` ${levelMessages[Math.floor(Math.random() * levelMessages.length)]}`;
    }

    // Achievement recognition
    if (userProgress.recentAchievements && userProgress.recentAchievements.length > 0) {
      message += ` \n\n🏆 Recent achievements unlocked! You're on a roll!`;
    }

    message += `\n\nI'm here to help with coding questions, keep you motivated, and celebrate your wins! What can I help you with today? 🚀`;

    return message;
  }

  async getConversation(conversationId: string): Promise<ConversationContext | null> {
    return this.conversations.get(conversationId) || null;
  }

  async getContextualHelp(lessonId: string, userQuestion: string): Promise<string> {
    // This would integrate with lesson data to provide context-specific help
    return `Great question about this lesson! Let me help you understand this concept better... 🎯`;
  }

  async generateMotivationalMessage(userProgress: any, currentStreak?: number): Promise<string> {
    const streak = currentStreak || userProgress.currentStreak || 0;
    const xp = userProgress.totalXP || 0;
    const completedLessons = userProgress.completedLessons || 0;
    const level = userProgress.currentLevel || 1;

    const messages = [];

    // Streak-based messages
    if (streak > 0) {
      messages.push(
        `${streak} day streak! That's serious dedication! 🔥`,
        `You're on fire with ${streak} consecutive days! 💪`,
        `${streak} days strong! Your consistency is paying off! 🌟`,
        `Amazing! ${streak} days of Python learning! 🐍✨`
      );
    }

    // XP-based messages
    if (xp > 0) {
      messages.push(
        `${xp} XP earned! Your skills are growing every day! 📈`,
        `You've accumulated ${xp} XP! That's impressive progress! 🎯`,
        `${xp} XP in the bank! You're building Python mastery! 💻`,
        `Wow, ${xp} XP! Your dedication is showing! ⚡`
      );
    }

    // General progress messages
    messages.push(
      `Every lesson completed makes you a better coder! 🌟`,
      `Your progress is incredible! Keep it up! 🚀`,
      `You're building Python skills that will last a lifetime! 🐍✨`,
      `Level ${level} and climbing! You're doing amazing! 🏆`,
      `${completedLessons} lesson${completedLessons === 1 ? '' : 's'} completed! That's fantastic! 📚`,
      `Consistency is key, and you're proving it! 💙`,
      `Your Python journey is inspiring! Keep going! 🌈`
    );

    return messages[Math.floor(Math.random() * messages.length)];
  }

  private async getUserProgress(userId: string): Promise<any> {
    try {
      // Fetch actual user profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('total_xp, current_streak, current_level, longest_streak')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile for AI:', profileError);
        // Return default values if profile fetch fails
        return {
          totalXP: 0,
          currentStreak: 0,
          completedLessons: 0,
          currentLevel: 1,
          longestStreak: 0
        };
      }

      // Fetch completed lessons count
      const { count, error: countError } = await supabase
        .from('user_lesson_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'completed');

      const completedLessons = countError ? 0 : count || 0;

      // Fetch recent achievements for contextual messages
      const { data: achievements, error: achievementError } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false })
        .limit(5);

      const recentAchievements = achievementError ? [] : achievements || [];

      return {
        totalXP: profile.total_xp || 0,
        currentStreak: profile.current_streak || 0,
        completedLessons,
        currentLevel: profile.current_level || 1,
        longestStreak: profile.longest_streak || 0,
        recentAchievements,
        hasData: true
      };

    } catch (error) {
      console.error('Error in getUserProgress:', error);
      // Return safe defaults
      return {
        totalXP: 0,
        currentStreak: 0,
        completedLessons: 0,
        currentLevel: 1,
        longestStreak: 0,
        recentAchievements: [],
        hasData: false
      };
    }
  }

  // Rate limiting and message variety helpers
  private lastRequestTime = new Map<string, number>();
  private lastWelcomeMessage = new Map<string, string>();
  private readonly RATE_LIMIT_MS = 1000; // 1 second between requests

  private checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const lastTime = this.lastRequestTime.get(userId) || 0;

    if (now - lastTime < this.RATE_LIMIT_MS) {
      return false; // Rate limited
    }

    this.lastRequestTime.set(userId, now);
    return true;
  }

  private shouldGenerateNewWelcome(userId: string, newMessage: string): boolean {
    const lastMessage = this.lastWelcomeMessage.get(userId);

    // If no previous message, definitely generate new one
    if (!lastMessage) {
      this.lastWelcomeMessage.set(userId, newMessage);
      return true;
    }

    // If the message is too similar to the last one, generate a new one
    const similarity = this.calculateMessageSimilarity(lastMessage, newMessage);
    if (similarity > 0.8) {
      // Messages are too similar, return false to trigger regeneration
      return false;
    }

    // Store the new message and allow it
    this.lastWelcomeMessage.set(userId, newMessage);
    return true;
  }

  private calculateMessageSimilarity(msg1: string, msg2: string): number {
    // Simple similarity check - compare key metrics
    const extractNumbers = (text: string) => {
      const numbers = text.match(/\d+/g);
      return numbers ? numbers.join(',') : '';
    };

    const nums1 = extractNumbers(msg1);
    const nums2 = extractNumbers(msg2);

    // If both messages have the same numbers (streak, XP, level), they're likely very similar
    if (nums1 === nums2 && nums1.length > 0) {
      return 0.9;
    }

    // Basic text similarity
    const words1 = msg1.toLowerCase().split(/\s+/);
    const words2 = msg2.toLowerCase().split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));

    return commonWords.length / Math.max(words1.length, words2.length);
  }
}

export const aiCharacterService = new AICharacterService();
export type { ConversationMessage, ConversationContext };