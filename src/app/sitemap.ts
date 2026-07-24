import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config/site";

const STATIC_ROUTES = [
  "",
  "/pricing",
  "/examples",
  "/faq",
  "/contact",
  "/login",
  "/signup",
  "/terms",
  "/privacy",
  "/refund-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.6,
  }));
}
