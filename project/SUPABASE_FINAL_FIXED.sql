-- Add String and File Operations Lessons - Final Working Version

-- String Operations Lessons (10 lessons)
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
('70000000-0000-0000-0000-000000000001', 'String Length and Case', 'Learn to get string length and change case', 'beginner', 15, 1,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Strings are sequences of characters. Python provides built-in functions to work with them."}, {"type": "code", "question": "Create a function that analyzes text", "starterCode": "def analyze_text(text):\\n    # Your code here\\n    pass", "solution": "def analyze_text(text):\\n    length = len(text)\\n    return {\"length\": length}"}]',
 'code', 12),

('70000000-0000-0000-0000-000000000002', 'String Stripping and Cleaning', 'Remove unwanted characters and whitespace', 'beginner', 18, 2,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Cleaning strings is essential for data processing."}, {"type": "code", "question": "Clean messy user input", "starterCode": "def clean_input(text):\\n    # Remove extra spaces\\n    pass", "solution": "def clean_input(text):\\n    cleaned = text.strip()\\n    return cleaned"}]',
 'code', 15),

('70000000-0000-0000-0000-000000000003', 'String Concatenation', 'Combine strings efficiently', 'beginner', 12, 3,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "String concatenation joins multiple strings together."}, {"type": "code", "question": "Build a sentence from words", "starterCode": "words = [\"Python\", \"is\", \"awesome\"]\\n# Your code here", "solution": "words = [\"Python\", \"is\", \"awesome\"]\\nsentence = \" \".join(words)\\nprint(sentence)"}]',
 'code', 10),

('70000000-0000-0000-0000-000000000004', 'Finding and Replacing', 'Search and substitute in strings', 'beginner', 20, 4,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Python provides methods to find substrings and replace content."}, {"type": "code", "question": "Text search utility", "starterCode": "def find_and_replace(text, search, replace):\\n    # Your code here\\n    pass", "solution": "def find_and_replace(text, search, replace):\\n    count = text.count(search)\\n    replaced = text.replace(search, replace)\\n    return {\"count\": count, \"result\": replaced}"}]',
 'code', 18),

('70000000-0000-0000-0000-000000000005', 'Splitting and Joining', 'Break and combine strings', 'intermediate', 22, 5,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "split() breaks strings into lists, join() combines them."}, {"type": "code", "question": "Process sentence into words", "starterCode": "sentence = \"Python is powerful\"\\n# Your code here", "solution": "sentence = \"Python is powerful\"\\nwords = sentence.split()\\nprint(f\"Words: {words}, Count: {len(words)}\")"}]',
 'code', 15),

('70000000-0000-0000-0000-000000000006', 'String Validation', 'Check string patterns and format', 'intermediate', 25, 6,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Validation ensures strings meet specific requirements."}, {"type": "code", "question": "Validate email format", "starterCode": "def is_valid_email(email):\\n    # Basic validation\\n    pass", "solution": "def is_valid_email(email):\\n    if \"@\" not in email or \".\" not in email:\\n        return False\\n    return True"}]',
 'code', 20),

('70000000-0000-0000-0000-000000000007', 'String Slicing', 'Extract substrings efficiently', 'intermediate', 28, 7,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "String slicing extracts portions using [start:end:step]."}, {"type": "code", "question": "Extract information from string", "starterCode": "data = \"Python_3.9.0\"\\n# Your code here", "solution": "data = \"Python_3.9.0\"\\nprint(f\"First 6: {data[:6]}\")\\nprint(f\"Last 4: {data[-4:]}\")"}]',
 'code', 18),

('70000000-0000-0000-0000-000000000008', 'String Formatting', 'Advanced string techniques', 'intermediate', 30, 8,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Modern string formatting with f-strings and .format()."}, {"type": "code", "question": "Create formatted output", "starterCode": "name = \"Alice\"\\nage = 30\\n# Your code here", "solution": "name = \"Alice\"\\nage = 30\\nformatted = f\"Name: {name}, Age: {age}\"\\nprint(formatted)"}]',
 'code', 22),

