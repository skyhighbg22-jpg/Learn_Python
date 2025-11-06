import { useEffect, useState } from 'react';
import { Zap, CheckCircle, Clock, ArrowRight, Brain } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

type InterviewQuestion = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  test_cases: Array<{ input: string; expectedOutput: string }>;
  hints: string[] | null;
};

export const InterviewPrepView = () => {
  const { profile } = useAuth();
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [userAttempts, setUserAttempts] = useState<Record<string, any>>({});

  useEffect(() => {
    loadQuestions();
  }, [profile]);

  useEffect(() => {
    if (!isTimerRunning || timeLeft === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const loadQuestions = async () => {
    const { data } = await supabase
      .from('interview_questions')
      .select('*')
      .order('difficulty')
      .limit(20);

    if (data) {
      setQuestions(data);

      if (profile) {
        const { data: attemptsData } = await supabase
          .from('user_interview_attempts')
          .select('*')
          .eq('user_id', profile.id);

        if (attemptsData) {
          const attemptsMap = attemptsData.reduce((acc, a) => {
            acc[a.question_id] = a;
            return acc;
          }, {} as Record<string, any>);
          setUserAttempts(attemptsMap);
        }
      }
    }

    setLoading(false);
  };

  const startInterview = (question: InterviewQuestion) => {
    setSelectedQuestion(question);
    setTimeLeft(600);
    setIsTimerRunning(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading questions...</div>
      </div>
    );
  }

  if (!selectedQuestion) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Interview Preparation</h2>
          <p className="text-slate-400">Practice questions from real coding interviews</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((question) => {
            const attempt = userAttempts[question.id];

            return (
              <button
                key={question.id}
                onClick={() => startInterview(question)}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-all group text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
                      {question.title}
                    </h3>
                    <p className="text-slate-400 text-sm">{question.description}</p>
                  </div>
                  {attempt?.passed && <CheckCircle className="text-green-500 flex-shrink-0" size={24} />}
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full capitalize">
                    {question.difficulty}
                  </span>
                  <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                    {question.category}
                  </span>
                </div>

                {attempt && (
                  <div className="mt-4 text-xs text-slate-400">
                    Attempts: {attempt.id ? 1 : 0}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {questions.length === 0 && (
          <div className="text-center py-12">
            <Brain className="text-slate-600 mx-auto mb-4" size={48} />
            <p className="text-slate-400">No interview questions available yet</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            setSelectedQuestion(null);
            setIsTimerRunning(false);
          }}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowRight size={18} className="rotate-180" />
          Back to Questions
        </button>

        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${
            timeLeft < 60
              ? 'bg-red-900/30 border border-red-700 text-red-400'
              : 'bg-blue-900/30 border border-blue-700 text-blue-400'
          }`}
        >
          <Clock size={20} />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-xs bg-slate-700 text-slate-300 rounded-full capitalize mb-3">
                {selectedQuestion.category}
              </span>
              <h2 className="text-3xl font-bold text-white mb-2">{selectedQuestion.title}</h2>
              <p className="text-slate-400">{selectedQuestion.description}</p>
            </div>

            <div className="bg-slate-900 rounded-lg p-6 mb-6">
              <h3 className="text-white font-semibold mb-3">Question</h3>
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {selectedQuestion.description}
              </p>
            </div>

            <div className="bg-slate-900 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-3">Test Cases</h3>
              <div className="space-y-3">
                {selectedQuestion.test_cases.map((test, index) => (
                  <div key={index} className="text-sm bg-slate-800 rounded p-3 border border-slate-700">
                    <p className="text-slate-400 mb-1">Input: <span className="text-white font-mono">{test.input}</span></p>
                    <p className="text-slate-400">Expected: <span className="text-white font-mono">{test.expectedOutput}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-700">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Brain size={20} />
              Interview Tips
            </h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>Think out loud and explain your approach</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>Ask clarifying questions about the problem</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>Discuss time and space complexity</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>Start with a brute force solution</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>Walk through examples before coding</span>
              </li>
            </ul>
          </div>

          {selectedQuestion.hints && selectedQuestion.hints.length > 0 && (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-white font-bold mb-3">Hints</h3>
              <ul className="space-y-2">
                {selectedQuestion.hints.map((hint, index) => (
                  <div key={index} className="text-sm text-slate-300 p-2 bg-slate-900 rounded">
                    <span className="text-blue-400 font-semibold">Hint {index + 1}:</span> {hint}
                  </div>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => {
              setSelectedQuestion(null);
              setIsTimerRunning(false);
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Submit Answer
          </button>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-sm text-slate-400">
            <p className="mb-2">Time remaining is kept for your reference.</p>
            <p>In real interviews, explain your thought process clearly!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
