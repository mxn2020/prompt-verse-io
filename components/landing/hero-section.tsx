"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronRight, Sparkles, Zap, Layers } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                <span className="font-medium">New Release</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Prompt Engineering Made Simple
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Create, manage, and optimize AI prompts with our powerful platform. Build modular prompt systems that scale with your needs.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 min-[400px]:flex-row">
              <Link href="/signup">
                <Button size="lg" className="group">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Sparkles className="h-4 w-4" />
                <span>AI-powered</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-4 w-4" />
                <span>Time-saving</span>
              </div>
              <div className="flex items-center space-x-1">
                <Layers className="h-4 w-4" />
                <span>Modular</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full h-[350px] md:h-[450px] lg:h-[500px] rounded-lg overflow-hidden">
              {/* Mockup of the prompt editor interface */}
              <div className="absolute inset-0 bg-muted rounded-lg p-4 md:p-6">
                <div className="flex flex-col h-full rounded-lg overflow-hidden shadow-2xl">
                  <div className="bg-card h-10 flex items-center px-4 border-b">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="mx-auto font-medium text-xs">Prompt Editor - Main.prompt</div>
                  </div>
                  <div className="flex flex-1">
                    <div className="w-1/3 border-r p-4 bg-muted/50 text-xs">
                      <div className="font-medium mb-2">Components</div>
                      <div className="space-y-2">
                        <div className="bg-background p-2 rounded border">System Instructions</div>
                        <div className="bg-background p-2 rounded border">User Context</div>
                        <div className="bg-background p-2 rounded border">Response Format</div>
                        <div className="bg-background p-2 rounded border">Examples</div>
                        <div className="bg-background p-2 rounded border">Constraints</div>
                      </div>
                    </div>
                    <div className="w-2/3 p-4 bg-card text-xs">
                      <div className="font-medium mb-2">Editor</div>
                      <div className="space-y-3">
                        <div className="border p-2 rounded bg-primary/5">
                          <div className="text-primary font-medium text-xs mb-1">System Instructions</div>
                          <div>You are an AI assistant that helps users with prompt engineering...</div>
                        </div>
                        <div className="border p-2 rounded bg-secondary/5">
                          <div className="text-secondary font-medium text-xs mb-1">User Context</div>
                          <div>The user is working on creating a prompt for...</div>
                        </div>
                        <div className="border p-2 rounded bg-accent/5">
                          <div className="text-accent-foreground font-medium text-xs mb-1">Response Format</div>
                          <div>Your response should follow this structure...</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}