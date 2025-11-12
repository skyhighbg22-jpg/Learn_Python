import { useEffect, useState, useCallback } from 'react';
import {
  Target, Calendar, Zap, Trophy, Clock, CheckCircle, Users,
  TrendingUp, Award, Star, Play, RotateCcw, History
} from 'lucide-react';
import { supabase, DailyChallenge } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications, createNotificationTypes } from '../../contexts/NotificationContext';

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
  const [todayChallenge, setTodayChallenge] = useState<DailyChallenge | null>(null);
  const [completed, setCompleted] = useState(false);
  const [challengeHistory, setChallengeHistory] = useState<ChallengeHistory[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [completionData, setCompletionData] = useState<ChallengeCompletion | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'today' | 'history' | 'leaderboard'>('today');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Load today's challenge
  const loadTodayChallenge = useCallback(async () => {
    if (!profile?.id) return;

    try {
      setError(null);

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );

      const today = new Date().toISOString().split('T')[0];

      const dataPromise = supabase
        .from('daily_challenges')
        .select('*')
        .eq('date', today)
        .maybeSingle();

      const { data: challengeData, error: challengeError } = await Promise.race([dataPromise, timeoutPromise]) as any;

      if (challengeError) throw challengeError;

      setTodayChallenge(challengeData);

      if (challengeData) {
        // Check completion status
        const completionPromise = supabase
          .from('daily_challenge_attempts')
          .select('*')
          .eq('user_id', profile.id)
          .eq('challenge_id', challengeData.id)
          .eq('completed', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const { data: completionData, error: completionError } = await Promise.race([completionPromise, timeoutPromise]) as any;

        if (completionError) throw completionError;

        setCompletionData(completionData);
        setCompleted(!!completionData);
      }

      setRetryCount(0);
    } catch (error: any) {
      console.error('Error loading today\'s challenge:', error);
      setError(error.message === 'Request timeout'
        ? 'Connection timeout. Please check your internet connection.'
        : 'Failed to load challenge. Please try again.'
      );
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
  const startChallenge = async () => {
    if (!todayChallenge || !profile?.id) return;

    setIsStarting(true);
    try {
      // Create challenge attempt record
      const { error } = await supabase
        .from('daily_challenge_attempts')
        .insert({
          user_id: profile.id,
          challenge_id: todayChallenge.id,
          challenge_date: todayChallenge.date,
          score: 0,
          completed: false,
          attempts: 1,
          completion_time: 0,
          started_at: new Date().toISOString()
        });

      if (error) throw error;

      // Navigate to challenge (this would integrate with your routing)
      addNotification(createNotificationTypes.dailyChallengeCompleted(todayChallenge.title, 0));

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
    const bestStreak = Math.max(...challengeHistory.map((_, index) => {
      let streak = 0;
      for (let i = index; i < challengeHistory.length; i++) {
        const date = new Date(challengeHistory[i].completed_at);
        const nextDate = new Date(challengeHistory[i - 1]?.completed_at || '');
        if (i === index || (nextDate && (date.getTime() - nextDate.getTime()) === 86400000)) {
          streak++;
        } else {
          break;
        }
      }
      return streak;
    }));

    return { completedCount, totalXP, bestStreak };
  };

  const { completedCount, totalXP, bestStreak } = calculateStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
                  <h3 className="text-2xl font-bold text-white">Today's Challenge</h3>
                  <p className="text-blue-300 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  <div className="flex items-center gap-2 mt-2 text-slate-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Time remaining: {timeLeft}</span>
                  </div>
                </div>
              </div>
              {completed && (
                <div className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                  <CheckCircle size={18} />
                  Completed
                </div>
              )}
            </div>

            {todayChallenge ? (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-3">
                    {todayChallenge.title}
                  </h4>
                  <p className="text-slate-300 mb-4 text-lg">{todayChallenge.description}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className={`px-4 py-2 rounded-full font-semibold capitalize ${
                      todayChallenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                      todayChallenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {todayChallenge.difficulty}
                    </span>
                    <span className="text-yellow-400 font-semibold flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full">
                      <Zap size={18} />
                      +{todayChallenge.xp_reward} XP
                    </span>
                    {completionData && (
                      <span className="text-blue-400 font-semibold flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full">
                        <Star size={18} />
                        Score: {completionData.score}
                      </span>
                    )}
                  </div>
                </div>

                {!completed ? (
                  <div className="flex gap-4">
                    <button
                      onClick={startChallenge}
                      disabled={isStarting}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                    >
                      {isStarting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Starting...
                        </>
                      ) : (
                        <>
                          <Play size={20} />
                          Start Challenge
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="text-green-400" size={20} />
                      <span className="text-green-400 font-semibold">Challenge Completed!</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Score:</span>
                        <span className="text-white ml-2 font-semibold">{completionData?.score}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Time:</span>
                        <span className="text-white ml-2 font-semibold">{completionData?.completion_time}s</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Attempts:</span>
                        <span className="text-white ml-2 font-semibold">{completionData?.attempts}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="text-slate-600 mx-auto mb-4" size={64} />
                <p className="text-slate-400 text-lg">No challenge available today</p>
                <p className="text-slate-500 text-sm mt-2">Check back tomorrow for a new challenge!</p>
              </div>
            )}
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
