"use client";

import type { ReactNode } from "react";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
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

  if (dashboard.loading && !dashboard.data) {
    return (
      <div className="section">
        <span className="helper">Chargement du dashboard...</span>
      </div>
    );
  }

  if (!dashboard.data) {
    return (
      <div className="alert alert-error">
        {dashboard.error || "Les donnees du dashboard sont indisponibles."}
      </div>
    );
  }

  return <>{children({ ...dashboard, data: dashboard.data })}</>;
}
