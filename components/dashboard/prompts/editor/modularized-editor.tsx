"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Copy, MessageSquare, Plus, Puzzle, Settings, User } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface ModularizedEditorProps {
  editorStyle: "editing" | "viewing" | "commenting" | "suggesting";
}

export function ModularizedEditor({ editorStyle }: ModularizedEditorProps) {
  const isEditable = editorStyle === "editing" || editorStyle === "suggesting";

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Modularized Prompt Editor</CardTitle>
            <CardDescription>Create a prompt using reusable components</CardDescription>
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
        <Tabs defaultValue="modules">
          <TabsList>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="space-y-6">
            <div className="flex justify-between items-center">
              <Label>Active Modules</Label>
              <Button variant="outline" size="sm" className="gap-1" disabled={!isEditable}>
                <Plus className="h-4 w-4" />
                Add Module
              </Button>
            </div>

            <DragDropContext onDragEnd={() => {}}>
              <Droppable droppableId="modules">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {["System", "Context", "Examples", "Input", "Output"].map((module, index) => (
                      <Draggable key={module} draggableId={module} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center gap-2 p-4 rounded-lg border bg-card"
                          >
                            <Puzzle className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">{module} Module</span>
                            <span className="text-sm text-muted-foreground ml-auto">Drag to reorder</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <div className="space-y-4 mt-8">
              <Label>Available Modules</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Constraints", "Format", "Variables", "Logic", "Validation"].map((module) => (
                  <Button
                    key={module}
                    variant="outline"
                    className="justify-start gap-2 h-auto p-4"
                    disabled={!isEditable}
                  >
                    <Puzzle className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">{module}</div>
                      <div className="text-sm text-muted-foreground">Click to add to your prompt</div>
                    </div>
                  </Button>
                ))}
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
                <Label>Module Execution</Label>
                <Select disabled={!isEditable} defaultValue="sequential">
                  <SelectTrigger>
                    <SelectValue placeholder="Select execution mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sequential">Sequential</SelectItem>
                    <SelectItem value="parallel">Parallel</SelectItem>
                    <SelectItem value="conditional">Conditional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Max Tokens per Module</Label>
                <Input 
                  type="number" 
                  defaultValue={1000}
                  disabled={!isEditable}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="space-y-4 p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Module Execution Preview</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50">
                  <Settings className="h-5 w-5 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">System Module</p>
                    <p className="text-muted-foreground">
                      [System instructions from module]
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50">
                  <User className="h-5 w-5 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Input Module</p>
                    <p className="text-muted-foreground">
                      [Input structure from module]
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-4 rounded-lg bg-primary/5">
                  <Bot className="h-5 w-5 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Output Module</p>
                    <p className="text-muted-foreground">
                      [Output structure from module]
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