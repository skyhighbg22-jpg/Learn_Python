import { Home, Users, Trophy, Target, BookOpen, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type SidebarProps = {
  currentView: string;
  onViewChange: (view: string) => void;
};

export const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const { profile, signOut } = useAuth();

  const menuItems = [
    { id: 'learn', label: 'LEARN', icon: Home },
    { id: 'practice', label: 'PRACTICE', icon: BookOpen },
    { id: 'challenges', label: 'CHALLENGES', icon: Target },
    { id: 'leaderboard', label: 'LEADERBOARD', icon: Trophy },
    { id: 'friends', label: 'FRIENDS', icon: Users },
    { id: 'profile', label: 'PROFILE', icon: User },
  ];

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-screen">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-3xl font-bold text-blue-400">PyLearn</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Icon size={20} />
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700 space-y-3">
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Level</span>
            <span className="text-white font-bold">{profile?.current_level || 1}</span>
          </div>
          <div className="mt-2 bg-slate-600 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${((profile?.total_xp || 0) % 100)}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={signOut}
          className="w-full flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
