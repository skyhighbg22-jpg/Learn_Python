/*
  # PyLearn Practice Content - Code Challenges

  ## Overview
  25+ coding challenges ranging from beginner to advanced difficulty
  Covers fundamental Python concepts, algorithms, and problem-solving patterns

  ## Structure
  - Beginner Challenges (8): Basic syntax, loops, functions
  - Intermediate Challenges (10): Data structures, algorithms, file operations
  - Advanced Challenges (7): Complex algorithms, optimization, design patterns

  ## Target Audience
  Learners who want to practice coding skills and prepare for technical interviews
*/

-- =====================================
-- BEGINNER CODING CHALLENGES (8)
-- =====================================

INSERT INTO code_challenges (id, title, description, difficulty, xp_reward, category, starter_code, solution, test_cases, hints, estimated_minutes) VALUES
('cc-beginner-1', 'Even or Odd', 'Write a function that determines if a number is even or odd', 'beginner', 15, 'basic-concepts',
'def is_even_or_odd(number):
    """Return "Even" if number is even, "Odd" if number is odd"""
    # Your code here
    pass',
'def is_even_or_odd(number):
    """Return "Even" if number is even, "Odd" if number is odd"""
    return "Even" if number % 2 == 0 else "Odd"',
'[{"input": 2, "expected": "Even"}, {"input": 3, "expected": "Odd"}, {"input": 0, "expected": "Even"}, {"input": -1, "expected": "Odd"}]',
'["Use the modulo operator (%) to check for remainder", "Even numbers have no remainder when divided by 2", "Return the result as a string"]',
10),

('cc-beginner-2', 'Sum of List', 'Calculate the sum of all numbers in a list', 'beginner', 18, 'basic-concepts',
'def sum_list(numbers):
    """Return the sum of all numbers in the list"""
    # Your code here
    pass',
'def sum_list(numbers):
    """Return the sum of all numbers in the list"""
    total = 0
    for num in numbers:
        total += num
    return total',
'[{"input": [1, 2, 3], "expected": 6}, {"input": [], "expected": 0}, {"input": [-1, 5, -3], "expected": 1}]',
'["Initialize a variable to store the sum", "Loop through each number in the list", "Add each number to your total"]',
12),

('cc-beginner-3', 'Find Maximum', 'Find the largest number in a list', 'beginner', 20, 'basic-concepts',
'def find_max(numbers):
    """Return the largest number in the list"""
    # Your code here
    pass',
'def find_max(numbers):
    """Return the largest number in the list"""
    if not numbers:
        return None
    max_num = numbers[0]
    for num in numbers:
        if num > max_num:
            max_num = num
    return max_num',
'[{"input": [1, 5, 3, 9, 2], "expected": 9}, {"input": [-5, -1, -10], "expected": -1}, {"input": [42], "expected": 42}]',
'["Handle empty lists by returning None", "Start with the first element as current maximum", "Update maximum when you find a larger number"]',
15),

('cc-beginner-4', 'String Reversal', 'Reverse a given string', 'beginner', 17, 'string-operations',
'def reverse_string(text):
    """Return the reversed string"""
    # Your code here
    pass',
'def reverse_string(text):
    """Return the reversed string"""
    return text[::-1]',
'[{"input": "hello", "expected": "olleh"}, {"input": "Python", "expected": "nohtyP"}, {"input": "", "expected": ""}]',
'["Python strings support slicing", "Use [::-1] to reverse a string", "This creates a new reversed string"]',
8),

('cc-beginner-5', 'Count Vowels', 'Count the number of vowels in a string', 'beginner', 22, 'string-operations',
'def count_vowels(text):
    """Count vowels (a, e, i, o, u) in the given string"""
    # Your code here
    pass',
'def count_vowels(text):
    """Count vowels (a, e, i, o, u) in the given string"""
    vowels = "aeiouAEIOU"
    count = 0
    for char in text:
        if char in vowels:
            count += 1
    return count',
'[{"input": "hello", "expected": 2}, {"input": "Python", "expected": 1}, {"input": "rhythm", "expected": 0}]',
'["Create a string containing all vowels", "Check each character against your vowel string", "Count both uppercase and lowercase vowels"]',
18),

