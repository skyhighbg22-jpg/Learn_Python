import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, RotateCcw, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

type LeaderboardEntry = {
  id: string;
  username: string;
  display_name: string;
  total_xp: number;
  league: string;
  current_streak: number;
};

export const LeaderboardView = () => {
  const { profile } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setError(null);
      setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, total_xp, league, current_streak')
        .order('total_xp', { ascending: false })
        .limit(50);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      // Add data validation
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data received from server');
      }

      // Filter out invalid entries and ensure required fields
      const validLeaderboardData = data
        .filter(user => user && user.id && user.username) // Filter out invalid entries
        .map(user => ({
          ...user,
          display_name: user.display_name || user.username || 'Anonymous',
          total_xp: Math.max(0, user.total_xp || 0),
          league: user.league || 'Bronze',
          current_streak: Math.max(0, user.current_streak || 0)
        }));

      setLeaderboard(validLeaderboardData);
      setRetryCount(0);
    } catch (error: any) {
      console.error('Error loading leaderboard:', error);
      setError(error.message || 'Failed to load leaderboard');
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-slate-400" size={24} />;
      case 3:
        return <Award className="text-orange-600" size={24} />;
      default:
        return <span className="text-slate-400 font-bold">{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Leaderboard</h2>
        <p className="text-slate-400">Top learners this week</p>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
        <div className="bg-slate-900 px-6 py-4 grid grid-cols-12 gap-4 font-semibold text-slate-400 text-sm">
          <div className="col-span-1">Rank</div>
          <div className="col-span-5">User</div>
          <div className="col-span-2">League</div>
          <div className="col-span-2">Streak</div>
          <div className="col-span-2 text-right">Total XP</div>
        </div>

        <div className="divide-y divide-slate-700">
          {leaderboard.map((entry, index) => {
            const rank = index + 1;
            const isCurrentUser = entry.id === profile?.id;

            return (
              <div
                key={entry.id}
                className={`px-6 py-4 grid grid-cols-12 gap-4 items-center transition-colors ${
                  isCurrentUser ? 'bg-blue-900/20' : 'hover:bg-slate-700/50'
                }`}
              >
                <div className="col-span-1 flex items-center justify-center">
                  {getRankIcon(rank)}
                </div>
                <div className="col-span-5">
                  <p className="text-white font-semibold">{entry.display_name}</p>
                  <p className="text-slate-400 text-sm">@{entry.username}</p>
                </div>
                <div className="col-span-2">
                  <span className="inline-block px-3 py-1 bg-slate-700 rounded-full text-slate-300 text-sm capitalize">
                    {entry.league}
                  </span>
                </div>
                <div className="col-span-2 text-slate-300">
                  {entry.current_streak} days
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-yellow-500 font-bold text-lg">{entry.total_xp}</span>
                  <span className="text-slate-400 text-sm ml-1">XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {profile && !leaderboard.find((e) => e.id === profile.id) && (
        <div className="mt-6 bg-slate-800 rounded-xl p-6 border border-blue-700">
          <p className="text-slate-400 mb-2">Your Position</p>
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-1">
              <span className="text-slate-400 font-bold">-</span>
            </div>
            <div className="col-span-5">
              <p className="text-white font-semibold">{profile.display_name}</p>
            </div>
            <div className="col-span-2">
              <span className="inline-block px-3 py-1 bg-slate-700 rounded-full text-slate-300 text-sm capitalize">
                {profile.league}
              </span>
            </div>
            <div className="col-span-2 text-slate-300">{profile.current_streak} days</div>
            <div className="col-span-2 text-right">
              <span className="text-yellow-500 font-bold text-lg">{profile.total_xp}</span>
              <span className="text-slate-400 text-sm ml-1">XP</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
