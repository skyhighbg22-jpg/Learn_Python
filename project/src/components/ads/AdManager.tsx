import { useState } from 'react';
import { X, Close } from 'lucide-react';
import { useAd } from '../../contexts/AdContext';
import { GoogleAdSense, HeaderBanner, SidebarAd, FooterAd, LessonContentAd } from './GoogleAdSense';
import { AutoAd, ResponsiveAd, InArticleAd } from './AutoAd';

interface AdManagerProps {
  adType?: 'banner' | 'sidebar' | 'footer' | 'lesson' | 'interstitial';
  showCloseButton?: boolean;
  className?: string;
}

export const AdManager: React.FC<AdManagerProps> = ({
  adType = 'banner',
  showCloseButton = false,
  className = ''
}) => {
  const { canShowAds } = useAd();
  const [adClosed, setAdClosed] = useState(false);

  if (!canShowAds() || adClosed) {
    return null;
  }

  const handleCloseAd = () => {
    setAdClosed(true);
  };

  const renderAd = () => {
    switch (adType) {
      case 'banner':
        return <HeaderBanner className={className} />;
      case 'sidebar':
        return <SidebarAd className={className} />;
      case 'footer':
        return <FooterAd className={className} />;
      case 'lesson':
        return <ResponsiveAd className={className} />;
      case 'responsive':
        return <ResponsiveAd className={className} />;
      case 'inarticle':
        return <InArticleAd className={className} />;
      default:
        return <AutoAd className={className} height="250px" width="300px" />;
    }
  };

  return (
    <div className={`ad-manager ${className}`}>
      {showCloseButton && (
        <button
          onClick={handleCloseAd}
          className="absolute top-2 right-2 z-10 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Close advertisement"
        >
          <X size={16} className="text-gray-600" />
        </button>
      )}
      {renderAd()}
    </div>
  );
};

// Interstitial ad component that can be shown between actions
export const InterstitialAd: React.FC<{
  onClose: () => void;
  autoCloseDelay?: number;
}> = ({ onClose, autoCloseDelay = 5000 }) => {
  const { canShowAds } = useAd();
  const [countdown, setCountdown] = useState(autoCloseDelay / 1000);

  if (!canShowAds()) {
    onClose();
    return null;
  }

  // Countdown timer
  useState(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Advertisement</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Auto-close in {countdown}s</span>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close advertisement"
            >
              <Close size={20} />
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <GoogleAdSense
            adSlot="interstitial"
            adFormat="auto"
            style={{ display: 'block', width: '100%', maxWidth: '600px' }}
          />
        </div>
      </div>
    </div>
  );
};

// Ad wrapper for content areas
export const ContentAdWrapper: React.FC<{
  children: React.ReactNode;
  showAd?: boolean;
  adPosition?: 'top' | 'bottom' | 'both';
}> = ({ children, showAd = true, adPosition = 'bottom' }) => {
  const { canShowAds } = useAd();

  if (!canShowAds() || !showAd) {
    return <>{children}</>;
  }

  return (
    <div className="content-ad-wrapper">
      {(adPosition === 'top' || adPosition === 'both') && (
        <AdManager adType="lesson" className="mb-4" />
      )}
      {children}
      {(adPosition === 'bottom' || adPosition === 'both') && (
        <AdManager adType="lesson" className="mt-4" />
      )}
    </div>
  );
};

// Premium ad-free banner
export const AdFreeBanner: React.FC<{
  onUpgrade: () => void;
  className?: string;
}> = ({ onUpgrade, className = '' }) => {
  return (
    <div className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg mb-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg mb-1">Remove Ads Forever</h3>
          <p className="text-sm opacity-90">Get an ad-free experience and support PyLearn development</p>
        </div>
        <button
          onClick={onUpgrade}
          className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
};