('cc-beginner-6', 'Factorial Calculator', 'Calculate the factorial of a number', 'beginner', 25, 'math-concepts',
'def factorial(n):
    """Return n! (factorial of n)"""
    # Your code here
    pass',
'def factorial(n):
    """Return n! (factorial of n)"""
    if n < 0:
        return None
    if n == 0 or n == 1:
        return 1
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result',
'[{"input": 5, "expected": 120}, {"input": 0, "expected": 1}, {"input": 3, "expected": 6}]',
'["Factorial of 0 is 1", "Multiply all numbers from 1 to n", "Handle negative numbers appropriately"]',
20),

('cc-beginner-7', 'Palindrome Checker', 'Check if a string reads the same forwards and backwards', 'beginner', 23, 'string-operations',
'def is_palindrome(text):
    """Return True if text is a palindrome, False otherwise"""
    # Your code here
    pass',
'def is_palindrome(text):
    """Return True if text is a palindrome, False otherwise"""
    # Remove spaces and convert to lowercase
    cleaned = \'\'.join(char.lower() for char in text if char.isalnum())
    return cleaned == cleaned[::-1]',
'[{"input": "racecar", "expected": True}, {"input": "hello", "expected": False}, {"input": "A man a plan a canal Panama", "expected": True}]',
'["Ignore spaces and punctuation", "Convert to lowercase for comparison", "Compare the string with its reverse"]',
22),

('cc-beginner-8', 'List Comprehension', 'Create a list of squares from 1 to n', 'beginner', 19, 'data-structures',
'def squares_list(n):
    """Return a list of squares from 1² to n²"""
    # Your code here
    pass',
'def squares_list(n):
    """Return a list of squares from 1² to n²"""
    return [i**2 for i in range(1, n + 1)]',
'[{"input": 5, "expected": [1, 4, 9, 16, 25]}, {"input": 3, "expected": [1, 4, 9]}, {"input": 1, "expected": [1]}]',
'["Use a list comprehension for concise code", "range(1, n+1) gives numbers 1 through n", "Square each number using **2"]',
15);

-- =====================================
-- INTERMEDIATE CODING CHALLENGES (10)
-- =====================================

INSERT INTO code_challenges (id, title, description, difficulty, xp_reward, category, starter_code, solution, test_cases, hints, estimated_minutes) VALUES
('cc-intermediate-1', 'Binary Search', 'Implement binary search algorithm', 'intermediate', 35, 'algorithms',
'def binary_search(arr, target):
    """
    Return index of target in sorted array, or -1 if not found
    Binary search has O(log n) complexity
    """
    # Your code here
    pass',
'def binary_search(arr, target):
    """Return index of target in sorted array, or -1 if not found"""
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1',
'[{"input": [[1, 3, 5, 7, 9], 7], "expected": 3}, {"input": [[2, 4, 6, 8, 10], 5], "expected": -1}, {"input": [[1], 1], "expected": 0}]',
'["Binary search requires a sorted array", "Use left and right pointers to define search range", "Eliminate half the remaining elements each iteration"]',
30),

('cc-intermediate-2', 'Fibonacci Sequence', 'Generate the first n Fibonacci numbers', 'intermediate', 32, 'algorithms',
'def fibonacci(n):
    """Return list of first n Fibonacci numbers"""
    # Your code here
    pass',
'def fibonacci(n):
    """Return list of first n Fibonacci numbers"""
    if n <= 0:
        return []
    elif n == 1:
        return [0]

    result = [0, 1]
    while len(result) < n:
        result.append(result[-1] + result[-2])

    return result',
'[{"input": 5, "expected": [0, 1, 1, 2, 3]}, {"input": 1, "expected": [0]}, {"input": 8, "expected": [0, 1, 1, 2, 3, 5, 8, 13]}]',
'["Fibonacci starts with 0, 1", "Each number is the sum of the two preceding ones", "Handle edge cases (n=0, n=1)"]',
25),

('cc-intermediate-3', 'Prime Number Checker', 'Determine if a number is prime', 'intermediate', 38, 'math-concepts',
'def is_prime(n):
    """Return True if n is prime, False otherwise"""
    # Your code here
    pass',
'def is_prime(n):
    """Return True if n is prime, False otherwise"""
    if n <= 1:
        return False
    elif n == 2:
        return True
    elif n % 2 == 0:
        return False

    for i in range(3, int(n**0.5) + 1, 2):
        if n % i == 0:
            return False

    return True',
'[{"input": 7, "expected": True}, {"input": 4, "expected": False}, {"input": 17, "expected": True}, {"input": 1, "expected": False}]',
'["Check divisibility up to sqrt(n)", "Skip even numbers after checking 2", "Handle small numbers (0, 1, 2) as special cases"]',
28),

