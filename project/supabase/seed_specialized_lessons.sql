/*
  # PyLearn Comprehensive Lesson Library - Specialized Modules

  ## Overview
  15 specialized lessons covering domain-specific Python applications:
  - Data Science Module (5 lessons)
  - Web Development Module (5 lessons)
  - Automation Module (5 lessons)

  ## Structure
  Mix of drag-drop, puzzle game, and story lessons focused on specific domains

  ## Target Audience
  Learners who want to apply Python to specific domains and career paths
*/

-- Insert new sections for specialized learning paths
INSERT INTO sections (id, title, description, path, order_index, unlock_requirement_xp) VALUES
('section-data-science', 'Data Science with Python', 'Learn data analysis, visualization, and machine learning', 'specialized-modules', 10, 600),
('section-web-development', 'Web Development', 'Build web applications with Flask and Django', 'specialized-modules', 11, 650),
('section-automation', 'Python Automation', 'Automate tasks and build productivity tools', 'specialized-modules', 12, 700)
ON CONFLICT (id) DO NOTHING;

-- =====================================
-- DATA SCIENCE MODULE (5 LESSONS)
-- =====================================

INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, drag_drop_data, estimated_minutes) VALUES
('ds-dragdrop-1', 'NumPy Array Operations', 'Master array manipulation and numerical computing', 'intermediate', 50, 1, 'section-data-science', 'drag-drop', 50),
('ds-puzzle-1', 'Pandas Data Manipulation', 'Advanced data wrangling and analysis challenges', 'intermediate', 55, 2, 'section-data-science', 'puzzle', 55),
('ds-dragdrop-2', 'Data Visualization', 'Create charts and graphs with Matplotlib', 'intermediate', 52, 3, 'section-data-science', 'drag-drop', 52),
('ds-story-1', 'Machine Learning Project', 'Build a complete ML pipeline from data to deployment', 'advanced', 70, 4, 'section-data-science', 'story', 70),
('ds-puzzle-2', 'Statistical Analysis', 'Statistical tests and hypothesis validation', 'advanced', 65, 5, 'section-data-science', 'puzzle', 65)
ON CONFLICT (id) DO NOTHING;

-- Update content for Data Science lessons
UPDATE lessons SET drag_drop_data = '{
  "instructions": "Arrange NumPy operations to perform data analysis on a dataset. NumPy is the foundation of data science in Python, providing fast array operations.",
  "code_blocks": [
    {
      "id": "import-numpy",
      "content": "import numpy as np",
      "type": "code",
      "indent": 0
    },
    {
      "id": "create-array",
      "content": "data = np.array([23, 45, 67, 89, 12, 34, 56, 78, 90, 43])",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "reshape-array",
      "content": "matrix = data.reshape(2, 5)",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "calculate-stats",
      "content": "mean_val = np.mean(data)",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "calculate-std",
      "content": "std_val = np.std(data)",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "boolean-filter",
      "content": "high_values = data[data > np.mean(data)]",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "print-results",
      "content": "print(f\"Mean: {mean_val:.2f}, Std: {std_val:.2f}\")",
      "type": "code",
      "indent": 0
    },
    {
      "id": "print-high",
      "content": "print(f\"Values above mean: {high_values}\")",
      "type": "code",
      "indent": 0
    }
  ],
  "correct_order": ["import-numpy", "create-array", "reshape-array", "calculate-stats", "calculate-std", "boolean-filter", "print-results", "print-high"],
  "hints": [
    "NumPy arrays are faster than Python lists for numerical operations",
    "Boolean indexing lets you filter arrays based on conditions",
    "Reshape changes array dimensions without changing data",
    "NumPy provides vectorized operations for fast computations"
  ],
  "difficulty": "intermediate"
}' WHERE id = 'ds-dragdrop-1';

UPDATE lessons SET drag_drop_data = '{
  "instructions": "Create a data visualization pipeline with Matplotlib. Visualizations help communicate insights from data analysis.",
  "code_blocks": [
    {
      "id": "import-matplotlib",
      "content": "import matplotlib.pyplot as plt",
      "type": "code",
      "indent": 0
    },
    {
      "id": "data-arrays",
      "content": "months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "sales-data",
      "content": "sales = [120, 150, 180, 165, 200, 220]",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "create-figure",
      "content": "plt.figure(figsize=(10, 6))",
      "type": "code",
      "indent": 0
    },
    {
      "id": "plot-line",
      "content": "plt.plot(months, sales, marker='o', linewidth=2)",
      "type": "code",
      "indent": 0
    },
    {
      "id": "add-title",
      "content": "plt.title('Monthly Sales Trend', fontsize=16)",
      "type": "code",
      "indent": 0
    },
    {
      "id": "add-labels",
      "content": "plt.xlabel('Month', fontsize=12)",
      "type": "code",
      "indent": 0
    },
    {
      "id": "y-label",
      "content": "plt.ylabel('Sales ($)', fontsize=12)",
      "type": "code",
      "indent": 0
    },
    {
      "id": "add-grid",
      "content": "plt.grid(True, alpha=0.3)",
      "type": "code",
      "indent": 0
    },
    {
      "id": "save-plot",
      "content": "plt.savefig('sales_trend.png', dpi=300)",
      "type": "code",
      "indent": 0
    }
  ],
  "correct_order": ["import-matplotlib", "data-arrays", "sales-data", "create-figure", "plot-line", "add-title", "add-labels", "y-label", "add-grid", "save-plot"],
  "hints": [
    "Always set figure size before plotting for better control",
    "Add titles and labels for clear communication",
    "Save plots with high DPI for publication quality",
    "Use grids to help readers interpret values"
  ],
  "difficulty": "intermediate"
}' WHERE id = 'ds-dragdrop-2';

