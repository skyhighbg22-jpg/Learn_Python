/*
  # PyLearn Practice Content - Project Templates

  ## Overview
  10+ comprehensive project templates covering various Python applications
  Each includes starter code, project structure, and completion guidelines

  ## Structure
  - Web Applications (3): Flask/Django projects with real-world features
  - Data Science (3): Analysis and machine learning projects
  - Automation (2): Practical scripts and tools
  - API Development (2): RESTful API projects

  ## Target Audience
  Intermediate to advanced learners ready to build portfolio projects
*/

-- =====================================
-- WEB APPLICATIONS (3)
-- =====================================

INSERT INTO project_templates (id, title, description, category, difficulty, estimated_hours, tech_stack, project_structure, starter_code, learning_objectives, completion_criteria) VALUES
('project-web-1', 'Task Management Web App', 'Build a full-stack task management application with user authentication and real-time updates', 'web-development', 'intermediate', 20,
'["Flask", "SQLAlchemy", "JavaScript", "HTML/CSS", "SQLite", "WebSockets"]',
'{
  "app.py": "Main Flask application",
  "models/": {
    "user.py": "User model",
    "task.py": "Task model",
    "project.py": "Project model"
  },
  "routes/": {
    "auth.py": "Authentication routes",
    "tasks.py": "Task management routes",
    "api.py": "API endpoints"
  },
  "templates/": {
    "base.html": "Base template",
    "dashboard.html": "Main dashboard",
    "tasks.html": "Task management interface"
  },
  "static/": {
    "css/": "Stylesheets",
    "js/": "JavaScript files",
    "img/": "Images"
  },
  "requirements.txt": "Python dependencies",
  "config.py": "Configuration settings",
  "README.md": "Project documentation"
}',
'# app.py - Main Flask application
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

