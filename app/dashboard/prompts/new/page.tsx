"use client";

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

export default function NewPromptPage() {
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
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Enter a descriptive title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompt-type">Prompt Type</Label>
              <Select defaultValue="standard">
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
            <Textarea id="description" placeholder="A brief description of what this prompt does" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" placeholder="Enter tags separated by commas" />
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="mt-4">
          <PromptsEditor />
        </TabsContent>
        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>See how your prompt will look when used</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No content to preview. Please add content in the Editor tab.
                </AlertDescription>
              </Alert>
              <div className="p-4 border rounded-md">
                <p className="text-muted-foreground text-center my-8">Preview will appear here</p>
              </div>
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
                <Select defaultValue="gpt-4">
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="claude-instant">Claude Instant</SelectItem>
                    <SelectItem value="claude-2">Claude 2</SelectItem>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select defaultValue="private">
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
              
              <div className="space-y-2">
                <Label htmlFor="usage-context">Usage Context</Label>
                <Textarea 
                  id="usage-context" 
                  placeholder="Describe when and how this prompt should be used"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-4">
        <Link href="/dashboard/prompts">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button>Save Prompt</Button>
      </div>
    </div>
  );
}