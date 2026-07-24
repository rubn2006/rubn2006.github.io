import Link from "next/link";
import {
  Clapperboard,
  Feather,
  Layers,
  Mic,
  Palette,
  ShieldCheck,
  Sparkles,
  Subtitles,
  Users,
  Wand2,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PhoneMockup } from "@/components/marketing/phone-mockup";
import { PricingCard } from "@/components/marketing/pricing-card";
import { FAQ_ITEMS } from "@/lib/config/faq";
import { PLANS } from "@/lib/config/pricing";

const STEPS = [
  {
    icon: Users,
    title: "1. Crée tes personnages",
    description:
      "Nom, apparence, couleurs, personnalité, voix : ta fiche personnage devient un prompt verrouillé, réutilisé dans chaque scène.",
  },
  {
    icon: Feather,
    title: "2. Écris ton idée",
    description:
      '"La fraise découvre que la banane lui a menti pendant la soirée." Une phrase suffit pour lancer un scénario complet.',
  },
  {
    icon: Wand2,
    title: "3. Génère et publie",
    description:
      "Scénario, storyboard, scènes, voix, sous-titres et montage vertical assemblés automatiquement, prêts pour TikTok, Reels et Shorts.",
  },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: "Cohérence des personnages",
    description: "La même apparence, la même voix et la même personnalité, épisode après épisode.",
  },
  {
    icon: Layers,
    title: "Univers extensibles",
    description:
      "Fruits, animaux, mascottes, objets ou personnages humains fictifs : à toi de choisir.",
  },
  {
    icon: Mic,
    title: "Voix et dialogues",
    description: "Chaque personnage garde sa voix et sa manière de parler d'une scène à l'autre.",
  },
  {
    icon: Subtitles,
    title: "Sous-titres automatiques",
    description: "Générés et incrustés automatiquement, avec plusieurs styles au choix.",
  },
  {
    icon: Palette,
    title: "Styles visuels variés",
    description: "Cartoon 3D, cinématographique, anime, brainrot, luxe, ASMR et plus encore.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurité intégrée",
    description:
      "Modération de contenu, RLS sur toutes tes données, aucune clé API exposée au navigateur.",
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="size-3" /> Crédits gratuits à l&apos;inscription
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Transforme une idée en série vidéo virale.
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl text-lg text-balance">
              Crée des personnages cohérents, génère tes épisodes et publie-les sur TikTok, Reels et
              Shorts.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup">Créer ma première vidéo</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/examples">Voir une démonstration</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <PhoneMockup title="Ruby la fraise" gradientIndex={0} className="sm:col-span-1" />
            <PhoneMockup
              title="Kiwi mène l'enquête"
              gradientIndex={1}
              className="hidden sm:block"
            />
            <PhoneMockup title="Le clan des agrumes" gradientIndex={2} />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-muted/30 border-y py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Comment ça marche</h2>
            <p className="text-muted-foreground mt-3">
              Trois étapes entre une idée et une vidéo verticale prête à publier.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.title} className="text-center">
                <div className="bg-primary/10 text-primary mx-auto flex size-12 items-center justify-center rounded-xl">
                  <step.icon className="size-6" aria-hidden />
                </div>
                <h3 className="mt-4 font-medium">{step.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Ce que tu peux créer</h2>
          <p className="text-muted-foreground mt-3">
            De la mini-série humoristique à la publicité produit, avec des personnages qui restent
            reconnaissables partout.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="pt-6">
                <div className="bg-accent text-accent-foreground flex size-10 items-center justify-center rounded-lg">
                  <feature.icon className="size-5" aria-hidden />
                </div>
                <h3 className="mt-4 font-medium">{feature.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted/30 border-t py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Tarifs simples, sans surprise</h2>
            <p className="text-muted-foreground mt-3">
              Commence gratuitement, passe à l&apos;échelle quand tu es prêt.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
          <p className="text-muted-foreground mt-6 text-center text-sm">
            Besoin de plus de crédits ponctuellement ?{" "}
            <Link href="/pricing" className="hover:text-foreground underline">
              Voir les packs de crédits
            </Link>
            .
          </p>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <h2 className="text-center text-3xl font-semibold tracking-tight">Questions fréquentes</h2>
        <Accordion type="single" collapsible className="mt-10">
          {FAQ_ITEMS.slice(0, 6).map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-6 text-center">
          <Link href="/faq" className="text-primary text-sm font-medium hover:underline">
            Voir toutes les questions
          </Link>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <Clapperboard className="text-primary mx-auto size-10" aria-hidden />
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance">
            Prêt à transformer ta première idée en série ?
          </h2>
          <p className="text-muted-foreground mt-3">
            Crée un compte, reçois tes crédits gratuits et lance ton premier personnage
            aujourd&apos;hui.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/signup">Créer ma première vidéo</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
