import React, { useEffect } from 'react';

interface CelebrationProps {
  trigger: boolean;
  onComplete?: () => void;
  message?: string;
  type?: 'success' | 'achievement' | 'levelup';
}

export const Celebration = ({ trigger, onComplete, message, type = 'success' }: CelebrationProps) => {
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Success Animation */}
        <div className="relative">
          {type === 'success' && (
            <div className="relative">
              {/* Sparkle effects */}
              {[...Array.from({ length: 12 })].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-pulse"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: '2s',
                  }}
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              ))}

              {/* Success message */}
              <div className="relative bg-green-600 text-white px-8 py-6 rounded-2xl shadow-2xl animate-in animate-bounce-in">
                <div className="flex items-center justify-center mb-4">
                  <div className="text-6xl font-bold">🎉</div>
                </div>
                <div className="text-2xl font-bold mb-2">Excellent!</div>
                {message && <div className="text-xl mb-2">{message}</div>}
                <div className="text-lg text-center">Keep up the great work!</div>
              </div>
              <div className="flex items-center gap-2 justify-center mt-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 1l-6 11 2l17-7a2 12 7z-2m8 5l-1 13-6 2l5 6z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievement Animation */}
        {type === 'achievement' && (
          <div className="relative">
            {/* Trophy animation */}
            <div className="relative w-24 h-24 animate-bounce-in">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl animate-pulse">🏆</div>
              </div>
            </div>

            <div className="relative bg-yellow-600 text-white px-8 py-6 rounded-2xl shadow-2xl animate-in animate-zoom-in">
              <div className="text-2xl font-bold mb-2">Achievement Unlocked!</div>
              {message && <div className="text-xl mb-2">{message}</div>}
              <div className="text-lg text-center">You're becoming a Python master!</div>
            </div>
          </div>
        )}

        {/* Level Up Animation */}
        {type === 'levelup' && (
          <div className="relative">
            {/* Level up effect */}
            <div className="relative">
              <div className="text-6xl font-bold animate-bounce-in">⬆️</div>
              <div className="text-white">LEVEL UP!</div>
            </div>

            <div className="mt-4 bg-purple-600 text-white px-8 py-6 rounded-2xl shadow-2xl animate-in animate-zoom-in">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">Congratulations!</div>
                <div className="text-xl mb-2">You've reached a new level!</div>
                <div className="text-lg">Keep learning and growing your skills!</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dismiss automatically */}
      <div
        className="absolute bottom-8 right-8 animate-pulse"
        onClick={() => setIsVisible(false)}
      >
        <div className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
          Tap to dismiss
        </div>
      </div>
    </div>
  );
};

// Simple success animation component
export const SuccessCheckmark = ({ size = 24 }: { size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      className="animate-in animate-bounce-in"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12l2 4m6 2 7l18 9" />
      <path
        d="M21 12l-2 4-4-4m2 4-4.19l19 12-4-4.19"
        className="animate-in animate-delay-200"
        strokeWidth={2}
      />
    </svg>
  );
};