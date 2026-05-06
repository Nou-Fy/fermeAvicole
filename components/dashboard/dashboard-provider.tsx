"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import type { DashboardOverview } from "@/types/dashboard";

export type DashboardActionMethod = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";

export type DashboardContextValue = {
  data: DashboardOverview | null;
  loading: boolean;
  pending: boolean;
  error: string;
  flash: string;
  refresh: (silent?: boolean) => Promise<void>;
  submitAction: (
    path: string,
    method: DashboardActionMethod,
    body?: Record<string, unknown>,
    successMessage?: string,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  clearFlash: () => void;
  clearError: () => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");

  const refresh = useCallback(
    async (silent = false) => {
      if (!silent) {
        setLoading(true);
      }

      try {
        const response = await fetch("/api/overview", {
          credentials: "include",
          cache: "no-store",
        });

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        const payload = (await response.json()) as DashboardOverview & {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(
            payload.error || "Impossible de charger les donnees.",
          );
        }

        setData(payload);
      } catch (refreshError) {
        setError(
          refreshError instanceof Error
            ? refreshError.message
            : "Impossible de charger les donnees du dashboard.",
        );
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [router],
  );

  const submitAction = useCallback(
    async (
      path: string,
      method: DashboardActionMethod,
      body?: Record<string, unknown>,
      successMessage = "Operation effectuee.",
    ) => {
      setPending(true);
      setFlash("");
      setError("");

      try {
        const response = await fetch(path, {
          method,
          credentials: "include",
          headers:
            method === "DELETE"
              ? undefined
              : {
                  "Content-Type": "application/json",
                },
          body: method === "DELETE" ? undefined : JSON.stringify(body || {}),
        });

        const payload = await response.json().catch(() => ({}));

        if (response.status === 401) {
          router.push("/login");
          return false;
        }

        if (!response.ok) {
          throw new Error(payload.error || "La requete a echoue.");
        }

        setFlash(successMessage);
        await refresh(true);
        return true;
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Operation impossible.",
        );
        return false;
      } finally {
        setPending(false);
      }
    },
    [refresh, router],
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/");
    router.refresh();
  }, [router]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    setFlash("");
    setError("");
  }, [pathname]);

  const value = useMemo<DashboardContextValue>(
    () => ({
      data,
      loading,
      pending,
      error,
      flash,
      refresh,
      submitAction,
      logout,
      clearFlash: () => setFlash(""),
      clearError: () => setError(""),
    }),
    [data, error, flash, loading, logout, pending, refresh, submitAction],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider.");
  }

  return context;
}
