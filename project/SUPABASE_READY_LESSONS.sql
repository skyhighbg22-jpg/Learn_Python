-- Add String and File Operations Lessons - Supabase Ready Version

-- String Operations Lessons (10 lessons)
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
('70000000-0000-0000-0000-000000000001', 'String Length and Case', 'Learn to get string length and change case', 'beginner', 15, 1,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Strings are sequences of characters. Python provides built-in functions to work with them."}, {"type": "text", "content": "len() returns the number of characters in a string."}, {"type": "code", "question": "Create a function that analyzes text", "starterCode": "def analyze_text(text):\\n    # Your code here\\n    pass", "solution": "def analyze_text(text):\\n    length = len(text)\\n    upper_text = text.upper()\\n    lower_text = text.lower()\\n    return {\\"original\\": text, \\"length\\": length, \\"upper\\": upper_text, \\"lower\\": lower_text}"}]',
 'coding', 12),

('70000000-0000-0000-0000-000000000002', 'String Stripping and Cleaning', 'Remove unwanted characters and whitespace', 'beginner', 18, 2,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Cleaning strings is essential for data processing and user input handling."}, {"type": "code", "question": "Clean messy user input", "starterCode": "def clean_input(text):\\n    # Remove extra spaces\\n    pass", "solution": "def clean_input(text):\\n    cleaned = text.strip()\\n    cleaned = \\" \\".join(cleaned.split())\\n    return cleaned"}]',
 'coding', 15),

('70000000-0000-0000-0000-000000000003', 'String Concatenation', 'Combine strings efficiently', 'beginner', 12, 3,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "String concatenation joins multiple strings together. join() is more efficient for multiple strings."}, {"type": "code", "question": "Build a sentence from words", "starterCode": "words = [\\"Python\\", \\"is\\", \\"awesome\\"]\\n# Your code here", "solution": "words = [\\"Python\\", \\"is\\", \\"awesome\\"]\\nsentence = \\" \\".join(words)\\nprint(sentence)"}]',
 'coding', 10),

('70000000-0000-0000-0000-000000000004', 'Finding and Replacing', 'Search and substitute in strings', 'beginner', 20, 4,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Python provides methods to find substrings and replace content."}, {"type": "code", "question": "Text search and replace utility", "starterCode": "def text_processor(text, search, replace_with):\\n    # Your code here\\n    pass", "solution": "def text_processor(text, search, replace_with):\\n    count = text.count(search)\\n    replaced_text = text.replace(search, replace_with)\\n    return {\\"original\\": text, \\"count\\": count, \\"replaced\\": replaced_text}"}]',
 'coding', 18),

('70000000-0000-0000-0000-000000000005', 'Splitting and Joining', 'Break and combine strings', 'intermediate', 22, 5,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "split() breaks strings into lists based on a delimiter. join() combines list elements into a string."}, {"type": "code", "question": "Process a sentence into words", "starterCode": "sentence = \\"Python is a powerful language\\"\\n# Your code here", "solution": "sentence = \\"Python is a powerful language\\"\\nwords = sentence.split()\\nprint(f\\"Words: {words}\\")\\nprint(f\\"Count: {len(words)}\\")"}]',
 'coding', 15),

('70000000-0000-0000-0000-000000000006', 'String Validation', 'Check string patterns and format', 'intermediate', 25, 6,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Validation ensures strings meet specific requirements. Use startswith(), endswith(), isdigit(), isalpha()."}, {"type": "code", "question": "Validate email format", "starterCode": "def is_valid_email(email):\\n    # Basic email validation\\n    pass", "solution": "def is_valid_email(email):\\n    if \\"@\\" not in email or \\".\\" not in email:\\n        return False\\n    parts = email.split(\\"@\\")\\n    if len(parts) != 2:\\n        return False\\n    return True"}]',
 'coding', 20),

('70000000-0000-0000-0000-000000000007', 'String Slicing', 'Extract substrings efficiently', 'intermediate', 28, 7,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "String slicing extracts portions using [start:end:step] syntax."}, {"type": "code", "question": "Extract information from string", "starterCode": "data = \\"Python_3.9.0_Stable\\"\\n# Your code here", "solution": "data = \\"Python_3.9.0_Stable\\"\\nprint(f\\"First 6: {data[:6]}\\")\\nprint(f\\"Last 7: {data[-7:]}\\")\\nprint(f\\"Reverse: {data[::-1]}\\")"}]',
 'coding', 18),

