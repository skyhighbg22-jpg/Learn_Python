import { useEffect, useRef } from 'react';

interface GoogleAdSenseProps {
  adSlot: string;
  adFormat?: string;
  style?: React.CSSProperties;
  className?: string;
  fullWidthResponsive?: boolean;
  adLayout?: string;
  adLayoutKey?: string;
}

// Check if ads are enabled
const ADS_ENABLED = import.meta.env.VITE_ADS_ENABLED === 'true';
const ADSENSE_ENABLED = import.meta.env.VITE_ADSENSE_ENABLED === 'true';
const PUBLISHER_ID = import.meta.env.VITE_ADSENSE_PUBLISHER_ID || 'ca-pub-XXXXXXXXXXXXXXXX';

export const GoogleAdSense: React.FC<GoogleAdSenseProps> = ({
  adSlot,
  adFormat = 'auto',
  style = { display: 'block' },
  className = '',
  fullWidthResponsive = true,
  adLayout,
  adLayoutKey
}) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Don't load ads if they're disabled
    if (!ADS_ENABLED || !ADSENSE_ENABLED) {
      return;
    }

    const loadAd = () => {
      try {
        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error('Error loading AdSense ad:', error);
      }
    };

    // Load AdSense script if not already loaded
    if (typeof window !== 'undefined' && !(window as any).adsbygoogle) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.crossOrigin = 'anonymous';

      script.onload = loadAd;
      script.onerror = () => {
        console.error('Failed to load AdSense script');
      };

      document.head.appendChild(script);
    } else {
      loadAd();
    }
  }, [adSlot]);

  // Don't render ads if they're disabled
  if (!ADS_ENABLED || !ADSENSE_ENABLED) {
    return null;
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
      />
      <style jsx>{`
        .ad-container {
          text-align: center;
          margin: 1rem 0;
          overflow: hidden;
        }

        .adsbygoogle {
          background-color: #f8f9fa;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

// Ad slot constants for easy management
export const AD_SLOTS = {
  HEADER_BANNER: import.meta.env.VITE_AD_SLOT_HEADER_BANNER || '1234567890',
  SIDEBAR_VERTICAL: import.meta.env.VITE_AD_SLOT_SIDEBAR_VERTICAL || '0987654321',
  FOOTER_BANNER: import.meta.env.VITE_AD_SLOT_FOOTER_BANNER || '1111111111',
  LESSON_CONTENT: import.meta.env.VITE_AD_SLOT_LESSON_CONTENT || '2222222222',
  CHALLENGE_BETWEEN: import.meta.env.VITE_AD_SLOT_CHALLENGE_BETWEEN || '3333333333',
  PROFILE_SIDE: import.meta.env.VITE_AD_SLOT_PROFILE_SIDE || '4444444444',
  LEADERBOARD_TOP: import.meta.env.VITE_AD_SLOT_LEADERBOARD_TOP || '5555555555',
} as const;

// Predefined ad components for common placements
export const HeaderBanner: React.FC<{ className?: string }> = ({ className }) => (
  <GoogleAdSense
    adSlot={AD_SLOTS.HEADER_BANNER}
    adFormat="horizontal"
    style={{ display: 'block', width: '728px', height: '90px' }}
    className={className}
    fullWidthResponsive={true}
  />
);

export const SidebarAd: React.FC<{ className?: string }> = ({ className }) => (
  <GoogleAdSense
    adSlot={AD_SLOTS.SIDEBAR_VERTICAL}
    adFormat="vertical"
    style={{ display: 'block', width: '300px', height: '250px' }}
    className={className}
    fullWidthResponsive={true}
  />
);

export const FooterAd: React.FC<{ className?: string }> = ({ className }) => (
  <GoogleAdSense
    adSlot={AD_SLOTS.FOOTER_BANNER}
    adFormat="auto"
    style={{ display: 'block' }}
    className={className}
    fullWidthResponsive={true}
  />
);

export const LessonContentAd: React.FC<{ className?: string }> = ({ className }) => (
  <GoogleAdSense
    adSlot={AD_SLOTS.LESSON_CONTENT}
    adFormat="auto"
    style={{ display: 'block' }}
    className={className}
    fullWidthResponsive={true}
  />
);

export const ChallengeBetweenAd: React.FC<{ className?: string }> = ({ className }) => (
  <GoogleAdSense
    adSlot={AD_SLOTS.CHALLENGE_BETWEEN}
    adFormat="auto"
    style={{ display: 'block' }}
    className={className}
    fullWidthResponsive={true}
  />
);

export const ProfileSideAd: React.FC<{ className?: string }> = ({ className }) => (
  <GoogleAdSense
    adSlot={AD_SLOTS.PROFILE_SIDE}
    adFormat="vertical"
    style={{ display: 'block', width: '300px', height: '250px' }}
    className={className}
    fullWidthResponsive={true}
  />
);