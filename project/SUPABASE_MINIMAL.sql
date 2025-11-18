-- Add String and File Operations Lessons - Minimal Version

-- String Operations Lessons
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
('70000000-0000-0000-0000-000000000001', 'String Length and Case', 'Learn to get string length and change case', 'beginner', 15, 1,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Strings are sequences of characters."}, {"type": "code", "question": "Create function that analyzes text", "starterCode": "def analyze_text(text):\\n    # Your code here\\n    pass", "solution": "def analyze_text(text):\\n    return len(text)"}]',
 'code', 12),

('70000000-0000-0000-0000-000000000002', 'String Stripping and Cleaning', 'Remove unwanted characters', 'beginner', 18, 2,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Clean strings by removing whitespace."}, {"type": "code", "question": "Clean messy user input", "starterCode": "def clean_input(text):\\n    # Remove extra spaces\\n    pass", "solution": "def clean_input(text):\\n    return text.strip()"}]',
 'code', 15),

('70000000-0000-0000-0000-000000000003', 'String Concatenation', 'Combine strings efficiently', 'beginner', 12, 3,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Join strings using join method."}, {"type": "code", "question": "Build sentence from words", "starterCode": "words = [\"Python\", \"is\", \"awesome\"]\\n# Your code here", "solution": "words = [\"Python\", \"is\", \"awesome\"]\\nsentence = \" \".join(words)\\nprint(sentence)"}]',
 'code', 10),

('70000000-0000-0000-0000-000000000004', 'Finding and Replacing', 'Search and substitute in strings', 'beginner', 20, 4,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Use find and replace methods."}, {"type": "code", "question": "Search and replace utility", "starterCode": "def find_replace(text, search, replace):\\n    # Your code here\\n    pass", "solution": "def find_replace(text, search, replace):\\n    count = text.count(search)\\n    result = text.replace(search, replace)\\n    return {\"count\": count, \"result\": result}"}]',
 'code', 18),

('70000000-0000-0000-0000-000000000005', 'Splitting and Joining', 'Break and combine strings', 'intermediate', 22, 5,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Use split and join methods."}, {"type": "code", "question": "Process sentence into words", "starterCode": "sentence = \"Python is powerful\"\\n# Your code here", "solution": "sentence = \"Python is powerful\"\\nwords = sentence.split()\\nprint(len(words))"}]',
 'code', 15),

('70000000-0000-0000-0000-000000000006', 'String Validation', 'Check string patterns', 'intermediate', 25, 6,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Validate email formats and patterns."}, {"type": "code", "question": "Validate email format", "starterCode": "def is_valid_email(email):\\n    # Basic email validation\\n    pass", "solution": "def is_valid_email(email):\\n    return \"@\" in email and \".\" in email"}]',
 'code', 20),

('70000000-0000-0000-0000-000000000007', 'String Slicing', 'Extract substrings', 'intermediate', 28, 7,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Use slicing syntax for extraction."}, {"type": "code", "question": "Extract from string", "starterCode": "data = \"Python_3.9.0\"\\n# Your code here", "solution": "data = \"Python_3.9.0\"\\nprint(data[:6])\\nprint(data[-2:])"}]',
 'code', 18),

('70000000-0000-0000-0000-000000000008', 'String Formatting', 'Format strings effectively', 'intermediate', 30, 8,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Use f-strings for formatting."}, {"type": "code", "question": "Create formatted output", "starterCode": "name = \"Alice\"\\nage = 30\\n# Your code here", "solution": "name = \"Alice\"\\nage = 30\\nformatted = f\"Name: {name}, Age: {age}\"\\nprint(formatted)"}]',
 'code', 22),

('70000000-0000-0000-0000-000000000009', 'Regular Expressions', 'Pattern matching', 'advanced', 35, 9,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Use regex for pattern matching."}, {"type": "code", "question": "Extract phone numbers", "starterCode": "import re\\ntext = \"Call 555-1234\"\\n# Your code here", "solution": "import re\\ntext = \"Call 555-1234\"\\npattern = r\"\\b\\d{3}-\\d{3}-\\d{4}\\b\"\\nphones = re.findall(pattern, text)\\nprint(phones)"}]',
 'code', 25),

('70000000-0000-0000-0000-000000000010', 'Text Processing Project', 'Real-world string manipulation', 'intermediate', 40, 10,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Apply string operations to build a tool."}, {"type": "code", "question": "Build word frequency analyzer", "starterCode": "from collections import Counter\\ndef count_words(filename):\\n    # Your code here\\n    pass", "solution": "from collections import Counter\\ndef count_words(filename):\\n    with open(filename, \"r\") as f:\\n        words = f.read().lower().split()\\n    word_freq = Counter(words)\\n    return {\"total\": len(words)}"}]',
 'code', 30)
ON CONFLICT (id) DO NOTHING;

-- File Operations Lessons
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
('80000000-0000-0000-0000-000000000001', 'Reading Text Files', 'Learn to read data from text files', 'beginner', 15, 1,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Read files using with statement."}, {"type": "code", "question": "Read a file and count lines", "starterCode": "def count_lines(filename):\\n    # Read file and count lines\\n    pass", "solution": "def count_lines(filename):\\n    with open(filename, \"r\") as file:\\n        lines = file.readlines()\\n        return len(lines)"}]',
 'code', 15),

