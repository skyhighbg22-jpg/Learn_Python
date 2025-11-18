import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdProvider } from './contexts/AdContext';
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
import AdManager from './components/ads/AdManager';
import { ResponsiveAd, AutoAd } from './components/ads/AutoAd';
import { PaymentModal } from './components/ui/PaymentModal';
import { AdFreeBanner } from './components/ui/AdFreeBanner';
import {
  SpringWrapper,
  BounceIn,
  SmoothTransition,
  PageTransition,
  MorphTransition,
  RippleEffect,
  LiquidFill
} from './components/ui/Animations';

const MainApp = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('learn');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [lessonContext, setLessonContext] = useState<string>();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Handle keyboard shortcut for AI chat (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsAIChatOpen(!isAIChatOpen);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isAIChatOpen]);

  if (loading) {
    return (
      <SpringWrapper className="min-h-screen bg-slate-900 flex items-center justify-center">
        <BounceIn delay={200}>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <div className="text-slate-400 text-lg animate-pulse">Loading PyLearn...</div>
            <div className="mt-4 flex gap-2 justify-center">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          </div>
        </BounceIn>
      </SpringWrapper>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const renderView = () => {
    const viewContent = () => {
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
      <PageTransition>
        <div className="page-transition-content">
          <BounceIn delay={100}>
            {viewContent()}
          </BounceIn>
        </div>
      </PageTransition>
    );
  };

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* Ad-Free Banner */}
        <div className="px-6 py-4">
          <AdFreeBanner
            onUpgrade={() => setShowPaymentModal(true)}
            className="max-w-4xl mx-auto"
          />
        </div>

        <main className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="max-w-4xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>

      {/* Sidebar Ad */}
      <div className="w-80 bg-slate-800 border-l border-slate-700 p-4 hidden lg:block">
        <div className="sticky top-4 space-y-4">
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Sponsored</h3>
          <AdManager adType="sidebar" className="w-full" />

          {/* Test Auto Ad */}
          <div className="mt-4">
            <AutoAd height="250px" width="300px" className="w-full" />
          </div>

          {/* Additional ads for longer pages */}
          {(currentView === 'learn' || currentView === 'practice') && (
            <>
              <div className="mt-8">
                <ResponsiveAd className="w-full" />
              </div>
              <div className="mt-4">
                <AutoAd height="250px" width="300px" className="w-full" />
              </div>
            </>
          )}

          {/* Compact Upgrade Banner */}
          <div className="mt-8">
            <AdFreeBanner
              onUpgrade={() => setShowPaymentModal(true)}
              compact={true}
            />
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => {
          setShowPaymentModal(false);
          // Force a page reload or state refresh to update ad status
          window.location.reload();
        }}
      />

      <AICharacter
        isOpen={isAIChatOpen}
        onToggle={() => setIsAIChatOpen(!isAIChatOpen)}
        lessonContext={lessonContext}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AdProvider>
        <MainApp />
      </AdProvider>
    </AuthProvider>
  );
}

export default App;
