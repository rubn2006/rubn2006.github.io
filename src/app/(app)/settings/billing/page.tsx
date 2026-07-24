import Link from "next/link";
import type { Metadata } from "next";
import { Info } from "lucide-react";

import { PageHeader } from "@/components/app-shell/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireCurrentUserContext } from "@/lib/auth/current-user";
import { getPlan } from "@/lib/config/pricing";
import { createClient } from "@/lib/supabase/server";
import { formatCredits, formatDateTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Abonnement & crédits",
};

const TRANSACTION_LABELS: Record<string, string> = {
  grant_signup: "Crédits offerts à l'inscription",
  grant_monthly: "Renouvellement mensuel",
  purchase: "Achat de crédits",
  reservation: "Réservation",
  debit: "Débit",
  refund: "Remboursement",
  adjustment_admin: "Ajustement admin",
  expiration: "Expiration",
};

export default async function BillingSettingsPage() {
  const ctx = await requireCurrentUserContext();
  const supabase = await createClient();
  const plan = getPlan(ctx.subscription?.plan ?? "free");

  const { data: transactions } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("user_id", ctx.userId)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Abonnement & crédits" />

      <Alert>
        <Info />
        <AlertDescription>
          Les paiements (abonnements et achats de crédits supplémentaires) arrivent en phase 4 de la
          construction du produit. Ton compte utilise pour l&apos;instant les crédits gratuits
          offerts à l&apos;inscription — aucune carte bancaire n&apos;est nécessaire.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Forfait actuel</CardTitle>
            <CardDescription>{plan.tagline}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge variant={plan.id === "free" ? "outline" : "secondary"} className="text-sm">
              {plan.name}
            </Badge>
            <ul className="text-muted-foreground space-y-1 text-sm">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <Button asChild variant="outline" size="sm">
              <Link href="/pricing">Voir tous les forfaits</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Crédits</CardTitle>
            <CardDescription>Solde disponible</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-3xl font-semibold">{formatCredits(ctx.wallet.balance)}</p>
            <p className="text-muted-foreground text-xs">
              {formatCredits(ctx.wallet.lifetime_granted)} crédits reçus au total
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historique des crédits</CardTitle>
          <CardDescription>
            Chaque mouvement de crédits, journalisé de façon immuable.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions && transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead className="text-right">Solde après</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(tx.created_at)}
                    </TableCell>
                    <TableCell>{TRANSACTION_LABELS[tx.type] ?? tx.type}</TableCell>
                    <TableCell
                      className={`text-right ${tx.amount >= 0 ? "text-success" : "text-destructive"}`}
                    >
                      {tx.amount >= 0 ? "+" : ""}
                      {formatCredits(tx.amount)}
                    </TableCell>
                    <TableCell className="text-right">{formatCredits(tx.balance_after)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-sm">Aucune transaction pour le moment.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
