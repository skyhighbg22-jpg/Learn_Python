import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mail,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Loader2,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

export const EmailVerificationView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, resendVerificationEmail } = useAuth();
  const { addNotification } = useNotifications();

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');

  // Get email from URL or current user
  const email = searchParams.get('email') || user?.email || '';

  useEffect(() => {
    if (!email) {
      setStatus('error');
      setMessage('No email address found. Please sign in again.');
      setLoading(false);
      return;
    }

    // Check if user is already verified
    if (user?.email_confirmed) {
      setStatus('success');
      setMessage('Your email has already been verified!');
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [email, user]);

  const handleResendVerification = async () => {
    if (!email) return;

    setResending(true);
    try {
      await resendVerificationEmail();
      addNotification({
        type: 'auth',
        title: 'Verification Email Sent',
        message: 'Please check your inbox for the verification link.',
      });
      setMessage('Verification email has been resent. Please check your inbox.');
    } catch (error: any) {
      setMessage(error.message || 'Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!email) return;

    setVerifying(true);
    try {
      // Refresh the current session to check verification status
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (session?.user?.email_confirmed) {
        setStatus('success');
        setMessage('Your email has been successfully verified!');
        addNotification({
          type: 'auth',
          title: 'Email Verified!',
          message: 'Your email address has been verified successfully.',
        });

        // Redirect to dashboard after a delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setMessage('Email not yet verified. Please check your inbox and click the verification link.');
      }
    } catch (error: any) {
      setMessage(error.message || 'Failed to check verification status.');
    } finally {
      setVerifying(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
            <p className="text-gray-600">Checking your verification status</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Continue to Dashboard
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Error</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/auth')}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors block w-full"
              >
                <ArrowLeft className="inline-block w-4 h-4 mr-2" />
                Back to Sign In
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <Mail className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a verification email to:{' '}
              <span className="font-semibold text-gray-900">{email}</span>
            </p>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('resent')
                  ? 'bg-blue-50 border border-blue-200 text-blue-800'
                  : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
              }`}>
                <p className="text-sm">{message}</p>
              </div>
            )}

            {/* Email Instructions */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">Next Steps:</h3>
              <ol className="text-sm text-gray-600 space-y-2">
                <li>1. Open your email inbox</li>
                <li>2. Look for an email from PyLearn</li>
                <li>3. Click the verification link in the email</li>
                <li>4. Return here to continue</li>
              </ol>
            </div>

            {/* Troubleshooting */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-yellow-800 mb-2">Didn't receive the email?</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Check your spam/junk folder</li>
                <li>• Make sure the email address is correct</li>
                <li>• Wait a few minutes for delivery</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                disabled={resending}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 block w-full"
              >
                {resending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Resend Verification Email
                  </>
                )}
              </button>

              <button
                onClick={handleCheckVerification}
                disabled={verifying}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 block w-full"
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    I've Verified - Check Status
                  </>
                )}
              </button>

              <button
                onClick={() => navigate('/auth')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 block w-full"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </button>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading verification page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <span className="text-white text-2xl font-bold">Py</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">PyLearn</h1>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderContent()}
        </div>

        {/* Help Section */}
        {status !== 'loading' && status !== 'success' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Need help?</p>
            <a
              href="mailto:support@pylearn.com"
              className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Contact Support
            </a>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            For your security, verification links expire after 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationView;