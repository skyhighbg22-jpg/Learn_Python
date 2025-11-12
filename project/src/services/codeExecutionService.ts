interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  execution_time: number;
  memory_usage?: number;
  test_results?: TestResult[];
}

interface TestResult {
  input: any;
  expected: any;
  actual: any;
  passed: boolean;
  error?: string;
}

interface TestCase {
  input: any;
  expected: any;
  description?: string;
}

interface ExecutionLimits {
  maxExecutionTime: number; // milliseconds
  maxMemoryUsage: number; // bytes
  allowedImports: string[];
  forbiddenOperations: string[];
}

class CodeExecutionService {
  private static instance: CodeExecutionService;
  private executionLimits: ExecutionLimits;

  private constructor() {
    this.executionLimits = {
      maxExecutionTime: 5000, // 5 seconds
      maxMemoryUsage: 50 * 1024 * 1024, // 50MB
      allowedImports: [
        'math', 'random', 'datetime', 'itertools', 'functools',
        'collections', 'operator', 'string', 're', 'json', 'csv'
      ],
      forbiddenOperations: [
        'exec', 'eval', 'compile', '__import__', 'open', 'file',
        'input', 'raw_input', 'exit', 'quit', 'help', 'credits'
      ]
    };
  }

  public static getInstance(): CodeExecutionService {
    if (!CodeExecutionService.instance) {
      CodeExecutionService.instance = new CodeExecutionService();
    }
    return CodeExecutionService.instance;
  }

  // Execute code with basic validation
  async executeCode(code: string, testCases?: TestCase[]): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // Pre-execution validation
      this.validateCode(code);

      // Prepare execution environment
      const { sandboxCode, imports } = this.prepareSandbox(code);

