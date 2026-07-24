/**
 * Single source of truth for plans, credit packs and credit costs (spec §8/§9).
 * Changing a number here changes it everywhere (pricing page, dashboard, credit
 * engine, Stripe checkout). Stripe price IDs are read from env at call time so
 * this file never needs secrets and stays safe to import from client components.
 */

export type PlanId = "free" | "starter" | "creator" | "pro";
export type CreditPackId = "small" | "medium" | "large";

export interface PlanConfig {
  id: PlanId;
  name: string;
  tagline: string;
  priceMonthlyCents: number;
  monthlyCredits: number;
  maxCharacters: number | null;
  maxSeries: number | null;
  maxResolution: "720p" | "1080p";
  watermark: boolean;
  commercialUse: "none" | "standard" | "extended";
  generationPriority: "standard" | "medium" | "high";
  historyRetentionDays: number | null;
  features: string[];
  stripePriceEnvVar: `STRIPE_PRICE_${string}` | null;
  highlighted?: boolean;
}

export const PLANS: PlanConfig[] = [
  {
    id: "free",
    name: "Gratuit",
    tagline: "Pour découvrir FruitDrama Studio",
    priceMonthlyCents: 0,
    monthlyCredits: 40,
    maxCharacters: 2,
    maxSeries: 1,
    maxResolution: "720p",
    watermark: true,
    commercialUse: "none",
    generationPriority: "standard",
    historyRetentionDays: 30,
    features: [
      "1 à 2 vidéos de démonstration",
      "Résolution limitée (720p)",
      "Filigrane FruitDrama",
      "Pas d'usage commercial",
    ],
    stripePriceEnvVar: null,
  },
  {
    id: "starter",
    name: "Starter",
    tagline: "Pour démarrer en tant que créateur",
    priceMonthlyCents: 999,
    monthlyCredits: 200,
    maxCharacters: 5,
    maxSeries: 3,
    maxResolution: "1080p",
    watermark: false,
    commercialUse: "standard",
    generationPriority: "standard",
    historyRetentionDays: 90,
    features: [
      "200 crédits par mois",
      "Export sans filigrane",
      "Personnages sauvegardés",
      "Usage personnel et créateur",
    ],
    stripePriceEnvVar: "STRIPE_PRICE_STARTER",
  },
  {
    id: "creator",
    name: "Creator",
    tagline: "Pour publier régulièrement",
    priceMonthlyCents: 2499,
    monthlyCredits: 600,
    maxCharacters: 15,
    maxSeries: 10,
    maxResolution: "1080p",
    watermark: false,
    commercialUse: "standard",
    generationPriority: "medium",
    historyRetentionDays: 180,
    features: [
      "600 crédits par mois",
      "Davantage de personnages",
      "Exports HD",
      "Priorité de génération intermédiaire",
      "Droits commerciaux standards",
    ],
    stripePriceEnvVar: "STRIPE_PRICE_CREATOR",
    highlighted: true,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Pour les agences et marques",
    priceMonthlyCents: 4999,
    monthlyCredits: 1500,
    maxCharacters: null,
    maxSeries: null,
    maxResolution: "1080p",
    watermark: false,
    commercialUse: "extended",
    generationPriority: "high",
    historyRetentionDays: null,
    features: [
      "1500 crédits par mois",
      "Séries illimitées",
      "Génération prioritaire",
      "Branding personnalisé",
      "Usage commercial étendu",
      "Historique illimité",
    ],
    stripePriceEnvVar: "STRIPE_PRICE_PRO",
  },
];

export interface CreditPackConfig {
  id: CreditPackId;
  name: string;
  credits: number;
  priceCents: number;
  stripePriceEnvVar: `STRIPE_PRICE_${string}`;
}

export const CREDIT_PACKS: CreditPackConfig[] = [
  {
    id: "small",
    name: "Petit pack",
    credits: 150,
    priceCents: 690,
    stripePriceEnvVar: "STRIPE_PRICE_CREDITS_SMALL",
  },
  {
    id: "medium",
    name: "Pack moyen",
    credits: 500,
    priceCents: 1990,
    stripePriceEnvVar: "STRIPE_PRICE_CREDITS_MEDIUM",
  },
  {
    id: "large",
    name: "Grand pack",
    credits: 1200,
    priceCents: 3990,
    stripePriceEnvVar: "STRIPE_PRICE_CREDITS_LARGE",
  },
];

/** Credits granted automatically to every new signup (spec §31). */
export const FREE_SIGNUP_CREDITS = 40;

/**
 * Base credit costs. Actual cost = base * duration/resolution/provider multipliers,
 * computed by lib/credits/estimate.ts. Kept here so pricing changes never require
 * touching business logic.
 */
export const CREDIT_COSTS = {
  script_generation: 3,
  storyboard_generation: 2,
  character_reference_generation: 4,
  scene_image_generation: 3,
  scene_video_generation_per_second: 4,
  scene_regeneration_multiplier: 1,
  voice_generation_per_10_seconds: 2,
  subtitle_generation: 1,
  final_render: 5,
} as const;

export const RESOLUTION_MULTIPLIER: Record<"720p" | "1080p" | "4k", number> = {
  "720p": 0.75,
  "1080p": 1,
  "4k": 2,
};

export function getPlan(id: PlanId): PlanConfig {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown plan id: ${id}`);
  return plan;
}

export function getCreditPack(id: CreditPackId): CreditPackConfig {
  const pack = CREDIT_PACKS.find((p) => p.id === id);
  if (!pack) throw new Error(`Unknown credit pack id: ${id}`);
  return pack;
}
