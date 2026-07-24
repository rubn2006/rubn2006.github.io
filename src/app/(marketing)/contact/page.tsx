import type { Metadata } from "next";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
      <p className="text-muted-foreground mt-3">
        Une question, un bug, une idée ? Écris-nous directement, on te répond au plus vite.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Par email</CardTitle>
          <CardDescription>Réponse sous 2 jours ouvrés en général.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <a href={`mailto:${siteConfig.contactEmail}`}>
              <Mail /> {siteConfig.contactEmail}
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
