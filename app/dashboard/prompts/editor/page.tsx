import { redirect } from 'next/navigation';
import { default as nextDynamic } from 'next/dynamic';
import { getCurrentUserServer } from '@/lib/auth/server';
import { PromptService } from '@/lib/services/prompt.service';
import { createClient as createServerClient } from '@/lib/supabase/server';
import type { Prompt } from '@/lib/schemas/prompt';

export const dynamic = 'force-dynamic';

async function getPrompt(promptId: string, userId: string): Promise<Prompt | null> {
  try {
    const supabase = await createServerClient();
    const prompt = await PromptService.getPrompt(promptId, userId, supabase);
    return prompt;
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return null;
  }
}

export default async function PromptEditorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const user = await getCurrentUserServer();
  if (!user) {
    redirect('/');
  }

  const resolvedSearchParams = await searchParams;

  const promptId = resolvedSearchParams.promptId;
  const editorStyle = resolvedSearchParams.style || 'editing';

  let prompt: Prompt | null = null;
  let promptType: string = resolvedSearchParams.type || 'standard';

  if (promptId) {
    prompt = await getPrompt(promptId, user.id);
    if (prompt) {
      promptType = prompt.prompt_type;
    }
  }

  // Validate editor style
  const validStyles = ['editing', 'viewing', 'commenting', 'suggesting'];
  if (!validStyles.includes(editorStyle)) {
    redirect('/dashboard/prompts/editor?style=editing');
  }

  // Validate prompt type
  const validTypes = ['standard', 'structured', 'modularized', 'advanced'];
  if (!validTypes.includes(promptType)) {
    redirect('/dashboard/prompts/editor?type=standard');
  }

  // Dynamic import of the editor component based on type and style
  const EditorComponent = nextDynamic(() => 
    import(`@/components/dashboard/prompts/${promptType}/${editorStyle}/editor`).catch(() => {
      // Fallback to standard editor if specific component doesn't exist
      return import(`@/components/dashboard/prompts/standard/${editorStyle}/editor`);
    })
  ) as React.ComponentType<{ prompt: Prompt | null }>;

  return <EditorComponent prompt={prompt} />;
}