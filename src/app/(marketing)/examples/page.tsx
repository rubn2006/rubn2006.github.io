import Link from "next/link";
import type { Metadata } from "next";

import { PhoneMockup } from "@/components/marketing/phone-mockup";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Exemples",
  description: "Aperçu du format de vidéos verticales générées par FruitDrama Studio.",
};

const EXAMPLES = [
  { title: "Ruby la fraise découvre un secret", gradientIndex: 0 },
  { title: "Kiwi organise une fête surprise", gradientIndex: 1 },
  { title: "L'ananas et le clan des agrumes", gradientIndex: 2 },
  { title: "La pastèque perd son secret", gradientIndex: 3 },
];

export default function ExamplesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">Exemples</h1>
        <p className="text-muted-foreground mt-3">
          Un aperçu du format : vidéos verticales 9:16, personnages cohérents, sous-titres
          incrustés.
        </p>
      </div>

      <Alert className="mx-auto mt-8 max-w-2xl">
        <Info />
        <AlertDescription>
          Ces aperçus sont des maquettes illustrant le format final, pas de vraies vidéos générées.
          Crée un compte pour générer ta première vidéo en mode démo gratuit.
        </AlertDescription>
      </Alert>

      <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {EXAMPLES.map((example) => (
          <PhoneMockup
            key={example.title}
            title={example.title}
            gradientIndex={example.gradientIndex}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button asChild size="lg">
          <Link href="/signup">Créer ma première vidéo</Link>
        </Button>
      </div>
    </div>
  );
}
