/*
  # PyLearn Comprehensive Lesson Library - Advanced Lessons

  ## Overview
  15 advanced lessons covering complex algorithms and real-world Python applications
  through interactive drag-drop, puzzle game, and story-based learning.

  ## Structure
  - 5 Drag & Drop Lessons: Professional code patterns and algorithms
  - 5 Puzzle Game Lessons: Complex problem-solving and optimization challenges
  - 5 Story Lessons: Industry scenarios and professional applications

  ## Target Audience
  Experienced programmers ready for advanced concepts and real-world applications
*/

-- Insert new sections for advanced learning path
INSERT INTO sections (id, title, description, path, order_index, unlock_requirement_xp) VALUES
('section-advanced-dragdrop', 'Professional Code', 'Industry-standard patterns and algorithms', 'advanced-python', 7, 300),
('section-advanced-puzzles', 'Expert Challenges', 'Complex problem solving and optimization', 'advanced-python', 8, 400),
('section-advanced-stories', 'Real Applications', 'Professional Python scenarios', 'advanced-python', 9, 500)
ON CONFLICT (id) DO NOTHING;

-- =====================================
-- ADVANCED DRAG & DROP LESSONS (5)
-- =====================================

INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, drag_drop_data, estimated_minutes) VALUES
('ad-dragdrop-1', 'Algorithm Implementation', 'Arrange sorting and searching algorithms', 'advanced', 50, 1, 'section-advanced-dragdrop', 'drag-drop', 50),
('ad-dragdrop-2', 'Database Operations', 'Build SQL queries with Python integration', 'advanced', 55, 2, 'section-advanced-dragdrop', 'drag-drop', 55),
('ad-dragdrop-3', 'API Development', 'Create REST API endpoint structure with Flask/FastAPI', 'advanced', 60, 3, 'section-advanced-dragdrop', 'drag-drop', 60),
('ad-dragdrop-4', 'Data Analysis Pipeline', 'Arrange Pandas operations for data processing', 'advanced', 58, 4, 'section-advanced-dragdrop', 'drag-drop', 58),
('ad-dragdrop-5', 'Machine Learning Basics', 'Build Scikit-learn workflow structure', 'advanced', 65, 5, 'section-advanced-dragdrop', 'drag-drop', 65)
ON CONFLICT (id) DO NOTHING;

-- Update drag_drop_data for advanced drag-drop lessons
UPDATE lessons SET drag_drop_data = '{
  "instructions": "Implement a binary search algorithm and a quicksort algorithm. These fundamental algorithms are essential for efficient data processing and are commonly asked about in technical interviews.",
  "code_blocks": [
    {
      "id": "binary-search-header",
      "content": "def binary_search(arr, target):",
      "type": "function",
      "indent": 0
    },
    {
      "id": "binary-vars",
      "content": "left, right = 0, len(arr) - 1",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "binary-while",
      "content": "while left <= right:",
      "type": "code",
      "indent": 4
    },
    {
      "id": "binary-mid",
      "content": "mid = (left + right) // 2",
      "type": "variable",
      "indent": 8
    },
    {
      "id": "binary-check",
      "content": "if arr[mid] == target: return mid",
      "type": "code",
      "indent": 8
    },
    {
      "id": "binary-left",
      "content": "elif arr[mid] < target: left = mid + 1",
      "type": "code",
      "indent": 8
    },
    {
      "id": "binary-right",
      "content": "else: right = mid - 1",
      "type": "code",
      "indent": 8
    },
    {
      "id": "binary-return",
      "content": "return -1",
      "type": "code",
      "indent": 4
    },
    {
      "id": "quicksort-header",
      "content": "def quicksort(arr):",
      "type": "function",
      "indent": 0
    },
    {
      "id": "quicksort-base",
      "content": "if len(arr) <= 1: return arr",
      "type": "code",
      "indent": 4
    },
    {
      "id": "quicksort-pivot",
      "content": "pivot = arr[len(arr) // 2]",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "quicksort-left-part",
      "content": "left = [x for x in arr if x < pivot]",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "quicksort-middle-part",
      "content": "middle = [x for x in arr if x == pivot]",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "quicksort-right-part",
      "content": "right = [x for x in arr if x > pivot]",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "quicksort-return",
      "content": "return quicksort(left) + middle + quicksort(right)",
      "type": "code",
      "indent": 4
    }
  ],
  "correct_order": ["binary-search-header", "binary-vars", "binary-while", "binary-mid", "binary-check", "binary-left", "binary-right", "binary-return", "quicksort-header", "quicksort-base", "quicksort-pivot", "quicksort-left-part", "quicksort-middle-part", "quicksort-right-part", "quicksort-return"],
  "hints": [
    "Binary search requires sorted data and has O(log n) complexity",
    "Quicksort uses divide-and-conquer with average O(n log n) complexity",
    "Binary search eliminates half the remaining elements each iteration",
    "Quicksort partitions around a pivot and recursively sorts subarrays"
  ],
  "difficulty": "advanced"
}' WHERE id = 'ad-dragdrop-1';

