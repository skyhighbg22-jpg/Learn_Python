/*
  # PyLearn Practice Content - Algorithm Problems

  ## Overview
  20+ algorithm problems covering key computer science concepts
  Focus on problem-solving patterns and optimization techniques

  ## Structure
  - Sorting & Searching (5): QuickSort, MergeSort, Binary Search variants
  - Dynamic Programming (5): Classic DP problems with optimal substructure
  - Graph Algorithms (5): Traversal, shortest paths, connectivity
  - Greedy Algorithms (5): Optimization with local optimal choices

  ## Target Audience
  Advanced learners preparing for technical interviews and competitive programming
*/

-- =====================================
-- SORTING & SEARCHING ALGORITHMS (5)
-- =====================================

INSERT INTO algorithm_problems (id, title, description, difficulty, xp_reward, category, problem_statement, constraints, examples, solution_approach, time_complexity, space_complexity) VALUES
('algo-sort-1', 'Kth Largest Element', 'Find the kth largest element in an unsorted array', 'medium', 40, 'sorting',
'Given an unsorted array of integers and an integer k, find the kth largest element in the array.',
'1 <= nums.length <= 10^4
-10^9 <= nums[i] <= 10^9
1 <= k <= nums.length',
'[{"input": {"nums": [3,2,1,5,6,4], "k": 2}, "output": 5}, {"input": {"nums": [3,2,3,1,2,4,5,5,6], "k": 4}, "output": 4}]',
'Use QuickSelect algorithm (partition-based selection) or min-heap. QuickSelect has average O(n) time complexity, while heap solution is O(n log k).',
'O(n) average, O(n²) worst', 'O(1)'),

('algo-sort-2', 'Merge Sorted Arrays', 'Merge k sorted arrays into one sorted array', 'medium', 45, 'sorting',
'Given k sorted arrays, merge them into a single sorted array.',
'1 <= k <= 10^4
1 <= arrays[i].length <= 500
-10^4 <= arrays[i][j] <= 10^4',
'[{"input": {"arrays": [[1,4,5],[1,3,4],[2,6]]}, "output": [1,1,2,3,4,4,5,6]}]',
'Use min-heap to efficiently merge k arrays. Push first element of each array to heap, then repeatedly extract min and push next element from same array.',
'O(n log k)', 'O(k)'),

('algo-sort-3', 'First Missing Positive', 'Find smallest missing positive integer', 'hard', 60, 'sorting',
'Given an unsorted array of integers, find the smallest positive integer that does not appear in the array.',
'1 <= nums.length <= 10^5
-10^6 <= nums[i] <= 10^6',
'[{"input": {"nums": [1,2,0]}, "output": 3}, {"input": {"nums": [3,4,-1,1]}, "output": 2}]',
'Place each number in its correct position (nums[i] = i+1) through swapping. Then scan for first position where number is incorrect.',
'O(n)', 'O(1)'),

('algo-sort-4', 'Search in Rotated Array', 'Search in rotated sorted array', 'medium', 50, 'searching',
'Search for a target value in a rotated sorted array of distinct integers.',
'1 <= nums.length <= 10^4
-10^4 <= nums[i] <= 10^4
All values are unique',
'[{"input": {"nums": [4,5,6,7,0,1,2], "target": 0}, "output": 4}, {"input": {"nums": [4,5,6,7,0,1,2], "target": 3}, "output": -1}]',
'Use modified binary search. Determine which half is sorted, then check if target lies in sorted half or unsorted half.',
'O(log n)', 'O(1)'),

('algo-sort-5', 'Find Peak Element', 'Find a peak element in array', 'medium', 35, 'searching',
'A peak element is greater than its neighbors. Find any peak element in the array.',
'1 <= nums.length <= 10^5
-10^9 <= nums[i] <= 10^9',
'[{"input": {"nums": [1,2,3,1]}, "output": 2}, {"input": {"nums": [1,2,1,3,5,6,4]}, "output": 5}]',
'Use binary search. Compare mid with mid+1. If mid < mid+1, peak is in right half, else in left half.',
'O(log n)', 'O(1)');

-- =====================================
-- DYNAMIC PROGRAMMING (5)
-- =====================================

INSERT INTO algorithm_problems (id, title, description, difficulty, xp_reward, category, problem_statement, constraints, examples, solution_approach, time_complexity, space_complexity) VALUES
('algo-dp-1', 'Coin Change', 'Minimum coins to make amount', 'medium', 55, 'dynamic-programming',
'Given coin denominations and amount, find minimum number of coins to make that amount.',
'1 <= coins.length <= 12
1 <= coins[i] <= 2^31 - 1
0 <= amount <= 10^4',
'[{"input": {"coins": [1,2,5], "amount": 11}, "output": 3}, {"input": {"coins": [2], "amount": 3}, "output": -1}]',
'DP[i] = minimum coins to make amount i. Initialize DP[0] = 0, others as infinity. For each coin, update DP[j] = min(DP[j], DP[j-coin] + 1).',
'O(n × amount)', 'O(amount)'),

