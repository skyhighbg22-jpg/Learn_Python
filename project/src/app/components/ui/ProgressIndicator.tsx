import React from 'react';
import { CheckCircle, Clock, TrendingUp, Zap, Loader2 } from 'lucide-react';

export interface ProgressIndicatorProps {
  value: number;
  max: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'yellow' | 'purple';
  showPercentage?: boolean;
  showText?: boolean;
  animated?: boolean;
  label?: string;
}

export const ProgressIndicator = ({
  value,
  max,
  size = 'md',
  color = 'blue',
  showPercentage = true,
  showText = true,
  animated = false,
  label
}: ProgressIndicatorProps) => {
  const percentage = Math.min((value / max) * 100, 100);
  const isComplete = percentage >= 100;

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  };

  const bgColors = {
    blue: 'bg-blue-900',
    green: 'bg-green-900',
    yellow: 'bg-yellow-900',
    purple: 'bg-purple-900'
  };

  const textColors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400'
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300">{label}</span>
          <span className={`font-medium ${textColors[color]}`}>
            {value} / {max}
          </span>
        </div>
      )}

      <div className="relative">
        {/* Background bar */}
        <div className={`w-full ${sizeClasses[size]} ${bgColors[color]} rounded-full`} />

        {/* Progress bar */}
        <div
          className={`
            absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out
            ${sizeClasses[size]} ${colorClasses[color]}
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />

        {/* Shimmer effect when animated */}
        {animated && percentage < 100 && (
          <div
            className={`
              absolute top-0 left-0 h-full rounded-full
              bg-gradient-to-r from-transparent via-white/10 to-transparent
              animate-pulse
              ${sizeClasses[size]}
            `}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>

      {/* Percentage text */}
      {showPercentage && (
        <div className="flex items-center justify-center mt-2">
          {isComplete ? (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle size={16} />
              <span className="text-sm font-medium">Complete!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${textColors[color]}`}>
                {Math.round(percentage)}%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Lesson progress component
export const LessonProgress = ({
  completed,
  total,
  showDetails = false
}: {
  completed: number;
  total: number;
  showDetails?: boolean;
}) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const isComplete = completed === total && total > 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle className="text-green-400" size={16} />
          ) : (
            <TrendingUp className="text-blue-400" size={16} />
          )}
          <span className="text-slate-300 font-medium">
            Progress
          </span>
        </div>
        <span className="text-slate-400 text-sm">
          {completed} / {total}
        </span>
      </div>

      <ProgressIndicator
        value={completed}
        max={total}
        size="md"
        color={isComplete ? 'green' : 'blue'}
        animated={!isComplete}
      />

      {showDetails && (
        <div className="text-sm text-slate-400">
          {isComplete ? (
            <span className="text-green-400">Section completed! 🎉</span>
          ) : (
            <span>{total - completed} lessons remaining</span>
          )}
        </div>
      )}
    </div>
  );
};

// XP Progress component
export const XPProgress = ({
  currentXP,
  nextLevelXP = 100
}: {
  currentXP: number;
  nextLevelXP?: number;
}) => {
  const currentLevelXP = currentXP % nextLevelXP;
  const percentage = (currentLevelXP / nextLevelXP) * 100;
  const currentLevel = Math.floor(currentXP / nextLevelXP) + 1;
  const xpToNext = nextLevelXP - currentLevelXP;

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="text-yellow-400" size={20} />
          <span className="text-white font-semibold">Level {currentLevel}</span>
        </div>
        <div className="text-right">
          <div className="text-slate-400 text-sm">Total XP</div>
          <div className="text-white font-semibold">{currentXP}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300">Level Progress</span>
          <span className="text-blue-400 font-medium">
            {currentLevelXP} / {nextLevelXP}
          </span>
        </div>

        <ProgressIndicator
          value={currentLevelXP}
          max={nextLevelXP}
          size="sm"
          color="blue"
          label={`${xpToNext} XP to next level`}
        />
      </div>
    </div>
  );
};

// Loading spinner with different styles
export const LoadingSpinner = ({
  size = 'md',
  message,
  variant = 'default'
}: {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  variant?: 'default' | 'dots' | 'pulse';
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  if (variant === 'dots') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        {message && <span className="ml-3 text-slate-400">{message}</span>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className="flex items-center gap-3">
        <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-pulse`} />
        {message && <span className="text-slate-400">{message}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} border-2 border-blue-500 border-t-transparent rounded-full animate-spin`} />
      {message && <span className="text-slate-400">{message}</span>}
    </div>
  );
};