UPDATE lessons SET drag_drop_data = '{
  "instructions": "Build a complete database connection and query system. This pattern is essential for real-world applications that need to store and retrieve data persistently.",
  "code_blocks": [
    {
      "id": "import-sqlite",
      "content": "import sqlite3",
      "type": "code",
      "indent": 0
    },
    {
      "id": "class-definition",
      "content": "class DatabaseManager:",
      "type": "code",
      "indent": 0
    },
    {
      "id": "init-method",
      "content": "def __init__(self, db_name):",
      "type": "function",
      "indent": 4
    },
    {
      "id": "connect-db",
      "content": "self.conn = sqlite3.connect(db_name)",
      "type": "code",
      "indent": 8
    },
    {
      "id": "create-cursor",
      "content": "self.cursor = self.conn.cursor()",
      "type": "code",
      "indent": 8
    },
    {
      "id": "create-table-method",
      "content": "def create_table(self):",
      "type": "function",
      "indent": 4
    },
    {
      "id": "create-table-sql",
      "content": "self.cursor.execute('''CREATE TABLE IF NOT EXISTS users",
      "type": "code",
      "indent": 8
    },
    {
      "id": "table-columns",
      "content": "(id INTEGER PRIMARY KEY, name TEXT, email TEXT)''')",
      "type": "code",
      "indent": 12
    },
    {
      "id": "commit-changes",
      "content": "self.conn.commit()",
      "type": "code",
      "indent": 8
    },
    {
      "id": "insert-method",
      "content": "def insert_user(self, name, email):",
      "type": "function",
      "indent": 4
    },
    {
      "id": "insert-sql",
      "content": "self.cursor.execute(\"INSERT INTO users (name, email) VALUES (?, ?)\", (name, email))",
      "type": "code",
      "indent": 8
    },
    {
      "id": "query-method",
      "content": "def query_users(self):",
      "type": "function",
      "indent": 4
    },
    {
      "id": "query-sql",
      "content": "self.cursor.execute(\"SELECT * FROM users\")",
      "type": "code",
      "indent": 8
    },
    {
      "id": "fetch-results",
      "content": "return self.cursor.fetchall()",
      "type": "code",
      "indent": 8
    }
  ],
  "correct_order": ["import-sqlite", "class-definition", "init-method", "connect-db", "create-cursor", "create-table-method", "create-table-sql", "table-columns", "commit-changes", "insert-method", "insert-sql", "query-method", "query-sql", "fetch-results"],
  "hints": [
    "Always use parameterized queries (?) to prevent SQL injection",
    "Commit changes after INSERT/UPDATE/DELETE operations",
    "Use context managers (with statements) for automatic connection handling",
    "SQLite is great for development and small applications"
  ],
  "difficulty": "advanced"
}' WHERE id = 'ad-dragdrop-2';

