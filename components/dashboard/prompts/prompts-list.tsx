"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Edit, MoreHorizontal, Search, Star, Trash, Copy } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Mock data - in a real app, this would come from your API
const prompts = [
  {
    id: "1",
    title: "Customer Support Agent",
    type: "Modularized",
    modules: 5,
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    starred: true,
    tags: ["support", "customer service"]
  },
  {
    id: "2",
    title: "Blog Post Generator",
    type: "Structured",
    modules: 3,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    starred: false,
    tags: ["content", "writing"]
  },
  {
    id: "3",
    title: "Product Description Writer",
    type: "Standard",
    modules: 1,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    starred: true,
    tags: ["ecommerce", "products"]
  },
  {
    id: "4",
    title: "Code Reviewer",
    type: "Advanced",
    modules: 7,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    starred: false,
    tags: ["development", "code"]
  },
  {
    id: "5",
    title: "Meeting Summarizer",
    type: "Structured",
    modules: 4,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    starred: true,
    tags: ["productivity", "meetings"]
  },
  {
    id: "6",
    title: "Email Writer",
    type: "Modularized",
    modules: 6,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25),
    starred: false,
    tags: ["communication", "email"]
  }
];

export function PromptsList() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs defaultValue="all" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="all">All Prompts</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search prompts..." 
              className="h-9 md:w-[200px] lg:w-[280px]" 
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-full sm:w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="structured">Structured</SelectItem>
              <SelectItem value="modularized">Modularized</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden sm:table-cell">Modules</TableHead>
              <TableHead className="hidden md:table-cell">Tags</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prompts.map((prompt) => (
              <TableRow key={prompt.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                    >
                      <Star className={`h-4 w-4 ${prompt.starred ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                    </Button>
                    <Link href={`/dashboard/prompts/${prompt.id}`} className="hover:underline">
                      {prompt.title}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {prompt.type}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{prompt.modules}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {prompt.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="font-normal text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {formatDistanceToNow(prompt.createdAt, { addSuffix: true })}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(prompt.updatedAt, { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/prompts/${prompt.id}`}>
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/prompts/${prompt.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}