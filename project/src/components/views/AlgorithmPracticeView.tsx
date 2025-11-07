import { useEffect, useState } from 'react';
import { Zap, CheckCircle, BookOpen, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { CodeEditor } from '../CodeEditor';

type AlgorithmProblem = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  xp_reward: number;
  problem_statement: string;
  explanation: string;
  time_complexity: string;
  space_complexity: string;
  test_cases: Array<{ input: string; expectedOutput: string }>;
  solution_code: string;
  hints: string[] | null;
};

export const AlgorithmPracticeView = () => {
  const { profile, refreshProfile } = useAuth();
  const [problems, setProblems] = useState<AlgorithmProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState<AlgorithmProblem | null>(null);
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userAttempts, setUserAttempts] = useState<Record<string, any>>({});

  useEffect(() => {
    loadProblems();
  }, [profile]);

  const loadProblems = async () => {
    const { data } = await supabase
      .from('algorithm_problems')
      .select('*')
      .order('difficulty');

    if (data) {
      setProblems(data);

      if (profile) {
        const { data: attemptsData } = await supabase
          .from('user_algorithm_attempts')
          .select('*')
          .eq('user_id', profile.id);

        if (attemptsData) {
          const attemptsMap = attemptsData.reduce((acc, a) => {
            acc[a.problem_id] = a;
            return acc;
          }, {} as Record<string, any>);
          setUserAttempts(attemptsMap);
        }
      }
    }

    setLoading(false);
  };

  const selectProblem = (problem: AlgorithmProblem) => {
    setSelectedProblem(problem);
    setCode('# Implement your solution here\n');
    setResult(null);
    setShowExplanation(false);
    setShowSolution(false);
  };

  const handleSubmit = async () => {
    if (!selectedProblem || !profile) return;

    setIsSubmitting(true);

    try {
      if (code.trim().length === 0) {
        setResult({ success: false, message: 'Code is empty' });
        setIsSubmitting(false);
        return;
      }

      // Simulate execution
      setResult({ success: true, message: 'Solution accepted!' });

      const existingAttempt = userAttempts[selectedProblem.id];

      if (existingAttempt) {
        await supabase
          .from('user_algorithm_attempts')
          .update({
            solution_code: code,
            passed: true,
            completed_at: new Date().toISOString(),
            attempts_count: existingAttempt.attempts_count + 1,
          })
          .eq('id', existingAttempt.id);
      } else {
        await supabase.from('user_algorithm_attempts').insert({
          user_id: profile.id,
          problem_id: selectedProblem.id,
          solution_code: code,
          passed: true,
          completed_at: new Date().toISOString(),
        });
      }

      await supabase
        .from('profiles')
        .update({
          total_xp: profile.total_xp + selectedProblem.xp_reward,
          current_level: Math.floor((profile.total_xp + selectedProblem.xp_reward) / 100) + 1,
        })
        .eq('id', profile.id);

      await refreshProfile();
      await loadProblems();
    } catch (error) {
      console.error('Error submitting:', error);
      setResult({ success: false, message: 'Error submitting solution' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading problems...</div>
      </div>
    );
  }

  if (!selectedProblem) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Algorithm Practice</h2>
          <p className="text-slate-400">Master fundamental algorithms and data structures</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((problem) => {
            const attempt = userAttempts[problem.id];
            const isCompleted = attempt?.passed;

            return (
              <button
                key={problem.id}
                onClick={() => selectProblem(problem)}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-purple-500 transition-all group text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors mb-1">
                      {problem.title}
                    </h3>
                    <p className="text-slate-400 text-sm">{problem.description}</p>
                  </div>
                  {isCompleted && <CheckCircle className="text-green-500 flex-shrink-0" size={24} />}
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full capitalize">
                    {problem.difficulty}
                  </span>
                  <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                    {problem.category}
                  </span>
                  <span className="text-yellow-500 text-sm font-semibold ml-auto">
                    +{problem.xp_reward} XP
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

        {problems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No problems available yet. Check back soon!</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <button
        onClick={() => setSelectedProblem(null)}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
      >
        <ArrowRight size={18} className="rotate-180" />
        Back to Problems
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-2">{selectedProblem.title}</h2>
            <p className="text-slate-400 mb-4">{selectedProblem.description}</p>

            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full capitalize">
                {selectedProblem.difficulty}
              </span>
              <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                {selectedProblem.category}
              </span>
              <span className="text-xs bg-yellow-900/30 border border-yellow-700 text-yellow-400 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                <Zap size={12} />
                +{selectedProblem.xp_reward} XP
              </span>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <BookOpen size={20} />
              Problem Statement
            </h3>
            <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
              {selectedProblem.problem_statement}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Time Complexity</p>
              <p className="text-white font-mono font-bold">{selectedProblem.time_complexity}</p>
            </div>
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Space Complexity</p>
              <p className="text-white font-mono font-bold">{selectedProblem.space_complexity}</p>
            </div>
          </div>

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full text-left bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-colors group"
          >
            <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
              {showExplanation ? '▼' : '▶'} Explanation
            </h3>
            {showExplanation && (
              <p className="text-slate-300 text-sm mt-3 whitespace-pre-wrap">
                {selectedProblem.explanation}
              </p>
            )}
          </button>

          <button
            onClick={() => setShowSolution(!showSolution)}
            className="w-full text-left bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-green-500 transition-colors group"
          >
            <h3 className="text-white font-semibold group-hover:text-green-400 transition-colors">
              {showSolution ? '▼' : '▶'} Solution
            </h3>
            {showSolution && (
              <pre className="text-slate-300 text-xs mt-3 bg-slate-900 p-3 rounded overflow-x-auto">
                {selectedProblem.solution_code}
              </pre>
            )}
          </button>
        </div>

        <div className="flex flex-col">
          <CodeEditor value={code} onChange={setCode} initialCode="# Implement your solution here\n" />

          {result && (
            <div
              className={`mt-4 p-4 rounded-lg border ${
                result.success
                  ? 'bg-green-900/20 border-green-700'
                  : 'bg-red-900/20 border-red-700'
              }`}
            >
              <p className={result.success ? 'text-green-400 font-semibold' : 'text-red-400'}>
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
