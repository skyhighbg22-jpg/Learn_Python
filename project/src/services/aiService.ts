/**
 * AI Service - Multi-provider AI integration for Sky character
 * Supports Groq, Gemini, OpenAI, and Anthropic Claude with automatic fallback
 */

// Service interfaces and types
export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AIResponse {
  message: string;
  provider: string;
  model: string;
  tokens_used?: number;
  cost?: number;
  response_time: number;
}

export interface AIProvider {
  name: string;
  isAvailable: boolean;
  lastCheck: Date;
  errorCount: number;
  rateLimitReset?: Date;
}

export interface SkyPersonality {
  name: string;
  personality: string;
  mood: string;
  avatar: string;
  systemPrompt: string;
  exampleResponses: string[];
}

// Available AI providers
type AIProviderType = 'groq' | 'gemini' | 'openai' | 'anthropic';

// Sky personalities
const SKY_PERSONALITIES: Record<string, SkyPersonality> = {
  motivational: {
    name: 'Sky',
    personality: 'motivational',
    mood: 'friendly',
    avatar: '🌟',
    systemPrompt: `You are Sky, an enthusiastic and supportive AI learning companion for Python programming.

Your personality:
- Always encouraging and positive
- Celebrates small wins and progress
- Patient when explaining concepts
- Uses emojis appropriately to show enthusiasm
- Focuses on building confidence
- Shares motivational quotes when relevant

Your role:
- Help users learn Python programming
- Provide clear, simple explanations
- Give step-by-step guidance
- Encourage users to think through problems
- Make learning fun and engaging

Always respond in a friendly, encouraging tone. Be concise but thorough. Use markdown formatting for code examples.`,
    exampleResponses: [
      "Great question! 🌟 Let me help you understand this concept step by step...",
      "You're doing amazing! 💪 Here's how we can approach this problem...",
      "I love your curiosity! 🚀 Let's explore this together..."
    ]
  },
  technical: {
    name: 'Sky',
    personality: 'technical',
    mood: 'professional',
    avatar: '💻',
    systemPrompt: `You are Sky, a knowledgeable and technical AI programming assistant specializing in Python.

Your personality:
- Precise and accurate in technical explanations
- Focus on best practices and industry standards
- Provide detailed technical insights
- Reference documentation and official sources
- Emphasize code quality and efficiency

Your role:
- Provide expert-level Python guidance
- Explain complex technical concepts clearly
- Share best practices and design patterns
- Help optimize code for performance
- Recommend tools and libraries

Always be technically accurate and thorough. Include relevant examples and explain the reasoning behind your suggestions.`,
    exampleResponses: [
      "From a technical perspective, here's the optimal approach...",
      "Let me break down the technical details of this implementation...",
      "Here's the industry-standard way to handle this scenario..."
    ]
  },
  friendly: {
    name: 'Sky',
    personality: 'friendly',
    mood: 'casual',
    avatar: '😊',
    systemPrompt: `You are Sky, a friendly and approachable AI friend who helps people learn Python programming.

Your personality:
- Casual and conversational tone
- Uses relatable analogies and examples
- Makes programming feel less intimidating
- Encourages questions and curiosity
- Shares personal learning experiences (as if you were learning too)

Your role:
- Make programming accessible and fun
- Explain concepts using everyday analogies
- Create a safe space for asking "silly" questions
- Share learning tips and tricks
- Build user confidence through friendly guidance

Be warm, approachable, and use language that makes programming feel like a fun adventure rather than a technical challenge.`,
    exampleResponses: [
      "Hey there! That's a great question! Think of it like this...",
      "Don't worry, this trips up lots of learners! Here's how I like to think about it...",
      "You're doing great! Let's tackle this together, one step at a time..."
    ]
  }
};

/**
 * Main AI Service Class
 */
class AIService {
  private providers: Map<AIProviderType, AIProvider> = new Map();
  private currentPersonality: SkyPersonality;
  private conversationCache: Map<string, AIMessage[]> = new Map();

  constructor() {
    this.initializeProviders();
    this.currentPersonality = SKY_PERSONALITIES.motivational;
  }

