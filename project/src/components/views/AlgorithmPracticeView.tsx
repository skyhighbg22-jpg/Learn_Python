import { useEffect, useState } from 'react';
import { Zap, CheckCircle, BookOpen, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { CodeEditor } from '../CodeEditor';

type AlgorithmProblem = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  xp_reward: number;
  problem_statement: string;
  explanation: string;
  time_complexity: string;
  space_complexity: string;
  test_cases: Array<{ input: string; expectedOutput: string }>;
  solution_code: string;
  hints: string[] | null;
};

export const AlgorithmPracticeView = () => {
  const { profile, refreshProfile } = useAuth();
  const [problems, setProblems] = useState<AlgorithmProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState<AlgorithmProblem | null>(null);
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userAttempts, setUserAttempts] = useState<Record<string, any>>({});

  useEffect(() => {
    loadProblems();
  }, [profile]);

  const loadProblems = async () => {
    try {
      const { data } = await supabase
        .from('algorithm_problems')
        .select('*')
        .order('difficulty');

      if (data && data.length > 0) {
        setProblems(data);

        if (profile) {
          const { data: attemptsData } = await supabase
            .from('user_algorithm_attempts')
            .select('*')
            .eq('user_id', profile.id);

          if (attemptsData) {
            const attemptsMap = attemptsData.reduce((acc, a) => {
              acc[a.problem_id] = a;
              return acc;
            }, {} as Record<string, any>);
            setUserAttempts(attemptsMap);
          }
        }
      } else {
        // Use sample algorithm problems when database is empty
        setProblems(getSampleAlgorithmProblems());
      }
    } catch (error) {
      console.error('Error loading algorithm problems:', error);
      // Fallback to sample problems on error
      setProblems(getSampleAlgorithmProblems());
    }

    setLoading(false);
  };

  // Sample algorithm problems when database is empty
  const getSampleAlgorithmProblems = (): AlgorithmProblem[] => {
    return [
      {
        id: 'algo-1',
        title: 'Binary Search',
        description: 'Implement binary search algorithm for sorted arrays',
        difficulty: 'easy',
        category: 'searching',
        xp_reward: 25,
        problem_statement: 'Write a function that takes a sorted array and a target value, and returns the index of the target if it exists, or -1 if it doesn\'t exist.\n\nExample:\nInput: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4\n\nInput: nums = [-1,0,3,5,9,12], target = 2\nOutput: -1',
        explanation: 'Binary search works by repeatedly dividing the search interval in half. If the value of the search key is less than the item in the middle of the interval, narrow the interval to the lower half. Otherwise narrow it to the upper half.',
        time_complexity: 'O(log n)',
        space_complexity: 'O(1)',
        test_cases: [
          { input: 'nums = [-1,0,3,5,9,12], target = 9', expectedOutput: '4' },
          { input: 'nums = [-1,0,3,5,9,12], target = 2', expectedOutput: '-1' }
        ],
        solution_code: 'def binary_search(nums, target):\n    left, right = 0, len(nums) - 1\n    \n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    \n    return -1\n\n# Test\nprint(binary_search([-1,0,3,5,9,12], 9))  # 4\nprint(binary_search([-1,0,3,5,9,12], 2))  # -1',
        hints: [
          'Initialize two pointers: left at 0 and right at the last index',
          'Calculate middle index as (left + right) // 2',
          'Compare middle element with target and adjust pointers accordingly'
        ]
      },
      {
        id: 'algo-2',
        title: 'Bubble Sort',
        description: 'Implement bubble sort algorithm to sort an array',
        difficulty: 'easy',
        category: 'sorting',
        xp_reward: 20,
        problem_statement: 'Write a function that sorts an array using bubble sort algorithm.\n\nExample:\nInput: [64, 34, 25, 12, 22, 11, 90]\nOutput: [11, 12, 22, 25, 34, 64, 90]',
        explanation: 'Bubble sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
        time_complexity: 'O(n²)',
        space_complexity: 'O(1)',
        test_cases: [
          { input: '[64, 34, 25, 12, 22, 11, 90]', expectedOutput: '[11, 12, 22, 25, 34, 64, 90]' },
          { input: '[5, 1, 4, 2, 8]', expectedOutput: '[1, 2, 4, 5, 8]' }
        ],
        solution_code: 'def bubble_sort(arr):\n    n = len(arr)\n    \n    for i in range(n):\n        # Flag to optimize if array is already sorted\n        swapped = False\n        \n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        \n        # If no two elements were swapped, array is sorted\n        if not swapped:\n            break\n    \n    return arr\n\n# Test\nprint(bubble_sort([64, 34, 25, 12, 22, 11, 90]))',
        hints: [
          'Use nested loops - outer loop for passes, inner loop for comparisons',
          'Compare adjacent elements and swap if in wrong order',
          'After each pass, the largest element "bubbles" to the end'
        ]
      },
      {
        id: 'algo-3',
        title: 'Quick Sort',
        description: 'Implement quick sort algorithm with recursive partitioning',
        difficulty: 'medium',
        category: 'sorting',
        xp_reward: 35,
        problem_statement: 'Write a function that sorts an array using quick sort algorithm.\n\nExample:\nInput: [10, 7, 8, 9, 1, 5]\nOutput: [1, 5, 7, 8, 9, 10]',
        explanation: 'Quick sort is a divide-and-conquer algorithm that picks a pivot element and partitions the array around it, then recursively sorts the sub-arrays.',
        time_complexity: 'O(n log n) average, O(n²) worst',
        space_complexity: 'O(log n)',
        test_cases: [
          { input: '[10, 7, 8, 9, 1, 5]', expectedOutput: '[1, 5, 7, 8, 9, 10]' },
          { input: '[3, 6, 8, 10, 1, 2, 1]', expectedOutput: '[1, 1, 2, 3, 6, 8, 10]' }
        ],
        solution_code: 'def quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    \n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    \n    return quick_sort(left) + middle + quick_sort(right)\n\n# Test\nprint(quick_sort([10, 7, 8, 9, 1, 5]))',
        hints: [
          'Choose a pivot element (middle, first, last, or random)',
          'Partition array into elements less than, equal to, and greater than pivot',
          'Recursively apply quick sort to left and right partitions'
        ]
      },
      {
        id: 'algo-4',
        title: 'Depth First Search (DFS)',
        description: 'Implement DFS traversal for a graph or tree',
        difficulty: 'medium',
        category: 'graph-algorithms',
        xp_reward: 30,
        problem_statement: 'Implement DFS traversal for a graph represented as adjacency list.\n\nExample:\nGraph: {0: [1, 2], 1: [2], 2: [0, 3], 3: [3]}\nStarting from vertex 2\nOutput: [2, 0, 1, 3]',
        explanation: 'DFS explores as far as possible along each branch before backtracking. It uses a stack (can be implemented with recursion) to keep track of nodes to visit.',
        time_complexity: 'O(V + E)',
        space_complexity: 'O(V)',
        test_cases: [
          { input: 'Graph with vertices 0-3, edges: 0-1, 0-2, 1-2, 2-3, 3-3', expectedOutput: 'Depth-first traversal order' }
        ],
        solution_code: 'def dfs(graph, start, visited=None):\n    if visited is None:\n        visited = set()\n    \n    visited.add(start)\n    print(start, end=\' \')\n    \n    for neighbor in graph.get(start, []):\n        if neighbor not in visited:\n            dfs(graph, neighbor, visited)\n    \n    return visited\n\n# Example graph\ngraph = {\n    0: [1, 2],\n    1: [2],\n    2: [0, 3],\n    3: [3]\n}\n\n# Test\ndfs(graph, 2)',
        hints: [
          'Use recursion to explore neighbors before backtracking',
          'Keep track of visited nodes to avoid cycles',
          'For each node, visit all unvisited neighbors recursively'
        ]
      },
      {
        id: 'algo-5',
        title: 'Breadth First Search (BFS)',
        description: 'Implement BFS traversal for a graph using queue',
        difficulty: 'medium',
        category: 'graph-algorithms',
        xp_reward: 30,
        problem_statement: 'Implement BFS traversal for a graph represented as adjacency list.\n\nExample:\nGraph: {0: [1, 2], 1: [2], 2: [0, 3], 3: [3]}\nStarting from vertex 2\nOutput: [2, 0, 3, 1]',
        explanation: 'BFS explores all neighbor nodes at the present depth before moving to nodes at the next depth level. It uses a queue to keep track of nodes to visit.',
        time_complexity: 'O(V + E)',
        space_complexity: 'O(V)',
        test_cases: [
          { input: 'Same graph as DFS, different traversal order', expectedOutput: 'Breadth-first traversal order' }
        ],
        solution_code: 'from collections import deque\n\ndef bfs(graph, start):\n    visited = set()\n    queue = deque([start])\n    visited.add(start)\n    \n    while queue:\n        vertex = queue.popleft()\n        print(vertex, end=\' \')\n        \n        for neighbor in graph.get(vertex, []):\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    \n    return visited\n\n# Example graph\ngraph = {\n    0: [1, 2],\n    1: [2],\n    2: [0, 3],\n    3: [3]\n}\n\n# Test\nbfs(graph, 2)',
        hints: [
          'Use a queue (FIFO) to keep track of nodes to visit',
          'Mark nodes as visited when you enqueue them to prevent duplicates',
          'Process nodes level by level (all neighbors before their neighbors)'
        ]
      },
      {
        id: 'algo-6',
        title: 'Dynamic Programming - Fibonacci',
        description: 'Implement fibonacci sequence using dynamic programming',
        difficulty: 'medium',
        category: 'dynamic-programming',
        xp_reward: 25,
        problem_statement: 'Write a function to calculate the nth Fibonacci number using dynamic programming.\n\nExample:\nInput: n = 10\nOutput: 55\n\nInput: n = 0\nOutput: 0',
        explanation: 'Dynamic programming solves problems by breaking them into subproblems and storing solutions to avoid redundant calculations. The Fibonacci sequence is a classic example.',
        time_complexity: 'O(n)',
        space_complexity: 'O(1)',
        test_cases: [
          { input: 'n = 10', expectedOutput: '55' },
          { input: 'n = 0', expectedOutput: '0' },
          { input: 'n = 1', expectedOutput: '1' }
        ],
        solution_code: 'def fibonacci(n):\n    if n <= 1:\n        return n\n    \n    # Only keep track of last two numbers for O(1) space\n    prev, curr = 0, 1\n    \n    for i in range(2, n + 1):\n        prev, curr = curr, prev + curr\n    \n    return curr\n\n# Test\nfor i in range(10):\n    print(f"F({i}) = {fibonacci(i)}")',
        hints: [
          'Base cases: F(0) = 0, F(1) = 1',
          'For n > 1: F(n) = F(n-1) + F(n-2)',
          'Store only the last two values to optimize space to O(1)'
        ]
      },
      {
        id: 'algo-7',
        title: 'Merge Sort',
        description: 'Implement merge sort algorithm with divide and conquer',
        difficulty: 'hard',
        category: 'sorting',
        xp_reward: 40,
        problem_statement: 'Write a function that sorts an array using merge sort algorithm.\n\nExample:\nInput: [12, 11, 13, 5, 6, 7]\nOutput: [5, 6, 7, 11, 12, 13]',
        explanation: 'Merge sort is a divide-and-conquer algorithm that divides the array into two halves, recursively sorts them, and then merges the two sorted halves.',
        time_complexity: 'O(n log n)',
        space_complexity: 'O(n)',
        test_cases: [
          { input: '[12, 11, 13, 5, 6, 7]', expectedOutput: '[5, 6, 7, 11, 12, 13]' },
          { input: '[38, 27, 43, 3, 9, 82, 10]', expectedOutput: '[3, 9, 10, 27, 38, 43, 82]' }
        ],
        solution_code: 'def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    \n    # Divide the array into two halves\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    \n    # Merge the sorted halves\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    \n    # Compare elements from both arrays\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    \n    # Add remaining elements\n    result.extend(left[i:])\n    result.extend(right[j:])\n    \n    return result\n\n# Test\nprint(merge_sort([12, 11, 13, 5, 6, 7]))',
        hints: [
          'Recursively divide array until size 1, then merge back up',
          'During merge, compare elements from both arrays and pick smaller one',
          'Use a helper function to merge two sorted arrays'
        ]
      },
      {
        id: 'algo-8',
        title: 'Knapsack Problem (0/1)',
        description: 'Implement 0/1 knapsack dynamic programming solution',
        difficulty: 'hard',
        category: 'dynamic-programming',
        xp_reward: 45,
        problem_statement: 'Given weights and values of items, find maximum value subset with given weight capacity.\n\nExample:\nItems: [(value=60, weight=10), (value=100, weight=20), (value=120, weight=30)]\nCapacity: 50\nOutput: 220',
        explanation: 'The 0/1 knapsack problem is solved using dynamic programming by building a table where dp[i][w] represents the maximum value achievable with first i items and weight w.',
        time_complexity: 'O(nW)',
        space_complexity: 'O(W)',
        test_cases: [
          { input: 'Values: [60,100,120], Weights: [10,20,30], Capacity: 50', expectedOutput: '220' },
          { input: 'Values: [10,40,30,50], Weights: [5,4,6,3], Capacity: 10', expectedOutput: '90' }
        ],
        solution_code: 'def knapsack(values, weights, capacity):\n    n = len(values)\n    # dp[i][w] = max value using first i items with weight limit w\n    dp = [[0 for _ in range(capacity + 1)] for _ in range(n + 1)]\n    \n    for i in range(1, n + 1):\n        for w in range(1, capacity + 1):\n            if weights[i-1] <= w:\n                # Include item or don\'t include\n                dp[i][w] = max(\n                    values[i-1] + dp[i-1][w - weights[i-1]],\n                    dp[i-1][w]\n                )\n            else:\n                # Can\'t include item\n                dp[i][w] = dp[i-1][w]\n    \n    return dp[n][capacity]\n\n# Test\nvalues = [60, 100, 120]\nweights = [10, 20, 30]\ncapacity = 50\nprint(f"Maximum value: {knapsack(values, weights, capacity)}")',
        hints: [
          'Build a DP table where rows represent items and columns represent capacities',
          'For each item, decide whether to include it or not based on weight',
          'The answer is in the bottom-right corner of the DP table'
        ]
      }
    ];
  };

  const selectProblem = (problem: AlgorithmProblem) => {
    setSelectedProblem(problem);
    setCode('# Implement your solution here\n');
    setResult(null);
    setShowExplanation(false);
    setShowSolution(false);
  };

  const handleSubmit = async () => {
    if (!selectedProblem || !profile) return;

    setIsSubmitting(true);

    try {
      if (code.trim().length === 0) {
        setResult({ success: false, message: 'Code is empty' });
        setIsSubmitting(false);
        return;
      }

      // Simulate execution
      setResult({ success: true, message: 'Solution accepted!' });

      const existingAttempt = userAttempts[selectedProblem.id];

      if (existingAttempt) {
        await supabase
          .from('user_algorithm_attempts')
          .update({
            solution_code: code,
            passed: true,
            completed_at: new Date().toISOString(),
            attempts_count: existingAttempt.attempts_count + 1,
          })
          .eq('id', existingAttempt.id);
      } else {
        await supabase.from('user_algorithm_attempts').insert({
          user_id: profile.id,
          problem_id: selectedProblem.id,
          solution_code: code,
          passed: true,
          completed_at: new Date().toISOString(),
        });
      }

      await supabase
        .from('profiles')
        .update({
          total_xp: profile.total_xp + selectedProblem.xp_reward,
          current_level: Math.floor((profile.total_xp + selectedProblem.xp_reward) / 100) + 1,
        })
        .eq('id', profile.id);

      await refreshProfile();
      await loadProblems();
    } catch (error) {
      console.error('Error submitting:', error);
      setResult({ success: false, message: 'Error submitting solution' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading problems...</div>
      </div>
    );
  }

  if (!selectedProblem) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Algorithm Practice</h2>
          <p className="text-slate-400">Master fundamental algorithms and data structures</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((problem) => {
            const attempt = userAttempts[problem.id];
            const isCompleted = attempt?.passed;

            return (
              <button
                key={problem.id}
                onClick={() => selectProblem(problem)}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-purple-500 transition-all group text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors mb-1">
                      {problem.title}
                    </h3>
                    <p className="text-slate-400 text-sm">{problem.description}</p>
                  </div>
                  {isCompleted && <CheckCircle className="text-green-500 flex-shrink-0" size={24} />}
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full capitalize">
                    {problem.difficulty}
                  </span>
                  <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                    {problem.category}
                  </span>
                  <span className="text-yellow-500 text-sm font-semibold ml-auto">
                    +{problem.xp_reward} XP
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

        {problems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No problems available yet. Check back soon!</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <button
        onClick={() => setSelectedProblem(null)}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
      >
        <ArrowRight size={18} className="rotate-180" />
        Back to Problems
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-2">{selectedProblem.title}</h2>
            <p className="text-slate-400 mb-4">{selectedProblem.description}</p>

            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full capitalize">
                {selectedProblem.difficulty}
              </span>
              <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                {selectedProblem.category}
              </span>
              <span className="text-xs bg-yellow-900/30 border border-yellow-700 text-yellow-400 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                <Zap size={12} />
                +{selectedProblem.xp_reward} XP
              </span>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <BookOpen size={20} />
              Problem Statement
            </h3>
            <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
              {selectedProblem.problem_statement}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Time Complexity</p>
              <p className="text-white font-mono font-bold">{selectedProblem.time_complexity}</p>
            </div>
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Space Complexity</p>
              <p className="text-white font-mono font-bold">{selectedProblem.space_complexity}</p>
            </div>
          </div>

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full text-left bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-colors group"
          >
            <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
              {showExplanation ? '▼' : '▶'} Explanation
            </h3>
            {showExplanation && (
              <p className="text-slate-300 text-sm mt-3 whitespace-pre-wrap">
                {selectedProblem.explanation}
              </p>
            )}
          </button>

          <button
            onClick={() => setShowSolution(!showSolution)}
            className="w-full text-left bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-green-500 transition-colors group"
          >
            <h3 className="text-white font-semibold group-hover:text-green-400 transition-colors">
              {showSolution ? '▼' : '▶'} Solution
            </h3>
            {showSolution && (
              <pre className="text-slate-300 text-xs mt-3 bg-slate-900 p-3 rounded overflow-x-auto">
                {selectedProblem.solution_code}
              </pre>
            )}
          </button>
        </div>

        <div className="flex flex-col">
          <CodeEditor value={code} onChange={setCode} initialCode="# Implement your solution here\n" />

          {result && (
            <div
              className={`mt-4 p-4 rounded-lg border ${
                result.success
                  ? 'bg-green-900/20 border-green-700'
                  : 'bg-red-900/20 border-red-700'
              }`}
            >
              <p className={result.success ? 'text-green-400 font-semibold' : 'text-red-400'}>
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
