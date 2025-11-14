/**
 * AI Chat Edge Function
 * Securely handles AI requests without exposing API keys to the client
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatRequest {
  message: string
  conversation_id?: string
  lesson_context?: string
  personality?: string
}

interface ChatResponse {
  message: string
  provider: string
  model: string
  response_time: number
  tokens_used?: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get request body
    const { message, conversation_id, lesson_context, personality = 'motivational' }: ChatRequest = await req.json()

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get API keys from environment variables (secure)
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')

    // Sky personality prompts
    const personalities = {
      motivational: {
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

Always respond in a friendly, encouraging tone. Be concise but thorough. Use markdown formatting for code examples.`
      },
      technical: {
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

Always be technically accurate and thorough. Include relevant examples and explain the reasoning behind your suggestions.`
      },
      friendly: {
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

Be warm, approachable, and use language that makes programming feel like a fun adventure rather than a technical challenge.`
      }
    }

    const selectedPersonality = personalities[personality as keyof typeof personalities] || personalities.motivational

    // Build system prompt
    let systemPrompt = selectedPersonality.systemPrompt
    if (lesson_context) {
      systemPrompt += `\n\nCurrent lesson context: ${lesson_context}\n\nPlease tailor your responses to help with this specific lesson topic.`
    }
    systemPrompt += `\n\nCurrent date: ${new Date().toLocaleDateString()}`

    // Get conversation history if conversation_id provided
    let conversationHistory = []
    if (conversation_id) {
      const { data: messages, error } = await supabaseClient
        .from('ai_conversations')
        .select('message, message_type, created_at')
        .eq('conversation_id', conversation_id)
        .order('created_at', { ascending: true })
        .limit(10) // Limit to last 10 messages for context

      if (!error && messages) {
        conversationHistory = messages.map(msg => ({
          role: msg.message_type,
          content: msg.message
        }))
      }
    }

    // Add current message to history
    conversationHistory.push({ role: 'user', content: message })

    // 🎯 CUSTOM FALLBACK ORDER - You can change this order!
    let aiResponse = null
    let providerUsed = 'fallback'

    const providerOrder = [
      {
        name: 'Groq',
        key: GROQ_API_KEY,
        callFunction: callGroqAPI,
        priority: 1,
        speed: 'Fastest',
        cost: 'Very Affordable (~$0.40/1M tokens)'
      },
      {
        name: 'OpenAI',
        key: OPENAI_API_KEY,
        callFunction: callOpenAIAPI,
        priority: 2,
        speed: 'Fast',
        cost: 'Moderate (~$2.00/1M tokens)'
      },
      {
        name: 'Google Gemini',
        key: GEMINI_API_KEY,
        callFunction: callGeminiAPI,
        priority: 3,
        speed: 'Fast',
        cost: 'Free tier available'
      },
      {
        name: 'Anthropic Claude',
        key: ANTHROPIC_API_KEY,
        callFunction: callAnthropicAPI,
        priority: 4,
        speed: 'Moderate',
        cost: 'Premium (~$25/1M tokens)'
      }
    ]

    // Try each provider in priority order
    for (const provider of providerOrder) {
      if (provider.key && !aiResponse) {
        try {
          console.log(`Trying ${provider.name} (Priority: ${provider.priority}, Speed: ${provider.speed}, Cost: ${provider.cost})`)
          aiResponse = await provider.callFunction(provider.key, systemPrompt, conversationHistory)
          providerUsed = provider.name
          console.log(`✅ ${provider.name} succeeded!`)
          break
        } catch (error) {
          console.error(`❌ ${provider.name} failed:`, error)
          continue
        }
      }
    }

    // If all providers failed, return fallback response
    if (!aiResponse) {
      aiResponse = generateFallbackResponse(message, lesson_context)
      providerUsed = 'fallback'
    }

    // Save conversation to database
    if (conversation_id) {
      try {
        // Save user message
        await supabaseClient
          .from('ai_conversations')
          .insert({
            user_id: req.headers.get('user-id') || 'anonymous',
            conversation_id,
            message: message,
            message_type: 'user',
            lesson_context
          })

        // Save AI response
        await supabaseClient
          .from('ai_conversations')
          .insert({
            user_id: req.headers.get('user-id') || 'anonymous',
            conversation_id,
            message: aiResponse,
            message_type: 'sky',
            lesson_context
          })
      } catch (error) {
        console.error('Failed to save conversation:', error)
      }
    }

    const response: ChatResponse = {
      message: aiResponse,
      provider: providerUsed,
      model: 'unknown',
      response_time: 0 // We're not tracking response time in the edge function
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('AI Chat Edge Function Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Groq API call
async function callGroqAPI(apiKey: string, systemPrompt: string, messages: any[]) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mixtral-8x7b-32768',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      max_tokens: 1000,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// Gemini API call
async function callGeminiAPI(apiKey: string, systemPrompt: string, messages: any[]) {
  // Gemini expects a different message format
  const contents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    ...messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }))
  ]

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: contents,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7
      }
    })
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

// OpenAI API call
async function callOpenAIAPI(apiKey: string, systemPrompt: string, messages: any[]) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      max_tokens: 1000,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// Anthropic API call
async function callAnthropicAPI(apiKey: string, systemPrompt: string, messages: any[]) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages
    })
  })

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.content[0].text
}

// Generate fallback response when all AI providers fail
function generateFallbackResponse(message: string, lessonContext?: string): string {
  const fallbacks = [
    "I'm having trouble connecting right now, but I'd love to help! Could you try asking your question again in a moment? 🌟",
    "My circuits are a bit busy at the moment! While I reconnect, could you rephrase your question? I'm here to help! 💪",
    "Looks like I'm experiencing some technical difficulties. Don't worry though - I'll be back to help you learn Python in no time! Try again in a few seconds. 🚀",
    "I'm taking a quick coffee break! ☕ Could you ask me again? I'm excited to help you on your Python learning journey!"
  ]

  const contextualResponses = {
    variables: [
      "Variables in Python are like containers where you can store information! Think of them as labeled boxes where you put different types of data. For example: `my_name = \"Sky\"` stores the text \"Sky\" in a variable called my_name. 📦",
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
  }

  // Check for specific topics in the message
  const lowerMessage = message.toLowerCase()
  for (const [topic, responses] of Object.entries(contextualResponses)) {
    if (lowerMessage.includes(topic)) {
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }

  // Return general fallback
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}