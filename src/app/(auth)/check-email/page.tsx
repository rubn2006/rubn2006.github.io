import Link from "next/link";
import type { Metadata } from "next";
import { MailCheck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Vérifie ta boîte mail",
};

export default function CheckEmailPage() {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <MailCheck className="text-primary size-10" />
        <CardTitle className="text-xl">Vérifie ta boîte mail</CardTitle>
        <CardDescription>
          On vient de t&apos;envoyer un lien. Clique dessus pour continuer — tu peux fermer cet
          onglet.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Link href="/login" className="text-foreground text-sm font-medium hover:underline">
          Retour à la connexion
        </Link>
      </CardContent>
    </Card>
  );
}
