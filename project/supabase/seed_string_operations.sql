/*
  # PyLearn String Operations Lessons

  ## Overview
  8-10 comprehensive lessons covering Python string manipulation
  From basic operations to advanced string processing techniques

  ## Structure
  - Basic String Operations (3): len(), upper(), lower(), strip()
  - String Methods (3): find(), replace(), split(), join()
  - Advanced Operations (3): Slicing, formatting, regular expressions
  - Practical Applications (1): Real-world string processing tasks

  ## Target Audience
  Beginners to intermediate learners mastering text manipulation
*/

-- Basic String Operations (3 lessons)
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
('70000000-0000-0000-0000-000000000001', 'String Length and Case', 'Learn to get string length and change case', 'beginner', 15, 1, '00000000-0000-0000-0000-000000000007',
'[{"type": "text", "content": "Strings are sequences of characters. Python provides built-in functions to work with them."}, {"type": "text", "content": "len() returns the number of characters in a string."}, {"type": "text", "content": "upper() converts all characters to uppercase, lower() to lowercase."}, {"type": "code", "question": "Create a function that analyzes text", "starterCode": "def analyze_text(text):\n    # Your code here\n    pass", "solution": "def analyze_text(text):\n    length = len(text)\n    upper_text = text.upper()\n    lower_text = text.lower()\n    \n    return {\n        \"original\": text,\n        \"length\": length,\n        \"upper\": upper_text,\n        \"lower\": lower_text\n    }"}]',
'coding', 12),

('70000000-0000-0000-0000-000000000002', 'String Stripping and Cleaning', 'Remove unwanted characters and whitespace', 'beginner', 18, 2, '00000000-0000-0000-0000-000000000007',
'[{"type": "text", "content": "Cleaning strings is essential for data processing and user input handling."}, {"type": "text", "content": "strip() removes leading/trailing whitespace. lstrip() and rstrip() for specific sides."}, {"type": "text", "content": "replace() substitutes characters or substrings."}, {"type": "code", "question": "Clean messy user input", "starterCode": "def clean_input(text):\n    # Remove extra spaces and punctuation\n    pass", "solution": "def clean_input(text):\n    # Remove leading/trailing spaces\n    cleaned = text.strip()\n    # Remove extra internal spaces\n    cleaned = \" \".join(cleaned.split())\n    # Remove common punctuation\n    cleaned = cleaned.replace(\",\", \"\").replace(\".\", \"\").replace(\"!\", \"\")\n    return cleaned"}]',
'coding', 15),

('70000000-0000-0000-0000-000000000003', 'String Concatenation', 'Combine strings efficiently', 'beginner', 12, 3, '00000000-0000-0000-0000-000000000007',
'[{"type": "text", "content": "String concatenation joins multiple strings together."}, {"type": "text", "content": "Use + operator or join() method. join() is more efficient for multiple strings."}, {"type": "code", "question": "Build a sentence from words", "starterCode": "words = [\"Python\", \"is\", \"awesome\"]\n# Your code here", "solution": "words = [\"Python\", \"is\", \"awesome\"]\n# Method 1: Using +\nsentence = words[0] + \" \" + words[1] + \" \" + words[2]\n\n# Method 2: Using join() - preferred\nsentence = \" \".join(words)\nprint(sentence)"}]',
'coding', 10),

-- String Methods (3 lessons)
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
('70000000-0000-0000-0000-000000000004', 'Finding and Replacing', 'Search and substitute in strings', 'beginner', 20, 4, '00000000-0000-0000-0000-000000000007',
'[{"type": "text", "content": "Python provides methods to find substrings and replace content."}, {"type": "text", "content": "find() returns the first occurrence index, or -1 if not found."}, {"type": "text", "content": "replace() substitutes all occurrences of a substring."}, {"type": "text", "content": "count() counts occurrences of a substring."}, {"type": "code", "question": "Text search and replace utility", "starterCode": "def text_processor(text, search, replace_with):\n    # Your code here\n    pass", "solution": "def text_processor(text, search, replace_with):\n    # Count occurrences\n    count = text.count(search)\n    \n    # Replace all occurrences\n    replaced_text = text.replace(search, replace_with)\n    \n    # Find first occurrence\n    first_pos = text.find(search)\n    \n    return {\n        \"original\": text,\n        \"search\": search,\n        \"replace_with\": replace_with,\n        \"count\": count,\n        \"first_position\": first_pos,\n        \"replaced\": replaced_text\n    }"}]',
'coding', 18),

