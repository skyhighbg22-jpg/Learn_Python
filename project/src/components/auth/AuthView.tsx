import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  SpringWrapper,
  BounceIn,
  SmoothTransition,
  ElasticScale,
  MorphTransition,
  RippleEffect
} from '../ui/Animations';

type AuthMode = 'signin' | 'signup' | 'forgot-password';
type EmailStatus = 'idle' | 'sending' | 'sent' | 'error';

export const AuthView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp, signIn, resetPassword, resendVerificationEmail } = useAuth();
  const { addNotification } = useNotifications();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    fullName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('idle');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check for auth callback parameters
  useEffect(() => {
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    const type = searchParams.get('type');

    if (error) {
      setError(decodeURIComponent(error));
    } else if (message) {
      setSuccess(decodeURIComponent(message));
      if (type === 'verification') {
        setMode('signin');
      }
    }

    // Handle OAuth callback
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (accessToken && refreshToken) {
      // OAuth successful - let AuthContext handle the session
      navigate('/dashboard', { replace: true });
    }
  }, [searchParams, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  // Add this helper function above handleSubmit
  const mapAuthError = (error: any) => {
    const message = error.message || '';

    if (message.includes('User already registered')) {
      return 'An account with this email already exists. Try signing in instead.';
    }
    if (message.includes('Invalid login credentials')) {
      return 'Incorrect email or password. Please check your credentials and try again.';
    }
    if (message.includes('Email not confirmed')) {
      return 'Please verify your email address before signing in. Check your inbox for the verification link.';
    }
    if (message.includes('Password should be at least')) {
      return 'Password must be at least 6 characters long.';
    }
    if (message.includes('rate limit')) {
      return 'Too many attempts. Please wait a few moments before trying again.';
    }
    if (message.includes('Network request failed')) {
      return 'Network connection issue. Please check your internet connection and try again.';
    }

    // Return original message for unhandled errors
    return message || 'An unexpected error occurred. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'signup') {
        const result = await signUp(formData.email, formData.password, formData.username, formData.fullName);

        if (result.needsVerification) {
          setSuccess('Account created successfully! Please check your email to verify your account.');
          addNotification({
            type: 'auth',
            title: 'Account Created',
            message: 'Please check your email to verify your account before signing in.',
          });
        } else {
          setSuccess('Account created successfully! Welcome to PyLearn!');
          addNotification({
            type: 'auth',
            title: 'Welcome to PyLearn!',
            message: 'Your account has been created successfully.',
          });
        }
      } else if (mode === 'signin') {
        const result = await signIn(formData.email, formData.password);

        if (result.needsVerification) {
          setError('Please verify your email address before signing in. Check your inbox for the verification link.');
        } else {
          setSuccess('Sign in successful! Welcome back!');
          addNotification({
            type: 'auth',
            title: 'Welcome Back!',
            message: 'Successfully signed in to your PyLearn account.',
          });
          navigate('/dashboard');
        }
      } else if (mode === 'forgot-password') {
        await resetPassword(formData.email);
        setEmailStatus('sent');
        setSuccess('Password reset instructions have been sent to your email.');
      }
    } catch (error: any) {
      const userFriendlyMessage = mapAuthError(error);
      setError(userFriendlyMessage);

      // Also add notification for better visibility
      addNotification({
        type: 'error',
        title: 'Authentication Error',
        message: userFriendlyMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  
  const handleResendVerification = async () => {
    setEmailStatus('sending');
    setError('');

    try {
      await resendVerificationEmail();
      setEmailStatus('sent');
      setSuccess('Verification email has been resent. Please check your inbox.');
    } catch (error: any) {
      setError(error.message || 'Failed to resend verification email.');
      setEmailStatus('error');
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', username: '', fullName: '' });
    setError('');
    setSuccess('');
    setEmailStatus('idle');
    setShowPassword(false);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidForm = () => {
    if (!isValidEmail(formData.email)) return false;
    if (mode !== 'forgot-password' && formData.password.length < 6) return false;
    if (mode === 'signup' && formData.username.length < 3) return false;
    return true;
  };

  return (
    <SpringWrapper className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <BounceIn delay={100} className="bg-white rounded-2xl shadow-xl p-8 glass-enhanced">
          {/* Logo/Header */}
          <BounceIn delay={200} className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 transition-transform duration-300 hover:scale-110 hover:shadow-lg">
              <span className="text-white text-2xl font-bold">Py</span>
            </div>
            <MorphTransition>
              <h1 className="text-2xl font-bold text-gray-900">PyLearn</h1>
              <p className="text-gray-600 mt-2">
                {mode === 'signup' ? 'Create your account' : mode === 'signin' ? 'Welcome back' : 'Reset your password'}
              </p>
            </MorphTransition>
          </BounceIn>

          
          {/* Error/Success Messages */}
          <BounceIn delay={300}>
            {error && (
              <SmoothTransition duration={400} className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5 animate-pulse" />
                <div className="text-sm text-red-800">{error}</div>
              </SmoothTransition>
            )}

            {success && (
              <SmoothTransition duration={400} className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 animate-bounce" />
                <div className="text-sm text-green-800">{success}</div>
              </SmoothTransition>
            )}
          </BounceIn>

          {/* Email Verification Resend */}
          {error && error.includes('verify your email') && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-3">Didn't receive the verification email?</p>
              <RippleEffect>
                <button
                  onClick={handleResendVerification}
                  disabled={emailStatus === 'sending'}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 btn-enhanced focus-enhanced"
                >
                  {emailStatus === 'sending' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Resend Verification Email'
                  )}
                </button>
              </RippleEffect>
            </div>
          )}

          {/* Form */}
          {emailStatus !== 'sent' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Choose a username"
                      minLength={3}
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {mode !== 'forgot-password' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                      title={showPassword ? "Hide password" : "Show password"}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                    {showPassword ? (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Password is visible</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Click the eye icon to show password</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isValidForm()}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'signin' && 'Sign In'}
                    {mode === 'forgot-password' && 'Send Reset Instructions'}
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            {mode === 'signin' && (
              <>
                <button
                  onClick={() => switchMode('signup')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Don't have an account? Sign up
                </button>
                <div>
                  <button
                    onClick={() => switchMode('forgot-password')}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    Forgot your password?
                  </button>
                </div>
              </>
            )}

            {mode === 'signup' && (
              <button
                onClick={() => switchMode('signin')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Already have an account? Sign in
              </button>
            )}

            {mode === 'forgot-password' && (
              <button
                onClick={() => switchMode('signin')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </button>
            )}
          </div>

          {/* Terms and Privacy */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-700">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;