// Simple test to verify Groq API is working
import { groqService } from './groqService';

export const testGroqApi = async () => {
  try {
    console.log('Testing Groq API...');

    // Test basic question
    const response1 = await groqService.answerQuestion('What is Python?');
    console.log('Test 1 - Basic question response:', response1.substring(0, 100) + '...');

    // Test code generation
    const response2 = await groqService.generateCode('Make me a simple calculator');
    console.log('Test 2 - Code generation response length:', response2.length);

    // Test concept explanation
    const response3 = await groqService.explainConcept('variables');
    console.log('Test 3 - Concept explanation response length:', response3.length);

    console.log('✅ All Groq API tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Groq API test failed:', error);
    return false;
  }
};