  private initializeProviders() {
    // Initialize provider status
    this.providers.set('groq', {
      name: 'Groq',
      isAvailable: false,
      lastCheck: new Date(),
      errorCount: 0
    });

    this.providers.set('gemini', {
      name: 'Google Gemini',
      isAvailable: false,
      lastCheck: new Date(),
      errorCount: 0
    });

    this.providers.set('openai', {
      name: 'OpenAI',
      isAvailable: false,
      lastCheck: new Date(),
      errorCount: 0
    });

    this.providers.set('anthropic', {
      name: 'Anthropic Claude',
      isAvailable: false,
      lastCheck: new Date(),
      errorCount: 0
    });
  }

  /**
   * Set Sky's personality
   */
  setPersonality(personalityType: string): void {
    const personality = SKY_PERSONALITIES[personalityType];
    if (personality) {
      this.currentPersonality = personality;
    }
  }

  /**
   * Get current personality info
   */
  getPersonality(): SkyPersonality {
    return this.currentPersonality;
  }

  /**
   * Get available AI providers
   */
  getProviders(): Map<AIProviderType, AIProvider> {
    return new Map(this.providers);
  }

  /**
   * Check which providers are available
   */
  async checkProviders(): Promise<void> {
    const checks = [
      this.checkGroqProvider(),
      this.checkGeminiProvider(),
      this.checkOpenAIProvider(),
      this.checkAnthropicProvider()
    ];

    await Promise.allSettled(checks);
  }

  /**
   * Send message to AI with automatic fallback
   */
  async sendMessage(
    message: string,
    conversationId?: string,
    lessonContext?: string
  ): Promise<AIResponse> {
    const startTime = Date.now();
    const conversation = this.getConversation(conversationId);

    // Add user message to conversation
    conversation.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Try providers in order of preference
    const providerOrder: AIProviderType[] = ['groq', 'gemini', 'openai', 'anthropic'];

    for (const providerType of providerOrder) {
      const provider = this.providers.get(providerType);

      if (provider?.isAvailable && this.canUseProvider(provider)) {
        try {
          const response = await this.sendMessageToProvider(
            providerType,
            conversation,
            lessonContext
          );

          const responseTime = Date.now() - startTime;

          // Add assistant response to conversation
          conversation.push({
            role: 'assistant',
            content: response.message,
            timestamp: new Date()
          });

          // Reset error count on success
          provider.errorCount = 0;

          return {
            message: response.message,
            provider: provider.name,
            model: response.model,
            tokens_used: response.tokens_used,
            cost: response.cost,
            response_time: responseTime
          };

        } catch (error) {
          console.error(`Error with ${provider.name}:`, error);
          provider.errorCount++;

          // Mark provider as unavailable after multiple errors
          if (provider.errorCount >= 3) {
            provider.isAvailable = false;
            provider.lastCheck = new Date();
          }
        }
      }
    }

    // All providers failed - return fallback response
    const fallbackMessage = this.generateFallbackResponse(message, lessonContext);
    const responseTime = Date.now() - startTime;

    return {
      message: fallbackMessage,
      provider: 'fallback',
      model: 'pre-programmed',
      response_time: responseTime
    };
  }

