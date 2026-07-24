import type { Metadata } from "next";

import { LegalPage } from "@/components/marketing/legal-page";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Politique de confidentialité" lastUpdated="23 juillet 2026">
      <h2>1. Données que nous collectons</h2>
      <ul>
        <li>
          Données de compte : email, nom, mot de passe chiffré (géré par notre fournisseur
          d&apos;authentification), photo de profil optionnelle.
        </li>
        <li>
          Données de personnalisation : réponses à l&apos;onboarding (profil, plateforme, style
          préféré).
        </li>
        <li>Contenus créés : personnages, projets, scénarios, images de référence, générations.</li>
        <li>
          Données de facturation : gérées directement par Stripe, jamais stockées en clair sur nos
          serveurs.
        </li>
        <li>
          Données techniques : journaux serveur, adresse IP, identifiants de session, à des fins de
          sécurité et de débogage.
        </li>
      </ul>

      <h2>2. Comment nous utilisons ces données</h2>
      <p>
        Ces données servent à fournir le service (authentification, génération, facturation), à
        personnaliser ton expérience, à assurer la sécurité de la plateforme et à respecter nos
        obligations légales.
      </p>

      <h2>3. Partage avec des tiers</h2>
      <p>
        Nous partageons certaines données avec les sous-traitants nécessaires au fonctionnement du
        service :
      </p>
      <ul>
        <li>Supabase (base de données, authentification, stockage de fichiers) ;</li>
        <li>Stripe (paiements et facturation) ;</li>
        <li>
          Fournisseurs de génération IA (texte, image, vidéo, voix) lorsque le mode réel est activé
          ;
        </li>
        <li>Resend (envoi d&apos;emails transactionnels) ;</li>
        <li>Un outil d&apos;analyse produit anonymisé, sans donnée sensible.</li>
      </ul>
      <p>Nous ne vendons jamais tes données personnelles.</p>

      <h2>4. Cookies</h2>
      <p>
        Nous utilisons des cookies strictement nécessaires au fonctionnement du compte (session,
        préférences d&apos;affichage). Un bandeau de consentement s&apos;affiche si des cookies non
        essentiels (mesure d&apos;audience) sont activés.
      </p>

      <h2>5. Conservation des données</h2>
      <p>
        Tes données sont conservées tant que ton compte est actif. Les fichiers temporaires générés
        pendant le traitement sont supprimés automatiquement après un délai court.
      </p>

      <h2>6. Tes droits</h2>
      <p>Depuis les paramètres de ton compte, tu peux :</p>
      <ul>
        <li>consulter et modifier tes informations de profil ;</li>
        <li>demander l&apos;export de tes données ;</li>
        <li>supprimer définitivement ton compte et l&apos;ensemble des données associées.</li>
      </ul>

      <h2>7. Contact</h2>
      <p>
        Pour exercer tes droits ou pour toute question, contacte-nous à{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
      </p>
    </LegalPage>
  );
}
