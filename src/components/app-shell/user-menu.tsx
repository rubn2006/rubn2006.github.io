"use client";

import Link from "next/link";
import { CreditCard, LogOut, Settings, Sparkles } from "lucide-react";

import { signOut } from "@/app/(auth)/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPlan, type PlanId } from "@/lib/config/pricing";
import { formatCredits, initials } from "@/lib/utils";

export function UserMenu({
  fullName,
  email,
  avatarUrl,
  creditBalance,
  plan,
}: {
  fullName: string | null;
  email: string;
  avatarUrl: string | null;
  creditBalance: number;
  plan: PlanId;
}) {
  const displayName = fullName ?? email;
  const planConfig = getPlan(plan);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-ring flex items-center gap-2 rounded-full outline-none focus-visible:ring-2">
        <Avatar>
          {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
          <AvatarFallback>{initials(displayName)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate font-medium">{displayName}</span>
          <span className="text-muted-foreground truncate text-xs font-normal">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between px-2 py-1.5 text-sm">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="size-3.5" /> Crédits
          </span>
          <span className="font-medium">{formatCredits(creditBalance)}</span>
        </div>
        <div className="flex items-center justify-between px-2 py-1.5 text-sm">
          <span className="text-muted-foreground">Forfait</span>
          <Badge variant={plan === "free" ? "outline" : "secondary"}>{planConfig.name}</Badge>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings/billing">
            <CreditCard /> Abonnement &amp; crédits
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings /> Paramètres du compte
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={(event) => {
            event.preventDefault();
            void signOut();
          }}
        >
          <LogOut /> Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