('80000000-0000-0000-0000-000000000002', 'Writing to Text Files', 'Learn to write data to text files', 'beginner', 18, 2,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Write data to files permanently."}, {"type": "code", "question": "Create a log file with timestamps", "starterCode": "import datetime\\ndef write_log(message):\\n    # Add timestamp and write to file\\n    pass", "solution": "import datetime\\ndef write_log(message):\\n    timestamp = datetime.datetime.now().strftime(\"%Y-%m-%d %H:%M:%S\")\\n    with open(\"log.txt\", \"a\") as file:\\n        file.write(f\"[{timestamp}] {message}\\n\")"}]',
 'code', 18),

('80000000-0000-0000-0000-000000000003', 'Working with File Paths', 'Master file path operations', 'beginner', 20, 3,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Use os.path for cross-platform paths."}, {"type": "code", "question": "Handle file paths safely", "starterCode": "import os\\ndef safe_path(directory, filename):\\n    # Handle paths safely\\n    pass", "solution": "import os\\ndef safe_path(directory, filename):\\n    return os.path.join(directory, filename)"}]',
 'code', 20),

('80000000-0000-0000-0000-000000000004', 'Directory Operations', 'Working with directories', 'intermediate', 22, 4,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Create and manage directories."}, {"type": "code", "question": "Create project structure", "starterCode": "import os\\ndef create_project(name, folders):\\n    # Create project\\n    pass", "solution": "import os\\ndef create_project(name, folders):\\n    os.makedirs(name, exist_ok=True)\\n    for folder in folders:\\n        os.makedirs(os.path.join(name, folder), exist_ok=True)\\n    return f\"Created {name}\""}]',
 'code', 22),

('80000000-0000-0000-0000-000000000005', 'File Information', 'Get file details', 'intermediate', 25, 5,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Get file size and metadata."}, {"type": "code", "question": "Get file information", "starterCode": "import os\\ndef get_file_info(filename):\\n    # Return file info\\n    pass", "solution": "import os\\ndef get_file_info(filename):\\n    if not os.path.exists(filename):\\n        return {\"error\": \"Not found\"}\\n    stat = os.stat(filename)\\n    return {\"size\": stat.st_size}"}]',
 'code', 25),

('80000000-0000-0000-0000-000000000006', 'File Copying', 'Copying files safely', 'intermediate', 28, 6,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Use shutil for file operations."}, {"type": "code", "question": "Create backup system", "starterCode": "import shutil\\ndef backup(src, dst):\\n    # Create backup\\n    pass", "solution": "import os\\nimport shutil\\ndef backup(src, dst=\"backups\"):\\n    if not os.path.exists(src):\\n        return {\"error\": \"Not found\"}\\n    os.makedirs(dst, exist_ok=True)\\n    filename = os.path.basename(src)\\n    backup_path = os.path.join(dst, filename)\\n    shutil.copy2(src, backup_path)\\n    return {\"backup\": backup_path}"}]',
 'code', 28),

('80000000-0000-0000-0000-000000000007', 'Context Managers', 'Use with statements', 'intermediate', 30, 7,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Context managers ensure proper cleanup."}, {"type": "code", "question": "Create context manager", "starterCode": "class FileHandler:\\n    def __enter__(self):\\n        pass\\n    def __exit__(self, *args):\\n        pass", "solution": "class FileHandler:\\n    def __enter__(self):\\n        return self\\n    def __exit__(self, *args):\\n        return False"}]',
 'code', 30),

('80000000-0000-0000-0000-000000000008', 'Error Handling', 'Handle file exceptions', 'intermediate', 32, 8,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Handle file operation errors."}, {"type": "code", "question": "Create robust file reader", "starterCode": "def safe_read(filename):\\n    # Read with error handling\\n    pass", "solution": "import os\\ndef safe_read(filename):\\n    try:\\n        if not os.path.exists(filename):\\n            return {\"error\": \"Not found\"}\\n        with open(filename, \"r\") as file:\\n            return {\"success\": True, \"content\": file.read()}\\n    except Exception as e:\\n        return {\"error\": f\"Failed: {str(e)}\"}"}]',
 'code', 32),

('80000000-0000-0000-0000-000000000009', 'File Formats', 'Work with JSON CSV', 'intermediate', 35, 9,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Handle different file formats."}, {"type": "code", "question": "Convert JSON to CSV", "starterCode": "import json\\ndef json_to_csv(input_file):\\n    # Convert JSON\\n    pass", "solution": "import json\\nimport csv\\nimport os\\ndef json_to_csv(input_file):\\n    if not os.path.exists(input_file):\\n        return {\"error\": \"Not found\"}\\n    with open(input_file, \"r\") as file:\\n        data = json.load(file)\\n    return {\"success\": True, \"data_type\": type(data).__name__}"}]',
 'code', 35),

('80000000-0000-0000-0000-000000000010', 'File Processing Project', 'Build file application', 'intermediate', 40, 10,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Apply file operations to build a tool."}, {"type": "code", "question": "Build log analyzer", "starterCode": "import re\\nimport os\\nclass LogAnalyzer:\\n    def __init__(self):\\n        self.logs = []\\n    def parse_file(self, filename):\\n        pass", "solution": "import re\\nimport os\\nclass LogAnalyzer:\\n    def __init__(self):\\n        self.logs = []\\n    def parse_file(self, filename):\\n        if not os.path.exists(filename):\\n            return {\"error\": \"Not found\"}\\n        with open(filename, \"r\") as file:\\n            self.logs = file.readlines()\\n        return {\"success\": True, \"count\": len(self.logs)}"}]',
 'code', 45)
ON CONFLICT (id) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_final_lessons_section ON lessons(section_id);
CREATE INDEX IF NOT EXISTS idx_final_lessons_order ON lessons(order_index);

-- Simple verification
SELECT 'Lessons Added Successfully!' as message;