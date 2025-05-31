import { requireAuth } from '@/lib/auth/server';
import { PromptService } from '@/lib/services/prompt.service';
import { DashboardPageClient } from '@/components/dashboard/dashboard-page-client';

export default async function DashboardPage() {
  const user = await requireAuth();
  const initialPrompts = await PromptService.getPrompts(user.id, true);

  return <DashboardPageClient initialPrompts={initialPrompts} />;
}