      if (testCases && testCases.length > 0) {
        return await this.executeWithTests(sandboxCode, testCases, imports, startTime);
      } else {
        return await this.executeWithoutTests(sandboxCode, imports, startTime);
      }
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        execution_time: Date.now() - startTime
      };
    }
  }

  // Validate code for security and safety
  private validateCode(code: string): void {
    // Check for forbidden operations
    for (const forbidden of this.executionLimits.forbiddenOperations) {
      const regex = new RegExp(`\\b${forbidden}\\s*\\(`);
      if (regex.test(code)) {
        throw new Error(`Forbidden operation: ${forbidden}() is not allowed`);
      }
    }

    // Check for dangerous patterns
    const dangerousPatterns = [
      /__\w+__/g, // dunder methods
      /globals\s*\(\)/g,
      /locals\s*\(\)/g,
      /vars\s*\(\)/g,
      /dir\s*\(\)/g,
      /hasattr\s*\(/g,
      /getattr\s*\(/g,
      /setattr\s*\(/g,
      /delattr\s*\(/g,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        throw new Error('Code contains potentially dangerous operations');
      }
    }

    // Check import statements
    const importRegex = /(?:from\s+(\S+)\s+)?import\s+(.+)/g;
    let match;
    while ((match = importRegex.exec(code)) !== null) {
      const module = match[1] || match[2].split(',')[0].trim();
      if (module && !this.executionLimits.allowedImports.includes(module)) {
        throw new Error(`Import not allowed: ${module}`);
      }
    }
  }

  // Prepare sandbox environment
  private prepareSandbox(code: string): { sandboxCode: string; imports: string[] } {
    // Extract imports for execution
    const imports: string[] = [];
    const importRegex = /(?:from\s+(\S+)\s+)?import\s+(.+)/g;
    let match;

    while ((match = importRegex.exec(code)) !== null) {
      const module = match[1] || match[2].split(',')[0].trim();
      if (module) {
        imports.push(module);
      }
    }

    // Create sandbox code
    const sandboxCode = `
import sys
import traceback
import time
from io import StringIO
import math
import random
import datetime
import itertools
import functools
import collections
import operator
import string
import re
import json
import csv

# Redirect output capture
old_stdout = sys.stdout
output_buffer = StringIO()

try:
    sys.stdout = output_buffer

    # User code starts here
    ${code}

except Exception as e:
    sys.stdout = old_stdout
    error_type = type(e).__name__
    error_message = str(e)
    error_traceback = traceback.format_exc()
    raise Exception(f"{error_type}: {error_message}")
finally:
    sys.stdout = old_stdout
    captured_output = output_buffer.getvalue()
    output_buffer.close()
`;

    return { sandboxCode, imports };
  }

  // Execute code without test cases
  private async executeWithoutTests(
    sandboxCode: string,
    imports: string[],
    startTime: number
  ): Promise<ExecutionResult> {
    try {
      // For client-side execution, we'll use a simulated approach
      // In production, this would make a request to a secure backend service
      const result = await this.simulateExecution(sandboxCode);

      return {
        success: true,
        output: result.output,
        execution_time: Date.now() - startTime,
        memory_usage: result.memory_usage
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Execution failed',
        execution_time: Date.now() - startTime
      };
    }
  }

  // Execute code with test cases
  private async executeWithTests(
    sandboxCode: string,
    testCases: TestCase[],
    imports: string[],
    startTime: number
  ): Promise<ExecutionResult> {
    const testResults: TestResult[] = [];

    for (const testCase of testCases) {
      try {
        // Create test-specific code
        const testCode = `
${sandboxCode}

# Test execution
try:
    input_data = ${JSON.stringify(testCase.input)}
    expected_output = ${JSON.stringify(testCase.expected)}

    # Try to call main function if it exists
    if 'main' in locals():
        actual_output = main(input_data)
    else:
        # SECURE: If no main function, use safe result retrieval
        actual_output = locals().get('result', None)

    test_result = {
        'input': input_data,
        'expected': expected_output,
        'actual': actual_output,
        'passed': actual_output == expected_output
    }
except Exception as e:
    test_result = {
        'input': input_data,
        'expected': expected_output,
        'actual': None,
        'passed': False,
        'error': str(e)
    }
`;

        const result = await this.simulateExecution(testCode);

        if (result.testResult) {
          testResults.push(result.testResult);
        } else {
          testResults.push({
            input: testCase.input,
            expected: testCase.expected,
            actual: null,
            passed: false,
            error: 'Test execution failed'
          });
        }

      } catch (error) {
        testResults.push({
          input: testCase.input,
          expected: testCase.expected,
          actual: null,
          passed: false,
          error: error instanceof Error ? error.message : 'Test error'
        });
      }
    }

    const allPassed = testResults.every(test => test.passed);
    const output = testResults.map(test =>
      `Test ${test.passed ? 'PASSED' : 'FAILED'}: ${test.description || 'No description'}\\n` +
      `Input: ${JSON.stringify(test.input)}\\n` +
      `Expected: ${JSON.stringify(test.expected)}\\n` +
      `Actual: ${JSON.stringify(test.actual)}\\n` +
      (test.error ? `Error: ${test.error}\\n` : '')
    ).join('\\n');

    return {
      success: allPassed,
      output,
      execution_time: Date.now() - startTime,
      test_results: testResults
    };
  }

  // Simulate code execution (client-side version)
  private async simulateExecution(code: string): Promise<{
    output: string;
    memory_usage?: number;
    testResult?: TestResult;
  }> {
    // In a real implementation, this would call a backend service
    // For now, we'll provide a basic simulation for demonstration

    return new Promise((resolve, reject) => {
      // Simulate execution delay
      setTimeout(() => {
        try {
          // Basic output simulation
          const output = this.generateMockOutput(code);
          resolve({
            output,
            memory_usage: Math.floor(Math.random() * 10 * 1024 * 1024) // Random memory usage
          });
        } catch (error) {
          reject(error);
        }
      }, Math.random() * 1000); // Random execution time
    });
  }

  // Generate mock output for demonstration (SECURE VERSION)
  private generateMockOutput(code: string): string {
    // Simple mock that generates different outputs based on code content
    if (code.includes('print(')) {
      // Extract print statements - SECURE VERSION WITHOUT eval()
      const printMatches = code.match(/print\s*\(\s*([^)]+)\s*\)/g);
      if (printMatches) {
        return printMatches.map(match => {
          const content = match.match(/print\s*\(\s*([^)]+)\s*\)/)?.[1];

          // SECURE: Parse print content safely without eval()
          if (!content) return '';

          // Handle string literals
          if ((content.startsWith('"') && content.endsWith('"')) ||
              (content.startsWith("'") && content.endsWith("'"))) {
            return content.slice(1, -1); // Remove quotes
          }

          // Handle basic arithmetic expressions safely
          if (/^[\d+\-*/.() ]+$/.test(content)) {
            try {
              return String(Function('"use strict"; return (' + content + ')')());
            } catch {
              return content;
            }
          }

          // Handle variables safely
          if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(content)) {
            return `[Variable: ${content}]`;
          }

          // Default: return the content as-is
          return content;
        }).join('\\n');
      }
    }

    if (code.includes('def main(')) {
      return 'Function defined successfully';
    }

    if (code.includes('return ')) {
      return 'Return statement executed';
    }

    return 'Code executed successfully';
  }

  // Real-time validation for lesson exercises
  validateInteractiveResponse(
    userCode: string,
    expectedCode: string[],
    lessonType: string
  ): {
    isCorrect: boolean;
    feedback: string;
    hints: string[];
  } {
    switch (lessonType) {
      case 'drag-drop':
        return this.validateDragDrop(userCode, expectedCode);
      case 'code-completion':
        return this.validateCodeCompletion(userCode, expectedCode);
      case 'puzzle':
        return this.validatePuzzleResponse(userCode, expectedCode);
      default:
        return this.validateGenericCode(userCode, expectedCode);
    }
  }

  private validateDragDrop(userCode: string, expectedCode: string[]): {
    isCorrect: boolean;
    feedback: string;
    hints: string[];
  } {
    // Normalize code for comparison
    const normalizeCode = (code: string) => {
      return code
        .replace(/\s+/g, ' ')
        .replace(/\s*([(){}[\],;])\s*/g, '$1')
        .trim()
        .toLowerCase();
    };

    const normalizedUserCode = normalizeCode(userCode);
    const normalizedExpected = expectedCode.map(code => normalizeCode(code));

    const isCorrect = normalizedExpected.some(expected =>
      normalizedUserCode === expected
    );

    return {
      isCorrect,
      feedback: isCorrect
        ? 'Perfect! Your code arrangement is correct.'
        : 'Not quite right. Check the order and structure of your code.',
      hints: isCorrect ? [] : [
        'Make sure the code blocks are in the correct order',
        'Check for any missing or extra code blocks',
        'Pay attention to indentation and syntax'
      ]
    };
  }

  private validateCodeCompletion(userCode: string, expectedCode: string[]): {
    isCorrect: boolean;
    feedback: string;
    hints: string[];
  } {
    // Check if user's completion matches expected patterns
    const isCorrect = expectedCode.some(expected =>
      userCode.includes(expected) || userCode.trim() === expected.trim()
    );

    return {
      isCorrect,
      feedback: isCorrect
        ? 'Great job! Your code completion is correct.'
        : 'Almost there! Check your code completion.',
      hints: isCorrect ? [] : [
        'Make sure you completed the code correctly',
        'Check for any syntax errors',
        'Verify the logic matches the requirements'
      ]
    };
  }

  private validatePuzzleResponse(userCode: string, expectedCode: string[]): {
    isCorrect: boolean;
    feedback: string;
    hints: string[];
  } {
    // For puzzle games, check against expected answers
    const isCorrect = expectedCode.includes(userCode.trim());

    return {
      isCorrect,
      feedback: isCorrect
        ? 'Excellent! You solved the puzzle correctly!'
        : 'Not quite right. Try again!',
      hints: isCorrect ? [] : [
        'Think carefully about the problem',
        'Review the question and requirements',
        'Consider all the information provided'
      ]
    };
  }

  private validateGenericCode(userCode: string, expectedCode: string[]): {
    isCorrect: boolean;
    feedback: string;
    hints: string[];
  } {
    try {
      // Basic syntax check
      new Function(userCode);

      const isCorrect = expectedCode.some(expected =>
        userCode.includes(expected)
      );

      return {
        isCorrect,
        feedback: isCorrect
          ? 'Well done! Your code is correct.'
          : 'Your code has syntax or logic errors.',
        hints: isCorrect ? [] : [
          'Check for syntax errors',
          'Make sure your logic matches the requirements',
          'Test your code with sample inputs'
        ]
      };
    } catch (error) {
      return {
        isCorrect: false,
        feedback: `Syntax error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        hints: [
          'Fix the syntax errors in your code',
          'Check for missing parentheses or brackets',
          'Verify proper indentation'
        ]
      };
    }
  }

  // Get execution statistics
  getExecutionStats(): {
    totalExecutions: number;
    averageExecutionTime: number;
    successRate: number;
    mostCommonErrors: Array<{ error: string; count: number }>;
  } {
    // In a real implementation, this would query actual execution data
    return {
      totalExecutions: 0,
      averageExecutionTime: 0,
      successRate: 0,
      mostCommonErrors: []
    };
  }

  // Update execution limits
  updateExecutionLimits(limits: Partial<ExecutionLimits>): void {
    this.executionLimits = { ...this.executionLimits, ...limits };
  }

  // Get current execution limits
  getExecutionLimits(): ExecutionLimits {
    return { ...this.executionLimits };
  }
}

export default CodeExecutionService.getInstance();