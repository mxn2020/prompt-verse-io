import { createClient as createServerClient } from '@/lib/supabase/server';
import { promptSchema, type CreatePromptData } from '@/lib/schemas/prompt';

export class PromptService {
  static async getPrompts(userId: string, isServer = false) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('owner_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data.map(prompt => promptSchema.parse(prompt));
  }

  static async getPrompt(promptId: string, userId: string, isServer = false) {
    const supabase = await createServerClient();
    
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', promptId)
      .eq('owner_id', userId)
      .single();

    if (error) throw error;
    return promptSchema.parse(data);
  }

  static async createPrompt(promptData: CreatePromptData, userId: string) {
    const supabase = await createServerClient();
    
    const { data, error } = await supabase
      .from('prompts')
      .insert({
        ...promptData,
        owner_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return promptSchema.parse(data);
  }

  static async updatePrompt(promptId: string, updates: Partial<CreatePromptData>) {
    const supabase = await createServerClient();
    
    const { data, error } = await supabase
      .from('prompts')
      .update(updates)
      .eq('id', promptId)
      .select()
      .single();

    if (error) throw error;
    return promptSchema.parse(data);
  }

  static async deletePrompt(promptId: string) {
    const supabase = await createServerClient();
    
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', promptId);

    if (error) throw error;
  }

  static async toggleStar(promptId: string, starred: boolean) {
    const supabase = await createServerClient();
    
    const { data, error } = await supabase
      .from('prompts')
      .update({ starred })
      .eq('id', promptId)
      .select()
      .single();

    if (error) throw error;
    return promptSchema.parse(data);
  }
}