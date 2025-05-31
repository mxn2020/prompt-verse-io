import { AuthService } from '@/lib/services/auth.service';
import type { User } from '@supabase/supabase-js';

export async function getCurrentUserClient(): Promise<User | null> {
  return AuthService.getCurrentUserClient();
}

export async function getUserProfileClient(userId: string) {
  return AuthService.getUserProfile(userId, false);
}