import React, { useState } from 'react';
import { Lightbulb, Lock, Eye, TrendingDown, Zap } from 'lucide-react';

interface ProgressiveHintsProps {
  hints: string[];
  onHintRevealed: (hintIndex: number) => void;
  xpReward: number;
  revealedHints: number[];
}

export const ProgressiveHints: React.FC<ProgressiveHintsProps> = ({
  hints,
  onHintRevealed,
  xpReward,
  revealedHints
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!hints || hints.length === 0) {
    return null;
  }

  const calculateXPPenalty = (hintIndex: number): number => {
    const penalties = [0, 10, 25, 50]; // 0%, 10%, 25%, 50%
    return penalties[hintIndex + 1] || 50;
  };

  const calculateFinalXP = (hintIndex: number): number => {
    const penalty = calculateXPPenalty(hintIndex);
    return Math.round(xpReward * (1 - penalty / 100));
  };

  const getHintIcon = (index: number, isRevealed: boolean) => {
    if (isRevealed) {
      return <Eye className="w-4 h-4" />;
    }
    return <Lock className="w-4 h-4" />;
  };

  const getHintTabColor = (index: number, isRevealed: boolean) => {
    if (!isRevealed) {
      return 'bg-slate-700 text-slate-400 hover:bg-slate-600';
    }

    // Color based on hint level
    const colors = [
      'bg-green-600 text-white',
      'bg-yellow-600 text-white',
      'bg-orange-600 text-white'
    ];

    return colors[index] || colors[2];
  };

  const canRevealHint = (index: number) => {
    if (index === 0) return revealedHints.length === 0;
    return revealedHints.includes(index - 1);
  };

  const handleHintClick = (index: number) => {
    if (revealedHints.includes(index)) return;
    if (!canRevealHint(index)) return;

    onHintRevealed(index);
  };

  const allRevealed = revealedHints.length === hints.length;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-500 bg-opacity-20 rounded-lg">
            <Lightbulb className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-medium">Need a hint?</h3>
            <p className="text-slate-400 text-sm">
              {allRevealed
                ? 'All hints revealed'
                : `${revealedHints.length} of ${hints.length} hints used`
              }
            </p>
          </div>
        </div>

        {!allRevealed && (
          <div className="text-right">
            <div className="flex items-center space-x-1 text-orange-400">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm font-medium">-XP</span>
            </div>
          </div>
        )}
      </div>

      {/* Hint Tabs */}
      {!allRevealed && (
        <div className="flex space-x-2 border-b border-slate-700 pb-2">
          {hints.map((hint, index) => {
            const isRevealed = revealedHints.includes(index);
            const canReveal = canRevealHint(index);

            return (
              <button
                key={index}
                onClick={() => handleHintClick(index)}
                disabled={!canReveal}
                className={`
                  px-3 py-1 rounded-t-lg text-sm font-medium transition-all duration-200
                  ${getHintTabColor(index, isRevealed)}
                  ${canReveal && !isRevealed ? 'hover:scale-105 cursor-pointer' : ''}
                  ${!canReveal ? 'cursor-not-allowed opacity-50' : ''}
                `}
                title={isRevealed ? 'Hint revealed' : canReveal ? 'Click to reveal hint' : 'Complete previous hint first'}
              >
                <div className="flex items-center space-x-1">
                  {getHintIcon(index, isRevealed)}
                  <span>{index + 1}</span>
                  {!isRevealed && canReveal && (
                    <Zap className="w-3 h-3" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Hint Content */}
      <div className="space-y-3">
        {hints.map((hint, index) => {
          const isRevealed = revealedHints.includes(index);
          const xpPenalty = calculateXPPenalty(index);
          const finalXP = calculateFinalXP(index);

          if (!isRevealed) return null;

          return (
            <div
              key={index}
              className="bg-slate-700 border border-slate-600 rounded-lg p-3 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-green-600 text-white' :
                    index === 1 ? 'bg-yellow-600 text-white' :
                    'bg-orange-600 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-slate-300 text-sm font-medium">
                    {index === 0 ? 'Conceptual Hint' :
                     index === 1 ? 'Partial Code' :
                     'Solution Hint'}
                  </span>
                </div>

                {xpPenalty > 0 && (
                  <div className="flex items-center space-x-1 text-orange-400">
                    <TrendingDown className="w-3 h-3" />
                    <span className="text-xs font-medium">
                      -{xpPenalty}% XP ({finalXP} XP)
                    </span>
                  </div>
                )}
              </div>

              <p className="text-slate-100 text-sm leading-relaxed">
                {hint}
              </p>
            </div>
          );
        })}
      </div>

      {/* XP Summary */}
      {revealedHints.length > 0 && (
        <div className="bg-slate-700 bg-opacity-50 rounded-lg p-3 border border-slate-600">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-300">
              <span className="font-medium">XP Reward:</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`line-through text-slate-500 ${allRevealed ? '' : ''}`}>
                {xpReward} XP
              </span>
              <span className="text-white font-bold">
                {calculateFinalXP(revealedHints.length - 1)} XP
              </span>
              {revealedHints.length > 1 && (
                <span className="text-orange-400 text-sm">
                  (-{calculateXPPenalty(revealedHints.length - 1)}%)
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hover Info */}
      {revealedHints.length === 0 && (
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="text-xs text-slate-500 text-center">
            💡 Hints reduce XP rewards but help you learn
          </div>

          {isHovered && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-slate-700 border border-slate-600 rounded-lg text-xs text-slate-300 whitespace-nowrap z-10">
              <div>Hint 1: -10% XP</div>
              <div>Hint 2: -25% XP</div>
              <div>Hint 3: -50% XP</div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                <div className="w-2 h-2 bg-slate-700 border-r border-b border-slate-600 transform rotate-45"></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};