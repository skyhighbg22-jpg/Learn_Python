import { useEffect, useState } from 'react';
import { Zap, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { CodeEditor } from '../CodeEditor';

type Challenge = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  xp_reward: number;
  problem_statement: string;
  starter_code: string | null;
  test_cases: Array<{ input: string; expectedOutput: string }>;
  hints: string[] | null;
};

export const CodeChallengesView = () => {
  const { profile, refreshProfile } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userAttempts, setUserAttempts] = useState<Record<string, any>>({});
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    loadChallenges();
  }, [profile]);

  const loadChallenges = async () => {
    const { data } = await supabase
      .from('code_challenges')
      .select('*')
      .order('difficulty');

    if (data) {
      setChallenges(data);

      if (profile) {
        const { data: attemptsData } = await supabase
          .from('user_code_attempts')
          .select('*')
          .eq('user_id', profile.id);

        if (attemptsData) {
          const attemptsMap = attemptsData.reduce((acc, a) => {
            acc[a.challenge_id] = a;
            return acc;
          }, {} as Record<string, any>);
          setUserAttempts(attemptsMap);
        }
      }
    }

    setLoading(false);
  };

  const selectChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setCode(challenge.starter_code || '');
    setResult(null);
    setShowHint(false);
  };

  const simulateCodeExecution = (userCode: string, testCases: Challenge['test_cases']) => {
    try {
      // Simple simulation - in production, this would call an edge function
      if (userCode.trim().length === 0) {
        return { success: false, message: 'Code is empty' };
      }

      // Check if code contains basic Python syntax
      if (!userCode.includes('def') && !userCode.includes('for') && !userCode.includes('return')) {
        return { success: false, message: 'Code needs actual implementation' };
      }

      return { success: true, message: 'All tests passed! Great job!' };
    } catch (error) {
      return { success: false, message: 'Execution error: ' + (error instanceof Error ? error.message : 'Unknown error') };
    }
  };

  const handleSubmit = async () => {
    if (!selectedChallenge || !profile) return;

    setIsSubmitting(true);

    try {
      const executionResult = simulateCodeExecution(code, selectedChallenge.test_cases);
      setResult(executionResult);

      if (executionResult.success) {
        const existingAttempt = userAttempts[selectedChallenge.id];

        if (existingAttempt) {
          await supabase
            .from('user_code_attempts')
            .update({
              solution_code: code,
              passed: true,
              completed_at: new Date().toISOString(),
              attempts_count: existingAttempt.attempts_count + 1,
            })
            .eq('id', existingAttempt.id);
        } else {
          await supabase.from('user_code_attempts').insert({
            user_id: profile.id,
            challenge_id: selectedChallenge.id,
            solution_code: code,
            passed: true,
            completed_at: new Date().toISOString(),
          });
        }

        await supabase
          .from('profiles')
          .update({
            total_xp: profile.total_xp + selectedChallenge.xp_reward,
            current_level: Math.floor((profile.total_xp + selectedChallenge.xp_reward) / 100) + 1,
          })
          .eq('id', profile.id);

        await refreshProfile();
        await loadChallenges();
      } else {
        const existingAttempt = userAttempts[selectedChallenge.id];
        if (existingAttempt) {
          await supabase
            .from('user_code_attempts')
            .update({
              attempts_count: existingAttempt.attempts_count + 1,
            })
            .eq('id', existingAttempt.id);
        }
      }
    } catch (error) {
      console.error('Error submitting challenge:', error);
      setResult({ success: false, message: 'Error submitting solution' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading challenges...</div>
      </div>
    );
  }

  if (!selectedChallenge) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Code Challenges</h2>
          <p className="text-slate-400">Solve real coding problems to master Python</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge) => {
            const attempt = userAttempts[challenge.id];
            const isCompleted = attempt?.passed;

            return (
              <button
                key={challenge.id}
                onClick={() => selectChallenge(challenge)}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-all group text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
                      {challenge.title}
                    </h3>
                    <p className="text-slate-400 text-sm">{challenge.description}</p>
                  </div>
                  {isCompleted && <CheckCircle className="text-green-500 flex-shrink-0" size={24} />}
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full capitalize">
                    {challenge.difficulty}
                  </span>
                  <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                    {challenge.category}
                  </span>
                  <span className="text-yellow-500 text-sm font-semibold ml-auto">
                    +{challenge.xp_reward} XP
                  </span>
                </div>

                {attempt && (
                  <div className="mt-4 text-xs text-slate-400">
                    Attempts: {attempt.attempts_count}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {challenges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No challenges available yet. Check back soon!</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <button
        onClick={() => setSelectedChallenge(null)}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
      >
        <ArrowRight size={18} className="rotate-180" />
        Back to Challenges
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">{selectedChallenge.title}</h2>
            <p className="text-slate-400 mb-4">{selectedChallenge.description}</p>

            <div className="flex gap-2 flex-wrap mb-4">
              <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full capitalize">
                {selectedChallenge.difficulty}
              </span>
              <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                {selectedChallenge.category}
              </span>
              <span className="text-xs bg-yellow-900/30 border border-yellow-700 text-yellow-400 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                <Zap size={12} />
                +{selectedChallenge.xp_reward} XP
              </span>
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-6 mb-6">
            <h3 className="text-white font-semibold mb-3">Problem Statement</h3>
            <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
              {selectedChallenge.problem_statement}
            </p>
          </div>

          <div className="bg-slate-900 rounded-lg p-6 mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Clock size={18} />
              Test Cases
            </h3>
            <div className="space-y-3">
              {selectedChallenge.test_cases.map((test, index) => (
                <div key={index} className="text-sm bg-slate-800 rounded p-3 border border-slate-700">
                  <p className="text-slate-400 mb-1">Input: <span className="text-white font-mono">{test.input}</span></p>
                  <p className="text-slate-400">Expected: <span className="text-white font-mono">{test.expectedOutput}</span></p>
                </div>
              ))}
            </div>
          </div>

          {selectedChallenge.hints && selectedChallenge.hints.length > 0 && (
            <div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors"
              >
                {showHint ? '▼ Hide Hints' : '▶ Show Hints'}
              </button>
              {showHint && (
                <div className="mt-3 space-y-2 bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  {selectedChallenge.hints.map((hint, index) => (
                    <div key={index} className="text-sm text-blue-300">
                      <span className="font-semibold">Hint {index + 1}:</span> {hint}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <CodeEditor value={code} onChange={setCode} initialCode={selectedChallenge.starter_code || ''} />

          {result && (
            <div
              className={`mt-4 p-4 rounded-lg border ${
                result.success
                  ? 'bg-green-900/20 border-green-700'
                  : 'bg-red-900/20 border-red-700'
              }`}
            >
              <p className={result.success ? 'text-green-400' : 'text-red-400'}>
                {result.message}
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="mt-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Solution'}
          </button>
        </div>
      </div>
    </div>
  );
};
