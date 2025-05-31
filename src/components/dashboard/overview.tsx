"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface ChartData {
  name: string;
  standard: number;
  structured: number;
  modularized: number;
  advanced: number;
}

export function Overview() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    const fetchUsageData = async () => {
      if (!user) return;

      try {
        // Get execution logs from the last 7 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);

        const { data: logs, error } = await supabase
          .from('execution_logs')
          .select(`
            created_at,
            prompts!execution_logs_prompt_id_fkey(prompt_type)
          `)
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());

        if (error) {
          console.error('Error fetching usage data:', error);
          return;
        }

        // Group by date and prompt type
        const chartData: ChartData[] = [];
        
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          const dayLogs = logs?.filter(log => {
            const logDate = new Date(log.created_at);
            return logDate.toDateString() === date.toDateString();
          }) || [];

          const counts = {
            standard: dayLogs.filter(log => log.prompts?.prompt_type === 'standard').length,
            structured: dayLogs.filter(log => log.prompts?.prompt_type === 'structured').length,
            modularized: dayLogs.filter(log => log.prompts?.prompt_type === 'modularized').length,
            advanced: dayLogs.filter(log => log.prompts?.prompt_type === 'advanced').length,
          };

          chartData.push({
            name: dateStr,
            ...counts
          });
        }

        setData(chartData);
      } catch (error) {
        console.error('Error fetching usage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsageData();
  }, [user, supabase]);

  if (loading) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          className="text-xs fill-muted-foreground"
        />
        <YAxis tick={{ fontSize: 12 }} className="text-xs fill-muted-foreground" />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">{label}</div>
                    {payload.map((p) => (
                      <div key={p.dataKey} className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <div 
                            className="h-2 w-2 rounded-full" 
                            style={{ backgroundColor: p.color }}
                          />
                          <span className="capitalize">{p.dataKey as string}</span>
                        </div>
                        <div>{p.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend formatter={(value) => <span className="text-xs capitalize">{value}</span>} />
        <Bar
          dataKey="standard"
          fill="hsl(var(--chart-1))"
          radius={4}
          className="fill-primary"
        />
        <Bar
          dataKey="structured"
          fill="hsl(var(--chart-2))"
          radius={4}
          className="fill-blue-500"
        />
        <Bar
          dataKey="modularized"
          fill="hsl(var(--chart-3))"
          radius={4}
          className="fill-green-500"
        />
        <Bar
          dataKey="advanced"
          fill="hsl(var(--chart-4))"
          radius={4}
          className="fill-purple-500"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

