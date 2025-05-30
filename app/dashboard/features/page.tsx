import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Braces, GitMerge, Layers, Share2, Sparkles } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function FeaturesPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader 
        heading="Features"
        text="Explore all the features available in Prompt-Verse."
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={<Layers className="h-12 w-12 text-primary" />}
          title="Modular Prompts"
          description="Build prompts from reusable components that you can share across projects and teams."
          href="/dashboard/prompts"
        />
        <FeatureCard
          icon={<Braces className="h-12 w-12 text-primary" />}
          title="Structured Templates"
          description="Create and manage structured prompt templates with sections, variables, and formatting."
          href="/dashboard/prompts/templates"
        />
        <FeatureCard
          icon={<GitMerge className="h-12 w-12 text-primary" />}
          title="Prompt Flows"
          description="Design sequential and conditional prompt execution paths for complex AI interactions."
          href="/dashboard/flows"
        />
        <FeatureCard
          icon={<Bot className="h-12 w-12 text-primary" />}
          title="AI Agents"
          description="Configure autonomous prompt execution with scheduling and webhook triggers."
          href="/dashboard/agents"
        />
        <FeatureCard
          icon={<Share2 className="h-12 w-12 text-primary" />}
          title="Team Collaboration"
          description="Work together in real-time with role-based permissions and shared workspaces."
          href="/dashboard/team"
        />
        <FeatureCard
          icon={<Sparkles className="h-12 w-12 text-primary" />}
          title="AI-Powered Wizards"
          description="Get intelligent suggestions to improve your prompts based on best practices."
          href="/dashboard/wizards"
        />
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

function FeatureCard({ icon, title, description, href }: FeatureCardProps) {
  return (
    <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/20">
      <Link href={href}>
        <CardHeader className="pb-2">
          {icon}
          <CardTitle className="mt-4">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardContent>
      </Link>
    </Card>
  );
}