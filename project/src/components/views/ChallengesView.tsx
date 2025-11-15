import { useEffect, useState, useCallback } from 'react';
import {
  Target, Calendar, Zap, Trophy, Clock, CheckCircle, Users,
  TrendingUp, Award, Star, Play, RotateCcw, History, Flame
} from 'lucide-react';
import { supabase, DailyChallenge } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { dailyChallengeService, DailyChallenge as ServiceDailyChallenge } from '../../services/dailyChallengeService';
import { ChallengeModal } from '../ChallengeModal';
// Import with fallback for missing NotificationContext
import { useNotifications } from '../../contexts/NotificationContext';

interface ChallengeCompletion {
  id: string;
  score: number;
  completion_time: number;
  attempts: number;
}

interface ChallengeHistory {
  id: string;
  challenge: DailyChallenge;
  completion: ChallengeCompletion;
  completed_at: string;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  score: number;
  completion_time: number;
  level: number;
}

export const ChallengesView = () => {
  const { profile } = useAuth();
  // Graceful fallback for NotificationContext
  let addNotification: (notification: any) => void;
  try {
    const notificationContext = useNotifications();
    addNotification = notificationContext.addNotification;
  } catch (error) {
    // Fallback if NotificationContext doesn't exist
    addNotification = (notification) => {
      console.log('Notification:', notification);
    };
  }
  const [todayChallenges, setTodayChallenges] = useState<ServiceDailyChallenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [challengeHistory, setChallengeHistory] = useState<ChallengeHistory[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [completionData, setCompletionData] = useState<ChallengeCompletion | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'today' | 'history' | 'leaderboard'>('today');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [streakData, setStreakData] = useState<any>(null);
  const [streakBonus, setStreakBonus] = useState(0);

  // Helper function for exponential backoff retry
  const retryWithBackoff = async <T,>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) throw error;

        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  };

  // Load today's challenges
  const loadTodayChallenge = useCallback(async () => {
    if (!profile?.id) return;

    try {
      setError(null);
      setLoading(true);

      // Load challenges using new service
      const challenges = await dailyChallengeService.getTodayChallenges();
      setTodayChallenges(challenges);

      // Load user streak data
      const streak = await dailyChallengeService.getUserStreakData(profile.id);
      setStreakData(streak);

      // Calculate streak bonus
      const bonus = await dailyChallengeService.calculateStreakBonus(profile.id);
      setStreakBonus(bonus);

      // Load completion status for today's challenges
      const completions = new Set<string>();
      for (const challenge of challenges) {
        const { data: completionData } = await retryWithBackoff(async () => {
          return await supabase
            .from('daily_challenge_attempts')
            .select('*')
            .eq('user_id', profile.id)
            .eq('challenge_id', challenge.id)
            .eq('completed', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
        });

        if (completionData) {
          completions.add(challenge.id);
        }
      }

      setCompletedChallenges(completions);
      setRetryCount(0);
    } catch (error: any) {
      console.error('Error loading today\'s challenges:', error);
      setError('Failed to load challenges. Please try again.');
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  // Load challenge history
  const loadChallengeHistory = useCallback(async () => {
    if (!profile?.id) return;

    try {
      const { data } = await supabase
        .from('daily_challenge_attempts')
        .select(`
          *,
          daily_challenges!inner(*)
        `)
        .eq('user_id', profile.id)
        .eq('completed', true)
        .order('created_at', { ascending: false })
        .limit(30);

      if (data) {
        const history: ChallengeHistory[] = data.map(item => ({
          id: item.id,
          challenge: item.daily_challenges,
          completion: {
            id: item.id,
            score: item.score,
            completion_time: item.completion_time,
            attempts: item.attempts
          },
          completed_at: item.created_at
        }));

        setChallengeHistory(history);
      }
    } catch (error) {
      console.error('Error loading challenge history:', error);
    }
  }, [profile?.id]);

  // Load leaderboard
  const loadLeaderboard = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data } = await supabase
        .from('daily_challenge_attempts')
        .select(`
          score,
          completion_time,
          profiles!inner(username, avatar_url, level)
        `)
        .eq('challenge_date', today)
        .eq('completed', true)
        .order('score', { ascending: false })
        .order('completion_time', { ascending: true })
        .limit(10);

      if (data) {
        const leaderboardData: LeaderboardEntry[] = data.map((item, index) => ({
          rank: index + 1,
          username: item.profiles.username,
          avatar: item.profiles.avatar_url || '',
          score: item.score,
          completion_time: item.completion_time,
          level: item.profiles.level
        }));

        setLeaderboard(leaderboardData);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  }, []);

  // Start challenge
  const startChallenge = async (challenge: ServiceDailyChallenge) => {
    if (!challenge || !profile?.id) return;

    setIsStarting(true);
    try {
      // Create challenge attempt record
      const { error } = await supabase
        .from('daily_challenge_attempts')
        .insert({
          user_id: profile.id,
          challenge_id: challenge.id,
          challenge_date: new Date().toISOString().split('T')[0],
          score: 0,
          completed: false,
          attempts: 1,
          completion_time: 0,
          started_at: new Date().toISOString()
        });

      if (error) throw error;

      // Navigate to challenge (this would integrate with your routing)
      addNotification({
        type: 'success',
        title: 'Challenge Started',
        message: `${challenge.title} - ${challenge.difficulty}`,
        duration: 3000
      });

    } catch (error) {
      console.error('Error starting challenge:', error);
    } finally {
      setIsStarting(false);
    }
  };

  // Update time left for today's challenge
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Load data based on selected tab
  useEffect(() => {
    loadTodayChallenge();
  }, [loadTodayChallenge]);

  useEffect(() => {
    if (selectedTab === 'history') {
      loadChallengeHistory();
    } else if (selectedTab === 'leaderboard') {
      loadLeaderboard();
    }
  }, [selectedTab, loadChallengeHistory, loadLeaderboard]);

  // Calculate stats
  const calculateStats = () => {
    const completedCount = challengeHistory.length;
    const totalXP = challengeHistory.reduce((sum, h) => sum + (h.challenge.xp_reward || 0), 0);
    const todayCompleted = todayChallenges.filter(c => completedChallenges.has(c.id)).length;
    const currentStreak = streakData?.current_streak || 0;
    const bestStreak = streakData?.longest_streak || 0;

    return { completedCount, totalXP, bestStreak, todayCompleted, currentStreak };
  };

  const { completedCount, totalXP, bestStreak, todayCompleted, currentStreak } = calculateStats();

  if (error && retryCount > 2) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-16 h-16 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-red-400 text-lg font-medium mb-2">Unable to load challenges</p>
          <p className="text-slate-400 text-sm mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setRetryCount(0);
              loadTodayChallenge();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <div className="text-slate-400">Loading challenges...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Daily Challenges</h2>
        <p className="text-slate-400">Test your skills and compete with learners worldwide</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-slate-800 p-1 rounded-lg">
        {(['today', 'history', 'leaderboard'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`flex-1 px-4 py-2 rounded-md font-medium capitalize transition-colors flex items-center justify-center gap-2 ${
              selectedTab === tab
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {tab === 'today' && <Target className="w-4 h-4" />}
            {tab === 'history' && <History className="w-4 h-4" />}
            {tab === 'leaderboard' && <Users className="w-4 h-4" />}
            {tab}
          </button>
        ))}
      </div>

      {/* Today's Challenge Tab */}
      {selectedTab === 'today' && (
        <div className="space-y-6">
          {/* Today's Challenge Card */}
          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl p-8 border border-blue-700">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <Calendar className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Daily Challenges</h3>
                  <p className="text-blue-300 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Time left: {timeLeft}</span>
                    </div>
                    {currentStreak > 0 && (
                      <div className="flex items-center gap-2 text-orange-400 text-sm">
                        <Flame className="w-4 h-4" />
                        <span>{currentStreak} day streak! 🔥</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {todayCompleted === todayChallenges.length && todayChallenges.length > 0 && (
                <div className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                  <CheckCircle size={18} />
                  All Completed!
                </div>
              )}
            </div>

            {todayChallenges.length > 0 ? (
              <div className="space-y-6">
                {/* Challenge Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {todayChallenges.map((challenge, index) => {
                    const isCompleted = completedChallenges.has(challenge.id);
                    const difficultyColor = dailyChallengeService.getDifficultyColor(challenge.difficulty);
                    const timeEstimate = dailyChallengeService.getTimeEstimateText(challenge.estimated_minutes);

                    return (
                      <div key={challenge.id} className={`relative bg-slate-800 rounded-xl p-6 border ${
                        isCompleted ? 'border-green-600 bg-green-900/20' : 'border-slate-600 hover:border-slate-500'
                      } transition-all duration-200 hover:transform hover:scale-105`}>
                        {isCompleted && (
                          <div className="absolute top-3 right-3">
                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                              <CheckCircle size={14} />
                              Done
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-4">
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColor}`}>
                            {dailyChallengeService.getDifficultyLabel(challenge.difficulty)}
                          </div>
                          <div className="text-yellow-400 font-semibold flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full">
                            <Zap size={14} />
                            +{challenge.xp_reward} XP
                          </div>
                        </div>

                        <h4 className="text-lg font-semibold text-white mb-3">
                          {challenge.title}
                        </h4>
                        <p className="text-slate-300 text-sm mb-4 leading-relaxed">{challenge.description}</p>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Clock size={14} />
                            <span>{timeEstimate}</span>
                          </div>
                          <div className="text-blue-400 text-sm font-medium">
                            {challenge.challenge_type}
                          </div>
                        </div>

                        {!isCompleted ? (
                          <button
                            onClick={() => startChallenge(challenge)}
                            disabled={isStarting}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 disabled:scale-100"
                          >
                            {isStarting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Starting...
                              </>
                            ) : (
                              <>
                                <Play size={16} />
                                Start Challenge
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="bg-green-900/20 border border-green-700 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="text-green-400" size={16} />
                              <span className="text-green-400 font-semibold">Completed</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Streak Bonus Section */}
                {streakBonus > 0 && (
                  <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-xl p-6 border border-orange-600">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                        <Flame className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Streak Bonus Unlocked! 🎉</h3>
                        <p className="text-orange-300">You've completed challenges for 7 days straight!</p>
                      </div>
                    </div>
                    <div className="bg-orange-500/20 border border-orange-500 border-opacity-30 rounded-lg p-4">
                      <p className="text-orange-100 font-semibold text-lg">+{streakBonus} XP Bonus!</p>
                      <p className="text-orange-300 text-sm mt-1">Keep the streak going for more rewards!</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="text-slate-600 mx-auto mb-4" size={64} />
                <p className="text-slate-400 text-lg">No challenges available today</p>
                <p className="text-slate-500 text-sm mt-2">Check back tomorrow for new challenges!</p>
              </div>
            )}
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <Trophy className="text-blue-400 mb-3" size={28} />
              <p className="text-3xl font-bold text-white mb-1">{completedCount}</p>
              <p className="text-slate-400 text-sm">Challenges Completed</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <Zap className="text-yellow-400 mb-3" size={28} />
              <p className="text-3xl font-bold text-white mb-1">{totalXP}</p>
              <p className="text-slate-400 text-sm">Total Challenge XP</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <Flame className="text-orange-400 mb-3" size={28} />
              <p className="text-3xl font-bold text-white mb-1">{currentStreak} days</p>
              <p className="text-slate-400 text-sm">Current Streak 🔥</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <TrendingUp className="text-green-400 mb-3" size={28} />
              <p className="text-3xl font-bold text-white mb-1">{bestStreak} days</p>
              <p className="text-slate-400 text-sm">Best Streak</p>
            </div>
          </div>
        </div>
      )}

      {/* Challenge History Tab */}
      {selectedTab === 'history' && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            Challenge History
          </h3>
          {challengeHistory.length > 0 ? (
            <div className="space-y-4">
              {challengeHistory.map((history) => (
                <div key={history.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-white font-semibold">{history.challenge.title}</h4>
                      <p className="text-slate-400 text-sm">
                        Completed on {new Date(history.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-semibold">{history.completion.score} pts</div>
                      <div className="text-slate-400 text-sm">{history.completion.completion_time}s</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                      history.challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                      history.challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {history.challenge.difficulty}
                    </span>
                    <span className="text-yellow-400 flex items-center gap-1">
                      <Zap size={14} />
                      +{history.challenge.xp_reward} XP
                    </span>
                    <span className="text-slate-400">
                      {history.completion.attempts} attempts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <History className="text-slate-600 mx-auto mb-4" size={64} />
              <p className="text-slate-400">No completed challenges yet</p>
              <p className="text-slate-500 text-sm mt-2">Start with today's challenge to build your history!</p>
            </div>
          )}
        </div>
      )}

      {/* Leaderboard Tab */}
      {selectedTab === 'leaderboard' && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Today's Leaderboard
          </h3>
          {leaderboard.length > 0 ? (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    entry.rank === 1 ? 'bg-yellow-900/20 border-yellow-700/30' :
                    entry.rank === 2 ? 'bg-gray-700/30 border-gray-600/50' :
                    entry.rank === 3 ? 'bg-orange-900/20 border-orange-700/30' :
                    'bg-slate-700/50 border-slate-600/50'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      entry.rank === 1 ? 'bg-yellow-500 text-white' :
                      entry.rank === 2 ? 'bg-gray-400 text-white' :
                      entry.rank === 3 ? 'bg-orange-600 text-white' :
                      'bg-slate-600 text-slate-300'
                    }`}>
                      {entry.rank}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {entry.avatar ? (
                        <img src={entry.avatar} alt={entry.username} className="w-10 h-10 rounded-full" />
                      ) : (
                        entry.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{entry.username}</p>
                      <p className="text-slate-400 text-sm">Level {entry.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">{entry.score}</p>
                    <p className="text-slate-400 text-sm">{entry.completion_time}s</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="text-slate-600 mx-auto mb-4" size={64} />
              <p className="text-slate-400">No one has completed today's challenge yet</p>
              <p className="text-slate-500 text-sm mt-2">Be the first to appear on the leaderboard!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
