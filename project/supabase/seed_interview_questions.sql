/*
  # PyLearn Practice Content - Interview Questions

  ## Overview
  30+ technical interview questions covering Python programming, algorithms, and system design
  Structured like real technical interviews with follow-up questions and solutions

  ## Structure
  - Core Python (8): Language fundamentals, data structures, OOP
  - Problem Solving (10): Algorithmic thinking and coding challenges
  - System Design (6): Architecture and scalability discussions
  - Behavioral (6): Soft skills and situational questions

  ## Target Audience
  Job seekers preparing for Python developer and software engineering interviews
*/

-- =====================================
-- CORE PYTHON QUESTIONS (8)
-- =====================================

INSERT INTO interview_questions (id, title, category, difficulty, question_text, expected_answer, follow_up_questions, hints, xp_reward, time_minutes) VALUES
('interview-python-1', 'Python Data Structures', 'core-python', 'medium',
'Explain the differences between lists, tuples, sets, and dictionaries in Python. When would you use each?',
'Lists: Mutable, ordered, allow duplicates. Use for ordered collections that may change.
Tuples: Immutable, ordered, allow duplicates. Use for fixed collections, dictionary keys.
Sets: Mutable, unordered, unique elements. Use for membership testing, removing duplicates.
Dictionaries: Mutable, key-value pairs, unique keys. Use for fast lookups, structured data.',
['What about frozenset?', 'When would you choose list vs tuple for performance?', 'How does Python implement dictionary lookups?'],
['Consider mutability requirements', 'Think about performance implications', 'Consider use case patterns'],
25, 15),

('interview-python-2', 'GIL and Threading', 'core-python', 'hard',
'What is the Global Interpreter Lock (GIL) in Python? How does it affect threading and when would you use multiprocessing instead?',
'The GIL is a mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecode simultaneously. It simplifies memory management but limits true parallelism in CPU-bound tasks. Use multiprocessing for CPU-bound tasks, threading for I/O-bound tasks.',
['How does asyncio fit into this picture?', 'What about different Python implementations?', 'Can the GIL be released?'],
['Think about CPU-bound vs I/O-bound tasks', 'Consider CPython implementation details', 'Memory management implications'],
35, 20),

('interview-python-3', 'Decorators and Closures', 'core-python', 'medium',
'Explain Python decorators and closures. Can you write a simple decorator that times function execution?',
'Decorators are functions that modify other functions. Closures are functions that capture variables from their enclosing scope. Example: @timer decorator that uses time module to measure and print execution time. The decorator function must return the wrapped function.',
['What about function decorators vs class decorators?', 'How do you handle function metadata with functools.wraps?', 'Can decorators take arguments?'],
['Understand function as first-class objects', 'Remember closure concept', 'Consider timing implementation'],
30, 18),

('interview-python-4', 'Memory Management', 'core-python', 'medium',
'How does Python manage memory? Explain reference counting and garbage collection.',
'Python uses automatic memory management with reference counting as primary mechanism. Each object has a reference count; when it reaches zero, object is deallocated. Garbage collector handles circular references using generational approach. sys.getrefcount() shows reference count.',
['What are weak references?', 'How does memory profiling work?', 'What about memory leaks in Python?'],
['Think about reference counting mechanics', 'Consider circular reference problem', 'Understand generational GC'],
28, 15),

('interview-python-5', 'List Comprehensions', 'core-python', 'easy',
'What are list comprehensions and how do they differ from map/filter? When would you use each?',
'List comprehensions provide concise syntax for creating lists. Syntax: [expression for item in iterable if condition]. They are often more readable than map/filter chains. Map/filter are functional programming approaches, better for very complex operations or when working with existing functions.',
['What about generator expressions?', 'Performance differences?', 'Nested comprehensions readability?'],
['Consider readability vs functional style', 'Think about lazy evaluation', 'Performance characteristics'],
20, 10),

