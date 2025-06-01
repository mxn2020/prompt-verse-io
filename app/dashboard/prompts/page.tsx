import { buttonVariants } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { PromptsList } from "@/components/dashboard/prompts/prompts-list";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic'

export default function PromptsPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader 
        heading="Prompts"
        text="Create and manage your prompts."
      >
        <Link
          href="/dashboard/prompts/new/select-type"
          className={cn(
            buttonVariants({ variant: "default" }),
            "gap-1"
          )}
        >
          <Plus className="h-4 w-4" />
          <span>New Prompt</span>
        </Link>
      </DashboardHeader>
      <PromptsList />
    </div>
  );
}