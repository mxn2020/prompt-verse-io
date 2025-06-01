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
import { ArrowLeft, Plus, Layers } from "lucide-react";
import { toast } from "sonner";
import type { Prompt } from "@/lib/schemas/prompt";

interface EditorProps {
  prompt?: Prompt | null;
}

interface Section {
  id: string;
  title: string;
  content: string;
  type: 'system' | 'user' | 'assistant' | 'context';
}

export default function StructuredEditor({ prompt }: EditorProps) {
  const router = useRouter();
  const createPrompt = useCreatePrompt();
  
  const [formData, setFormData] = useState({
    title: prompt?.title || "",
    description: prompt?.description || "",
    visibility: prompt?.visibility || "private",
    tags: prompt?.tags || [],
    model_settings: prompt?.model_settings || {
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: 2048
    }
  });

  const [sections, setSections] = useState<Section[]>([
    {
      id: "system",
      title: "System Instructions",
      content: "You are a helpful AI assistant.",
      type: "system"
    },
    {
      id: "context",
      title: "Context",
      content: "Provide relevant context here...",
      type: "context"
    },
    {
      id: "user",
      title: "User Input",
      content: "{{user_input}}",
      type: "user"
    }
  ]);

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    const content = sections.map(section => 
      `# ${section.title}\n${section.content}`
    ).join('\n\n');

    if (!content.trim()) {
      toast.error("Please add content to at least one section");
      return;
    }

    try {
      await createPrompt.mutateAsync({
        ...formData,
        content,
        prompt_type: "structured"
      });
      
      router.push("/dashboard/prompts");
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast.error("Failed to save prompt");
    }
  };

  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: "New Section",
      content: "",
      type: "context"
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (id: string, field: keyof Section, value: string) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(section => section.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader 
        heading={prompt ? "Edit Structured Prompt" : "Create Structured Prompt"}
        text="Create a well-organized prompt with clear sections and structure."
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
            <CardDescription>Basic information about your structured prompt</CardDescription>
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

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Prompt Sections
                </CardTitle>
                <CardDescription>Organize your prompt into structured sections</CardDescription>
              </div>
              <Button onClick={addSection} size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add Section
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {sections.map((section) => (
              <Card key={section.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={section.title}
                        onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                        className="font-medium"
                        placeholder="Section title"
                      />
                      <Select
                        value={section.type}
                        onValueChange={(value: Section['type']) => updateSection(section.id, 'type', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="context">Context</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="assistant">Assistant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSection(section.id)}
                      disabled={sections.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={section.content}
                    onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                    placeholder={`Enter ${section.type} content here...`}
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

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