('interview-python-6', 'Exception Handling', 'core-python', 'medium',
'Explain Python\'s exception handling mechanism. What\'s the difference between except Exception and except?',
'Python uses try-except blocks for exception handling. except Exception catches all standard exceptions, except bare catches all exceptions including SystemExit and KeyboardInterrupt. Best practice: catch specific exceptions, use finally for cleanup, use else for no-exception code.',
['When would you use bare except?', 'What about custom exceptions?', 'How does exception chaining work?'],
['Think about exception hierarchy', 'Consider error handling best practices', 'Resource cleanup'],
25, 12),

('interview-python-7', 'Metaclasses', 'core-python', 'hard',
'What are metaclasses in Python and when would you use them? Can you provide an example?',
'Metaclasses are "classes of classes" that define how classes behave. Most common use is type(). Can create custom metaclasses by inheriting from type. Use cases: framework design, API validation, automatic attribute generation, singleton pattern implementation.',
['Are metaclasses overkill for most applications?', 'How do they relate to decorators?', 'Alternative approaches?'],
['Understand class creation process', 'Think about framework design patterns', 'Consider simpler alternatives'],
40, 20),

('interview-python-8', 'Context Managers', 'core-python', 'medium',
'Explain Python\'s context managers and the "with" statement. Can you implement a custom context manager?',
'Context managers manage resources using __enter__ and __exit__ methods. The "with" statement ensures proper resource cleanup. Can implement as class with these methods or using @contextmanager decorator. Used for file operations, database connections, locks.',
['What about async context managers?', 'Multiple context managers?', 'Exception handling in __exit__?'],
['Resource management patterns', 'Exception safety', 'Cleanup guarantees'],
30, 15);

-- =====================================
-- PROBLEM SOLVING QUESTIONS (10)
-- =====================================

INSERT INTO interview_questions (id, title, category, difficulty, question_text, expected_answer, follow_up_questions, hints, xp_reward, time_minutes) VALUES
('interview-algo-1', 'Two Sum Variations', 'problem-solving', 'medium',
'Solve the Two Sum problem. Now, what if you need to handle multiple queries efficiently?',
'Solution: Use hash map for O(n) single query. For multiple queries, pre-process with hash map of value to indices, or sort array and use two pointers. Can also use collections.Counter for handling duplicates.',
['What about space optimization?', 'Time complexity analysis?', 'Handling duplicates?'],
['Hash map for O(n) time', 'Consider preprocessing for multiple queries', 'Two-pointer approach for sorted'],
35, 20),

('interview-algo-2', 'String Anagrams', 'problem-solving', 'medium',
'Given two strings, determine if they are anagrams. Optimize for different input sizes.',
'Small strings: sort and compare O(n log n). Large strings: use character count O(n). ASCII vs Unicode affects approach. For multiple anagram checks, use sorted string as key in hash map.',
['What about Unicode strings?', 'Multiple anagram groups?', 'Space-time tradeoffs?'],
['Sorting approach vs counting approach', 'Character set considerations', 'Multiple queries optimization'],
30, 15),

('interview-algo-3', 'Binary Tree Traversal', 'problem-solving', 'medium',
'Implement binary tree traversals (inorder, preorder, postorder) iteratively.',
'Use explicit stack to replace recursion. Preorder: push right, then left child. Inorder: go left, process node, go right. Postorder: use two stacks or modify preorder traversal (root-right-left) then reverse.',
['Space complexity analysis?', 'Morris traversal for O(1) space?', 'Iterator implementation?'],
['Stack-based approach', 'Think about iterative vs recursive', 'Space optimization'],
32, 18),

('interview-algo-4', 'LRU Cache Design', 'problem-solving', 'hard',
'Design and implement an LRU (Least Recently Used) cache with O(1) get and put operations.',
'Use HashMap for O(1) lookups and Doubly LinkedList for ordering. HashMap stores key to node mapping. DLL maintains usage order with head (most recent) and tail (least recent). On access, move node to head. On capacity overflow, remove tail.',
['Alternative implementations?', 'Thread safety considerations?', 'Memory overhead analysis?'],
['HashMap + DLL combination', 'O(1) operations requirement', 'Movement operations in DLL'],
45, 25),

