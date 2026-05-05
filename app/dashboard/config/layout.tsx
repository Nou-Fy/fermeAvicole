import type { ReactNode } from "react";

import { DashboardDomainLayout } from "@/components/dashboard/domain-layout";
import { getDashboardSectionByKey } from "@/lib/dashboard/navigation";

export default function ConfigLayout({ children }: { children: ReactNode }) {
  const section = getDashboardSectionByKey("config");

  return (
    <DashboardDomainLayout
      title="Configuration"
      description="Parametres de couvaison, plans et catalogues metier separent maintenant leurs responsabilites."
      items={section?.children ?? []}
    >
      {children}
    </DashboardDomainLayout>
  );
}
