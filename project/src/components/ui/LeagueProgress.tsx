import React from 'react';
import { Trophy, Zap, Target, TrendingUp, Medal, Award, Users } from 'lucide-react';

interface LeagueProgressProps {
  currentXP: number;
  currentLeague: string;
  xpToNextLeague: number;
  currentRank: number;
  totalInLeague: number;
  leagueUsers: Array<{
    rank: number;
    username: string;
    avatar?: string;
    xp: number;
    challenges_completed: number;
  }>;
}

export const LeagueProgress: React.FC<LeagueProgressProps> = ({
  currentXP,
  currentLeague,
  xpToNextLeague,
  currentRank,
  totalInLeague,
  leagueUsers
}) => {
  const getLeagueInfo = (league: string) => {
    const leagues = {
      bronze: {
        name: 'Bronze',
        description: 'Begin your Python journey',
        icon: '🥉',
        color: 'from-amber-700 to-orange-600',
        textColor: 'text-orange-400',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-600',
        minXP: 0,
        maxXP: 999
      },
      silver: {
        name: 'Silver',
        description: 'Developing solid Python skills',
        icon: '🥈',
        color: 'from-gray-400 to-gray-300',
        textColor: 'text-gray-300',
        bgColor: 'bg-gray-400/10',
        borderColor: 'border-gray-400',
        minXP: 1000,
        maxXP: 4999
      },
      gold: {
        name: 'Gold',
        description: 'Advanced Python programmer',
        icon: '🥇',
        color: 'from-yellow-400 to-yellow-600',
        textColor: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500',
        minXP: 5000,
        maxXP: 14999
      },
      platinum: {
        name: 'Platinum',
        description: 'Python mastery achieved',
        icon: '🏆',
        color: 'from-purple-400 to-pink-400',
        textColor: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500',
        minXP: 15000,
        maxXP: Infinity
      }
    };

    return leagues[league as keyof typeof leagues] || leagues.bronze;
  };

  const getProgressPercentage = () => {
    const leagueInfo = getLeagueInfo(currentLeague);
    if (leagueInfo.maxXP === Infinity) return 100;

    const leagueXP = currentXP - leagueInfo.minXP;
    const leagueRange = leagueInfo.maxXP - leagueInfo.minXP;

    return Math.min(100, Math.round((leagueXP / leagueRange) * 100));
  };

  const getLeaguePosition = () => {
    const position = currentRank / totalInLeague;
    const percentile = (1 - position) * 100;

    if (percentile >= 90) return { label: 'Top 10%', color: 'text-green-400' };
    if (percentile >= 75) return { label: 'Top 25%', color: 'text-blue-400' };
    if (percentile >= 50) return { label: 'Top 50%', color: 'text-yellow-400' };
    return { label: 'Upper Half', color: 'text-orange-400' };
  };

  const leagueInfo = getLeagueInfo(currentLeague);
  const progressPercent = getProgressPercentage();
  const leaguePosition = getLeaguePosition();

  return (
    <div className="space-y-6">
      {/* Current League Card */}
      <div className={`relative bg-gradient-to-r ${leagueInfo.color} rounded-2xl p-8 border-2 ${leagueInfo.borderColor}`}>
        <div className="absolute top-4 right-4">
          <div className="bg-slate-900 rounded-full px-3 py-1 border border-slate-600">
            <span className={`text-xs font-bold ${leagueInfo.textColor}`}>
              {leagueInfo.name}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-3xl">{leagueInfo.icon}</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {leagueInfo.name} League
              </h3>
              <p className="text-white/80 text-sm mb-3">{leagueInfo.description}</p>
              <div className="flex items-center gap-2 text-white/90">
                <Users className="w-4 h-4" />
                <span>#{currentRank} in {leagueInfo.name} League</span>
              </div>
            </div>
          </div>

          <button className="text-white/80 hover:text-white text-sm underline">
            View Full Leaderboard →
          </button>
        </div>

        {/* XP Progress to Next League */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm">League Progress</span>
            <span className="text-white/90 font-medium">{xpToNextLeague} XP to {getLeagueInfo(getNextLeague(currentLeague))?.name || 'Max'}</span>
          </div>

          <div className="bg-white/20 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${leagueInfo.color.replace('to-', 'from-')}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-white/80">
            <span>{currentXP} / {leagueInfo.minXP} XP</span>
            <span>{Math.round(progressPercent)}% Complete</span>
          </div>
        </div>

        {/* League Benefits */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className={`${leagueInfo.bgColor} ${leagueInfo.borderColor} rounded-lg p-3 border`}>
            <Trophy className={`${leagueInfo.textColor} mb-2`} size={20} />
            <h4 className={`font-semibold mb-1 ${leagueInfo.textColor}`}>Current League Benefits</h4>
            <ul className="text-sm text-white/90 space-y-1">
              <li>• {leagueInfo.name} badge on profile</li>
              <li>• {leagueInfo.name} rank display</li>
              <li>• Exclusive {leagueInfo.name} challenges</li>
              <li>• Priority support access</li>
            </ul>
          </div>

          <div className={`${leagueInfo.bgColor} ${leagueInfo.borderColor} rounded-lg p-3 border`}>
            <Zap className={`${leagueInfo.textColor} mb-2`} size={20} />
            <h4 className={`font-semibold mb-1 ${leagueInfo.textColor}`}>Next League Rewards</h4>
            <ul className="text-sm text-white/90 space-y-1">
              <li>• Enhanced profile customization</li>
              <li>• {getLeagueInfo(getNextLeague(currentLeague))?.name || 'Platinum'} benefits</li>
              <li>• Special achievement badges</li>
              <li>• Advanced learning content</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Top 10 in Your League */}
      <div className={`${leagueInfo.bgColor} rounded-2xl p-8 border ${leagueInfo.borderColor}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${leagueInfo.textColor} flex items-center gap-2`}>
            <Target className="mr-2" size={24} />
            Top 10 in {leagueInfo.name} League
          </h3>
          <div className="flex items-center gap-2 text-white/90">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">{leaguePosition.label}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leagueUsers.slice(0, 10).map((user, index) => (
            <div
              key={user.rank}
              className={`relative bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-all duration-200 hover:transform hover:scale-105 ${
                user.rank === currentRank ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
            >
              {/* Rank */}
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  user.rank === 1 ? 'bg-yellow-500 text-white' :
                  user.rank === 2 ? 'bg-gray-400 text-white' :
                  user.rank === 3 ? 'bg-orange-600 text-white' :
                  'bg-slate-600 text-slate-300'
                }`}>
                  #{user.rank}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-sm">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className={`font-semibold ${
                        user.rank === currentRank ? 'text-white' : 'text-slate-300'
                      }`}>
                        {user.username}
                      </p>
                      <p className="text-slate-500 text-sm">
                        Level {Math.floor(user.xp / 100)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-between text-sm text-slate-400 mt-2">
                <div>
                  <span className="font-medium">{user.xp.toLocaleString()}</span>
                  <span> XP</span>
                </div>
                <div className="text-right">
                  <div>{user.challenges_completed} challenges</div>
                  <div>• Score: {user.xp.toLocaleString()}</div>
                </div>
              </div>

              {/* You indicator */}
              {user.rank === currentRank && (
                <div className="absolute top-2 right-2">
                  <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    YOU
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to get next league
const getNextLeague = (currentLeague: string): string | null => {
  const leagueOrder = ['bronze', 'silver', 'gold', 'platinum'];
  const currentIndex = leagueOrder.indexOf(currentLeague);

  if (currentIndex < leagueOrder.length - 1) {
    return leagueOrder[currentIndex + 1];
  }

  return null;
};