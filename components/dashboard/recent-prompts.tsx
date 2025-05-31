"use client";

import { formatDistanceToNow } from "date-fns";
import { Bookmark, Edit, MessageSquare, MoreHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePrompts } from "@/lib/queries/prompt.queries";
import { useTogglePromptStar, useDeletePrompt, useDuplicatePrompt } from "@/lib/mutations/prompt.mutations";
import type { Prompt } from "@/lib/schemas/prompt";

interface RecentPromptsProps {
  initialPrompts?: Prompt[];
}

export function RecentPrompts({ initialPrompts = [] }: RecentPromptsProps) {
  const { data: prompts = initialPrompts, isLoading } = usePrompts();
  const toggleStar = useTogglePromptStar();
  const deletePrompt = useDeletePrompt();
  const duplicatePrompt = useDuplicatePrompt();

  const recentPrompts = prompts.slice(0, 5);

  const handleToggleStar = (promptId: string, currentStarred: boolean) => {
    toggleStar.mutate({ promptId, starred: !currentStarred });
  };

  const handleDelete = (promptId: string) => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      deletePrompt.mutate(promptId);
    }
  };

  const handleDuplicate = (prompt: Prompt) => {
    duplicatePrompt.mutate({
      title: `${prompt.title} (Copy)`,
      description: prompt.description || "",
      content: prompt.content,
      prompt_type: prompt.prompt_type,
      visibility: prompt.visibility,
      tags: prompt.tags,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
              <div className="flex items-center space-x-4">
                <div className="h-9 w-9 bg-muted rounded-md"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded"></div>
                  <div className="h-3 w-24 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (recentPrompts.length === 0) {
    return (
      <div className="text-center py-6">
        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No prompts yet. Create your first prompt to get started!</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/prompts/new">Create Prompt</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentPrompts.map((prompt) => (
        <div
          key={prompt.id}
          className="flex items-center justify-between space-x-4 rounded-md border p-4"
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-md bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium leading-none">{prompt.title}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-muted-foreground mr-2 capitalize">
                  {prompt.prompt_type}
                </span>
                <span className="text-xs text-muted-foreground">
                  Updated {formatDistanceToNow(new Date(prompt.updated_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-2"
              onClick={() => handleToggleStar(prompt.id, prompt.starred)}
              disabled={toggleStar.isPending}
            >
              <Star 
                className={`h-4 w-4 ${
                  prompt.starred ? "fill-primary text-primary" : "text-muted-foreground"
                }`} 
              />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/prompts/${prompt.id}`}>View</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/prompts/${prompt.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDuplicate(prompt)}
                  disabled={duplicatePrompt.isPending}
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleDelete(prompt.id)}
                  className="text-destructive"
                  disabled={deletePrompt.isPending}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}