('interview-algo-5', 'Merge K Sorted Lists', 'problem-solving', 'hard',
'Merge k sorted linked lists into one sorted list. Optimize for different k values.',
'Use min-heap: O(n log k) where n is total elements. Push first node of each list to heap, repeatedly extract min and push next. For small k: pairwise merging O(nk). Divide and conquer: O(n log k) with better constants.',
['Space complexity optimization?', 'What about extremely large k?', 'Streaming scenario?'],
['Min-heap approach', 'Complexity analysis', 'Alternative strategies'],
50, 25),

('interview-algo-6', 'Regular Expression Matching', 'problem-solving', 'hard',
'Implement regex matching with \'.\' and \'*\' operators.',
'Dynamic programming: dp[i][j] = true if s[i:] matches p[j:]. Base: dp[len(s)][len(p)] = true. Handle \'.\' (match one) and \'*\' (match zero or more of preceding char). Recursive with memoization or iterative bottom-up.',
['Time and space optimization?', 'Extension to other operators?', 'Backtracking vs DP?'],
['DP state definition', 'Recursive relation', 'Base cases'],
55, 30),

('interview-algo-7', 'Design Twitter Feed', 'problem-solving', 'hard',
'Design a simplified Twitter system with posting, following, and timeline generation.',
'Use HashMap for user data, tweets, and following lists. Store tweets with timestamp. Timeline: merge recent tweets from followed users using min-heap. For better performance, pre-compute timelines or use caching. Consider write vs read optimization.',
['Scaling considerations?', 'Feed generation optimization?', 'Notification system integration?'],
['Data structure selection', 'Time complexity of operations', 'Real-world constraints'],
60, 30),

('interview-algo-8', 'Maximum Subarray', 'problem-solving', 'easy',
'Find maximum sum subarray in circular array.',
'Solution: Use Kadane\'s algorithm twice. First for normal case. Second for circular case: total_sum - min_subarray (Kadane on inverted array). Return max of both. Handle edge case where all elements are negative.',
['Alternative approaches?', 'Time complexity proof?', 'Extension to k maximum subarrays?'],
['Kadane\'s algorithm extension', 'Circular array handling', 'Edge cases'],
25, 12),

('interview-algo-9', 'Validate Binary Search Tree', 'problem-solving', 'medium',
'Validate if a binary tree is a BST.',
'Recursive: pass min/max bounds to each node. For left subtree, max bound = node.val. For right subtree, min bound = node.val. Iterative: use stack with node and bounds. Or do inorder traversal and check if sorted.',
['What about duplicate values?', 'Alternative validation methods?', 'Time-space tradeoffs?'],
['BST property definition', 'Bounding value approach', 'Inorder property'],
30, 15),

('interview-algo-10', 'Word Break', 'problem-solving', 'medium',
'Given string and word dictionary, determine if string can be segmented.',
'DP: dp[i] = true if s[:i] can be segmented. Initialize dp[0] = true. For each i, check all j < i where dp[j] is true and s[j:i] in wordDict. Use Trie for optimization if many word lookups.',
['Space optimization?', 'Return one valid segmentation?', 'Extension to count all possibilities?'],
['DP formulation', 'Word lookup optimization', 'Time complexity analysis'],
35, 20);

-- =====================================
-- SYSTEM DESIGN QUESTIONS (6)
-- =====================================

