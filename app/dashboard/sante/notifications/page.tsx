"use client";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader, SectionCard, StatusBadge } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default function SanteNotificationsPage() {
  const { data, loading, pending, error, submitAction } = useDashboard();

  if (loading && !data) {
    return (
      <div className="section">
        <span className="helper">Chargement des notifications...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="alert alert-error">{error || "Donnees indisponibles."}</div>;
  }

  return (
    <div className="stack">
      <PageHeader
        title="Notifications"
        description="Vue specialisee pour traiter les rappels vaccination et medicament."
      />

      <SectionCard title="Rappels vaccination et traitement">
        {data.notifications.length === 0 ? (
          <EmptyState message="Aucune notification a afficher." />
        ) : (
          <div className="list">
            {data.notifications.map((notification) => (
              <div key={notification.id} className="list-item">
                <div className="split">
                  <strong>{notification.message}</strong>
                  <StatusBadge
                    label={notification.isRead ? "Lue" : "Non lue"}
                    tone={notification.isRead ? "success" : "warn"}
                  />
                </div>
                <span className="helper">
                  Prevue le {formatDate(notification.dateRappel)}
                </span>
                {!notification.isRead ? (
                  <button
                    className="button-ghost"
                    disabled={pending}
                    onClick={() =>
                      void submitAction(
                        `/api/sante/notifications/${notification.id}`,
                        "PUT",
                        {},
                        "Notification mise a jour.",
                      )
                    }
                    type="button"
                  >
                    Marquer comme lue
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
