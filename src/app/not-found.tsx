import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <Compass className="text-muted-foreground size-12" aria-hidden />
      <h1 className="text-3xl font-semibold tracking-tight">Page introuvable</h1>
      <p className="text-muted-foreground max-w-sm">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <Button asChild>
        <Link href="/">Retour à l&apos;accueil</Link>
      </Button>
    </div>
  );
}