INSERT INTO interview_questions (id, title, category, difficulty, question_text, expected_answer, follow_up_questions, hints, xp_reward, time_minutes) VALUES
('interview-system-1', 'URL Shortener', 'system-design', 'medium',
'Design a URL shortener service like TinyURL.',
'Components: 1) Generate unique short codes using base62 encoding or hash, 2) Database mapping short->long URLs, 3) API endpoints for create/redirect, 4) Caching layer, 5) Analytics. Scalability: use distributed key generation, sharding by hash, CDN for redirects. Trade-offs: length vs collision probability.',
['Analytics implementation?', 'Cache invalidation?', 'Rate limiting strategy?'],
['Think about scale (millions of URLs)', 'Consider collision probability', 'Performance optimization'],
40, 25),

('interview-system-2', 'Design Twitter Timeline', 'system-design', 'hard',
'Design Twitter\'s timeline feature and home feed generation.',
'Read-heavy vs write-heavy optimization approaches. Read path: On-demand merge (slow) vs pre-computed timeline (fast but more storage). Fan-out on write: push tweets to followers. Use Redis for fast timeline retrieval. Consider hot users, selective fan-out, caching strategies.',
['Real-time vs eventual consistency?', 'Handling celebrities with millions of followers?', 'Timeline pagination?'],
['Write vs read optimization trade-off', 'User behavior patterns', 'Caching strategies'],
55, 30),

('interview-system-3', 'Design Ride Sharing App', 'system-design', 'hard',
'Design the core backend for a ride-sharing app like Uber.',
'Components: 1) Location services (geospatial indexing), 2) Matching algorithm (distance, availability), 3) Pricing engine (dynamic pricing), 4) Notification system, 5) Payment integration. Use Geohash for location indexing. Real-time location updates via websockets. Microservices architecture for scalability.',
['Real-time location tracking?', 'Surge pricing algorithm?', 'Driver-passenger matching optimization?'],
['Geospatial indexing', 'Real-time requirements', 'Matching algorithm complexity'],
60, 30),

('interview-system-4', 'Design Netflix Streaming', 'system-design', 'hard',
'Design a video streaming service like Netflix.',
'Components: 1) Content delivery with CDN, 2) Adaptive bitrate streaming, 3) Recommendation engine, 4) User authentication and profiles, 5) Video encoding and storage. Use HTTP Live Streaming (HLS) or MPEG-DASH. Multiple video qualities for different network conditions. Edge caching for reduced latency.',
['Recommendation system architecture?', 'Video encoding pipeline?', 'DRM and content protection?'],
['CDN usage', 'Adaptive streaming', 'Content distribution strategy'],
65, 35),

('interview-system-5', 'Design Chat Application', 'system-design', 'medium',
'Design a real-time chat application like WhatsApp.',
'Components: 1) Real-time messaging (WebSockets), 2) Message delivery guarantee, 3) User presence and status, 4) Group chats, 5) Media sharing. Use message queues for reliability. Device synchronization. Push notifications for offline users. Scalability: sharding by user ID, connection pooling.',
['Message ordering guarantees?', 'Offline message handling?', 'Scale to billions of messages?'],
['Real-time communication', 'Message reliability', 'State synchronization'],
45, 25),

('interview-system-6', 'Design Web Crawler', 'system-design', 'medium',
'Design a web crawler for a search engine.',
'Components: 1) URL frontier (queue), 2) Fetcher with politeness policies, 3) Parser for links, 4) Duplicate content detection, 5) Storage layer. Use BFS for crawling. Respect robots.txt, implement rate limiting. URL seen set to avoid duplicates. Distributed design: multiple crawlers, shared frontier via message queues.',
['Handling dynamic content?', 'Crawl scheduling?', 'Duplicate detection at scale?'],
['Politeness policies', 'URL prioritization', 'Scalability considerations'],
42, 22);

-- =====================================
-- BEHAVIORAL QUESTIONS (6)
-- =====================================

