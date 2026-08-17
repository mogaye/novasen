'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  email?: string;
  full_name: string;
  phone?: string;
  whatsapp?: string;
  role: 'client' | 'vendeur' | 'chauffeur' | 'admin';
  avatar_url?: string;
  cover_url?: string;
  zone_id?: string;
  address?: string;
  shop_name?: string;
  vehicle_type?: string;
  vehicle_plate?: string;
  is_verified?: boolean;
  rating?: number;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithIdentifier: (identifier: string, password: string) => Promise<{ error: any }>;
  signUpWithPhoneOrEmail: (
    identifier: string,
    password: string,
    fullName: string
  ) => Promise<{ error: any }>;
  sendOtpCode: (identifier: string) => Promise<{ error: any; isEmail: boolean; destination: string }>;
  verifyOtpCode: (identifier: string, token: string, fullName?: string, password?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to normalize phone numbers and emails
export function normalizeIdentifier(identifier: string): { isPhone: boolean; formattedPhone?: string; authEmail: string } {
  const trimmed = identifier.trim();
  const isEmail = trimmed.includes('@');
  
  if (isEmail) {
    return { isPhone: false, authEmail: trimmed.toLowerCase() };
  }

  // Extract all digits
  const digitsOnly = trimmed.replace(/\D/g, '');
  const cleanDigits = digitsOnly.startsWith('221') ? digitsOnly.slice(3) : digitsOnly;
  const international = `+221${cleanDigits}`;
  const authEmail = `user${cleanDigits}@novasen.com`;

  return {
    isPhone: true,
    formattedPhone: international,
    authEmail: authEmail,
  };
}

export function broadcastDeviceAuth(email: string, session: any) {
  if (!email || !session?.access_token) return;
  const channelName = `auth-sync-${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const ch = supabase.channel(channelName);
  ch.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      ch.send({
        type: 'broadcast',
        event: 'device_authenticated',
        payload: {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          user: session.user,
        },
      });
    }
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        setProfile(data as UserProfile);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user?.id) {
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user?.id) {
          await fetchProfile(session.user.id);
          // Broadcast to other waiting devices (e.g., computer while phone verifies)
          if (session.user.email) {
            broadcastDeviceAuth(session.user.email, session);
          }
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithIdentifier = async (identifier: string, password: string) => {
    const { authEmail } = normalizeIdentifier(identifier);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password,
    });

    if (data.user) {
      await fetchProfile(data.user.id);
    }
    return { error };
  };

  const signUpWithPhoneOrEmail = async (
    identifier: string,
    password: string,
    fullName: string
  ) => {
    const { isPhone, formattedPhone, authEmail } = normalizeIdentifier(identifier);

    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/connexion` : undefined;

    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName.trim(),
          phone: isPhone ? formattedPhone : '',
          whatsapp: isPhone ? formattedPhone : '',
        },
      },
    });

    if (data.user && !error) {
      // Upsert profile in Supabase table
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: authEmail,
        full_name: fullName.trim(),
        phone: isPhone ? formattedPhone : null,
        whatsapp: isPhone ? formattedPhone : null,
        role: 'client',
        zone_id: 'plateau',
        address: 'Sénégal',
      });
      await fetchProfile(data.user.id);
    }

    return { error };
  };

  const sendOtpCode = async (identifier: string) => {
    const { isPhone, formattedPhone, authEmail } = normalizeIdentifier(identifier);
    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/connexion` : undefined;

    if (isPhone) {
      // First try native SMS OTP if provider is configured in Supabase
      try {
        const { error: phoneErr } = await supabase.auth.signInWithOtp({
          phone: formattedPhone!,
          options: {
            shouldCreateUser: true,
          },
        });
        if (!phoneErr) {
          return { error: null, isEmail: false, destination: formattedPhone! };
        }
      } catch {
        // Fall back to email auth alias
      }
      
      // Fallback: send via authEmail alias
      const { error } = await supabase.auth.signInWithOtp({
        email: authEmail,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: redirectUrl,
        },
      });
      return { error, isEmail: true, destination: authEmail };
    }

    // Direct Email OTP
    const { error } = await supabase.auth.signInWithOtp({
      email: authEmail,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectUrl,
      },
    });

    return { error, isEmail: true, destination: authEmail };
  };

  const verifyOtpCode = async (identifier: string, token: string, fullName?: string, password?: string) => {
    const { isPhone, formattedPhone, authEmail } = normalizeIdentifier(identifier);

    let verifyResult: any = null;

    if (isPhone) {
      try {
        const res = await supabase.auth.verifyOtp({
          phone: formattedPhone!,
          token: token.trim(),
          type: 'sms',
        });
        if (!res.error) {
          verifyResult = res;
        }
      } catch {
        // Continue to email alias
      }
    }

    // Try multiple OTP verification types in case of signup vs magiclink vs email
    if (!verifyResult || verifyResult.error) {
      const typesToTry: ('email' | 'signup' | 'magiclink')[] = ['email', 'signup', 'magiclink'];
      for (const otpType of typesToTry) {
        try {
          const res = await supabase.auth.verifyOtp({
            email: authEmail,
            token: token.trim(),
            type: otpType as any,
          });
          if (res?.data?.user && !res.error) {
            verifyResult = res;
            break;
          }
        } catch {
          // try next
        }
      }
    }

    if (verifyResult?.data?.user && !verifyResult.error) {
      const userId = verifyResult.data.user.id;
      
      // If a password was provided upon signup, save it for direct subsequent logins
      if (password && password.trim().length >= 6) {
        try {
          await supabase.auth.updateUser({ password: password.trim() });
        } catch (pwErr) {
          console.warn('Password update post-OTP warning:', pwErr);
        }
      }

      // Ensure profile exists
      await supabase.from('profiles').upsert({
        id: userId,
        email: authEmail,
        full_name: fullName?.trim() || verifyResult.data.user.user_metadata?.full_name || 'Membre NovaSen',
        phone: isPhone ? formattedPhone : null,
        whatsapp: isPhone ? formattedPhone : null,
        role: 'client',
        zone_id: 'plateau',
        address: 'Sénégal',
      });
      await fetchProfile(userId);
    }

    return { error: verifyResult?.error || null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signInWithIdentifier,
        signUpWithPhoneOrEmail,
        sendOtpCode,
        verifyOtpCode,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
