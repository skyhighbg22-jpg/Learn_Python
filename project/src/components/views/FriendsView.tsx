import { Users, UserPlus, Search } from 'lucide-react';

export const FriendsView = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Friends</h2>
        <p className="text-slate-400">Connect with other Python learners</p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search for friends by username..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
            <UserPlus size={20} />
            Add Friend
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-12 border border-slate-700 text-center">
        <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="text-slate-400" size={40} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Build Your Learning Network</h3>
        <p className="text-slate-400 mb-6 max-w-md mx-auto">
          Connect with friends, compare progress, and motivate each other on your Python learning
          journey. Friend features are coming soon!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <p className="text-blue-400 font-semibold mb-1">Compare Progress</p>
            <p className="text-slate-400 text-sm">See how you stack up</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <p className="text-green-400 font-semibold mb-1">Share Achievements</p>
            <p className="text-slate-400 text-sm">Celebrate together</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <p className="text-purple-400 font-semibold mb-1">Compete Friendly</p>
            <p className="text-slate-400 text-sm">Weekly challenges</p>
          </div>
        </div>
      </div>
    </div>
  );
};