('algo-dp-2', 'Longest Increasing Subsequence', 'Find length of LIS', 'medium', 50, 'dynamic-programming',
'Given integer array, find length of longest strictly increasing subsequence.',
'1 <= nums.length <= 2500
-10^4 <= nums[i] <= 10^4',
'[{"input": {"nums": [10,9,2,5,3,7,101,18]}, "output": 4}, {"input": {"nums": [0,1,0,3,2,3]}, "output": 4}]',
'DP[i] = length of LIS ending at i. DP[i] = 1 + max(DP[j]) for all j < i where nums[j] < nums[i]. Optimize with patience sorting for O(n log n).',
'O(n²) basic, O(n log n) optimized', 'O(n)'),

('algo-dp-3', 'Edit Distance', 'Minimum operations to convert strings', 'hard', 65, 'dynamic-programming',
'Find minimum edit operations (insert, delete, replace) to convert word1 to word2.',
'0 <= word1.length, word2.length <= 500',
'[{"input": {"word1": "horse", "word2": "ros"}, "output": 3}, {"input": {"word1": "intention", "word2": "execution"}, "output": 5}]',
'DP[i][j] = minimum operations to convert word1[0:i] to word2[0:j]. Base cases: DP[0][j] = j, DP[i][0] = i. Recurrence based on character match/mismatch.',
'O(m × n)', 'O(m × n)'),

('algo-dp-4', 'House Robber II', 'Maximum money from circular houses', 'medium', 45, 'dynamic-programming',
'Rob houses in circle. Cannot rob adjacent houses. Find maximum amount.',
'1 <= nums.length <= 1000
0 <= nums[i] <= 1000',
'[{"input": {"nums": [2,3,2]}, "output": 3}, {"input": {"nums": [1,2,3,1]}, "output": 4}]',
'Since houses are circular, solve two subproblems: rob houses[0:n-1] or houses[1:n]. Use standard House Robber DP on each subproblem.',
'O(n)', 'O(1)'),

('algo-dp-5', 'Maximum Subarray Sum', 'Kadane\'s algorithm', 'easy', 30, 'dynamic-programming',
'Find contiguous subarray with largest sum.',
'1 <= nums.length <= 10^5
-10^4 <= nums[i] <= 10^4',
'[{"input": {"nums": [-2,1,-3,4,-1,2,1,-5,4]}, "output": 6}, {"input": {"nums": [1]}, "output": 1}]',
'Kadane\'s algorithm: max_ending_here = max(nums[i], max_ending_here + nums[i]). Track global maximum.',
'O(n)', 'O(1)');

-- =====================================
-- GRAPH ALGORITHMS (5)
-- =====================================

INSERT INTO algorithm_problems (id, title, description, difficulty, xp_reward, category, problem_statement, constraints, examples, solution_approach, time_complexity, space_complexity) VALUES
('algo-graph-1', 'Number of Islands', 'Count islands in grid', 'medium', 48, 'graph-algorithms',
'Count number of islands in 2D grid where \'1\' represents land and \'0\' represents water.',
'm, n <= 300
grid[i][j] is \'0\' or \'1\'',
'[{"input": {"grid": [[\'1\',\'1\',\'0\',\'0\',\'0\'],[\'1\',\'1\',\'0\',\'0\',\'0\'],[\'0\',\'0\',\'1\',\'0\',\'0\'],[\'0\',\'0\',\'0\',\'1\',\'1\']]}, "output": 3}]',
'Use DFS or BFS to explore connected components. When find \'1\', increment count and explore all connected \'1\'s, marking them visited.',
'O(m × n)', 'O(m × n)'),

('algo-graph-2', 'Course Schedule', 'Check if course completion possible', 'medium', 55, 'graph-algorithms',
'Given course prerequisites, determine if all courses can be completed.',
'1 <= numCourses <= 10^5
0 <= prerequisites.length <= 5000',
'[{"input": {"numCourses": 2, "prerequisites": [[1,0]]}, "output": true}, {"input": {"numCourses": 2, "prerequisites": [[1,0],[0,1]]}, "output": false}]',
'Check for cycles in directed graph. Use DFS with visited states or Kahn\'s algorithm (topological sort with indegree).',
'O(V + E)', 'O(V + E)'),

('algo-graph-3', 'Word Ladder', 'Shortest transformation sequence', 'hard', 70, 'graph-algorithms',
'Find shortest transformation sequence from beginWord to endWord using wordList.',
'1 <= wordList.length <= 5000
wordList[i].length == beginWord.length',
'[{"input": {"beginWord": "hit", "endWord": "cog", "wordList": ["hot","dot","dog","lot","log","cog"]}, "output": 5}]',
'BFS on word transformation graph. Each word is node, edges connect words differing by one character.',
'O(N × L²)', 'O(N × L)'),

