import { useEffect, useRef } from 'react';

interface AutoAdProps {
  adFormat?: string;
  style?: React.CSSProperties;
  className?: string;
  width?: string;
  height?: string;
}

export const AutoAd: React.FC<AutoAdProps> = ({
  adFormat = 'auto',
  style = { display: 'block' },
  className = '',
  width = '300px',
  height = '250px'
}) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const loadAd = () => {
      try {
        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error('Error loading auto ad:', error);
      }
    };

    // Load AdSense script if not already loaded
    if (typeof window !== 'undefined' && !(window as any).adsbygoogle) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7359040302001520';
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
  }, []);

  return (
    <div className={`auto-ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          ...style,
          width,
          height
        }}
        data-ad-client="ca-pub-7359040302001520"
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
      <style jsx>{`
        .auto-ad-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 1rem 0;
          min-height: ${height};
        }

        .adsbygoogle {
          background-color: #f8f9fa;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

// Responsive Ad Component
export const ResponsiveAd: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`responsive-ad ${className}`}>
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-7359040302001520"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
    <script>
      (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
    <style jsx>{`
      .responsive-ad {
        margin: 1rem 0;
        text-align: center;
      }
    `}</style>
  </div>
);

// In-article Ad Component
export const InArticleAd: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`in-article-ad ${className}`}>
    <ins
      className="adsbygoogle"
      style={{ display: 'block', textAlign: 'center' }}
      data-ad-layout="in-article"
      data-ad-format="fluid"
      data-ad-client="ca-pub-7359040302001520"
    />
    <script>
      (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
    <style jsx>{`
      .in-article-ad {
        margin: 2rem 0;
        text-align: center;
      }
    `}</style>
  </div>
);