#!/usr/bin/env python3
"""
Database Seed Execution Script
This script executes all SQL seed files to populate the database.
"""

import os
import sys
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_supabase_client():
    """Initialize Supabase client"""
    try:
        url = os.getenv('VITE_SUPABASE_URL')
        key = os.getenv('VITE_SUPABASE_ANON_KEY')

        if not url or not key:
            print("❌ Missing Supabase configuration. Please check your .env file.")
            print("   Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY")
            return None

        print(f"🔗 Connecting to Supabase at: {url}")
        return create_client(url, key)
    except Exception as e:
        print(f"❌ Failed to initialize Supabase client: {e}")
        return None

def execute_sql_file(client: Client, file_path: Path):
    """Execute a single SQL file"""
    print(f"📄 Executing {file_path.name}...")

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            sql_content = f.read()

        # Split content by semicolons to handle multiple statements
        statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]

        executed_count = 0
        error_count = 0

        for statement in statements:
            if not statement:
                continue

            try:
                result = client.rpc('exec_sql', {'sql': statement}).execute()
                executed_count += 1
            except Exception as e:
                print(f"  ⚠️  Error in statement: {e}")
                error_count += 1

        print(f"  ✅ Executed {executed_count} statements, {error_count} errors")
        return error_count == 0

    except Exception as e:
        print(f"  ❌ Failed to read or execute {file_path.name}: {e}")
        return False

def main():
    """Main execution function"""
    print("🚀 Starting Database Seed Execution")
    print("=" * 50)

    # Initialize Supabase client
    client = get_supabase_client()
    if not client:
        sys.exit(1)

    # Find all SQL seed files
    project_root = Path(__file__).parent
    seed_files = []

    # Look in multiple directories for seed files
    search_paths = [
        project_root / "project" / "supabase",
        project_root / "project",
        project_root
    ]

    for search_path in search_paths:
        if search_path.exists():
            seed_files.extend(search_path.glob("seed_*.sql"))
            seed_files.extend(search_path.glob("*seed*.sql"))

    # Also look for comprehensive curriculum files
    comprehensive_files = [
        project_root / "FULL_CURRICULUM.sql",
        project_root / "CURRICULUM_FIXED.sql",
        project_root / "FIXED_LESSONS.sql"
    ]

    for file_path in comprehensive_files:
        if file_path.exists():
            seed_files.append(file_path)

    # Remove duplicates and sort
    seed_files = list(set(seed_files))
    seed_files.sort(key=lambda x: x.name)

    if not seed_files:
        print("❌ No seed files found!")
        return

    print(f"📋 Found {len(seed_files)} seed files:")
    for file_path in seed_files:
        print(f"   - {file_path.name}")
    print()

    # Execute files in order of priority
    priority_order = [
        "database_schema.sql",
        "FULL_CURRICULUM.sql",
        "seed_beginner_lessons.sql",
        "seed_code_challenges.sql",
        "seed_algorithm_problems.sql",
        "seed_project_templates.sql",
        "seed_all_lessons.sql",
        "seed_enhanced_lessons.sql"
    ]

    executed_files = []
    failed_files = []

    # Execute priority files first
    for priority_file in priority_order:
        for file_path in seed_files:
            if file_path.name == priority_file and file_path not in executed_files:
                if execute_sql_file(client, file_path):
                    executed_files.append(file_path)
                else:
                    failed_files.append(file_path)
                break

    # Execute remaining files
    for file_path in seed_files:
        if file_path not in executed_files and file_path not in failed_files:
            if execute_sql_file(client, file_path):
                executed_files.append(file_path)
            else:
                failed_files.append(file_path)

    # Summary
    print()
    print("=" * 50)
    print("📊 EXECUTION SUMMARY")
    print(f"✅ Successfully executed: {len(executed_files)} files")
    print(f"❌ Failed to execute: {len(failed_files)} files")

    if failed_files:
        print("\n❌ Failed files:")
        for file_path in failed_files:
            print(f"   - {file_path.name}")

    if executed_files:
        print("\n✅ Successfully executed:")
        for file_path in executed_files:
            print(f"   - {file_path.name}")

    print(f"\n🎉 Seed execution completed! {len(executed_files)}/{len(seed_files)} files processed.")

    if len(executed_files) > len(seed_files) * 0.8:  # 80% success rate
        print("🌟 Database should now be populated with comprehensive content!")
    else:
        print("⚠️  Some files failed. Please check the errors above.")

if __name__ == "__main__":
    main()