UPDATE lessons SET drag_drop_data = '{
  "instructions": "Create a REST API using FastAPI with proper error handling, validation, and documentation. This is the foundation of modern web services.",
  "code_blocks": [
    {
      "id": "import-fastapi",
      "content": "from fastapi import FastAPI, HTTPException, Depends",
      "type": "code",
      "indent": 0
    },
    {
      "id": "import-pydantic",
      "content": "from pydantic import BaseModel",
      "type": "code",
      "indent": 0
    },
    {
      "id": "import-typing",
      "content": "from typing import List, Optional",
      "type": "code",
      "indent": 0
    },
    {
      "id": "create-app",
      "content": "app = FastAPI(title=\"Task Manager API\")",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "task-model",
      "content": "class Task(BaseModel):",
      "type": "code",
      "indent": 0
    },
    {
      "id": "task-id",
      "content": "id: Optional[int] = None",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "task-title",
      "content": "title: str",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "task-completed",
      "content": "completed: bool = False",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "task-storage",
      "content": "tasks_db = []",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "get-endpoint",
      "content": "@app.get(\"/tasks\", response_model=List[Task])",
      "type": "code",
      "indent": 0
    },
    {
      "id": "get-function",
      "content": "async def get_tasks():",
      "type": "function",
      "indent": 4
    },
    {
      "id": "get-return",
      "content": "return tasks_db",
      "type": "code",
      "indent": 8
    },
    {
      "id": "post-endpoint",
      "content": "@app.post(\"/tasks\", response_model=Task)",
      "type": "code",
      "indent": 0
    },
    {
      "id": "post-function",
      "content": "async def create_task(task: Task):",
      "type": "function",
      "indent": 4
    }
  ],
  "correct_order": ["import-fastapi", "import-pydantic", "import-typing", "create-app", "task-model", "task-id", "task-title", "task-completed", "task-storage", "get-endpoint", "get-function", "get-return", "post-endpoint", "post-function"],
  "hints": [
    "FastAPI automatically generates OpenAPI documentation",
    "Pydantic models provide automatic validation and serialization",
    "Use async/await for better performance with I/O operations",
    "Response models ensure proper API contract documentation"
  ],
  "difficulty": "advanced"
}' WHERE id = 'ad-dragdrop-3';

UPDATE lessons SET drag_drop_data = '{
  "instructions": "Build a complete data analysis pipeline using Pandas. This pattern is essential for data science and business intelligence tasks.",
  "code_blocks": [
    {
      "id": "import-pandas",
      "content": "import pandas as pd",
      "type": "code",
      "indent": 0
    },
    {
      "id": "import-numpy",
      "content": "import numpy as np",
      "type": "code",
      "indent": 0
    },
    {
      "id": "load-data",
      "content": "def load_and_clean_data(filepath):",
      "type": "function",
      "indent": 0
    },
    {
      "id": "read-csv",
      "content": "df = pd.read_csv(filepath)",
      "type": "code",
      "indent": 4
    },
    {
      "id": "handle-missing",
      "content": "df = df.fillna(df.mean(numeric_only=True))",
      "type": "code",
      "indent": 4
    },
    {
      "id": "remove-duplicates",
      "content": "df = df.drop_duplicates()",
      "type": "code",
      "indent": 4
    },
    {
      "id": "analyze-data",
      "content": "def analyze_data(df):",
      "type": "function",
      "indent": 0
    },
    {
      "id": "summary-stats",
      "content": "summary = df.describe()",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "correlation",
      "content": "correlations = df.corr(numeric_only=True)",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "group-by",
      "content": "grouped = df.groupby('category').agg({'value': ['mean', 'sum', 'count']})",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "visualize-data",
      "content": "def create_visualizations(df):",
      "type": "function",
      "indent": 0
    },
    {
      "id": "plot-histogram",
      "content": "df['value'].hist(bins=20)",
      "type": "code",
      "indent": 4
    }
  ],
  "correct_order": ["import-pandas", "import-numpy", "load-data", "read-csv", "handle-missing", "remove-duplicates", "analyze-data", "summary-stats", "correlation", "group-by", "visualize-data", "plot-histogram"],
  "hints": [
    "Always explore data with describe() and info() first",
    "Handle missing values before analysis to avoid errors",
    "GroupBy operations are powerful for aggregating data",
    "Pandas integrates well with matplotlib for visualization"
  ],
  "difficulty": "advanced"
}' WHERE id = 'ad-dragdrop-4';

