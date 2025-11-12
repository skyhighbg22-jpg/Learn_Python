import { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  MessageCircle,
  Trophy,
  Flame,
  Star,
  Send,
  UserX,
  Check,
  Clock,
  BookOpen,
  Zap
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// XSS Protection: Content sanitization utilities
const sanitizeHtml = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

const sanitizeString = (str: string): string => {
  return str
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
};

const validateInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  if (input.length > 1000) return input.substring(0, 1000);
  return sanitizeString(input.trim());
};

interface Friend {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  xp: number;
  level: number;
  current_streak: number;
  status: 'online' | 'offline' | 'learning';
  last_active: string;
}

interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  sender: {
    username: string;
    full_name: string;
    avatar_url: string;
    xp: number;
    level: number;
  };
}

interface Activity {
  id: string;
  user_id: string;
  type: 'lesson_completed' | 'achievement_unlocked' | 'streak_milestone' | 'challenge_completed';
  message: string;
  metadata: any;
  created_at: string;
  user: {
    username: string;
    avatar_url: string;
  };
}

export const FriendsView = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search' | 'activity'>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);

  useEffect(() => {
    loadFriendsData();
  }, []);

  const loadFriendsData = async () => {
    try {
      setLoading(true);

      // Load friends
      const { data: friendsData, error: friendsError } = await supabase
        .from('friendships')
        .select(`
          friend:profiles!friendships_friend_id_fkey(
            id, username, full_name, avatar_url, xp, level, current_streak, last_active
          )
        `)
        .eq('user_id', user?.id)
        .eq('status', 'accepted');

      if (friendsError) throw friendsError;
      setFriends(friendsData?.map(f => f.friend) || []);

      // Load friend requests - SECURE VERSION with proper filtering
      const { data: requestsData, error: requestsError } = await supabase
        .from('friendships')
        .select(`
          id, sender_id, receiver_id, status, created_at,
          sender:profiles!friendships_sender_id_fkey(
            username, full_name, avatar_url, xp, level
          )
        `)
        .eq('receiver_id', user?.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;
      setFriendRequests(requestsData || []);

      // Load activity feed
      const { data: activityData, error: activityError } = await supabase
        .from('user_activities')
        .select(`
          id, user_id, type, message, metadata, created_at,
          user:profiles(id, username, avatar_url)
        `)
        .in('user_id', friendsData?.map(f => f.friend.id) || [user?.id])
        .order('created_at', { ascending: false })
        .limit(20);

      if (activityError) throw activityError;
      setActivity(activityData || []);

    } catch (error) {
      console.error('Error loading friends data:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, xp, level')
        .ilike('username', `%${query}%`)
        .neq('id', user?.id)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    try {
      setSendingRequest(friendId);

      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: user?.id,
          friend_id: friendId,
          status: 'pending'
        });

      if (error) throw error;

      // Remove from search results
      setSearchResults(prev => prev.filter(u => u.id !== friendId));

    } catch (error) {
      console.error('Error sending friend request:', error);
    } finally {
      setSendingRequest(null);
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (error) throw error;

      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
      loadFriendsData();

    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const rejectFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      setFriendRequests(prev => prev.filter(req => req.id !== requestId));

    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const removeFriend = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .or(`(user_id.eq.${user?.id},friend_id.eq.${friendId}), (user_id.eq.${friendId},friend_id.eq.${user?.id})`);

      if (error) throw error;

      setFriends(prev => prev.filter(f => f.id !== friendId));

    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const sendMessage = async (friendId: string, message: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user?.id,
          receiver_id: friendId,
          content: message,
          type: 'text'
        });

      if (error) throw error;

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getUserStatus = (lastActive: string) => {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const minutesDiff = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60);

    if (minutesDiff < 5) return { status: 'online', color: 'bg-green-500' };
    if (minutesDiff < 30) return { status: 'learning', color: 'bg-yellow-500' };
    return { status: 'offline', color: 'bg-slate-500' };
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Friends & Community</h2>
        <p className="text-slate-400">Connect, share progress, and learn together</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 bg-slate-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'friends'
              ? 'bg-blue-500 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users size={18} className="inline mr-2" />
          Friends ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'requests'
              ? 'bg-blue-500 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserPlus size={18} className="inline mr-2" />
          Requests ({friendRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'search'
              ? 'bg-blue-500 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Search size={18} className="inline mr-2" />
          Find Friends
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'activity'
              ? 'bg-blue-500 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap size={18} className="inline mr-2" />
          Activity
        </button>
      </div>

      {/* Friends List */}
      {activeTab === 'friends' && (
        <div className="space-y-4">
          {friends.length === 0 ? (
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Friends Yet</h3>
              <p className="text-slate-400 mb-4">Start building your learning network!</p>
              <button
                onClick={() => setActiveTab('search')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Find Friends
              </button>
            </div>
          ) : (
            friends.map(friend => {
              const userStatus = getUserStatus(friend.last_active);
              return (
                <div key={friend.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={friend.avatar_url || '/default-avatar.png'}
                          alt={friend.username}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 ${userStatus.color} rounded-full border-2 border-slate-800`}></div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">{friend.full_name}</h4>
                        <p className="text-slate-400">@{friend.username}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-blue-400 font-semibold">Lvl {friend.level}</p>
                          <p className="text-slate-500">{friend.xp} XP</p>
                        </div>
                        <div className="text-center">
                          <p className="text-orange-400 font-semibold">{friend.current_streak}</p>
                          <p className="text-slate-500">Day Streak</p>
                        </div>
                        <div className="text-center">
                          <p className="text-green-400 font-semibold">{userStatus.status}</p>
                          <p className="text-slate-500">Status</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => sendMessage(friend.id, '')}
                        className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                        title="Send Message"
                      >
                        <MessageCircle size={18} className="text-slate-300" />
                      </button>
                      <button
                        onClick={() => removeFriend(friend.id)}
                        className="p-2 bg-slate-700 hover:bg-red-600 rounded-lg transition-colors"
                        title="Remove Friend"
                      >
                        <UserX size={18} className="text-slate-300" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Friend Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {friendRequests.length === 0 ? (
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
              <UserPlus className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Pending Requests</h3>
              <p className="text-slate-400">You're all caught up!</p>
            </div>
          ) : (
            friendRequests.map(request => (
              <div key={request.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={request.sender.avatar_url || '/default-avatar.png'}
                      alt={request.sender.username}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-white">{request.sender.full_name}</h4>
                      <p className="text-slate-400">@{request.sender.username} • Level {request.sender.level}</p>
                      <p className="text-slate-500 text-sm mt-1">
                        Sent {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => acceptFriendRequest(request.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <Check size={18} />
                      Accept
                    </button>
                    <button
                      onClick={() => rejectFriendRequest(request.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <UserX size={18} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Search Users */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for friends by username..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchUsers(e.target.value);
                  }}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {searchResults.map(user => (
              <div key={user.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={user.avatar_url || '/default-avatar.png'}
                      alt={user.username}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-white">{user.full_name}</h4>
                      <p className="text-slate-400">@{user.username} • Level {user.level}</p>
                      <p className="text-slate-500 text-sm mt-1">{user.xp} XP</p>
                    </div>
                  </div>
                  <button
                    onClick={() => sendFriendRequest(user.id)}
                    disabled={sendingRequest === user.id}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    {sendingRequest === user.id ? (
                      <>
                        <Clock size={18} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} />
                        Add Friend
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}

            {searchQuery && searchResults.length === 0 && (
              <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
                <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
                <p className="text-slate-400">Try searching for a different username</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Activity Feed */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          {activity.length === 0 ? (
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
              <Zap className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Recent Activity</h3>
              <p className="text-slate-400">Activity from your friends will appear here</p>
            </div>
          ) : (
            activity.map(item => (
              <div key={item.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-start gap-4">
                  <img
                    src={item.user.avatar_url || '/default-avatar.png'}
                    alt={item.user.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white">{item.user.username}</h4>
                      <span className="text-slate-500 text-sm">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-300">{item.message}</p>

                    {item.type === 'lesson_completed' && (
                      <div className="mt-2 flex items-center gap-2">
                        <BookOpen size={16} className="text-blue-400" />
                        <span className="text-blue-400 text-sm">Lesson Completed</span>
                      </div>
                    )}

                    {item.type === 'achievement_unlocked' && (
                      <div className="mt-2 flex items-center gap-2">
                        <Trophy size={16} className="text-yellow-400" />
                        <span className="text-yellow-400 text-sm">Achievement Unlocked</span>
                      </div>
                    )}

                    {item.type === 'streak_milestone' && (
                      <div className="mt-2 flex items-center gap-2">
                        <Flame size={16} className="text-orange-400" />
                        <span className="text-orange-400 text-sm">Streak Milestone</span>
                      </div>
                    )}

                    {item.type === 'challenge_completed' && (
                      <div className="mt-2 flex items-center gap-2">
                        <Star size={16} className="text-purple-400" />
                        <span className="text-purple-400 text-sm">Challenge Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
