import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdSettings {
  showAds: boolean;
  adFreeUser: boolean;
  adFrequency: number; // Show ad after every N actions
  lastAdShown: number;
  adCounter: number;
}

type AdContextType = {
  adSettings: AdSettings;
  updateAdSettings: (settings: Partial<AdSettings>) => void;
  showAdWithFrequency: () => boolean;
  incrementAdCounter: () => void;
  resetAdCounter: () => void;
  canShowAds: () => boolean;
};

const AdContext = createContext<AdContextType | undefined>(undefined);

interface AdProviderProps {
  children: ReactNode;
}

export const AdProvider: React.FC<AdProviderProps> = ({ children }) => {
  const [adSettings, setAdSettings] = useState<AdSettings>({
    showAds: true,
    adFreeUser: false,
    adFrequency: 3, // Show ad every 3 actions
    lastAdShown: 0,
    adCounter: 0,
  });

  // Load ad settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('adSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setAdSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading ad settings:', error);
      }
    }

    // Check if user has ad-free subscription
    checkAdFreeStatus();
  }, []);

  const updateAdSettings = (newSettings: Partial<AdSettings>) => {
    const updated = { ...adSettings, ...newSettings };
    setAdSettings(updated);
    localStorage.setItem('adSettings', JSON.stringify(updated));
  };

  const checkAdFreeStatus = async () => {
    // Check user's subscription status
    // This would typically involve checking with your backend
    // For now, we'll check a simple localStorage setting
    const adFreeStatus = localStorage.getItem('adFreeUser') === 'true';
    if (adFreeStatus) {
      updateAdSettings({ adFreeUser: true });
    }
  };

  const canShowAds = (): boolean => {
    return adSettings.showAds && !adSettings.adFreeUser;
  };

  const showAdWithFrequency = (): boolean => {
    if (!canShowAds()) return false;

    const now = Date.now();
    const timeSinceLastAd = now - adSettings.lastAdShown;

    // Show ad if counter reached frequency or if it's been more than 5 minutes
    if (adSettings.adCounter >= adSettings.adFrequency || timeSinceLastAd > 5 * 60 * 1000) {
      updateAdSettings({
        lastAdShown: now,
        adCounter: 0
      });
      return true;
    }

    return false;
  };

  const incrementAdCounter = () => {
    updateAdSettings({
      adCounter: adSettings.adCounter + 1
    });
  };

  const resetAdCounter = () => {
    updateAdSettings({ adCounter: 0 });
  };

  return (
    <AdContext.Provider
      value={{
        adSettings,
        updateAdSettings,
        showAdWithFrequency,
        incrementAdCounter,
        resetAdCounter,
        canShowAds,
      }}
    >
      {children}
    </AdContext.Provider>
  );
};

export const useAd = (): AdContextType => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAd must be used within an AdProvider');
  }
  return context;
};

// Ad frequency trigger component
export const AdTrigger: React.FC<{
  onShowAd: () => void;
  children: ReactNode;
}> = ({ children, onShowAd }) => {
  const { incrementAdCounter, showAdWithFrequency } = useAd();

  const handleTrigger = () => {
    incrementAdCounter();
    if (showAdWithFrequency()) {
      onShowAd();
    }
  };

  return <div onClick={handleTrigger}>{children}</div>;
};