UPDATE lessons SET drag_drop_data = '{
  "instructions": "Create a machine learning workflow using scikit-learn. This pattern is fundamental for building predictive models and AI applications.",
  "code_blocks": [
    {
      "id": "import-sklearn",
      "content": "from sklearn.model_selection import train_test_split",
      "type": "code",
      "indent": 0
    },
    {
      "id": "import-preprocessing",
      "content": "from sklearn.preprocessing import StandardScaler",
      "type": "code",
      "indent": 0
    },
    {
      "id": "import-models",
      "content": "from sklearn.ensemble import RandomForestClassifier",
      "type": "code",
      "indent": 0
    },
    {
      "id": "import-metrics",
      "content": "from sklearn.metrics import accuracy_score, classification_report",
      "type": "code",
      "indent": 0
    },
    {
      "id": "load-data-function",
      "content": "def load_data():",
      "type": "function",
      "indent": 0
    },
    {
      "id": "features-target",
      "content": "X, y = create_features_and_target()",
      "type": "code",
      "indent": 4
    },
    {
      "id": "split-data",
      "content": "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)",
      "type": "code",
      "indent": 4
    },
    {
      "id": "preprocess-data",
      "content": "scaler = StandardScaler()",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "fit-transform",
      "content": "X_train_scaled = scaler.fit_transform(X_train)",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "transform-test",
      "content": "X_test_scaled = scaler.transform(X_test)",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "train-model",
      "content": "model = RandomForestClassifier(n_estimators=100, random_state=42)",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "fit-model",
      "content": "model.fit(X_train_scaled, y_train)",
      "type": "code",
      "indent": 0
    }
  ],
  "correct_order": ["import-sklearn", "import-preprocessing", "import-models", "import-metrics", "load-data-function", "features-target", "split-data", "preprocess-data", "fit-transform", "transform-test", "train-model", "fit-model"],
  "hints": [
    "Always split data before preprocessing to avoid data leakage",
    "Use fit_transform on training data, transform on test data",
    "RandomForest is good for many classification tasks",
    "Scale features for algorithms that are sensitive to magnitude"
  ],
  "difficulty": "advanced"
}' WHERE id = 'ad-dragdrop-5';

-- =====================================
-- ADVANCED PUZZLE GAME LESSONS (5)
-- =====================================

INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, game_data, estimated_minutes) VALUES
('ad-puzzle-1', 'Algorithm Complexity Quiz', 'Big O notation and efficiency analysis', 'advanced', 60, 1, 'section-advanced-puzzles', 'puzzle', 60),
('ad-puzzle-2', 'Design Pattern Recognition', 'Identify common programming patterns', 'advanced', 65, 2, 'section-advanced-puzzles', 'puzzle', 65),
('ad-puzzle-3', 'System Design Challenge', 'Architecture decision making for scalable systems', 'advanced', 70, 3, 'section-advanced-puzzles', 'puzzle', 70),
('ad-puzzle-4', 'Performance Optimization Race', 'Choose optimal solutions for performance problems', 'advanced', 68, 4, 'section-advanced-puzzles', 'puzzle', 68),
('ad-puzzle-5', 'Advanced Error Handling', 'Complex exception scenarios and recovery strategies', 'advanced', 72, 5, 'section-advanced-puzzles', 'puzzle', 72)
ON CONFLICT (id) DO NOTHING;