UPDATE lessons SET game_data = '{
  "time_bonus": 250,
  "streak_multiplier": 25,
  "questions": [
    {
      "id": "pandas-1",
      "question": "How do you handle missing values in a Pandas DataFrame?",
      "code": "import pandas as pd\ndf = pd.DataFrame({'A': [1, 2, None, 4], 'B': [5, None, 7, 8]})",
      "options": ["df.dropna()", "df.fillna(0)", "Both A and B", "Neither works"],
      "correctAnswer": 2,
      "explanation": "Both dropna() removes rows with missing values and fillna() replaces them with specified values.",
      "difficulty": "medium",
      "points": 25,
      "timeLimit": 30
    },
    {
      "id": "pandas-2",
      "question": "What does this groupby operation return?",
      "code": "df.groupby('category')['sales'].sum()",
      "options": ["Count by category", "Sum of sales by category", "Average sales", "Maximum sales"],
      "correctAnswer": 1,
      "explanation": "groupby('category')['sales'].sum() calculates total sales for each category.",
      "difficulty": "medium",
      "points": 30,
      "timeLimit": 35
    }
  ]
}' WHERE id = 'ds-puzzle-1';

UPDATE lessons SET story_data = '{
  "setting": "A data science competition where Alex tackles a real-world machine learning problem: predicting house prices",
  "protagonist": {
    "name": "Alex",
    "avatar": "👨‍💻",
    "role": "Data Scientist",
    "personality": "Analytical, thorough, passionate about extracting insights from data"
  },
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Housing Price Challenge",
      "content": "Alex opened the competition dataset: 50,000 houses with 80 features each. The goal was simple but challenging: predict house prices accurately enough to help a real estate company.\n\n\"This is a classic regression problem,\" Alex thought, pulling up a Jupyter notebook. \"But the real challenge is feature engineering and model selection.\"\n\nThe dataset had everything: square footage, number of bedrooms, location data, year built, and even text descriptions. Some features were missing, others were categorical, and many needed transformation.\n\n\"Let\\'s start with understanding the data,\" Alex said, beginning the systematic data science process that would lead to a winning solution.",
      "character": {
        "name": "Dr. Emily Zhang",
        "avatar": "📊",
        "role": "Competition Mentor",
        "personality": "Experienced data scientist, guides with practical wisdom"
      },
      "background": "Data science lab with multiple monitors showing data visualizations and model performance metrics",
      "objectives": [
        "Perform comprehensive exploratory data analysis",
        "Engineer predictive features from raw data",
        "Build and evaluate machine learning models"
      ],
      "challenge": {
        "description": "Build a complete machine learning pipeline for house price prediction",
        "starter_code": "# House Price Prediction Pipeline\n\nimport pandas as pd\nimport numpy as np\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor\nfrom sklearn.metrics import mean_squared_error, r2_score\n\nclass HousePricePredictor:\n    def __init__(self):\n        self.model = None\n        self.feature_columns = []\n    \n    def preprocess_data(self, df):\n        # Handle missing values, encode categorical variables\n        # Create new features through feature engineering\n        pass\n    \n    def train_model(self, X_train, y_train):\n        # Train and tune regression models\n        # Compare different algorithms\n        pass",
        "solution": "# House Price Prediction Pipeline\n\nclass HousePricePredictor:\n    def __init__(self):\n        self.model = None\n        self.feature_columns = []\n    \n    def preprocess_data(self, df):\n        \"\"\"Complete data preprocessing pipeline\"\"\"\n        # Handle missing values\n        numeric_cols = df.select_dtypes(include=[np.number]).columns\n        df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())\n        \n        # Fill categorical missing values\n        categorical_cols = df.select_dtypes(include=['object']).columns\n        for col in categorical_cols:\n            df[col] = df[col].fillna(df[col].mode()[0] if not df[col].mode().empty else 'Unknown')\n        \n        # Feature engineering\n        df['house_age'] = 2024 - df['year_built']\n        df['rooms_per_sqft'] = df['total_rooms'] / (df['square_footage'] + 1)\n        df['has_garden'] = (df['garden_area'] > 0).astype(int)\n        \n        # Encode categorical variables\n        df_encoded = pd.get_dummies(df, columns=categorical_cols, drop_first=True)\n        \n        return df_encoded\n    \n    def train_model(self, X_train, y_train):\n        \"\"\"Train and compare multiple regression models\"\"\"\n        models = {\n            'random_forest': RandomForestRegressor(n_estimators=200, random_state=42),\n            'gradient_boost': GradientBoostingRegressor(n_estimators=150, random_state=42)\n        }\n        \n        best_score = float('inf')\n        best_model = None\n        \n        for name, model in models.items():\n            model.fit(X_train, y_train)\n            # Using cross-validation would be better in practice\n            score = mean_squared_error(y_train, model.predict(X_train))\n            \n            if score < best_score:\n                best_score = score\n                best_model = model\n        \n        self.model = best_model\n        return best_model\n\n# Initialize predictor\npredictor = HousePricePredictor()\n\nprint(\"🏠 House Price Prediction Pipeline Ready!\")\nprint(\"✅ Data preprocessing pipeline configured\")\nprint(\"✅ Feature engineering complete\")\nprint(\"✅ Model selection algorithm ready\")\nprint(\"✅ Performance evaluation metrics set up\")",
        "hints": [
          "Always handle missing values before feature engineering",
          "Create interaction features that capture domain knowledge",
          "Use cross-validation for robust model evaluation",
          "Compare multiple algorithms to find the best performer"
        ],
        "explanation": "Excellent! You\\'ve built a professional-grade machine learning pipeline. This systematic approach to data preprocessing, feature engineering, and model selection is exactly what data scientists use in real-world projects."
      },
      "reward": {
        "xp": 35,
        "message": "Dr. Zhang nods approvingly: \"This is impressive work! Your pipeline is production-ready. You\\'ve mastered the complete data science workflow!\"",
        "item": "Data Science Expert Badge"
      }
    }
  ]
}' WHERE id = 'ds-story-1';

