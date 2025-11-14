import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/AuthForm';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LearnView } from './components/views/LearnView';
import { ProfileView } from './components/views/ProfileView';
import { LeaderboardView } from './components/views/LeaderboardView';
import { ChallengesView } from './components/views/ChallengesView';
import { PracticeView } from './components/views/PracticeView';
import { FriendsView } from './components/views/FriendsView';
import { AICharacter } from './components/ui/AICharacter';

const MainApp = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('learn');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400 text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'learn':
        return <LearnView />;
      case 'profile':
        return <ProfileView />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'challenges':
        return <ChallengesView />;
      case 'practice':
        return <PracticeView />;
      case 'friends':
        return <FriendsView />;
      default:
        return <LearnView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">{renderView()}</main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
