"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Code2, Copy, FileJson, MessageSquare, Settings, User, Variable } from "lucide-react";

interface AdvancedEditorProps {
  editorStyle: "editing" | "viewing" | "commenting" | "suggesting";
}

export function AdvancedEditor({ editorStyle }: AdvancedEditorProps) {
  const isEditable = editorStyle === "editing" || editorStyle === "suggesting";

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Advanced Prompt Editor</CardTitle>
            <CardDescription>Create complex prompts with advanced features</CardDescription>
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
        <Tabs defaultValue="code">
          <TabsList>
            <TabsTrigger value="code">Code View</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
            <TabsTrigger value="functions">Functions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Prompt Code</Label>
                <div className="flex items-start gap-2 p-4 rounded-lg border bg-muted/50">
                  <Code2 className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <Textarea 
                    placeholder="Write your advanced prompt code here..."
                    className="min-h-[400px] font-mono text-sm"
                    disabled={!isEditable}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="variables" className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Defined Variables</Label>
                <Button variant="outline" size="sm" className="gap-1" disabled={!isEditable}>
                  <Variable className="h-4 w-4" />
                  Add Variable
                </Button>
              </div>

              <div className="space-y-2">
                {["context", "temperature", "maxTokens", "style"].map((variable) => (
                  <div key={variable} className="flex items-center gap-4 p-4 rounded-lg border">
                    <Variable className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">${variable}</p>
                      <p className="text-sm text-muted-foreground">Variable description</p>
                    </div>
                    <Input 
                      className="w-[200px]"
                      placeholder="Default value"
                      disabled={!isEditable}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="functions" className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Custom Functions</Label>
                <Button variant="outline" size="sm" className="gap-1" disabled={!isEditable}>
                  <FileJson className="h-4 w-4" />
                  Add Function
                </Button>
              </div>

              <div className="space-y-2">
                {["formatResponse", "validateInput", "transformOutput"].map((func) => (
                  <div key={func} className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <FileJson className="h-5 w-5 text-muted-foreground" />
                      <p className="font-medium">{func}()</p>
                    </div>
                    <Textarea 
                      className="font-mono text-sm"
                      placeholder="function code here..."
                      disabled={!isEditable}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Execution Mode</Label>
                <Select disabled={!isEditable} defaultValue="async">
                  <SelectTrigger>
                    <SelectValue placeholder="Select execution mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sync">Synchronous</SelectItem>
                    <SelectItem value="async">Asynchronous</SelectItem>
                    <SelectItem value="stream">Streaming</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Error Handling</Label>
                <Select disabled={!isEditable} defaultValue="strict">
                  <SelectTrigger>
                    <SelectValue placeholder="Select error handling mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strict">Strict</SelectItem>
                    <SelectItem value="lenient">Lenient</SelectItem>
                    <SelectItem value="silent">Silent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Debug Mode</Label>
                <Select disabled={!isEditable} defaultValue="off">
                  <SelectTrigger>
                    <SelectValue placeholder="Select debug mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">Off</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="verbose">Verbose</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="space-y-4 p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Advanced Preview</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50">
                  <Settings className="h-5 w-5 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Configuration</p>
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                      [Configuration and variables will be shown here]
                    </pre>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50">
                  <User className="h-5 w-5 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Input Processing</p>
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                      [Input processing steps will be shown here]
                    </pre>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-4 rounded-lg bg-primary/5">
                  <Bot className="h-5 w-5 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Output Processing</p>
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                      [Output processing steps will be shown here]
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