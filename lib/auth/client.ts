import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useAuth } from "@/hooks/use-auth";

export async function getCurrentUserClient(): Promise<User | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function isUserLoggedInClient(): Promise<boolean> {
  const user = await getCurrentUserClient();
  return !!user;
}

export function useCurrentUser() {
  return useAuth().user;
}