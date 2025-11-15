import { useEffect, useState } from 'react';
import { Zap, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { CodeEditor } from '../CodeEditor';

type Challenge = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  xp_reward: number;
  problem_statement: string;
  starter_code: string | null;
  test_cases: Array<{ input: string; expectedOutput: string }>;
  hints: string[] | null;
};

export const CodeChallengesView = () => {
  const { profile, refreshProfile } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userAttempts, setUserAttempts] = useState<Record<string, any>>({});
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    loadChallenges();
  }, [profile]);

  const loadChallenges = async () => {
    try {
      const { data } = await supabase
        .from('code_challenges')
        .select('*')
        .order('difficulty');

      if (data && data.length > 0) {
        setChallenges(data);

        if (profile) {
          const { data: attemptsData } = await supabase
            .from('user_code_attempts')
            .select('*')
            .eq('user_id', profile.id);

          if (attemptsData) {
            const attemptsMap = attemptsData.reduce((acc, a) => {
              acc[a.challenge_id] = a;
              return acc;
            }, {} as Record<string, any>);
            setUserAttempts(attemptsMap);
          }
        }
      } else {
        // Use sample challenges when database is empty
        setChallenges(getSampleChallenges());
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
      // Fallback to sample challenges on error
      setChallenges(getSampleChallenges());
    }

    setLoading(false);
  };

  // Sample practice challenges when database is empty
  const getSampleChallenges = (): Challenge[] => {
    return [
      {
        id: 'sample-1',
        title: 'Hello World',
        description: 'Write your first Python program',
        difficulty: 'easy',
        category: 'basics',
        xp_reward: 10,
        problem_statement: 'Write a Python program that prints "Hello, World!" to the console.',
        starter_code: '# Your code here\n',
        test_cases: [
          { input: '', expectedOutput: 'Hello, World!' }
        ],
        hints: [
          'Use the print() function to display text',
          'Remember to put your text in quotes',
          'print("Hello, World!") will display the message'
        ]
      },
      {
        id: 'sample-2',
        title: 'Variables and Data Types',
        description: 'Practice creating and using variables',
        difficulty: 'easy',
        category: 'basics',
        xp_reward: 15,
        problem_statement: 'Create variables for your name, age, and favorite color. Then print them in a formatted sentence.',
        starter_code: '# Create variables\nname = \nage = \nfavorite_color = \n\n# Print formatted sentence\nprint()',
        test_cases: [
          { input: '', expectedOutput: 'Contains name, age, and color' }
        ],
        hints: [
          'Use assignment operator (=) to create variables',
          'Use f-strings for formatted output: f"text {variable}"',
          'Strings need quotes, numbers don\'t'
        ]
      },
      {
        id: 'sample-3',
        title: 'Basic Math Operations',
        description: 'Practice arithmetic operations in Python',
        difficulty: 'easy',
        category: 'math',
        xp_reward: 15,
        problem_statement: 'Create two numbers (x=10, y=5) and perform addition, subtraction, multiplication, and division. Print all results.',
        starter_code: '# Define numbers\nx = 10\ny = 5\n\n# Perform operations and print results\n',
        test_cases: [
          { input: '', expectedOutput: '15, 5, 50, 2.0' }
        ],
        hints: [
          'Use + for addition, - for subtraction',
          'Use * for multiplication, / for division',
          'Print each result on a separate line'
        ]
      },
      {
        id: 'sample-4',
        title: 'List Operations',
        description: 'Practice working with Python lists',
        difficulty: 'medium',
        category: 'data-structures',
        xp_reward: 20,
        problem_statement: 'Create a list of fruits. Add two more fruits, remove one fruit, and print the final list with its length.',
        starter_code: '# Create a list of fruits\nfruits = ["apple", "banana", "orange"]\n\n# Modify the list\n\n# Print final list and length',
        test_cases: [
          { input: '', expectedOutput: 'Modified list with length' }
        ],
        hints: [
          'Use append() to add items to a list',
          'Use remove() to delete a specific item',
          'Use len() to get the length of a list'
        ]
      },
      {
        id: 'sample-5',
        title: 'Simple Function',
        description: 'Create your first Python function',
        difficulty: 'medium',
        category: 'functions',
        xp_reward: 25,
        problem_statement: 'Write a function called greet() that takes a name as parameter and returns "Hello, [name]!". Call the function with your name.',
        starter_code: '# Define the function\ndef greet(name):\n    # Your code here\n    pass\n\n# Call the function\nresult = greet("Your Name")\nprint(result)',
        test_cases: [
          { input: '', expectedOutput: 'Hello, Your Name!' }
        ],
        hints: [
          'Use def keyword to define a function',
          'Use return statement to send back a value',
          'Use f-strings to combine text with variables'
        ]
      },
      {
        id: 'sample-6',
        title: 'For Loop Practice',
        description: 'Practice using for loops to iterate',
        difficulty: 'medium',
        category: 'loops',
        xp_reward: 25,
        problem_statement: 'Create a list of numbers 1-5. Use a for loop to print each number doubled (2, 4, 6, 8, 10).',
        starter_code: '# Create list\nnumbers = [1, 2, 3, 4, 5]\n\n# Use for loop to print doubled values',
        test_cases: [
          { input: '', expectedOutput: '2, 4, 6, 8, 10' }
        ],
        hints: [
          'Use "for num in numbers:" to iterate',
          'Multiply each number by 2 inside the loop',
          'Use print() to display each result'
        ]
      },
      {
        id: 'sample-7',
        title: 'If-Else Conditions',
        description: 'Practice conditional logic',
        difficulty: 'medium',
        category: 'conditionals',
        xp_reward: 20,
        problem_statement: 'Write a program that checks if a number is positive, negative, or zero and prints the appropriate message.',
        starter_code: '# Test with different numbers\nnumber = 5\n\n# Add your conditional logic here',
        test_cases: [
          { input: '', expectedOutput: 'Correct classification' }
        ],
        hints: [
          'Use if-elif-else for multiple conditions',
          'Check if number > 0, < 0, or == 0',
          'Use comparison operators: >, <, =='
        ]
      },
      {
        id: 'sample-8',
        title: 'Dictionary Practice',
        description: 'Practice working with Python dictionaries',
        difficulty: 'hard',
        category: 'data-structures',
        xp_reward: 30,
        problem_statement: 'Create a dictionary for a student with name, age, and grades. Add a new subject and print all key-value pairs.',
        starter_code: '# Create student dictionary\nstudent = {\n    "name": "Alice",\n    "age": 20,\n    "grades": {"math": 90, "science": 85}\n}\n\n# Add new subject and print all data',
        test_cases: [
          { input: '', expectedOutput: 'Dictionary with 4 items' }
        ],
        hints: [
          'Use dict[key] = value to add new items',
          'Use for key, value in dict.items() to iterate',
          'Print each key-value pair in a readable format'
        ]
      }
    ];
  };

  const selectChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setCode(challenge.starter_code || '');
    setResult(null);
    setShowHint(false);
  };

  const simulateCodeExecution = (userCode: string, challenge: Challenge) => {
    try {
      // Check if code is empty or just placeholder
      if (userCode.trim().length === 0 || userCode.includes('# Your code here') || userCode.includes('pass')) {
        return { success: false, message: 'Please write some code to solve the challenge!' };
      }

      // Basic syntax validation based on challenge requirements
      let score = 0;
      let message = '';

      // Check for Hello World challenge
      if (challenge.id === 'sample-1') {
        if (userCode.includes('print') && userCode.includes('Hello, World!')) {
          score = 100;
          message = 'Perfect! Your Hello World program works correctly! 🎉';
        } else if (userCode.includes('print')) {
          score = 60;
          message = 'Good start! Make sure to print exactly "Hello, World!"';
        } else {
          score = 20;
          message = 'Remember to use the print() function to display text';
        }
      }
      // Check for Variables challenge
      else if (challenge.id === 'sample-2') {
        const hasName = userCode.includes('name =');
        const hasAge = userCode.includes('age =');
        const hasColor = userCode.includes('favorite_color =');
        const hasPrint = userCode.includes('print');

        if (hasName && hasAge && hasColor && hasPrint) {
          score = 100;
          message = 'Excellent! You\'ve successfully created and used variables! 🌟';
        } else if (hasName && hasAge && hasColor) {
          score = 80;
          message = 'Great variable creation! Now try to print them in a formatted sentence.';
        } else if (hasName || hasAge || hasColor) {
          score = 50;
          message = 'Good start! Try creating all three variables and printing them.';
        } else {
          score = 20;
          message = 'Try creating variables using the assignment operator (=)';
        }
      }
      // Check for Math Operations challenge
      else if (challenge.id === 'sample-3') {
        const hasAddition = userCode.includes('+');
        const hasSubtraction = userCode.includes('-');
        const hasMultiplication = userCode.includes('*');
        const hasDivision = userCode.includes('/');

        const operations = [hasAddition, hasSubtraction, hasMultiplication, hasDivision].filter(Boolean).length;

        if (operations === 4) {
          score = 100;
          message = 'Perfect! You\'ve mastered all basic math operations! 🧮✨';
        } else if (operations >= 3) {
          score = 85;
          message = 'Great work! You\'ve implemented most operations. Try to add all four!';
        } else if (operations >= 2) {
          score = 70;
          message = 'Good progress! Keep adding more operations to complete the challenge.';
        } else if (operations === 1) {
          score = 50;
          message = 'Nice start! Try adding more math operations.';
        } else {
          score = 20;
          message = 'Try using math operators: +, -, *, /';
        }
      }
      // Check for List Operations challenge
      else if (challenge.id === 'sample-4') {
        const hasAppend = userCode.includes('append(');
        const hasRemove = userCode.includes('remove(');
        const hasListOps = hasAppend && hasRemove;

        if (hasListOps && userCode.includes('len(')) {
          score = 100;
          message = 'Excellent! You\'ve mastered list operations! 📋🎯';
        } else if (hasListOps) {
          score = 85;
          message = 'Great work on list modification! Try adding the length check.';
        } else if (hasAppend || hasRemove) {
          score = 60;
          message = 'Good start! Try to add both append and remove operations.';
        } else {
          score = 30;
          message = 'Try using list methods like append() and remove()';
        }
      }
      // Check for Function challenge
      else if (challenge.id === 'sample-5') {
        const hasDef = userCode.includes('def greet(');
        const hasReturn = userCode.includes('return');
        const hasCall = userCode.includes('greet(');

        if (hasDef && hasReturn && hasCall) {
          score = 100;
          message = 'Perfect! You\'ve created your first Python function! 🚀🎉';
        } else if (hasDef && hasReturn) {
          score = 85;
          message = 'Great function! Try calling it to see the result.';
        } else if (hasDef) {
          score = 60;
          message = 'Good function definition! Try adding a return statement.';
        } else {
          score = 30;
          message = 'Try defining a function using the def keyword.';
        }
      }
      // Check for Loop challenge
      else if (challenge.id === 'sample-6') {
        const hasFor = userCode.includes('for ') && userCode.includes(' in ');
        const hasMultiplication = userCode.includes('* 2');

        if (hasFor && hasMultiplication) {
          score = 100;
          message = 'Perfect! You\'ve mastered for loops! 🔄✨';
        } else if (hasFor) {
          score = 75;
          message = 'Great loop! Try adding the multiplication to double the numbers.';
        } else if (hasMultiplication) {
          score = 50;
          message = 'Good math! Try adding a for loop to iterate through the list.';
        } else {
          score = 25;
          message = 'Try using a for loop: "for num in numbers:"';
        }
      }
      // Check for Conditionals challenge
      else if (challenge.id === 'sample-7') {
        const hasIf = userCode.includes('if ');
        const hasOperators = userCode.includes('>') || userCode.includes('<') || userCode.includes('==');
        const hasElse = userCode.includes('elif ') || userCode.includes('else:');

        if (hasIf && hasOperators && hasElse) {
          score = 100;
          message = 'Perfect! You\'ve mastered conditional logic! 🔀🎯';
        } else if (hasIf && hasOperators) {
          score = 85;
          message = 'Great condition! Try adding else/elif for complete coverage.';
        } else if (hasIf) {
          score = 60;
          message = 'Good start! Try adding comparison operators like >, <, ==';
        } else {
          score = 30;
          message = 'Try using if-elif-else for conditional logic.';
        }
      }
      // Check for Dictionary challenge
      else if (challenge.id === 'sample-8') {
        const hasDictAccess = userCode.includes('[') && userCode.includes(']');
        const hasItems = userCode.includes('.items()');
        const hasIteration = userCode.includes('for ') && userCode.includes(' in ');

        if (hasDictAccess && hasItems && hasIteration) {
          score = 100;
          message = 'Excellent! You\'ve mastered dictionaries! 🗂️🎉';
        } else if (hasDictAccess && hasIteration) {
          score = 85;
          message = 'Great dictionary work! Try using .items() to iterate through key-value pairs.';
        } else if (hasDictAccess) {
          score = 70;
          message = 'Good dictionary access! Try adding iteration to print all items.';
        } else {
          score = 40;
          message = 'Try accessing dictionary values using dict[key] syntax.';
        }
      }
      // Generic scoring for other challenges
      else {
        const hasFunctions = userCode.includes('def ');
        const hasLoops = userCode.includes('for ') || userCode.includes('while ');
        const hasConditionals = userCode.includes('if ');
        const hasVariables = /[a-zA-Z_][a-zA-Z0-9_]*\s*=/.test(userCode);
        const hasPrint = userCode.includes('print');

        let features = 0;
        if (hasFunctions) features++;
        if (hasLoops) features++;
        if (hasConditionals) features++;
        if (hasVariables) features++;
        if (hasPrint) features++;

        score = Math.min(features * 25, 100);

        if (score >= 75) {
          message = 'Great solution! Your code shows good understanding of Python concepts! 👍';
        } else if (score >= 50) {
          message = 'Good attempt! Try adding more Python features to improve your solution.';
        } else if (score >= 25) {
          message = 'Nice start! Keep building on your code to solve the challenge.';
        } else {
          message = 'Keep trying! Write some Python code to solve the problem.';
        }
      }

      return {
        success: score >= 70,
        message,
        score
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error: ' + (error instanceof Error ? error.message : 'Unknown error')
      };
    }
  };

  const handleSubmit = async () => {
    if (!selectedChallenge || !profile) return;

    setIsSubmitting(true);

    try {
      const executionResult = simulateCodeExecution(code, selectedChallenge);
      setResult(executionResult);

      // For sample challenges, store progress locally (no database operations)
      if (selectedChallenge.id.startsWith('sample-')) {
        // Store in local state for sample challenges
        const newAttempt = {
          id: `${selectedChallenge.id}-${profile.id}`,
          challenge_id: selectedChallenge.id,
          solution_code: code,
          passed: executionResult.success,
          completed_at: new Date().toISOString(),
          attempts_count: (userAttempts[selectedChallenge.id]?.attempts_count || 0) + 1,
          score: executionResult.score || 0
        };

        setUserAttempts(prev => ({
          ...prev,
          [selectedChallenge.id]: newAttempt
        }));

        // Award XP for successful completion of sample challenges
        if (executionResult.success) {
          try {
            await supabase
              .from('profiles')
              .update({
                total_xp: profile.total_xp + selectedChallenge.xp_reward,
                current_level: Math.floor((profile.total_xp + selectedChallenge.xp_reward) / 100) + 1,
              })
              .eq('id', profile.id);

            await refreshProfile();
          } catch (error) {
            console.error('Error updating XP for sample challenge:', error);
          }
        }
      } else {
        // Handle database challenges normally
        if (executionResult.success) {
          const existingAttempt = userAttempts[selectedChallenge.id];

          if (existingAttempt) {
            await supabase
              .from('user_code_attempts')
              .update({
                solution_code: code,
                passed: true,
                completed_at: new Date().toISOString(),
                attempts_count: existingAttempt.attempts_count + 1,
              })
              .eq('id', existingAttempt.id);
          } else {
            await supabase.from('user_code_attempts').insert({
              user_id: profile.id,
              challenge_id: selectedChallenge.id,
              solution_code: code,
              passed: true,
              completed_at: new Date().toISOString(),
            });
          }

          await supabase
            .from('profiles')
            .update({
              total_xp: profile.total_xp + selectedChallenge.xp_reward,
              current_level: Math.floor((profile.total_xp + selectedChallenge.xp_reward) / 100) + 1,
            })
            .eq('id', profile.id);

          await refreshProfile();
          await loadChallenges();
        } else {
          const existingAttempt = userAttempts[selectedChallenge.id];
          if (existingAttempt) {
            await supabase
              .from('user_code_attempts')
              .update({
                attempts_count: existingAttempt.attempts_count + 1,
              })
              .eq('id', existingAttempt.id);
          }
        }
      }
    } catch (error) {
      console.error('Error submitting challenge:', error);
      setResult({ success: false, message: 'Error submitting solution' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading challenges...</div>
      </div>
    );
  }

  if (!selectedChallenge) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Code Challenges</h2>
          <p className="text-slate-400">Solve real coding problems to master Python</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge) => {
            const attempt = userAttempts[challenge.id];
            const isCompleted = attempt?.passed;

            return (
              <button
                key={challenge.id}
                onClick={() => selectChallenge(challenge)}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-all group text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
                      {challenge.title}
                    </h3>
                    <p className="text-slate-400 text-sm">{challenge.description}</p>
                  </div>
                  {isCompleted && <CheckCircle className="text-green-500 flex-shrink-0" size={24} />}
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full capitalize">
                    {challenge.difficulty}
                  </span>
                  <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                    {challenge.category}
                  </span>
                  <span className="text-yellow-500 text-sm font-semibold ml-auto">
                    +{challenge.xp_reward} XP
                  </span>
                </div>

                {attempt && (
                  <div className="mt-4 text-xs text-slate-400">
                    Attempts: {attempt.attempts_count}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {challenges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No challenges available yet. Check back soon!</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <button
        onClick={() => setSelectedChallenge(null)}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
      >
        <ArrowRight size={18} className="rotate-180" />
        Back to Challenges
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">{selectedChallenge.title}</h2>
            <p className="text-slate-400 mb-4">{selectedChallenge.description}</p>

            <div className="flex gap-2 flex-wrap mb-4">
              <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full capitalize">
                {selectedChallenge.difficulty}
              </span>
              <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                {selectedChallenge.category}
              </span>
              <span className="text-xs bg-yellow-900/30 border border-yellow-700 text-yellow-400 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                <Zap size={12} />
                +{selectedChallenge.xp_reward} XP
              </span>
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-6 mb-6">
            <h3 className="text-white font-semibold mb-3">Problem Statement</h3>
            <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
              {selectedChallenge.problem_statement}
            </p>
          </div>

          <div className="bg-slate-900 rounded-lg p-6 mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Clock size={18} />
              Test Cases
            </h3>
            <div className="space-y-3">
              {selectedChallenge.test_cases.map((test, index) => (
                <div key={index} className="text-sm bg-slate-800 rounded p-3 border border-slate-700">
                  <p className="text-slate-400 mb-1">Input: <span className="text-white font-mono">{test.input}</span></p>
                  <p className="text-slate-400">Expected: <span className="text-white font-mono">{test.expectedOutput}</span></p>
                </div>
              ))}
            </div>
          </div>

          {selectedChallenge.hints && selectedChallenge.hints.length > 0 && (
            <div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors"
              >
                {showHint ? '▼ Hide Hints' : '▶ Show Hints'}
              </button>
              {showHint && (
                <div className="mt-3 space-y-2 bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  {selectedChallenge.hints.map((hint, index) => (
                    <div key={index} className="text-sm text-blue-300">
                      <span className="font-semibold">Hint {index + 1}:</span> {hint}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <CodeEditor value={code} onChange={setCode} initialCode={selectedChallenge.starter_code || ''} />

          {result && (
            <div
              className={`mt-4 p-4 rounded-lg border ${
                result.success
                  ? 'bg-green-900/20 border-green-700'
                  : 'bg-red-900/20 border-red-700'
              }`}
            >
              <p className={result.success ? 'text-green-400' : 'text-red-400'}>
                {result.message}
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="mt-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Solution'}
          </button>
        </div>
      </div>
    </div>
  );
};
