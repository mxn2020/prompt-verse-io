import { Bot, Braces, GitMerge, Layers, Sparkles, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              <span className="font-medium">Powerful Features</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Master AI Prompts</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform provides all the tools you need to create, manage, and optimize prompts for any AI model
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          <FeatureCard
            icon={<Layers className="h-12 w-12 text-primary" />}
            title="Modular Prompts"
            description="Build prompts from reusable components that you can share across projects and teams."
          />
          <FeatureCard
            icon={<Braces className="h-12 w-12 text-primary" />}
            title="Structured Templates"
            description="Create and manage structured prompt templates with sections, variables, and formatting."
          />
          <FeatureCard
            icon={<GitMerge className="h-12 w-12 text-primary" />}
            title="Prompt Flows"
            description="Design sequential and conditional prompt execution paths for complex AI interactions."
          />
          <FeatureCard
            icon={<Bot className="h-12 w-12 text-primary" />}
            title="AI Agents"
            description="Configure autonomous prompt execution with scheduling and webhook triggers."
          />
          <FeatureCard
            icon={<Users className="h-12 w-12 text-primary" />}
            title="Team Collaboration"
            description="Work together in real-time with role-based permissions and shared workspaces."
          />
          <FeatureCard
            icon={<Sparkles className="h-12 w-12 text-primary" />}
            title="AI-Powered Wizards"
            description="Get intelligent suggestions to improve your prompts based on best practices."
          />
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/20">
      <CardHeader className="pb-2">
        {icon}
        <CardTitle className="mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}