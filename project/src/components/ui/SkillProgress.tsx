import React from 'react';
import { TrendingUp, Target, Zap, Award } from 'lucide-react';

interface Skill {
  name: string;
  icon: string;
  progress: number;
  xp: number;
  totalXP: number;
  color: string;
}

interface SkillProgressProps {
  skills: Skill[];
}

export const SkillProgress: React.FC<SkillProgressProps> = ({ skills }) => {
  const getCircularProgress = (progress: number) => {
    const radius = 40;
    const strokeWidth = 8;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return {
      radius,
      strokeWidth,
      circumference,
      strokeDashoffset: circumference - (progress / 100) * circumference
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {skills.map((skill, index) => {
        const progressData = getCircularProgress(skill.progress);

        return (
          <div key={skill.name} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-all duration-200">
            {/* Circular Progress */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <svg
                  width="100"
                  height="100"
                  viewBox="0 0 100 100"
                  className="transform -rotate-90"
                >
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r={progressData.radius}
                    stroke="currentColor"
                    strokeWidth={progressData.strokeWidth}
                    fill="none"
                    className="text-slate-700"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r={progressData.radius}
                    stroke="currentColor"
                    strokeWidth={progressData.strokeWidth}
                    fill="none"
                    strokeDasharray={progressData.circumference}
                    strokeDashoffset={progressData.strokeDashoffset}
                    className={`${skill.color} transition-all duration-500 ease-out`}
                    strokeLinecap="round"
                  />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className={`text-2xl font-bold ${skill.color}`}>
                      {skill.progress}%
                    </span>
                    <div className="text-xs text-slate-400">
                      {skill.xp}/{skill.totalXP} XP
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skill Info */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">{skill.icon}</span>
                <h3 className="text-white font-semibold">{skill.name}</h3>
              </div>

              <div className="space-y-2">
                {/* Progress bars for different aspects */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Proficiency</span>
                    <span>{skill.progress}%</span>
                  </div>
                  <div className="bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${skill.color}`}
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>XP Progress</span>
                    <span>{skill.xp} XP</span>
                  </div>
                  <div className="bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((skill.xp / skill.totalXP) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Skill status */}
              <div className="mt-3 flex items-center justify-center">
                {skill.progress >= 80 ? (
                  <div className="flex items-center gap-1 text-green-400 text-sm">
                    <Award size={14} />
                    <span>Mastered</span>
                  </div>
                ) : skill.progress >= 50 ? (
                  <div className="flex items-center gap-1 text-blue-400 text-sm">
                    <TrendingUp size={14} />
                    <span>Proficient</span>
                  </div>
                ) : skill.progress >= 25 ? (
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    <Target size={14} />
                    <span>Developing</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-slate-400 text-sm">
                    <Zap size={14} />
                    <span>Beginner</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};