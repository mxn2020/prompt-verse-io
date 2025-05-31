"use client";

import { usePrompts } from '@/lib/queries/prompt.queries';
import { DashboardHeader } from '@/components/dashboard/header';
import { Overview } from '@/components/dashboard/overview';
import { RecentPrompts } from '@/components/dashboard/recent-prompts';
import type { Prompt } from '@/lib/schemas/prompt';

interface DashboardPageClientProps {
  initialPrompts: Prompt[];
}

export function DashboardPageClient({ initialPrompts }: DashboardPageClientProps) {
  const { data: prompts = initialPrompts } = usePrompts();

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader 
        heading="Dashboard"
        text="Get an overview of your prompt engineering workspace."
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Overview />
        </div>
        <div className="col-span-3">
          <RecentPrompts initialPrompts={prompts.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}