# AI Provider Priority Configuration

## Current Priority Order:
1. **Groq** (Fastest, Most Affordable) - ⭐ Primary
2. **OpenAI GPT** (Fast, Reliable) - ⭐ Secondary
3. **Google Gemini** (Free Tier Available) - ⭐ Tertiary
4. **Anthropic Claude** (Premium, High Quality) - ⭐ Final Backup

## To Change Priority Order:

Edit this file: `supabase/functions/ai-chat/index.ts`

```typescript
const providerOrder = [
  { name: 'Groq', key: GROQ_API_KEY, callFunction: callGroqAPI, priority: 1 },
  { name: 'OpenAI', key: OPENAI_API_KEY, callFunction: callOpenAIAPI, priority: 2 },
  { name: 'Google Gemini', key: GEMINI_API_KEY, callFunction: callGeminiAPI, priority: 3 },
  { name: 'Anthropic Claude', key: ANTHROPIC_API_KEY, callFunction: callAnthropicAPI, priority: 4 }
]
```

## Example: Make OpenAI Primary:
```typescript
const providerOrder = [
  { name: 'OpenAI', key: OPENAI_API_KEY, callFunction: callOpenAIAPI, priority: 1 }, // Changed
  { name: 'Groq', key: GROQ_API_KEY, callFunction: callGroqAPI, priority: 2 },      // Changed
  { name: 'Google Gemini', key: GEMINI_API_KEY, callFunction: callGeminiAPI, priority: 3 },
  { name: 'Anthropic Claude', key: ANTHROPIC_API_KEY, callFunction: callAnthropicAPI, priority: 4 }
]
```

## Why This Order:

1. **Groq** - Fastest responses (~200ms), cheapest ($0.40/1M tokens)
2. **OpenAI** - Reliable GPT-3.5, good quality ($2.00/1M tokens)
3. **Gemini** - Free tier available, good backup option
4. **Claude** - Premium quality but expensive ($25/1M tokens)

## Automatic Fallback:
- If a provider fails (rate limit, downtime, error) → Try next provider
- If all fail → Use pre-programmed fallback responses
- Users always get a response somehow

## Cost Optimization:
- System automatically tries cheapest working provider first
- Falls back to more expensive options only if needed
- Built-in rate limit protection