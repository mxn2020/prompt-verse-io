"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Book, BoxSelect, Flower as Flow, FolderKanban, Laptop, LayoutDashboard, MessageSquare, Puzzle, Settings, Users, Workflow, Layers, Bot } from "lucide-react";

export function DashboardSidebar() {
  const pathname = usePathname();
  
  return (
    <div className="flex flex-col h-screen border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Laptop className="h-6 w-6" />
          <span>Prompt-Verse</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <SidebarLink href="/dashboard" icon={LayoutDashboard} active={pathname === "/dashboard"}>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/dashboard/prompts" icon={MessageSquare} active={pathname.includes("/dashboard/prompts")}>
            Prompts
          </SidebarLink>
          <SidebarLink href="/dashboard/modules" icon={Puzzle} active={pathname.includes("/dashboard/modules")}>
            Modules
          </SidebarLink>
          <SidebarLink href="/dashboard/blocks" icon={BoxSelect} active={pathname.includes("/dashboard/blocks")}>
            Blocks
          </SidebarLink>
          <SidebarLink href="/dashboard/wrappers" icon={Layers} active={pathname.includes("/dashboard/wrappers")}>
            Wrappers
          </SidebarLink>
          <SidebarLink href="/dashboard/flows" icon={Flow} active={pathname.includes("/dashboard/flows")}>
            Flows
          </SidebarLink>
          <SidebarLink href="/dashboard/agents" icon={Bot} active={pathname.includes("/dashboard/agents")}>
            Agents
          </SidebarLink>
          <SidebarLink href="/dashboard/patterns" icon={Workflow} active={pathname.includes("/dashboard/patterns")}>
            Model Patterns
          </SidebarLink>
          <SidebarLink href="/dashboard/workspaces" icon={FolderKanban} active={pathname.includes("/dashboard/workspaces")}>
            Workspaces
          </SidebarLink>
          
          {/* Divider */}
          <div className="my-2 border-t" />
          
          <SidebarLink href="/dashboard/team" icon={Users} active={pathname.includes("/dashboard/team")}>
            Team
          </SidebarLink>
          <SidebarLink href="/dashboard/docs" icon={Book} active={pathname.includes("/dashboard/docs")}>
            Documentation
          </SidebarLink>
          <SidebarLink href="/dashboard/settings" icon={Settings} active={pathname.includes("/dashboard/settings")}>
            Settings
          </SidebarLink>
        </nav>
      </div>
    </div>
  );
}

interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  active?: boolean;
  children: React.ReactNode;
}

function SidebarLink({ href, icon: Icon, active, children }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "justify-start hover:bg-transparent hover:underline",
        active ? "bg-muted font-semibold" : "font-normal",
        "px-2 py-1 h-9"
      )}
    >
      <Icon className="mr-2 h-4 w-4" />
      {children}
    </Link>
  );
}