import React, { useState, useEffect } from 'react';
import { CheckCircle, Trophy, Star, Zap, Crown, Gem } from 'lucide-react';
import AchievementService from '../services/achievementService';

interface AchievementNotificationProps {
  achievementId: string;
  title: string;
  description: string;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  onClose: () => void;
  duration?: number;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievementId,
  title,
  description,
  xpReward,
  rarity,
  onClose,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Rarity styling
  const rarityStyles = {
    common: {
      background: 'linear-gradient(135deg, #94a3b8, #64748b)',
      icon: <CheckCircle className="w-6 h-6" />,
      borderColor: '#64748b',
      shadow: '0 4px 6px -1px rgb(71 85 105 / 0.3)'
    },
    rare: {
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      icon: <Star className="w-6 h-6" />,
      borderColor: '#1d4ed8',
      shadow: '0 4px 6px -1px rgb(37 99 235 / 0.3)'
    },
    epic: {
      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      icon: <Zap className="w-6 h-6" />,
      borderColor: '#7c3aed',
      shadow: '0 4px 6px -1px rgb(147 51 234 / 0.3)'
    },
    legendary: {
      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      icon: <Crown className="w-6 h-6" />,
      borderColor: '#d97706',
      shadow: '0 4px 6px -1px rgb(245 158 11 / 0.3)'
    }
  };

  const currentStyle = rarityStyles[rarity];

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);

    // Auto-close after duration
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`
        fixed top-4 right-4 max-w-sm w-full transform transition-all duration-300 ease-out
        ${isVisible && !isClosing ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        ${isClosing ? 'translate-x-full opacity-0 scale-95' : ''}
        z-50
      `}
    >
      <div
        className={`
          rounded-lg border-2 shadow-lg backdrop-blur-sm
          ${currentStyle.borderColor}
        `}
        style={{
          background: currentStyle.background,
          boxShadow: currentStyle.shadow
        }}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="text-white">
                {currentStyle.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">
                  Achievement Unlocked!
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-white/90 text-xs uppercase font-semibold bg-white/20 px-2 py-1 rounded">
                    {rarity.toUpperCase()}
                  </span>
                  {xpReward > 0 && (
                    <span className="text-yellow-300 text-xs font-semibold flex items-center">
                      <Gem className="w-3 h-3 mr-1" />
                      +{xpReward} XP
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Close notification"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-base">
              {title}
            </h4>
            <p className="text-white/80 text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Progress indicator animation */}
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: isVisible ? '100%' : '0%',
                  transitionDelay: '200ms'
                }}
              />
            </div>
          </div>
        </div>

        {/* Sparkle effects for legendary rarity */}
        {rarity === 'legendary' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Achievement notification container component
interface AchievementNotificationContainerProps {
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    xpReward: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>;
}

const AchievementNotificationContainer: React.FC<AchievementNotificationContainerProps> = ({
  achievements
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (achievements.length > 0) {
      // Show notifications with a delay between them
      achievements.forEach((achievement, index) => {
        setTimeout(() => {
          setVisibleNotifications(prev => [...prev, achievement.id]);
        }, index * 600); // 600ms delay between notifications
      });
    }
  }, [achievements]);

  const handleClose = (achievementId: string) => {
    setVisibleNotifications(prev => prev.filter(id => id !== achievementId));
  };

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4 pointer-events-none">
      {achievements
        .filter(achievement => visibleNotifications.includes(achievement.id))
        .map((achievement, index) => (
          <div
            key={achievement.id}
            className="pointer-events-auto"
            style={{
              transform: `translateY(${index * 20}px)`, // Stack notifications
            }}
          >
            <AchievementNotification
              achievementId={achievement.id}
              title={achievement.title}
              description={achievement.description}
              xpReward={achievement.xpReward}
              rarity={achievement.rarity}
              onClose={() => handleClose(achievement.id)}
              duration={6000} // Slightly longer for stacked notifications
            />
          </div>
        ))}
    </div>
  );
};

export { AchievementNotification, AchievementNotificationContainer };
export default AchievementNotificationContainer;