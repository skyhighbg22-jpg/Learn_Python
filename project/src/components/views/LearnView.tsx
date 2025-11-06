import { useEffect, useState } from 'react';
import { ChevronRight, Lock, CheckCircle, Play, Star } from 'lucide-react';
import { supabase, Section, Lesson } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { LessonModal } from '../LessonModal';

export const LearnView = () => {
  const { profile } = useAuth();
  const [sections, setSections] = useState<Section[]>([]);
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({});
  const [progress, setProgress] = useState<Record<string, any>>({});
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data: sectionsData } = await supabase
      .from('sections')
      .select('*')
      .order('order_index');

    if (sectionsData) {
      setSections(sectionsData);

      const lessonsMap: Record<string, Lesson[]> = {};
      for (const section of sectionsData) {
        const { data: lessonsData } = await supabase
          .from('lessons')
          .select('*')
          .eq('section_id', section.id)
          .order('order_index');

        if (lessonsData) {
          lessonsMap[section.id] = lessonsData;
        }
      }
      setLessons(lessonsMap);

      if (profile) {
        const { data: progressData } = await supabase
          .from('user_lesson_progress')
          .select('*')
          .eq('user_id', profile.id);

        if (progressData) {
          const progressMap = progressData.reduce((acc, p) => {
            acc[p.lesson_id] = p;
            return acc;
          }, {} as Record<string, any>);
          setProgress(progressMap);
        }
      }
    }

    setLoading(false);
  };

  const isLessonUnlocked = (lesson: Lesson, section: Section) => {
    if (!profile) return false;
    return profile.total_xp >= section.unlock_requirement_xp;
  };

  const getLessonStatus = (lessonId: string) => {
    return progress[lessonId]?.status || 'locked';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading lessons...</div>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Star className="text-slate-600" size={64} />
        <p className="text-slate-400 text-lg">No lessons available yet</p>
        <p className="text-slate-500 text-sm">Check back soon for exciting Python content!</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Learning Path</h2>
          <p className="text-slate-400">Complete lessons to earn XP and level up!</p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => {
            const sectionLessons = lessons[section.id] || [];
            const isUnlocked = profile && profile.total_xp >= section.unlock_requirement_xp;

            return (
              <div
                key={section.id}
                className={`bg-slate-800 rounded-xl p-6 border ${
                  isUnlocked ? 'border-slate-700' : 'border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{section.title}</h3>
                    <p className="text-slate-400 text-sm">{section.description}</p>
                  </div>
                  {!isUnlocked && (
                    <div className="flex items-center gap-2 text-slate-500">
                      <Lock size={18} />
                      <span className="text-sm">{section.unlock_requirement_xp} XP required</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {sectionLessons.map((lesson, index) => {
                    const lessonUnlocked = isLessonUnlocked(lesson, section);
                    const status = getLessonStatus(lesson.id);
                    const isCompleted = status === 'completed';

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => lessonUnlocked && setSelectedLesson(lesson)}
                        disabled={!lessonUnlocked}
                        className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${
                          lessonUnlocked
                            ? isCompleted
                              ? 'bg-green-900/20 border border-green-700 hover:bg-green-900/30'
                              : 'bg-slate-700 hover:bg-slate-600'
                            : 'bg-slate-900/50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isCompleted
                                ? 'bg-green-500'
                                : lessonUnlocked
                                ? 'bg-blue-500'
                                : 'bg-slate-700'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle size={20} className="text-white" />
                            ) : lessonUnlocked ? (
                              <Play size={20} className="text-white" />
                            ) : (
                              <Lock size={20} className="text-slate-500" />
                            )}
                          </div>
                          <div className="text-left">
                            <h4 className="text-white font-semibold">{lesson.title}</h4>
                            <p className="text-slate-400 text-sm">{lesson.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-yellow-500 font-semibold">+{lesson.xp_reward} XP</span>
                          {lessonUnlocked && <ChevronRight className="text-slate-400" size={20} />}
                        </div>
                      </button>
                    );
                  })}
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
