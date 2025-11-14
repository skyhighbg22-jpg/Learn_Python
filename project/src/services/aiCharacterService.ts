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

    let message = `Hey there! I'm Sky, your personal Python coach! 🌟\n\n`;

    if (streak > 0) {
      message += `Wow - ${streak} day streak! You're on fire! 🔥 `;
    }

    if (xp > 0) {
      message += `${xp} XP earned - you're building some serious skills! 💪`;
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

  async generateMotivationalMessage(userProgress: any, currentStreak: number): Promise<string> {
    const messages = [
      `You're doing amazing! ${currentStreak} days strong! 💪`,
      `Every lesson completed makes you a better coder! 🌟`,
      `Your progress is incredible! Keep it up! 🚀`,
      `You're building Python skills that will last a lifetime! 🐍✨`,
      `Streak ${currentStreak}! That's dedication! 🔥`
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  private async getUserProgress(userId: string): Promise<any> {
    // This would integrate with the actual user progress system
    return {
      totalXP: 150,
      currentStreak: 3,
      completedLessons: 8,
      currentLevel: 1
    };
  }

  // Rate limiting helper
  private lastRequestTime = new Map<string, number>();
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
}

export const aiCharacterService = new AICharacterService();
export type { ConversationMessage, ConversationContext };