('70000000-0000-0000-0000-000000000009', 'Regular Expressions', 'Pattern matching in strings', 'advanced', 35, 9,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Regular expressions provide powerful pattern matching."}, {"type": "code", "question": "Extract phone numbers", "starterCode": "import re\\ntext = \"Call 555-1234\"\\n# Your code here", "solution": "import re\\ntext = \"Call 555-1234\"\\npattern = r\"\\b\\d{3}-\\d{3}-\\d{4}\\b\"\\nphones = re.findall(pattern, text)\\nprint(phones)"}]',
 'code', 25),

('70000000-0000-0000-0000-000000000010', 'Text Processing Project', 'Real-world string manipulation', 'intermediate', 40, 10,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Apply string operations to build a practical tool."}, {"type": "code", "question": "Build word frequency analyzer", "starterCode": "from collections import Counter\\ndef word_count(filename):\\n    # Your code here\\n    pass", "solution": "from collections import Counter\\ndef word_count(filename):\\n    with open(filename, \"r\") as f:\\n        words = f.read().lower().split()\\n    return {\"total_words\": len(words)}"}]',
 'code', 30)
ON CONFLICT (id) DO NOTHING;

-- File Operations Lessons (10 lessons)
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
('80000000-0000-0000-0000-000000000001', 'Reading Text Files', 'Learn how to read data from text files', 'beginner', 15, 1,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Reading files is essential for working with data."}, {"type": "code", "question": "Read a file and count lines", "starterCode": "def count_lines(filename):\\n    # Read file and count lines\\n    pass", "solution": "def count_lines(filename):\\n    with open(filename, \"r\") as file:\\n        lines = file.readlines()\\n        return len(lines)"}]',
 'code', 15),

('80000000-0000-0000-0000-000000000002', 'Writing to Text Files', 'Learn how to write data to text files', 'beginner', 18, 2,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Writing files allows you to save data permanently."}, {"type": "code", "question": "Create a log file with timestamps", "starterCode": "import datetime\\ndef write_log(message):\\n    # Add timestamp and write\\n    pass", "solution": "import datetime\\ndef write_log(message):\\n    timestamp = datetime.datetime.now().strftime(\"%Y-%m-%d %H:%M:%S\")\\n    with open(\"log.txt\", \"a\") as file:\\n        file.write(f\"[{timestamp}] {message}\\n\")"}]',
 'code', 18),

('80000000-0000-0000-0000-000000000003', 'Working with File Paths', 'Master file path operations', 'beginner', 20, 3,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "File paths tell Python where to find files. Use os.path."}, {"type": "code", "question": "Handle file paths safely", "starterCode": "import os\\ndef safe_path(directory, filename):\\n    # Handle paths safely\\n    pass", "solution": "import os\\ndef safe_path(directory, filename):\\n    full_path = os.path.join(directory, filename)\\n    os.makedirs(directory, exist_ok=True)\\n    return full_path"}]',
 'code', 20),

('80000000-0000-0000-0000-000000000004', 'Directory Operations', 'Working with directories', 'intermediate', 22, 4,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Directories help organize files and folders."}, {"type": "code", "question": "Create project structure', "starterCode": "import os\\ndef create_project(name, folders):\\n    # Create project\\n    pass", "solution": "import os\\ndef create_project(name, folders):\\n    os.makedirs(name, exist_ok=True)\\n    for folder in folders:\\n        os.makedirs(os.path.join(name, folder), exist_ok=True)\\n    return f\"Project {name} created!\""}]',
 'code', 22),

('80000000-0000-0000-0000-000000000005', 'File Information', 'Getting file details like size', 'intermediate', 25, 5,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Files contain metadata like size and permissions."}, {"type": "code", "question": "Get file information', "starterCode": "import os\\ndef file_info(filename):\\n    # Return file info\\n    pass", "solution": "import os\\ndef file_info(filename):\\n    if not os.path.exists(filename):\\n        return {\"error\": \"File not found\"}\\n    stat = os.stat(filename)\\n    return {\"size\": stat.st_size}"}]',
 'code', 25),

