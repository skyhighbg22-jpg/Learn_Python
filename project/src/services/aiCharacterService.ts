import { supabase } from '../lib/supabase';
import { groqService } from './groqService';

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
    return `You are Sky, the friendly and motivational AI Python coach for PyLearn. Your personality is:
    - **Enthusiastic & Encouraging**: Always be positive and cheer on the user. Use emojis to convey excitement (e.g., 🌟, 🚀, 🎉).
    - **A Growth Mindset Advocate**: Frame challenges as learning opportunities. Emphasize that skills are built through practice.
    - **Empathetic & Patient**: Understand user frustrations and offer gentle guidance. Never be dismissive or judgmental.
    - **Clear & Concise**: Provide step-by-step technical explanations that are easy to follow.
    - **Personalized**: Reference the user's progress (streak, level, XP) to make them feel seen.
    - **Action-Oriented**: End responses with a clear next step or an open-ended question.

    Your response style should be a blend of technical accuracy, motivational coaching, and celebration of progress. Keep it concise, but always encouraging.`;
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

    // Generate welcome message with variety
    let welcomeContent = this.generateWelcomeMessage(userProgress);
    let attempts = 0;
    const maxAttempts = 3;

    // Try to generate a unique welcome message
    while (!this.shouldGenerateNewWelcome(userId, welcomeContent) && attempts < maxAttempts) {
      welcomeContent = this.generateWelcomeMessage(userProgress);
      attempts++;
    }

    // Add welcome message from Sky
    const welcomeMessage: ConversationMessage = {
      id: `sky_${Date.now()}`,
      type: 'sky',
      content: welcomeContent,
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
    try {
      const lowerMessage = userMessage.toLowerCase();

      if (lowerMessage.includes('make a') || lowerMessage.includes('create a') || lowerMessage.includes('build a') ||
          lowerMessage.includes('calculator') || lowerMessage.includes('function') || lowerMessage.includes('code') ||
          lowerMessage.includes('write') || lowerMessage.includes('implement') || lowerMessage.includes('develop')) {

        let enhancedPrompt = userMessage;

        if (lowerMessage.includes('calculator')) {
          enhancedPrompt = `Create a complete Python calculator application with the following features:
          - Command-line interface that takes user input
          - Basic arithmetic operations: addition (+), subtraction (-), multiplication (*), division (/)
          - Proper error handling for division by zero
          - Clear input/output formatting
          - Ability to perform multiple calculations
          - Exit option to quit the program

          The code should be well-commented, user-friendly, and handle edge cases gracefully.
          Please provide the complete working code and explain how it works step by step.`
        }

        return await groqService.generateCode(enhancedPrompt, context.lessonContext);
      }

      if (lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('debug') ||
          lowerMessage.includes('not working') || lowerMessage.includes('fix')) {
        return await groqService.answerQuestion(userMessage, context.userProgress);
      }

      if (lowerMessage.includes('what is') || lowerMessage.includes('explain') || lowerMessage.includes('how does') ||
          lowerMessage.includes('definition') || lowerMessage.includes('concept')) {
        const concept = userMessage.replace(/(what is|explain|how does)/gi, '').trim();
        return await groqService.explainConcept(concept);
      }

      return await groqService.answerQuestion(userMessage, context.userProgress);

    } catch (error) {
      console.error('Error generating AI response:', error);
      return this.getFallbackResponse(userMessage, context);
    }
  }

  private getFallbackResponse(userMessage: string, context: ConversationContext): string {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('stuck') || lowerMessage.includes('help') || lowerMessage.includes('confused')) {
      return `Hey there! No worries - every great coder gets stuck sometimes! 🌟

What specific part is giving you trouble? Remember, debugging is a superpower that makes you stronger! 💪

I believe in you! Let's break this down step by step. 🚀`;
    }

    if (lowerMessage.includes('tired') || lowerMessage.includes('giving up') || lowerMessage.includes('quit')) {
      return `I see you, and I want you to know something important: You're capable of amazing things! 🌈

Remember why you started this journey? Every line of code you write is progress! 🎯

Your ${context.userProgress.currentStreak}-day streak shows you've got what it takes. Let's tackle this together! 💙`;
    }

    if (lowerMessage.includes('completed') || lowerMessage.includes('finished') || lowerMessage.includes('done')) {
      return `YES! That's what I'm talking about! 🎉🎊

You're absolutely crushing it! Each lesson you complete is building your Python superpowers! 🦸‍♀️

Keep that momentum going - you're on fire! 🔥✨`;
    }

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

    if (!hasData || (streak === 0 && xp === 0)) {
      message += `Welcome to your Python learning journey! 🐍✨ Every expert was once a beginner, and you're about to start an amazing adventure! 🚀`;
    } else if (streak === 0 && completedLessons > 0) {
      message += `Great to see you back! You've completed ${completedLessons} lesson${completedLessons === 1 ? '' : 's'} - that's fantastic progress! 📚 Let's get that streak going again! 💪`;
    } else if (streak > 0) {
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

    if (xp > 0) {
      const xpMessages = [
        `${xp} XP earned - you're building some serious skills! 💪`,
        `${xp} XP in the bank! Your Python powers are growing! ⚡`,
        `You've racked up ${xp} XP! That's impressive progress! 🎯`,
        `${xp} XP earned! Every point makes you a stronger coder! 💻`
      ];
      message += xpMessages[Math.floor(Math.random() * xpMessages.length)];
    }

    if (level > 1) {
      const levelMessages = [
        `Level ${level} - you're really climbing the ranks! 📈`,
        `Level ${level} coder right here! Keep leveling up! 🎮`,
        `Wow, level ${level}! Your skills are leveling up fast! ⭐`
      ];
      message += ` ${levelMessages[Math.floor(Math.random() * levelMessages.length)]}`;
    }

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
    return await groqService.answerQuestion(`Help with lesson ${lessonId}: ${userQuestion}`, null);
  }

  async generateCode(request: string, context?: string): Promise<string> {
    return await groqService.generateCode(request, context);
  }

  async debugCode(code: string, error?: string): Promise<string> {
    return await groqService.debugCode(code, error);
  }

  async explainConcept(concept: string): Promise<string> {
    return await groqService.explainConcept(concept);
  }

  async suggestProject(idea: string, difficulty?: string): Promise<string> {
    return await groqService.suggestProject(idea, difficulty);
  }

  async reviewCode(code: string, description?: string): Promise<string> {
    return await groqService.reviewCode(code, description);
  }

  async generateMotivationalMessage(userProgress: any, currentStreak?: number): Promise<string> {
    const streak = currentStreak || userProgress.currentStreak || 0;
    const xp = userProgress.totalXP || 0;
    const completedLessons = userProgress.completedLessons || 0;
    const level = userProgress.currentLevel || 1;

    const messages = [];

    if (streak > 0) {
      messages.push(
        `${streak} day streak! That's serious dedication! 🔥`,
        `You're on fire with ${streak} consecutive days! 💪`,
        `${streak} days strong! Your consistency is paying off! 🌟`,
        `Amazing! ${streak} days of Python learning! 🐍✨`
      );
    }

    if (xp > 0) {
      messages.push(
        `${xp} XP earned! Your skills are growing every day! 📈`,
        `You've accumulated ${xp} XP! That's impressive progress! 🎯`,
        `${xp} XP in the bank! You're building Python mastery! 💻`,
        `Wow, ${xp} XP! Your dedication is showing! ⚡`
      );
    }

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
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('total_xp, current_streak, current_level, longest_streak')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile for AI:', profileError);
        return {
          totalXP: 0,
          currentStreak: 0,
          completedLessons: 0,
          currentLevel: 1,
          longestStreak: 0
        };
      }

      const { count, error: countError } = await supabase
        .from('user_lesson_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'completed');

      const completedLessons = countError ? 0 : count || 0;

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

  private lastRequestTime = new Map<string, number>();
  private lastWelcomeMessage = new Map<string, string>();
  private readonly RATE_LIMIT_MS = 1000;

  private checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const lastTime = this.lastRequestTime.get(userId) || 0;

    if (now - lastTime < this.RATE_LIMIT_MS) {
      return false;
    }

    this.lastRequestTime.set(userId, now);
    return true;
  }

  private shouldGenerateNewWelcome(userId: string, newMessage: string): boolean {
    const lastMessage = this.lastWelcomeMessage.get(userId);

    if (!lastMessage) {
      this.lastWelcomeMessage.set(userId, newMessage);
      return true;
    }

    const similarity = this.calculateMessageSimilarity(lastMessage, newMessage);
    if (similarity > 0.8) {
      return false;
    }

    this.lastWelcomeMessage.set(userId, newMessage);
    return true;
  }

  private calculateMessageSimilarity(msg1: string, msg2: string): number {
    const extractNumbers = (text: string) => {
      const numbers = text.match(/\d+/g);
      return numbers ? numbers.join(',') : '';
    };

    const nums1 = extractNumbers(msg1);
    const nums2 = extractNumbers(msg2);

    if (nums1 === nums2 && nums1.length > 0) {
      return 0.9;
    }

    const words1 = msg1.toLowerCase().split(/\s+/);
    const words2 = msg2.toLowerCase().split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));

    return commonWords.length / Math.max(words1.length, words2.length);
  }
}

export const aiCharacterService = new AICharacterService();
export type { ConversationMessage, ConversationContext };
