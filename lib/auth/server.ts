import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function isUserLoggedIn(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}