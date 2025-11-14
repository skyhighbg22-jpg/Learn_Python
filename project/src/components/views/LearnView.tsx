import { useEffect, useState } from 'react';
import { ChevronRight, Lock, CheckCircle, Play, Star, Code, Trophy, BookOpen, Sparkles, Clock, Users, Target, TrendingUp, Zap } from 'lucide-react';
import { supabase, Section, Lesson } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { LessonModal } from '../LessonModal';
import { learningPathService, LearningPathData } from '../../services/learningPathService';

export const LearnView = () => {
  const { profile } = useAuth();
  const [sections, setSections] = useState<Section[]>([]);
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({});
  const [progress, setProgress] = useState<Record<string, any>>({});
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [learningPaths, setLearningPaths] = useState<LearningPathData[]>([]);
  const [dailyGoal, setDailyGoal] = useState<any>(null);

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    if (profile?.id) {
      loadLearningPaths();
    }
  }, [profile]);

  const loadContent = async () => {
    try {
      setError(null);
      setLoading(true);

      // Single query to get sections with lessons (optimizes N+1 query problem)
      const { data: sectionsWithLessons, error: sectionsError } = await supabase
        .from('sections')
        .select(`
          *,
          lessons (*)
        `)
        .order('order_index');

      if (sectionsError) throw sectionsError;

      // Process and set data
      if (sectionsWithLessons) {
        setSections(sectionsWithLessons);

        // Process lessons into map
        const lessonsMap: Record<string, Lesson[]> = {};
        sectionsWithLessons.forEach(section => {
          lessonsMap[section.id] = section.lessons || [];
        });
        setLessons(lessonsMap);

        // Load progress if user is logged in
        if (profile?.id) {
          const { data: progressData, error: progressError } = await supabase
            .from('user_lesson_progress')
            .select('*')
            .eq('user_id', profile.id);

          if (progressError) throw progressError;

          if (progressData) {
            const progressMap = progressData.reduce((acc, p) => {
              acc[p.lesson_id] = p;
              return acc;
            }, {} as Record<string, any>);
            setProgress(progressMap);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load content:', error);
      setError('Failed to load lessons. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const isLessonUnlocked = (lesson: Lesson, section: Section) => {
    if (!profile) return false;
    return profile.total_xp >= section.unlock_requirement_xp;
  };

  const getLessonStatus = (lessonId: string) => {
    return progress[lessonId]?.status || 'locked';
  };

  // Get lesson type information
  const getLessonTypeInfo = (lesson: Lesson) => {
    const type = lesson.lesson_type || 'multiple-choice';
    switch (type) {
      case 'drag-drop':
        return { icon: Code, color: 'text-purple-400', bgColor: 'bg-purple-500', label: 'Drag & Drop' };
      case 'puzzle':
        return { icon: Trophy, color: 'text-warning-400', bgColor: 'bg-warning-500', label: 'Puzzle Game' };
      case 'story':
        return { icon: BookOpen, color: 'text-info-400', bgColor: 'bg-info-500', label: 'Story' };
      case 'code':
        return { icon: Code, color: 'text-primary-400', bgColor: 'bg-primary-500', label: 'Coding' };
      default:
        return { icon: Sparkles, color: 'text-success-400', bgColor: 'bg-success-500', label: 'Traditional' };
    }
  };

  // Filter lessons by type
  const filterLessons = (lessons: Lesson[]) => {
    if (activeFilter === 'all') return lessons;

    return lessons.filter(lesson => {
      const type = lesson.lesson_type || 'multiple-choice';
      switch (activeFilter) {
        case 'traditional':
          return type === 'multiple-choice' || type === null;
        case 'coding':
          return type === 'code';
        case 'drag-drop':
          return type === 'drag-drop';
        case 'puzzle':
          return type === 'puzzle';
        case 'story':
          return type === 'story';
        default:
          return true;
      }
    });
  };

  // Get filter counts
  const getFilterCount = (filterType: string) => {
    let count = 0;
    Object.values(lessons).forEach(sectionLessons => {
      const filtered = filterLessons(sectionLessons.filter(lesson => {
        if (filterType === 'all') return true;
        const type = lesson.lesson_type || 'multiple-choice';
        switch (filterType) {
          case 'traditional':
            return type === 'multiple-choice' || type === null;
          case 'coding':
            return type === 'code';
          case 'drag-drop':
            return type === 'drag-drop';
          case 'puzzle':
            return type === 'puzzle';
          case 'story':
            return type === 'story';
          default:
            return true;
        }
      }));
      count += filtered.length;
    });
    return count;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4 animate-in animate-fade-in">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-400">Loading amazing lessons...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 animate-in animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-red-400 text-lg font-medium mb-2">Unable to load lessons</p>
          <p className="text-slate-400 text-sm mb-4">{error}</p>
          <button
            onClick={loadContent}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 animate-in animate-fade-in">
        <Star className="text-slate-600 animate-pulse" size={64} />
        <p className="text-slate-400 text-lg">No lessons available yet</p>
        <p className="text-slate-500 text-sm">Check back soon for exciting Python content!</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto p-8">
        {/* Enhanced Header */}
        <div className="mb-8 text-center animate-in animate-slide-in">
          <h1 className="text-4xl font-bold text-gradient mb-3 flex items-center justify-center gap-3">
            <BookOpen className="text-primary-400" size={40} />
            Learning Path
          </h1>
          <p className="text-slate-300 text-lg">Complete lessons to earn XP and unlock new content!</p>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 max-w-2xl mx-auto">
            <div className="stat-card text-center">
              <div className="text-2xl font-bold text-primary-400">{sections.length}</div>
              <div className="text-xs text-slate-400">Sections</div>
            </div>
            <div className="stat-card text-center">
              <div className="text-2xl font-bold text-success-400">
                {Object.values(progress).filter(p => p.status === 'completed').length}
              </div>
              <div className="text-xs text-slate-400">Completed</div>
            </div>
            <div className="stat-card text-center">
              <div className="text-2xl font-bold text-warning-400">{profile?.total_xp || 0}</div>
              <div className="text-xs text-slate-400">Total XP</div>
            </div>
            <div className="stat-card text-center">
              <div className="text-2xl font-bold text-info-400">{profile?.current_level || 1}</div>
              <div className="text-xs text-slate-400">Level</div>
            </div>
          </div>
        </div>

        {/* Lesson Type Legend */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm animate-in animate-delay-100">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BookOpen size={16} />
            <span>All ({getFilterCount('all')})</span>
          </button>
          <button
            onClick={() => setActiveFilter('traditional')}
            className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
              activeFilter === 'traditional'
                ? 'bg-green-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className={activeFilter === 'traditional' ? 'text-white' : 'text-success-400'} size={16} />
            <span>Traditional ({getFilterCount('traditional')})</span>
          </button>
          <button
            onClick={() => setActiveFilter('coding')}
            className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
              activeFilter === 'coding'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Code className={activeFilter === 'coding' ? 'text-white' : 'text-primary-400'} size={16} />
            <span>Coding ({getFilterCount('coding')})</span>
          </button>
          <button
            onClick={() => setActiveFilter('drag-drop')}
            className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
              activeFilter === 'drag-drop'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Code className={activeFilter === 'drag-drop' ? 'text-white' : 'text-purple-400'} size={16} />
            <span>Drag & Drop ({getFilterCount('drag-drop')})</span>
          </button>
          <button
            onClick={() => setActiveFilter('puzzle')}
            className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
              activeFilter === 'puzzle'
                ? 'bg-yellow-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Trophy className={activeFilter === 'puzzle' ? 'text-white' : 'text-warning-400'} size={16} />
            <span>Puzzle Game ({getFilterCount('puzzle')})</span>
          </button>
          <button
            onClick={() => setActiveFilter('story')}
            className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
              activeFilter === 'story'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BookOpen className={activeFilter === 'story' ? 'text-white' : 'text-info-400'} size={16} />
            <span>Story ({getFilterCount('story')})</span>
          </button>
        </div>

        <div className="space-y-8">
          {sections.map((section, sectionIndex) => {
            const allSectionLessons = lessons[section.id] || [];
            const sectionLessons = filterLessons(allSectionLessons);
            const isUnlocked = profile && profile.total_xp >= section.unlock_requirement_xp;
            const completedInSection = sectionLessons.filter(lesson => getLessonStatus(lesson.id) === 'completed').length;

            // Skip sections if no lessons match the filter
            if (activeFilter !== 'all' && sectionLessons.length === 0) {
              return null;
            }

            return (
              <div
                key={section.id}
                className={`card-enhanced relative overflow-hidden animate-in animate-delay-${sectionIndex * 100}`}
                style={{ animationDelay: `${sectionIndex * 100}ms` }}
              >
                {/* Background gradient for unlocked sections */}
                {isUnlocked && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-info-500 opacity-5"></div>
                )}

                <div className="relative">
                  {/* Section Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">{section.title}</h3>
                        {isUnlocked && (
                          <span className="badge-primary text-xs">Available</span>
                        )}
                      </div>
                      <p className="text-slate-300 text-lg mb-3">{section.description}</p>

                      {/* Section Progress */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="text-success-400" size={16} />
                          <span className="text-slate-300">
                            {completedInSection} of {sectionLessons.length} completed
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="text-warning-400" size={16} />
                          <span className="text-slate-300">
                            {sectionLessons.reduce((total, lesson) => total + (lesson.estimated_minutes || 10), 0)} min
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {sectionLessons.length > 0 && (
                        <div className="mt-3">
                          <div className="progress-bar h-2">
                            <div
                              className="progress-fill"
                              style={{ width: `${(completedInSection / sectionLessons.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {!isUnlocked && (
                      <div className="flex flex-col items-center text-center p-4 bg-slate-900 bg-opacity-50 rounded-lg border border-slate-700">
                        <Lock className="text-slate-500 mb-2" size={24} />
                        <span className="text-slate-400 text-sm font-medium">
                          {section.unlock_requirement_xp} XP required
                        </span>
                        <span className="text-slate-500 text-xs mt-1">
                          {section.unlock_requirement_xp - (profile?.total_xp || 0)} XP to go
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Lessons Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sectionLessons.map((lesson, lessonIndex) => {
                      const lessonUnlocked = isLessonUnlocked(lesson, section);
                      const status = getLessonStatus(lesson.id);
                      const isCompleted = status === 'completed';
                      const lessonTypeInfo = getLessonTypeInfo(lesson);
                      const Icon = lessonTypeInfo.icon;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => lessonUnlocked && setSelectedLesson(lesson)}
                          disabled={!lessonUnlocked}
                          className={`card-interactive p-5 text-left group ${
                            !lessonUnlocked ? 'opacity-60 cursor-not-allowed' : ''
                          } animate-in animate-delay-${sectionIndex * 100 + lessonIndex * 50}`}
                          style={{ animationDelay: `${sectionIndex * 100 + lessonIndex * 50}ms` }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            {/* Lesson Status Icon */}
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-250 group-hover:scale-110 ${
                                  isCompleted
                                    ? lessonTypeInfo.bgColor
                                    : lessonUnlocked
                                    ? 'bg-slate-700 group-hover:bg-slate-600'
                                    : 'bg-slate-800'
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle size={24} className="text-white animate-pulse" />
                                ) : lessonUnlocked ? (
                                  <Icon size={24} className={`${lessonTypeInfo.color} group-hover:scale-110 transition-transform duration-250`} />
                                ) : (
                                  <Lock size={24} className="text-slate-500" />
                                )}
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-white font-semibold text-lg group-hover:text-primary-400 transition-colors duration-250">
                                    {lesson.title}
                                  </h4>
                                  {isCompleted && (
                                    <span className="badge-success text-xs animate-pulse">Completed</span>
                                  )}
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">{lesson.description}</p>
                              </div>
                            </div>

                            {/* Lesson Type Badge */}
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${lessonTypeInfo.bgColor} ${lessonTypeInfo.color} bg-opacity-20 border ${lessonTypeInfo.color} border-opacity-30`}>
                              <Icon size={12} />
                              {lessonTypeInfo.label}
                            </div>
                          </div>

                          {/* Lesson Details */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                            <div className="flex items-center gap-3 text-sm">
                              <span className={`font-semibold ${lessonTypeInfo.color}`}>+{lesson.xp_reward} XP</span>
                              <div className="flex items-center gap-1 text-slate-400">
                                <Clock size={14} />
                                <span>{lesson.estimated_minutes || 10}m</span>
                              </div>
                              {lesson.difficulty && (
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  lesson.difficulty === 'beginner' ? 'bg-emerald-500 bg-opacity-20 text-emerald-400' :
                                  lesson.difficulty === 'intermediate' ? 'bg-warning-500 bg-opacity-20 text-warning-400' :
                                  lesson.difficulty === 'advanced' ? 'bg-red-500 bg-opacity-20 text-red-400' :
                                  'bg-purple-500 bg-opacity-20 text-purple-400'
                                }`}>
                                  {lesson.difficulty}
                                </span>
                              )}
                            </div>

                            {lessonUnlocked && (
                              <ChevronRight
                                className="text-slate-400 group-hover:text-primary-400 group-hover:translate-x-1 transition-all duration-250"
                                size={20}
                              />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedLesson && (
        <LessonModal
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
          onComplete={loadContent}
        />
      )}
    </>
  );
};
