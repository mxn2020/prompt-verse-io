"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

type User = {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  role?: string;
  planTier?: string;
  teamId?: string;
};

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const createProfile = async (supabaseUser: SupabaseUser, name?: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: supabaseUser.id,
          name: name || supabaseUser.user_metadata?.name || null,
          avatar_url: supabaseUser.user_metadata?.avatar_url || null,
          role: 'user',
          plan_tier: 'free',
          preferences: {}
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      return null;
    }
  };

  const updateUserState = async (supabaseUser: SupabaseUser | null) => {
    if (!supabaseUser) {
      setUser(null);
      setProfile(null);
      return;
    }

    let userProfile = await fetchProfile(supabaseUser.id);
    
    // Create profile if it doesn't exist
    if (!userProfile) {
      userProfile = await createProfile(supabaseUser);
    }

    const user: User = {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: userProfile?.name || supabaseUser.user_metadata?.name || undefined,
      avatarUrl: userProfile?.avatar_url || supabaseUser.user_metadata?.avatar_url || undefined,
      role: userProfile?.role || 'user',
      planTier: userProfile?.plan_tier || 'free',
      teamId: userProfile?.team_id || undefined,
    };

    setUser(user);
    setProfile(userProfile);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          // Clear auth state and redirect to home
          setUser(null);
          setProfile(null);
          router.push('/');
          return;
        }
        await updateUserState(session?.user || null);
      } catch (error) {
        console.error('Error fetching session:', error);
        // Clear auth state and redirect to home on error
        setUser(null);
        setProfile(null);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) {
          // Clear auth state and redirect to home when session is lost
          setUser(null);
          setProfile(null);
          router.push('/');
        } else {
          await updateUserState(session?.user || null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user && !data.session) {
        toast.success("Account created! Please check your email to confirm your account.");
      } else {
        toast.success("Welcome! Your account has been created.");
      }
      
      router.push('/login');
    } catch (error) {
      console.error('Sign up error:', error);
      let message = "Something went wrong";
      if (error && typeof error === "object" && "message" in error) {
        message = (error as any).message;
      }
      toast.error(message);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success("Welcome back! You've successfully signed in.");
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Sign in error:', error);
      let message = "Invalid credentials";
      if (error && typeof error === "object" && "message" in error) {
        message = (error as any).message;
      }
      toast.error(message);
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting sign out process...');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase signOut error:', error);
        throw error;
      }
      
      console.log('Supabase sign out successful');
      
      // Clear local state immediately
      setUser(null);
      setProfile(null);
      console.log('User state cleared');
      
      // Navigate to home page
      router.push('/');
      console.log('Redirecting to home page');
      
      // Refresh the router to ensure clean state
      router.refresh();
      console.log('Router refresh called');
      
      // Show success message
      toast.success("You've been successfully signed out.");
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error("Error signing out");
      
      // Even if there's an error, try to clear local state and redirect
      setUser(null);
      setProfile(null);
      router.push('/');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
      
      // Update user state with new profile data
      setUser(prev => prev ? {
        ...prev,
        name: data.name || prev.name,
        avatarUrl: data.avatar_url || prev.avatarUrl,
        role: data.role || prev.role,
        planTier: data.plan_tier || prev.planTier,
        teamId: data.team_id || prev.teamId,
      } : null);

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      signUp, 
      signIn, 
      signOut, 
      updateProfile, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};