UPDATE lessons SET game_data = '{
  "time_bonus": 270,
  "streak_multiplier": 27,
  "questions": [
    {
      "id": "stats-1",
      "question": "What does a p-value of 0.03 indicate?",
      "code": "# Statistical test result: p-value = 0.03",
      "options": ["Strong evidence against null hypothesis", "Weak evidence", "No evidence", "Cannot determine"],
      "correctAnswer": 0,
      "explanation": "p-value < 0.05 typically indicates statistically significant evidence against the null hypothesis.",
      "difficulty": "hard",
      "points": 35,
      "timeLimit": 40
    }
  ]
}' WHERE id = 'ds-puzzle-2';

-- =====================================
-- WEB DEVELOPMENT MODULE (5 LESSONS)
-- =====================================

INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, drag_drop_data, estimated_minutes) VALUES
('web-dragdrop-1', 'Flask Web Applications', 'Build dynamic web applications with Flask', 'intermediate', 52, 1, 'section-web-development', 'drag-drop', 52),
('web-puzzle-1', 'REST API Design', "Design and implement RESTful API endpoints", 'intermediate', 58, 2, 'section-web-development', 'puzzle', 58),
('web-story-1', 'Django Blog Platform', 'Create a full-featured blog with Django', 'advanced', 75, 3, 'section-web-development', 'story', 75),
('web-dragdrop-2', 'Database Integration', 'Connect web applications to databases', 'advanced', 65, 4, 'section-web-development', 'drag-drop', 65),
('web-puzzle-2', 'Frontend Integration', 'Integrate Python backends with JavaScript frontends', 'advanced', 68, 5, 'section-web-development', 'puzzle', 68)
ON CONFLICT (id) DO NOTHING;

-- Update content for Web Development lessons
UPDATE lessons SET drag_drop_data = '{
  "instructions": "Build a complete Flask web application with routes, templates, and forms. Flask is perfect for building web applications quickly and flexibly.",
  "code_blocks": [
    {
      "id": "import-flask",
      "content": "from flask import Flask, render_template, request, redirect, url_for",
      "type": "code",
      "indent": 0
    },
    {
      "id": "create-app",
      "content": "app = Flask(__name__)",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "posts-data",
      "content": "posts = []",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "home-route",
      "content": "@app.route('/')",
      "type": "code",
      "indent": 0
    },
    {
      "id": "home-function",
      "content": "def home():",
      "type": "function",
      "indent": 4
    },
    {
      "id": "home-return",
      "content": "return render_template('home.html', posts=posts)",
      "type": "code",
      "indent": 8
    },
    {
      "id": "create-route",
      "content": "@app.route('/create', methods=['GET', 'POST'])",
      "type": "code",
      "indent": 0
    },
    {
      "id": "create-function",
      "content": "def create_post():",
      "type": "function",
      "indent": 4
    },
    {
      "id": "check-method",
      "content": "if request.method == 'POST':",
      "type": "code",
      "indent": 8
    },
    {
      "id": "add-post",
      "content": "posts.append({'title': request.form['title'], 'content': request.form['content']})",
      "type": "code",
      "indent": 12
    },
    {
      "id": "redirect-home",
      "content": "return redirect(url_for('home'))",
      "type": "code",
      "indent": 12
    },
    {
      "id": "return-form",
      "content": "return render_template('create.html')",
      "type": "code",
      "indent": 8
    }
  ],
  "correct_order": ["import-flask", "create-app", "posts-data", "home-route", "home-function", "home-return", "create-route", "create-function", "check-method", "add-post", "redirect-home", "return-form"],
  "hints": [
    "Flask routes map URLs to Python functions",
    "Use render_template to serve HTML files",
    "Request methods determine how form data is handled",
    "url_for generates URLs based on function names"
  ],
  "difficulty": "intermediate"
}' WHERE id = 'web-dragdrop-1';

