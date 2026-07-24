import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-2 text-sm">Dernière mise à jour : {lastUpdated}</p>

      <Alert variant="warning" className="mt-6">
        <AlertTriangle />
        <AlertTitle>Modèle de document</AlertTitle>
        <AlertDescription>
          Ce texte est un modèle de développement fourni pour que le produit soit fonctionnel de
          bout en bout. Il doit être relu et validé par un professionnel du droit avant tout
          lancement commercial réel.
        </AlertDescription>
      </Alert>

      <div className="prose prose-sm dark:prose-invert prose-headings:font-semibold prose-a:text-primary mt-10 max-w-none">
        {children}
      </div>
    </div>
  );
}
