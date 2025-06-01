"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useCreatePrompt } from "@/hooks/use-prompts";
import Link from "next/link";
import { ArrowLeft, Plus, Zap, GitBranch, Code2 } from "lucide-react";
import { toast } from "sonner";
import type { Prompt } from "@/lib/schemas/prompt";

interface EditorProps {
  prompt?: Prompt | null;
}

interface Condition {
  id: string;
  variable: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'not_empty';
  value: string;
  action: string;
}

interface Variable {
  name: string;
  type: 'string' | 'number' | 'boolean';
  defaultValue: string;
  description: string;
}

export default function AdvancedEditor({ prompt }: EditorProps) {
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

  const [mainPrompt, setMainPrompt] = useState(
    `# Advanced Prompt Template

## Initial Analysis
Analyze the user input: {{user_input}}

## Processing Logic
{{processing_logic}}

## Response Generation
Based on the analysis and conditions, generate an appropriate response.
`
  );

  const [conditions, setConditions] = useState<Condition[]>([
    {
      id: "condition-1",
      variable: "user_input",
      operator: "contains",
      value: "urgent",
      action: "Set priority to high and respond immediately"
    }
  ]);

  const [variables, setVariables] = useState<Variable[]>([
    {
      name: "user_input",
      type: "string",
      defaultValue: "",
      description: "The user's input text"
    },
    {
      name: "context",
      type: "string",
      defaultValue: "",
      description: "Additional context for the conversation"
    }
  ]);

  const [workflows, setWorkflows] = useState([
    {
      id: "step-1",
      name: "Input Validation",
      logic: "Validate that user input is not empty and relevant"
    },
    {
      id: "step-2", 
      name: "Context Analysis",
      logic: "Analyze the context and determine the best approach"
    },
    {
      id: "step-3",
      name: "Response Generation",
      logic: "Generate appropriate response based on analysis"
    }
  ]);

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!mainPrompt.trim()) {
      toast.error("Please enter a main prompt template");
      return;
    }

    const content = {
      main_prompt: mainPrompt,
      conditions,
      variables,
      workflows,
      execution_mode: "conditional"
    };

    try {
      await createPrompt.mutateAsync({
        ...formData,
        content: JSON.stringify(content),
        prompt_type: "advanced"
      });
      
      router.push("/dashboard/prompts");
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast.error("Failed to save prompt");
    }
  };

  const addCondition = () => {
    const newCondition: Condition = {
      id: `condition-${Date.now()}`,
      variable: "user_input",
      operator: "contains",
      value: "",
      action: ""
    };
    setConditions([...conditions, newCondition]);
  };

  const updateCondition = (id: string, field: keyof Condition, value: string) => {
    setConditions(conditions.map(condition => 
      condition.id === id ? { ...condition, [field]: value } : condition
    ));
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(condition => condition.id !== id));
  };

  const addVariable = () => {
    const newVariable: Variable = {
      name: `variable_${variables.length + 1}`,
      type: "string",
      defaultValue: "",
      description: ""
    };
    setVariables([...variables, newVariable]);
  };

  const updateVariable = (index: number, field: keyof Variable, value: string) => {
    setVariables(variables.map((variable, i) => 
      i === index ? { ...variable, [field]: value } : variable
    ));
  };

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader 
        heading={prompt ? "Edit Advanced Prompt" : "Create Advanced Prompt"}
        text="Build complex prompts with conditional logic and workflows."
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
            <CardDescription>Basic information about your advanced prompt</CardDescription>
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

        <Tabs defaultValue="template" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="template">Template</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
          </TabsList>

          <TabsContent value="template">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  Main Prompt Template
                </CardTitle>
                <CardDescription>
                  Define the main template with variable placeholders and logic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={mainPrompt}
                  onChange={(e) => setMainPrompt(e.target.value)}
                  placeholder="Enter your advanced prompt template..."
                  className="min-h-[300px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="variables">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Variables</CardTitle>
                    <CardDescription>Define variables that can be used in your prompt</CardDescription>
                  </div>
                  <Button onClick={addVariable} size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add Variable
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {variables.map((variable, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-xs">Name</Label>
                          <Input
                            value={variable.name}
                            onChange={(e) => updateVariable(index, 'name', e.target.value)}
                            placeholder="variable_name"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Type</Label>
                          <Select
                            value={variable.type}
                            onValueChange={(value: Variable['type']) => updateVariable(index, 'type', value)}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="string">String</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="boolean">Boolean</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Default Value</Label>
                          <Input
                            value={variable.defaultValue}
                            onChange={(e) => updateVariable(index, 'defaultValue', e.target.value)}
                            placeholder="Default value"
                            className="text-sm"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVariable(index)}
                            disabled={variables.length === 1}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={variable.description}
                          onChange={(e) => updateVariable(index, 'description', e.target.value)}
                          placeholder="Variable description"
                          className="text-sm"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conditions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5" />
                      Conditional Logic
                    </CardTitle>
                    <CardDescription>Define conditions that trigger different behaviors</CardDescription>
                  </div>
                  <Button onClick={addCondition} size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add Condition
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {conditions.map((condition) => (
                  <Card key={condition.id}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label className="text-xs">Variable</Label>
                          <Input
                            value={condition.variable}
                            onChange={(e) => updateCondition(condition.id, 'variable', e.target.value)}
                            placeholder="variable_name"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Operator</Label>
                          <Select
                            value={condition.operator}
                            onValueChange={(value: Condition['operator']) => updateCondition(condition.id, 'operator', value)}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equals">Equals</SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                              <SelectItem value="greater_than">Greater Than</SelectItem>
                              <SelectItem value="less_than">Less Than</SelectItem>
                              <SelectItem value="not_empty">Not Empty</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Value</Label>
                          <Input
                            value={condition.value}
                            onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                            placeholder="comparison value"
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Action</Label>
                        <Textarea
                          value={condition.action}
                          onChange={(e) => updateCondition(condition.id, 'action', e.target.value)}
                          placeholder="What should happen when this condition is met?"
                          className="text-sm min-h-[60px]"
                        />
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCondition(condition.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflow">
            <Card>
              <CardHeader>
                <CardTitle>Execution Workflow</CardTitle>
                <CardDescription>Define the step-by-step execution flow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {workflows.map((step, index) => (
                  <Card key={step.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                          {index + 1}
                        </span>
                        <Input
                          value={step.name}
                          onChange={(e) => {
                            const newWorkflows = [...workflows];
                            newWorkflows[index] = { ...step, name: e.target.value };
                            setWorkflows(newWorkflows);
                          }}
                          className="font-medium"
                          placeholder="Step name"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={step.logic}
                        onChange={(e) => {
                          const newWorkflows = [...workflows];
                          newWorkflows[index] = { ...step, logic: e.target.value };
                          setWorkflows(newWorkflows);
                        }}
                        placeholder="Describe what happens in this step..."
                        className="min-h-[80px] text-sm"
                      />
                    </CardContent>
                  </Card>
                ))}
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