UPDATE lessons SET drag_drop_data = '{
  "instructions": "Connect a Flask application to a database for persistent data storage. This pattern is essential for real web applications.",
  "code_blocks": [
    {
      "id": "import-sqlalchemy",
      "content": "from flask_sqlalchemy import SQLAlchemy",
      "type": "code",
      "indent": 0
    },
    {
      "id": "configure-db",
      "content": "app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'",
      "type": "code",
      "indent": 0
    },
    {
      "id": "init-db",
      "content": "db = SQLAlchemy(app)",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "post-model",
      "content": "class Post(db.Model):",
      "type": "code",
      "indent": 0
    },
    {
      "id": "post-id",
      "content": "id = db.Column(db.Integer, primary_key=True)",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "post-title",
      "content": "title = db.Column(db.String(100), nullable=False)",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "post-content",
      "content": "content = db.Column(db.Text, nullable=False)",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "post-date",
      "content": "created_at = db.Column(db.DateTime, default=datetime.utcnow)",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "create-route-db",
      "content": "@app.route('/create', methods=['POST'])",
      "type": "code",
      "indent": 0
    },
    {
      "id": "create-db-function",
      "content": "def create_post():",
      "type": "function",
      "indent": 4
    },
    {
      "id": "new-post",
      "content": "new_post = Post(title=request.form['title'], content=request.form['content'])",
      "type": "code",
      "indent": 8
    },
    {
      "id": "add-to-db",
      "content": "db.session.add(new_post)",
      "type": "code",
      "indent": 8
    },
    {
      "id": "commit-db",
      "content": "db.session.commit()",
      "type": "code",
      "indent": 8
    }
  ],
  "correct_order": ["import-sqlalchemy", "configure-db", "init-db", "post-model", "post-id", "post-title", "post-content", "post-date", "create-route-db", "create-db-function", "new-post", "add-to-db", "commit-db"],
  "hints": [
    "SQLAlchemy provides an ORM for database operations",
    "Models define database table structure",
    "db.session manages database transactions",
    "Always commit changes to save them to the database"
  ],
  "difficulty": "advanced"
}' WHERE id = 'web-dragdrop-2';

UPDATE lessons SET game_data = '{
  "time_bonus": 260,
  "streak_multiplier": 26,
  "questions": [
    {
      "id": "api-1",
      "question": "Which HTTP method should be used to update existing data?",
      "options": ["GET", "POST", "PUT", "DELETE"],
      "correctAnswer": 2,
      "explanation": "PUT is the standard HTTP method for updating existing resources.",
      "difficulty": "medium",
      "points": 28,
      "timeLimit": 30
    },
    {
      "id": "api-2",
      "question": "What status code indicates successful resource creation?",
      "options": ["200 OK", "201 Created", "202 Accepted", "204 No Content"],
      "correctAnswer": 1,
      "explanation": "201 Created is the standard status code for successful POST requests that create new resources.",
      "difficulty": "medium",
      "points": 30,
      "timeLimit": 35
    }
  ]
}' WHERE id = 'web-puzzle-1';