-- Update game_data for advanced puzzle lessons
UPDATE lessons SET game_data = '{
  "time_bonus": 300,
  "streak_multiplier": 30,
  "questions": [
    {
      "id": "complexity-1",
      "question": "What is the time complexity of this nested loop algorithm?",
      "code": "for i in range(n):\n    for j in range(n):\n        for k in range(n):\n            print(i, j, k)",
      "options": ["O(n)", "O(n²)", "O(n³)", "O(log n)"],
      "correctAnswer": 2,
      "explanation": "Three nested loops each running n times result in O(n³) cubic time complexity.",
      "difficulty": "hard",
      "points": 40,
      "timeLimit": 45
    },
    {
      "id": "complexity-2",
      "question": "Which data structure provides O(1) average time for all operations?",
      "code": "# Insert, delete, and search operations",
      "options": ["Array/List", "Linked List", "Hash Table", "Binary Search Tree"],
      "correctAnswer": 2,
      "explanation": "Hash tables provide O(1) average time complexity for insert, delete, and search operations.",
      "difficulty": "hard",
      "points": 45,
      "timeLimit": 50
    },
    {
      "id": "complexity-3",
      "question": "What is the space complexity of recursive Fibonacci?",
      "code": "def fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)",
      "options": ["O(1)", "O(n)", "O(log n)", "O(2^n)"],
      "correctAnswer": 1,
      "explanation": "Recursive Fibonacci uses O(n) space due to the call stack depth.",
      "difficulty": "expert",
      "points": 50,
      "timeLimit": 60
    }
  ]
}' WHERE id = 'ad-puzzle-1';

UPDATE lessons SET game_data = '{
  "time_bonus": 280,
  "streak_multiplier": 28,
  "questions": [
    {
      "id": "pattern-1",
      "question": "What design pattern is shown in this code?",
      "code": "class Singleton:\n    _instance = None\n    def __new__(cls):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n        return cls._instance",
      "options": ["Factory", "Singleton", "Observer", "Decorator"],
      "correctAnswer": 1,
      "explanation": "This ensures only one instance of the class can exist - the Singleton pattern.",
      "difficulty": "hard",
      "points": 35,
      "timeLimit": 40
    },
    {
      "id": "pattern-2",
      "question": "Which pattern would be best for creating objects without specifying exact classes?",
      "code": "# Need to create different types of database connections",
      "options": ["Factory Method", "Singleton", "Adapter", "Strategy"],
      "correctAnswer": 0,
      "explanation": "Factory Method pattern lets you create objects without specifying their exact classes.",
      "difficulty": "hard",
      "points": 40,
      "timeLimit": 45
    }
  ]
}' WHERE id = 'ad-puzzle-2';

UPDATE lessons SET game_data = '{
  "time_bonus": 320,
  "streak_multiplier": 32,
  "questions": [
    {
      "id": "system-1",
      "question": "For a social media feed, which approach scales best?",
      "code": "# Millions of users, real-time updates needed",
      "options": ["SQL JOIN queries", "NoSQL with caching", "File-based storage", "In-memory only"],
      "correctAnswer": 1,
      "explanation": "NoSQL databases like Redis/MongoDB with caching layers handle high-volume social data best.",
      "difficulty": "expert",
      "points": 45,
      "timeLimit": 60
    },
    {
      "id": "system-2",
      "question": "How would you handle rate limiting for an API?",
      "code": "# 1000 requests per minute per user",
      "options": ["Database counters", "Redis with sliding window", "File logging", "Memory array"],
      "correctAnswer": 1,
      "explanation": "Redis with sliding window algorithms provides efficient, distributed rate limiting.",
      "difficulty": "expert",
      "points": 50,
      "timeLimit": 65
    }
  ]
}' WHERE id = 'ad-puzzle-3';

UPDATE lessons SET game_data = '{
  "time_bonus": 290,
  "streak_multiplier": 29,
  "questions": [
    {
      "id": "performance-1",
      "question": "Which is fastest for finding intersections of two large lists?",
      "code": "# list1 has 1M items, list2 has 1M items",
      "options": ["Nested loops O(n²)", "Set intersection O(n)", "List comprehension", "Binary search"],
      "correctAnswer": 1,
      "explanation": "Converting to sets and using intersection is O(n) vs O(n²) for nested loops.",
      "difficulty": "hard",
      "points": 40,
      "timeLimit": 50
    }
  ]
}' WHERE id = 'ad-puzzle-4';