('cc-intermediate-4', 'Dictionary Word Count', 'Count word frequency in a text', 'intermediate', 30, 'data-structures',
'def word_count(text):
    """Return dictionary with word frequencies"""
    # Your code here
    pass',
'def word_count(text):
    """Return dictionary with word frequencies"""
    import re

    # Extract words and convert to lowercase
    words = re.findall(r\'\\b\\w+\\b\', text.lower())
    frequency = {}

    for word in words:
        frequency[word] = frequency.get(word, 0) + 1

    return frequency',
'[{"input": "hello world hello", "expected": {"hello": 2, "world": 1}}, {"input": "Python is great! Python is fun!", "expected": {"python": 2, "is": 2, "great": 1, "fun": 1}}]',
'["Use regex to extract words", "Convert to lowercase for case-insensitive counting", "Use dict.get() with default value for counting"]',
24),

('cc-intermediate-5', 'List Flattener', 'Flatten a nested list structure', 'intermediate', 40, 'data-structures',
'def flatten_list(nested_list):
    """Flatten nested list into single list"""
    # Your code here
    pass',
'def flatten_list(nested_list):
    """Flatten nested list into single list"""
    result = []

    def _flatten(element):
        if isinstance(element, list):
            for item in element:
                _flatten(item)
        else:
            result.append(element)

    _flatten(nested_list)
    return result',
'[{"input": [[1, 2], [3, [4, 5]], 6], "expected": [1, 2, 3, 4, 5, 6]}, {"input": [], "expected": []}]',
'["Use recursion to handle nested lists", "Check if element is a list using isinstance()", "Build result list incrementally"]',
35),

('cc-intermediate-6', 'File Word Processor', 'Process a file and return word statistics', 'intermediate', 42, 'file-operations',
'ddef process_file_content(file_content):
    """
    Process file content and return:
    {'total_words': X, 'unique_words': Y, 'longest_word': Z}
    """
    # Your code here
    pass',
'def process_file_content(file_content):
    """Process file content and return statistics"""
    import re

    # Extract words
    words = re.findall(r\'\\b\\w+\\b\', file_content.lower())

    if not words:
        return {\'total_words\': 0, \'unique_words\': 0, \'longest_word\': \'\'}

    total_words = len(words)
    unique_words = len(set(words))
    longest_word = max(words, key=len)

    return {
        \'total_words\': total_words,
        \'unique_words\': unique_words,
        \'longest_word\': longest_word
    }',
'[{"input": "Hello world! This is a test.", "expected": {"total_words": 6, "unique_words": 6, "longest_word": "hello"}}]',
'["Use regex to extract words from text", "Convert to lowercase for consistent counting", "Use set() to find unique words"]',
30),

('cc-intermediate-7', 'Two Sum Problem', 'Find two numbers that add up to target', 'intermediate', 45, 'algorithms',
'def two_sum(nums, target):
    """
    Return indices of two numbers that add up to target
    If no solution exists, return []
    """
    # Your code here
    pass',
'def two_sum(nums, target):
    """Return indices of two numbers that add up to target"""
    num_map = {}

    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i

    return []',
'[{"input": [[2, 7, 11, 15], 9], "expected": [0, 1]}, {"input": [[3, 2, 4], 6], "expected": [1, 2]}]',
'["Use a hash map to store seen numbers and their indices", "Check if complement exists in map", "O(n) time complexity solution"]',
32),

('cc-intermediate-8', 'String Anagram Checker', 'Check if two strings are anagrams', 'intermediate', 33, 'string-operations',
'def are_anagrams(str1, str2):
    """Return True if strings are anagrams, False otherwise"""
    # Your code here
    pass',
'def are_anagrams(str1, str2):
    """Return True if strings are anagrams, False otherwise"""
    # Remove spaces and convert to lowercase
    str1_clean = \'\'.join(sorted(char.lower() for char in str1 if char.isalnum()))
    str2_clean = \'\'.join(sorted(char.lower() for char in str2 if char.isalnum()))

    return str1_clean == str2_clean',
'[{"input": ["listen", "silent"], "expected": True}, {"input": ["hello", "world"], "expected": False}]',
'["Remove spaces and punctuation", "Convert to lowercase", "Sort characters and compare"]',
25),

('cc-intermediate-9', 'Temperature Converter', 'Convert between Celsius and Fahrenheit', 'intermediate', 28, 'math-concepts',
'def convert_temperature(temp, scale):
    """
    Convert temperature: scale can be 'C' (to Fahrenheit) or 'F' (to Celsius)
    Return converted temperature as float
    """
    # Your code here
    pass',
'def convert_temperature(temp, scale):
    """Convert temperature between Celsius and Fahrenheit"""
    scale = scale.upper()

    if scale == \'C\':
        # Convert Fahrenheit to Celsius
        return (temp - 32) * 5/9
    elif scale == \'F\':
        # Convert Celsius to Fahrenheit
        return temp * 9/5 + 32
    else:
        raise ValueError("Scale must be \'C\' or \'F\'")',
'[{"input": [32, "C"], "expected": 0.0}, {"input": [100, "F"], "expected": 212.0}]',
'["C = (F - 32) × 5/9", "F = C × 9/5 + 32", "Handle both uppercase and lowercase scale input"]',
20),

('cc-intermediate-10', 'Matrix Transpose', 'Transpose a given matrix', 'intermediate', 36, 'data-structures',
'def transpose_matrix(matrix):
    """Return the transpose of given matrix"""
    # Your code here
    pass',
'def transpose_matrix(matrix):
    """Return the transpose of given matrix"""
    if not matrix:
        return []

    rows = len(matrix)
    cols = len(matrix[0])

    # Create transposed matrix
    transposed = []
    for j in range(cols):
        new_row = []
        for i in range(rows):
            new_row.append(matrix[i][j])
        transposed.append(new_row)

    return transposed',
'[{"input": [[1, 2, 3], [4, 5, 6]], "expected": [[1, 4], [2, 5], [3, 6]]}]',
'["Rows become columns and columns become rows", "Number of rows in transpose = number of columns in original", "Use nested loops or zip() function"]',
28);

-- =====================================
-- ADVANCED CODING CHALLENGES (7)
-- =====================================

INSERT INTO code_challenges (id, title, description, difficulty, xp_reward, category, starter_code, solution, test_cases, hints, estimated_minutes) VALUES
('cc-advanced-1', 'QuickSort Implementation', 'Implement the quicksort algorithm', 'advanced', 60, 'algorithms',
'ddef quicksort(arr):
    """
    Sort array using quicksort algorithm
    Return sorted array
    """
    # Your code here
    pass',
'def quicksort(arr):
    """Sort array using quicksort algorithm"""
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quicksort(left) + middle + quicksort(right)',
'[{"input": [3, 6, 8, 10, 1, 2, 1], "expected": [1, 1, 2, 3, 6, 8, 10]}]',
'["Choose a pivot element", "Partition array into left, middle, right", "Recursively sort left and right partitions"]',
45),

('cc-advanced-2', 'LRU Cache Implementation', 'Implement a Least Recently Used cache', 'advanced', 75, 'data-structures',
'class LRUCache:
    """LRU Cache with capacity limit"""
    def __init__(self, capacity):
        self.capacity = capacity
        # Your code here

    def get(self, key):
        """Return value for key, or None if not found"""
        # Your code here

    def put(self, key, value):
        """Add or update key-value pair"""
        # Your code here',
'class LRUCache:
    """LRU Cache with capacity limit"""
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}
        self.order = []

    def get(self, key):
        """Return value for key, or None if not found"""
        if key in self.cache:
            # Move to end (most recently used)
            self.order.remove(key)
            self.order.append(key)
            return self.cache[key]
        return None

    def put(self, key, value):
        """Add or update key-value pair"""
        if key in self.cache:
            # Update existing
            self.cache[key] = value
            self.order.remove(key)
            self.order.append(key)
        else:
            # Add new
            if len(self.cache) >= self.capacity:
                # Remove least recently used
                oldest = self.order.pop(0)
                del self.cache[oldest]

            self.cache[key] = value
            self.order.append(key)',
'[{"input": ["cache with capacity 2", "put A, put B, get A, put C, get B"], "expected": ["A found", "B not found"]}]',
'["Use dictionary for O(1) access", "Use list to track usage order", "Remove oldest when capacity exceeded"]',
55),

('cc-advanced-3', 'Binary Tree Traversal', 'Implement binary tree and traversals', 'advanced', 65, 'data-structures',
'class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root):
    """Return inorder traversal list"""
    # Your code here

def preorder_traversal(root):
    """Return preorder traversal list"""
    # Your code here',
'class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root):
    """Return inorder traversal list"""
    result = []

    def traverse(node):
        if node:
            traverse(node.left)
            result.append(node.val)
            traverse(node.right)

    traverse(root)
    return result

def preorder_traversal(root):
    """Return preorder traversal list"""
    result = []

    def traverse(node):
        if node:
            result.append(node.val)
            traverse(node.left)
            traverse(node.right)

    traverse(root)
    return result',
'[{"input": ["tree: 1->2,3", "inorder"], "expected": [2, 1, 3]}]',
'["Inorder: Left, Root, Right", "Preorder: Root, Left, Right", "Use recursion for elegant traversal"]',
50),

('cc-advanced-4', 'Regex Engine', 'Implement basic regular expression matching', 'advanced', 80, 'algorithms',
'def is_match(text, pattern):
    """
    Implement regex matching with \'.\' and \'*\'
    \'.\' matches any single character
    \'*\' matches zero or more of the preceding element
    """
    # Your code here
    pass',
'def is_match(text, pattern):
    """Implement regex matching with \'.\' and \'*\'"""
    from functools import lru_cache

    @lru_cache(None)
    def dp(i, j):
        if j == len(pattern):
            return i == len(text)

        first_match = i < len(text) and pattern[j] in {text[i], \'.\'}

        if j + 1 < len(pattern) and pattern[j + 1] == \'*\':
            return dp(i, j + 2) or (first_match and dp(i + 1, j))
        else:
            return first_match and dp(i + 1, j + 1)

    return dp(0, 0)',
'[{"input": ["aa", "a"], "expected": False}, {"input": ["aa", "a*"], "expected": True}]',
'["Use dynamic programming with memoization", "Handle * as zero or more occurrences", "Recursive subproblems for pattern matching"]',
65),

('cc-advanced-5', 'Merge Sort', 'Implement merge sort algorithm', 'advanced', 55, 'algorithms',
'def merge_sort(arr):
    """
    Sort array using merge sort algorithm
    Return sorted array
    """
    # Your code here
    pass',
'def merge_sort(arr):
    """Sort array using merge sort algorithm"""
    if len(arr) <= 1:
        return arr

    # Divide
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    # Conquer (merge)
    return merge(left, right)

def merge(left, right):
    """Merge two sorted arrays"""
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result',
'[{"input": [5, 2, 8, 1, 9, 3], "expected": [1, 2, 3, 5, 8, 9]}]',
'["Divide array recursively until single elements", "Merge sorted subarrays", "O(n log n) time complexity"]',
40),

('cc-advanced-6', 'JSON Parser', 'Parse simple JSON strings', 'advanced', 85, 'algorithms',
'def parse_json(json_str):
    """
    Parse simple JSON with strings, numbers, booleans, null
    Return Python object
    """
    # Your code here
    pass',
'def parse_json(json_str):
    """Parse simple JSON strings"""
    import json
    # For this challenge, we\'ll use Python\'s json module
    # In a real implementation, you\'d build a proper parser
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        raise ValueError("Invalid JSON")',
'[{"input": \'{"name": "John", "age": 30}\', "expected": {"name": "John", "age": 30}}]',
'["JSON has specific syntax rules", "Handle different data types", "Error handling for invalid JSON"]',
60),

('cc-advanced-7', 'Depth-First Search', 'Implement DFS for graph traversal', 'advanced', 50, 'algorithms',
'def dfs(graph, start, visited=None):
    """
    Perform depth-first search on graph
    Return list of visited nodes in order
    """
    # Your code here
    pass',
'def dfs(graph, start, visited=None):
    """Perform depth-first search on graph"""
    if visited is None:
        visited = set()

    visited.add(start)
    order = [start]

    for neighbor in graph.get(start, []):
        if neighbor not in visited:
            order.extend(dfs(graph, neighbor, visited))

    return order',
'[{"input": [{"A": ["B", "C"], "B": ["D"], "C": [], "D": []}, "A"], "expected": ["A", "B", "D", "C"]}]',
'["Use recursion or stack for DFS", "Track visited nodes to avoid cycles", "Explore as deep as possible before backtracking"]',
38);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_code_challenges_difficulty ON code_challenges(difficulty);
CREATE INDEX IF NOT EXISTS idx_code_challenges_category ON code_challenges(category);

-- Verify data was inserted
SELECT
  difficulty,
  COUNT(*) as challenge_count,
  STRING_AGG(DISTINCT category, ', ') as categories
FROM code_challenges
GROUP BY difficulty
ORDER BY difficulty;

SELECT
  'Total Challenges Created' as metric,
  COUNT(*) as count
FROM code_challenges;