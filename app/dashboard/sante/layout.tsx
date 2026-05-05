import type { ReactNode } from "react";

import { DashboardDomainLayout } from "@/components/dashboard/domain-layout";
import { getDashboardSectionByKey } from "@/lib/dashboard/navigation";

export default function SanteLayout({ children }: { children: ReactNode }) {
  const section = getDashboardSectionByKey("sante");

  return (
    <DashboardDomainLayout
      title="Sante"
      description="Vaccins, traitements, historique et rappels de suivi."
      items={section?.children ?? []}
    >
      {children}
    </DashboardDomainLayout>
  );
}
