import type { ReactNode } from "react";

import { DashboardDomainLayout } from "@/components/dashboard/domain-layout";
import { getDashboardSectionByKey } from "@/lib/dashboard/navigation";

export default function VentesLayout({ children }: { children: ReactNode }) {
  const section = getDashboardSectionByKey("ventes");

  return (
    <DashboardDomainLayout
      title="Ventes"
      description="Les clients et les commandes ont maintenant leurs propres pages."
      items={section?.children ?? []}
    >
      {children}
    </DashboardDomainLayout>
  );
}
