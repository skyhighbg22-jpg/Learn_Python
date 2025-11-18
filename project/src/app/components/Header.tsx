import { Flame, Heart, Zap, Trophy, Crown, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ProfilePictureUpload } from './ui/ProfilePictureUpload';
import AdManager from './ads/AdManager';
import { useEffect, useState } from 'react';
import {
  SpringWrapper,
  BounceIn,
  SmoothTransition,
  ElasticScale,
  MorphTransition,
  RippleEffect,
  MagneticHover,
  LiquidFill
} from './ui/Animations';

export const Header = () => {
  const { profile, user, loading, updateProfileAvatar } = useAuth();
  const [animatedStats, setAnimatedStats] = useState({
    streak: 0,
    hearts: 5,
    xp: 0
  });

  // Animate stats when they change
  useEffect(() => {
    if (profile) {
      const timer = setTimeout(() => {
        setAnimatedStats({
          streak: profile.current_streak || 0,
          hearts: profile.hearts || 5,
          xp: profile.total_xp || 0
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [profile]);

  // Add debugging information during development
  if (process.env.NODE_ENV === 'development') {
    console.log('Header render - profile:', profile, 'user:', user, 'loading:', loading);
  }

  const getLeagueIcon = (league: string) => {
    switch (league?.toLowerCase()) {
      case 'diamond':
        return <Crown className="text-cyan-400" size={16} />;
      case 'platinum':
        return <Star className="text-purple-400" size={16} />;
      case 'gold':
        return <Trophy className="text-yellow-400" size={16} />;
      case 'silver':
        return <Trophy className="text-slate-400" size={16} />;
      default:
        return <Trophy className="text-orange-600" size={16} />;
    }
  };

  const getLeagueColor = (league: string) => {
    switch (league?.toLowerCase()) {
      case 'diamond':
        return 'text-cyan-400';
      case 'platinum':
        return 'text-purple-400';
      case 'gold':
        return 'text-yellow-400';
      case 'silver':
        return 'text-slate-400';
      default:
        return 'text-orange-600';
    }
  };

  return (
    <div className="glass border-b border-slate-700 px-6 py-4 animate-in animate-fade-in">
      <div className="flex items-center justify-between">
        {/* Enhanced Stats Section */}
        <div className="flex items-center gap-4">
          {/* Enhanced Streak Card */}
          <MagneticHover strength={0.15}>
            <BounceIn delay={100}>
              <div className="stat-card group relative overflow-hidden hover-lift hover-glow">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <div className="relative">
                    <ElasticScale trigger={animatedStats.streak > 0}>
                      <Flame className="text-orange-500 animate-pulse" size={24} />
                    </ElasticScale>
                    {animatedStats.streak > 0 && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <SmoothTransition duration={500}>
                      <span
                        className="text-white font-bold text-lg tabular-nums transition-all duration-300"
                        key={`streak-${animatedStats.streak}`}
                      >
                        {animatedStats.streak}
                      </span>
                    </SmoothTransition>
                    <span className="text-slate-400 text-xs font-medium">day streak</span>
                  </div>
                </div>
              </div>
            </BounceIn>
          </MagneticHover>

          {/* Enhanced Hearts Card */}
          <MagneticHover strength={0.12}>
            <BounceIn delay={200}>
              <div className="stat-card group relative overflow-hidden hover-lift hover-glow">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <div className="relative">
                    <ElasticScale trigger={animatedStats.hearts > 0}>
                      <Heart className="text-red-500 transition-transform duration-300 hover:scale-110 animate-pulse" size={24} />
                    </ElasticScale>
                    <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-20 animate-pulse"></div>
                  </div>
                  <div className="flex flex-col">
                    <SmoothTransition duration={500}>
                      <span
                        className="text-white font-bold text-lg tabular-nums transition-all duration-300"
                        key={`hearts-${animatedStats.hearts}`}
                      >
                        {animatedStats.hearts}
                      </span>
                    </SmoothTransition>
                    <span className="text-slate-400 text-xs font-medium">hearts</span>
                  </div>
                </div>
              </div>
            </BounceIn>
          </MagneticHover>

          {/* Enhanced XP Card */}
          <MagneticHover strength={0.1}>
            <BounceIn delay={300}>
              <div className="stat-card group relative overflow-hidden hover-lift hover-glow">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-warning-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <div className="relative">
                    <ElasticScale trigger={animatedStats.xp > 0}>
                      <Zap className="text-warning-400 animate-pulse" size={24} />
                    </ElasticScale>
                    <div className="absolute -inset-2 bg-yellow-500 rounded-full blur-md opacity-20 animate-pulse"></div>
                  </div>
                  <div className="flex flex-col">
                    <SmoothTransition duration={500}>
                      <span
                        className="text-white font-bold text-lg tabular-nums transition-all duration-300"
                        key={`xp-${animatedStats.xp}`}
                      >
                        {animatedStats.xp.toLocaleString()}
                      </span>
                    </SmoothTransition>
                    <span className="text-slate-400 text-xs font-medium">total XP</span>
                  </div>
                </div>
              </div>
            </BounceIn>
          </MagneticHover>
        </div>

        {/* Enhanced Profile Section */}
        <BounceIn delay={400}>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <SmoothTransition duration={600}>
                <p className="text-white font-semibold text-lg transition-all duration-300">
                  {loading ? (
                    'Loading...'
                  ) : (
                    profile?.display_name ||
                    profile?.username ||
                    user?.email?.split('@')[0] || // Use email prefix as fallback
                    'Python Coder' // Remove "New" to make it less temporary
                  )}
                </p>
              </SmoothTransition>
              <SmoothTransition delay={200} duration={400}>
                <div className="flex items-center gap-2 justify-end">
                  <MorphTransition>
                    {getLeagueIcon(profile?.league || 'Bronze')}
                  </MorphTransition>
                  <span className={`text-sm font-medium capitalize transition-colors duration-300 ${getLeagueColor(profile?.league || 'Bronze')}`}>
                    {profile?.league || 'Bronze'} League
                  </span>
                </div>
              </SmoothTransition>
            </div>

            {/* Enhanced Avatar */}
            <MagneticHover strength={0.2}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-info-500 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md"></div>
                <SmoothTransition duration={400}>
                  <div className="relative transition-transform duration-300 hover:scale-110">
                    <ProfilePictureUpload
                      currentAvatar={profile?.avatar_url}
                      onAvatarChange={updateProfileAvatar}
                      userId={profile?.id || ''}
                      size="md"
                      className="relative"
                    />
                  </div>
                </SmoothTransition>
                {/* Level badge */}
                <BounceIn delay={500}>
                  <div className="absolute -bottom-1 -right-1 bg-warning-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-800 transition-transform duration-300 hover:scale-125 animate-bounce-gentle">
                    {profile?.current_level || 1}
                  </div>
                </BounceIn>
              </div>
            </MagneticHover>
        </div>
      </div>

      {/* XP Progress Bar */}
      <BounceIn delay={600}>
        <div className="mt-4">
          <SmoothTransition duration={500}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium transition-colors duration-300">Level Progress</span>
              <span className="text-xs text-primary-400 font-medium transition-all duration-300">
                {((profile?.total_xp || 0) % 100)}/100 XP to Level {(profile?.current_level || 1) + 1}
              </span>
            </div>
          </SmoothTransition>
          <div className="progress-bar h-3 hover-lift">
            <LiquidFill
              progress={((profile?.total_xp || 0) % 100)}
              className="h-3"
            >
              {/* Animated progress indicator */}
              <SmoothTransition duration={300}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg animate-pulse animate-glow"></div>
              </SmoothTransition>
              {/* Progress glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-warning-400 opacity-30 rounded-full blur-sm animate-glow-pulse"></div>
            </LiquidFill>
          </div>
        </div>
      </BounceIn>

      {/* Header Ad Banner */}
      <BounceIn delay={700}>
        <div className="mt-4">
          <AdManager adType="banner" className="w-full" />
        </div>
      </BounceIn>
    </div>
  );
};
