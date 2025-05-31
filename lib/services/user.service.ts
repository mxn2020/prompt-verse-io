import { createClient } from '@/lib/supabase/client';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { userProfileSchema, type UpdateProfileData } from '@/lib/schemas/user';

export class UserService {
  static async getProfile(userId: string, isServer = false) {
    const supabase = isServer ? await createServerClient() : createClient();
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return userProfileSchema.parse(data);
  }

  static async updateProfile(userId: string, updates: UpdateProfileData) {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return userProfileSchema.parse(data);
  }

  static async uploadAvatar(userId: string, file: File) {
    const supabase = createClient();
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return publicUrl;
  }
}