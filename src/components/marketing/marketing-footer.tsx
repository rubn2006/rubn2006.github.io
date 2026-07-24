import Link from "next/link";

import { footerNav, siteConfig } from "@/lib/config/site";

export function MarketingFooter() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span aria-hidden className="text-lg">
              🍓
            </span>
            {siteConfig.shortName}
          </Link>
          <p className="text-muted-foreground mt-3 max-w-xs text-sm">{siteConfig.description}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium">Produit</h3>
          <ul className="mt-3 space-y-2">
            {footerNav.product.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium">Entreprise</h3>
          <ul className="mt-3 space-y-2">
            {footerNav.company.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium">Légal</h3>
          <ul className="mt-3 space-y-2">
            {footerNav.legal.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="text-muted-foreground border-t px-4 py-6 text-center text-xs sm:px-6">
        © {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.
      </div>
    </footer>
  );
}
