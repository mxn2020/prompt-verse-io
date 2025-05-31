"use client";

import { useEffect, useState } from "react";
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
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type { Database } from "@/lib/supabase/types";

type Prompt = Database['public']['Tables']['prompts']['Row'] & {
  user_profiles: Database['public']['Tables']['user_profiles']['Row'];
};

export function RecentPrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    const fetchRecentPrompts = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('prompts')
          .select(`
            *,
            user_profiles!prompts_owner_id_fkey(*)
          `)
          .eq('owner_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching recent prompts:', error);
          return;
        }

        setPrompts(
          (data || []).map((prompt: any) => ({
            ...prompt,
            user_profiles: prompt.user_profiles && !('error' in prompt.user_profiles)
              ? prompt.user_profiles
              : {
                  avatar_url: null,
                  created_at: "",
                  id: "",
                  name: null,
                  plan_tier: "",
                  preferences: {},
                  role: "",
                  team_id: null,
                  updated_at: ""
                }
          }))
        );
      } catch (error) {
        console.error('Error fetching recent prompts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPrompts();
  }, [user, supabase]);

  const toggleStar = async (promptId: string, currentStarred: boolean) => {
    try {
      const { error } = await supabase
        .from('prompts')
        .update({ starred: !currentStarred })
        .eq('id', promptId);

      if (error) {
        console.error('Error toggling star:', error);
        return;
      }

      setPrompts(prev => prev.map(prompt => 
        prompt.id === promptId 
          ? { ...prompt, starred: !currentStarred }
          : prompt
      ));
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  if (loading) {
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

  if (prompts.length === 0) {
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
      {prompts.map((prompt) => (
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
            <Avatar className="h-6 w-6">
              <AvatarImage src={prompt.user_profiles?.avatar_url || ''} alt={prompt.user_profiles?.name || 'User'} />
              <AvatarFallback className="text-[10px]">
                {prompt.user_profiles?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-2"
              onClick={() => toggleStar(prompt.id, prompt.starred)}
            >
              <Star className={`h-4 w-4 ${prompt.starred ? "fill-primary text-primary" : "text-muted-foreground"}`} />
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
                <DropdownMenuItem>
                  <Bookmark className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
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

