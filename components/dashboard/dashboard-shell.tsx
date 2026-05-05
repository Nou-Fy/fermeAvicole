"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  dashboardNavigation,
  getActiveDashboardSection,
  isRouteActive,
} from "@/lib/dashboard/navigation";

type ShellUser = {
  firstName: string;
  lastName: string;
  farmName: string;
  email: string;
};

export function DashboardShell({
  user,
  children,
}: {
  user: ShellUser;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const dashboard = useDashboard();
  const activeSection = getActiveDashboardSection(pathname);
  const currentUser = dashboard.data?.user ?? user;

  return (
    <div className="dashboard-app">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-head">
          <Link className="brand" href="/dashboard/overview">
            <span className="brand-mark" />
            <span>Ferme Avicole</span>
          </Link>
          <p className="helper">{currentUser.farmName}</p>
        </div>

        <nav className="dashboard-nav" aria-label="Navigation principale">
          {dashboardNavigation.map((item) => (
            <div key={item.key} className="dashboard-nav-group">
              <Link
                className={
                  isRouteActive(pathname, item.href)
                    ? "dashboard-nav-link dashboard-nav-link-active"
                    : "dashboard-nav-link"
                }
                href={item.href}
              >
                <strong>{item.label}</strong>
                {item.description ? (
                  <span className="helper">{item.description}</span>
                ) : null}
              </Link>

              {activeSection.key === item.key && item.children?.length ? (
                <div className="dashboard-subnav">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      className={
                        isRouteActive(pathname, child.href)
                          ? "dashboard-subnav-link dashboard-subnav-link-active"
                          : "dashboard-subnav-link"
                      }
                      href={child.href}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="stack" style={{ gap: "0.2rem" }}>
            <strong>
              {currentUser.firstName} {currentUser.lastName}
            </strong>
            <span className="helper">{currentUser.email}</span>
          </div>

          <div className="dashboard-topbar-actions">
            <ThemeToggle />
            <button
              className="button-ghost"
              disabled={dashboard.pending}
              onClick={() => void dashboard.refresh()}
              type="button"
            >
              Actualiser
            </button>
            <button
              className="button-secondary"
              onClick={() => void dashboard.logout()}
              type="button"
            >
              Se deconnecter
            </button>
          </div>
        </header>

        {dashboard.flash ? (
          <div className="alert alert-success" onClick={dashboard.clearFlash}>
            {dashboard.flash}
          </div>
        ) : null}

        {dashboard.error ? (
          <div className="alert alert-error" onClick={dashboard.clearError}>
            {dashboard.error}
          </div>
        ) : null}

        <div className="dashboard-content">{children}</div>

        <footer className="footer-note">
          Monolithe Next.js, Prisma et PostgreSQL local. Aucun service Docker
          requis.
        </footer>
      </div>
    </div>
  );
}
