"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, HelpCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="pricing">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the plan that fits your needs. All plans include core features with different limits.
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-6">
            <Button
              variant={billingPeriod === "monthly" ? "default" : "outline"}
              onClick={() => setBillingPeriod("monthly")}
              className="rounded-full"
            >
              Monthly
            </Button>
            <Button
              variant={billingPeriod === "annual" ? "default" : "outline"}
              onClick={() => setBillingPeriod("annual")}
              className="rounded-full"
            >
              Annual
              <Badge variant="outline" className="ml-2 bg-primary/20 text-primary">
                Save 17%
              </Badge>
            </Button>
          </div>
        </div>
        
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 mt-12">
          {/* Free Plan */}
          <PricingCard
            title="Free"
            description="For individuals getting started with prompt engineering."
            price={billingPeriod === "monthly" ? "$0" : "$0"}
            period={billingPeriod === "monthly" ? "month" : "year"}
            features={[
              { text: "10 prompts", included: true },
              { text: "10 modules", included: true },
              { text: "10 wrappers", included: true },
              { text: "10 blocks", included: true },
              { text: "2 flows", included: true },
              { text: "2 agents", included: true },
              { text: "2 model patterns", included: true },
              { text: "Community support", included: true },
              { text: "Team features", included: false },
              { text: "API access", included: false, hint: "API access for integrating with your applications" },
            ]}
            buttonText="Get Started"
            buttonVariant="outline"
            popular={false}
          />
          
          {/* Pro Plan */}
          <PricingCard
            title="Pro"
            description="For professionals who need advanced prompt engineering tools."
            price={billingPeriod === "monthly" ? "$12" : "$10"}
            period={billingPeriod === "monthly" ? "month" : "month, billed annually"}
            features={[
              { text: "Unlimited prompts", included: true },
              { text: "Unlimited modules", included: true },
              { text: "Unlimited wrappers", included: true },
              { text: "Unlimited blocks", included: true },
              { text: "Unlimited flows", included: true },
              { text: "Unlimited agents", included: true },
              { text: "Unlimited model patterns", included: true },
              { text: "All editor modes", included: true, hint: "Access to all advanced editing capabilities" },
              { text: "Advanced features", included: true },
              { text: "Email support", included: true },
              { text: "API access (rate limited)", included: true },
            ]}
            buttonText="Upgrade to Pro"
            buttonVariant="default"
            popular={true}
          />
          
          {/* Team Plan */}
          <PricingCard
            title="Team"
            description="For teams collaborating on prompt engineering projects."
            price={billingPeriod === "monthly" ? "$16" : "$14"}
            period={billingPeriod === "monthly" ? "user/month" : "user/month, billed annually"}
            features={[
              { text: "Everything in Pro", included: true },
              { text: "Team collaboration", included: true },
              { text: "Shared workspaces", included: true },
              { text: "Admin controls", included: true, hint: "Manage team permissions and access" },
              { text: "Priority support", included: true },
              { text: "Higher API rate limits", included: true },
              { text: "Analytics dashboard", included: true, hint: "Track team usage and performance" },
            ]}
            buttonText="Contact Sales"
            buttonVariant="outline"
            popular={false}
          />
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Need something custom? <Link href="/contact" className="font-medium text-primary underline-offset-4 hover:underline">Contact us</Link> for enterprise pricing.
          </p>
        </div>
      </div>
    </section>
  );
}

interface FeatureProps {
  text: string;
  included: boolean;
  hint?: string;
}

function Feature({ text, included, hint }: FeatureProps) {
  return (
    <div className="flex items-center">
      {included ? (
        <Check className="mr-2 h-4 w-4 text-primary" />
      ) : (
        <AlertCircle className="mr-2 h-4 w-4 text-muted-foreground" />
      )}
      <span className={included ? "" : "text-muted-foreground"}>
        {text}
      </span>
      {hint && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-80">{hint}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  period: string;
  features: FeatureProps[];
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary";
  popular: boolean;
}

function PricingCard({
  title,
  description,
  price,
  period,
  features,
  buttonText,
  buttonVariant,
  popular
}: PricingCardProps) {
  return (
    <Card className={`flex flex-col justify-between ${popular ? "border-primary shadow-lg shadow-primary/20" : ""}`}>
      {popular && (
        <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/2">
          <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
        </div>
      )}
      <div>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <span className="text-4xl font-bold">{price}</span>
            <span className="text-muted-foreground">/{period}</span>
          </div>
          <div className="space-y-2">
            {features.map((feature, i) => (
              <Feature key={i} {...feature} />
            ))}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        <Button
          variant={buttonVariant}
          className="w-full"
          asChild
        >
          <Link href="/signup">{buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}