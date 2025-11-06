import { Home, Users, Trophy, Target, BookOpen, User, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type SidebarProps = {
  currentView: string;
  onViewChange: (view: string) => void;
};

export const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const { profile, signOut } = useAuth();

  const menuItems = [
    { id: 'learn', label: 'LEARN', icon: Home, color: 'text-primary-400' },
    { id: 'practice', label: 'PRACTICE', icon: BookOpen, color: 'text-emerald-400' },
    { id: 'challenges', label: 'CHALLENGES', icon: Target, color: 'text-warning-400' },
    { id: 'leaderboard', label: 'LEADERBOARD', icon: Trophy, color: 'text-amber-400' },
    { id: 'friends', label: 'FRIENDS', icon: Users, color: 'text-info-400' },
    { id: 'profile', label: 'PROFILE', icon: User, color: 'text-slate-400' },
  ];

  const xpProgress = (profile?.total_xp || 0) % 100;

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-screen animate-in animate-fade-in">
      {/* Logo Section with Enhanced Styling */}
      <div className="p-6 border-b border-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-info-500 opacity-5"></div>
        <div className="relative flex items-center gap-3">
          <div className="relative">
            <Sparkles className="text-primary-400 absolute -top-2 -right-2 animate-pulse" size={16} />
            <h1 className="text-3xl font-bold text-gradient">PyLearn</h1>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2 animate-in animate-delay-100">Master Python, One Level at a Time</p>
      </div>

      {/* Navigation Menu with Enhanced Interactions */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`nav-item group ${
                isActive
                  ? 'nav-item-active'
                  : 'text-slate-300 hover:text-white'
              } animate-in animate-delay-${(index + 1) * 100}`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`relative transition-transform duration-250 group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                  <Icon
                    size={20}
                    className={`${isActive ? 'text-primary-400' : item.color} transition-colors duration-250`}
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-primary-400 rounded-full blur-md opacity-30 animate-pulse"></div>
                  )}
                </div>
                <span className={`font-semibold text-sm transition-all duration-250 ${
                  isActive ? 'text-primary-400' : 'group-hover:text-white'
                }`}>
                  {item.label}
                </span>
              </div>

              {/* Active State Indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary-400 to-primary-500 rounded-r-full animate-pulse-glow"></div>
              )}

              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-250 rounded-lg"></div>
            </button>
          );
        })}
      </nav>

      {/* Enhanced Level Progress Section */}
      <div className="p-4 border-t border-slate-700 space-y-3">
        <div className="card-enhanced p-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-warning-500 opacity-0 group-hover:opacity-5 transition-opacity duration-250"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-sm font-medium">Level</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-lg animate-number-pop" key={profile?.current_level || 1}>
                  {profile?.current_level || 1}
                </span>
                <Sparkles className="text-warning-400 animate-pulse" size={16} />
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="progress-bar relative">
              <div
                className="progress-fill relative"
                style={{ width: `${xpProgress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg animate-pulse"></div>
              </div>
              {/* Progress glow effect */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-primary-500 to-warning-500 opacity-20 rounded-full blur-sm transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-slate-500">XP Progress</span>
              <span className="text-xs text-primary-400 font-medium">{xpProgress}/100</span>
            </div>
          </div>
        </div>

        {/* Enhanced Sign Out Button */}
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-250 group btn-enhanced border border-slate-600 hover:border-slate-500"
        >
          <LogOut size={18} className="group-hover:scale-110 transition-transform duration-250" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