UPDATE lessons SET story_data = '{
  "setting": "A startup incubator where Alex is tasked with building a complete blog platform using Django, learning professional web development practices",
  "protagonist": {
    "name": "Alex",
    "avatar": "👨‍💻",
    "role": "Web Developer",
    "personality": "Creative problem-solver, learning to think in web frameworks"
  },
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Django Challenge",
      "content": "The startup incubator manager handed Alex a detailed specification document. \"We need a blog platform for our portfolio companies,\" she said. \"It needs user accounts, posts, comments, tags, and an admin interface. And we want it built with Django.\"\n\nAlex had worked with Flask before, but Django was different—bigger, more structured, with more built-in features. This would be a chance to learn a professional web framework used by companies like Instagram and Pinterest.\n\n\"Django follows the \\\"batteries included\\\" philosophy,\" Alex recalled from reading the documentation. \"It comes with authentication, admin panels, ORM, and much more built right in.\"\n\nTime to start building a real web application that could handle thousands of users and posts.",
      "character": {
        "name": "Maria Rodriguez",
        "avatar": "🚀",
        "role": "Startup Mentor",
        "personality": "Experienced tech entrepreneur, focuses on scalable solutions"
      },
      "background": "Modern co-working space with whiteboards covered in web architecture diagrams",
      "objectives": [
        "Build a Django project with proper app structure",
        "Create models for users, posts, and comments",
        "Implement views and templates for a complete blog"
      ],
      "challenge": {
        "description": "Create a complete Django blog platform with user authentication and content management",
        "starter_code": "# Django Blog Platform Setup\n\n# models.py\nfrom django.db import models\nfrom django.contrib.auth.models import User\n\nclass BlogPost(models.Model):\n    # Define blog post model fields\n    # Include title, content, author, timestamps\n    pass\n\nclass Comment(models.Model):\n    # Define comment model fields\n    # Connect to posts and users\n    pass\n\n# views.py\nfrom django.shortcuts import render, get_object_or_404, redirect\nfrom django.contrib.auth.decorators import login_required\n\ndef post_list(request):\n    # Display all blog posts\n    pass\n\n@login_required\ndef create_post(request):\n    # Handle post creation\n    pass",
        "solution": "# Django Blog Platform Implementation\n\n# models.py\nfrom django.db import models\nfrom django.contrib.auth.models import User\n\nclass BlogPost(models.Model):\n    title = models.CharField(max_length=200)\n    content = models.TextField()\n    author = models.ForeignKey(User, on_delete=models.CASCADE)\n    created_at = models.DateTimeField(auto_now_add=True)\n    updated_at = models.DateTimeField(auto_now=True)\n    published = models.BooleanField(default=False)\n    \n    def __str__(self):\n        return self.title\n    \n    class Meta:\n        ordering = ['-created_at']\n\nclass Comment(models.Model):\n    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')\n    author = models.ForeignKey(User, on_delete=models.CASCADE)\n    content = models.TextField()\n    created_at = models.DateTimeField(auto_now_add=True)\n    \n    def __str__(self):\n        return f'Comment by {self.author.username} on {self.post.title}'\n\n# views.py\nfrom django.shortcuts import render, get_object_or_404, redirect\nfrom django.contrib.auth.decorators import login_required\nfrom .models import BlogPost, Comment\nfrom .forms import BlogPostForm, CommentForm\n\ndef post_list(request):\n    posts = BlogPost.objects.filter(published=True)\n    return render(request, 'blog/post_list.html', {'posts': posts})\n\ndef post_detail(request, pk):\n    post = get_object_or_404(BlogPost, pk=pk)\n    comments = post.comments.all()\n    \n    if request.method == 'POST':\n        comment_form = CommentForm(request.POST)\n        if comment_form.is_valid():\n            comment = comment_form.save(commit=False)\n            comment.author = request.user\n            comment.post = post\n            comment.save()\n            return redirect('post_detail', pk=post.pk)\n    else:\n        comment_form = CommentForm()\n    \n    return render(request, 'blog/post_detail.html', {\n        'post': post, \n        'comments': comments, \n        'comment_form': comment_form\n    })\n\n@login_required\ndef create_post(request):\n    if request.method == 'POST':\n        form = BlogPostForm(request.POST)\n        if form.is_valid():\n            post = form.save(commit=False)\n            post.author = request.user\n            post.save()\n            return redirect('post_detail', pk=post.pk)\n    else:\n        form = BlogPostForm()\n    \n    return render(request, 'blog/create_post.html', {'form': form})\n\nprint(\"\\n🌟 Django Blog Platform Complete!\")\nprint(\"✅ Models configured with proper relationships\")\nprint(\"✅ Views implemented for CRUD operations\")\nprint(\"✅ Authentication and authorization setup\")\nprint(\"✅ Ready for template creation and URL routing\")",
        "hints": [
          "Django models automatically get ID fields and database management",
          "Use ForeignKey for relationships between models",
          "Login decorators protect views that require authentication",
          "Forms handle validation and data processing cleanly"
        ],
        "explanation": "Excellent! You\\'ve built a professional Django application with proper model relationships, view logic, and authentication. This foundation can be extended into a full-featured blog platform."
      },
      "reward": {
        "xp": 38,
        "message": "Maria high-fives you: \"This is impressive Django work! You\\'ve built a solid foundation that can scale to thousands of users. Great job thinking like a professional web developer!\"",
        "item": "Django Developer Badge"
      }
    }
  ]
}' WHERE id = 'web-story-1';

UPDATE lessons SET game_data = '{
  "time_bonus": 280,
  "streak_multiplier": 28,
  "questions": [
    {
      "id": "frontend-1",
      "question": "How do you handle API responses in JavaScript?",
      "code": "fetch('/api/data')\n  .then(response => response.______())\n  .then(data => console.log(data));",
      "options": ["parse", "json", "data", "text"],
      "correctAnswer": 1,
      "explanation": "response.json() parses the JSON response from the API.",
      "difficulty": "medium",
      "points": 32,
      "timeLimit": 35
    }
  ]
}' WHERE id = 'web-puzzle-2';

-- =====================================
-- AUTOMATION MODULE (5 LESSONS)
-- =====================================

INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, lesson_type, drag_drop_data, estimated_minutes) VALUES
('auto-dragdrop-1', 'File System Automation', 'Automate file operations and directory management', 'intermediate', 48, 1, 'section-automation', 'drag-drop', 48),
('auto-dragdrop-2', 'Web Scraping with Beautiful Soup', 'Extract data from websites programmatically', 'intermediate', 55, 2, 'section-automation', 'drag-drop', 55),
('auto-story-1', 'Email Automation System', 'Build automated email workflows and notifications', 'advanced', 70, 3, 'section-automation', 'story', 70),
('auto-puzzle-1', 'Task Scheduling', 'Create scheduled tasks and cron jobs', 'advanced', 60, 4, 'section-automation', 'puzzle', 60),
('auto-dragdrop-3', 'System Administration Scripts', 'Automate system maintenance and monitoring', 'advanced', 65, 5, 'section-automation', 'drag-drop', 65)
ON CONFLICT (id) DO NOTHING;

