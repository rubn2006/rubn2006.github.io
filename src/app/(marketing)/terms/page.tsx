import type { Metadata } from "next";

import { LegalPage } from "@/components/marketing/legal-page";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
};

export default function TermsPage() {
  return (
    <LegalPage title="Conditions d'utilisation" lastUpdated="23 juillet 2026">
      <h2>1. Acceptation</h2>
      <p>
        En créant un compte sur {siteConfig.name}, tu acceptes les présentes conditions
        d&apos;utilisation ainsi que notre politique de confidentialité et notre politique de
        remboursement.
      </p>

      <h2>2. Description du service</h2>
      <p>
        {siteConfig.name} est un service permettant de créer des personnages récurrents et de
        générer, à partir d&apos;une idée textuelle, des vidéos verticales courtes assemblées à
        partir de scénarios, d&apos;images, de clips vidéo, de voix et de sous-titres générés par
        des fournisseurs d&apos;intelligence artificielle tiers ou par un mode de démonstration («
        mode MOCK »).
      </p>

      <h2>3. Compte utilisateur</h2>
      <p>
        Tu es responsable de la confidentialité de tes identifiants et de toute activité réalisée
        depuis ton compte. Un compte est personnel et ne doit pas être partagé.
      </p>

      <h2>4. Crédits et abonnements</h2>
      <p>
        L&apos;utilisation des fonctionnalités de génération consomme des crédits, selon le barème
        affiché avant chaque génération. Les crédits sont réservés avant la génération et débités
        uniquement en cas de succès ; en cas d&apos;échec technique, ils sont automatiquement
        remboursés. Les abonnements se renouvellent automatiquement jusqu&apos;à annulation depuis
        le portail de facturation.
      </p>

      <h2>5. Utilisation acceptable</h2>
      <p>Il est interdit d&apos;utiliser le service pour générer ou diffuser :</p>
      <ul>
        <li>des deepfakes ou une usurpation non consentie de personnes réelles ;</li>
        <li>du contenu sexuel impliquant des mineurs, sous quelque forme que ce soit ;</li>
        <li>des contenus de violence extrême ou d&apos;incitation à la haine ;</li>
        <li>du harcèlement ciblé envers une personne ou un groupe ;</li>
        <li>une utilisation frauduleuse de marques tierces ;</li>
        <li>une violation manifeste de droits d&apos;auteur.</li>
      </ul>
      <p>
        En important une image de référence, tu confirmes détenir les droits nécessaires sur cette
        image.
      </p>

      <h2>6. Propriété intellectuelle</h2>
      <p>
        Tu conserves les droits sur les idées, scénarios et personnages que tu crées, dans les
        limites des droits accordés par ton forfait et des droits des fournisseurs tiers utilisés
        pour la génération. {siteConfig.name} ne revendique aucune propriété sur tes créations.
      </p>

      <h2>7. Résiliation</h2>
      <p>
        Tu peux supprimer ton compte à tout moment depuis les paramètres. Nous pouvons suspendre un
        compte en cas de violation manifeste des présentes conditions.
      </p>

      <h2>8. Limitation de responsabilité</h2>
      <p>
        Le service est fourni « en l&apos;état ». Dans la limite permise par la loi applicable, nous
        ne pourrons être tenus responsables des dommages indirects résultant de l&apos;utilisation
        du service.
      </p>

      <h2>9. Contact</h2>
      <p>
        Pour toute question relative à ces conditions, contacte-nous à{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
      </p>
    </LegalPage>
  );
}
