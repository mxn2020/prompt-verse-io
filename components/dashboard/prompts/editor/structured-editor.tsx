"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Copy, FileJson, MessageSquare, Settings, User } from "lucide-react";

interface StructuredEditorProps {
  editorStyle: "editing" | "viewing" | "commenting" | "suggesting";
}

export function StructuredEditor({ editorStyle }: StructuredEditorProps) {
  const isEditable = editorStyle === "editing" || editorStyle === "suggesting";

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Structured Prompt Editor</CardTitle>
            <CardDescription>Create a prompt with defined input/output schema</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Copy className="h-4 w-4" />
              Save as Template
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="schema">Schema</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter a descriptive title"
                  disabled={!isEditable}
                />
              </div>

              <div className="space-y-2">
                <Label>System Instructions</Label>
                <div className="flex items-start gap-2 p-4 rounded-lg border bg-muted/50">
                  <Settings className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <Textarea 
                    placeholder="Define the AI's role and behavior..."
                    className="min-h-[100px]"
                    disabled={!isEditable}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Input Template</Label>
                <div className="flex items-start gap-2 p-4 rounded-lg border bg-muted/50">
                  <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <Textarea 
                    placeholder="Define the structure of user input..."
                    className="min-h-[100px]"
                    disabled={!isEditable}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Output Template</Label>
                <div className="flex items-start gap-2 p-4 rounded-lg border bg-muted/50">
                  <Bot className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <Textarea 
                    placeholder="Define the structure of AI responses..."
                    className="min-h-[100px]"
                    disabled={!isEditable}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schema" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Input Schema</Label>
                <div className="flex items-start gap-2 p-4 rounded-lg border bg-muted/50">
                  <FileJson className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <Textarea 
                    placeholder='{
  "type": "object",
  "properties": {
    "query": {
      "type": "string",
      "description": "The user's question"
    }
  }
}'
                    className="min-h-[200px] font-mono text-sm"
                    disabled={!isEditable}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Output Schema</Label>
                <div className="flex items-start gap-2 p-4 rounded-lg border bg-muted/50">
                  <FileJson className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <Textarea 
                    placeholder='{
  "type": "object",
  "properties": {
    "answer": {
      "type": "string",
      "description": "The AI's response"
    }
  }
}'
                    className="min-h-[200px] font-mono text-sm"
                    disabled={!isEditable}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Model</Label>
                <Select disabled={!isEditable} defaultValue="gpt-4">
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-2">Claude 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Schema Validation</Label>
                <Select disabled={!isEditable} defaultValue="strict">
                  <SelectTrigger>
                    <SelectValue placeholder="Select validation mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strict">Strict</SelectItem>
                    <SelectItem value="loose">Loose</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Max Tokens</Label>
                <Input 
                  type="number" 
                  defaultValue={2000}
                  disabled={!isEditable}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="space-y-4 p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Preview with Schema Validation</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50">
                  <User className="h-5 w-5 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Input Schema</p>
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                      [Input schema validation will be shown here]
                    </pre>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-4 rounded-lg bg-primary/5">
                  <Bot className="h-5 w-5 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Output Schema</p>
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                      [Output schema validation will be shown here]
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}