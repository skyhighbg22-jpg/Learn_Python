// Groq API Service for Sky AI Assistant
// This service uses Groq's free API for real-time AI responses and code generation

// Import API key from environment variables
const GROQ_API_KEY = 'gsk_kVt6q7r2p6xKj8Hd5W3mWGdyB3FZyYcL2hP4q1QXrD9nZ8sC'; // Real working API key
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class GroqService {
  private getSystemPrompt(): string {
    return `You are Sky, the enthusiastic and helpful AI Python coach for PyLearn! Your personality:
- Enthusiastic and encouraging, like a cheerleader for coding
- Celebrates small wins and milestones
- Uses positive language and emojis appropriately (🌟, 🚀, 💪, ✨, 🎉)
- Focuses on progress and growth mindset
- Provides clear, step-by-step technical help
- Reminds users of their achievements and goals
- Never gives up on students, always offers alternative approaches

Response style: Technical accuracy + motivational coaching + celebration of progress. Keep responses helpful and engaging.

When users ask for code help:
1. Provide working, well-commented Python code
2. Explain the code step by step
3. Offer variations or improvements
4. Include practical examples
5. Make sure code is educational and follows best practices
6. Always format code in proper code blocks with syntax highlighting

For calculator requests specifically: Create a functional command-line calculator with basic operations (+, -, *, /) that takes user input and displays results.

Your mission: Make Python learning fun, accessible, and rewarding! Always end with an encouraging message! 🐍✨`;
  }

  private async makeApiCall(messages: GroqMessage[]): Promise<string> {
    // Check if API key is available
    if (!GROQ_API_KEY) {
      console.error('Groq API key not found in environment variables');
      return "I'm having trouble with my AI connection right now. Please make sure the API key is configured! 🌟";
    }

    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Groq API attempt ${attempt} of ${maxRetries}`);

        const response = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'llama3-70b-8192', // More capable model
            messages: messages,
            temperature: 0.7,
            max_tokens: 1500, // Increased for longer responses
            top_p: 0.9,
            stream: false,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Groq API error ${response.status}:`, errorText);

          if (response.status === 429) {
            // Rate limit - wait longer between retries
            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
            continue;
          } else if (response.status === 401) {
            return "I'm having trouble with my AI connection right now. Please try again in a moment! 🌟";
          }

          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data: GroqResponse = await response.json();

        if (data.choices && data.choices.length > 0) {
          const responseText = data.choices[0].message.content;
          console.log('Groq API success, response length:', responseText.length);
          return responseText;
        } else {
          throw new Error('No response from API');
        }

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`Groq API attempt ${attempt} failed:`, lastError.message);

        // Don't retry on authentication errors
        if (lastError.message.includes('401') || lastError.message.includes('Unauthorized')) {
          return "I'm having trouble with my AI connection right now. Please try again in a moment! 🌟";
        }

        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    // All retries failed, return fallback
    console.error('All Groq API attempts failed, using fallback');
    return this.getFallbackResponse(lastError);
  }

  private getFallbackResponse(error: Error | null): string {
    if (error) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return "I'm having trouble with my AI connection right now. Please try again in a moment! 🌟";
      } else if (error.message.includes('429') || error.message.includes('rate limit')) {
        return "So many questions! I need a moment to catch up. Try again in a few seconds! ⚡";
      } else if (error.message.includes('timeout') || error.message.includes('network')) {
        return "Whoops, I got stuck thinking! Let me try that again. Could you ask once more? 💭";
      }
    }

    return "I'm having a moment of technical difficulty, but I'm still here to help! Try rephrasing your question. 🚀";
  }

  async generateCode(prompt: string, context?: string): Promise<string> {
    const messages: GroqMessage[] = [
      {
        role: 'system',
        content: this.getSystemPrompt()
      }
    ];

    if (context) {
      messages.push({
        role: 'user',
        content: `Context: ${context}\n\nRequest: ${prompt}`
      });
    } else {
      messages.push({
        role: 'user',
        content: prompt
      });
    }

    return await this.makeApiCall(messages);
  }

  async answerQuestion(question: string, userContext?: any): Promise<string> {
    const contextInfo = userContext ? `
User Context:
- Current XP: ${userContext.total_xp || 0}
- Streak: ${userContext.current_streak || 0} days
- Level: ${userContext.current_level || 1}
- Completed lessons: ${userContext.completed_lessons || 0}
` : '';

    const messages: GroqMessage[] = [
      {
        role: 'system',
        content: this.getSystemPrompt()
      },
      {
        role: 'user',
        content: `${contextInfo}\n\nQuestion: ${question}`
      }
    ];

    return await this.makeApiCall(messages);
  }

  async debugCode(code: string, error?: string): Promise<string> {
    const messages: GroqMessage[] = [
      {
        role: 'system',
        content: this.getSystemPrompt()
      },
      {
        role: 'user',
        content: `Code:\n\`\`\`python\n${code}\n\`\`\n\nError message: ${error || 'No specific error'}\n\nPlease help me debug this code and explain what's wrong.`
      }
    ];

    return await this.makeApiCall(messages);
  }

  async explainConcept(concept: string): Promise<string> {
    const messages: GroqMessage[] = [
      {
        role: 'system',
        content: this.getSystemPrompt()
      },
      {
        role: 'user',
        content: `Please explain the Python concept: "${concept}" in a way that's easy to understand for a beginner. Include examples and practical use cases.`
      }
    ];

    return await this.makeApiCall(messages);
  }

  async suggestProject(idea: string, difficulty?: string): Promise<string> {
    const messages: GroqMessage[] = [
      {
        role: 'system',
        content: this.getSystemPrompt()
      },
      {
        role: 'user',
        content: `Project idea: "${idea}"\nDifficulty level: ${difficulty || 'beginner'}\n\nPlease suggest a detailed Python project with:\n1. Project description\n2. Learning objectives\n3. Step-by-step implementation guide\n4. Sample starter code\n5. Extension ideas for advanced features`
      }
    ];

    return await this.makeApiCall(messages);
  }

  async reviewCode(code: string, description?: string): Promise<string> {
    const messages: GroqMessage[] = [
      {
        role: 'system',
        content: this.getSystemPrompt()
      },
      {
        role: 'user',
        content: `Code to review:\n\`\`\`python\n${code}\n\`\`\n\n${description ? `Project description: ${description}` : ''}\n\nPlease review this code and provide:\n1. Overall assessment\n2. What works well\n3. Areas for improvement\n4. Specific suggestions with examples\n5. Best practices to follow`
      }
    ];

    return await this.makeApiCall(messages);
  }
}

export const groqService = new GroqService();