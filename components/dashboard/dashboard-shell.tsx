"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { showToast } from "@/lib/toast";
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

  // État pour gérer l'ouverture du menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (dashboard.flash) {
      showToast.success(dashboard.flash);
      dashboard.clearFlash();
    }
  }, [dashboard.flash, dashboard]);

  useEffect(() => {
    if (dashboard.error) {
      showToast.error(dashboard.error);
      dashboard.clearError();
    }
  }, [dashboard.error, dashboard]);

  return (
    <div className="dashboard-app">
      {/* Overlay sombre : s'affiche quand le menu est ouvert (mobile uniquement) */}
      {isMenuOpen && (
        <div
          className="dashboard-overlay"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar avec classe dynamique */}
      <aside
        className={`dashboard-sidebar ${isMenuOpen ? "dashboard-sidebar--open" : ""}`}>
        <div className="dashboard-sidebar-head">
          <Link
            className="brand"
            href="/dashboard/overview"
            onClick={() => setIsMenuOpen(false)}>
            <span className="brand-mark" />
            <span>Ferme Avicole</span>
          </Link>
          <p className="helper">{currentUser.farmName}</p>
        </div>

        <nav className="dashboard-nav" aria-label="Navigation principale">
          {dashboardNavigation.map((item) => {
            const isGroupActive =
              isRouteActive(pathname, item.href) ||
              item.children?.some((child) =>
                isRouteActive(pathname, child.href),
              );

            return (
              <div key={item.key} className="dashboard-nav-group">
                <Link
                  className={
                    isGroupActive
                      ? "dashboard-nav-link dashboard-nav-link-active"
                      : "dashboard-nav-link"
                  }
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}>
                  <strong>{item.label}</strong>
                  {item.description ? (
                    <span className="helper">{item.description}</span>
                  ) : null}
                </Link>

                {isGroupActive && item.children?.length ? (
                  <div className="dashboard-subnav">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        className={
                          isRouteActive(pathname, child.href)
                            ? "dashboard-subnav-link dashboard-subnav-link-active" // Changé ici
                            : "dashboard-subnav-link" // Changé ici
                        }
                        href={child.href}
                        onClick={() => setIsMenuOpen(false)}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main content area */}
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          {/* Bouton Hamburger */}
          <button
            className={`dashboard-hamburger ${isMenuOpen ? "dashboard-hamburger--open" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            aria-label="Menu">
            <span />
            <span />
            <span />
          </button>

          <div className="dashboard-user stack" style={{ gap: "0.2rem" }}>
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
              type="button">
              Actualiser
            </button>
            <button
              className="button-secondary"
              onClick={() => void dashboard.logout()}
              type="button">
              Se déconnecter
            </button>
          </div>
        </header>

        <div className="dashboard-scroll-region">
          <div className="dashboard-content">{children}</div>

          <footer className="footer-note">
            Monolithe Next.js, Prisma et PostgreSQL local.
          </footer>
        </div>
      </div>
    </div>
  );
}
