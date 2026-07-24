import Link from "next/link";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PlanConfig } from "@/lib/config/pricing";
import { cn, formatPrice } from "@/lib/utils";

export function PricingCard({ plan }: { plan: PlanConfig }) {
  return (
    <Card className={cn("flex h-full flex-col", plan.highlighted && "border-primary shadow-md")}>
      <CardHeader>
        {plan.highlighted && (
          <Badge className="mb-2 w-fit" variant="default">
            Recommandé
          </Badge>
        )}
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.tagline}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="mb-4">
          <span className="text-3xl font-semibold">{formatPrice(plan.priceMonthlyCents)}</span>
          {plan.priceMonthlyCents > 0 && (
            <span className="text-muted-foreground text-sm"> / mois</span>
          )}
        </p>
        <ul className="space-y-2">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant={plan.highlighted ? "default" : "outline"}>
          <Link href="/signup">{plan.id === "free" ? "Commencer gratuitement" : "Commencer"}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
