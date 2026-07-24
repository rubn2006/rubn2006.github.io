import Link from "next/link";
import type { ReactNode } from "react";

import { siteConfig } from "@/lib/config/site";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-muted/40 flex min-h-svh flex-col items-center justify-center gap-8 px-4 py-12">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
        <span
          aria-hidden
          className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg"
        >
          🍓
        </span>
        {siteConfig.name}
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
