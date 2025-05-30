import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentPrompts } from "@/components/dashboard/recent-prompts";
import { DashboardHeader } from "@/components/dashboard/header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader 
        heading="Dashboard"
        text="Get an overview of your prompt engineering workspace."
      >
        <Link
          href="/dashboard/prompts/new"
          className={cn(
            buttonVariants({ variant: "default" }),
            "gap-1"
          )}
        >
          <Plus className="h-4 w-4" />
          <span>New Prompt</span>
        </Link>
      </DashboardHeader>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Prompts</CardTitle>
            <CardDescription>Your prompt collection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <div className="text-xs text-muted-foreground">
              +3 from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Reusable Modules</CardTitle>
            <CardDescription>Components you can reuse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <div className="text-xs text-muted-foreground">
              +2 from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Prompt Flows</CardTitle>
            <CardDescription>Active prompt sequences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <div className="text-xs text-muted-foreground">
              +1 from last month
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Prompt Usage</CardTitle>
            <CardDescription>
              Usage data for the past 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Prompts</CardTitle>
            <CardDescription>
              Recently created or modified prompts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentPrompts />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}