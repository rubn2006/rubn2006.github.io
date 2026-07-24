import Link from "next/link";
import type { Metadata } from "next";
import { Coins } from "lucide-react";

import { PricingCard } from "@/components/marketing/pricing-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CREDIT_PACKS, PLANS } from "@/lib/config/pricing";
import { formatCredits, formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tarifs",
  description: "Forfaits mensuels et packs de crédits FruitDrama Studio.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">Tarifs</h1>
        <p className="text-muted-foreground mt-3">
          Commence gratuitement. Passe à un forfait payant quand tu veux publier sans filigrane.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>

      <div className="mt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Packs de crédits</h2>
          <p className="text-muted-foreground mt-3">
            Besoin de crédits supplémentaires ce mois-ci ? Achète un pack ponctuel, sans changer de
            forfait.
          </p>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {CREDIT_PACKS.map((pack) => (
            <Card key={pack.id}>
              <CardHeader>
                <div className="bg-accent text-accent-foreground flex size-10 items-center justify-center rounded-lg">
                  <Coins className="size-5" />
                </div>
                <CardTitle className="mt-2">{pack.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{formatCredits(pack.credits)} crédits</p>
                <p className="text-muted-foreground text-sm">{formatPrice(pack.priceCents)}</p>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <Link href="/signup">Commencer</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <p className="text-muted-foreground mt-16 text-center text-sm">
        Le paiement en ligne (Stripe) arrive dans une prochaine phase de développement du produit.
        L&apos;inscription et les crédits gratuits sont disponibles dès maintenant.
      </p>
    </div>
  );
}