('70000000-0000-0000-0000-000000000008', 'String Formatting', 'Advanced string techniques', 'intermediate', 30, 8,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Modern string formatting with f-strings and .format() method."}, {"type": "code", "question": "Create formatted output", "starterCode": "name = \\"Alice\\"\\nage = 30\\n# Your code here", "solution": "name = \\"Alice\\"\\nage = 30\\nformatted = f\\"Name: {name}, Age: {age}\\"\\nprint(formatted)"}]',
 'coding', 22),

('70000000-0000-0000-0000-000000000009', 'Regular Expressions', 'Pattern matching in strings', 'advanced', 35, 9,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Regular expressions provide powerful pattern matching capabilities. Import re module."}, {"type": "code", "question": "Extract phone numbers", "starterCode": "import re\\ntext = \\"Contact us at 555-1234\\"\\n# Your code here", "solution": "import re\\ntext = \\"Contact us at 555-1234\\"\\npattern = r\\"\\\\b\\\\d{3}-\\\\d{3}-\\\\d{4}\\\\b\\"\\nphones = re.findall(pattern, text)\\nprint(f\\"Phones: {phones}\\")"}]',
 'coding', 25),

('70000000-0000-0000-0000-000000000010', 'Text Processing Project', 'Real-world string manipulation', 'intermediate', 40, 10,
 (SELECT id FROM sections WHERE path = 'string-operations'),
 '[{"type": "text", "content": "Apply string operations to build a practical text processing tool."}, {"type": "code", "question": "Build word frequency analyzer", "starterCode": "from collections import Counter\\ndef analyze_text_file(filename):\\n    # Your code here\\n    pass", "solution": "from collections import Counter\\ndef analyze_text_file(filename):\\n    with open(filename, \\"r\\") as f:\\n        words = f.read().lower().split()\\n    word_freq = Counter(words)\\n    return {\\"total_words\\": len(words), \\"most_common\\": word_freq.most_common(5)}"}]',
 'project', 30)
ON CONFLICT (id) DO NOTHING;

-- File Operations Lessons (10 lessons)
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
('80000000-0000-0000-0000-000000000001', 'Reading Text Files', 'Learn how to read data from text files', 'beginner', 15, 1,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Reading files is essential for working with data. Use with statement for automatic file closing."}, {"type": "code", "question": "Read a file and count lines", "starterCode": "def count_lines(filename):\\n    # Read file and count lines\\n    pass", "solution": "def count_lines(filename):\\n    with open(filename, \\"r\\") as file:\\n        lines = file.readlines()\\n        return len(lines)"}]',
 'coding', 15),

('80000000-0000-0000-0000-000000000002', 'Writing to Text Files', 'Learn how to write data to text files', 'beginner', 18, 2,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Writing files allows you to save data permanently. File modes: w (write), a (append), x (exclusive)."}, {"type": "code", "question": "Create a log file with timestamps", "starterCode": "import datetime\\ndef write_log(message):\\n    # Add timestamp and write to file\\n    pass", "solution": "import datetime\\ndef write_log(message):\\n    timestamp = datetime.datetime.now().strftime(\\"%Y-%m-%d %H:%M:%S\\")\\n    log_entry = f\\"[{timestamp}] {message}\\\\n\\"\\n    with open(\\"log.txt\\", \\"a\\") as file:\\n        file.write(log_entry)"}]',
 'coding', 18),

('80000000-0000-0000-0000-000000000003', 'Working with File Paths', 'Master file path operations and directory navigation', 'beginner', 20, 3,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "File paths tell Python where to find files. Use os.path for cross-platform compatibility."}, {"type": "code", "question": "Create function to handle file paths safely", "starterCode": "import os\\ndef safe_file_operation(directory, filename, content):\\n    # Handle paths safely\\n    pass", "solution": "import os\\ndef safe_file_operation(directory, filename, content):\\n    full_path = os.path.join(directory, filename)\\n    os.makedirs(directory, exist_ok=True)\\n    with open(full_path, \\"w\\") as file:\\n        file.write(content)\\n    return full_path"}]',
 'coding', 20),

