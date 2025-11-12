import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Type definitions
export interface Notification {
  id: string;
  user_id: string;
  type: 'achievement' | 'streak' | 'friend' | 'daily_challenge' | 'weekly_leaderboard' | 'challenge_completed' | 'lesson_completed';
  title: string;
  message: string;
  metadata?: Record<string, any>;
  read: boolean;
  created_at: string;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => Promise<void>;
  achievementsUnlocked: Array<{
    id: string;
    title: string;
    description: string;
    xp_reward: number;
    rarity: string;
  }>;
  clearAchievementNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
  userId?: string;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  userId
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [achievementsUnlocked, setAchievementsUnlocked] = useState<Array<{
    id: string;
    title: string;
    description: string;
    xp_reward: number;
    rarity: string;
  }>>([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Fetch notifications from database
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Clear all notifications
  const clearNotifications = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  // Add new notification
  const addNotification = async (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notification,
          read: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setNotifications(prev => [data, ...prev]);

      // Show browser notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.id
        });
      }
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  // Clear achievement notifications
  const clearAchievementNotifications = () => {
    setAchievementsUnlocked([]);
  };

  // Listen for real-time notifications
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);

          // Show browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/favicon.ico',
              tag: newNotification.id
            });
          }

          // Handle achievement notifications
          if (newNotification.type === 'achievement' && newNotification.metadata) {
            setAchievementsUnlocked(prev => [
              ...prev,
              {
                id: newNotification.metadata.achievement_id,
                title: newNotification.metadata.achievement_title,
                description: newNotification.message,
                xp_reward: newNotification.metadata.xp_reward,
                rarity: newNotification.metadata.rarity
              }
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Request notification permissions
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotification,
    achievementsUnlocked,
    clearAchievementNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Helper function to create different types of notifications
export const createNotificationTypes = {
  achievement: (achievementId: string, title: string, description: string, xpReward: number, rarity: string) => ({
    type: 'achievement' as const,
    title: 'Achievement Unlocked! 🏆',
    message: description,
    metadata: {
      achievement_id: achievementId,
      achievement_title: title,
      xp_reward: xpReward,
      rarity
    }
  }),

  streakMilestone: (days: number) => ({
    type: 'streak' as const,
    title: `Streak Milestone! 🔥`,
    message: `Congratulations! You've maintained a ${days}-day learning streak!`,
    metadata: { streak_days: days }
  }),

  friendRequest: (friendName: string) => ({
    type: 'friend' as const,
    title: 'New Friend Request',
    message: `${friendName} wants to be your learning buddy!`,
    metadata: { friend_name: friendName }
  }),

  dailyChallengeCompleted: (challengeTitle: string, score: number) => ({
    type: 'daily_challenge' as const,
    title: 'Daily Challenge Completed! ✅',
    message: `You scored ${score} points on "${challengeTitle}"`,
    metadata: { challenge_title: challengeTitle, score }
  }),

  weeklyLeaderboard: (rank: number, league: string) => ({
    type: 'weekly_leaderboard' as const,
    title: 'Weekly Results! 📊',
    message: `You finished #${rank} in the ${league} league this week!`,
    metadata: { rank, league }
  }),

  challengeCompleted: (challengeName: string, difficulty: string) => ({
    type: 'challenge_completed' as const,
    title: 'Challenge Completed! 💪',
    message: `You solved the ${difficulty} challenge: ${challengeName}`,
    metadata: { challenge_name: challengeName, difficulty }
  }),

  lessonCompleted: (lessonTitle: string, score: number, xpEarned: number) => ({
    type: 'lesson_completed' as const,
    title: 'Lesson Completed! 📚',
    message: `You finished "${lessonTitle}" with a score of ${score}% and earned ${xpEarned} XP`,
    metadata: { lesson_title: lessonTitle, score, xp_earned: xpEarned }
  })
};

export default NotificationProvider;