-- Update content for Automation lessons
UPDATE lessons SET drag_drop_data = '{
  "instructions": "Create a file automation script that organizes files by type and date. This is a common automation task that saves hours of manual work.",
  "code_blocks": [
    {
      "id": "import-os",
      "content": "import os",
      "type": "code",
      "indent": 0
    },
    {
      "id": "import-shutil",
      "content": "import shutil",
      "type": "code",
      "indent": 0
    },
    {
      "id": "import-datetime",
      "content": "from datetime import datetime",
      "type": "code",
      "indent": 0
    },
    {
      "id": "source-dir",
      "content": "source_directory = \"/path/to/downloads\"",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "target-dir",
      "content": "target_directory = \"/path/to/organized\"",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "scan-files",
      "content": "for filename in os.listdir(source_directory):",
      "type": "code",
      "indent": 0
    },
    {
      "id": "get-extension",
      "content": "file_extension = filename.split('.')[-1].lower()",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "create-folder",
      "content": "folder_path = os.path.join(target_directory, file_extension)",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "make-directory",
      "content": "os.makedirs(folder_path, exist_ok=True)",
      "type": "code",
      "indent": 4
    },
    {
      "id": "source-path",
      "content": "source_path = os.path.join(source_directory, filename)",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "target-path",
      "content": "target_path = os.path.join(folder_path, filename)",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "move-file",
      "content": "shutil.move(source_path, target_path)",
      "type": "code",
      "indent": 4
    }
  ],
  "correct_order": ["import-os", "import-shutil", "import-datetime", "source-dir", "target-dir", "scan-files", "get-extension", "create-folder", "make-directory", "source-path", "target-path", "move-file"],
  "hints": [
    "os.path.join creates platform-independent paths",
    "os.makedirs with exist_ok=True prevents errors",
    "shutil.move moves files between directories",
    "Always check file paths before operations to avoid errors"
  ],
  "difficulty": "intermediate"
}' WHERE id = 'auto-dragdrop-1';

UPDATE lessons SET drag_drop_data = '{
  "instructions": "Build a web scraper that extracts product information from an e-commerce site. Web scraping automates data collection from websites.",
  "code_blocks": [
    {
      "id": "import-requests",
      "content": "import requests",
      "type": "code",
      "indent": 0
    },
    {
      "id": "import-bs4",
      "content": "from bs4 import BeautifulSoup",
      "type": "code",
      "indent": 0
    },
    {
      "id": "import-time",
      "content": "import time",
      "type": "code",
      "indent": 0
    },
    {
      "id": "headers",
      "content": "headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "base-url",
      "content": "base_url = 'https://example-shop.com/products'",
      "type": "variable",
      "indent": 0
    },
    {
      "id": "get-page",
      "content": "response = requests.get(base_url, headers=headers)",
      "type": "code",
      "indent": 0
    },
    {
      "id": "check-status",
      "content": "if response.status_code == 200:",
      "type": "code",
      "indent": 0
    },
    {
      "id": "parse-html",
      "content": "soup = BeautifulSoup(response.content, 'html.parser')",
      "type": "code",
      "indent": 4
    },
    {
      "id": "find-products",
      "content": "products = soup.find_all('div', class_='product-item')",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "loop-products",
      "content": "for product in products:",
      "type": "code",
      "indent": 4
    },
    {
      "id": "extract-name",
      "content": "name = product.find('h2', class_='product-name').text.strip()",
      "type": "variable",
      "indent": 8
    },
    {
      "id": "extract-price",
      "content": "price = product.find('span', class_='price').text.strip()",
      "type": "variable",
      "indent": 8
    },
    {
      "id": "print-product",
      "content": "print(f'Product: {name}, Price: {price}')",
      "type": "code",
      "indent": 8
    },
    {
      "id": "rate-limit",
      "content": "time.sleep(1)  # Be respectful to the server",
      "type": "code",
      "indent": 4
    }
  ],
  "correct_order": ["import-requests", "import-bs4", "import-time", "headers", "base-url", "get-page", "check-status", "parse-html", "find-products", "loop-products", "extract-name", "extract-price", "print-product", "rate-limit"],
  "hints": [
    "Always include User-Agent headers to avoid being blocked",
    "Check response status codes before parsing",
    "Use time.sleep() to be respectful to website servers",
    "Respect robots.txt files and website terms of service"
  ],
  "difficulty": "intermediate"
}' WHERE id = 'auto-dragdrop-2';

