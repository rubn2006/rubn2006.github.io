import type { Metadata } from "next";

import { LegalPage } from "@/components/marketing/legal-page";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Politique de remboursement",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Politique de remboursement" lastUpdated="23 juillet 2026">
      <h2>1. Échecs techniques de génération</h2>
      <p>
        Si une génération échoue pour une raison technique (fournisseur indisponible, erreur
        interne), les crédits réservés pour cette génération sont automatiquement remboursés sur ton
        solde. Aucune démarche n&apos;est nécessaire.
      </p>

      <h2>2. Abonnements mensuels</h2>
      <p>
        Tu peux annuler ton abonnement à tout moment depuis le portail de facturation. L&apos;accès
        reste actif jusqu&apos;à la fin de la période déjà payée ; nous ne remboursons pas au
        prorata la période en cours, sauf obligation légale contraire dans ta juridiction.
      </p>

      <h2>3. Packs de crédits</h2>
      <p>
        Les packs de crédits achetés ponctuellement ne sont pas remboursables une fois des crédits
        du pack consommés. Un pack entièrement inutilisé peut faire l&apos;objet d&apos;une demande
        de remboursement dans les 14 jours suivant l&apos;achat.
      </p>

      <h2>4. Comment demander un remboursement</h2>
      <p>
        Contacte-nous à <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>{" "}
        en indiquant la date et le montant de la transaction concernée. Nous répondons sous 5 jours
        ouvrés.
      </p>
    </LegalPage>
  );
}
