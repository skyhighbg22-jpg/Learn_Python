import { useState } from 'react';
import { X } from 'lucide-react';
import { useAd } from '../../contexts/AdContext';
import { GoogleAdSense, HeaderBanner, SidebarAd, FooterAd, LessonContentAd } from './GoogleAdSense';
import { AutoAd, ResponsiveAd, InArticleAd } from './AutoAd';

interface AdManagerProps {
  type: 'header' | 'sidebar' | 'footer' | 'lesson-content' | 'auto' | 'responsive' | 'in-article';
}

const AdManager: React.FC<AdManagerProps> = ({ type }) => {
  const [isClosed, setIsClosed] = useState(false);
  const { isAdBlockerDetected } = useAd();

  if (isAdBlockerDetected || isClosed) {
    return null;
  }

  const handleClose = () => {
    setIsClosed(true);
  };

  switch (type) {
    case 'header':
      return (
        <div className="relative">
          <HeaderBanner />
          <button
            onClick={handleClose}
            className="absolute top-0 right-0 p-1 text-gray-500 hover:text-gray-700"
            aria-label="Close Ad"
          >
            <X size={16} />
          </button>
        </div>
      );
    case 'sidebar':
      return <SidebarAd />;
    case 'footer':
      return <FooterAd />;
    case 'lesson-content':
      return <LessonContentAd />;
    case 'auto':
      return <AutoAd />;
    case 'responsive':
      return <ResponsiveAd />;
    case 'in-article':
      return <InArticleAd />;
    default:
      return null;
  }
};

export default AdManager;
