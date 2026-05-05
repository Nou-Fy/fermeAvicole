import type { ReactNode } from "react";

import { DashboardDomainLayout } from "@/components/dashboard/domain-layout";
import { getDashboardSectionByKey } from "@/lib/dashboard/navigation";

export default function ElevageLayout({ children }: { children: ReactNode }) {
  const section = getDashboardSectionByKey("elevage");

  return (
    <DashboardDomainLayout
      title="Elevage"
      description="Tout ce qui touche au cheptel et a l'occupation physique de la ferme."
      items={section?.children ?? []}
    >
      {children}
    </DashboardDomainLayout>
  );
}