UPDATE lessons SET game_data = '{
  "time_bonus": 310,
  "streak_multiplier": 31,
  "questions": [
    {
      "id": "error-1",
      "question": "How should you handle database connection failures in production?",
      "code": "# Critical application needs database access",
      "options": ["Retry with exponential backoff", "Fail immediately", "Ignore errors", "Retry infinitely"],
      "correctAnswer": 0,
      "explanation": "Exponential backoff with retries handles temporary failures without overwhelming systems.",
      "difficulty": "expert",
      "points": 48,
      "timeLimit": 55
    }
  ]
}' WHERE id = 'ad-puzzle-5';

-- =====================================
-- ADVANCED STORY LESSONS (5)
-- =====================================

INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, story_data, estimated_minutes) VALUES
('ad-story-1', 'The Startup CTO\'s Dilemma', 'Build a scalable application architecture', 'advanced', 80, 1, 'section-advanced-stories', 'story', 80),
('ad-story-2', 'The Data Science Competition', 'Solve real-world machine learning problems', 'advanced', 85, 2, 'section-advanced-stories', 'story', 85),
('ad-story-3', 'The Open Source Contributor', 'Contribute to Python projects professionally', 'advanced', 90, 3, 'section-advanced-stories', 'story', 90),
('ad-story-4', 'The DevOps Engineer', 'Deploy and maintain Python applications', 'advanced', 95, 4, 'section-advanced-stories', 'story', 95),
('ad-story-5', 'The Python Conference Talk', 'Share knowledge with the community', 'advanced', 100, 5, 'section-advanced-stories', 'story', 100)
ON CONFLICT (id) DO NOTHING;

-- Update story_data for advanced story lessons
UPDATE lessons SET story_data = '{
  "setting": "A fast-growing startup where Alex, now a senior developer, faces the challenge of scaling their application to handle millions of users",
  "protagonist": {
    "name": "Alex",
    "avatar": "👨‍💻",
    "role": "Startup CTO",
    "personality": "Strategic thinker, architect, under pressure to deliver scalable solutions"
  },
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Scaling Crisis",
      "content": "Alex stared at the monitoring dashboard, heart racing. The startup\\'s app was slowing down dramatically as user numbers climbed past 100,000. The CEO burst into the office.\n\n\"We\\'re getting complaints about slow response times!\" she said. \"Investors are asking about our scalability. We need to fix this now.\"\n\nAlex nodded grimly. The current architecture, built for rapid prototyping, was buckling under real-world load. Database queries were timing out, API responses were lagging, and the team was spending more time fighting fires than building features.\n\n\"I need to redesign everything,\" Alex told the team. \"We\\'re moving from a prototype to a production system. This means microservices, caching, load balancing, and proper monitoring.\"",
      "character": {
        "name": "Sarah Chen",
        "avatar": "👩‍💼",
        "role": "Startup CEO",
        "personality": "Visionary, demanding, focused on growth and user experience"
      },
      "background": "Modern startup office with multiple monitors showing system metrics and error rates",
      "objectives": [
        "Design a scalable microservices architecture",
        "Implement caching strategies for performance",
        "Set up load balancing and monitoring"
      ],
      "challenge": {
        "description": "Design a scalable architecture to handle millions of users",
        "starter_code": "# Scalable Architecture Design\n\nclass ScalableArchitecture:\n    def __init__(self):\n        self.services = {}\n        self.cache_layer = None\n        self.load_balancer = None\n    \n    def design_microservices(self):\n        # Design service separation strategy\n        # - User service (authentication, profiles)\n        # - Content service (posts, media)\n        # - Notification service (emails, pushes)\n        # - Analytics service (user behavior)\n        pass\n    \n    def implement_caching(self):\n        # Multi-level caching strategy\n        # - Redis for session data\n        # - CDN for static content\n        # - Database query caching\n        pass",
        "solution": "# Scalable Architecture Design\n\nclass ScalableArchitecture:\n    def __init__(self):\n        self.services = {\n            'user_service': 'http://user-service:8001',\n            'content_service': 'http://content-service:8002',\n            'notification_service': 'http://notification-service:8003'\n        }\n        self.cache_layer = RedisCache()\n        self.load_balancer = LoadBalancer()\n    \n    def design_microservices(self):\n        # Service separation by domain\n        services_config = {\n            'user_service': {\n                'database': 'users_db',\n                'cache_ttl': 3600,  # 1 hour\n                'instances': 3\n            },\n            'content_service': {\n                'database': 'content_db',\n                'cache_ttl': 1800,  # 30 minutes\n                'instances': 5\n            }\n        }\n        return services_config\n    \n    def implement_caching(self):\n        # Redis caching with different TTLs\n        cache_strategies = {\n            'user_sessions': 3600,      # 1 hour\n            'popular_content': 1800,     # 30 minutes\n            'api_responses': 300,        # 5 minutes\n            'user_profiles': 7200        # 2 hours\n        }\n        return cache_strategies\n\n# Implementation example\narchitecture = ScalableArchitecture()\nservices = architecture.design_microservices()\ncache_strategies = architecture.implement_caching()\n\nprint(\"🏗️  Scalable Architecture Design Complete!\")\nprint(f\"Services: {list(services.keys())}\")\nprint(f\"Cache strategies: {len(cache_strategies)} levels implemented\")",
        "hints": [
          "Separate services by business domain (users, content, notifications)",
          "Use Redis for fast data access and session management",
          "Implement CDN for static content delivery",
          "Set up proper monitoring and alerting systems"
        ],
        "explanation": "Excellent architecture design! You\\'ve created a scalable system that can handle millions of users. The key is separation of concerns, strategic caching, and proper monitoring."
      },
      "reward": {
        "xp": 40,
        "message": "Sarah beams: \"This is exactly what we needed! With this architecture, we can handle 10x growth. You\\'ve saved the company!\"",
        "item": "Scalability Architect Badge"
      }
    }
  ]
}' WHERE id = 'ad-story-1';

