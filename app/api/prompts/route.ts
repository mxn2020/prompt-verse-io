import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserServer } from '@/lib/auth/server';
import { PromptService } from '@/lib/services/prompt.service';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createPromptSchema } from '@/lib/schemas/prompt';

export async function GET() {
  try {
    const user = await getCurrentUserServer();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createServerClient();
    const prompts = await PromptService.getPrompts(user.id, supabase);
    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserServer();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createPromptSchema.parse(body);

    const supabase = await createServerClient();
    const prompt = await PromptService.createPrompt(validatedData, user.id, supabase);
    return NextResponse.json(prompt);
  } catch (error) {
    console.error('Error creating prompt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}