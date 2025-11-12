import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, UserPlus, Search, MessageCircle, Trophy, Star, Clock,
  Activity, Heart, Share2, MoreHorizontal, UserMinus, Check,
  X, Send, BookOpen, Flame, Zap
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface Friend {
  id: string;
  friend_id: string;
  user_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  profile: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
    level: number;
    total_xp: number;
    current_streak: number;
    league: string;
  };
}

interface Activity {
  id: string;
  user_id: string;
  type: 'lesson_completed' | 'challenge_completed' | 'achievement_unlocked' | 'streak_milestone';
  message: string;
  created_at: string;
  xp_earned?: number;
}

export const FriendsView: React.FC = () => {
  const { profile } = useAuth();
  const { addNotification } = useNotifications();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
  const [sentRequests, setSentRequests] = useState<Friend[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search' | 'activity'>('friends');

  // Load friends and friend requests
  const loadFriendsData = useCallback(async () => {
    if (!profile?.id) return;

    try {
      // Load accepted friends
      const { data: friendsData } = await supabase
        .from('friendships')
        .select(`
          *,
          profiles!friend_id(*)
        `)
        .or(`user_id.eq.${profile.id},friend_id.eq.${profile.id}`)
        .eq('status', 'accepted');

      if (friendsData) {
        setFriends(friendsData);
      }

      // Load received friend requests
      const { data: requestsData } = await supabase
        .from('friendships')
        .select(`
          *,
          profiles!friend_id(*)
        `)
        .eq('user_id', profile.id)
        .eq('status', 'pending');

      if (requestsData) {
        setFriendRequests(requestsData);
      }

      // Load sent friend requests
      const { data: sentData } = await supabase
        .from('friendships')
        .select(`
          *,
          profiles!friend_id(*)
        `)
        .eq('friend_id', profile.id)
        .eq('status', 'pending');

      if (sentData) {
        setSentRequests(sentData);
      }

    } catch (error) {
      console.error('Error loading friends data:', error);
    }
  }, [profile?.id]);

  // Load friend activities
  const loadFriendActivities = useCallback(async () => {
    if (!profile?.id || friends.length === 0) return;

    const friendIds = friends.map(f => f.friend_id === profile.id ? f.user_id : f.friend_id);

    if (friendIds.length === 0) return;

    try {
      const { data } = await supabase
        .from('user_activities')
        .select('*')
        .in('user_id', friendIds)
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        setActivities(data);
      }
    } catch (error) {
      console.error('Error loading friend activities:', error);
    }
  }, [profile?.id, friends]);

  // Search users
  const searchUsers = async (query: string) => {
    if (!query.trim() || !profile?.id) {
      setSearchResults([]);
      return;
    }

    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, level')
        .ilike('username', `%${query}%`)
        .neq('id', profile.id)
        .limit(10);

      if (data) {
        // Filter out users who are already friends or have pending requests
        const existingIds = new Set([
          ...friends.map(f => f.profile.id),
          ...friendRequests.map(f => f.profile.id),
          ...sentRequests.map(f => f.profile.id)
        ]);

        setSearchResults(data.filter(user => !existingIds.has(user.id)));
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  // Send friend request
  const sendFriendRequest = async (userId: string) => {
    if (!profile?.id) return;

    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: profile.id,
          friend_id: userId,
          status: 'pending'
        });

      if (error) throw error;

      // Refresh sent requests
      loadFriendsData();
      setSearchQuery('');
      setSearchResults([]);

    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  // Accept friend request
  const acceptFriendRequest = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', friendshipId);

      if (error) throw error;

      // Refresh data
      loadFriendsData();

    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  // Decline friend request
  const declineFriendRequest = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'declined' })
        .eq('id', friendshipId);

      if (error) throw error;

      // Refresh data
      loadFriendsData();

    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };

  // Remove friend
  const removeFriend = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);

      if (error) throw error;

      // Refresh data
      loadFriendsData();

    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  // Send message to friend
  const sendMessage = async (friendId: string, message: string) => {
    if (!profile?.id) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: profile.id,
          receiver_id: friendId,
          content: message,
          read: false
        });

      if (error) throw error;

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Share progress with friend
  const shareProgress = async (friendId: string) => {
    if (!profile) return;

    try {
      // Create activity feed entry for sharing
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: profile.id,
          type: 'progress_shared',
          message: `Shared their progress with you! They're level ${profile.level} with ${profile.total_xp} XP.`,
          metadata: {
            shared_with: friendId,
            level: profile.level,
            total_xp: profile.total_xp,
            current_streak: profile.current_streak
          }
        });

      if (error) throw error;

      addNotification({
        user_id: profile.id,
        type: 'friend',
        title: 'Progress Shared!',
        message: 'Your progress has been shared with your friend.',
        read: false
      });

    } catch (error) {
      console.error('Error sharing progress:', error);
    }
  };

  // Initial data load
  useEffect(() => {
    loadFriendsData();
  }, [loadFriendsData]);

  // Load activities when friends change
  useEffect(() => {
    loadFriendActivities();
  }, [loadFriendActivities]);

  // Search when query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const totalFriends = friends.length;
  const pendingRequests = friendRequests.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Friends & Community</h2>
        <p className="text-slate-400">Connect with other learners and share your progress</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <Users className="mb-3" size={24} />
          <p className="text-3xl font-bold mb-1">{totalFriends}</p>
          <p className="text-blue-100">Friends</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
          <UserPlus className="mb-3" size={24} />
          <p className="text-3xl font-bold mb-1">{pendingRequests}</p>
          <p className="text-green-100">Pending Requests</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
          <Activity className="mb-3" size={24} />
          <p className="text-3xl font-bold mb-1">{activities.length}</p>
          <p className="text-purple-100">Friend Activities</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-slate-800 p-1 rounded-lg">
        {[
          { id: 'friends', label: 'My Friends', icon: Users },
          { id: 'requests', label: 'Requests', icon: UserPlus, badge: pendingRequests },
          { id: 'search', label: 'Find Friends', icon: Search },
          { id: 'activity', label: 'Activity Feed', icon: Activity }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 relative ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.badge && tab.badge > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <div className="space-y-4">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div key={friend.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {friend.profile.avatar_url ? (
                        <img
                          src={friend.profile.avatar_url}
                          alt={friend.profile.display_name}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        friend.profile.display_name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{friend.profile.display_name}</h4>
                      <p className="text-slate-400 text-sm">@{friend.profile.username}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                        <span>Level {friend.profile.level}</span>
                        <span>•</span>
                        <span>{friend.profile.total_xp} XP</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-400" />
                          {friend.profile.current_streak} days
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => sendMessage(friend.profile.id, 'Hey! How\'s your learning going?')}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                    >
                      <MessageCircle size={16} />
                    </button>
                    <button
                      onClick={() => shareProgress(friend.profile.id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
                    >
                      <Share2 size={16} />
                    </button>
                    <button
                      onClick={() => removeFriend(friend.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                    >
                      <UserMinus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Users className="text-slate-600 mx-auto mb-4" size={64} />
              <p className="text-slate-400 mb-4">No friends yet</p>
              <button
                onClick={() => setActiveTab('search')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Find Friends
              </button>
            </div>
          )}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {friendRequests.length > 0 ? (
            friendRequests.map((request) => (
              <div key={request.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {request.profile.avatar_url ? (
                        <img
                          src={request.profile.avatar_url}
                          alt={request.profile.display_name}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        request.profile.display_name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{request.profile.display_name}</h4>
                      <p className="text-slate-400 text-sm">@{request.profile.username}</p>
                      <p className="text-slate-500 text-xs mt-1">
                        Wants to be your friend
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => acceptFriendRequest(request.id)}
                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => declineFriendRequest(request.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <UserPlus className="text-slate-600 mx-auto mb-4" size={64} />
              <p className="text-slate-400">No pending friend requests</p>
            </div>
          )}

          {sentRequests.length > 0 && (
            <div className="mt-8">
              <h3 className="text-white font-semibold mb-4">Sent Requests</h3>
              <div className="space-y-3">
                {sentRequests.map((request) => (
                  <div key={request.id} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {request.profile.avatar_url ? (
                          <img
                            src={request.profile.avatar_url}
                            alt={request.profile.display_name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          request.profile.display_name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{request.profile.display_name}</p>
                        <p className="text-slate-400 text-xs">Request sent</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search for users by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-4">
            {searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div key={user.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.display_name}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          user.display_name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{user.display_name}</h4>
                        <p className="text-slate-400 text-sm">@{user.username}</p>
                        <p className="text-slate-500 text-xs">Level {user.level}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => sendFriendRequest(user.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <UserPlus size={16} />
                      Add Friend
                    </button>
                  </div>
                </div>
              ))
            ) : searchQuery ? (
              <div className="text-center py-12">
                <Search className="text-slate-600 mx-auto mb-4" size={64} />
                <p className="text-slate-400">No users found matching "{searchQuery}"</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="text-slate-600 mx-auto mb-4" size={64} />
                <p className="text-slate-400">Type a username to search for friends</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    {activity.type === 'lesson_completed' && <BookOpen size={16} className="text-white" />}
                    {activity.type === 'challenge_completed' && <Trophy size={16} className="text-white" />}
                    {activity.type === 'achievement_unlocked' && <Star size={16} className="text-white" />}
                    {activity.type === 'streak_milestone' && <Flame size={16} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white mb-1">{activity.message}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{new Date(activity.created_at).toLocaleDateString()}</span>
                      {activity.xp_earned && (
                        <span className="text-yellow-400 flex items-center gap-1">
                          <Zap size={12} />
                          +{activity.xp_earned} XP
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Activity className="text-slate-600 mx-auto mb-4" size={64} />
              <p className="text-slate-400">No recent friend activity</p>
              <p className="text-slate-500 text-sm mt-2">Connect with friends to see their progress!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendsView;