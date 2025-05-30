import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// In a real application, these would be environment variables
// For MVP purposes, we'll use dummy values
const supabaseUrl = 'https://example.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
};