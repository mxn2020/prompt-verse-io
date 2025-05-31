"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useCreatePrompt } from "@/hooks/use-prompts";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { Prompt } from "@/lib/schemas/prompt";

interface EditorProps {
  prompt?: Prompt | null;
}

export default function StandardEditor({ prompt }: EditorProps) {
  const router = useRouter();
  const createPrompt = useCreatePrompt();
  
  const [formData, setFormData] = useState({
    title: prompt?.title || "",
    description: prompt?.description || "",
    content: prompt?.content || "",
    visibility: prompt?.visibility || "private",
    tags: prompt?.tags || [],
    model_settings: prompt?.model_settings || {
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: 2048
    }
  });

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Please enter content");
      return;
    }

    try {
      await createPrompt.mutateAsync({
        ...formData,
        prompt_type: "standard"
      });
      
      router.push("/dashboard/prompts");
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast.error("Failed to save prompt");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader 
        heading={prompt ? "Edit Prompt" : "Create New Prompt"}
        text="Create or edit a standard prompt."
      >
        <Link href="/dashboard/prompts">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Prompts
          </Button>
        </Link>
      </DashboardHeader>

      <div className="grid gap-6">
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
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter a descriptive title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select 
                  value={formData.visibility}
                  onValueChange={(value: "private" | "team" | "public") => setFormData(prev => ({ ...prev, visibility: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="A brief description of what this prompt does"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input 
                id="tags" 
                value={formData.tags.join(", ")}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                }))}
                placeholder="Enter tags separated by commas"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="editor">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            <Card>
              <CardHeader>
                <CardTitle>Prompt Content</CardTitle>
                <CardDescription>Write your prompt content</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter your prompt content here..."
                  className="min-h-[300px] font-mono"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>See how your prompt will look</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap font-mono bg-muted p-4 rounded-lg">
                  {formData.content}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Model Settings</CardTitle>
                <CardDescription>Configure the AI model settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Select 
                    value={formData.model_settings.model}
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      model_settings: { ...prev.model_settings, model: value }
                    }))}
                  >
                    <SelectTrigger>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input
                      id="temperature"
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={formData.model_settings.temperature}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        model_settings: {
                          ...prev.model_settings,
                          temperature: parseFloat(e.target.value) || 0
                        }
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-tokens">Max Tokens</Label>
                    <Input
                      id="max-tokens"
                      type="number"
                      min="1"
                      max="8192"
                      value={formData.model_settings.max_tokens}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        model_settings: {
                          ...prev.model_settings,
                          max_tokens: parseInt(e.target.value) || 0
                        }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.push("/dashboard/prompts")}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={createPrompt.isPending}>
            {createPrompt.isPending ? "Saving..." : "Save Prompt"}
          </Button>
        </div>
      </div>
    </div>
  );
}