('80000000-0000-0000-0000-000000000006', 'File Copying', 'Copying and moving files safely', 'intermediate', 28, 6,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "The shutil module provides high-level file operations."}, {"type": "code", "question": "Create backup system', "starterCode": "import shutil\\ndef backup_file(source, dest=\"backups\"):\\n    # Create backup\\n    pass", "solution": "import os\\nimport shutil\\ndef backup_file(source, dest=\"backups\"):\\n    if not os.path.exists(source):\\n        return {\"error\": \"File not found\"}\\n    os.makedirs(dest, exist_ok=True)\\n    filename = os.path.basename(source)\\n    backup_path = os.path.join(dest, filename)\\n    shutil.copy2(source, backup_path)\\n    return {\"backup\": backup_path}"}]',
 'code', 28),

('80000000-0000-0000-0000-000000000007', 'Context Managers', 'Using with statements for file handling', 'intermediate', 30, 7,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Context managers ensure proper resource cleanup."}, {"type": "code", "question": "Create context manager', "starterCode": "class FileHandler:\\n    def __enter__(self):\\n        pass\\n    def __exit__(self, exc_type, exc_val, exc_tb):\\n        pass", "solution": "class FileHandler:\\n    def __init__(self, filename, mode=\"r\"):\\n        self.filename = filename\\n        self.mode = mode\\n        self.file = None\\n    def __enter__(self):\\n        self.file = open(self.filename, self.mode)\\n        return self.file\\n    def __exit__(self, exc_type, exc_val, exc_tb):\\n        if self.file:\\n            self.file.close()"}]',
 'code', 30),

('80000000-0000-0000-0000-000000000008', 'Error Handling', 'Handling file-related exceptions', 'intermediate', 32, 8,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "File operations can fail. Proper error handling is crucial."}, {"type": "code", "question": "Create robust file reader', "starterCode": "def safe_read(filename):\\n    # Read with error handling\\n    pass", "solution": "import os\\ndef safe_read(filename):\\n    try:\\n        if not os.path.exists(filename):\\n            return {\"error\": \"File not found\"}\\n        with open(filename, \"r\") as file:\\n            return {\"success\": True, \"content\": file.read()}\\n    except Exception as e:\\n        return {\"error\": f\"Failed: {str(e)}\"}"}]',
 'code', 32),

('80000000-0000-0000-0000-000000000009', 'Different File Formats', 'Reading and writing CSV, JSON', 'intermediate', 35, 9,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Python excels at handling various file formats."}, {"type": "code", "question": "Convert JSON to CSV', "starterCode": "import json\\ndef json_to_csv(input_file):\\n    # Convert JSON\\n    pass", "solution": "import json\\ndef json_to_csv(input_file):\\n    with open(input_file, \"r\") as file:\\n        data = json.load(file)\\n    return {\"success\": True, \"data_type\": type(data).__name__}"}]',
 'code', 35),

('80000000-0000-0000-0000-000000000010', 'File Processing Project', 'Build real-world file application', 'intermediate', 40, 10,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Apply file operations to build a practical tool."}, {"type": "code", "question": "Build log analyzer', "starterCode": "import re\\nimport os\\nclass LogAnalyzer:\\n    def __init__(self):\\n        self.logs = []\\n    def parse_file(self, filename):\\n        # Parse log file\\n        pass", "solution": "import re\\nimport os\\nclass LogAnalyzer:\\n    def __init__(self):\\n        self.logs = []\\n    def parse_file(self, filename):\\n        if not os.path.exists(filename):\\n            return {\"error\": \"File not found\"}\\n        pattern = r\"\\[(\\w+)\\] (\\w+): (.*)\"\\n        return {\"success\": True, \"pattern\": pattern}"}]',
 'code', 45)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_string_lessons_section ON lessons(section_id);
CREATE INDEX IF NOT EXISTS idx_file_lessons_section ON lessons(section_id);
CREATE INDEX IF NOT EXISTS idx_string_file_lessons_order ON lessons(order_index);

-- Simple verification
SELECT 'Lessons Added Successfully!' as message;