INSERT INTO interview_questions (id, title, category, difficulty, question_text, expected_answer, follow_up_questions, hints, xp_reward, time_minutes) VALUES
('interview-behavioral-1', 'Project Challenges', 'behavioral', 'easy',
'Tell me about a challenging technical project you worked on. What made it challenging and how did you overcome the difficulties?',
'Use STAR method: Situation (project context), Task (your responsibility), Action (steps taken), Result (outcome). Focus on technical challenges like performance issues, tight deadlines, complex requirements, team coordination. Show problem-solving process, collaboration, and learning.',
['What would you do differently?', 'How did you communicate with stakeholders?', 'Technical vs people challenges?'],
['Use STAR framework', 'Be specific about technical details', 'Show problem-solving process'],
20, 8),

('interview-behavioral-2', 'Learning New Technology', 'behavioral', 'easy',
'Describe a time you had to learn a new technology quickly for a project. How did you approach it?',
'Show proactive learning strategy: start with documentation, small projects, seeking mentorship, online courses. Demonstrate ability to break down complex topics, practical application, balancing theory with hands-on practice. Mention specific learning resources and timeline.',
['How do you stay updated with new technologies?', 'Resources you recommend?', 'Learning style preferences?'],
['Show structured learning approach', 'Balance theory and practice', 'Mention specific resources'],
18, 6),

('interview-behavioral-3', 'Code Review Experience', 'behavioral', 'medium',
'Tell me about a time you received difficult feedback on your code. How did you handle it?',
'Show openness to feedback, professional attitude, focus on learning rather than defensiveness. Discuss understanding the feedback perspective, asking clarifying questions, implementing improvements, and appreciating the growth opportunity. Demonstrate collaboration and code quality mindset.',
['How do you give feedback to others?', 'Code review best practices?', 'Handling disagreements in reviews?'],
['Show growth mindset', 'Professional communication', 'Focus on improvement'],
22, 10),

('interview-behavioral-4', 'Technical Disagreement', 'behavioral', 'medium',
'Describe a time you disagreed with a technical decision made by your team. How did you handle it?',
'Show respectful disagreement approach: understand other perspectives, present alternatives with data, focus on technical merits rather than ego, compromise when appropriate, escalate constructively if needed. Demonstrate collaboration and problem-solving skills.',
['When to escalate?', 'How to convince others?', 'Handling when you\'re wrong?'],
['Show respectful communication', 'Data-driven arguments', 'Team collaboration'],
25, 12),

('interview-behavioral-5', 'Mentorship Experience', 'behavioral', 'easy',
'Tell me about a time you mentored or helped a junior developer. What was the situation and outcome?',
'Demonstrate leadership, communication skills, and patience. Show ability to break down complex concepts, provide constructive feedback, empower others, and measure growth. Discuss specific teaching methods, setting goals, and celebrating progress.',
['Teaching strategies?', 'Measuring progress?', 'Handling different learning styles?'],
['Show leadership qualities', 'Communication skills', 'Empowerment approach'],
20, 8),

('interview-behavioral-6', 'Failure and Learning', 'behavioral', 'medium',
'Describe a technical project that failed or had major issues. What did you learn from it?',
'Show accountability, analytical thinking, and growth mindset. Use STAR format focusing on what went wrong, root cause analysis, lessons learned, and how you applied those lessons to future projects. Demonstrate resilience and continuous improvement.',
['How do you prevent similar failures?', 'Early warning signs?', 'Team impact and recovery?'],
['Take responsibility', 'Show learning process', 'Demonstrate resilience'],
28, 15);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_interview_questions_difficulty ON interview_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_interview_questions_category ON interview_questions(category);

-- Verify data was inserted
SELECT
  category,
  COUNT(*) as question_count,
  STRING_AGG(DISTINCT difficulty, ', ') as difficulties
FROM interview_questions
GROUP BY category
ORDER BY category;

SELECT
  'Total Interview Questions Created' as metric,
  COUNT(*) as count
FROM interview_questions;

SELECT
  'Average XP Reward' as metric,
  ROUND(AVG(xp_reward), 2) as average_xp
FROM interview_questions;