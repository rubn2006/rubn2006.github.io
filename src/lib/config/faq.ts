export const FAQ_ITEMS = [
  {
    question: "Est-ce que je peux essayer gratuitement ?",
    answer:
      "Oui. À l'inscription, tu reçois des crédits gratuits pour créer un personnage et générer une première vidéo de démonstration, avec filigrane et résolution limitée.",
  },
  {
    question: "Comment FruitDrama Studio garde-t-il mes personnages cohérents ?",
    answer:
      "Chaque personnage a une fiche complète (apparence, couleurs, accessoires, personnalité, voix, prompt visuel verrouillé). Cette fiche est automatiquement injectée dans chaque scène générée, pour que l'apparence et la personnalité restent identiques d'un épisode à l'autre.",
  },
  {
    question: "Dois-je utiliser des fruits personnifiés ?",
    answer:
      "Non. Les fruits sont notre exemple de démarrage, mais tu peux créer des animaux, des mascottes de marque, des personnages brainrot, des objets personnifiés ou des personnages humains fictifs.",
  },
  {
    question: "Puis-je utiliser mes vidéos à des fins commerciales ?",
    answer:
      "Cela dépend de ton forfait. Le forfait gratuit est réservé à un usage de démonstration. Les forfaits Starter, Creator et Pro incluent des droits commerciaux standards ou étendus — voir le détail dans la grille tarifaire.",
  },
  {
    question: "Qu'est-ce que le mode MOCK ?",
    answer:
      "C'est un mode de démonstration qui simule la génération de scénarios, d'images, de vidéos et de voix sans consommer de crédits d'API réels. Il permet de tester tout le parcours produit avant de brancher de vrais fournisseurs IA.",
  },
  {
    question: "Puis-je importer mes propres images de personnages ?",
    answer:
      "Oui, à condition de confirmer que tu possèdes les droits sur ces images. Les deepfakes de personnes réelles et l'usurpation non consentie ne sont pas autorisés.",
  },
  {
    question: "Comment fonctionnent les crédits ?",
    answer:
      "Chaque action de génération (scénario, image, clip, voix, rendu final) a un coût en crédits, estimé avant lancement puis débité seulement si la génération réussit. En cas d'échec technique, tu es automatiquement remboursé.",
  },
  {
    question: "Puis-je annuler mon abonnement à tout moment ?",
    answer: "Oui, directement depuis le portail de facturation Stripe, sans engagement de durée.",
  },
] as const;
