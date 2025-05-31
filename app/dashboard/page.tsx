import { requireAuth } from '@/lib/auth/server';
import { PromptService } from '@/lib/services/prompt.service';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { DashboardPageClient } from '@/components/dashboard/dashboard-page-client';

export default async function DashboardPage() {
  const user = await requireAuth();
  const supabase = await createServerClient();
  const initialPrompts = await PromptService.getPrompts(user.id, supabase);

  return <DashboardPageClient initialPrompts={initialPrompts} />;
}
