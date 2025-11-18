import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, TrendingUp, Users, Globe, Filter, Search, ChevronUp, ChevronDown, Minus, Crown, Star, Target, Zap, Flag } from 'lucide-react';
import { globalLeaderboardService, LeaderboardEntry, LeaderboardFilters, LeaderboardStats } from '../../services/globalLeaderboardService';
import { useAuth } from '../../contexts/AuthContext';

interface GlobalLeaderboardsViewProps {
  className?: string;
}

export const GlobalLeaderboardsView: React.FC<GlobalLeaderboardsViewProps> = ({ className = '' }) => {
  const { profile } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LeaderboardFilters>({
    time_range: 'all_time',
    category: 'overall',
    region: 'global',
    friends_only: false,
    league_filter: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);

  const LEADERBOARD_PAGE_SIZE = 50;

  useEffect(() => {
    loadLeaderboard();
  }, [filters, currentPage]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const offset = currentPage * LEADERBOARD_PAGE_SIZE;

      const [leaderboardData, statsData] = await Promise.all([
        globalLeaderboardService.getLeaderboard(filters, LEADERBOARD_PAGE_SIZE, offset),
        globalLeaderboardService.getLeaderboardStats(filters)
      ]);

      setLeaderboard(leaderboardData);
      setStats(statsData);
      setTotalParticipants(statsData.total_participants);

      // Load current user's position if logged in
      if (profile?.id) {
        const userRank = await globalLeaderboardService.getUserLeaderboardPosition(profile.id, filters);
        setCurrentUserRank(userRank);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadLeaderboard();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await globalLeaderboardService.searchLeaderboardUsers(searchTerm, filters, 20);
      setLeaderboard(searchResults);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof LeaderboardFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0); // Reset to first page
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-600" />;
    if (rank <= 10) return <Star className="w-5 h-5 text-purple-400" />;
    return <span className="text-slate-400 font-medium">#{rank}</span>;
  };

  const getRankChangeIcon = (movement?: { rank_change: number; direction: 'up' | 'down' | 'same' }) => {
    if (!movement) return null;

    if (movement.direction === 'up') {
      return <ChevronUp className="w-4 h-4 text-green-400" />;
    } else if (movement.direction === 'down') {
      return <ChevronDown className="w-4 h-4 text-red-400" />;
    } else {
      return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getLeagueColor = (league: string) => {
    switch (league) {
      case 'bronze': return 'text-orange-400 bg-orange-400/10';
      case 'silver': return 'text-gray-300 bg-gray-300/10';
      case 'gold': return 'text-yellow-400 bg-yellow-400/10';
      case 'platinum': return 'text-purple-400 bg-purple-400/10';
      case 'diamond': return 'text-cyan-400 bg-cyan-400/10';
      case 'master': return 'text-red-400 bg-red-400/10';
      case 'grandmaster': return 'text-yellow-500 bg-yellow-500/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getCountryFlag = (countryCode?: string) => {
    if (!countryCode) return null;
    // This would ideally use a proper flag library
    return <div className="w-6 h-4 bg-slate-600 rounded flex items-center justify-center text-xs text-white">
      {countryCode.slice(0, 2).toUpperCase()}
    </div>;
  };

  if (loading && leaderboard.length === 0) {
    return (
      <div className={`max-w-7xl mx-auto p-8 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto p-8 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Trophy className="text-yellow-400" size={40} />
          Global Leaderboards
        </h1>
        <p className="text-slate-300 text-lg">Compete with Python learners worldwide</p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <Users className="text-blue-400 mx-auto mb-2" size={32} />
            <p className="text-3xl font-bold text-white">{stats.total_participants.toLocaleString()}</p>
            <p className="text-slate-400">Total Learners</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <Globe className="text-green-400 mx-auto mb-2" size={32} />
            <p className="text-3xl font-bold text-white">{stats.country_distribution.length}</p>
            <p className="text-slate-400">Countries</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <Target className="text-purple-400 mx-auto mb-2" size={32} />
            <p className="text-3xl font-bold text-purple-400">
              {currentUserRank ? `#${currentUserRank.rank}` : '-'}
            </p>
            <p className="text-slate-400">Your Rank</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <Zap className="text-yellow-400 mx-auto mb-2" size={32} />
            <p className="text-3xl font-bold text-yellow-400">
              {currentUserRank ? currentUserRank.total_score.toLocaleString() : '-'}
            </p>
            <p className="text-slate-400">Your Score</p>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-slate-800 rounded-lg p-6 mb-8">
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Time Range Filter */}
          <div className="flex items-center gap-2">
            <label className="text-slate-300 text-sm font-medium">Time Range:</label>
            <select
              value={filters.time_range}
              onChange={(e) => handleFilterChange('time_range', e.target.value)}
              className="bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="all_time">All Time</option>
              <option value="yearly">This Year</option>
              <option value="monthly">This Month</option>
              <option value="weekly">This Week</option>
              <option value="daily">Today</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <label className="text-slate-300 text-sm font-medium">Category:</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="overall">Overall</option>
              <option value="xp">XP Earned</option>
              <option value="streak">Learning Streak</option>
              <option value="achievements">Achievements</option>
              <option value="lessons">Lessons Completed</option>
            </select>
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-2">
            <label className="text-slate-300 text-sm font-medium">Region:</label>
            <select
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
              className="bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="global">Global</option>
              <option value="country">Your Country</option>
              <option value="league">Your League</option>
            </select>
          </div>

          {/* League Filter */}
          {filters.region === 'league' && (
            <div className="flex items-center gap-2">
              <label className="text-slate-300 text-sm font-medium">League:</label>
              <select
                value={filters.league_filter}
                onChange={(e) => handleFilterChange('league_filter', e.target.value)}
                className="bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Leagues</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
                <option value="diamond">Diamond</option>
                <option value="master">Master</option>
                <option value="grandmaster">Grandmaster</option>
              </select>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search for users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors flex items-center gap-2"
          >
            <Search size={20} />
            Search
          </button>
        </div>
      </div>

      {/* Current User's Position */}
      {currentUserRank && !leaderboard.some(entry => entry.is_current_user) && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 mb-6 border-2 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-white font-bold text-lg">Your Position</div>
              <div className="text-2xl font-bold text-white">#{currentUserRank.rank}</div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-slate-200 text-sm">XP</p>
                <p className="text-white font-bold">{currentUserRank.total_xp.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-slate-200 text-sm">Level</p>
                <p className="text-white font-bold">{currentUserRank.current_level}</p>
              </div>
              <div className="text-center">
                <p className="text-slate-200 text-sm">Streak</p>
                <p className="text-white font-bold">{currentUserRank.current_streak} days</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Rank</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">User</th>
                <th className="px-6 py-4 text-center text-slate-300 font-medium">League</th>
                <th className="px-6 py-4 text-center text-slate-300 font-medium">Level</th>
                <th className="px-6 py-4 text-center text-slate-300 font-medium">XP</th>
                <th className="px-6 py-4 text-center text-slate-300 font-medium">Streak</th>
                <th className="px-6 py-4 text-center text-slate-300 font-medium">Achievements</th>
                <th className="px-6 py-4 text-center text-slate-300 font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr
                  key={`${entry.user_id}-${index}`}
                  className={`border-b border-slate-700 transition-colors ${
                    entry.is_current_user
                      ? 'bg-blue-600/20'
                      : index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-700/30'
                  } hover:bg-slate-700/50`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(entry.rank)}
                      {entry.movement && (
                        <div className="flex items-center gap-1">
                          {getRankChangeIcon(entry.movement)}
                          <span className="text-xs text-slate-400">{entry.movement.rank_change}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {entry.display_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-white flex items-center gap-2">
                          {entry.display_name}
                          {entry.is_current_user && (
                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">You</span>
                          )}
                        </div>
                        <div className="text-sm text-slate-400">@{entry.username}</div>
                      </div>
                      {entry.country_code && (
                        <div className="ml-2">
                          {getCountryFlag(entry.country_code)}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLeagueColor(entry.league)}`}>
                      {entry.league}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="text-white font-medium">{entry.current_level}</div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="text-yellow-400 font-medium">{entry.total_xp.toLocaleString()}</div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-orange-400">
                      <Zap size={16} />
                      <span className="font-medium">{entry.current_streak}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-purple-400">
                      <Award size={16} />
                      <span className="font-medium">{entry.achievements_count}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="text-xl font-bold text-white">{entry.total_score.toLocaleString()}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {leaderboard.length === 0 && !loading && (
          <div className="text-center py-12">
            <Trophy className="text-slate-600 mx-auto mb-4" size={48} />
            <p className="text-slate-400 text-lg">No results found</p>
            <p className="text-slate-500 text-sm mt-2">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!searchTerm && totalParticipants > LEADERBOARD_PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <div className="text-slate-400 text-sm">
            Showing {currentPage * LEADERBOARD_PAGE_SIZE + 1} to {Math.min((currentPage + 1) * LEADERBOARD_PAGE_SIZE, totalParticipants)} of {totalParticipants.toLocaleString()} learners
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <span className="px-4 py-2 text-slate-300">
              Page {currentPage + 1}
            </span>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={(currentPage + 1) * LEADERBOARD_PAGE_SIZE >= totalParticipants}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};