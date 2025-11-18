import { useEffect, useState } from 'react';
import { Zap, CheckCircle, Clock, ArrowRight, Brain } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

type InterviewQuestion = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  test_cases: Array<{ input: string; expectedOutput: string }>;
  hints: string[] | null;
};

export const InterviewPrepView = () => {
  const { profile } = useAuth();
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [userAttempts, setUserAttempts] = useState<Record<string, any>>({});

  useEffect(() => {
    loadQuestions();
  }, [profile]);

  useEffect(() => {
    if (!isTimerRunning || timeLeft === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const loadQuestions = async () => {
    try {
      const { data } = await supabase
        .from('interview_questions')
        .select('*')
        .order('difficulty')
        .limit(20);

      if (data && data.length > 0) {
        setQuestions(data);

        if (profile) {
          const { data: attemptsData } = await supabase
            .from('user_interview_attempts')
            .select('*')
            .eq('user_id', profile.id);

          if (attemptsData) {
            const attemptsMap = attemptsData.reduce((acc, a) => {
              acc[a.question_id] = a;
              return acc;
            }, {} as Record<string, any>);
            setUserAttempts(attemptsMap);
          }
        }
      } else {
        // Use sample interview questions when database is empty
        setQuestions(getSampleInterviewQuestions());
      }
    } catch (error) {
      console.error('Error loading interview questions:', error);
      // Fallback to sample questions on error
      setQuestions(getSampleInterviewQuestions());
    }

    setLoading(false);
  };

  // Sample interview questions when database is empty
  const getSampleInterviewQuestions = (): InterviewQuestion[] => {
    return [
      {
        id: 'interview-1',
        title: 'Two Sum Problem',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        difficulty: 'easy',
        category: 'arrays',
        test_cases: [
          { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0,1]' },
          { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1,2]' }
        ],
        hints: [
          'Use a hash map to store previously seen numbers',
          'For each number, check if (target - current) exists in the hash map',
          'Hash map lookup is O(1), making overall solution O(n)'
        ]
      },
      {
        id: 'interview-2',
        title: 'Reverse Linked List',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        difficulty: 'medium',
        category: 'linked-lists',
        test_cases: [
          { input: 'head = [1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]' },
          { input: 'head = [1,2]', expectedOutput: '[2,1]' }
        ],
        hints: [
          'Use three pointers: prev, current, and next',
          'Store next node before changing the current node\'s pointer',
          'Move all three pointers forward until current becomes null'
        ]
      },
      {
        id: 'interview-3',
        title: 'Valid Parentheses',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        difficulty: 'easy',
        category: 'stacks',
        test_cases: [
          { input: 's = "()"', expectedOutput: 'true' },
          { input: 's = "()[]{}"', expectedOutput: 'true' },
          { input: 's = "(]"', expectedOutput: 'false' }
        ],
        hints: [
          'Use a stack to keep track of opening brackets',
          'For each closing bracket, check if it matches the top of the stack',
          'At the end, stack should be empty for valid parentheses'
        ]
      },
      {
        id: 'interview-4',
        title: 'Merge Two Sorted Lists',
        description: 'Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.',
        difficulty: 'medium',
        category: 'linked-lists',
        test_cases: [
          { input: 'l1 = [1,2,4], l2 = [1,3,4]', expectedOutput: '[1,1,2,3,4,4]' },
          { input: 'l1 = [], l2 = []', expectedOutput: '[]' }
        ],
        hints: [
          'Use two pointers to traverse both lists simultaneously',
          'Compare nodes and connect the smaller one to the result',
          'Handle the case where one list is exhausted before the other'
        ]
      },
      {
        id: 'interview-5',
        title: 'Binary Tree Maximum Path Sum',
        description: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge connecting them. Find the maximum path sum.',
        difficulty: 'hard',
        category: 'trees',
        test_cases: [
          { input: 'root = [1,2,3]', expectedOutput: '6' },
          { input: 'root = [-10,9,20,null,null,15,7]', expectedOutput: '42' }
        ],
        hints: [
          'Use post-order traversal to compute maximum sums',
          'For each node, calculate max path sum through it and max sum ending at it',
          'Keep track of global maximum throughout the traversal'
        ]
      },
      {
        id: 'interview-6',
        title: 'LRU Cache',
        description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
        difficulty: 'hard',
        category: 'design',
        test_cases: [
          { input: 'put(1,1), put(2,2), get(1), put(3,3), get(2)', expectedOutput: '1, -1' }
        ],
        hints: [
          'Use combination of hash map and doubly linked list',
          'Hash map provides O(1) access to nodes',
          'Linked list maintains recency order for O(1) updates'
        ]
      },
      {
        id: 'interview-7',
        title: 'Product of Array Except Self',
        description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all elements of nums except nums[i].',
        difficulty: 'medium',
        category: 'arrays',
        test_cases: [
          { input: 'nums = [1,2,3,4]', expectedOutput: '[24,12,8,6]' },
          { input: 'nums = [-1,1,0,-3,3]', expectedOutput: '[0,0,9,0,0]' }
        ],
        hints: [
          'Compute prefix products and suffix products separately',
          'Answer[i] = prefix[i-1] * suffix[i+1]',
          'Handle edge cases for first and last elements'
        ]
      },
      {
        id: 'interview-8',
        title: 'Word Search',
        description: 'Given an m x n grid of characters board and a string word, return true if word exists in the grid.',
        difficulty: 'medium',
        category: 'backtracking',
        test_cases: [
          { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', expectedOutput: 'true' },
          { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"', expectedOutput: 'true' }
        ],
        hints: [
          'Use DFS with backtracking to explore all possible paths',
          'Mark visited cells to avoid cycles',
          'Unmark cells when backtracking for other paths'
        ]
      }
    ];
  };

  const startInterview = (question: InterviewQuestion) => {
    setSelectedQuestion(question);
    setTimeLeft(600);
    setIsTimerRunning(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading questions...</div>
      </div>
    );
  }

  if (!selectedQuestion) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Interview Preparation</h2>
          <p className="text-slate-400">Practice questions from real coding interviews</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((question) => {
            const attempt = userAttempts[question.id];

            return (
              <button
                key={question.id}
                onClick={() => startInterview(question)}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-all group text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
                      {question.title}
                    </h3>
                    <p className="text-slate-400 text-sm">{question.description}</p>
                  </div>
                  {attempt?.passed && <CheckCircle className="text-green-500 flex-shrink-0" size={24} />}
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full capitalize">
                    {question.difficulty}
                  </span>
                  <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                    {question.category}
                  </span>
                </div>

                {attempt && (
                  <div className="mt-4 text-xs text-slate-400">
                    Attempts: {attempt.id ? 1 : 0}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {questions.length === 0 && (
          <div className="text-center py-12">
            <Brain className="text-slate-600 mx-auto mb-4" size={48} />
            <p className="text-slate-400">No interview questions available yet</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            setSelectedQuestion(null);
            setIsTimerRunning(false);
          }}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowRight size={18} className="rotate-180" />
          Back to Questions
        </button>

        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${
            timeLeft < 60
              ? 'bg-red-900/30 border border-red-700 text-red-400'
              : 'bg-blue-900/30 border border-blue-700 text-blue-400'
          }`}
        >
          <Clock size={20} />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-xs bg-slate-700 text-slate-300 rounded-full capitalize mb-3">
                {selectedQuestion.category}
              </span>
              <h2 className="text-3xl font-bold text-white mb-2">{selectedQuestion.title}</h2>
              <p className="text-slate-400">{selectedQuestion.description}</p>
            </div>

            <div className="bg-slate-900 rounded-lg p-6 mb-6">
              <h3 className="text-white font-semibold mb-3">Question</h3>
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {selectedQuestion.description}
              </p>
            </div>

            <div className="bg-slate-900 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-3">Test Cases</h3>
              <div className="space-y-3">
                {selectedQuestion.test_cases.map((test, index) => (
                  <div key={index} className="text-sm bg-slate-800 rounded p-3 border border-slate-700">
                    <p className="text-slate-400 mb-1">Input: <span className="text-white font-mono">{test.input}</span></p>
                    <p className="text-slate-400">Expected: <span className="text-white font-mono">{test.expectedOutput}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-700">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Brain size={20} />
              Interview Tips
            </h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>Think out loud and explain your approach</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>Ask clarifying questions about the problem</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>Discuss time and space complexity</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>Start with a brute force solution</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>Walk through examples before coding</span>
              </li>
            </ul>
          </div>

          {selectedQuestion.hints && selectedQuestion.hints.length > 0 && (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-white font-bold mb-3">Hints</h3>
              <ul className="space-y-2">
                {selectedQuestion.hints.map((hint, index) => (
                  <div key={index} className="text-sm text-slate-300 p-2 bg-slate-900 rounded">
                    <span className="text-blue-400 font-semibold">Hint {index + 1}:</span> {hint}
                  </div>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => {
              setSelectedQuestion(null);
              setIsTimerRunning(false);
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Submit Answer
          </button>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-sm text-slate-400">
            <p className="mb-2">Time remaining is kept for your reference.</p>
            <p>In real interviews, explain your thought process clearly!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
