# Sky AI Setup Guide 🤖

Sky AI is powered by Groq's fast and free API! Here's how to set it up:

## 🚀 Quick Setup

### 1. Get Your Groq API Key
1. Go to [https://console.groq.com/](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy your API key

### 2. Configure Environment Variables
Create a `.env` file in your project root:

```bash
# Copy the example file
cp .env.example .env
```

Add your Groq API key to the `.env` file:

```env
# Groq AI (Fast, affordable AI model) - PRIMARY
GROQ_API_KEY=gsk_your_actual_api_key_here
```

### 3. Restart Your Application
After adding the API key, restart your development server:

```bash
npm run dev
```

## ✨ What Sky AI Can Do

### 📝 Code Generation
- **Calculator**: "Make me a calculator" → Complete calculator app
- **Functions**: "Write a function that sorts numbers" → Working code
- **Programs**: "Create a todo app" → Full project template
- **Algorithms**: "Implement bubble sort" → Optimized code

### 🔍 Debugging Help
- **Error Analysis**: "Help me fix this error: ..." → Solutions
- **Code Review**: "Review this code for me" → Improvement suggestions
- **Troubleshooting**: "My code isn't working" → Debugging steps

### 📚 Concept Explanations
- **Definitions**: "What is a Python variable?" → Clear explanations
- **Examples**: "Show me how lists work" → Practical examples
- **Best Practices**: "How should I handle errors?" → Professional tips

### 🎯 Project Guidance
- **Ideas**: "Suggest a beginner project" → Complete project plan
- **Implementation**: "How do I build a web scraper?" → Step-by-step guide
- **Extensions**: "How can I improve my calculator?" → Enhancement ideas

## 🧪 Test Sky AI

Try these example questions:

1. **Calculator Request**:
   ```
   "Make me a calculator"
   ```

2. **Concept Explanation**:
   ```
   "What are Python functions?"
   ```

3. **Debug Help**:
   ```
   "I'm getting a NameError, what should I do?"
   ```

4. **Project Idea**:
   ```
   "Suggest a Python project for beginners"
   ```

## 🔧 Advanced Configuration

### API Models
Sky uses `llama-3.1-8b-instant` by default for fast responses. You can modify this in `groqService.ts`.

### Rate Limits
Groq has generous free tier limits:
- **Requests**: 30 requests/minute
- **Tokens**: 14,400 tokens/day
- **Retry Logic**: Automatic retries with exponential backoff

### Fallback Responses
If the API is unavailable, Sky provides helpful fallback responses:
- Encouraging messages
- Basic Python help
- Troubleshooting suggestions

## 🛠️ Troubleshooting

### API Key Issues
- **Problem**: "I'm having trouble with my AI connection"
- **Solution**: Check that your API key is correctly set in `.env` file

### Rate Limiting
- **Problem**: "So many questions! I need a moment to catch up"
- **Solution**: Wait a few seconds between requests

### Network Issues
- **Problem**: "Whoops, I got stuck thinking!"
- **Solution**: Check your internet connection and try again

## 🎉 Benefits

With Sky AI powered by Groq:
- **Fast Responses**: Instant code generation and explanations
- **Free Usage**: Generous free tier for learning
- **Educational Focus**: Tailored for Python learning
- **Contextual**: Understands your progress and learning goals
- **Encouraging**: Motivational coaching personality

## 📞 Support

If you encounter issues:
1. Check your API key configuration
2. Verify your internet connection
3. Look at browser console for error messages
4. Try refreshing the page

Happy coding with Sky! 🐍✨