import React from 'react';
import { Crown, Sparkles, Lock, Shield } from 'lucide-react';
import { useAd } from '../../contexts/AdContext';

interface AdFreeBannerProps {
  onUpgrade: () => void;
  className?: string;
  compact?: boolean;
}

export const AdFreeBanner: React.FC<AdFreeBannerProps> = ({
  onUpgrade,
  className = '',
  compact = false
}) => {
  const { canShowAds } = useAd();

  // Don't show banner if ads are already disabled
  if (!canShowAds) {
    return null;
  }

  if (compact) {
    return (
      <div className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-lg ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            <span className="font-semibold">Remove Ads Forever - Only ₹50</span>
          </div>
          <button
            onClick={onUpgrade}
            className="bg-white text-purple-600 px-3 py-1 rounded-md text-sm font-semibold hover:bg-gray-100 transition-colors flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            Upgrade
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-xl ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 rounded-full p-2">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Go Ad-Free Forever</h3>
              <p className="text-sm opacity-90">One-time payment, lifetime access</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-semibold">No Ads Ever</span>
              </div>
              <p className="text-xs opacity-90">Focus on learning without distractions</p>
            </div>

            <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-green-300" />
                <span className="text-sm font-semibold">Support PyLearn</span>
              </div>
              <p className="text-xs opacity-90">Help us keep education accessible</p>
            </div>

            <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-blue-300" />
                <span className="text-sm font-semibold">One-Time ₹50</span>
              </div>
              <p className="text-xs opacity-90">Pay once, benefit forever</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-end gap-3">
          <div className="text-center lg:text-right">
            <div className="text-3xl font-bold mb-1">₹50</div>
            <div className="text-sm opacity-90">One-time payment</div>
          </div>

          <button
            onClick={onUpgrade}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Crown className="w-5 h-5" />
            Upgrade Now
          </button>

          <div className="text-xs opacity-90 text-center lg:text-right">
            <Lock className="w-3 h-3 inline mr-1" />
            Secure payment by Razorpay
          </div>
        </div>
      </div>

      {/* Floating sparkles animation */}
      <div className="absolute top-2 right-2">
        <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
      </div>
      <div className="absolute bottom-2 left-2">
        <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
      </div>
    </div>
  );
};