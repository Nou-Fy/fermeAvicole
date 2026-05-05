import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { DashboardProvider } from "@/components/dashboard/dashboard-provider";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireCurrentUserFromCookies } from "@/lib/server/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const currentUser = await requireCurrentUserFromCookies();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <DashboardProvider>
      <DashboardShell
        user={{
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          farmName: currentUser.farmName,
          email: currentUser.email,
        }}
      >
        {children}
      </DashboardShell>
    </DashboardProvider>
  );
}
