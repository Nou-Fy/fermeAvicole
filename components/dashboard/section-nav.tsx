"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isRouteActive } from "@/lib/dashboard/navigation";

type SectionNavItem = {
  label: string;
  href: string;
  description?: string;
};

export function DashboardSectionNav({
  items,
}: {
  items: SectionNavItem[];
}) {
  const pathname = usePathname();

  return (
    <nav className="section-nav" aria-label="Sous-navigation dashboard">
      {items.map((item) => (
        <Link
          key={item.href}
          className={
            isRouteActive(pathname, item.href)
              ? "section-nav-link section-nav-link-active"
              : "section-nav-link"
          }
          href={item.href}
        >
          <strong>{item.label}</strong>
          {item.description ? (
            <span className="helper">{item.description}</span>
          ) : null}
        </Link>
      ))}
    </nav>
  );
}