('80000000-0000-0000-0000-000000000004', 'Directory Operations', 'Working with directories and folder structures', 'intermediate', 22, 4,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Directories help organize files. Python provides tools for directory management."}, {"type": "code", "question": "Create project structure generator", "starterCode": "import os\\ndef create_project_structure(project_name, folders):\\n    # Create project\\n    pass", "solution": "import os\\ndef create_project_structure(project_name, folders):\\n    os.makedirs(project_name, exist_ok=True)\\n    for folder in folders:\\n        folder_path = os.path.join(project_name, folder)\\n        os.makedirs(folder_path, exist_ok=True)\\n    return f\\"Project {project_name} created!\\""}]',
 'coding', 22),

('80000000-0000-0000-0000-000000000005', 'File Information and Metadata', 'Getting file details like size, modification time', 'intermediate', 25, 5,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Files contain metadata like size, creation time, and permissions. Use os.stat() and os.path methods."}, {"type": "code", "question": "Create file information analyzer", "starterCode": "import os\\ndef get_file_info(filename):\\n    # Return file info\\n    pass", "solution": "import os\\ndef get_file_info(filename):\\n    if not os.path.exists(filename):\\n        return {\\"error\\": f\\"File {filename} not found\\"}\\n    stat_info = os.stat(filename)\\n    return {\\"size\\": stat_info.st_size, \\"is_file\\": os.path.isfile(filename)}"}]',
 'coding', 25),

('80000000-0000-0000-0000-000000000006', 'File Copying and Moving', 'Copying, moving, and renaming files safely', 'intermediate', 28, 6,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "The shutil module provides high-level file operations. Use shutil.copy2() to preserve metadata."}, {"type": "code", "question": "Create safe file backup system", "starterCode": "import shutil\\ndef backup_file(source_path, backup_dir):\\n    # Create backup\\n    pass", "solution": "import os\\nimport shutil\\ndef backup_file(source_path, backup_dir=\\"backups\\"):\\n    if not os.path.exists(source_path):\\n        return {\\"error\\": \\"File not found\\"}\\n    os.makedirs(backup_dir, exist_ok=True)\\n    filename = os.path.basename(source_path)\\n    backup_path = os.path.join(backup_dir, filename)\\n    shutil.copy2(source_path, backup_path)\\n    return {\\"backup\\": backup_path}"}]',
 'coding', 28),

('80000000-0000-0000-0000-000000000007', 'Context Managers for File Handling', 'Using with statements for robust file operations', 'intermediate', 30, 7,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Context managers (with statements) ensure proper resource cleanup and exception safety."}, {"type": "code", "question": "Create custom context manager", "starterCode": "class FileProcessor:\\n    def __enter__(self):\\n        pass\\n    def __exit__(self, exc_type, exc_val, exc_tb):\\n        pass", "solution": "class FileProcessor:\\n    def __init__(self, filename, mode=\\"r\\"):\\n        self.filename = filename\\n        self.mode = mode\\n        self.file = None\\n    def __enter__(self):\\n        self.file = open(self.filename, self.mode)\\n        return self.file\\n    def __exit__(self, exc_type, exc_val, exc_tb):\\n        if self.file:\\n            self.file.close()\\n        return False"}]',
 'coding', 30),

('80000000-0000-0000-0000-000000000008', 'Error Handling in File Operations', 'Handling file-related exceptions gracefully', 'intermediate', 32, 8,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "File operations can fail for many reasons. Proper error handling is crucial."}, {"type": "code", "question": "Create robust file reader", "starterCode": "def safe_read_file(filename):\\n    # Read with error handling\\n    pass", "solution": "import os\\ndef safe_read_file(filename):\\n    try:\\n        if not os.path.exists(filename):\\n            return {\\"error\\": \\"File not found\\"}\\n        with open(filename, \\"r\\") as file:\\n            content = file.read()\\n            return {\\"success\\": True, \\"content\\": content}\\n    except Exception as e:\\n        return {\\"error\\": f\\"Failed: {str(e)}\\"}"}]',
 'coding', 32),