('algo-graph-4', 'Pacific Atlantic Water Flow', 'Matrix flow problem', 'medium', 58, 'graph-algorithms',
'Find cells where water can flow to both Pacific and Atlantic oceans from matrix heights.',
'm, n <= 200',
'[{"input": {"matrix": [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]}, "output": [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]}]',
'Reverse flow: start from ocean edges and mark cells that can reach each ocean using DFS/BFS. Intersection is answer.',
'O(m × n)', 'O(m × n)'),

('algo-graph-5', 'Graph Valid Tree', 'Check if graph is a tree', 'medium', 40, 'graph-algorithms',
'Given n nodes and edges, determine if graph forms a valid tree.',
'1 <= n <= 100
0 <= edges.length <= n × (n - 1) / 2',
'[{"input": {"n": 5, "edges": [[0,1],[0,2],[0,3],[1,4]]}, "output": true}, {"input": {"n": 5, "edges": [[0,1],[1,2],[2,3],[1,3]]}, "output": false}]',
'Tree if: (1) exactly n-1 edges, (2) graph is connected. Use Union-Find or DFS to check connectivity and cycles.',
'O(V + E)', 'O(V + E)');

-- =====================================
-- GREEDY ALGORITHMS (5)
-- =====================================

INSERT INTO algorithm_problems (id, title, description, difficulty, xp_reward, category, problem_statement, constraints, examples, solution_approach, time_complexity, space_complexity) VALUES
('algo-greedy-1', 'Jump Game', 'Reach last index from start', 'medium', 42, 'greedy',
'Determine if can reach last index from start using maximum jump length at each position.',
'1 <= nums.length <= 10^4
0 <= nums[i] <= 10^5',
'[{"input": {"nums": [2,3,1,1,4]}, "output": true}, {"input": {"nums": [3,2,1,0,4]}, "output": false}]',
'Track farthest reachable position. If current index > farthest, return false. Update farthest = max(farthest, i + nums[i]).',
'O(n)', 'O(1)'),

('algo-greedy-2', 'Gas Station', 'Find starting gas station', 'hard', 62, 'greedy',
'Find gas station to complete circuit. gas[i] is gas, cost[i] is cost to reach next station.',
'1 <= gas.length, cost.length <= 10^4
0 <= gas[i], cost[i] <= 10^4',
'[{"input": {"gas": [1,2,3,4,5], "cost": [3,4,5,1,2]}, "output": 3}]',
'If total gas >= total cost, solution exists. Use greedy: if current tank becomes negative, reset start to next station.',
'O(n)', 'O(1)'),

('algo-greedy-3', 'Candy Distribution', 'Min candies with ratings', 'hard', 68, 'greedy',
'Give candies to children with ratings. Adjacent children with higher rating get more candies.',
'1 <= ratings.length <= 2 × 10^4
0 <= ratings[i] <= 2 × 10^4',
'[{"input": {"ratings": [1,0,2]}, "output": 5}, {"input": {"ratings": [1,2,2]}, "output": 4}]',
'Two-pass greedy: left-to-right ensures right neighbor condition, right-to-left ensures left neighbor condition. Take maximum of both.',
'O(n)', 'O(n)'),

('algo-greedy-4', 'Maximum Units on Truck', 'Load boxes for maximum units', 'medium', 38, 'greedy',
'Load boxes to maximize total units. truckSize is maximum boxes that can be loaded.',
'1 <= boxTypes.length <= 1000
1 <= numberOfBoxesi, numberOfUnitsPerBoxi <= 1000',
'[{"input": {"boxTypes": [[1,3],[2,2],[3,1]], "truckSize": 4}, "output": 8}]',
'Sort boxTypes by units per box in descending order. Load as many as possible from highest value boxes first.',
'O(n log n)', 'O(1)'),

('algo-greedy-5', 'Task Scheduler', 'Minimum intervals for tasks', 'hard', 65, 'greedy',
'Schedule tasks with cooling period n. Same task must be at least n intervals apart.',
'1 <= task.length <= 10^4
tasks[i] is uppercase letter
0 <= n <= 100',
'[{"input": {"tasks": ["A","A","A","B","B","B"], "n": 2}, "output": 8}]',
'Count task frequencies. Result = max(total_tasks, (max_freq - 1) × (n + 1) + count_max_freq). Fill idle slots with other tasks.',
'O(T)', 'O(1)');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_algorithm_problems_difficulty ON algorithm_problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_algorithm_problems_category ON algorithm_problems(category);

-- Verify data was inserted
SELECT
  category,
  COUNT(*) as problem_count,
  STRING_AGG(DISTINCT difficulty, ', ') as difficulties
FROM algorithm_problems
GROUP BY category
ORDER BY category;

SELECT
  'Total Algorithm Problems Created' as metric,
  COUNT(*) as count
FROM algorithm_problems;