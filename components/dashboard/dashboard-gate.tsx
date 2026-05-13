"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { showToast } from "@/lib/toast";
import type { DashboardOverview } from "@/types/dashboard";

export function DashboardGate({
  children,
}: {
  children: (
    dashboard: Omit<ReturnType<typeof useDashboard>, "data"> & {
      data: DashboardOverview;
    },
  ) => ReactNode;
}) {
  const dashboard = useDashboard();

  useEffect(() => {
    if (!dashboard.data && dashboard.error) {
      showToast.error(
        dashboard.error || "Les donnees du dashboard sont indisponibles.",
      );
    }
  }, [dashboard.data, dashboard.error]);

  if (dashboard.loading && !dashboard.data) {
    return (
      <div className="section">
        <span className="helper">Chargement du dashboard...</span>
      </div>
    );
  }

  if (!dashboard.data) {
    return null; // Ou un message d'erreur statique si nécessaire
  }

  return <>{children({ ...dashboard, data: dashboard.data })}</>;
}
