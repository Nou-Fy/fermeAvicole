import type { ReactNode } from "react";

import { DashboardDomainLayout } from "@/components/dashboard/domain-layout";
import { getDashboardSectionByKey } from "@/lib/dashboard/navigation";

export default function ProductionLayout({
  children,
}: {
  children: ReactNode;
}) {
  const section = getDashboardSectionByKey("production");

  return (
    <DashboardDomainLayout
      title="Production"
      description="Oeufs, couvaison et alimentation sont separes en sous-pages specialisees."
      items={section?.children ?? []}
    >
      {children}
    </DashboardDomainLayout>
  );
}
