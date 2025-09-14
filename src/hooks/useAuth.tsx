import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Ensure a profile row exists for the signed-in user
  const ensureProfile = async (u: User) => {
    try {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('id')
        .eq('user_id', u.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Profile check failed:', error);
        return;
      }

      if (!data) {
        await (supabase as any)
          .from('profiles')
          .insert({
            user_id: u.id,
            full_name: u.user_metadata?.full_name || '',
            site_name: u.user_metadata?.site_name || '',
            email: u.email,
            mobile_number: u.user_metadata?.mobile_number || '',
          });
      }
    } catch (e) {
      // No-op
    }
  };

  useEffect(() => {
    // Listen for auth changes FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_IN') {
        toast.success('Welcome to FALCON Command Center');
        if (session?.user) {
          setTimeout(() => {
            ensureProfile(session.user);
          }, 0);
        }
      } else if (event === 'SIGNED_OUT') {
        toast.success('Signed out successfully');
      }
    });

    // Then get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        setTimeout(() => {
          ensureProfile(session.user);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Account created! Please check your email to confirm your account.');
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const updateProfile = async (data: any) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await (supabase as any)
      .from('profiles')
      .upsert({ 
        user_id: user.id, 
        ...data,
        updated_at: new Date().toISOString()
      });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Profile updated successfully');
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};