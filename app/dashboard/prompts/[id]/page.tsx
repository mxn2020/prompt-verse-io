import { redirect } from 'next/navigation';
import { getCurrentUserServer } from '@/lib/auth/server';
import { PromptService } from '@/lib/services/prompt.service';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { DashboardHeader } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { ArrowLeft, Edit, Copy, Trash, Star } from 'lucide-react';
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

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUserServer();
  if (!user) {
    redirect('/login');
  }

  const resolvedParams = await params;
  const prompt = await getPrompt(resolvedParams.id, user.id);

  if (!prompt) {
    redirect('/dashboard/prompts');
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader 
        heading={prompt.title}
        text={`Created ${formatDistanceToNow(new Date(prompt.created_at), { addSuffix: true })}`}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/prompts">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Prompts
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/prompts/editor?promptId=${prompt.id}&type=${prompt.prompt_type}&style=editing`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      </DashboardHeader>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              {prompt.description && (
                <CardDescription>{prompt.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap bg-muted p-4 rounded-lg">
                {prompt.content}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <div className="mt-1">
                  <Badge variant="outline" className="capitalize">
                    {prompt.prompt_type}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Visibility</label>
                <div className="mt-1">
                  <Badge variant="secondary" className="capitalize">
                    {prompt.visibility}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Version</label>
                <div className="mt-1 text-sm">{prompt.version}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Usage Count</label>
                <div className="mt-1 text-sm">{prompt.usage_count}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Starred</label>
                <div className="mt-1">
                  <Star className={`h-4 w-4 ${prompt.starred ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                </div>
              </div>

              {prompt.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tags</label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {prompt.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {prompt.model_settings && typeof prompt.model_settings === 'object' && (
                <>
                  {(prompt.model_settings as any).model && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Model</label>
                      <div className="mt-1 text-sm">{(prompt.model_settings as any).model}</div>
                    </div>
                  )}
                  {(prompt.model_settings as any).temperature !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Temperature</label>
                      <div className="mt-1 text-sm">{(prompt.model_settings as any).temperature}</div>
                    </div>
                  )}
                  {(prompt.model_settings as any).max_tokens && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Max Tokens</label>
                      <div className="mt-1 text-sm">{(prompt.model_settings as any).max_tokens}</div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <div className="mt-1 text-sm">
                  {formatDistanceToNow(new Date(prompt.created_at), { addSuffix: true })}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <div className="mt-1 text-sm">
                  {formatDistanceToNow(new Date(prompt.updated_at), { addSuffix: true })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
