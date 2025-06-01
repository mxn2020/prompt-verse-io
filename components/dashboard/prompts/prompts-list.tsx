"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Edit, MoreHorizontal, Search, Star, Trash, Copy } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import type { Database } from "@/lib/supabase/types";

type Prompt = Database['public']['Tables']['prompts']['Row'] & {
  prompt_modules: Array<{
    modules: Database['public']['Tables']['modules']['Row'];
  }>;
};

export function PromptsList() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    const fetchPrompts = async () => {
      if (!user) return;

      try {
        let query = supabase
          .from('prompts')
          .select(`
            *,
            prompt_modules(
              modules(*)
            )
          `)
          .eq('owner_id', user.id)
          .order('updated_at', { ascending: false });

        // Apply filters
        if (activeTab === 'starred') {
          query = query.eq('starred', true);
        } else if (activeTab === 'recent') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          query = query.gte('updated_at', sevenDaysAgo.toISOString());
        }

        if (typeFilter !== 'all') {
          query = query.eq(
            'prompt_type',
            typeFilter as 'standard' | 'structured' | 'modularized' | 'advanced'
          );
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching prompts:', error);
          setError('Failed to load prompts. Please try again.');
          return;
        }

        setError(null);
        let filteredData = data || [];

        // Apply search filter
        if (searchTerm) {
          filteredData = filteredData.filter(prompt =>
            prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prompt.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }

        setPrompts(filteredData);
      } catch (error) {
        console.error('Error fetching prompts:', error);
        setError('Failed to load prompts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [user, supabase, searchTerm, typeFilter, activeTab]);

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

  const deletePrompt = async (promptId: string) => {
    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', promptId);

      if (error) {
        console.error('Error deleting prompt:', error);
        toast.error('Failed to delete prompt');
        return;
      }

      setPrompts(prev => prev.filter(prompt => prompt.id !== promptId));
      toast.success('Prompt deleted successfully');
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast.error('Failed to delete prompt');
    }
  };

  const duplicatePrompt = async (prompt: Prompt) => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('prompts')
        .insert({
          title: `${prompt.title} (Copy)`,
          content: prompt.content,
          description: prompt.description,
          prompt_type: prompt.prompt_type,
          visibility: prompt.visibility,
          tags: prompt.tags,
          model_settings: prompt.model_settings,
          owner_id: user.id,
        })
        .select(`
          *,
          prompt_modules(
            modules(*)
          )
        `)
        .single();

      if (error) {
        console.error('Error duplicating prompt:', error);
        toast.error('Failed to duplicate prompt');
        return;
      }

      // Add the new prompt to the beginning of the list
      setPrompts(prev => [data as Prompt, ...prev]);
      toast.success('Prompt duplicated successfully');
    } catch (error) {
      console.error('Error duplicating prompt:', error);
      toast.error('Failed to duplicate prompt');
    }
  };

  const handleDeleteClick = (promptId: string) => {
    setPromptToDelete(promptId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (promptToDelete) {
      await deletePrompt(promptToDelete);
      setDeleteDialogOpen(false);
      setPromptToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="animate-pulse h-10 w-[400px] bg-muted rounded"></div>
          <div className="flex gap-2">
            <div className="animate-pulse h-9 w-[280px] bg-muted rounded"></div>
            <div className="animate-pulse h-9 w-[150px] bg-muted rounded"></div>
          </div>
        </div>
        <div className="animate-pulse h-[400px] bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="all">All Prompts</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search prompts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 md:w-[200px] lg:w-[280px]" 
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-9 w-full sm:w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="structured">Structured</SelectItem>
              <SelectItem value="modularized">Modularized</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {error && (
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      )}
      
      {!loading && !error && prompts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No prompts found.</p>
          <Button asChild>
            <Link href="/dashboard/prompts/new/select-type">Create your first prompt</Link>
          </Button>
        </div>
      )}
      
      {!loading && !error && prompts.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden sm:table-cell">Modules</TableHead>
                <TableHead className="hidden md:table-cell">Tags</TableHead>
                <TableHead className="hidden lg:table-cell">Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prompts.map((prompt) => (
                <TableRow key={prompt.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => toggleStar(prompt.id, prompt.starred)}
                      >
                        <Star className={`h-4 w-4 ${prompt.starred ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                      </Button>
                      <Link href={`/dashboard/prompts/${prompt.id}`} className="hover:underline">
                        {prompt.title}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal capitalize">
                      {prompt.prompt_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {prompt.prompt_modules.length}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {prompt.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="font-normal text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {formatDistanceToNow(new Date(prompt.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(prompt.updated_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/prompts/${prompt.id}`}>
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/prompts/editor?promptId=${prompt.id}&type=${prompt.prompt_type}&style=editing`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicatePrompt(prompt)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteClick(prompt.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your prompt
              and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPromptToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}