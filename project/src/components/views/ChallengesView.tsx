import { useEffect, useState, useCallback } from 'react';
import {
  Target, Calendar, Zap, Trophy, Clock, CheckCircle, Users,
  TrendingUp, Award, Star, Play, RotateCcw, History
} from 'lucide-react';
import { supabase, DailyChallenge } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
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
  const { addNotification } = useNotifications();
  const [todayChallenge, setTodayChallenge] = useState<DailyChallenge | null>(null);
  const [completed, setCompleted] = useState(false);
  const [challengeHistory, setChallengeHistory] = useState<ChallengeHistory[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [completionData, setCompletionData] = useState<ChallengeCompletion | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'today' | 'history' | 'leaderboard'>('today');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isStarting, setIsStarting] = useState(false);

  // Load today's challenge
  const loadTodayChallenge = useCallback(async () => {
    if (!profile?.id) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      const { data: challengeData } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('date', today)
        .maybeSingle();

      if (challengeData) {
        setTodayChallenge(challengeData);

        // Check completion status
        const { data: completionData } = await supabase
          .from('daily_challenge_attempts')
          .select('*')
          .eq('user_id', profile.id)
          .eq('challenge_id', challengeData.id)
          .eq('completed', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        setCompletionData(completionData);
        setCompleted(!!completionData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading today\'s challenge:', error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading challenges...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Daily Challenges</h2>
        <p className="text-slate-400">Complete challenges to earn bonus XP</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl p-8 border border-blue-700">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Calendar className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Today's Challenge</h3>
                <p className="text-blue-300 text-sm">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            {completed && (
              <div className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                <Trophy size={18} />
                Completed
              </div>
            )}
          </div>

          {todayChallenge ? (
            <div>
              <h4 className="text-xl font-semibold text-white mb-2">
                {todayChallenge.title}
              </h4>
              <p className="text-slate-300 mb-4">{todayChallenge.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="bg-slate-700 px-3 py-1 rounded-full text-slate-300 capitalize">
                  {todayChallenge.difficulty}
                </span>
                <span className="text-yellow-500 font-semibold flex items-center gap-1">
                  <Zap size={16} />
                  +{todayChallenge.xp_reward} XP
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="text-slate-600 mx-auto mb-4" size={48} />
              <p className="text-slate-400">No challenge available today</p>
              <p className="text-slate-500 text-sm mt-2">Check back tomorrow!</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Challenges Completed', value: '0', icon: Trophy },
            { label: 'Total Challenge XP', value: '0', icon: Zap },
            { label: 'Best Streak', value: '0 days', icon: Target },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <Icon className="text-blue-400 mb-3" size={28} />
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Upcoming Features</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-white font-semibold">Weekly Competitions</p>
                <p className="text-slate-400 text-sm">
                  Compete with learners worldwide in timed challenges
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-white font-semibold">Challenge History</p>
                <p className="text-slate-400 text-sm">
                  Review and retry past daily challenges
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-white font-semibold">Custom Challenges</p>
                <p className="text-slate-400 text-sm">
                  Create and share challenges with the community
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
