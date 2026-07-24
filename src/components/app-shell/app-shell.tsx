import Link from "next/link";
import type { ReactNode } from "react";

import { MobileNav } from "@/components/app-shell/mobile-nav";
import { NavLinks } from "@/components/app-shell/nav-links";
import { UserMenu } from "@/components/app-shell/user-menu";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import type { PlanId } from "@/lib/config/pricing";
import { formatCredits } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export function AppShell({
  children,
  fullName,
  email,
  avatarUrl,
  creditBalance,
  plan,
}: {
  children: ReactNode;
  fullName: string | null;
  email: string;
  avatarUrl: string | null;
  creditBalance: number;
  plan: PlanId;
}) {
  return (
    <div className="flex min-h-svh">
      <aside className="bg-card hidden w-64 shrink-0 flex-col border-r lg:flex">
        <div className="flex h-16 items-center gap-2 border-b px-6 font-semibold">
          <span aria-hidden className="text-lg">
            🍓
          </span>
          {siteConfig.shortName}
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <NavLinks />
        </div>
        <div className="border-t p-4">
          <Button asChild className="w-full">
            <Link href="/projects/new">Nouvelle vidéo</Link>
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-background/80 supports-backdrop-filter:bg-background/60 flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <MobileNav />
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden sm:flex">
              <Sparkles className="size-3" />
              {formatCredits(creditBalance)} crédits
            </Badge>
            <ThemeToggle />
            <UserMenu
              fullName={fullName}
              email={email}
              avatarUrl={avatarUrl}
              creditBalance={creditBalance}
              plan={plan}
            />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