app = Flask(__name__)
app.config[\'SECRET_KEY\'] = \'your-secret-key\'
app.config[\'SQLALCHEMY_DATABASE_URI\'] = \'sqlite:///task_manager.db\'

db = SQLAlchemy(app)
login_manager = LoginManager(app)

# Import routes
from routes import auth, tasks, api

@app.route(\'/\')
def index():
    return render_template(\'dashboard.html\')

if __name__ == \'__main__\':
    with app.app_context():
        db.create_all()
    app.run(debug=True)',
'["Build RESTful API endpoints", "Implement user authentication", "Create responsive frontend", "Add real-time updates", "Database design and relationships"]',
'["User can register and login", "Create, read, update, delete tasks", "Task categorization and filtering", "Real-time collaboration features", "Mobile-responsive design", "Basic security implemented"]'),

('project-web-2', 'Blog Platform with Comments', 'Create a feature-rich blogging platform with comments, tags, and admin panel', 'web-development', 'intermediate', 25,
'["Django", "PostgreSQL", "Bootstrap", "Django REST Framework", "Celery"]',
'{
  "blog_project/": {
    "settings.py": "Django settings",
    "urls.py": "URL configuration",
    "wsgi.py": "WSGI configuration"
  },
  "blog/": {
    "models.py": "Blog models (Post, Comment, Tag)",
    "views.py": "View functions",
    "forms.py": "Django forms",
    "admin.py": "Admin configuration",
    "urls.py": "App URLs",
    "serializers.py": "DRF serializers"
  },
  "users/": {
    "models.py": "User profiles",
    "views.py": "User management",
    "forms.py": "User forms"
  },
  "templates/blog/": "HTML templates",
  "static/blog/": "Static files",
  "requirements.txt": "Dependencies",
  "manage.py": "Django management script"
}',
'# blog/models.py
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=False)
    tags = models.ManyToManyField(\'Tag\', blank=True)

    class Meta:
        ordering = [\'-created_at\']

    def __str__(self):
        return self.title

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name=\'comments\')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    approved = models.BooleanField(default=True)

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name',
'["Django ORM and migrations", "Admin panel customization", "User permissions and roles", "SEO optimization", "Email notifications", "Comment moderation system"]',
'["Post creation and editing with rich text", "Comment system with moderation", "Tag-based categorization", "User profiles and author pages", "Search functionality", "RSS feed", "Admin interface for content management"]'),

('project-web-3', 'E-commerce Store Frontend', 'Build an e-commerce website with shopping cart, product catalog, and payment integration', 'web-development', 'advanced', 35,
'["React", "Node.js", "Express", "MongoDB", "Stripe API", "Redux"]',
'{
  "frontend/": {
    "src/": {
      "components/": "React components",
      "pages/": "Page components",
      "store/": "Redux store",
      "services/": "API services",
      "utils/": "Helper functions",
      "styles/": "CSS/styled-components"
    },
    "public/": "Static assets",
    "package.json": "Dependencies"
  },
  "backend/": {
    "models/": "MongoDB schemas",
    "routes/": "Express routes",
    "middleware/": "Custom middleware",
    "controllers/": "Route controllers",
    "config/": "Configuration files"
  },
  "api/": "REST API documentation",
  "docker-compose.yml": "Docker configuration"
}',
'# backend/models/product.js
const mongoose = require(\'mongoose\');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    alt: String
  }],
  inventory: {
    type: Number,
    required: true,
    min: 0
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model(\'Product\', productSchema);',
'["React hooks and state management", "Redux for global state", "Payment gateway integration", "Shopping cart logic", "Product search and filtering", "Order processing workflow"]',
'["Product catalog with pagination", "Shopping cart functionality", "User authentication and profiles", "Payment processing with Stripe", "Order history tracking", "Product search and filters", "Admin panel for inventory", "Responsive design"]');

-- =====================================
-- DATA SCIENCE PROJECTS (3)
-- =====================================

INSERT INTO project_templates (id, title, description, category, difficulty, estimated_hours, tech_stack, project_structure, starter_code, learning_objectives, completion_criteria) VALUES
('project-ds-1', 'Customer Churn Prediction', 'Build a machine learning model to predict customer churn and identify key factors', 'data-science', 'intermediate', 18,
'["Python", "Pandas", "Scikit-learn", "Matplotlib", "Seaborn", "Jupyter Notebook"]',
'{
  "notebooks/": {
    "01_exploratory_data_analysis.ipynb": "EDA and data visualization",
    "02_feature_engineering.ipynb": "Feature creation and selection",
    "03_model_training.ipynb": "Model development and evaluation",
    "04_deployment_demo.ipynb": "Model deployment example"
  },
  "data/": {
    "raw/": "Raw dataset",
    "processed/": "Cleaned and processed data",
    "external/": "Additional data sources"
  },
  "src/": {
    "data_processing.py": "Data cleaning functions",
    "feature_engineering.py": "Feature creation",
    "model_training.py": "Model training pipeline",
    "evaluation.py": "Model evaluation metrics"
  },
  "models/": "Trained model files",
  "reports/": "Analysis reports and visualizations",
  "requirements.txt": "Dependencies"
}',
'# src/model_training.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import joblib

class ChurnPredictor:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.feature_columns = []

    def prepare_data(self, df):
        """Preprocess data for modeling"""
        # Handle missing values
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())

        # Encode categorical variables
        categorical_cols = df.select_dtypes(include=[\'object\']).columns
        df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

        return df

    def train_models(self, X_train, y_train):
        """Train multiple models and compare performance"""
        models = {
            \'random_forest\': RandomForestClassifier(n_estimators=100, random_state=42),
            \'gradient_boost\': GradientBoostingClassifier(n_estimators=100, random_state=42),
            \'logistic_regression\': LogisticRegression(random_state=42)
        }

        results = {}
        for name, model in models.items():
            model.fit(X_train, y_train)
            self.models[name] = model

            # Cross-validation scores
            cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring=\'roc_auc\')
            results[name] = {
                \'cv_score\': cv_scores.mean(),
                \'cv_std\': cv_scores.std()
            }

        return results',
'["Exploratory data analysis", "Feature engineering techniques", "Model selection and evaluation", "Handling imbalanced datasets", "Interpreting feature importance", "Model deployment basics"]',
'["Comprehensive EDA with visualizations", "Cleaned and preprocessed dataset", "Multiple trained ML models with comparison", "Feature importance analysis", "Confusion matrix and classification metrics", "Predictive insights for business stakeholders", "Jupyter notebook documentation"]'),

('project-ds-2', 'Social Media Sentiment Analyzer', 'Create a system to analyze sentiment from social media posts with NLP techniques', 'data-science', 'intermediate', 22,
'["Python", "NLTK", "TextBlob", "Pandas", "Matplotlib", "WordCloud", "Streamlit"]',
'{
  "src/": {
    "data_collection.py": "Social media data scraping",
    "text_preprocessing.py": "Text cleaning and normalization",
    "sentiment_analysis.py": "Sentiment analysis models",
    "visualization.py": "Data visualization functions",
    "streamlit_app.py": "Web interface"
  },
  "data/": {
    "raw_tweets/": "Collected social media posts",
    "processed/": "Cleaned text data",
    "models/": "Trained sentiment models"
  },
  "notebooks/": {
    "data_exploration.ipynb": "Initial data analysis",
    "model_development.ipynb": "Sentiment model development"
  },
  "tests/": "Unit tests",
  "requirements.txt": "Dependencies"
}',
'# src/sentiment_analysis.py
import pandas as pd
import numpy as np
from textblob import TextBlob
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

class SentimentAnalyzer:
    def __init__(self):
        self.vectorizer = None
        self.model = None
        self.stop_words = set(stopwords.words(\'english\'))

    def preprocess_text(self, text):
        """Clean and preprocess text data"""
        # Convert to lowercase
        text = text.lower()

        # Remove URLs, mentions, and hashtags
        text = re.sub(r\'http\\S+|www\\S+|https\\S+\', \'\', text, flags=re.MULTILINE)
        text = re.sub(r\'@\\w+|#\\w+\', \'\', text)

        # Remove punctuation and numbers
        text = re.sub(r\'[^a-zA-Z\\s]\', \'\', text)

        # Tokenize and remove stopwords
        tokens = word_tokenize(text)
        tokens = [token for token in tokens if token not in self.stop_words and len(token) > 2]

        return \' \'.join(tokens)

    def analyze_sentiment_textblob(self, text):
        """Analyze sentiment using TextBlob"""
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity

        if polarity > 0.1:
            return \'positive\'
        elif polarity < -0.1:
            return \'negative\'
        else:
            return \'neutral\'

    def train_custom_model(self, texts, labels):
        """Train custom sentiment classifier"""
        # Preprocess texts
        processed_texts = [self.preprocess_text(text) for text in texts]

        # Create TF-IDF features
        self.vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
        X = self.vectorizer.fit_transform(processed_texts)

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, labels, test_size=0.2, random_state=42)

        # Train model
        self.model = LogisticRegression(random_state=42)
        self.model.fit(X_train, y_train)

        # Evaluate
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)

        return {
            \'accuracy\': accuracy,
            \'classification_report\': classification_report(y_test, y_pred)
        }',
'["Text preprocessing and cleaning", "Multiple sentiment analysis approaches", "TF-IDF vectorization", "Model evaluation and comparison", "Interactive web interface", "Data visualization"]',
'["Functional text preprocessing pipeline", "Working TextBlob sentiment analyzer", "Custom trained sentiment model", "Comparative analysis between approaches", "Streamlit web application", "Visualization of sentiment trends", "Documentation of methodology"]'),

('project-ds-3', 'COVID-19 Data Dashboard', 'Build an interactive dashboard to visualize and analyze COVID-19 pandemic data', 'data-science', 'beginner', 15,
'["Python", "Plotly Dash", "Pandas", "requests", "API integration", "Data visualization"]',
'{
  "app.py": "Main Dash application",
  "data/": {
    "raw/": "Raw COVID-19 datasets",
    "processed/": "Cleaned and processed data",
    "cache/": "Cached API responses"
  },
  "src/": {
    "data_fetcher.py": "API data fetching functions",
    "data_processor.py": "Data cleaning and transformation",
    "visualizations.py": "Chart creation functions",
    "utils.py": "Helper functions"
  },
  "assets/": {
    "css/": "Custom styles",
    "img/": "Images and icons"
  },
  "tests/": "Unit tests",
  "requirements.txt": "Dependencies",
  "README.md": "Project documentation"
}',
'# app.py - Dash application
import dash
from dash import dcc, html, Input, Output, callback
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
from src.data_fetcher import fetch_covid_data
from src.data_processor import process_covid_data
from src.visualizations import create_time_series, create_choropleth

# Initialize Dash app
app = dash.Dash(__name__)
app.title = "COVID-19 Data Dashboard"

# Load and process data
print("Loading COVID-19 data...")
raw_data = fetch_covid_data()
processed_data = process_covid_data(raw_data)

app.layout = html.Div([
    html.H1("COVID-19 Global Dashboard", style={\'textAlign\': \'center\'}),

    html.Div([
        html.Div([
            html.H3("Select Country/Region"),
            dcc.Dropdown(
                id=\'country-dropdown\',
                options=[{\'label\': country, \'value\': country}
                        for country in processed_data[\'country\'].unique()],
                value=\'United States\',
                multi=False
            )
        ], style={\'width\': \'30%\', \'display\': \'inline-block\'}),

        html.Div([
            html.H3("Select Metric"),
            dcc.Dropdown(
                id=\'metric-dropdown\',
                options=[
                    {\'label\': \'Confirmed Cases\', \'value\': \'confirmed\'},
                    {\'label\': \'Deaths\', \'value\': \'deaths\'},
                    {\'label\': \'Vaccinations\', \'value\': \'vaccinations\'}
                ],
                value=\'confirmed\',
                multi=False
            )
        ], style={\'width\': \'30%\', \'display\': \'inline-block\', \'marginLeft\': \'20px\'})
    ], style={\'padding\': \'20px\'})',
'["API integration and data fetching", "Data cleaning and processing", "Interactive dashboard development", "Map visualizations", "Time series analysis", "Real-time data updates"]',
'["Interactive dashboard with country selection", "Multiple visualization types (maps, charts)", "Time series analysis of pandemic trends", "Comparative analysis between countries", "Responsive design", "Data sources attribution", "User-friendly interface"]');

-- =====================================
-- AUTOMATION PROJECTS (2)
-- =====================================

INSERT INTO project_templates (id, title, description, category, difficulty, estimated_hours, tech_stack, project_structure, starter_code, learning_objectives, completion_criteria) VALUES
('project-auto-1', 'Automated File Organizer', 'Create an intelligent file organization system that sorts files by type, date, and content', 'automation', 'beginner', 12,
'["Python", "os", "shutil", "watchdog", "schedule", "configparser"]',
'{
  "src/": {
    "file_organizer.py": "Main organization logic",
    "file_scanner.py": "File system scanning",
    "rule_engine.py": "Organization rules",
    "scheduler.py": "Automated scheduling",
    "config_manager.py": "Configuration handling"
  },
  "config/": {
    "rules.ini": "Organization rules",
    "settings.conf": "Application settings"
  },
  "logs/": "Application logs",
  "tests/": "Unit tests",
  "requirements.txt": "Dependencies",
  "setup.py": "Installation script"
}',
'# src/file_organizer.py
import os
import shutil
from pathlib import Path
from datetime import datetime
import mimetypes
from src.rule_engine import RuleEngine
from src.config_manager import ConfigManager

class FileOrganizer:
    def __init__(self, config_path=\'config/settings.conf\'):
        self.config = ConfigManager(config_path)
        self.rule_engine = RuleEngine()
        self.organized_count = 0
        self.errors = []

    def organize_directory(self, source_path, dry_run=False):
        """Organize files in the given directory"""
        source_path = Path(source_path)

        if not source_path.exists():
            raise FileNotFoundError(f"Source path does not exist: {source_path}")

        print(f"Scanning directory: {source_path}")

        # Scan all files recursively
        for file_path in source_path.rglob("*"):
            if file_path.is_file():
                try:
                    self._organize_single_file(file_path, source_path, dry_run)
                except Exception as e:
                    self.errors.append(f"Error processing {file_path}: {str(e)}")

        print(f"Organization complete. Processed: {self.organized_count} files")
        if self.errors:
            print(f"Errors encountered: {len(self.errors)}")
            for error in self.errors:
                print(f"  - {error}")

    def _organize_single_file(self, file_path, base_path, dry_run=False):
        """Organize a single file based on rules"""
        # Get file information
        file_info = self._get_file_info(file_path)

        # Apply organization rules
        destination = self.rule_engine.get_destination(file_info)
        full_destination = base_path / destination

        # Create destination directory if needed
        if not dry_run:
            full_destination.mkdir(parents=True, exist_ok=True)

            # Move file
            destination_file = full_destination / file_path.name

            # Handle name conflicts
            counter = 1
            original_dest = destination_file
            while destination_file.exists():
                stem = original_dest.stem
                suffix = original_dest.suffix
                destination_file = full_destination / f"{stem}_{counter}{suffix}"
                counter += 1

            shutil.move(str(file_path), str(destination_file))

        self.organized_count += 1
        print(f"{\'[DRY RUN] Would move\' if dry_run else \'Moved\'}: {file_path.name} -> {destination}")

    def _get_file_info(self, file_path):
        """Extract information about the file"""
        stat = file_path.stat()
        mime_type, _ = mimetypes.guess_type(str(file_path))

        return {
            \'name\': file_path.name,
            \'path\': str(file_path),
            \'size\': stat.st_size,
            \'modified\': datetime.fromtimestamp(stat.st_mtime),
            \'extension\': file_path.suffix.lower(),
            \'mime_type\': mime_type,
            \'is_image\': mime_type and mime_type.startswith(\'image/\'),
            \'is_document\': mime_type and mime_type.startswith(\'text/\') or file_path.suffix in [\'.pdf\', \'.doc\', \'.docx\'],
            \'is_archive\': file_path.suffix in [\'.zip\', \'.rar\', \'.7z\', \'.tar\', \'.gz\']
        }',
'["File system operations", "Pattern matching and rules", "Error handling and logging", "Configuration management", "Scheduled task execution", "Cross-platform compatibility"]',
'["Rule-based file organization", "Configuration file support", "Duplicate file handling", "Dry run mode for safety", "Comprehensive error handling", "Activity logging", "Cross-platform compatibility", "Scheduled automation"]'),

('project-auto-2', 'Web Scraper for Price Monitoring', 'Build a price monitoring system that tracks product prices across multiple websites', 'automation', 'intermediate', 20,
'["Python", "BeautifulSoup", "requests", "selenium", "sqlite3", "email", "matplotlib"]',
'{
  "src/": {
    "scrapers/": {
      "base_scraper.py": "Abstract scraper class",
      "amazon_scraper.py": "Amazon price scraper",
      "ebay_scraper.py": "eBay price scraper"
    },
    "database.py": "Database operations",
    "notifier.py": "Price drop notifications",
    "scheduler.py": "Automated scraping schedule",
    "analyzer.py": "Price analysis and trends"
  },
  "data/": {
    "prices.db": "SQLite database",
    "scraped_data/": "Exported data"
  },
  "config/": {
    "products.json": "Product list and URLs",
    "settings.ini": "Application settings"
  },
  "reports/": "Price analysis reports",
  "requirements.txt": "Dependencies"
}',
'# src/scrapers/base_scraper.py
from abc import ABC, abstractmethod
import requests
from bs4 import BeautifulSoup
import time
import random
from urllib.parse import urljoin, urlparse

class BaseScraper(ABC):
    def __init__(self, delay_range=(1, 3)):
        self.delay_range = delay_range
        self.session = requests.Session()
        self.session.headers.update({
            \'User-Agent\': \'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36\'
        })

    @abstractmethod
    def extract_price(self, soup, url):
        """Extract price from BeautifulSoup object"""
        pass

    @abstractmethod
    def extract_title(self, soup, url):
        """Extract product title from BeautifulSoup object"""
        pass

    def scrape_product(self, url):
        """Scrape product information"""
        try:
            # Random delay to be respectful
            delay = random.uniform(*self.delay_range)
            time.sleep(delay)

            response = self.session.get(url, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, \'html.parser\')

            price = self.extract_price(soup, url)
            title = self.extract_title(soup, url)

            return {
                \'url\': url,
                \'title\': title,
                \'price\': price,
                \'timestamp\': time.time(),
                \'success\': True
            }

        except Exception as e:
            return {
                \'url\': url,
                \'title\': None,
                \'price\': None,
                \'timestamp\': time.time(),
                \'success\': False,
                \'error\': str(e)
            }

    def get_domain(self, url):
        """Extract domain from URL"""
        return urlparse(url).netloc

# src/scrapers/amazon_scraper.py
from .base_scraper import BaseScraper
import re

class AmazonScraper(BaseScraper):
    def extract_price(self, soup, url):
        """Extract price from Amazon product page"""
        price_selectors = [
            \'.a-price .a-offscreen\',
            \'.a-price-whole\',
            \'#price_inside_buybox\',
            \'.a-color-price\'
        ]

        for selector in price_selectors:
            price_element = soup.select_one(selector)
            if price_element:
                price_text = price_element.get_text().strip()
                # Extract numeric price
                price_match = re.search(r\'\\$?([\\d,]+\\.?\\d*)\', price_text.replace(\',\', \'\'))
                if price_match:
                    return float(price_match.group(1))

        return None

    def extract_title(self, soup, url):
        """Extract product title from Amazon"""
        title_selectors = [
            \'#productTitle\',
            \'.product-title\',
            \'h1 a\'
        ]

        for selector in title_selectors:
            title_element = soup.select_one(selector)
            if title_element:
                return title_element.get_text().strip()

        return None',
'["Web scraping techniques", "Handling different website structures", "Rate limiting and politeness policies", "Database operations", "Email notifications", "Price trend analysis"]',
'["Multi-website price scraping", "SQLite database for price history", "Email notifications for price drops", "Price trend analysis", "Respectful scraping with delays", "Error handling and retry logic", "Configuration-driven product lists", "Price comparison reports"]');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_templates_difficulty ON project_templates(difficulty);
CREATE INDEX IF NOT EXISTS idx_project_templates_category ON project_templates(category);

-- Verify data was inserted
SELECT
  category,
  COUNT(*) as project_count,
  STRING_AGG(DISTINCT difficulty, ', ') as difficulties
FROM project_templates
GROUP BY category
ORDER BY category;

SELECT
  'Total Project Templates Created' as metric,
  COUNT(*) as count
FROM project_templates;

SELECT
  'Average Estimated Hours' as metric,
  ROUND(AVG(estimated_hours), 1) as average_hours
FROM project_templates;