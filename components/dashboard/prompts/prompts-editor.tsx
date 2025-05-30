"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { 
  GripVertical, 
  Plus, 
  X, 
  MessageSquare, 
  User, 
  Bot, 
  Settings, 
  Copy,
  Trash,
  Puzzle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface EditorSection {
  id: string;
  type: "system" | "user" | "assistant" | "module";
  title: string;
  content: string;
}

export function PromptsEditor() {
  const [sections, setSections] = useState<EditorSection[]>([
    {
      id: "section-1",
      type: "system",
      title: "System Instructions",
      content: "You are an AI assistant that helps users with prompt engineering. You are knowledgeable about best practices and techniques for creating effective prompts."
    }
  ]);

  const handleAddSection = (type: EditorSection["type"]) => {
    const titles = {
      system: "System Instructions",
      user: "User Input",
      assistant: "Assistant Response",
      module: "Reusable Module"
    };

    const newSection: EditorSection = {
      id: `section-${Date.now()}`,
      type,
      title: titles[type],
      content: ""
    };

    setSections([...sections, newSection]);
  };

  const handleRemoveSection = (id: string) => {
    setSections(sections.filter(section => section.id !== id));
  };

  const handleContentChange = (id: string, content: string) => {
    setSections(
      sections.map(section => 
        section.id === id ? { ...section, content } : section
      )
    );
  };

  const handleTitleChange = (id: string, title: string) => {
    setSections(
      sections.map(section => 
        section.id === id ? { ...section, title } : section
      )
    );
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);
  };

  const getIconForType = (type: EditorSection["type"]) => {
    switch (type) {
      case "system": return <Settings className="h-5 w-5 text-orange-500" />;
      case "user": return <User className="h-5 w-5 text-blue-500" />;
      case "assistant": return <Bot className="h-5 w-5 text-green-500" />;
      case "module": return <Puzzle className="h-5 w-5 text-purple-500" />;
      default: return <MessageSquare className="h-5 w-5" />;
    }
  };

  const getColorForType = (type: EditorSection["type"]) => {
    switch (type) {
      case "system": return "bg-orange-500/10 border-orange-500/20";
      case "user": return "bg-blue-500/10 border-blue-500/20";
      case "assistant": return "bg-green-500/10 border-green-500/20";
      case "module": return "bg-purple-500/10 border-purple-500/20";
      default: return "bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle>Prompt Content</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Copy className="h-4 w-4" />
              Import Module
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="visual" className="mb-6">
          <TabsList>
            <TabsTrigger value="visual">Visual Editor</TabsTrigger>
            <TabsTrigger value="text">Text Editor</TabsTrigger>
          </TabsList>
          <TabsContent value="visual">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {sections.map((section, index) => (
                      <Draggable key={section.id} draggableId={section.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`border rounded-md p-4 ${getColorForType(section.type)}`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab hover:bg-accent p-1 rounded"
                                >
                                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                                </div>
                                {getIconForType(section.type)}
                                <Badge variant="outline" className="text-xs">
                                  {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                                </Badge>
                                <Input 
                                  value={section.title} 
                                  onChange={(e) => handleTitleChange(section.id, e.target.value)}
                                  className="h-7 ml-2 text-sm font-medium border-transparent hover:border-input bg-transparent"
                                />
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleRemoveSection(section.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <Textarea
                              value={section.content}
                              onChange={(e) => handleContentChange(section.id, e.target.value)}
                              placeholder={`Enter ${section.type} content here...`}
                              className="min-h-[120px] resize-y"
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </TabsContent>
          <TabsContent value="text">
            <Textarea 
              className="min-h-[400px] font-mono text-sm"
              placeholder="# Enter your prompt in Markdown format

You can use Markdown syntax for formatting.

## System
You are a helpful assistant.

## User
{{user_input}}

## Assistant
I'll help you with {{topic}}."
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <div className="text-sm font-medium mb-2">Add Section</div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="gap-1"
              onClick={() => handleAddSection("system")}
            >
              <Settings className="h-4 w-4" />
              System
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-1"
              onClick={() => handleAddSection("user")}
            >
              <User className="h-4 w-4" />
              User
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-1"
              onClick={() => handleAddSection("assistant")}
            >
              <Bot className="h-4 w-4" />
              Assistant
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-1"
              onClick={() => handleAddSection("module")}
            >
              <Puzzle className="h-4 w-4" />
              Module
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}