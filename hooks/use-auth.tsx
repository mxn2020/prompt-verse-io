"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type User = {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  role?: string;
  planTier?: string;
};

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: "Demo User",
          avatarUrl: "",
          role: "admin",
          planTier: "free",
        });
      }

      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: "Demo User",
            avatarUrl: "",
            role: "admin",
            planTier: "free",
          });
        } else {
          setUser(null);
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
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { name }
        }
      });

      if (error) {
        throw error;
      }

      toast.success("Account created! Please check your email to confirm your account.");
      router.push('/login');
    } catch (error) {
      let message = "Something went wrong";
      if (error && typeof error === "object" && "message" in error && typeof (error as any).message === "string") {
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
      let message = "Invalid credentials";
      if (error && typeof error === "object" && "message" in error && typeof (error as any).message === "string") {
        message = (error as any).message;
      }
      toast.error(message);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
    router.refresh();
    toast.success("You've been successfully signed out.");
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, loading }}>
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
