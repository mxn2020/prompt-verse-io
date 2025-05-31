"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Copy, MessageSquare, Settings, User } from "lucide-react";

interface StandardEditorProps {
  editorStyle: "editing" | "viewing" | "commenting" | "suggesting";
}

export function StandardEditor({ editorStyle }: StandardEditorProps) {
  const isEditable = editorStyle === "editing" || editorStyle === "suggesting";

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Standard Prompt Editor</CardTitle>
            <CardDescription>Create a simple, straightforward prompt</CardDescription>
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
                <Label>User Input Template</Label>
                <div className="flex items-start gap-2 p-4 rounded-lg border bg-muted/50">
                  <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <Textarea 
                    placeholder="Structure how users should provide input..."
                    className="min-h-[100px]"
                    disabled={!isEditable}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Assistant Response Template</Label>
                <div className="flex items-start gap-2 p-4 rounded-lg border bg-muted/50">
                  <Bot className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <Textarea 
                    placeholder="Define how the AI should structure its response..."
                    className="min-h-[100px]"
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
                <Label>Temperature</Label>
                <Select disabled={!isEditable} defaultValue="0.7">
                  <SelectTrigger>
                    <SelectValue placeholder="Select temperature" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 - Deterministic</SelectItem>
                    <SelectItem value="0.3">0.3 - Conservative</SelectItem>
                    <SelectItem value="0.7">0.7 - Balanced</SelectItem>
                    <SelectItem value="1">1.0 - Creative</SelectItem>
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
                <span className="font-medium">Preview Conversation</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50">
                  <User className="h-5 w-5 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">User</p>
                    <p className="text-muted-foreground">
                      [User input will appear here based on the template]
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-4 rounded-lg bg-primary/5">
                  <Bot className="h-5 w-5 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Assistant</p>
                    <p className="text-muted-foreground">
                      [Assistant response will appear here based on the template]
                    </p>
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