('70000000-0000-0000-0000-000000000005', 'Splitting and Joining', 'Break and combine strings', 'intermediate', 22, 5, '00000000-0000-0000-0000-000000000007',
'[{"type": "text", "content": "split() breaks strings into lists based on a delimiter."}, {"type": "text", "content": "join() combines list elements into a string."}, {"type": "text", "content": "Common use case: processing CSV data, sentences, words."}, {"type": "code", "question": "Process a sentence into words", "starterCode": "sentence = \"Python is a powerful programming language\"\n# Your code here", "solution": "sentence = \"Python is a powerful programming language\"\n\n# Split into words\nwords = sentence.split()\nprint(f\"Words: {words}\")\n\n# Count words\nword_count = len(words)\nprint(f\"Word count: {word_count}\")\n\n# Join with different separator\njoined_hyphen = \"-\".join(words)\njoined_comma = \", \".join(words)\nprint(f\"Hyphenated: {joined_hyphen}\")\nprint(f\"Comma-separated: {joined_comma}\")"}]',
'coding', 15),

('70000000-0000-0000-0000-000000000006', 'String Validation', 'Check string patterns and format', 'intermediate', 25, 6, '00000000-0000-0000-0000-000000000007',
'[{"type": "text", "content": "Validation ensures strings meet specific requirements."}, {"type": "text", "content": "Common validations: email format, phone numbers, URLs."}, {"type": "text", "content": "Use string methods like startswith(), endswith(), isdigit(), isalpha()."}, {"type": "code", "question": "Validate email format", "starterCode": "def is_valid_email(email):\n    # Basic email validation\n    pass", "solution": "def is_valid_email(email):\n    # Basic email validation\n    if \"@\" not in email or \".\" not in email:\n        return False\n    \n    # Check for basic structure\n    parts = email.split(\"@\")\n    if len(parts) != 2:\n        return False\n        \n    username, domain = parts\n    \n    # Basic checks\n    if len(username) < 1 or len(domain) < 3:\n        return False\n        \n    if \".\" not in domain:\n        return False\n        \n    return True\n\n# Test cases\nemails = [\"user@example.com\", \"invalid.email\", \"test@domain\", \"@invalid.com\"]\nfor email in emails:\n    print(f\"{email}: {is_valid_email(email)}\")"}]',
'coding', 20),

-- Advanced Operations (3 lessons)
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
('70000000-0000-0000-0000-000000000007', 'String Slicing', 'Extract substrings efficiently', 'intermediate', 28, 7, '00000000-0000-0000-0000-000000000007',
'[{"type": "text", "content": "String slicing extracts portions using [start:end:step] syntax."}, {"type": "text", "content": "Negative indices count from the end. Step parameter controls progression."}, {"type": "text", "content": "Common patterns: [::-1] for reverse, [:n] for first n, [n:] for last n."}, {"type": "code", "question": "Extract information from string", "starterCode": "data = \"Python_3.9.0_Stable\"\n# Your code here", "solution": "data = \"Python_3.9.0_Stable\"\n\n# Extract different parts\nprint(f\"Original: {data}\")\nprint(f\"First 6 chars: {data[:6]}\")\nprint(f\"Last 7 chars: {data[-7:]}\")\nprint(f\"Middle (2-5): {data[2:6]}\")\nprint(f\"Every 2nd char: {data[::2]}\")\nprint(f\"Reverse: {data[::-1]}\")\n\n# Find version number\nversion_start = data.find(\"_\") + 1\nversion_end = data.find(\"_\", version_start)\nversion = data[version_start:version_end]\nprint(f\"Version: {version}\")"}]',
'coding', 18),

('70000000-0000-0000-0000-000000000008', 'String Formatting', 'Advanced string techniques', 'intermediate', 30, 8, '00000000-0000-0000-0000-000000000007',
'[{"type": "text", "content": "Modern string formatting with f-strings and .format() method."}, {"type": "text", "content": "f-strings: f\"{variable}\" - available in Python 3.6+"}, {"type": "text", "content": ".format(): \"{} {}\".format(a, b) - compatible with older versions."}, {"type": "text", "content": "Format specifications: padding, alignment, number formatting."}, {"type": "code", "question": "Create formatted output", "starterCode": "name = \"Alice\"\nage = 30\ncity = \"New York\"\nscore = 95.5\n# Your code here", "solution": "name = \"Alice\"\nage = 30\ncity = \"New York\"\nscore = 95.5\n\n# f-string method (Python 3.6+)\nformatted_f = f\"Name: {name}, Age: {age}, City: {city}, Score: {score:.1f}\"\nprint(formatted_f)\n\n# .format() method\nformatted_format = \"Name: {}, Age: {}, City: {}, Score: {:.1f}\".format(name, age, city, score)\nprint(formatted_format)\n\n# Padding and alignment\npadded = f\"{name:<10} | {age:>3} | {city:<15} | {score:>6}\"\nprint(f\"Padded:\")\nprint(padded)"}]',
'coding', 22),

