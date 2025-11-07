import { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, Code, Trophy, BookOpen, Sparkles } from 'lucide-react';
import { Lesson, supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CodeEditor } from './CodeEditor';
import { DragDropLesson } from './DragDropLesson';
import { PuzzleGameLesson } from './PuzzleGameLesson';
import { StoryLesson } from './StoryLesson';

type LessonModalProps = {
  lesson: Lesson;
  onClose: () => void;
  onComplete: () => void;
};

export const LessonModal = ({ lesson, onClose, onComplete }: LessonModalProps) => {
  const { profile, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [startTime] = useState(Date.now());

  const currentContent = lesson.content[currentStep];
  const isLastStep = currentStep === lesson.content.length - 1;

  // Get lesson type from database or content
  const lessonType = lesson.lesson_type || 'multiple-choice';

  const handleCheckAnswer = () => {
    if (currentContent.type === 'multiple-choice' && currentContent.correctAnswer) {
      const isCorrect = selectedAnswer === currentContent.correctAnswer;
      setFeedback({
        correct: isCorrect,
        message: isCorrect ? 'Excellent work! 🎉' : 'Not quite right. Try again!',
      });

      if (isCorrect) {
        setTimeout(() => {
          handleNext();
        }, 1500);
      }
    } else if (currentContent.type === 'code') {
      const isCorrect = userCode.trim().length > 0;
      setFeedback({
        correct: isCorrect,
        message: isCorrect ? 'Great coding! 💻' : 'Please write some code',
      });

      if (isCorrect) {
        setTimeout(() => {
          handleNext();
        }, 1500);
      }
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      completeLesson();
    } else {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer('');
      setUserCode('');
      setFeedback(null);
    }
  };

  const completeLesson = async () => {
    if (!profile) return;

    setIsCompleting(true);
    setShowCelebration(true);

    try {
      const { data: existingProgress } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', profile.id)
        .eq('lesson_id', lesson.id)
        .maybeSingle();

      if (existingProgress) {
        await supabase
          .from('user_lesson_progress')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            attempts: existingProgress.attempts + 1,
          })
          .eq('id', existingProgress.id);
      } else {
        await supabase.from('user_lesson_progress').insert({
          user_id: profile.id,
          lesson_id: lesson.id,
          status: 'completed',
          completed_at: new Date().toISOString(),
          attempts: 1,
        });
      }

      await supabase
        .from('profiles')
        .update({
          total_xp: profile.total_xp + lesson.xp_reward,
          current_level: Math.floor((profile.total_xp + lesson.xp_reward) / 100) + 1,
        })
        .eq('id', profile.id);

      await refreshProfile();

      setTimeout(() => {
        onComplete();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error completing lesson:', error);
    } finally {
      setTimeout(() => {
        setIsCompleting(false);
        setShowCelebration(false);
      }, 2000);
    }
  };

  // Handle lesson type-specific completion
  const handleLessonComplete = (success: boolean, additionalData: any = {}) => {
    if (success) {
      setShowCelebration(true);
      completeLesson();
    }
  };

  // Get lesson type icon and color
  const getLessonTypeInfo = (type: string) => {
    switch (type) {
      case 'drag-drop':
        return { icon: Code, color: 'text-purple-400', label: 'Drag & Drop' };
      case 'puzzle':
        return { icon: Trophy, color: 'text-warning-400', label: 'Puzzle Game' };
      case 'story':
        return { icon: BookOpen, color: 'text-info-400', label: 'Story Lesson' };
      case 'code':
        return { icon: Code, color: 'text-primary-400', label: 'Coding' };
      default:
        return { icon: Sparkles, color: 'text-success-400', label: 'Lesson' };
    }
  };

  const lessonTypeInfo = getLessonTypeInfo(lessonType);

  // Render different lesson types
  if (lessonType === 'drag-drop' && lesson.drag_drop_data) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="glass rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto animate-in animate-scale-in">
          <div className="sticky top-0 glass border-b border-slate-700 p-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-slate-700 rounded-lg ${lessonTypeInfo.color}`}>
                <lessonTypeInfo.icon size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{lesson.title}</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`${lessonTypeInfo.color} font-medium`}>{lessonTypeInfo.label}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-400">{lesson.xp_reward} XP</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors btn-enhanced p-2 rounded-lg hover:bg-slate-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            <DragDropLesson
              title={lesson.title}
              description={lesson.description}
              instructions={lesson.drag_drop_data.instructions || lesson.description}
              initialCode={lesson.drag_drop_data.code_blocks || []}
              correctOrder={lesson.drag_drop_data.correct_order || []}
              hints={lesson.drag_drop_data.hints || []}
              onLessonComplete={handleLessonComplete}
            />
          </div>
        </div>
      </div>
    );
  }

  if (lessonType === 'puzzle' && lesson.game_data) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="glass rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto animate-in animate-scale-in">
          <div className="sticky top-0 glass border-b border-slate-700 p-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-slate-700 rounded-lg ${lessonTypeInfo.color}`}>
                <lessonTypeInfo.icon size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{lesson.title}</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`${lessonTypeInfo.color} font-medium`}>{lessonTypeInfo.label}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-400">{lesson.xp_reward} XP</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors btn-enhanced p-2 rounded-lg hover:bg-slate-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            <PuzzleGameLesson
              title={lesson.title}
              description={lesson.description}
              questions={lesson.game_data.questions || []}
              timeBonus={lesson.game_data.time_bonus || 50}
              streakMultiplier={lesson.game_data.streak_multiplier || 10}
              onLessonComplete={handleLessonComplete}
            />
          </div>
        </div>
      </div>
    );
  }

  if (lessonType === 'story' && lesson.story_data) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="glass rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto animate-in animate-scale-in">
          <div className="sticky top-0 glass border-b border-slate-700 p-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-slate-700 rounded-lg ${lessonTypeInfo.color}`}>
                <lessonTypeInfo.icon size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{lesson.title}</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`${lessonTypeInfo.color} font-medium`}>{lessonTypeInfo.label}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-400">{lesson.xp_reward} XP</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors btn-enhanced p-2 rounded-lg hover:bg-slate-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            <StoryLesson
              title={lesson.title}
              description={lesson.description}
              setting={lesson.story_data.setting || 'Python World'}
              protagonist={lesson.story_data.protagonist || { name: 'Student', avatar: '👨‍💻', role: 'Python Learner', personality: 'Eager to learn' }}
              chapters={lesson.story_data.chapters || []}
              onLessonComplete={handleLessonComplete}
            />
          </div>
        </div>
      </div>
    );
  }

  // Traditional lesson modal (multiple-choice and code)
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in animate-scale-in">
        {/* Header with enhanced styling */}
        <div className="sticky top-0 glass border-b border-slate-700 p-6 flex items-center justify-between z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 bg-slate-700 rounded-lg ${lessonTypeInfo.color}`}>
                <lessonTypeInfo.icon size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gradient">{lesson.title}</h2>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className={`${lessonTypeInfo.color} font-medium`}>{lessonTypeInfo.label}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-400">Step {currentStep + 1} of {lesson.content.length}</span>
              <span className="text-slate-400">•</span>
              <span className="text-warning-400 font-medium">{lesson.xp_reward} XP</span>
            </div>
            <div className="mt-3">
              <div className="progress-bar h-3">
                <div
                  className="progress-fill transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / lesson.content.length) * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors btn-enhanced p-2 rounded-lg hover:bg-slate-700 ml-4"
          >
            <X size={24} />
          </button>
        </div>

        {/* Celebration overlay */}
        {showCelebration && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-slate-800 bg-opacity-90 rounded-2xl">
            <div className="text-center animate-bounce-gentle">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-gradient mb-2">Lesson Complete!</h3>
              <p className="text-slate-300 text-lg">You earned {lesson.xp_reward} XP</p>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="mb-6">
            <p className="text-white text-lg leading-relaxed animate-in animate-slide-in">{currentContent.question}</p>
          </div>

          {currentContent.type === 'multiple-choice' && currentContent.options && (
            <div className="space-y-3 mb-6">
              {currentContent.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all btn-enhanced ${
                    selectedAnswer === option
                      ? 'border-primary-500 bg-primary-500 bg-opacity-20 text-primary-400'
                      : 'border-slate-600 bg-slate-700 hover:border-slate-500 text-slate-300 hover:bg-slate-600'
                  } animate-in animate-delay-${index * 100}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="font-medium">Option {String.fromCharCode(65 + index)}:</span> {option}
                </button>
              ))}
            </div>
          )}

          {currentContent.type === 'code' && (
            <div className="mb-6">
              <CodeEditor
                value={userCode}
                onChange={setUserCode}
                initialCode={currentContent.code || '# Write your code here\n'}
              />
            </div>
          )}

          {feedback && (
            <div
              className={`flex items-center gap-3 p-4 rounded-lg mb-6 animate-in animate-scale-in ${
                feedback.correct
                  ? 'bg-success-500 bg-opacity-10 border border-success-500 border-opacity-30'
                  : 'bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30'
              }`}
            >
              {feedback.correct ? (
                <CheckCircle className="text-success-400 animate-pulse" size={24} />
              ) : (
                <XCircle className="text-red-400 animate-shake" size={24} />
              )}
              <span
                className={`font-semibold ${
                  feedback.correct ? 'text-success-400' : 'text-red-400'
                }`}
              >
                {feedback.message}
              </span>
            </div>
          )}

          <div className="flex gap-3">
            {!feedback && (
              <button
                onClick={handleCheckAnswer}
                disabled={
                  (currentContent.type === 'multiple-choice' && !selectedAnswer) ||
                  (currentContent.type === 'code' && !userCode.trim())
                }
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Check Answer
              </button>
            )}

            {feedback && feedback.correct && (
              <button
                onClick={handleNext}
                disabled={isCompleting}
                className="flex-1 btn-success disabled:opacity-50"
              >
                {isCompleting ? 'Completing...' : isLastStep ? 'Complete Lesson' : 'Next Step'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