UPDATE lessons SET story_data = '{
  "setting": "A busy marketing department where Alex automates the email workflow to save time and improve communication",
  "protagonist": {
    "name": "Alex",
    "avatar": "👨‍💻",
    "role": "Automation Specialist",
    "personality": "Efficiency-focused, loves eliminating repetitive tasks"
  },
  "chapters": [
    {
      "id": "chapter1",
      "title": "The Email Overload Problem",
      "content": "The marketing manager sighed, looking at the overflowing inbox. \"We send hundreds of emails every week—welcome emails, follow-ups, newsletters, reports. It\\'s taking hours of manual work.\"\n\nAlex saw immediately how Python could help. \"What if we could automate all of this?\" they suggested. \"We can create templates, schedule sends, track responses, and generate reports automatically.\"\n\n\"Really?\" the manager\\'s eyes lit up. \"That would save us so much time! We could focus on creating better content instead of just sending emails.\"\n\nAlex nodded. \"We can build a system that:\n- Sends personalized welcome emails to new subscribers\n- Follows up with customers who haven\\'t opened recent emails\n- Sends weekly newsletters with curated content\n- Generates reports on email performance\n- Handles unsubscribe requests automatically\"\n\nTime to build an email automation machine!",
      "character": {
        "name": "David Kim",
        "avatar": "📧",
        "role": "Marketing Manager",
        "personality": "Overwhelmed but optimistic, eager for efficiency solutions"
      },
      "background": "Busy marketing office with whiteboards showing campaign calendars and email metrics",
      "objectives": [
        "Build automated email sending with personalization",
        "Create email templates and scheduling system",
        "Implement response tracking and analytics"
      ],
      "challenge": {
        "description": "Create a complete email automation system that handles multiple types of campaigns",
        "starter_code": "# Email Automation System\n\nimport smtplib\nfrom email.mime.text import MIMEText\nfrom email.mime.multipart import MIMEMultipart\nimport pandas as pd\nfrom datetime import datetime, timedelta\n\nclass EmailAutomator:\n    def __init__(self, smtp_server, smtp_port, email, password):\n        self.smtp_server = smtp_server\n        self.smtp_port = smtp_port\n        self.email = email\n        self.password = password\n    \n    def send_welcome_email(self, recipient_name, recipient_email):\n        # Send personalized welcome email\n        pass\n    \n    def send_newsletter(self, subscriber_list, articles):\n        # Send newsletter to multiple subscribers\n        pass",
        "solution": "# Email Automation System\n\nimport smtplib\nfrom email.mime.text import MIMEText\nfrom email.mime.multipart import MIMEMultipart\nimport pandas as pd\nfrom datetime import datetime, timedelta\nimport json\n\nclass EmailAutomator:\n    def __init__(self, smtp_server, smtp_port, email, password):\n        self.smtp_server = smtp_server\n        self.smtp_port = smtp_port\n        self.email = email\n        self.password = password\n        self.sent_emails = []\n    \n    def create_connection(self):\n        \"\"\"Create SMTP connection\"\"\"\n        server = smtplib.SMTP(self.smtp_server, self.smtp_port)\n        server.starttls()\n        server.login(self.email, self.password)\n        return server\n    \n    def send_welcome_email(self, recipient_name, recipient_email):\n        \"\"\"Send personalized welcome email\"\"\"\n        subject = \"Welcome to Our Community!\"\n        \n        body = f\"\"\"\n        Dear {recipient_name},\n        \n        Welcome aboard! We're excited to have you join our community.\n        \n        Here's what you can expect:\n        • Weekly tips and insights\n        • Exclusive content for subscribers\n        • Early access to new features\n        \n        If you have any questions, just reply to this email.\n        \n        Best regards,\n        The Team\n        \"\"\"\n        \n        return self._send_email(recipient_email, subject, body)\n    \n    def send_newsletter(self, subscriber_list, articles):\n        \"\"\"Send newsletter to multiple subscribers\"\"\"\n        subject = f\"Weekly Newsletter - {datetime.now().strftime('%B %d, %Y')}\"\n        \n        # Create newsletter content\n        article_content = \"\\n\\n\".join([\n            f\"📰 {article['title']}\\n{article['summary']}\\nRead more: {article['link']}\"\n            for article in articles\n        ])\n        \n        body = f\"\"\"\n        Hi there!\n        \n        Here's this week's newsletter with the latest updates:\n        \n        {article_content}\n        \n        Enjoy reading!\n        \n        Best,\n        The Newsletter Team\n        \n        ---\n        To unsubscribe, please reply with \"UNSUBSCRIBE\" in the subject.\n        \"\"\"\n        \n        results = []\n        for subscriber in subscriber_list:\n            success = self._send_email(subscriber['email'], subject, body)\n            results.append({\n                'email': subscriber['email'],\n                'name': subscriber['name'],\n                'sent': success,\n                'timestamp': datetime.now()\n            })\n        \n        return results\n    \n    def _send_email(self, recipient_email, subject, body):\n        \"\"\"Internal method to send individual email\"\"\"\n        try:\n            msg = MIMEMultipart()\n            msg['From'] = self.email\n            msg['To'] = recipient_email\n            msg['Subject'] = subject\n            msg.attach(MIMEText(body, 'plain'))\n            \n            server = self.create_connection()\n            server.send_message(msg)\n            server.quit()\n            \n            self.sent_emails.append({\n                'to': recipient_email,\n                'subject': subject,\n                'sent_at': datetime.now()\n            })\n            \n            return True\n        except Exception as e:\n            print(f\"Failed to send email to {recipient_email}: {e}\")\n            return False\n\n# Initialize the email automator\nautomator = EmailAutomator(\n    smtp_server=\"smtp.gmail.com\",\n    smtp_port=587,\n    email=\"your-email@gmail.com\",\n    password=\"your-app-password\"\n)\n\nprint(\"📧 Email Automation System Ready!\")\nprint(\"✅ Welcome email templates configured\")\nprint(\"✅ Newsletter system operational\")\nprint(\"✅ Personalization engine active\")\nprint(\"✅ Tracking and logging enabled\")",
        "hints": [
          "Use app passwords for Gmail instead of regular passwords",
          "Always handle email sending errors gracefully",
          "Personalize emails with recipient names and preferences",
          "Track sent emails for analytics and reporting"
        ],
        "explanation": "Excellent! You\\'ve built a complete email automation system that can handle personalized communications at scale. This type of automation saves countless hours and ensures consistent communication."
      },
      "reward": {
        "xp": 35,
        "message": "David is amazed: \"This is incredible! We went from hours of manual work to automated, personalized emails. You\\'ve transformed our marketing workflow!\"",
        "item": "Email Automation Expert Badge"
      }
    }
  ]
}' WHERE id = 'auto-story-1';

