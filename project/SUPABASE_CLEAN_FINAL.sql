-- Add String and File Operations Lessons - Clean Version

-- First, get the section IDs and insert lessons
DO $$
DECLARE
    string_section_id UUID;
    file_section_id UUID;
BEGIN
    -- Get string operations section ID
    SELECT id INTO string_section_id FROM sections WHERE path = 'string-operations' LIMIT 1;

    -- Get file operations section ID
    SELECT id INTO file_section_id FROM sections WHERE path = 'file-operations' LIMIT 1;

    -- Only proceed if sections exist
    IF string_section_id IS NOT NULL AND file_section_id IS NOT NULL THEN
        -- Insert String Operations Lessons
        INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
        ('70000000-0000-0000-0000-000000000001', 'String Length and Case', 'Learn to get string length and change case', 'beginner', 15, 1, string_section_id, '[{"type": "text", "content": "Strings are sequences of characters."}, {"type": "code", "question": "Create a function that analyzes text", "starterCode": "def analyze_text(text):\\n    pass", "solution": "def analyze_text(text):\\n    return len(text)"}]', 'code', 12),
        ('70000000-0000-0000-0000-000000000002', 'String Stripping and Cleaning', 'Remove unwanted characters', 'beginner', 18, 2, string_section_id, '[{"type": "text", "content": "Clean strings by removing whitespace."}, {"type": "code", "question": "Clean messy input", "starterCode": "def clean_input(text):\\n    pass", "solution": "def clean_input(text):\\n    return text.strip()"}]', 'code', 15),
        ('70000000-0000-0000-0000-000000000003', 'String Concatenation', 'Combine strings efficiently', 'beginner', 12, 3, string_section_id, '[{"type": "text", "content": "Join strings using join method."}, {"type": "code", "question": "Build sentence from words", "starterCode": "words = [\"Python\", \"is\", \"awesome\"]\\n# Your code here", "solution": "sentence = \" \".join(words)\\nprint(sentence)"}]', 'code', 10),
        ('70000000-0000-0000-0000-000000000004', 'Finding and Replacing', 'Search and substitute in strings', 'beginner', 20, 4, string_section_id, '[{"type": "text", "content": "Use find and replace methods."}, {"type": "code", "question": "Search and replace utility", "starterCode": "def find_replace(text, search, replace):\\n    pass", "solution": "count = text.count(search)\\nresult = text.replace(search, replace)\\nreturn count, result"}]', 'code', 18),
        ('70000000-0000-0000-0000-000000000005', 'Splitting and Joining', 'Break and combine strings', 'intermediate', 22, 5, string_section_id, '[{"type": "text", "content": "Use split and join methods."}, {"type": "code", "question": "Process sentence into words", "starterCode": "sentence = \"Python is powerful\"\\n# Your code here", "solution": "words = sentence.split()\\nprint(len(words))"}]', 'code', 15),
        ('70000000-0000-0000-0000-000000000006', 'String Validation', 'Check string patterns', 'intermediate', 25, 6, string_section_id, '[{"type": "text", "content": "Validate email formats and patterns."}, {"type": "code", "question": "Validate email format", "starterCode": "def is_valid_email(email):\\n    pass", "solution": "return \"@\" in email and \".\" in email"}]', 'code', 20),
        ('70000000-0000-0000-0000-000000000007', 'String Slicing', 'Extract substrings', 'intermediate', 28, 7, string_section_id, '[{"type": "text", "content": "Use slicing syntax for extraction."}, {"type": "code", "question": "Extract from string", "starterCode": "data = \"Python_3.9\"\\n# Your code here", "solution": "print(data[:6])\\nprint(data[-2:])"}]', 'code', 18),
        ('70000000-0000-0000-0000-000000000008', 'String Formatting', 'Format strings effectively', 'intermediate', 30, 8, string_section_id, '[{"type": "text", "content": "Use f-strings for formatting."}, {"type": "code", "question": "Format output", "starterCode": "name = \"Alice\"\\nage = 30\\n# Your code here", "solution": "print(f\"Name: {name}, Age: {age}\")"}]', 'code', 22),
        ('70000000-0000-0000-0000-000000000009', 'Regular Expressions', 'Pattern matching', 'advanced', 35, 9, string_section_id, '[{"type": "text", "content": "Use regex for pattern matching."}, {"type": "code", "question": "Extract phone numbers", "starterCode": "import re\\ntext = \"Call 555-1234\"\\n# Your code here", "solution": "pattern = r\"\\d{3}-\\d{4}\"\\nprint(re.findall(pattern, text))"}]', 'code', 25),
        ('70000000-0000-0000-0000-000000000010', 'Text Processing Project', 'Real-world application', 'intermediate', 40, 10, string_section_id, '[{"type": "text", "content": "Build a text processing tool."}, {"type": "code", "question": "Word counter', "starterCode": "def count_words(filename):\\n    pass", "solution": "with open(filename, \"r\") as f:\\n    return len(f.read().split())"}]', 'code', 30)
        ON CONFLICT (id) DO NOTHING;

        -- Insert File Operations Lessons
        INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
        ('80000000-0000-0000-0000-000000000001', 'Reading Text Files', 'Learn to read files', 'beginner', 15, 1, file_section_id, '[{"type": "text", "content": "Read files using with statement."}, {"type": "code", "question": "Count lines in file", "starterCode": "def count_lines(filename):\\n    pass", "solution": "with open(filename, \"r\") as f:\\n    return len(f.readlines())"}]', 'code', 15),
        ('80000000-0000-0000-0000-000000000002', 'Writing to Text Files', 'Learn to write files', 'beginner', 18, 2, file_section_id, '[{"type": "text", "content": "Write data to files permanently."}, {"type": "code", "question": "Create log file', "starterCode": "import datetime\\ndef write_log(message):\\n    pass", "solution": "timestamp = datetime.datetime.now().strftime(\"%Y-%m-%d %H:%M:%S\")\\nwith open(\"log.txt\", \"a\") as f:\\n    f.write(f\"[{timestamp}] {message}\\n\")"}]', 'code', 18),
        ('80000000-0000-0000-0000-000000000003', 'Working with File Paths', "Master file path operations", 'beginner', 20, 3, file_section_id, '[{"type": "text", "content": "Use os.path for cross-platform paths."}, {"type": "code", "question": "Safe file path", "starterCode": "import os\\ndef safe_path(dir, file):\\n    pass", "solution": "return os.path.join(dir, file)"}]', 'code', 20),
        ('80000000-0000-0000-0000-000000000004', 'Directory Operations', 'Working with directories', 'intermediate', 22, 4, file_section_id, '[{"type": "text", "content": "Create and manage directories."}, {"type": "code", "question": "Create project structure', "starterCode": "import os\\ndef create_project(name):\\n    pass", "solution": "os.makedirs(name, exist_ok=True)\\nreturn f\"Created {name}\""}]', 'code', 22),
        ('80000000-0000-0000-0000-000000000005', 'File Information', 'Get file details', 'intermediate', 25, 5, file_section_id, '[{"type": "text", "content": "Get file size and metadata."}, {"type": "code", "question": "File info', "starterCode": "import os\\ndef get_size(filename):\\n    pass", "solution": "return os.path.getsize(filename) if os.path.exists(filename) else 0"}]', 'code', 25),
        ('80000000-0000-0000-0000-000000000006', 'File Copying', 'Copy files safely', 'intermediate', 28, 6, file_section_id, '[{"type": "text", "content": "Use shutil for file operations."}, {"type": "code", "question": "Backup file operation", "starterCode": "import shutil\\ndef backup(src, dst):\\n    pass", "solution": "shutil.copy2(src, dst)\\nreturn \"Backup complete\""}]', 'code', 28),
        ('80000000-0000-0000-0000-000000000007', 'Context Managers', 'Use with statements', 'intermediate', 30, 7, file_section_id, '[{"type": "text", "content": "Context managers ensure cleanup."}, {"type": "code", "question": "Simple context manager', "starterCode": "class FileManager:\\n    def __enter__(self):\\n        pass\\n    def __exit__(self, *args):\\n        pass", "solution": "class FileManager:\\n    def __enter__(self):\\n        return self\\n    def __exit__(self, *args):\\n        return False"}]', 'code', 30),
        ('80000000-0000-0000-0000-000000000008', 'Error Handling', 'Handle file errors', 'intermediate', 32, 8, file_section_id, '[{"type": "text", "content": "Handle file operation errors."}, {"type": "code", "question": "Safe file read', "starterCode": "def safe_read(filename):\\n    pass", "solution": "try:\\n    with open(filename, \"r\") as f:\\n        return f.read()\\nexcept:\\n    return \"Error\""}]', 'code', 32),
        ('80000000-0000-0000-0000-000000000009', 'File Formats', 'Work with JSON CSV', 'intermediate', 35, 9, file_section_id, '[{"type": "text", "content": "Handle different file formats."}, {"type": "code", "question": "Read JSON file', "starterCode": "import json\\ndef read_json(filename):\\n    pass", "solution": "with open(filename, \"r\") as f:\\n    return json.load(f)"}]', 'code', 35),
        ('80000000-0000-0000-0000-000000000010', 'File Processing Project', 'Build file app', 'intermediate', 40, 10, file_section_id, '[{"type": "text", "content": "Build a file processing tool."}, {"type": "code", "question": "Log analyzer', "starterCode": "class LogAnalyzer:\\n    def __init__(self):\\n        self.logs = []\\n    def parse(self, file):\\n        pass", "solution": "with open(file, \"r\") as f:\\n    self.logs = f.readlines()\\nreturn len(self.logs)"}]', 'code', 45)
        ON CONFLICT (id) DO NOTHING;

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_new_lessons_section ON lessons(section_id);
        CREATE INDEX IF NOT EXISTS idx_new_lessons_order ON lessons(order_index);

        RAISE NOTICE 'String and File Operations lessons added successfully!';
    ELSE
        RAISE NOTICE 'Required sections not found. Please ensure string-operations and file-operations sections exist.';
    END IF;
END $$;