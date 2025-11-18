import React from 'react';
import { Lightbulb } from 'lucide-react';

interface SkyTipsProps {
  tips: string[];
  lessonTitle?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export const SkyTips: React.FC<SkyTipsProps> = ({ tips, lessonTitle, difficulty = 'beginner' }) => {
  if (!tips || tips.length === 0) {
    return null;
  }

  const getTipIcon = (index: number) => {
    const icons = ['💡', '✨', '🎯', '🔥', '⚡'];
    return icons[index % icons.length] || icons[0];
  };

  const getTipColor = (index: number) => {
    const colors = [
      'text-blue-400',
      'text-purple-400',
      'text-green-400',
      'text-yellow-400'
    ];
    return colors[index % colors.length];
  };

  const getDifficultyColor = () => {
    const colors = {
      beginner: 'from-blue-500 to-cyan-500',
      intermediate: 'from-purple-500 to-pink-500',
      advanced: 'from-orange-500 to-red-500'
    };
    return colors[difficulty];
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-purple-900/20 rounded-xl p-6 border border-blue-700/50 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">🌟</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Lightbulb className="text-blue-300" size={24} />
              Sky's Tips
            </h3>
            {lessonTitle && (
              <p className="text-blue-200 text-sm">
                {lessonTitle} • {difficulty}
              </p>
            )}
          </div>
        </div>

        <div className="text-blue-300 text-xs">
          <span>Personalized tips based on current lesson</span>
        </div>
      </div>

      {/* Tips Content */}
      <div className="space-y-3">
        {tips.map((tip, index) => {
          const tipIcon = getTipIcon(index);
          const tipColor = getTipColor(index);

          return (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-600/50 hover:bg-slate-700/50 transition-all duration-200 hover:transform hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-2xl ${tipColor} animate-pulse`}>
                  {tipIcon}
                </div>
                <div className="flex-1">
                  <p className="text-slate-100 text-sm leading-relaxed mb-2">
                    <span className="font-semibold text-white">{tip}</span>
                  </p>
                  {difficulty === 'beginner' && (
                    <p className="text-blue-300 text-xs italic mt-2">
                      💭 Sky's wisdom for beginners
                    </p>
                  )}
                </div>
              </div>

              {/* Action Button for related tips */}
              <button className="text-blue-400 hover:text-blue-300 text-sm underline mt-2 self-start">
                Learn more about this →
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-600/50">
        <div className="text-blue-300 text-xs">
          <span>💬</span>
          <span className="ml-2">Remember: Every expert was once a beginner!</span>
        </div>

        <button className="text-slate-400 hover:text-white text-sm transition-colors">
          Get 24/7 Help from Sky →
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -right-4 -bottom-4 w-20 h-20 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-xl"></div>
      </div>

      <div className="absolute -left-4 -top-4 w-16 h-16 opacity-30">
        <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-lg"></div>
      </div>

      <div className="absolute -right-8 top-1/3 w-12 h-12 opacity-25">
        <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-md"></div>
      </div>
    </div>
  );
};