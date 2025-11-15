// Test script to verify Groq API is working
const GROQ_API_KEY = 'gsk_P2d4s8t5xKj8Hd5W3mWGdyB3FZyYcL2hP4q1QXrD8nZ9s';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function testGroqAPI() {
  console.log('Testing Groq API...');

  const testMessage = 'Hello! Can you make a simple calculator in Python?';

  const messages = [
    {
      role: 'system',
      content: 'You are Sky, an enthusiastic Python coach. Provide working Python code with explanations.'
    },
    {
      role: 'user',
      content: testMessage
    }
  ];

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error:', errorText);
      return false;
    }

    const data = await response.json();
    console.log('Success! Response:', data.choices[0].message.content.substring(0, 200) + '...');
    return true;

  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }
}

// Run the test
testGroqAPI();