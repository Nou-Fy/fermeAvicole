import type { ReactNode } from "react";

import { DashboardDomainLayout } from "@/components/dashboard/domain-layout";
import { getDashboardSectionByKey } from "@/lib/dashboard/navigation";

export default function FinancesLayout({ children }: { children: ReactNode }) {
  const section = getDashboardSectionByKey("finances");

  return (
    <DashboardDomainLayout
      title="Finances"
      description="Transactions, rapport et paiements sont accessibles par routes dediees."
      items={section?.children ?? []}
    >
      {children}
    </DashboardDomainLayout>
  );
}
