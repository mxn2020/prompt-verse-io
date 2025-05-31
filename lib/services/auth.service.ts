import { createClient } from '@/lib/supabase/client';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { 
  authUserSchema, 
  type SignUpData, 
  type SignInData, 
  type ResetPasswordData,
  type UpdatePasswordData,
  type AuthUser 
} from '@/lib/schemas/auth';
import type { User } from '@supabase/supabase-js';

export class AuthService {
  // Client-side auth methods
  static async signUp(data: SignUpData) {
    const supabase = createClient();
    
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { name: data.name }
      }
    });

    if (error) throw error;
    
    return { success: true };
  }

  static async signIn(data: SignInData) {
    const supabase = createClient();
    
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;
    
    return {
      user: authData.user,
      session: authData.session,
    };
  }

  static async signOut() {
    const supabase = createClient();
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    return { success: true };
  }

  static async resetPassword(data: ResetPasswordData) {
    const supabase = createClient();
    
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    
    return { success: true };
  }

  static async updatePassword(data: UpdatePasswordData) {
    const supabase = createClient();
    
    // First verify current password by re-authenticating
    const { data: user } = await supabase.auth.getUser();
    if (!user.user?.email) {
      throw new Error('User email not found');
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.user.email,
      password: data.currentPassword,
    });

    if (verifyError) {
      throw new Error('Current password is incorrect');
    }

    // Update to new password
    const { error } = await supabase.auth.updateUser({
      password: data.newPassword,
    });

    if (error) throw error;
    
    return { success: true };
  }

  // Server-side auth methods
  static async getCurrentUser(isServer = false): Promise<User | null> {
    const supabase = isServer ? await createServerClient() : createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  static async getCurrentUserClient(): Promise<User | null> {
    return this.getCurrentUser(false);
  }

  static async getCurrentUserServer(): Promise<User | null> {
    return this.getCurrentUser(true);
  }

  static async isUserLoggedIn(isServer = false): Promise<boolean> {
    const user = await this.getCurrentUser(isServer);
    return !!user;
  }

  static async getUserProfile(userId: string, isServer = false) {
    const supabase = isServer ? await createServerClient() : createClient();
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    
    // Ensure preferences is always an object
    let preferences: Record<string, any> = {};
    if (data.preferences && typeof data.preferences === 'object' && !Array.isArray(data.preferences)) {
      preferences = data.preferences;
    }
    
    return {
      ...data,
      preferences,
    };
  }

  // Transform Supabase user to our AuthUser type
  static transformUser(user: User | null): AuthUser | null {
    if (!user) return null;
    
    try {
      return authUserSchema.parse({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || null,
        avatarUrl: user.user_metadata?.avatar_url || null,
        role: user.user_metadata?.role || 'user',
        planTier: user.user_metadata?.plan_tier || 'free',
      });
    } catch {
      // Fallback if validation fails
      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        avatarUrl: user.user_metadata?.avatar_url,
        role: user.user_metadata?.role || 'user',
        planTier: user.user_metadata?.plan_tier || 'free',
      };
    }
  }
}