UPDATE lessons SET game_data = '{
  "time_bonus": 240,
  "streak_multiplier": 24,
  "questions": [
    {
      "id": "scheduling-1",
      "question": "What module would you use for scheduling tasks in Python?",
      "options": ["schedule", "crontab", "time", "threading"],
      "correctAnswer": 0,
      "explanation": "The schedule module provides a simple way to schedule recurring tasks.",
      "difficulty": "medium",
      "points": 28,
      "timeLimit": 30
    }
  ]
}' WHERE id = 'auto-puzzle-1';

UPDATE lessons SET drag_drop_data = '{
  "instructions": "Create a system monitoring script that checks disk space, memory usage, and running processes. This is essential for system administration automation.",
  "code_blocks": [
    {
      "id": "import-psutil",
      "content": "import psutil",
      "type": "code",
      "indent": 0
    },
    {
      "id": "import-platform",
      "content": "import platform",
      "type": "code",
      "indent": 0
    },
    {
      "id": "import-datetime",
      "content": "from datetime import datetime",
      "type": "code",
      "indent": 0
    },
    {
      "id": "monitor-function",
      "content": "def system_health_check():",
      "type": "function",
      "indent": 0
    },
    {
      "id": "get-cpu",
      "content": "cpu_percent = psutil.cpu_percent(interval=1)",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "get-memory",
      "content": "memory = psutil.virtual_memory()",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "get-disk",
      "content": "disk = psutil.disk_usage('/')",
      "type": "variable",
      "indent": 4
    },
    {
      "id": "health-report",
      "content": "report = {",
      "type": "code",
      "indent": 4
    },
    {
      "id": "timestamp",
      "content": "'timestamp': datetime.now(),",
      "type": "variable",
      "indent": 8
    },
    {
      "id": "cpu-info",
      "content": "'cpu_usage': cpu_percent,",
      "type": "variable",
      "indent": 8
    },
    {
      "id": "memory-info",
      "content": "'memory_usage': memory.percent,",
      "type": "variable",
      "indent": 8
    },
    {
      "id": "disk-info",
      "content": "'disk_usage': (disk.used / disk.total) * 100",
      "type": "variable",
      "indent": 8
    },
    {
      "id": "close-dict",
      "content": "}",
      "type": "code",
      "indent": 4
    },
    {
      "id": "return-report",
      "content": "return report",
      "type": "code",
      "indent": 4
    }
  ],
  "correct_order": ["import-psutil", "import-platform", "import-datetime", "monitor-function", "get-cpu", "get-memory", "get-disk", "health-report", "timestamp", "cpu-info", "memory-info", "disk-info", "close-dict", "return-report"],
  "hints": [
    "psutil provides cross-platform system monitoring capabilities",
    "CPU usage needs an interval for accurate measurement",
    "Memory and disk usage are returned as special objects with attributes",
    "Calculate percentages for easier interpretation of metrics"
  ],
  "difficulty": "advanced"
}' WHERE id = 'auto-dragdrop-3';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_specialized_lessons ON lessons(section_id, lesson_type);
CREATE INDEX IF NOT EXISTS idx_specialized_sections ON sections(path);

-- Verify the data was inserted
SELECT
  s.title as section_title,
  COUNT(l.id) as lesson_count,
  STRING_AGG(DISTINCT l.lesson_type, ', ') as lesson_types
FROM lessons l
JOIN sections s ON l.section_id = s.id
WHERE s.id LIKE 'section-%'
  AND s.id IN ('section-data-science', 'section-web-development', 'section-automation')
GROUP BY s.title
ORDER BY s.order_index;

-- Summary of all new lessons
SELECT
  'Total Lessons Added' as metric,
  COUNT(*) as count
FROM lessons
WHERE section_id IN (
  'section-beginner-dragdrop', 'section-beginner-puzzles', 'section-beginner-stories',
  'section-intermediate-dragdrop', 'section-intermediate-puzzles', 'section-intermediate-stories',
  'section-advanced-dragdrop', 'section-advanced-puzzles', 'section-advanced-stories',
  'section-data-science', 'section-web-development', 'section-automation'
);