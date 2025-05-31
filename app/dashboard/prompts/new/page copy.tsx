"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { PromptsEditor } from "@/components/dashboard/prompts/prompts-editor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import type { Database } from "@/lib/supabase/types";

type PromptType = Database['public']['Enums']['prompt_type'];
type VisibilityType = Database['public']['Enums']['visibility_type'];

interface PromptFormData {
  title: string;
  description: string;
  content: string;
  prompt_type: PromptType;
  visibility: VisibilityType;
  tags: string[];
  model_settings: {
    model: string;
    temperature?: number;
    max_tokens?: number;
  };
}

export default function NewPromptPage() {
  const [formData, setFormData] = useState<PromptFormData>({
    title: "",
    description: "",
    content: "",
    prompt_type: "standard",
    visibility: "private",
    tags: [],
    model_settings: {
      model: "gpt-4"
    }
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const handleInputChange = (field: keyof PromptFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleModelSettingsChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      model_settings: {
        ...prev.model_settings,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("You must be logged in to create a prompt");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Please enter a title for your prompt");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Please enter content for your prompt");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('prompts')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          content: formData.content.trim(),
          prompt_type: formData.prompt_type,
          visibility: formData.visibility,
          tags: formData.tags,
          model_settings: formData.model_settings,
          owner_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating prompt:', error);
        toast.error("Failed to create prompt");
        return;
      }

      toast.success("Prompt created successfully!");
      router.push(`/dashboard/prompts/${data.id}`);
    } catch (error) {
      console.error('Error creating prompt:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader 
        heading="Create New Prompt"
        text="Create a new prompt from scratch or from a template."
      >
        <Link href="/dashboard/prompts">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Prompts
          </Button>
        </Link>
      </DashboardHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>Prompt Details</CardTitle>
          <CardDescription>Basic information about your prompt</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title" 
                placeholder="Enter a descriptive title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompt-type">Prompt Type</Label>
              <Select 
                value={formData.prompt_type} 
                onValueChange={(value: PromptType) => handleInputChange('prompt_type', value)}
              >
                <SelectTrigger id="prompt-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Prompt</SelectItem>
                  <SelectItem value="structured">Structured Prompt</SelectItem>
                  <SelectItem value="modularized">Modularized Prompt</SelectItem>
                  <SelectItem value="advanced">Advanced Prompt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="A brief description of what this prompt does"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input 
              id="tags" 
              placeholder="Enter tags separated by commas"
              value={formData.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Content</CardTitle>
              <CardDescription>Enter your prompt content</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your prompt content here..."
                className="min-h-[300px] font-mono"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>See how your prompt will look when used</CardDescription>
            </CardHeader>
            <CardContent>
              {!formData.content.trim() ? (
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No content to preview. Please add content in the Editor tab.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="p-4 border rounded-md bg-muted/50">
                  <div className="whitespace-pre-wrap font-mono text-sm">
                    {formData.content}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Settings</CardTitle>
              <CardDescription>Configure advanced settings for your prompt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model">Default AI Model</Label>
                <Select 
                  value={formData.model_settings.model}
                  onValueChange={(value) => handleModelSettingsChange('model', value)}
                >
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                    <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                    <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select 
                  value={formData.visibility}
                  onValueChange={(value: VisibilityType) => handleInputChange('visibility', value)}
                >
                  <SelectTrigger id="visibility">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    placeholder="0.7"
                    value={formData.model_settings.temperature || ''}
                    onChange={(e) => handleModelSettingsChange('temperature', parseFloat(e.target.value) || undefined)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-tokens">Max Tokens</Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    min="1"
                    max="8192"
                    placeholder="2048"
                    value={formData.model_settings.max_tokens || ''}
                    onChange={(e) => handleModelSettingsChange('max_tokens', parseInt(e.target.value) || undefined)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-4">
        <Link href="/dashboard/prompts">
          <Button variant="outline" disabled={loading}>Cancel</Button>
        </Link>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Prompt"}
        </Button>
      </div>
    </div>
  );
}