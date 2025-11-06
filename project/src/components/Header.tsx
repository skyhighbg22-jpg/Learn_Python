import { Flame, Heart, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
  const { profile } = useAuth();

  return (
    <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg">
            <Flame className="text-orange-500" size={20} />
            <span className="text-white font-bold">{profile?.current_streak || 0}</span>
            <span className="text-slate-400 text-sm">day streak</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg">
            <Heart className="text-red-500" size={20} />
            <span className="text-white font-bold">{profile?.hearts || 5}</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg">
            <Zap className="text-yellow-500" size={20} />
            <span className="text-white font-bold">{profile?.total_xp || 0}</span>
            <span className="text-slate-400 text-sm">XP</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-white font-semibold">{profile?.display_name}</p>
            <p className="text-slate-400 text-sm capitalize">{profile?.league || 'Bronze'} League</p>
          </div>
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {profile?.display_name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};
