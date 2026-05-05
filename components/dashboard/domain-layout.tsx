import type { ReactNode } from "react";

import { DashboardSectionNav } from "@/components/dashboard/section-nav";
import { PageHeader } from "@/components/ui";

type SectionNavItem = {
  label: string;
  href: string;
  description?: string;
};

export function DashboardDomainLayout({
  title,
  description,
  items,
  children,
}: {
  title: string;
  description: string;
  items: SectionNavItem[];
  children: ReactNode;
}) {
  return (
    <div className="stack page-section">
      <PageHeader title={title} description={description} />
      <DashboardSectionNav items={items} />
      {children}
    </div>
  );
}
