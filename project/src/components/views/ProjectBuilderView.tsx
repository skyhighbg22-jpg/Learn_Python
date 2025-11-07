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
    const { data } = await supabase
      .from('project_templates')
      .select('*')
      .order('difficulty');

    if (data) {
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
    }

    setLoading(false);
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