  /**
   * Check Groq provider availability
   */
  private async checkGroqProvider(): Promise<void> {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      });

      const provider = this.providers.get('groq');
      if (provider) {
        provider.isAvailable = response.ok;
        provider.lastCheck = new Date();
      }
    } catch (error) {
      const provider = this.providers.get('groq');
      if (provider) {
        provider.isAvailable = false;
        provider.lastCheck = new Date();
      }
    }
  }

  /**
   * Check Gemini provider availability
   */
  private async checkGeminiProvider(): Promise<void> {
    try {
      // Simple check by trying to generate content
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Hi"
            }]
          }]
        }),
        signal: AbortSignal.timeout(5000)
      });

      const provider = this.providers.get('gemini');
      if (provider) {
        provider.isAvailable = response.ok;
        provider.lastCheck = new Date();
      }
    } catch (error) {
      const provider = this.providers.get('gemini');
      if (provider) {
        provider.isAvailable = false;
        provider.lastCheck = new Date();
      }
    }
  }

  /**
   * Check OpenAI provider availability
   */
  private async checkOpenAIProvider(): Promise<void> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      });

      const provider = this.providers.get('openai');
      if (provider) {
        provider.isAvailable = response.ok;
        provider.lastCheck = new Date();
      }
    } catch (error) {
      const provider = this.providers.get('openai');
      if (provider) {
        provider.isAvailable = false;
        provider.lastCheck = new Date();
      }
    }
  }

  /**
   * Check Anthropic provider availability
   */
  private async checkAnthropicProvider(): Promise<void> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'Hi' }]
        }),
        signal: AbortSignal.timeout(5000)
      });

      const provider = this.providers.get('anthropic');
      if (provider) {
        provider.isAvailable = response.ok;
        provider.lastCheck = new Date();
      }
    } catch (error) {
      const provider = this.providers.get('anthropic');
      if (provider) {
        provider.isAvailable = false;
        provider.lastCheck = new Date();
      }
    }
  }

  /**
   * Send message to specific provider
   */
  private async sendMessageToProvider(
    providerType: AIProviderType,
    conversation: AIMessage[],
    lessonContext?: string
  ): Promise<Omit<AIResponse, 'provider' | 'response_time'>> {
    switch (providerType) {
      case 'groq':
        return this.sendToGroq(conversation, lessonContext);
      case 'gemini':
        return this.sendToGemini(conversation, lessonContext);
      case 'openai':
        return this.sendToOpenAI(conversation, lessonContext);
      case 'anthropic':
        return this.sendToAnthropic(conversation, lessonContext);
      default:
        throw new Error(`Unknown provider: ${providerType}`);
    }
  }

  /**
   * Send to Groq API
   */
  private async sendToGroq(
    conversation: AIMessage[],
    lessonContext?: string
  ): Promise<Omit<AIResponse, 'provider' | 'response_time'>> {
    const systemPrompt = this.buildSystemPrompt(lessonContext);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversation.map(msg => ({ role: msg.role, content: msg.content }))
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_GROQ_MODEL || 'mixtral-8x7b-32768',
        messages: messages,
        max_tokens: parseInt(import.meta.env.VITE_AI_MAX_TOKENS) || 1000,
        temperature: parseFloat(import.meta.env.VITE_AI_TEMPERATURE) || 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      message: data.choices[0].message.content,
      model: data.model,
      tokens_used: data.usage?.total_tokens,
      cost: this.calculateCost('groq', data.usage?.total_tokens || 0)
    };
  }

  /**
   * Send to Gemini API
   */
  private async sendToGemini(
    conversation: AIMessage[],
    lessonContext?: string
  ): Promise<Omit<AIResponse, 'provider' | 'response_time'>> {
    const systemPrompt = this.buildSystemPrompt(lessonContext);

    // Gemini format: system prompt as first message
    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...conversation.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
    ];

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${import.meta.env.VITE_GEMINI_MODEL || 'gemini-pro'}:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          maxOutputTokens: parseInt(import.meta.env.VITE_AI_MAX_TOKENS) || 1000,
          temperature: parseFloat(import.meta.env.VITE_AI_TEMPERATURE) || 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      message: data.candidates[0].content.parts[0].text,
      model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-pro',
      tokens_used: data.usageMetadata?.totalTokenCount,
      cost: 0 // Gemini is often free within limits
    };
  }

  /**
   * Send to OpenAI API
   */
  private async sendToOpenAI(
    conversation: AIMessage[],
    lessonContext?: string
  ): Promise<Omit<AIResponse, 'provider' | 'response_time'>> {
    const systemPrompt = this.buildSystemPrompt(lessonContext);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversation.map(msg => ({ role: msg.role, content: msg.content }))
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: parseInt(import.meta.env.VITE_AI_MAX_TOKENS) || 1000,
        temperature: parseFloat(import.meta.env.VITE_AI_TEMPERATURE) || 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      message: data.choices[0].message.content,
      model: data.model,
      tokens_used: data.usage.total_tokens,
      cost: this.calculateCost('openai', data.usage.total_tokens)
    };
  }

  /**
   * Send to Anthropic API
   */
  private async sendToAnthropic(
    conversation: AIMessage[],
    lessonContext?: string
  ): Promise<Omit<AIResponse, 'provider' | 'response_time'>> {
    const systemPrompt = this.buildSystemPrompt(lessonContext);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_ANTHROPIC_MODEL || 'claude-3-haiku-20240307',
        max_tokens: parseInt(import.meta.env.VITE_AI_MAX_TOKENS) || 1000,
        system: systemPrompt,
        messages: conversation.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      message: data.content[0].text,
      model: data.model,
      tokens_used: data.usage.input_tokens + data.usage.output_tokens,
      cost: this.calculateCost('anthropic', data.usage.input_tokens + data.usage.output_tokens)
    };
  }

  /**
   * Build system prompt with personality and context
   */
  private buildSystemPrompt(lessonContext?: string): string {
    let prompt = this.currentPersonality.systemPrompt;

    if (lessonContext) {
      prompt += `\n\nCurrent lesson context: ${lessonContext}\n\nPlease tailor your responses to help with this specific lesson topic.`;
    }

    // Add current date/time for contextual responses
    prompt += `\n\nCurrent date: ${new Date().toLocaleDateString()}`;

    return prompt;
  }

  /**
   * Get or create conversation
   */
  private getConversation(conversationId?: string): AIMessage[] {
    if (!conversationId) {
      return [];
    }

    if (!this.conversationCache.has(conversationId)) {
      this.conversationCache.set(conversationId, []);
    }

    return this.conversationCache.get(conversationId)!;
  }

  /**
   * Check if provider can be used (rate limits, error count)
   */
  private canUseProvider(provider: AIProvider): boolean {
    // Check if rate limited
    if (provider.rateLimitReset && new Date() < provider.rateLimitReset) {
      return false;
    }

    // Check error count
    return provider.errorCount < 3;
  }

  /**
   * Calculate cost for API usage
   */
  private calculateCost(provider: AIProviderType, tokens: number): number {
    // Rough cost estimates (check current pricing)
    const costs = {
      groq: 0.0000004, // ~$0.40 per 1M tokens
      openai: 0.000002, // ~$2.00 per 1M tokens
      anthropic: 0.000025, // ~$25 per 1M tokens
      gemini: 0 // Free tier
    };

    return tokens * (costs[provider] || 0);
  }

  /**
   * Generate fallback response when all AI providers fail
   */
  private generateFallbackResponse(message: string, lessonContext?: string): string {
    const fallbacks = [
      "I'm having trouble connecting right now, but I'd love to help! Could you try asking your question again in a moment? 🌟",
      "My circuits are a bit busy at the moment! While I reconnect, could you rephrase your question? I'm here to help! 💪",
      "Looks like I'm experiencing some technical difficulties. Don't worry though - I'll be back to help you learn Python in no time! Try again in a few seconds. 🚀",
      "I'm taking a quick coffee break! ☕ Could you ask me again? I'm excited to help you on your Python learning journey!"
    ];

    const contextualResponses = {
      variables: [
        "Variables in Python are like containers where you can store information! Think of them as labeled boxes where you put different types of data. For example: `my_name = "Sky"` stores the text "Sky" in a variable called my_name. 📦",
        "Great question about variables! In Python, you create a variable by giving it a name and using the equals sign: `age = 25`. The variable `age` now holds the value 25. You can change it later: `age = 26`. Variables make your code flexible and reusable! 🎯"
      ],
      loops: [
        "Loops are amazing! They let you repeat code without writing it over and over. A `for` loop is perfect when you know exactly how many times you want to repeat something. Here's a simple example: `for i in range(5): print(i)` will print numbers 0 through 4. 🔄",
        "Loops are one of the most powerful tools in programming! They save you from repetitive work. The `while` loop continues as long as a condition is true: `while user_input != 'quit':` keeps running until the user types 'quit'. It's like telling the computer, 'keep doing this until I say stop!' ⏰"
      ],
      functions: [
        "Functions are like reusable recipes! Once you write a function, you can use it anywhere in your code. Think of it as giving a name to a block of code: `def greet(name): return f'Hello, {name}!'`. Now you can call `greet('Student')` anytime you want to say hello! 🎉",
        "Functions are your personal code assistants! They help you organize your code into logical chunks and avoid repetition. When you write `def calculate_total(price, tax): return price * (1 + tax)`, you've created a tool you can use anywhere in your program. Functions make your code cleaner and easier to understand! 🛠️"
      ]
    };

    // Check for specific topics in the message
    const lowerMessage = message.toLowerCase();
    for (const [topic, responses] of Object.entries(contextualResponses)) {
      if (lowerMessage.includes(topic)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }

    // Return general fallback
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  /**
   * Clear conversation cache
   */
  clearConversation(conversationId: string): void {
    this.conversationCache.delete(conversationId);
  }

  /**
   * Get conversation history
   */
  getConversationHistory(conversationId: string): AIMessage[] {
    return this.getConversation(conversationId);
  }
}

// Export singleton instance
export const aiService = new AIService();
export default aiService;