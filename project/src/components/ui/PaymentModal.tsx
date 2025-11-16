import React, { useState } from 'react';
import { X, Crown, Check, Lock, Sparkles, AlertCircle, Shield } from 'lucide-react';
import { PaymentService, PaymentPlan, PaymentResponse } from '../../services/paymentService';
import { useAuth } from '../../contexts/AuthContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { profile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'payment' | 'success'>('select');

  const plans = PaymentService.getPlans();
  const adFreePlan = plans.find(p => p.id === 'ad_free_lifetime');

  if (!isOpen) return null;

  const handlePlanSelect = async (plan: PaymentPlan) => {
    if (!profile?.id) {
      setError('User not logged in');
      return;
    }

    setSelectedPlan(plan);
    setStep('payment');
    setError(null);

    try {
      setLoading(true);
      const response = await PaymentService.createPaymentSession(plan.id, profile.id);

      if (response.success && response.payment_url) {
        // Redirect to Stripe checkout
        window.location.href = response.payment_url;
      } else {
        setError(response.error || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment service unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('select');
    setSelectedPlan(null);
    setError(null);
    onClose();
  };

  const renderPlanCard = (plan: PaymentPlan) => (
    <div
      key={plan.id}
      className={`bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
        selectedPlan?.id === plan.id ? 'ring-4 ring-yellow-400' : ''
      }`}
      onClick={() => handlePlanSelect(plan)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">{plan.name}</h3>
        <div className="bg-white/20 rounded-full p-2">
          <Crown className="w-6 h-6" />
        </div>
      </div>

      <div className="mb-6">
        <div className="text-4xl font-bold mb-2">$5</div>
        <div className="text-sm opacity-90">One-time payment (~₹50)</div>
      </div>

      <div className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-300 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <button
        className="w-full bg-white text-purple-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
        disabled={loading}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
            Processing...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Buy Now
          </>
        )}
      </button>
    </div>
  );

  if (step === 'payment') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Redirecting to Payment</h3>
            <p className="text-gray-600">Please wait while we connect you to our secure payment provider...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Remove Ads Forever</h2>
          <p className="text-gray-600">Enjoy an uninterrupted learning experience with our one-time ad-free package</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Ad-Free Plan */}
          {adFreePlan && renderPlanCard(adFreePlan)}

          {/* Current State Comparison */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Why Go Ad-Free?</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <X className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">No More Interruptions</h4>
                  <p className="text-sm text-gray-600">Study without ads breaking your concentration</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Support Development</h4>
                  <p className="text-sm text-gray-600">Help us keep PyLearn free and growing</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Premium Features</h4>
                  <p className="text-sm text-gray-600">Get priority support and exclusive benefits</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Lifetime Access</h4>
                  <p className="text-sm text-gray-600">One-time payment, ad-free forever</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>🎯 Limited Time Offer:</strong> Get lifetime ad-free access for just ₹50! This price won't last long.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            <Lock className="w-4 h-4 inline mr-1" />
            Secure payment powered by Razorpay • 100% refund guarantee
          </p>
        </div>
      </div>
    </div>
  );
};