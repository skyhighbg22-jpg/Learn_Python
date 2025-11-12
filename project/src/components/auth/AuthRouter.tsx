import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

export const AuthRouter = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshProfile } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for OAuth callback parameters
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          console.error('OAuth error:', error, errorDescription);
          navigate('/auth', {
            replace: true,
            state: {
              error: `Authentication failed: ${errorDescription || error}`
            }
          });
          return;
        }

        if (accessToken && refreshToken) {
          // OAuth successful - get session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (sessionError) {
            console.error('Session error:', sessionError);
            navigate('/auth', {
              replace: true,
              state: {
                error: 'Failed to complete sign in'
              }
            });
            return;
          }

          if (session?.user) {
            // Refresh profile data
            await refreshProfile();

            // Determine if this is a new user
            const isNewUser = searchParams.get('type') === 'signup';

            // Show appropriate notification
            if (isNewUser) {
              addNotification({
                type: 'auth',
                title: 'Welcome to PyLearn!',
                message: 'Your account has been created successfully.',
              });
            } else {
              addNotification({
                type: 'auth',
                title: 'Welcome Back!',
                message: 'Successfully signed in to your PyLearn account.',
              });
            }

            // Redirect to dashboard
            navigate('/dashboard', { replace: true });
          }
        } else {
          // Check if this is an email verification callback
          const token = searchParams.get('token');
          const email = searchParams.get('email');

          if (token && email) {
            // Handle email verification
            const { data, error } = await supabase.rpc('verify_email_token', { p_token: token });

            if (error || !data.success) {
              navigate('/verify-email', {
                replace: true,
                state: {
                  error: data?.message || 'Email verification failed'
                }
              });
              return;
            }

            // Verification successful
            addNotification({
              type: 'auth',
              title: 'Email Verified!',
              message: 'Your email has been verified successfully.',
            });

            navigate('/verify-email', {
              replace: true,
              state: {
                success: data.message,
                verified: true
              }
            });
          } else {
            // No valid parameters, redirect to auth
            navigate('/auth', { replace: true });
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/auth', {
          replace: true,
          state: {
            error: 'An error occurred during authentication'
          }
        });
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate, refreshProfile, addNotification]);

  // Show loading state while processing callback
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <span className="text-white text-2xl font-bold">Py</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">PyLearn</h1>
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600">Completing authentication...</p>
            <p className="text-sm text-gray-500">Please wait while we set up your account</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthRouter;