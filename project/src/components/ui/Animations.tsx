import React from 'react';

// Animation variants
export const animationVariants = {
  // Fade animations
  fadeIn: 'animate-in animate-fade-in',
  fadeOut: 'animate-out animate-fade-out',
  fadeInUp: 'animate-in animate-slide-in-from-bottom',
  fadeInDown: 'animate-in animate-slide-in-from-top',
  fadeInLeft: 'animate-in animate-slide-in-from-left',
  fadeInRight: 'animate-in animate-slide-in-from-right',

  // Scale animations
  scaleIn: 'animate-in animate-zoom-in',
  scaleOut: 'animate-out animate-zoom-out',
  scaleInUp: 'animate-in animate-bounce-in',
  scaleOutDown: 'animate-out animate-bounce-out',

  // Slide animations
  slideInUp: 'animate-in animate-slide-in-from-bottom',
  slideInDown: 'animate-in animate-slide-in-from-top',
  slideInLeft: 'animate-in animate-slide-in-from-left',
  slideInRight: 'animate-in animate-slide-in-from-right',
  slideOutUp: 'animate-out animate-slide-out-to-top',
  slideOutDown: 'animate-out animate-slide-out-to-bottom',
  slideOutLeft: 'animate-out animate-slide-out-to-left',
  slideOutRight: 'animate-out animate-slide-out-to-right',

  // Spin animations
  spin: 'animate-spin',
  ping: 'animate-ping',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',

  // Special effects
  shimmer: 'animate-shimmer',
  glow: 'animate-glow',
  float: 'animate-float',
} as const;

// Animated wrapper component
interface AnimatedWrapperProps {
  children: React.ReactNode;
  animation?: keyof typeof animationVariants;
  duration?: number;
  delay?: number;
  className?: string;
  onAnimationEnd?: () => void;
}

export const AnimatedWrapper = ({
  children,
  animation,
  duration = 300,
  delay = 0,
  className = '',
  onAnimationEnd
}: AnimatedWrapperProps) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleAnimationEnd = () => {
    if (onAnimationEnd) {
      onAnimationEnd();
    }
  };

  const getAnimationClasses = () => {
    if (!isVisible || !animation) return '';
    return `${animationVariants[animation]}`;
  };

  return (
    <div
      className={`
        ${getAnimationClasses()}
        ${className}
      `}
      style={{
        animationDuration: duration ? `${duration}ms` : undefined,
        animationDelay: delay ? `${delay}ms` : undefined,
      }}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
};

// Page transition wrapper
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className = '' }: PageTransitionProps) => {
  return (
    <div className={`page-transition ${className}`}>
      <div className="page-transition-content">
        {children}
      </div>
    </div>
  );
};

// Stagger animation for lists
interface StaggerWrapperProps {
  children: React.ReactNode;
  stagger?: number;
  className?: string;
}

export const StaggerWrapper = ({
  children,
  stagger = 100,
  className = ''
}: StaggerWrapperProps) => {
  return (
    <div className={`stagger-container ${className}`}>
      {React.Children.map(children, (child, index) => (
        <AnimatedWrapper
          key={index}
          animation="fadeInUp"
          delay={index * stagger}
        >
          {child}
        </AnimatedWrapper>
      ))}
    </div>
  );
};

// Hover lift animation
interface HoverLiftProps {
  children: React.ReactNode;
  className?: string;
  liftAmount?: 'sm' | 'md' | 'lg';
}

export const HoverLift = ({ children, className = '', liftAmount = 'md' }: HoverLiftProps) => {
  const liftClasses = {
    sm: 'hover:-translate-y-1 hover:shadow-lg',
    md: 'hover:-translate-y-2 hover:shadow-xl',
    lg: 'hover:-translate-y-3 hover:shadow-2xl'
  };

  return (
    <div
      className={`
        transition-all duration-300 ease-out
        ${liftClasses[liftAmount]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Reveal animation component
interface RevealProps {
  children: React.ReactNode;
  trigger?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export const Reveal = ({
  children,
  trigger = true,
  direction = 'up',
  className = ''
}: RevealProps) => {
  const getRevealAnimation = () => {
    if (!trigger) return 'hidden';

    switch (direction) {
      case 'up':
        return 'animate-in animate-slide-in-from-bottom';
      case 'down':
        return 'animate-in animate-slide-in-from-top';
      case 'left':
        return 'animate-in animate-slide-in-from-left';
      case 'right':
        return 'animate-in animate-slide-in-from-right';
      default:
        return 'animate-in animate-slide-in-from-bottom';
    }
  };

  return (
    <div
      className={`
        ${getRevealAnimation()}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Loading skeleton with shimmer effect
interface ShimmerProps {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export const Shimmer = ({ children, isLoading = false, className = '' }: ShimmerProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      )}
    </div>
  );
};

// CSS-in-JS animation styles (to be added to global styles)
export const animationStyles = `
  /* Page transitions */
  .page-transition {
    position: relative;
    overflow: hidden;
  }

  .page-transition-content {
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  }

  /* Stagger animations */
  .stagger-container > * {
    opacity: 0;
    transform: translateY(20px);
  }

  .animate-in {
    opacity: 1;
    transform: translateY(0);
  }

  /* Custom animations */
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
    }
    50% {
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }

  .animate-glow {
    animation: glow 2s ease-in-out infinite;
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  /* Smooth state transitions */
  .smooth-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Focus states */
  .focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Reduced motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;