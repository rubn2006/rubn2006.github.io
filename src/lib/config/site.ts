export const siteConfig = {
  name: "FruitDrama Studio",
  shortName: "FruitDrama",
  description:
    "Transforme une idée en série vidéo verticale virale. Crée des personnages cohérents, génère tes épisodes et publie-les sur TikTok, Reels et Shorts.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  locale: "fr-FR",
  links: {
    twitter: undefined as string | undefined,
    instagram: undefined as string | undefined,
    tiktok: undefined as string | undefined,
  },
  contactEmail: "contact@fruitdrama.studio",
};

export const marketingNav = [
  { label: "Fonctionnement", href: "/#how-it-works" },
  { label: "Exemples", href: "/examples" },
  { label: "Tarifs", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
] as const;

export const footerNav = {
  product: [
    { label: "Fonctionnement", href: "/#how-it-works" },
    { label: "Tarifs", href: "/pricing" },
    { label: "Exemples", href: "/examples" },
  ],
  company: [
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Conditions d'utilisation", href: "/terms" },
    { label: "Politique de confidentialité", href: "/privacy" },
    { label: "Politique de remboursement", href: "/refund-policy" },
  ],
} as const;

export const appNav = [
  { label: "Tableau de bord", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Projets", href: "/projects", icon: "FolderKanban" },
  { label: "Personnages", href: "/characters", icon: "Users" },
  { label: "Abonnement", href: "/settings/billing", icon: "CreditCard" },
] as const;

export const CONTENT_TYPES = [
  "Humour / sketchs",
  "Publicité produit",
  "Série narrative",
  "Contenu éducatif",
  "Mascotte de marque",
  "Autre",
] as const;

export const PLATFORMS = [
  { id: "tiktok", label: "TikTok" },
  { id: "instagram_reels", label: "Instagram Reels" },
  { id: "youtube_shorts", label: "YouTube Shorts" },
  { id: "multi", label: "Plusieurs plateformes" },
] as const;

export const EXPERIENCE_LEVELS = [
  { id: "beginner", label: "Débutant" },
  { id: "intermediate", label: "Intermédiaire" },
  { id: "advanced", label: "Avancé" },
] as const;

export const PROFILE_KINDS = [
  { id: "creator", label: "Créateur" },
  { id: "brand", label: "Marque" },
  { id: "agency", label: "Agence" },
  { id: "business", label: "Commerce" },
] as const;

export const VISUAL_STYLES = [
  "Cartoon 3D",
  "Cinématographique",
  "Mignon",
  "Luxe",
  "Brainrot",
  "Réaliste",
  "Anime",
  "Publicité premium",
  "ASMR",
  "Humour absurde",
] as const;
