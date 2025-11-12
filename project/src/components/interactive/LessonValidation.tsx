import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Lightbulb, Zap, Award, Clock } from 'lucide-react';
import { codeExecutionService } from '../../services/codeExecutionService';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications, createNotificationTypes } from '../../contexts/NotificationContext';

interface ValidationProps {
  lessonId: string;
  lessonType: 'drag_drop' | 'puzzle' | 'story' | 'multiple_choice' | 'code';
  lessonData: any;
  onComplete: (score: number, timeSpent: number) => void;
  onProgress: (progress: number) => void;
}

interface ValidationState {
  isCorrect: boolean | null;
  feedback: string;
  score: number;
  attempts: number;
  hintsUsed: number;
  startTime: number;
  timeSpent: number;
  showHint: boolean;
  currentHint: string;
  validating: boolean;
}

interface ValidationResult {
  isCorrect: boolean;
  feedback: string;
  score: number;
  hints: string[];
  completionTime: number;
}

export const LessonValidation: React.FC<ValidationProps> = ({
  lessonId,
  lessonType,
  lessonData,
  onComplete,
  onProgress
}) => {
  const { user, profile } = useAuth();
  const { addNotification } = useNotifications();

  const [validationState, setValidationState] = useState<ValidationState>({
    isCorrect: null,
    feedback: '',
    score: 0,
    attempts: 0,
    hintsUsed: 0,
    startTime: Date.now(),
    timeSpent: 0,
    showHint: false,
    currentHint: '',
    validating: false
  });

  const [hints, setHints] = useState<string[]>([]);

  // Update time spent
  useEffect(() => {
    const timer = setInterval(() => {
      setValidationState(prev => ({
        ...prev,
        timeSpent: Math.floor((Date.now() - prev.startTime) / 1000)
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Extract hints based on lesson type
  useEffect(() => {
    let lessonHints: string[] = [];

    switch (lessonType) {
      case 'drag_drop':
        lessonHints = lessonData?.drag_drop_data?.hints || [];
        break;
      case 'puzzle':
        lessonHints = lessonData?.game_data?.hints || [];
        break;
      case 'story':
        lessonHints = lessonData?.story_data?.hints || [];
        break;
      case 'code':
        lessonHints = lessonData?.hints || [];
        break;
      case 'multiple_choice':
        lessonHints = lessonData?.hints || [];
        break;
    }

    setHints(lessonHints);
  }, [lessonData, lessonType]);

  // Show next hint
  const showNextHint = useCallback(() => {
    if (hints.length > validationState.hintsUsed) {
      const nextHint = hints[validationState.hintsUsed];
      setValidationState(prev => ({
        ...prev,
        showHint: true,
        currentHint: nextHint,
        hintsUsed: prev.hintsUsed + 1
      }));

      // Track hint usage in analytics
      trackHintUsage();
    }
  }, [hints, validationState.hintsUsed]);

  const trackHintUsage = async () => {
    if (!user?.id) return;

    try {
      await supabase.rpc('track_lesson_hint', {
        p_lesson_id: lessonId,
        p_user_id: user.id,
        p_hint_number: validationState.hintsUsed + 1
      });
    } catch (error) {
      console.error('Error tracking hint usage:', error);
    }
  };

  // Validate drag and drop lesson
  const validateDragDrop = useCallback((userOrder: string[]): ValidationResult => {
    const correctOrder = lessonData?.drag_drop_data?.correct_order || [];
    const codeBlocks = lessonData?.drag_drop_data?.code_blocks || [];

    const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
    const score = calculateScore(isCorrect, validationState.attempts, validationState.hintsUsed);

    let feedback = '';
    if (!isCorrect) {
      // Find first incorrect position
      const firstError = userOrder.findIndex((block, index) => block !== correctOrder[index]);
      if (firstError !== -1) {
        const expectedBlock = codeBlocks.find(block => block.id === correctOrder[firstError]);
        const actualBlock = codeBlocks.find(block => block.id === userOrder[firstError]);
        feedback = `Not quite right. The block at position ${firstError + 1} is incorrect. `;

        if (expectedBlock && actualBlock) {
          feedback += `Expected: "${expectedBlock.code.substring(0, 50)}..."`;
        }
      }
    } else {
      feedback = 'Perfect! You arranged the code blocks in the correct order.';
    }

    return {
      isCorrect,
      feedback,
      score,
      hints,
      completionTime: validationState.timeSpent
    };
  }, [lessonData, validationState.attempts, validationState.hintsUsed, hints, validationState.timeSpent]);

  // Validate puzzle game
  const validatePuzzle = useCallback((answers: Record<string, any>): ValidationResult => {
    const questions = lessonData?.game_data?.questions || [];
    let correctCount = 0;

    questions.forEach((question: any, index: number) => {
      const userAnswer = answers[`question_${index}`];
      if (userAnswer === question.correct_answer) {
        correctCount++;
      }
    });

    const isCorrect = correctCount === questions.length;
    const score = Math.round((correctCount / questions.length) * 100);

    let feedback = '';
    if (isCorrect) {
      feedback = 'Excellent! You answered all questions correctly.';
    } else {
      feedback = `You got ${correctCount} out of ${questions.length} questions correct. `;
      feedback += 'Review the questions you missed and try again!';
    }

    return {
      isCorrect,
      feedback,
      score,
      hints,
      completionTime: validationState.timeSpent
    };
  }, [lessonData, hints, validationState.timeSpent]);

  // Validate story lesson
  const validateStory = useCallback((choices: string[]): ValidationResult => {
    const challenges = lessonData?.story_data?.challenges || [];
    let correctCount = 0;

    challenges.forEach((challenge: any, index: number) => {
      const userChoice = choices[index];
      if (userChoice === challenge.correct_choice) {
        correctCount++;
      }
    });

    const isCorrect = correctCount === challenges.length;
    const score = Math.round((correctCount / challenges.length) * 100);

    let feedback = '';
    if (isCorrect) {
      feedback = 'Amazing! You made all the right choices in the story.';
    } else {
      feedback = `You made ${correctCount} correct choices out of ${challenges.length}. `;
      feedback += 'Think about the Python concepts involved and try again!';
    }

    return {
      isCorrect,
      feedback,
      score,
      hints,
      completionTime: validationState.timeSpent
    };
  }, [lessonData, hints, validationState.timeSpent]);

  // Validate multiple choice
  const validateMultipleChoice = useCallback((selectedAnswers: Record<string, string>): ValidationResult => {
    const questions = lessonData?.questions || [];
    let correctCount = 0;

    questions.forEach((question: any, index: number) => {
      const userAnswer = selectedAnswers[`question_${index}`];
      if (userAnswer === question.correct_answer) {
        correctCount++;
      }
    });

    const isCorrect = correctCount === questions.length;
    const score = Math.round((correctCount / questions.length) * 100);

    let feedback = '';
    if (isCorrect) {
      feedback = 'Perfect! All answers are correct.';
    } else {
      feedback = `You got ${correctCount} out of ${questions.length} correct. `;
      feedback += 'Review the explanations for the questions you missed.';
    }

    return {
      isCorrect,
      feedback,
      score,
      hints,
      completionTime: validationState.timeSpent
    };
  }, [lessonData, hints, validationState.timeSpent]);

  // Validate code lesson
  const validateCode = useCallback(async (userCode: string, testCases?: any[]): Promise<ValidationResult> => {
    setValidationState(prev => ({ ...prev, validating: true }));

    try {
      const expectedOutput = lessonData?.expected_output;
      const codeTestCases = testCases || lessonData?.test_cases || [];

      // Execute code with test cases
      const result = await codeExecutionService.executeCode(userCode, codeTestCases);

      let isCorrect = false;
      let feedback = '';

      if (result.success) {
        // Check if output matches expected
        if (expectedOutput) {
          isCorrect = result.output.trim() === expectedOutput.trim();
          if (isCorrect) {
            feedback = 'Excellent! Your code produces the expected output.';
          } else {
            feedback = `Your code output is incorrect. Expected: "${expectedOutput}", Got: "${result.output}"`;
          }
        } else if (result.allTestsPassed) {
          isCorrect = true;
          feedback = 'Great job! All test cases passed.';
        } else {
          feedback = `Some test cases failed. ${result.failedTests || 0} out of ${result.totalTests || 0} passed.`;
        }
      } else {
        feedback = `Error in your code: ${result.error}`;
      }

      const score = isCorrect ? calculateScore(true, validationState.attempts, validationState.hintsUsed) : 0;

      return {
        isCorrect,
        feedback,
        score,
        hints,
        completionTime: validationState.timeSpent
      };

    } catch (error) {
      return {
        isCorrect: false,
        feedback: `Error executing code: ${error.message}`,
        score: 0,
        hints,
        completionTime: validationState.timeSpent
      };
    } finally {
      setValidationState(prev => ({ ...prev, validating: false }));
    }
  }, [lessonData, validationState.attempts, validationState.hintsUsed, hints, validationState.timeSpent]);

  // Calculate score based on performance
  const calculateScore = (isCorrect: boolean, attempts: number, hintsUsed: number): number => {
    if (!isCorrect) return 0;

    let score = 100;

    // Deduct points for hints
    score -= hintsUsed * 5;

    // Deduct points for multiple attempts
    if (attempts > 1) {
      score -= (attempts - 1) * 10;
    }

    // Bonus for speed (if completed in under 2 minutes)
    if (validationState.timeSpent < 120) {
      score += 10;
    }

    return Math.max(score, 0);
  };

  // Handle validation based on lesson type
  const validateAnswer = useCallback(async (userInput: any): Promise<ValidationResult> => {
    setValidationState(prev => ({
      ...prev,
      attempts: prev.attempts + 1
    }));

    let result: ValidationResult;

    switch (lessonType) {
      case 'drag_drop':
        result = validateDragDrop(userInput);
        break;
      case 'puzzle':
        result = validatePuzzle(userInput);
        break;
      case 'story':
        result = validateStory(userInput);
        break;
      case 'multiple_choice':
        result = validateMultipleChoice(userInput);
        break;
      case 'code':
        result = await validateCode(userInput);
        break;
      default:
        result = {
          isCorrect: false,
          feedback: 'Unknown lesson type',
          score: 0,
          hints: [],
          completionTime: validationState.timeSpent
        };
    }

    setValidationState(prev => ({
      ...prev,
      isCorrect: result.isCorrect,
      feedback: result.feedback,
      score: result.score
    }));

    // Update progress
    const progress = result.isCorrect ? 100 : (result.score / 100) * 80;
    onProgress(progress);

    // Handle completion
    if (result.isCorrect) {
      await handleLessonCompletion(result);
    }

    return result;
  }, [lessonType, validateDragDrop, validatePuzzle, validateStory, validateMultipleChoice, validateCode, onProgress, validationState.timeSpent]);

  // Handle lesson completion
  const handleLessonCompletion = async (result: ValidationResult) => {
    if (!user?.id || !profile) return;

    try {
      // Update lesson progress in database
      const { error: progressError } = await supabase.rpc('complete_lesson', {
        p_user_id: user.id,
        p_lesson_id: lessonId,
        p_score: result.score,
        p_completion_time: result.completionTime,
        p_attempts: validationState.attempts,
        p_hints_used: validationState.hintsUsed
      });

      if (progressError) {
        console.error('Error updating lesson progress:', progressError);
      }

      // Calculate XP earned
      const xpEarned = Math.round((result.score / 100) * (lessonData?.xp_reward || 50));

      // Update user XP and streak
      const { error: xpError } = await supabase.rpc('award_lesson_xp', {
        p_user_id: user.id,
        p_xp_amount: xpEarned,
        p_lesson_type: lessonType
      });

      if (xpError) {
        console.error('Error awarding XP:', xpError);
      }

      // Create notification
      addNotification(createNotificationTypes.lessonCompleted(
        lessonData?.title || 'Lesson',
        result.score,
        xpEarned
      ));

      // Check for achievements
      await checkLessonAchievements(result.score, result.completionTime);

      // Call completion callback
      onComplete(result.score, result.completionTime);

    } catch (error) {
      console.error('Error handling lesson completion:', error);
    }
  };

  // Check for lesson-related achievements
  const checkLessonAchievements = async (score: number, completionTime: number) => {
    if (!user?.id) return;

    try {
      // Perfect score achievement
      if (score === 100) {
        const { error } = await supabase.rpc('check_and_unlock_achievement', {
          p_user_id: user.id,
          p_achievement_id: 'perfect_score',
          p_progress: 1
        });

        if (error) {
          console.error('Error checking perfect score achievement:', error);
        }
      }

      // Speed achievement
      if (completionTime < 60) {
        const { error } = await supabase.rpc('check_and_unlock_achievement', {
          p_user_id: user.id,
          p_achievement_id: 'speed_learner',
          p_progress: 1
        });

        if (error) {
          console.error('Error checking speed achievement:', error);
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  // Reset validation state
  const resetValidation = () => {
    setValidationState(prev => ({
      ...prev,
      isCorrect: null,
      feedback: '',
      score: 0,
      attempts: 0,
      startTime: Date.now(),
      timeSpent: 0,
      showHint: false,
      currentHint: '',
      validating: false
    }));
  };

  return {
    validationState,
    validateAnswer,
    showNextHint,
    resetValidation,
    canShowHint: hints.length > validationState.hintsUsed,
    renderValidationUI: () => (
      <div className="space-y-4">
        {/* Validation Feedback */}
        {validationState.isCorrect !== null && (
          <div className={`p-4 rounded-lg border ${
            validationState.isCorrect
              ? 'bg-green-900/20 border-green-700 text-green-400'
              : 'bg-red-900/20 border-red-700 text-red-400'
          }`}>
            <div className="flex items-start gap-3">
              {validationState.isCorrect ? (
                <CheckCircle className="mt-0.5 flex-shrink-0" size={20} />
              ) : (
                <XCircle className="mt-0.5 flex-shrink-0" size={20} />
              )}
              <div>
                <p className="font-semibold">
                  {validationState.isCorrect ? 'Correct!' : 'Not quite right'}
                </p>
                <p className="text-sm mt-1 opacity-90">{validationState.feedback}</p>
              </div>
            </div>
          </div>
        )}

        {/* Score and Stats */}
        {(validationState.isCorrect !== null || validationState.attempts > 0) && (
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-blue-400 font-semibold text-lg">
                  {validationState.score}%
                </div>
                <div className="text-slate-400">Score</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-semibold text-lg">
                  {validationState.attempts}
                </div>
                <div className="text-slate-400">Attempts</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-semibold text-lg">
                  {Math.floor(validationState.timeSpent / 60)}:{(validationState.timeSpent % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-slate-400">Time</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-semibold text-lg">
                  {validationState.hintsUsed}
                </div>
                <div className="text-slate-400">Hints Used</div>
              </div>
            </div>
          </div>
        )}

        {/* Hint Section */}
        {hints.length > 0 && (
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="text-yellow-400" size={18} />
                <span className="text-white font-medium">Hints</span>
                <span className="text-slate-400 text-sm">
                  ({validationState.hintsUsed}/{hints.length} used)
                </span>
              </div>
              <button
                onClick={showNextHint}
                disabled={!canShowHint || validationState.isCorrect === true}
                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-600 text-white text-sm rounded-md transition-colors flex items-center gap-1"
              >
                <Lightbulb size={14} />
                Show Hint
              </button>
            </div>

            {validationState.showHint && (
              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-md p-3">
                <p className="text-yellow-300 text-sm">{validationState.currentHint}</p>
              </div>
            )}
          </div>
        )}

        {/* Loading indicator for code validation */}
        {validationState.validating && (
          <div className="flex items-center gap-3 text-blue-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            <span>Validating your code...</span>
          </div>
        )}
      </div>
    )
  };
};

export default LessonValidation;