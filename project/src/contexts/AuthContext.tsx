import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, Profile } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, fullName?: string) => Promise<{ user: User; needsVerification: boolean }>;
  signIn: (email: string, password: string) => Promise<{ user: User; needsVerification: boolean }>;
  signInWithGoogle: () => Promise<{ user: User; needsVerification: boolean; isNewUser: boolean }>;
  signInWithApple: () => Promise<{ user: User; needsVerification: boolean; isNewUser: boolean }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
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

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    setProfile(data);
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
        }
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned');

    // Create profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username,
      full_name: fullName || username,
      display_name: fullName || username,
      avatar_character: 'sky',
      email_confirmed: false,
      signup_method: 'email',
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

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) throw error;

    // Handle the OAuth callback
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;
    if (!session?.user) throw new Error('No user returned after OAuth');

    // Check if user exists in profiles table
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    const isNewUser = !existingProfile;

    if (isNewUser) {
      // Create profile for new OAuth user
      const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name;
      const username = session.user.user_metadata?.username ||
                     fullName?.toLowerCase().replace(/\s+/g, '_') ||
                     `user_${session.user.id.slice(0, 8)}`;

      await supabase.from('profiles').insert({
        id: session.user.id,
        username,
        full_name: fullName || username,
        display_name: fullName || username,
        avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
        email_confirmed: true, // OAuth emails are pre-verified
        signup_method: 'google',
      });

      await sendWelcomeEmail(session.user.email!, fullName || username);
    }

    return {
      user: session.user,
      needsVerification: false, // OAuth users don't need email verification
      isNewUser
    };
  };

  const signInWithApple = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'name email',
      }
    });

    if (error) throw error;

    // Handle the OAuth callback
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;
    if (!session?.user) throw new Error('No user returned after OAuth');

    // Check if user exists in profiles table
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    const isNewUser = !existingProfile;

    if (isNewUser) {
      // Create profile for new OAuth user
      const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name;
      const username = session.user.user_metadata?.username ||
                     fullName?.toLowerCase().replace(/\s+/g, '_') ||
                     `user_${session.user.id.slice(0, 8)}`;

      await supabase.from('profiles').insert({
        id: session.user.id,
        username,
        full_name: fullName || username,
        display_name: fullName || username,
        email_confirmed: true, // OAuth emails are pre-verified
        signup_method: 'apple',
      });

      await sendWelcomeEmail(session.user.email!, fullName || username);
    }

    return {
      user: session.user,
      needsVerification: false, // OAuth users don't need email verification
      isNewUser
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