('70000000-0000-0000-0000-000000000009', 'Regular Expressions', 'Pattern matching in strings', 'advanced', 35, 9, '00000000-0000-0000-0000-000000000007',
'[{"type": "text", "content": "Regular expressions provide powerful pattern matching capabilities."}, {"type": "text", "content": "Import re module. Common patterns: . (any), ^ (start), $ (end), * (zero+), + (one+)."}, {"type": "text", "content": "Functions: search(), findall(), match(), sub() for substitution."}, {"type": "code", "question": "Extract phone numbers from text", "starterCode": "import re\n\ntext = \"Contact us at 555-1234 or 800-555-0000. International: +44-20-1234-5678\"\n# Your code here", "solution": "import re\n\ntext = \"Contact us at 555-1234 or 800-555-0000. International: +44-20-1234-5678\"\n\n# Pattern for US phone numbers\nus_pattern = r'\\b\\d{3}-\\d{3}-\\d{4}\\b'\n\n# Pattern for international numbers\nint_pattern = r'\\+\\d{1,3}-\\d{1,4}-\\d{3,4}-\\d{4}\\b'\n\n# Find all matches\nus_phones = re.findall(us_pattern, text)\nint_phones = re.findall(int_pattern, text)\n\nprint(f\"US Phone Numbers: {us_phones}\")\nprint(f\"International Numbers: {int_phones}\")\n\n# Extract all phone-like patterns\nphone_pattern = r'(?:\\+?\\d{1,3}-)?\\d{1,4}-\\d{3,4}-\\d{4}'\nall_phones = re.findall(phone_pattern, text)\nprint(f\"All Phone Numbers: {all_phones}\")"}]',
'coding', 25),

-- Practical Applications (1 lesson)
INSERT INTO lessons (id, title, description, difficulty, xp_reward, order_index, section_id, content, lesson_type, estimated_minutes) VALUES
('70000000-0000-0000-0000-000000000010', 'Text Processing Project', 'Real-world string manipulation', 'intermediate', 40, 10, '00000000-0000-0000-0000-000000000007',
'[{"type": "text", "content": "Apply string operations to build a practical text processing tool."}, {"type": "text", "content": "Project: Create a word frequency analyzer that processes text files."}, {"type": "text", "content": "Skills: File reading, string cleaning, word counting, result formatting."}, {"type": "code", "question": "Build word frequency analyzer", "starterCode": "def analyze_text_file(filename):\n    # Your code here\n    pass", "solution": "import re\nfrom collections import Counter\n\ndef analyze_text_file(filename):\n    \"\"\"Analyze text file and return word frequency statistics.\"\"\"\n    try:\n        with open(filename, 'r', encoding='utf-8') as f:\n            text = f.read().lower()\n    \n        # Remove punctuation and split into words\n        words = re.findall(r'\\b\\w+\\b', text)\n        \n        # Count word frequencies\n        word_freq = Counter(words)\n        \n        # Get statistics\n        total_words = len(words)\n        unique_words = len(word_freq)\n        most_common = word_freq.most_common(5)\n        \n        return {\n            \"total_words\": total_words,\n            \"unique_words\": unique_words,\n            \"most_common\": most_common,\n            \"word_freq\": dict(word_freq)\n        }\n    except FileNotFoundError:\n        return {\"error\": f\"File {filename} not found\"}\n    except Exception as e:\n        return {\"error\": f\"Error processing file: {e}\"}\n\n# Example usage\nresult = analyze_text_file(\"sample.txt\")\nif \"error\" in result:\n    print(result[\"error\"])\nelse:\n    print(f\"Total words: {result['total_words']}\")\n    print(f\"Unique words: {result['unique_words']}\")\n    print(f\"Most common words: {result['most_common']}\")"}]',
'project', 30);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_string_lessons_section ON lessons(section_id);
CREATE INDEX IF NOT EXISTS idx_string_lessons_order ON lessons(order_index);

-- Verify data was inserted
SELECT
  section_id,
  COUNT(*) as lesson_count,
  STRING_AGG(DISTINCT lesson_type, ', ') as lesson_types
FROM lessons
WHERE section_id = '00000000-0000-0000-0000-000000000007'
GROUP BY section_id;

SELECT
  'Total String Operations Lessons Created' as metric,
  COUNT(*) as count
FROM lessons
WHERE section_id = '00000000-0000-0000-0000-000000000007';