import { useState, useEffect } from 'react';
import { X, Clock, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { CodeEditor } from '../CodeEditor';
import { dailyChallengeService, DailyChallenge } from '../../services/dailyChallengeService';

type ChallengeModalProps = {
  challenge: DailyChallenge | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number, timeSpent: number) => void;
};

export const ChallengeModal = ({ challenge, isOpen, onClose, onComplete }: ChallengeModalProps) => {
  const { profile, refreshProfile } = useAuth();
  const [userCode, setUserCode] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string; score?: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [startTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && challenge) {
      setUserCode(challenge.challenge_data?.starter_code || '# Write your solution here\n');
      setResult(null);
      setShowHint(false);
      setCurrentHintIndex(0);
      setAttemptId(null);

      // Create attempt record
      createAttemptRecord();
    }
  }, [isOpen, challenge]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && !result?.success) {
      interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, startTime, result]);

  const createAttemptRecord = async () => {
    if (!challenge || !profile?.id) return;

    try {
      const { data, error } = await supabase
        .from('daily_challenge_attempts')
        .insert({
          user_id: profile.id,
          challenge_id: challenge.id,
          challenge_date: new Date().toISOString().split('T')[0],
          score: 0,
          completed: false,
          attempts: 1,
          completion_time: 0,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (data) {
        setAttemptId(data.id);
      }

      if (error) {
        console.error('Error creating attempt record:', error);
      }
    } catch (error) {
      console.error('Error in createAttemptRecord:', error);
    }
  };

  const simulateCodeExecution = (userCode: string) => {
    try {
      // Basic validation
      if (!userCode.trim() || userCode.trim().length < 10) {
        return {
          success: false,
          message: 'Please write a meaningful solution',
          score: 0
        };
      }

      // Check for common Python patterns
      const hasFunctions = userCode.includes('def ');
      const hasLogic = userCode.includes('if ') || userCode.includes('for ') || userCode.includes('while ');
      const hasOutput = userCode.includes('print(');

      let score = 0;
      let message = '';

      if (challenge?.challenge_type === 'code') {
        // Code challenge scoring
        if (hasFunctions && hasLogic && hasOutput) {
          score = 100;
          message = 'Excellent solution! All requirements met. Great job! 🎉';
        } else if (hasFunctions && hasLogic) {
          score = 80;
          message = 'Good solution! Consider adding output to see the results. 👍';
        } else if (hasFunctions || hasLogic) {
          score = 60;
          message = 'Good start! Try to add more functionality to solve the problem completely. 💪';
        } else {
          score = 30;
          message = 'Keep trying! Add functions and logic to solve the challenge. 🌟';
        }
      } else {
        // Other challenge types (quiz, puzzle, etc.)
        score = 85;
        message = 'Good attempt! Your solution shows understanding of the concepts. ✨';
      }

      // Time bonus
      if (timeSpent < 60 && score > 70) {
        score += 10;
        message += ' Time bonus awarded! ⚡';
      }

      return {
        success: score >= 70,
        message,
        score: Math.min(score, 100)
      };

    } catch (error) {
      return {
        success: false,
        message: 'Error in code execution: ' + (error instanceof Error ? error.message : 'Unknown error'),
        score: 0
      };
    }
  };

  const handleSubmit = async () => {
    if (!challenge || !profile || !attemptId) return;

    setIsSubmitting(true);

    try {
      const executionResult = simulateCodeExecution(userCode);
      setResult(executionResult);

      // Update attempt record
      await supabase
        .from('daily_challenge_attempts')
        .update({
          score: executionResult.score || 0,
          completed: executionResult.success,
          completion_time: timeSpent,
          attempts: 1,
        })
        .eq('id', attemptId);

      if (executionResult.success) {
        // Award XP
        const xpEarned = challenge.xp_reward;
        await supabase
          .from('profiles')
          .update({
            total_xp: profile.total_xp + xpEarned,
            current_level: Math.floor((profile.total_xp + xpEarned) / 100) + 1,
            current_streak: profile.current_streak + 1,
          })
          .eq('id', profile.id);

        await refreshProfile();

        // Call completion callback after a short delay
        setTimeout(() => {
          onComplete(executionResult.score || 0, timeSpent);
          onClose();
        }, 2000);
      }

    } catch (error) {
      console.error('Error submitting challenge:', error);
      setResult({
        success: false,
        message: 'Error submitting solution. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowHint = () => {
    const hints = challenge?.challenge_data?.hints || [];
    if (currentHintIndex < hints.length) {
      setCurrentHintIndex(prev => prev + 1);
    }
    setShowHint(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const hints = challenge?.challenge_data?.hints || [];

  if (!isOpen || !challenge) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto animate-in animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 glass border-b border-slate-700 p-6 flex items-center justify-between z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 bg-slate-700 rounded-lg ${dailyChallengeService.getDifficultyColor(challenge.difficulty)}`}>
                <Zap size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gradient">{challenge.title}</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className={`${dailyChallengeService.getDifficultyColor(challenge.difficulty)} font-medium`}>
                    {dailyChallengeService.getDifficultyLabel(challenge.difficulty)}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-warning-400 font-medium">{challenge.xp_reward} XP</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-blue-400 flex items-center gap-1">
                    <Clock size={14} />
                    {formatTime(timeSpent)}
                  </span>
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

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Problem Description */}
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">Challenge</h3>
                <p className="text-slate-300 leading-relaxed mb-4">{challenge.description}</p>

                {challenge.challenge_data?.problem_statement && (
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Problem Statement</h4>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {challenge.challenge_data.problem_statement}
                    </p>
                  </div>
                )}

                {challenge.challenge_data?.test_cases && challenge.challenge_data.test_cases.length > 0 && (
                  <div className="mt-4 bg-slate-900 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">Test Cases</h4>
                    <div className="space-y-2">
                      {challenge.challenge_data.test_cases.map((test: any, index: number) => (
                        <div key={index} className="text-sm bg-slate-800 rounded p-3 border border-slate-700">
                          <p className="text-slate-400 mb-1">
                            Input: <span className="text-white font-mono">{test.input}</span>
                          </p>
                          <p className="text-slate-400">
                            Expected: <span className="text-white font-mono">{test.expected_output}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Hints Section */}
              {hints.length > 0 && (
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <AlertCircle className="text-yellow-400" size={20} />
                      Hints ({currentHintIndex}/{hints.length})
                    </h3>
                    <button
                      onClick={handleShowHint}
                      disabled={currentHintIndex >= hints.length || result?.success}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-600 text-white text-sm rounded-md transition-colors"
                    >
                      {currentHintIndex >= hints.length ? 'All Hints Used' : 'Show Hint'}
                    </button>
                  </div>

                  {showHint && currentHintIndex > 0 && (
                    <div className="space-y-2">
                      {hints.slice(0, currentHintIndex).map((hint: string, index: number) => (
                        <div key={index} className="bg-yellow-900/20 border border-yellow-700/30 rounded-md p-3">
                          <p className="text-yellow-300 text-sm">
                            <span className="font-semibold">Hint {index + 1}:</span> {hint}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Code Editor and Results */}
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4">Your Solution</h3>
                <CodeEditor
                  value={userCode}
                  onChange={setUserCode}
                  initialCode={challenge.challenge_data?.starter_code || '# Write your solution here\n'}
                />

                {/* Result Display */}
                {result && (
                  <div className={`mt-4 p-4 rounded-lg border animate-in animate-scale-in ${
                    result.success
                      ? 'bg-green-900/20 border-green-700'
                      : 'bg-red-900/20 border-red-700'
                  }`}>
                    <div className="flex items-start gap-3">
                      {result.success ? (
                        <CheckCircle className="text-green-400 mt-0.5 flex-shrink-0" size={20} />
                      ) : (
                        <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={20} />
                      )}
                      <div>
                        <p className={`font-semibold mb-1 ${
                          result.success ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {result.success ? 'Success!' : 'Not Quite Right'}
                        </p>
                        <p className="text-sm text-slate-300">{result.message}</p>
                        {result.score !== undefined && (
                          <p className="text-lg font-bold text-yellow-400 mt-2">
                            Score: {result.score}/100
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || result?.success}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : result?.success ? (
                    <>
                      <CheckCircle size={16} />
                      Completed!
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      Submit Solution
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};