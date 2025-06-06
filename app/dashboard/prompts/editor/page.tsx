"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PromptEditorSkeleton } from "@/components/dashboard/prompts/editor/prompt-editor-skeleton";
import { StandardEditor } from "@/components/dashboard/prompts/editor/standard-editor";
import { StructuredEditor } from "@/components/dashboard/prompts/editor/structured-editor";
import { ModularizedEditor } from "@/components/dashboard/prompts/editor/modularized-editor";
import { AdvancedEditor } from "@/components/dashboard/prompts/editor/advanced-editor";
import type { Prompt } from "@/lib/schemas/prompt";

type PromptStructureType = "standard" | "structured" | "modularized" | "advanced";
type EditorStyle = "editing" | "viewing" | "commenting" | "suggesting";

export default function PromptEditorPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [promptStructureType, setPromptStructureType] = useState<PromptStructureType>("standard");
  const [editorStyle, setEditorStyle] = useState<EditorStyle>("editing");
  const [prompt, setPrompt] = useState<Prompt | null>(null);

  useEffect(() => {
    const type = searchParams.get("type") as PromptStructureType;
    const style = searchParams.get("style") as EditorStyle;
    const promptId = searchParams.get("promptId");

    if (type && ["standard", "structured", "modularized", "advanced"].includes(type)) {
      setPromptStructureType(type);
    }

    if (style && ["editing", "viewing", "commenting", "suggesting"].includes(style)) {
      setEditorStyle(style);
    }

    // Simulate loading
    setTimeout(() => setIsLoading(false), 500);
  }, [searchParams]);

  const EditorComponent = {
    standard: StandardEditor,
    structured: StructuredEditor,
    modularized: ModularizedEditor,
    advanced: AdvancedEditor,
  }[promptStructureType];

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader 
        heading="Prompt Editor"
        text="Create and edit your prompts with our advanced editor."
      >
        <Link href="/dashboard/prompts">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Prompts
          </Button>
        </Link>
      </DashboardHeader>

      {isLoading ? (
        <PromptEditorSkeleton />
      ) : (
        <EditorComponent editorStyle={editorStyle} prompt={prompt} />
      )}
    </div>
  );
}