"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "Jan 1", "Standard Prompts": 24, "Structured Prompts": 13, "Modularized Prompts": 5 },
  { name: "Jan 2", "Standard Prompts": 30, "Structured Prompts": 18, "Modularized Prompts": 8 },
  { name: "Jan 3", "Standard Prompts": 27, "Structured Prompts": 20, "Modularized Prompts": 12 },
  { name: "Jan 4", "Standard Prompts": 32, "Structured Prompts": 22, "Modularized Prompts": 15 },
  { name: "Jan 5", "Standard Prompts": 35, "Structured Prompts": 25, "Modularized Prompts": 18 },
  { name: "Jan 6", "Standard Prompts": 40, "Structured Prompts": 28, "Modularized Prompts": 20 },
  { name: "Jan 7", "Standard Prompts": 38, "Structured Prompts": 30, "Modularized Prompts": 25 },
];

export function Overview() {
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
                          <div className={`h-2 w-2 rounded-full bg-${p.color}`} />
                          <span>{p.dataKey as string}</span>
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
        <Legend formatter={(value) => <span className="text-xs">{value}</span>} />
        <Bar
          dataKey="Standard Prompts"
          fill="hsl(var(--chart-1))"
          radius={4}
          className="fill-primary"
        />
        <Bar
          dataKey="Structured Prompts"
          fill="hsl(var(--chart-2))"
          radius={4}
          className="fill-blue-500"
        />
        <Bar
          dataKey="Modularized Prompts"
          fill="hsl(var(--chart-3))"
          radius={4}
          className="fill-green-500"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}