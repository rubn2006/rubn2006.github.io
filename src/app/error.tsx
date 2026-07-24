"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <AlertTriangle className="text-destructive size-12" aria-hidden />
      <h1 className="text-3xl font-semibold tracking-tight">Une erreur est survenue</h1>
      <p className="text-muted-foreground max-w-sm">
        Quelque chose s&apos;est mal passé de notre côté. Aucune donnée n&apos;a été perdue.
      </p>
      <Button onClick={reset}>Réessayer</Button>
    </div>
  );
}
