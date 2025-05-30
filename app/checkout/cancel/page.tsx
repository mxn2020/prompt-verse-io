import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle>Payment Cancelled</CardTitle>
          <CardDescription>
            Your payment was cancelled. No charges were made to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Button asChild>
            <Link href="/pricing">
              Return to Pricing
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/support">
              Need Help?
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}