UPDATE lessons SET story_data = '{
  "setting": "A competitive data science hackathon where Alex represents their company against top data scientists from around the world",
  "protagonist": {
    "name": "Alex",
    "avatar": "👨‍💻",
    "role": "Data Science Lead",
    "personality": "Competitive, analytical, thrives under pressure"
  },
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Kaggle Challenge",
      "content": "The conference hall buzzed with excitement as 100 teams gathered for the international data science competition. The challenge: predict customer churn for a telecom company using real customer data.\n\n\"Welcome, data scientists!\" the announcer said. \"You have 48 hours to build the most accurate prediction model. The winning team gets $100,000 and bragging rights!\"\n\nAlex looked at the dataset: 500,000 customers with 200 features each. This was massive. Other teams were already firing up Jupyter notebooks and visualizing data. Alex knew they needed a systematic approach.\n\n\"First, understand the data,\" Alex told the team. \"Then feature engineering, then model selection. We need to be methodical but fast.\"",
      "character": {
        "name": "Dr. Lisa Kumar",
        "avatar": "👩‍🔬",
        "role": "Competition Judge",
        "personality": "Brilliant, fair, pushes competitors to excel"
      },
      "background": "High-tech conference hall with large screens showing leaderboards and team progress",
      "objectives": [
        "Perform exploratory data analysis on large datasets",
        "Engineer relevant features for machine learning",
        "Build and optimize predictive models"
      ],
      "challenge": {
        "description": "Create a machine learning pipeline to predict customer churn",
        "starter_code": "# Customer Churn Prediction Pipeline\n\nimport pandas as pd\nimport numpy as np\nfrom sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier\nfrom sklearn.model_selection import cross_val_score, GridSearchCV\nfrom sklearn.preprocessing import StandardScaler, LabelEncoder\nfrom sklearn.metrics import accuracy_score, roc_auc_score\n\nclass ChurnPredictor:\n    def __init__(self):\n        self.models = {}\n        self.scalers = {}\n        self.encoders = {}\n    \n    def explore_data(self, df):\n        # Exploratory data analysis\n        # Find patterns, correlations, missing values\n        pass\n    \n    def engineer_features(self, df):\n        # Create new features from existing ones\n        # Handle categorical variables\n        # Deal with missing values\n        pass",
        "solution": "# Customer Churn Prediction Pipeline\n\nclass ChurnPredictor:\n    def __init__(self):\n        self.models = {}\n        self.scalers = {}\n        self.encoders = {}\n    \n    def explore_data(self, df):\n        \"\"\"Comprehensive exploratory data analysis\"\"\"\n        insights = {\n            'churn_rate': df['churn'].mean(),\n            'missing_values': df.isnull().sum().sum(),\n            'correlations': df.corr(numeric_only=True)['churn'].abs().sort_values(ascending=False).head(10)\n        }\n        return insights\n    \n    def engineer_features(self, df):\n        \"\"\"Advanced feature engineering\"\"\"\n        # Handle missing values\n        numeric_cols = df.select_dtypes(include=[np.number]).columns\n        df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())\n        \n        # Encode categorical variables\n        categorical_cols = df.select_dtypes(include=['object']).columns\n        for col in categorical_cols:\n            if col != 'customer_id':\n                df[col] = LabelEncoder().fit_transform(df[col].astype(str))\n        \n        # Create interaction features\n        df['tenure_monthly_ratio'] = df['tenure'] / (df['monthly_charges'] + 1)\n        df['total_services'] = df[['phone_service', 'internet_service', 'streaming']].sum(axis=1)\n        \n        return df\n    \n    def train_models(self, X, y):\n        \"\"\"Train multiple models and compare performance\"\"\"\n        models = {\n            'random_forest': RandomForestClassifier(n_estimators=200, random_state=42),\n            'gradient_boost': GradientBoostingClassifier(n_estimators=150, random_state=42)\n        }\n        \n        results = {}\n        for name, model in models.items():\n            cv_scores = cross_val_score(model, X, y, cv=5, scoring='roc_auc')\n            results[name] = {\n                'mean_score': cv_scores.mean(),\n                'std_score': cv_scores.std()\n            }\n            model.fit(X, y)\n            self.models[name] = model\n        \n        return results\n\n# Example usage\npredictor = ChurnPredictor()\n\n# Simulate data exploration\nprint(\"🔍 Exploring customer churn data...\")\ninsights = {'churn_rate': 0.265, 'missing_values': 0, 'top_correlations': ['contract_monthly', 'tenure', 'internet_service']}\nprint(f\"Churn rate: {insights['churn_rate']:.1%}\")\nprint(f\"Key predictors: {', '.join(insights['top_correlations'])}\")\n\nprint(\"\\n🚀 Advanced machine learning pipeline ready!\")\nprint(\"✅ Feature engineering complete\")\nprint(\"✅ Model training complete\")\nprint(\"✅ Cross-validation complete\")",
        "hints": [
          "Start with exploratory data analysis to understand patterns",
          "Create interaction features from existing variables",
          "Use cross-validation to evaluate model performance",
          "Try multiple algorithms and select the best performer"
        ],
        "explanation": "Outstanding work! You\\'ve built a comprehensive machine learning pipeline that handles real-world data science challenges. This systematic approach is exactly what professional data scientists use."
      },
      "reward": {
        "xp": 43,
        "message": "Dr. Kumar announces: \"Team Alex has achieved 92% accuracy - the highest score we\\'ve ever seen! Outstanding data science work!\"",
        "item": "Data Science Champion Badge"
      }
    }
  ]
}' WHERE id = 'ad-story-2';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_advanced_lessons ON lessons(section_id, lesson_type);
CREATE INDEX IF NOT EXISTS idx_advanced_sections ON sections(path);

-- Verify the data was inserted
SELECT
  s.title as section_title,
  COUNT(l.id) as lesson_count,
  STRING_AGG(DISTINCT l.lesson_type, ', ') as lesson_types
FROM lessons l
JOIN sections s ON l.section_id = s.id
WHERE s.id LIKE 'section-advanced-%'
GROUP BY s.title
ORDER BY s.order_index;