import { useState } from 'react';
import { Code2, Brain, Lightbulb, Rocket } from 'lucide-react';
import { CodeChallengesView } from './CodeChallengesView';
import { InterviewPrepView } from './InterviewPrepView';
import { AlgorithmPracticeView } from './AlgorithmPracticeView';
import { ProjectBuilderView } from './ProjectBuilderView';

export const PracticeView = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (selectedCategory === 'challenges') {
    return <CodeChallengesView />;
  }

  if (selectedCategory === 'interview') {
    return <InterviewPrepView />;
  }

  if (selectedCategory === 'algorithms') {
    return <AlgorithmPracticeView />;
  }

  if (selectedCategory === 'projects') {
    return <ProjectBuilderView />;
  }

  const practiceCategories = [
    {
      id: 'challenges',
      title: 'Code Challenges',
      description: 'Solve coding problems to improve your skills',
      icon: Code2,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'interview',
      title: 'Interview Prep',
      description: 'Practice common Python interview questions',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'algorithms',
      title: 'Algorithm Practice',
      description: 'Master sorting, searching, and more',
      icon: Lightbulb,
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 'projects',
      title: 'Project Builder',
      description: 'Build real-world projects step by step',
      icon: Rocket,
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Practice Arena</h2>
        <p className="text-slate-400">Sharpen your Python skills with hands-on practice</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {practiceCategories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-all group cursor-pointer text-left"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <Icon className="text-white" size={28} />
                </div>
                <span className="bg-green-900/30 border border-green-700 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                  Available
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {category.title}
              </h3>
              <p className="text-slate-400">{category.description}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 bg-gradient-to-br from-emerald-900/30 to-green-900/30 rounded-xl p-8 border border-emerald-700/50">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-3">All Practice Features Live!</h3>
          <p className="text-slate-300 mb-4">
            Explore all four practice modes to master Python programming, ace interviews, and build real projects.
          </p>
          <ul className="text-slate-300 text-sm space-y-2 max-w-2xl mx-auto">
            <li className="flex items-center justify-center gap-2">
              <span className="text-green-400">✓</span> Code Challenges with hints and test cases
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="text-green-400">✓</span> Algorithm Practice with complexity analysis
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="text-green-400">✓</span> Interview Prep with real interview questions
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="text-green-400">✓</span> Project Builder for hands-on learning
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
