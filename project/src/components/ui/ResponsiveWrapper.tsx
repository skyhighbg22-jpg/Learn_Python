import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  className?: string;
  showMobileToggle?: boolean;
  mobileTitle?: string;
}

interface Breakpoint {
  name: string;
  width: number;
}

export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint['name']>('lg');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const breakpoints: Breakpoint[] = [
      { name: 'sm', width: 640 },
      { name: 'md', width: 768 },
      { name: 'lg', width: 1024 },
      { name: 'xl', width: 1280 },
      { name: '2xl', width: 1536 },
    ];

    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const currentBreakpoint = breakpoints
        .filter(bp => width >= bp.width)
        .sort((a, b) => b.width - a.width)[0];

      setBreakpoint(currentBreakpoint.name);
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);

    return () => {
      window.removeEventListener('resize', updateBreakpoint);
    };
  }, []);

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    isLargeScreen: window.innerWidth >= 1024,
  };
};

export const ResponsiveWrapper = ({
  children,
  className = '',
  showMobileToggle = false,
  mobileTitle
}: ResponsiveWrapperProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isMobile } = useResponsive();

  return (
    <div className={`relative ${className}`}>
      {/* Mobile menu toggle */}
      {showMobileToggle && isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed top-4 right-4 z-40 p-2 bg-slate-800 rounded-lg border border-slate-600 md:relative md:top-auto md:right-auto"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <X className="text-white" size={24} />
          ) : (
            <Menu className="text-white" size={24} />
          )}
        </button>
      )}

      {/* Mobile menu overlay */}
      {showMobileToggle && isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 right-0 bottom-0 z-40 bg-slate-800 border-l border-slate-600 md:hidden">
            <div className="h-full overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">{mobileTitle || 'Menu'}</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="text-white" size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {React.Children.map(children, (child, index) => (
                  <div key={index} className="py-2">
                    {child}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <div className={`${showMobileToggle && isMobile ? 'hidden lg:block' : ''}`}>
        {children}
      </div>
    </div>
  );
};

// Responsive grid component
interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    gap?: string;
  };
}

export const ResponsiveGrid = ({
  children,
  columns = { sm: 1, md: 2, lg: 3, xl: 4, gap: 'gap-4' }
}: ResponsiveGridProps) => {
  const { breakpoint } = useResponsive();

  const getGridClasses = () => {
    switch (breakpoint) {
      case 'sm':
        return `grid grid-cols-${columns.sm} ${columns.gap || 'gap-4'}`;
      case 'md':
        return `grid grid-cols-${columns.md} ${columns.gap || 'gap-4'}`;
      case 'lg':
        return `grid grid-cols-${columns.lg} ${columns.gap || 'gap-4'}`;
      case 'xl':
        return `grid grid-cols-${columns.xl} ${columns.gap || 'gap-4'}`;
      default:
        return `grid grid-cols-${columns.lg} ${columns.gap || 'gap-4'}`;
    }
  };

  return <div className={getGridClasses()}>{children}</div>;
};

// Responsive text component
interface ResponsiveTextProps {
  children: React.ReactNode;
  size?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  className?: string;
}

export const ResponsiveText = ({
  children,
  size = { sm: 'text-sm', md: 'text-base', lg: 'text-lg', xl: 'text-xl' },
  className = ''
}: ResponsiveTextProps) => {
  const { breakpoint } = useResponsive();

  const getTextClass = () => {
    switch (breakpoint) {
      case 'sm':
        return size.sm;
      case 'md':
        return size.md;
      case 'lg':
        return size.lg;
      case 'xl':
        return size.xl;
      default:
        return size.lg;
    }
  };

  return <div className={`${getTextClass()} ${className}`}>{children}</div>;
};

// Mobile-optimized card component
interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  title?: string;
}

export const MobileCard = ({
  children,
  className = '',
  collapsible = false,
  title
}: MobileCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { isMobile } = useResponsive();

  const shouldCollapse = collapsible && isMobile;

  return (
    <div className={`bg-slate-800 rounded-lg border border-slate-700 ${className}`}>
      {/* Mobile card header */}
      {shouldCollapse && title && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-700 transition-colors"
        >
          <h3 className="text-white font-semibold">{title}</h3>
          <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
            </svg>
          </div>
        </button>
      )}

      {/* Mobile card content */}
      {(!shouldCollapse || isExpanded) && (
        <div className={shouldCollapse ? 'p-4 pt-0' : 'p-4'}>
          {children}
        </div>
      )}
    </div>
  );
};

// Touch-friendly button component
interface TouchButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'danger';
}

export const TouchButton = ({
  children,
  onClick,
  className = '',
  size = 'md',
  variant = 'primary'
}: TouchButtonProps) => {
  const { isMobile } = useResponsive();

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  const baseClasses = isMobile
    ? 'min-h-[44px] min-w-[44px] touch-manipulation' // Mobile touch targets
    : '';

  return (
    <button
      onClick={onClick}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-lg font-medium transition-all duration-200 transform active:scale-95
        ${className}
      `}
    >
      {children}
    </button>
  );
};