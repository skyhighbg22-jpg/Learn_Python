import React from 'react';
import { SmoothTransition, BounceIn, LiquidFill } from './Animations';

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animated?: boolean;
  shimmer?: boolean;
}

export const Skeleton = ({
  className = '',
  height = 'h-4',
  width = 'w-full',
  variant = 'rectangular',
  animated = true,
  shimmer = true
}: SkeletonProps) => {
  const baseClasses = 'bg-slate-700 rounded relative overflow-hidden';
  const animationClass = animated ? 'animate-pulse' : '';
  const variantClasses = {
    text: 'h-4 w-3/4',
    circular: 'h-12 w-12 rounded-full',
    rectangular: `${height} ${width}`
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClass} ${className}`}
    >
      {shimmer && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      )}
    </div>
  );
};

// Skeleton Card for lesson cards
export const SkeletonCard = () => {
  return (
    <BounceIn delay={100}>
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover-lift transition-all duration-300">
        <SmoothTransition delay={200}>
          <div className="flex items-start gap-4 mb-4">
            <Skeleton variant="circular" className="flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton width="w-3/4" className="h-6" />
              <Skeleton width="w-1/2" className="h-4" />
            </div>
          </div>
        </SmoothTransition>
        <div className="space-y-2">
          <Skeleton width="w-full" className="h-4" />
          <Skeleton width="w-5/6" className="h-4" />
          <Skeleton width="w-4/5" className="h-4" />
        </div>
      </div>
    </BounceIn>
  );
};

// Skeleton for stats
export const SkeletonStats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <BounceIn key={index} delay={index * 100}>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover-lift transition-all duration-300">
            <SmoothTransition delay={200}>
              <div className="space-y-3">
                <Skeleton variant="circular" width="w-8 h-8" />
                <Skeleton width="w-3/4" className="h-6" />
                <Skeleton width="w-1/2" className="h-3" />
              </div>
            </SmoothTransition>
          </div>
        </BounceIn>
      ))}
    </div>
  );
};

// Skeleton for table/list items
export const SkeletonListItem = () => {
  return (
    <BounceIn delay={100}>
      <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg border border-slate-700 hover-lift transition-all duration-300">
        <SmoothTransition delay={150}>
          <Skeleton variant="circular" className="flex-shrink-0" />
        </SmoothTransition>
        <SmoothTransition delay={200}>
          <div className="flex-1 space-y-2">
            <Skeleton width="w-2/3" className="h-4" />
            <Skeleton width="w-1/2" className="h-3" />
          </div>
        </SmoothTransition>
        <SmoothTransition delay={250}>
          <div className="text-right space-y-2">
            <Skeleton width="w-20" className="h-4" />
            <Skeleton width="w-16" className="h-3" />
          </div>
        </SmoothTransition>
      </div>
    </BounceIn>
  );
};