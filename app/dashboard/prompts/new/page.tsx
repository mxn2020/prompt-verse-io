"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

export default function NewPromptPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to the new type selection flow after a short delay
    const timer = setTimeout(() => {
      router.push("/dashboard/prompts/new/select-type");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader 
        heading="Create New Prompt"
        text="We've improved the prompt creation experience!"
      >
        <Link href="/dashboard/prompts">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Prompts
          </Button>
        </Link>
      </DashboardHeader>
      
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Enhanced Prompt Creation</CardTitle>
            <CardDescription>
              We've introduced a new step-by-step process to help you create the perfect prompt for your needs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You'll now start by selecting the type of prompt you want to create, then use a specialized editor tailored for that type.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full gap-2">
                <Link href="/dashboard/prompts/new/select-type">
                  Start Creating
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                Redirecting automatically in a few seconds...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}