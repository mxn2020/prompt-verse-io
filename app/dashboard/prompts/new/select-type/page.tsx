"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, FileText, Layers, Puzzle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

type PromptType = 'standard' | 'structured' | 'modularized' | 'advanced';

interface PromptTypeOption {
  id: PromptType;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

const promptTypes: PromptTypeOption[] = [
  {
    id: 'standard',
    title: 'Standard Prompt',
    description: 'A simple, straightforward prompt for basic AI interactions.',
    icon: <FileText className="h-8 w-8" />,
    features: [
      'Simple text-based input',
      'Quick to create and edit',
      'Perfect for basic queries',
      'Single conversation turn'
    ]
  },
  {
    id: 'structured',
    title: 'Structured Prompt',
    description: 'Organized prompts with clear sections and formatting.',
    icon: <Layers className="h-8 w-8" />,
    features: [
      'Organized in sections',
      'System, user, and assistant roles',
      'Better context management',
      'Reusable structure'
    ]
  },
  {
    id: 'modularized',
    title: 'Modularized Prompt',
    description: 'Build prompts from reusable components and modules.',
    icon: <Puzzle className="h-8 w-8" />,
    features: [
      'Reusable components',
      'Shared across projects',
      'Team collaboration',
      'Dynamic composition'
    ]
  },
  {
    id: 'advanced',
    title: 'Advanced Prompt',
    description: 'Complex prompts with conditional logic and flows.',
    icon: <Zap className="h-8 w-8" />,
    features: [
      'Conditional logic',
      'Multi-step workflows',
      'Variable substitution',
      'Advanced controls'
    ]
  }
];

export default function SelectPromptTypePage() {
  const [selectedType, setSelectedType] = useState<PromptType | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const handleCreatePrompt = async () => {
    if (!selectedType) {
      toast.error("Please select a prompt type");
      return;
    }

    // Wait for auth to load
    if (authLoading) {
      toast.error("Please wait while we verify your authentication");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to create a prompt");
      return;
    }

    setLoading(true);

    try {
      // Create an empty prompt with the selected type
      const { data, error } = await supabase
        .from('prompts')
        .insert({
          title: `New ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Prompt`,
          description: null,
          content: getDefaultContent(selectedType),
          prompt_type: selectedType,
          visibility: 'private',
          tags: [],
          model_settings: {
            model: "gpt-4",
            temperature: 0.7,
            max_tokens: 2048
          },
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
      
      // Redirect to the appropriate editor
      router.push(`/dashboard/prompts/editor?promptId=${data.id}&type=${selectedType}&style=editing`);
    } catch (error) {
      console.error('Error creating prompt:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getDefaultContent = (type: PromptType): string => {
    switch (type) {
      case 'standard':
        return 'Enter your prompt here...';
      case 'structured':
        return `# System Instructions
You are a helpful AI assistant.

# User Request
{{user_input}}

# Response Guidelines
- Be clear and concise
- Provide helpful information
- Ask clarifying questions if needed`;
      case 'modularized':
        return `# Main Prompt

## Module: Introduction
Welcome! How can I help you today?

## Module: Core Logic
{{core_module}}

## Module: Conclusion
{{conclusion_module}}`;
      case 'advanced':
        return `# Advanced Prompt Template

## Conditions
IF {{condition}} THEN:
  - Execute action A
ELSE:
  - Execute action B

## Variables
- user_input: {{user_input}}
- context: {{context}}
- mode: {{mode}}

## Workflow
1. Analyze input
2. Apply conditions
3. Generate response
4. Validate output`;
      default:
        return 'Enter your prompt here...';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader 
        heading="Select Prompt Type"
        text="Choose the type of prompt you want to create."
      >
        <Link href="/dashboard/prompts">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Prompts
          </Button>
        </Link>
      </DashboardHeader>

      <div className="grid gap-6 md:grid-cols-2">
        {promptTypes.map((type) => (
          <Card 
            key={type.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              selectedType === type.id 
                ? "ring-2 ring-primary border-primary" 
                : "hover:border-muted-foreground/50"
            )}
            onClick={() => setSelectedType(type.id)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  selectedType === type.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {type.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {type.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {type.features.map((feature, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="h-1 w-1 bg-muted-foreground rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <Link href="/dashboard/prompts">
          <Button variant="outline" disabled={loading}>
            Cancel
          </Button>
        </Link>
        <Button 
          onClick={handleCreatePrompt} 
          disabled={!selectedType || loading || authLoading}
          className="min-w-[140px]"
        >
          {loading ? "Creating..." : authLoading ? "Loading..." : "Create Prompt"}
        </Button>
      </div>
    </div>
  );
}
