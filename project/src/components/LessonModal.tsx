import { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, Code, Trophy, BookOpen, Sparkles } from 'lucide-react';
import { Lesson, supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CodeEditor } from './CodeEditor';
import { DragDropLesson } from './DragDropLesson';
import { PuzzleGameLesson } from './PuzzleGameLesson';
import { StoryLesson } from './StoryLesson';
import { ProgressiveHints } from './ui/ProgressiveHints';
import { SkyTips } from './ui/SkyTips';
import { LessonValidation } from './interactive/LessonValidation';

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
  const [revealedHints, setRevealedHints] = useState<number[]>([]);

  // LessonValidation integration state
  const [validationProgress, setValidationProgress] = useState(0);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [validationInstance, setValidationInstance] = useState<any>(null);

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
      // Check if user has written meaningful code
      const hasMeaningfulCode = userCode.trim().length > 5 && !userCode.trim().startsWith('#');
      setFeedback({
        correct: hasMeaningfulCode,
        message: hasMeaningfulCode ? 'Great coding! 💻 Your solution looks good!' : 'Please write some meaningful code',
      });

      if (hasMeaningfulCode) {
        setTimeout(() => {
          handleNext();
        }, 1500);
      }
    }
  };

  const handleHintRevealed = (hintIndex: number) => {
    setRevealedHints(prev => [...prev, hintIndex]);
  };

  const calculateFinalXP = () => {
    if (revealedHints.length === 0) return lesson.xp_reward;

    const penalties = [0, 10, 25, 50]; // 0%, 10%, 25%, 50%
    const penalty = penalties[Math.min(revealedHints.length, 3)] || 50;
    return Math.round(lesson.xp_reward * (1 - penalty / 100));
  };

  const handleNext = () => {
    if (isLastStep) {
      completeLesson();
    } else {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer('');
      setUserCode('');
      setFeedback(null);
      setRevealedHints([]);
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

      const finalXP = calculateFinalXP();
      await supabase
        .from('profiles')
        .update({
          total_xp: profile.total_xp + finalXP,
          current_level: Math.floor((profile.total_xp + finalXP) / 100) + 1,
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

  // LessonValidation integration handlers
  const handleValidationComplete = (score: number, timeSpent: number) => {
    setLessonCompleted(true);
    setShowCelebration(true);
    setIsCompleting(true);

    // Calculate XP based on score
    const xpEarned = Math.round((score / 100) * lesson.xp_reward);

    setTimeout(() => {
      onComplete();
      onClose();
    }, 2000);
  };

  const handleValidationProgress = (progress: number) => {
    setValidationProgress(progress);
  };

  // Enhanced answer check using LessonValidation for traditional lessons
  const handleEnhancedCheckAnswer = async () => {
    if (!validationInstance) return;

    let userInput;

    if (currentContent.type === 'multiple-choice') {
      userInput = { question_0: selectedAnswer };
    } else if (currentContent.type === 'code') {
      userInput = userCode;
    }

    try {
      const result = await validationInstance.validateAnswer(userInput);

      setFeedback({
        correct: result.isCorrect,
        message: result.feedback,
      });

      if (result.isCorrect) {
        setTimeout(() => {
          handleNext();
        }, 1500);
      }
    } catch (error) {
      console.error('Error validating answer:', error);
      setFeedback({
        correct: false,
        message: 'Error validating your answer. Please try again.',
      });
    }
  };

  // Initialize validation instance when lesson or step changes
  useEffect(() => {
    // Reset validation state for new step
    setFeedback(null);
    setSelectedAnswer('');
    setUserCode('');
    setRevealedHints([]);
    setValidationInstance(null);
  }, [currentStep, lesson.id]);

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

  // Traditional lesson modal (multiple-choice and code) with LessonValidation integration
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in animate-scale-in">
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
              <p className="text-slate-300 text-lg">You earned {calculateFinalXP()} XP</p>
              {revealedHints.length > 0 && (
                <p className="text-slate-400 text-sm">(-{(100 - (calculateFinalXP() / lesson.xp_reward) * 100).toFixed(0)}% from hints)</p>
              )}
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="mb-6">
            <p className="text-white text-lg leading-relaxed animate-in animate-slide-in">{currentContent.question}</p>
          </div>

          <div className="space-y-6">
            {/* Multiple Choice Questions */}
            {currentContent.type === 'multiple-choice' && currentContent.options && (
              <div className="space-y-3">
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
                    disabled={lessonCompleted}
                  >
                    <span className="font-medium">Option {String.fromCharCode(65 + index)}:</span> {option}
                  </button>
                ))}
              </div>
            )}

            {/* Code Editor */}
            {currentContent.type === 'code' && (
              <div className="space-y-4">
                <CodeEditor
                  value={userCode}
                  onChange={setUserCode}
                  initialCode={currentContent.starterCode || currentContent.code || '# Write your code here\n'}
                  disabled={lessonCompleted}
                />

                {/* Enhanced Hints System */}
                {currentContent.hints && currentContent.hints.length > 0 && (
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-yellow-500/20 rounded">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"/>
                          </svg>
                        </div>
                        <span className="text-white font-medium">Hints Available</span>
                        <span className="text-slate-400 text-sm">
                          ({revealedHints.length}/{currentContent.hints.length} used)
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (revealedHints.length < currentContent.hints.length) {
                            setRevealedHints(prev => [...prev, prev.length]);
                          }
                        }}
                        disabled={revealedHints.length >= currentContent.hints.length || lessonCompleted}
                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-600 text-white text-sm rounded-md transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"/>
                        </svg>
                        {revealedHints.length >= currentContent.hints.length ? 'All Hints Used' : 'Show Hint'}
                      </button>
                    </div>

                    {/* Display revealed hints */}
                    {revealedHints.map((hintIndex, arrayIndex) => (
                      <div key={arrayIndex} className="mb-2 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-md">
                        <p className="text-yellow-300 text-sm">
                          <span className="font-semibold">Hint {hintIndex + 1}:</span> {currentContent.hints[hintIndex]}
                        </p>
                      </div>
                    ))}

                    {/* XP penalty warning */}
                    {revealedHints.length > 0 && (
                      <div className="mt-2 text-xs text-slate-400">
                        XP penalties applied: {revealedHints.length === 1 ? '10%' : revealedHints.length === 2 ? '25%' : '50%'}
                      </div>
                    )}
                  </div>
                )}

                {currentContent.solution && (
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <p className="text-slate-400 text-sm mb-1">Hint: Compare your solution with this approach:</p>
                    <pre className="text-xs text-slate-300 overflow-x-auto">{currentContent.solution}</pre>
                  </div>
                )}
              </div>
            )}

            {/* Validation Feedback */}
            {feedback && (
              <div
                className={`flex items-center gap-3 p-4 rounded-lg animate-in animate-scale-in ${
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

            {/* Enhanced Action Buttons */}
            <div className="flex gap-3">
              {!feedback && !lessonCompleted && (
                <button
                  onClick={handleEnhancedCheckAnswer}
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
    </div>
  );
};
