"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentPrompts } from "@/components/dashboard/recent-prompts";
import { DashboardHeader } from "@/components/dashboard/header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Plus, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface DashboardStats {
  totalPrompts: number;
  promptsChange: number;
  totalModules: number;
  modulesChange: number;
  totalFlows: number;
  flowsChange: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPrompts: 0,
    promptsChange: 0,
    totalModules: 0,
    modulesChange: 0,
    totalFlows: 0,
    flowsChange: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user) return;

      try {
        // Get current month's start date
        const currentDate = new Date();
        const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const lastMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

        // Fetch current totals
        const [promptsResponse, modulesResponse, flowsResponse] = await Promise.all([
          supabase
            .from('prompts')
            .select('id, created_at', { count: 'exact' })
            .eq('owner_id', user.id),
          supabase
            .from('modules')
            .select('id, created_at', { count: 'exact' })
            .eq('owner_id', user.id),
          supabase
            .from('flows')
            .select('id, created_at', { count: 'exact' })
            .eq('owner_id', user.id)
        ]);

        // Calculate changes from last month
        const [promptsLastMonth, modulesLastMonth, flowsLastMonth] = await Promise.all([
          supabase
            .from('prompts')
            .select('id', { count: 'exact' })
            .eq('owner_id', user.id)
            .gte('created_at', lastMonthStart.toISOString())
            .lt('created_at', currentMonthStart.toISOString()),
          supabase
            .from('modules')
            .select('id', { count: 'exact' })
            .eq('owner_id', user.id)
            .gte('created_at', lastMonthStart.toISOString())
            .lt('created_at', currentMonthStart.toISOString()),
          supabase
            .from('flows')
            .select('id', { count: 'exact' })
            .eq('owner_id', user.id)
            .gte('created_at', lastMonthStart.toISOString())
            .lt('created_at', currentMonthStart.toISOString())
        ]);

        const [promptsThisMonth, modulesThisMonth, flowsThisMonth] = await Promise.all([
          supabase
            .from('prompts')
            .select('id', { count: 'exact' })
            .eq('owner_id', user.id)
            .gte('created_at', currentMonthStart.toISOString()),
          supabase
            .from('modules')
            .select('id', { count: 'exact' })
            .eq('owner_id', user.id)
            .gte('created_at', currentMonthStart.toISOString()),
          supabase
            .from('flows')
            .select('id', { count: 'exact' })
            .eq('owner_id', user.id)
            .gte('created_at', currentMonthStart.toISOString())
        ]);

        setStats({
          totalPrompts: promptsResponse.count || 0,
          promptsChange: (promptsThisMonth.count || 0) - (promptsLastMonth.count || 0),
          totalModules: modulesResponse.count || 0,
          modulesChange: (modulesThisMonth.count || 0) - (modulesLastMonth.count || 0),
          totalFlows: flowsResponse.count || 0,
          flowsChange: (flowsThisMonth.count || 0) - (flowsLastMonth.count || 0),
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user, supabase]);

  const formatChange = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center text-green-600">
          <TrendingUp className="h-3 w-3 mr-1" />
          <span>+{change} from last month</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center text-red-600">
          <TrendingDown className="h-3 w-3 mr-1" />
          <span>{change} from last month</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-muted-foreground">
          <Minus className="h-3 w-3 mr-1" />
          <span>No change from last month</span>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-2"></div>
          <div className="h-4 w-96 bg-muted rounded"></div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="border rounded-lg p-6">
                <div className="h-4 w-24 bg-muted rounded mb-2"></div>
                <div className="h-4 w-32 bg-muted rounded mb-4"></div>
                <div className="h-8 w-16 bg-muted rounded mb-2"></div>
                <div className="h-3 w-28 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 animate-pulse">
            <div className="border rounded-lg p-6">
              <div className="h-6 w-32 bg-muted rounded mb-2"></div>
              <div className="h-4 w-48 bg-muted rounded mb-4"></div>
              <div className="h-[350px] bg-muted rounded"></div>
            </div>
          </div>
          <div className="col-span-3 animate-pulse">
            <div className="border rounded-lg p-6">
              <div className="h-6 w-32 bg-muted rounded mb-2"></div>
              <div className="h-4 w-48 bg-muted rounded mb-4"></div>
              <div className="h-[350px] bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="text-3xl font-bold">{stats.totalPrompts}</div>
            <div className="text-xs text-muted-foreground">
              {formatChange(stats.promptsChange)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Reusable Modules</CardTitle>
            <CardDescription>Components you can reuse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalModules}</div>
            <div className="text-xs text-muted-foreground">
              {formatChange(stats.modulesChange)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Prompt Flows</CardTitle>
            <CardDescription>Active prompt sequences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalFlows}</div>
            <div className="text-xs text-muted-foreground">
              {formatChange(stats.flowsChange)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Prompt Usage</CardTitle>
            <CardDescription>
              Usage data for the past 7 days
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