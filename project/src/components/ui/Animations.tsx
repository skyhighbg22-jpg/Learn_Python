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

// Enhanced animation components
export const SmoothTransition = ({ children, duration = 300, delay = 0, className = '' }: {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}) => (
  <div
    className={className}
    style={{
      transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      transitionDelay: `${delay}ms`,
    }}
  >
    {children}
  </div>
);

export const MorphTransition = ({ children, className = '' }: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`
      transition-all duration-500 ease-in-out
      transform-gpu
      will-change-transform
      ${className}
    `}
  >
    {children}
  </div>
);

// Spring animation wrapper
export const SpringWrapper = ({
  children,
  tension = 280,
  friction = 60,
  className = ''
}: {
  children: React.ReactNode;
  tension?: number;
  friction?: number;
  className?: string;
}) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        transform transition-all duration-700
        ${isMounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        ${className}
      `}
      style={{
        transitionTimingFunction: `cubic-bezier(0.34, 1.56, 0.64, 1)`,
      }}
    >
      {children}
    </div>
  );
};

// Bounce entrance animation
export const BounceIn = ({ children, delay = 0, className = '' }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <div
    className={`
      animate-in animate-bounce-in
      ${className}
    `}
    style={{
      animationDelay: `${delay}ms`,
      animationDuration: '600ms',
      animationTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    }}
  >
    {children}
  </div>
);

// Elastic scale animation
export const ElasticScale = ({ children, trigger = false, className = '' }: {
  children: React.ReactNode;
  trigger?: boolean;
  className?: string;
}) => (
  <div
    className={`
      transition-transform duration-300
      ${trigger ? 'scale-105' : 'scale-100'}
      ${className}
    `}
    style={{
      transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    }}
  >
    {children}
  </div>
);

// Liquid fill animation for progress bars
export const LiquidFill = ({ progress = 0, className = '' }: {
  progress: number;
  className?: string;
}) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div
      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
      style={{
        width: `${progress}%`,
        transform: `translateX(-${100 - progress}%)`,
        transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="absolute inset-0 bg-white opacity-20 animate-shimmer" />
    </div>
  </div>
);

// Ripple effect for buttons
export const RippleEffect = ({ children, className = '' }: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [ripples, setRipples] = React.useState<Array<{id: number, x: number, y: number}>>([]);

  const createRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <div className={`relative overflow-hidden cursor-pointer ${className}`} onClick={createRipple}>
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white opacity-30 rounded-full animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animationDuration: '600ms',
          }}
        />
      ))}
    </div>
  );
};

// Magnetic hover effect
export const MagneticHover = ({ children, strength = 0.3, className = '' }: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      className={`transition-transform duration-200 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {children}
    </div>
  );

// CSS-in-JS animation styles (to be added to global styles)
export const animationStyles = `
  /* Enhanced page transitions */
  .page-transition {
    position: relative;
    overflow: hidden;
  }

  .page-transition-content {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease-out;
  }

  /* Enhanced stagger animations */
  .stagger-container > * {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .stagger-container.animate-in > * {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  /* New keyframe animations */
  @keyframes bounce-in {
    0% {
      opacity: 0;
      transform: scale(0.3) translateY(-50px);
    }
    50% {
      opacity: 1;
      transform: scale(1.05) translateY(10px);
    }
    70% {
      transform: scale(0.95) translateY(-5px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes liquid-fill {
    0% {
      transform: translateX(-100%) scaleX(1);
    }
    50% {
      transform: translateX(-50%) scaleX(1.1);
    }
    100% {
      transform: translateX(0) scaleX(1);
    }
  }

  @keyframes slide-in-blur {
    0% {
      opacity: 0;
      transform: translateY(40px) scale(0.9);
      filter: blur(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }
  }

  @keyframes glow-pulse {
    0%, 100% {
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    }
    50% {
      box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.2);
    }
  }

  @keyframes float-rotate {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    25% {
      transform: translateY(-10px) rotate(1deg);
    }
    75% {
      transform: translateY(-5px) rotate(-1deg);
    }
  }

  /* Custom animation classes */
  .animate-bounce-in {
    animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .animate-liquid-fill {
    animation: liquid-fill 1.5s ease-out;
  }

  .animate-slide-in-blur {
    animation: slide-in-blur 0.7s ease-out;
  }

  .animate-glow-pulse {
    animation: glow-pulse 2s ease-in-out infinite;
  }

  .animate-float-rotate {
    animation: float-rotate 4s ease-in-out infinite;
  }

  /* Enhanced transitions */
  .transition-smooth {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .transition-bounce {
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .transition-elastic {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* Glass morphism with animation */
  .glass-enhanced {
    backdrop-filter: blur(20px);
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(148, 163, 184, 0.1);
    transition: all 0.3s ease-out;
  }

  .glass-enhanced:hover {
    backdrop-filter: blur(25px);
    background: rgba(30, 41, 59, 0.9);
    border-color: rgba(148, 163, 184, 0.2);
  }

  /* Enhanced focus states */
  .focus-enhanced {
    position: relative;
  }

  .focus-enhanced:focus-visible {
    outline: none;
  }

  .focus-enhanced:focus-visible::after {
    content: '';
    position: absolute;
    inset: -2px;
    border: 2px solid #3b82f6;
    border-radius: 8px;
    animation: glow-pulse 1.5s ease-in-out infinite;
  }

  /* Micro-interactions */
  .micro-bounce {
    transition: transform 0.15s ease-out;
  }

  .micro-bounce:hover {
    transform: translateY(-2px);
  }

  .micro-bounce:active {
    transform: translateY(0);
  }

  /* Particle background animation */
  .particle-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .particle {
    position: absolute;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent);
    border-radius: 50%;
    animation: float-rotate 6s ease-in-out infinite;
  }

  /* Responsive animation adjustments */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  @media (max-width: 768px) {
    .animate-bounce-in,
    .animate-slide-in-blur {
      animation-duration: 0.4s;
    }
  }
`;