import { useEffect, useState } from 'react';
import { Rocket, CheckCircle, ArrowRight, Target, BookOpen } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { CodeEditor } from '../CodeEditor';

type Project = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  xp_reward: number;
  project_brief: string;
  learning_objectives: string[];
  resources: string[];
  starter_files: Record<string, string> | null;
};

export const ProjectBuilderView = () => {
  const { profile, refreshProfile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [code, setCode] = useState('');
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [userProjects, setUserProjects] = useState<Record<string, any>>({});

  useEffect(() => {
    loadProjects();
  }, [profile]);

  const loadProjects = async () => {
    try {
      const { data } = await supabase
        .from('project_templates')
        .select('*')
        .order('difficulty');

      if (data && data.length > 0) {
        setProjects(data);

        if (profile) {
          const { data: userProjectsData } = await supabase
            .from('user_project_attempts')
            .select('*')
            .eq('user_id', profile.id);

          if (userProjectsData) {
            const projectsMap = userProjectsData.reduce((acc, p) => {
              acc[p.project_id] = p;
              return acc;
            }, {} as Record<string, any>);
            setUserProjects(projectsMap);
          }
        }
      } else {
        // Use sample projects when database is empty
        setProjects(getSampleProjects());
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      // Fallback to sample projects on error
      setProjects(getSampleProjects());
    }

    setLoading(false);
  };

  // Sample projects when database is empty
  const getSampleProjects = (): Project[] => {
    return [
      {
        id: 'project-1',
        title: 'Personal Todo App',
        description: 'Build a command-line todo application',
        difficulty: 'beginner',
        category: 'productivity',
        xp_reward: 50,
        project_brief: 'Create a simple command-line todo application that allows users to add, view, complete, and delete tasks. The app should save tasks to a file so they persist between sessions.',
        learning_objectives: [
          'Working with lists and dictionaries',
          'File I/O operations',
          'Command-line argument parsing',
          'Error handling and validation'
        ],
        resources: [
          'Python argparse module documentation',
          'File handling with open() and context managers',
          'JSON module for data persistence'
        ],
        starter_files: {
          'main.py': '# Todo App - Your Personal Task Manager\n\ndef main():\n    print("Welcome to Todo App!")\n    # Your code here\n\nif __name__ == "__main__":\n    main()\n'
        }
      },
      {
        id: 'project-2',
        title: 'Weather Dashboard',
        description: 'Create a weather information dashboard',
        difficulty: 'intermediate',
        category: 'web-scraping',
        xp_reward: 75,
        project_brief: 'Build a weather dashboard that fetches current weather data from a free weather API and displays it in a user-friendly format. The app should show temperature, humidity, wind speed, and weather conditions.',
        learning_objectives: [
          'Making HTTP requests with requests library',
          'Working with JSON APIs',
          'Data formatting and display',
          'Error handling for network requests'
        ],
        resources: [
          'OpenWeatherMap API documentation',
          'Python requests library guide',
          'JSON data manipulation'
        ],
        starter_files: {
          'main.py': '# Weather Dashboard\nimport requests\nimport json\n\ndef get_weather(city):\n    # Your code here\n    pass\n\ndef main():\n    # Your code here\n    pass\n\nif __name__ == "__main__":\n    main()\n'
        }
      },
      {
        id: 'project-3',
        title: 'Expense Tracker',
        description: 'Build a personal expense tracking application',
        difficulty: 'intermediate',
        category: 'finance',
        xp_reward: 80,
        project_brief: 'Create an expense tracker that allows users to log daily expenses, categorize them, view spending patterns, and generate simple reports. The app should store data in a CSV or JSON file.',
        learning_objectives: [
          'Data structures for organizing expenses',
          'CSV/JSON file operations',
          'Date and time handling',
          'Data analysis and reporting'
        ],
        resources: [
          'Python csv module documentation',
          'datetime module guide',
          'Pandas basics for data analysis'
        ],
        starter_files: {
          'main.py': '# Expense Tracker\nimport csv\nfrom datetime import datetime\n\nclass ExpenseTracker:\n    def __init__(self):\n        # Your code here\n        pass\n\ndef main():\n    # Your code here\n    pass\n\nif __name__ == "__main__":\n    main()\n'
        }
      },
      {
        id: 'project-4',
        title: 'Web Scraper for News',
        description: 'Create a news scraping and summarization tool',
        difficulty: 'advanced',
        category: 'web-scraping',
        xp_reward: 100,
        project_brief: 'Build a web scraper that extracts news articles from a news website, summarizes the content, and saves the results. The scraper should handle multiple articles and respect rate limits.',
        learning_objectives: [
          'Web scraping with BeautifulSoup',
          'Text processing and summarization',
          'Rate limiting and ethical scraping',
          'Data storage and organization'
        ],
        resources: [
          'BeautifulSoup documentation',
          'Text summarization techniques',
          'Web scraping best practices',
          'Robots.txt and scraping ethics'
        ],
        starter_files: {
          'main.py': '# News Scraper and Summarizer\nimport requests\nfrom bs4 import BeautifulSoup\nimport time\n\nclass NewsScraper:\n    def __init__(self):\n        # Your code here\n        pass\n\n    def scrape_article(self, url):\n        # Your code here\n        pass\n\ndef main():\n    # Your code here\n    pass\n\nif __name__ == "__main__":\n    main()\n'
        }
      },
      {
        id: 'project-5',
        title: 'Chat Bot Assistant',
        description: 'Build an intelligent chat bot assistant',
        difficulty: 'advanced',
        category: 'ai',
        xp_reward: 120,
        project_brief: 'Create a chat bot that can answer questions, tell jokes, provide information, and maintain conversation context. The bot should have personality and be able to learn from interactions.',
        learning_objectives: [
          'Natural language processing basics',
          'Pattern matching and responses',
          'Conversation state management',
          'API integration for enhanced capabilities'
        ],
        resources: [
          'Regular expressions for pattern matching',
          'NLP concepts and techniques',
          'Chatbot design principles',
          'Context management strategies'
        ],
        starter_files: {
          'main.py': '# Chat Bot Assistant\nimport re\nimport random\nimport json\nfrom datetime import datetime\n\nclass ChatBot:\n    def __init__(self, name="Assistant"):\n        # Your code here\n        pass\n\n    def respond(self, message):\n        # Your code here\n        pass\n\ndef main():\n    # Your code here\n    pass\n\nif __name__ == "__main__":\n    main()\n'
        }
      },
      {
        id: 'project-6',
        title: 'File Organizer',
        description: 'Create an automated file organization tool',
        difficulty: 'intermediate',
        category: 'automation',
        xp_reward: 70,
        project_brief: 'Build a file organizer that automatically sorts files in a directory into subfolders based on file type, date, or custom rules. The tool should be configurable and include logging.',
        learning_objectives: [
          'File system operations with os and pathlib',
          'Pattern matching and file classification',
          'Configuration management',
          'Logging and error handling'
        ],
        resources: [
          'Python os and pathlib modules',
          'File type detection methods',
          'Configuration file formats',
          'Python logging module'
        ],
        starter_files: {
          'main.py': '# File Organizer\nimport os\nimport shutil\nfrom pathlib import Path\nimport logging\nfrom datetime import datetime\n\nclass FileOrganizer:\n    def __init__(self, target_directory):\n        # Your code here\n        pass\n\n    def organize_files(self, rules=None):\n        # Your code here\n        pass\n\ndef main():\n    # Your code here\n    pass\n\nif __name__ == "__main__":\n    main()\n'
        }
      }
    ];
  };

  const selectProject = (project: Project) => {
    setSelectedProject(project);
    const userProject = userProjects[project.id];
    setCode(userProject?.code || (project.starter_files?.['main.py'] || '# Start coding your project here\n'));
    setCompletionPercentage(userProject?.completion_percentage || 0);
  };

  const saveProject = async () => {
    if (!selectedProject || !profile) return;

    setIsSaving(true);

    try {
      const userProject = userProjects[selectedProject.id];

      if (userProject) {
        await supabase
          .from('user_project_attempts')
          .update({
            code,
            completion_percentage: completionPercentage,
          })
          .eq('id', userProject.id);
      } else {
        await supabase.from('user_project_attempts').insert({
          user_id: profile.id,
          project_id: selectedProject.id,
          code,
          completion_percentage: completionPercentage,
          status: 'in_progress',
        });
      }

      setUserProjects({
        ...userProjects,
        [selectedProject.id]: { ...userProjects[selectedProject.id], code, completion_percentage: completionPercentage },
      });
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const submitProject = async () => {
    if (!selectedProject || !profile) return;

    try {
      const userProject = userProjects[selectedProject.id];

      await supabase
        .from('user_project_attempts')
        .update({
          status: 'submitted',
          completion_percentage: 100,
          submitted_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        })
        .eq('id', userProject.id);

      await supabase
        .from('profiles')
        .update({
          total_xp: profile.total_xp + selectedProject.xp_reward,
          current_level: Math.floor((profile.total_xp + selectedProject.xp_reward) / 100) + 1,
        })
        .eq('id', profile.id);

      await refreshProfile();
      await loadProjects();
      setSelectedProject(null);
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading projects...</div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Project Builder</h2>
          <p className="text-slate-400">Build real-world projects and earn XP</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => {
            const userProject = userProjects[project.id];
            const isCompleted = userProject?.status === 'submitted';

            return (
              <button
                key={project.id}
                onClick={() => selectProject(project)}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-green-500 transition-all group text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors mb-1">
                      {project.title}
                    </h3>
                    <p className="text-slate-400 text-sm">{project.description}</p>
                  </div>
                  {isCompleted && <CheckCircle className="text-green-500 flex-shrink-0" size={24} />}
                </div>

                <div className="flex items-center gap-4 flex-wrap mb-4">
                  <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full capitalize">
                    {project.difficulty}
                  </span>
                  <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>

                {userProject && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Progress</span>
                      <span>{userProject.completion_percentage}%</span>
                    </div>
                    <div className="bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${userProject.completion_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <Rocket className="text-slate-600 mx-auto mb-4" size={48} />
            <p className="text-slate-400">No projects available yet. Check back soon!</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <button
        onClick={() => setSelectedProject(null)}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
      >
        <ArrowRight size={18} className="rotate-180" />
        Back to Projects
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedProject.title}</h2>
                    <p className="text-slate-400">{selectedProject.description}</p>
                  </div>
                  <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full capitalize">
                    {selectedProject.difficulty}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Project Progress</span>
                    <span className="text-slate-400">{completionPercentage}%</span>
                  </div>
                  <div className="bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <BookOpen size={18} />
                    Project Brief
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {selectedProject.project_brief}
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Target size={18} />
                    Learning Objectives
                  </h3>
                  <ul className="space-y-1">
                    {selectedProject.learning_objectives.map((objective, index) => (
                      <li key={index} className="text-slate-300 text-sm flex gap-2">
                        <span className="text-green-400">✓</span>
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedProject.resources && selectedProject.resources.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-2">Resources</h3>
                    <ul className="space-y-1">
                      {selectedProject.resources.map((resource, index) => (
                        <li key={index} className="text-blue-400 text-sm">
                          • {resource}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <CodeEditor value={code} onChange={setCode} initialCode="# Your project code here\n" />

          <div className="mt-4 space-y-3">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <label className="text-slate-300 text-sm mb-2 block">Completion %</label>
              <input
                type="range"
                min="0"
                max="100"
                value={completionPercentage}
                onChange={(e) => setCompletionPercentage(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-slate-400 text-xs mt-2">{completionPercentage}% complete</p>
            </div>

            <button
              onClick={saveProject}
              disabled={isSaving}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Progress'}
            </button>

            {completionPercentage === 100 && (
              <button
                onClick={submitProject}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Submit Project
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
