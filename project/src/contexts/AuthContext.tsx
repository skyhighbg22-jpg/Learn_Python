import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, Profile } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, fullName?: string) => Promise<{ user: User; needsVerification: boolean }>;
  signIn: (email: string, password: string) => Promise<{ user: User; needsVerification: boolean }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfileAvatar: (avatarUrl: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const ensureProfileExists = async (userId: string, userMetadata?: any) => {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (existingProfile) {
        return existingProfile;
      }

      // Create profile from user metadata or auth data
      const { data: { user } } = await supabase.auth.getUser();
      const fullName = userMetadata?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name;
      const username = userMetadata?.username || user?.user_metadata?.username ||
                     fullName?.toLowerCase().replace(/\s+/g, '_') ||
                     `user_${userId.slice(0, 8)}`;

      const newProfile = {
        id: userId,
        username,
        full_name: fullName || username,
        display_name: fullName || username,
        avatar_character: 'sky',
        avatar_url: userMetadata?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture,
        current_streak: 0,
        longest_streak: 0,
        total_xp: 0,
        current_level: 1,
        hearts: 5,
        last_heart_reset: new Date().toISOString(),
        league: 'bronze',
        learning_path: null,
        daily_goal_minutes: 30,
        email_confirmed: user?.email_confirmed || false,
        signup_method: 'email',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: createdProfile, error } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }

      return createdProfile;
    } catch (error) {
      console.error('Error in ensureProfileExists:', error);
      throw error;
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      // Retry logic for profile fetch
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error(`Error fetching profile (attempt ${retryCount + 1}):`, error);
          retryCount++;
          if (retryCount >= maxRetries) {
            throw new Error(`Failed to fetch profile after ${maxRetries} attempts: ${error.message}`);
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
          continue;
        }

        if (!data) {
          // Profile doesn't exist, create it from auth metadata
          const { data: { user } } = await supabase.auth.getUser();
          const createdProfile = await ensureProfileExists(userId, user?.user_metadata);
          setProfile(createdProfile);
          return;
        }

        setProfile(data);
        return;
      }
    } catch (error) {
      console.error('Critical error in fetchProfile:', error);
      // Don't create fallback profile - let the error propagate
      setProfile(null);
      throw error;
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName || username,
          display_name: fullName || username,
        }
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned');

    // Create profile with proper display_name
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username: username, // Ensure username is explicitly passed
      full_name: fullName || username,
      display_name: fullName || username,
      avatar_character: 'sky',
      avatar_url: null,
      email_confirmed: false,
      signup_method: 'email',
      current_streak: 0,
      longest_streak: 0,
      total_xp: 0,
      current_level: 1,
      hearts: 5,
      last_heart_reset: new Date().toISOString(),
      league: 'bronze',
      learning_path: null,
      daily_goal_minutes: 30,
    });

    if (profileError) throw profileError;

    // Send welcome email (handled by Supabase email templates)
    await sendWelcomeEmail(email, fullName || username);

    return {
      user: data.user,
      needsVerification: !data.user.email_confirmed
    };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned');

    return {
      user: data.user,
      needsVerification: !data.user.email_confirmed
    };
  };

  
  const resendVerificationEmail = async () => {
    if (!user?.email) throw new Error('No user email found');

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
    });

    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  };

  // Email service helper
  const sendWelcomeEmail = async (email: string, fullName: string) => {
    try {
      // Call email Edge Function to send custom welcome email
      const response = await fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          fullName,
          isNewUser: true,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send welcome email:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw error to prevent blocking signup
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const updateProfileAvatar = async (avatarUrl: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating avatar:', error);
        throw error;
      }

      // Update local profile state
      setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
    } catch (error) {
      console.error('Failed to update avatar:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
        updateProfileAvatar,
        resendVerificationEmail,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
