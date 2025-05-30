"use client";

import { formatDistanceToNow } from "date-fns";
import { Bookmark, Edit, MessageSquare, MoreHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

// Mock data - in a real app this would come from your API
const recentPrompts = [
  {
    id: "1",
    title: "Customer Support Agent",
    type: "Modularized",
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    user: {
      name: "You",
      avatar: "",
      initials: "YO",
    },
    starred: true,
  },
  {
    id: "2",
    title: "Blog Post Generator",
    type: "Structured",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    user: {
      name: "You",
      avatar: "",
      initials: "YO",
    },
    starred: false,
  },
  {
    id: "3",
    title: "Product Description Writer",
    type: "Standard",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    user: {
      name: "You",
      avatar: "",
      initials: "YO",
    },
    starred: true,
  },
  {
    id: "4",
    title: "Code Reviewer",
    type: "Advanced",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    user: {
      name: "You",
      avatar: "",
      initials: "YO",
    },
    starred: false,
  },
];

export function RecentPrompts() {
  return (
    <div className="space-y-4">
      {recentPrompts.map((prompt) => (
        <div
          key={prompt.id}
          className="flex items-center justify-between space-x-4 rounded-md border p-4"
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-md bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium leading-none">{prompt.title}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-muted-foreground mr-2">{prompt.type}</span>
                <span className="text-xs text-muted-foreground">
                  Updated {formatDistanceToNow(prompt.updatedAt, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Avatar className="h-6 w-6">
              <AvatarImage src={prompt.user.avatar} alt={prompt.user.name} />
              <AvatarFallback className="text-[10px]">{prompt.user.initials}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" className="ml-2">
              <Star className={`h-4 w-4 ${prompt.starred ? "fill-primary text-primary" : "text-muted-foreground"}`} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/prompts/${prompt.id}`}>View</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/prompts/${prompt.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bookmark className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}