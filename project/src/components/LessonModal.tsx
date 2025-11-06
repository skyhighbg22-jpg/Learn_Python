import { useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { Lesson, supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CodeEditor } from './CodeEditor';

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

  const currentContent = lesson.content[currentStep];
  const isLastStep = currentStep === lesson.content.length - 1;

  const handleCheckAnswer = () => {
    if (currentContent.type === 'multiple-choice' && currentContent.correctAnswer) {
      const isCorrect = selectedAnswer === currentContent.correctAnswer;
      setFeedback({
        correct: isCorrect,
        message: isCorrect ? 'Great job!' : 'Not quite. Try again!',
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
        message: isCorrect ? 'Code looks good!' : 'Please write some code',
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
      onComplete();
      onClose();
    } catch (error) {
      console.error('Error completing lesson:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between z-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">{lesson.title}</h2>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-400">
                Step {currentStep + 1} of {lesson.content.length}
              </span>
              <div className="flex-1 bg-slate-700 rounded-full h-2 max-w-xs">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${((currentStep + 1) / lesson.content.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-white text-lg leading-relaxed">{currentContent.question}</p>
          </div>

          {currentContent.type === 'multiple-choice' && currentContent.options && (
            <div className="space-y-3 mb-6">
              {currentContent.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === option
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-slate-700 bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  <span className="text-white">{option}</span>
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
              className={`flex items-center gap-3 p-4 rounded-lg mb-6 ${
                feedback.correct
                  ? 'bg-green-900/20 border border-green-700'
                  : 'bg-red-900/20 border border-red-700'
              }`}
            >
              {feedback.correct ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <XCircle className="text-red-500" size={24} />
              )}
              <span
                className={`font-semibold ${
                  feedback.correct ? 'text-green-400' : 'text-red-400'
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
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Check Answer
              </button>
            )}

            {feedback && feedback.correct && (
              <button
                onClick={handleNext}
                disabled={isCompleting}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {isCompleting ? 'Completing...' : isLastStep ? 'Complete Lesson' : 'Next'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