('80000000-0000-0000-0000-000000000009', 'Working with Different File Formats', 'Reading and writing CSV, JSON, and other formats', 'intermediate', 35, 9,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Python excels at handling various file formats. Use json and csv modules."}, {"type": "code", "question": "Create file format converter", "starterCode": "import json\\ndef convert_json_to_csv(input_file, output_file):\\n    # Convert JSON to CSV\\n    pass", "solution": "import json\\nimport csv\\nimport os\\ndef convert_json_to_csv(input_file, output_file):\\n    if not os.path.exists(input_file):\\n        return {\\"error\\": \\"Input file not found\\"}\\n    with open(input_file, \\"r\\") as file:\\n        data = json.load(file)\\n    with open(output_file, \\"w\\", newline=\\"\\") as file:\\n        if data and isinstance(data, list) and data[0]:\\n            writer = csv.DictWriter(file, fieldnames=data[0].keys())\\n            writer.writeheader()\\n            writer.writerows(data)\\n    return {\\"success\\": True, \\"output_file\\": output_file}"}]',
 'coding', 35),

('80000000-0000-0000-0000-000000000010', 'File Processing Project', 'Build a real-world file processing application', 'intermediate', 40, 10,
 (SELECT id FROM sections WHERE path = 'file-operations'),
 '[{"type": "text", "content": "Apply your file operations knowledge to build a practical file processing tool."}, {"type": "code", "question": "Build log file analyzer", "starterCode": "import re\\nimport os\\nclass LogAnalyzer:\\n    def __init__(self):\\n        self.parsed_logs = []\\n    def parse_log_file(self, filename):\\n        # Parse log file\\n        pass", "solution": "import re\\nimport os\\nfrom collections import Counter\\nclass LogAnalyzer:\\n    def __init__(self):\\n        self.parsed_logs = []\\n    def parse_log_file(self, filename):\\n        if not os.path.exists(filename):\\n            return {\\"error\\": \\"File not found\\"}\\n        pattern = r\\"\\\\[([^\\\\]]+)\\\\] (\\\\w+): (.*)\\"\\n        parsed_entries = []\\n        try:\\n            with open(filename, \\"r\\") as file:\\n                for line_num, line in enumerate(file, 1):\\n                    line = line.strip()\\n                    if not line:\\n                        continue\\n                    match = re.match(pattern, line)\\n                    if match:\\n                        timestamp, level, message = match.groups()\\n                        entry = {\\n                            \\"timestamp\\": timestamp,\\n                            \\"level\\": level.upper(),\\n                            \\"message\\": message\\n                        }\\n                        parsed_entries.append(entry)\\n        except Exception as e:\\n            return {\\"error\\": f\\"Error: {str(e)}\\"}\\n        self.parsed_logs = parsed_entries\\n        return {\\"success\\": True, \\"entries\\": parsed_entries}\\n    def generate_statistics(self):\\n        if not self.parsed_logs:\\n            return {\\"error\\": \\"No data\\"}\\n        levels = Counter([entry.get(\\"level\\") for entry in self.parsed_logs if entry.get(\\"level\\")])\\n        return {\\"total_entries\\": len(self.parsed_logs), \\"log_levels\\": dict(levels)}"}]',
 'project', 45)
ON CONFLICT (id) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_string_file_lessons_section ON lessons(section_id);
CREATE INDEX IF NOT EXISTS idx_string_file_lessons_order ON lessons(order_index);

-- Summary query to verify lessons were added
SELECT
  'String and File Operations Lessons Added Successfully' as result,
  (SELECT COUNT(*) FROM lessons WHERE section_id = (SELECT id FROM sections WHERE path = 'string-operations')) as string_lessons,
  (SELECT COUNT(*) FROM lessons WHERE section_id = (SELECT id FROM sections WHERE path = 'file-operations')) as file_lessons,
  (SELECT COUNT(*) FROM lessons WHERE id LIKE '7%' OR id LIKE '8%') as total_lessons_added;