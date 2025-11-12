import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Lightbulb, RefreshCw } from 'lucide-react';
import CodeExecutionService from '../../services/codeExecutionService';
import { useNotifications } from '../../contexts/NotificationContext';

interface ValidationResult {
  isCorrect: boolean;
  feedback: string;
  hints: string[];
  score: number;
  nextHintIndex: number;
}

interface LessonValidationProps {
  lessonType: 'drag-drop' | 'puzzle' | 'code' | 'story';
  userCode: string;
  expectedCode: string[];
  testCases?: any[];
  onValidationComplete?: (result: ValidationResult) => void;
  onProgressUpdate?: (progress: number) => void;
  showHints?: boolean;
  maxHints?: number;
}

export const LessonValidation: React.FC<LessonValidationProps> = ({
  lessonType,
  userCode,
  expectedCode,
  testCases = [],
  onValidationComplete,
  onProgressUpdate,
  showHints = true,
  maxHints = 3
}) => {
  const { addNotification } = useNotifications();
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [validating, setValidating] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showAllHints, setShowAllHints] = useState(false);
  const [executingCode, setExecutingCode] = useState(false);

  const codeService = CodeExecutionService;

  // Validate user input
  const validateUserInput = useCallback(async () => {
    if (!userCode.trim()) {
      setValidationResult({
        isCorrect: false,
        feedback: 'Please provide your answer before validating.',
        hints: ['Start by typing your solution', 'Check the lesson requirements', 'Ask for hints if you need help'],
        score: 0,
        nextHintIndex: 0
      });
      return;
    }

    setValidating(true);

    try {
      let result: ValidationResult;

      switch (lessonType) {
        case 'drag-drop':
          result = await validateDragDrop();
          break;
        case 'puzzle':
          result = await validatePuzzle();
          break;
        case 'code':
          result = await validateCode();
          break;
        case 'story':
          result = await validateStory();
          break;
        default:
          result = await validateGeneric();
      }

      setValidationResult(result);
      setCurrentHintIndex(0);

      if (onValidationComplete) {
        onValidationComplete(result);
      }

      // Send notification based on result
      if (result.isCorrect) {
        addNotification({
          user_id: 'current', // This would be replaced with actual user ID
          type: 'lesson_completed',
          title: 'Lesson Completed! 🎉',
          message: `Great job! You scored ${result.score}% on this lesson.`,
          read: false
        });
      }

      // Update progress
      if (onProgressUpdate) {
        onProgressUpdate(result.score);
      }

    } catch (error) {
      setValidationResult({
        isCorrect: false,
        feedback: 'An error occurred while validating your answer. Please try again.',
        hints: ['Check your code for syntax errors', 'Make sure you followed all instructions'],
        score: 0,
        nextHintIndex: 0
      });
    } finally {
      setValidating(false);
    }
  }, [userCode, lessonType, expectedCode, testCases, onValidationComplete, onProgressUpdate, addNotification]);

  // Validate drag-drop exercises
  const validateDragDrop = async (): Promise<ValidationResult> => {
    const validation = codeService.validateInteractiveResponse(userCode, expectedCode, lessonType);

    let score = 0;
    if (validation.isCorrect) {
      score = 100;
    } else {
      // Partial scoring based on how close the answer is
      score = calculatePartialScore(userCode, expectedCode);
    }

    return {
      ...validation,
      score,
      nextHintIndex: validation.isCorrect ? 0 : currentHintIndex
    };
  };

  // Validate puzzle games
  const validatePuzzle = async (): Promise<ValidationResult> => {
    const validation = codeService.validateInteractiveResponse(userCode, expectedCode, lessonType);

    return {
      ...validation,
      score: validation.isCorrect ? 100 : 0,
      nextHintIndex: validation.isCorrect ? 0 : currentHintIndex
    };
  };

  // Validate code exercises
  const validateCode = async (): Promise<ValidationResult> => {
    setExecutingCode(true);

    try {
      const executionResult = await codeService.executeCode(userCode, testCases);

      if (executionResult.success && executionResult.test_results) {
        const passedTests = executionResult.test_results.filter(test => test.passed).length;
        const totalTests = executionResult.test_results.length;
        const score = Math.round((passedTests / totalTests) * 100);

        const isCorrect = score >= 80; // 80% pass rate

        return {
          isCorrect,
          feedback: isCorrect
            ? 'Excellent! Your code passes all the test cases.'
            : `Your code passes ${passedTests} out of ${totalTests} test cases. Keep trying!`,
          hints: isCorrect ? [] : [
            'Check the test cases that failed',
            'Review your logic for edge cases',
            'Make sure your code handles all inputs correctly'
          ],
          score,
          nextHintIndex: isCorrect ? 0 : currentHintIndex
        };
      } else {
        return {
          isCorrect: false,
          feedback: executionResult.error || 'Your code has errors that need to be fixed.',
          hints: [
            'Check for syntax errors',
            'Make sure your code handles all required cases',
            'Review the error messages above'
          ],
          score: 0,
          nextHintIndex: currentHintIndex
        };
      }
    } finally {
      setExecutingCode(false);
    }
  };

  // Validate story lessons
  const validateStory = async (): Promise<ValidationResult> => {
    // Story lessons often have specific requirements
    const validation = codeService.validateInteractiveResponse(userCode, expectedCode, lessonType);

    return {
      ...validation,
      score: validation.isCorrect ? 100 : 50, // Story lessons often give partial credit
      nextHintIndex: validation.isCorrect ? 0 : currentHintIndex
    };
  };

  // Generic validation
  const validateGeneric = async (): Promise<ValidationResult> => {
    const validation = codeService.validateInteractiveResponse(userCode, expectedCode, lessonType);

    return {
      ...validation,
      score: validation.isCorrect ? 100 : 0,
      nextHintIndex: validation.isCorrect ? 0 : currentHintIndex
    };
  };

  // Calculate partial score for drag-drop exercises
  const calculatePartialScore = (userCode: string, expectedCode: string[]): number => {
    let maxScore = 0;

    for (const expected of expectedCode) {
      // Simple similarity scoring
      const similarity = calculateSimilarity(userCode, expected);
      maxScore = Math.max(maxScore, Math.round(similarity * 100));
    }

    return Math.min(maxScore, 75); // Max partial score is 75%
  };

  // Calculate string similarity
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  // Levenshtein distance algorithm
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  // Show next hint
  const showNextHint = () => {
    if (validationResult && currentHintIndex < validationResult.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    }
  };

  // Get status color
  const getStatusColor = () => {
    if (!validationResult) return 'text-slate-400';

    if (validationResult.isCorrect) {
      return 'text-green-400';
    } else if (validationResult.score > 50) {
      return 'text-yellow-400';
    } else {
      return 'text-red-400';
    }
  };

  // Get status icon
  const getStatusIcon = () => {
    if (!validationResult || validating) return <AlertCircle className="w-5 h-5" />;

    if (validationResult.isCorrect) {
      return <CheckCircle className="w-5 h-5" />;
    } else if (validationResult.score > 50) {
      return <AlertCircle className="w-5 h-5" />;
    } else {
      return <XCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      {/* Validation Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          {getStatusIcon()}
          <span className={getStatusColor()}>
            {validating ? 'Validating...' : validationResult ? (validationResult.isCorrect ? 'Correct!' : 'Not quite right') : 'Ready to validate'}
          </span>
        </h3>

        <div className="flex items-center gap-2">
          {validationResult && (
            <div className="text-sm text-slate-400">
              Score: <span className={`font-semibold ${getStatusColor()}`}>{validationResult.score}%</span>
            </div>
          )}

          <button
            onClick={validateUserInput}
            disabled={validating || executingCode}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            {validating || executingCode ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Validating...
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                Check Answer
              </>
            )}
          </button>
        </div>
      </div>

      {/* Validation Result */}
      {validationResult && (
        <div className={`rounded-lg p-4 mb-4 border ${
          validationResult.isCorrect
            ? 'bg-green-900/20 border-green-700/30'
            : validationResult.score > 50
            ? 'bg-yellow-900/20 border-yellow-700/30'
            : 'bg-red-900/20 border-red-700/30'
        }`}>
          <p className={`${getStatusColor()} mb-2`}>
            {validationResult.feedback}
          </p>

          {/* Code execution output */}
          {executingCode && (
            <div className="mt-3 p-3 bg-slate-900/50 rounded border border-slate-600">
              <p className="text-slate-400 text-sm">Code execution in progress...</p>
            </div>
          )}
        </div>
      )}

      {/* Hints Section */}
      {showHints && validationResult && !validationResult.isCorrect && validationResult.hints.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              Hints
            </h4>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">
                {currentHintIndex + 1} / {validationResult.hints.length}
              </span>

              {currentHintIndex < validationResult.hints.length - 1 && (
                <button
                  onClick={showNextHint}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  Next Hint
                </button>
              )}

              <button
                onClick={() => setShowAllHints(!showAllHints)}
                className="text-slate-400 hover:text-slate-300 text-sm font-medium transition-colors"
              >
                {showAllHints ? 'Hide' : 'Show'} All
              </button>
            </div>
          </div>

          {/* Display hints */}
          <div className="space-y-2">
            {(showAllHints ? validationResult.hints : validationResult.hints.slice(0, currentHintIndex + 1)).map((hint, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  index <= currentHintIndex || showAllHints
                    ? 'bg-blue-900/20 border-blue-700/30'
                    : 'bg-slate-700/30 border-slate-600/50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  index <= currentHintIndex || showAllHints
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-600 text-slate-400'
                }`}>
                  {index + 1}
                </div>
                <p className={`text-sm ${
                  index <= currentHintIndex || showAllHints ? 'text-blue-300' : 'text-slate-500'
                }`}>
                  {hint}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Try Again Button */}
      {validationResult && !validationResult.isCorrect && (
        <div className="flex items-center gap-4 pt-4 border-t border-slate-700">
          <button
            onClick={() => {
              setValidationResult(null);
              setCurrentHintIndex(0);
              setShowAllHints(false);
            }}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={16} />
            Try Again
          </button>

          <p className="text-slate-400 text-sm">
            Keep practicing! You'll get it right! 💪
          </p>
        </div>
      )}
    </div>
  );
};

export default LessonValidation;