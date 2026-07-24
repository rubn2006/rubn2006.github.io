"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, FolderKanban, LayoutDashboard, Users, type LucideIcon } from "lucide-react";

import { appNav } from "@/lib/config/site";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  FolderKanban,
  Users,
  CreditCard,
};

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="Navigation principale">
      {appNav.map((item) => {
        const Icon = ICONS[item.icon];
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {Icon && <Icon className="size-4" aria-hidden />}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
