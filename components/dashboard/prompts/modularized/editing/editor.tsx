"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useCreatePrompt } from "@/hooks/use-prompts";
import Link from "next/link";
import { ArrowLeft, Plus, Puzzle, Code } from "lucide-react";
import { toast } from "sonner";
import type { Prompt } from "@/lib/schemas/prompt";

interface EditorProps {
  prompt?: Prompt | null;
}

interface Module {
  id: string;
  name: string;
  content: string;
  variables: string[];
}

export default function ModularizedEditor({ prompt }: EditorProps) {
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

  const [modules, setModules] = useState<Module[]>([
    {
      id: "intro",
      name: "Introduction Module",
      content: "Welcome! I'm here to help you with {{task}}.",
      variables: ["task"]
    },
    {
      id: "main",
      name: "Main Logic Module",
      content: "Let me process your request about {{topic}} and provide {{response_type}}.",
      variables: ["topic", "response_type"]
    }
  ]);

  const [mainPrompt, setMainPrompt] = useState(
    "{{intro}}\n\n{{main}}\n\nIs there anything specific you'd like me to focus on?"
  );

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!mainPrompt.trim()) {
      toast.error("Please enter a main prompt structure");
      return;
    }

    const content = {
      main_prompt: mainPrompt,
      modules: modules.reduce((acc, module) => {
        acc[module.name] = {
          content: module.content,
          variables: module.variables
        };
        return acc;
      }, {} as Record<string, { content: string; variables: string[] }>)
    };

    try {
      await createPrompt.mutateAsync({
        ...formData,
        content: JSON.stringify(content),
        prompt_type: "modularized"
      });
      
      router.push("/dashboard/prompts");
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast.error("Failed to save prompt");
    }
  };

  const addModule = () => {
    const newModule: Module = {
      id: `module-${Date.now()}`,
      name: `Module ${modules.length + 1}`,
      content: "Enter module content here...",
      variables: []
    };
    setModules([...modules, newModule]);
  };

  const updateModule = (id: string, field: keyof Module, value: any) => {
    setModules(modules.map(module => 
      module.id === id ? { ...module, [field]: value } : module
    ));
  };

  const removeModule = (id: string) => {
    setModules(modules.filter(module => module.id !== id));
  };

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{\{(\w+)\}\}/g);
    return matches ? [...new Set(matches.map(match => match.slice(2, -2)))] : [];
  };

  const updateModuleContent = (id: string, content: string) => {
    const variables = extractVariables(content);
    setModules(modules.map(module => 
      module.id === id ? { ...module, content, variables } : module
    ));
  };

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader 
        heading={prompt ? "Edit Modularized Prompt" : "Create Modularized Prompt"}
        text="Build prompts from reusable components and modules."
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
            <CardDescription>Basic information about your modularized prompt</CardDescription>
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
                  <Puzzle className="h-5 w-5" />
                  Modules
                </CardTitle>
                <CardDescription>Create reusable components for your prompt</CardDescription>
              </div>
              <Button onClick={addModule} size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add Module
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {modules.map((module) => (
              <Card key={module.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Input
                      value={module.name}
                      onChange={(e) => updateModule(module.id, 'name', e.target.value)}
                      className="font-medium max-w-md"
                      placeholder="Module name"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeModule(module.id)}
                      disabled={modules.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Content</Label>
                    <Textarea
                      value={module.content}
                      onChange={(e) => updateModuleContent(module.id, e.target.value)}
                      placeholder="Enter module content. Use {{variable}} for dynamic values."
                      className="min-h-[100px] font-mono text-sm"
                    />
                  </div>
                  {module.variables.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Variables</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {module.variables.map((variable) => (
                          <span
                            key={variable}
                            className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs font-mono"
                          >
                            <Code className="h-3 w-3 mr-1" />
                            {variable}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Main Prompt Structure</CardTitle>
            <CardDescription>
              Define how modules are combined. Use {`{{module_name}}`} to reference modules.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={mainPrompt}
              onChange={(e) => setMainPrompt(e.target.value)}
              placeholder="Enter the main prompt structure using module references like {{intro}}"
              className="min-h-[150px] font-mono text-sm"
            />
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
