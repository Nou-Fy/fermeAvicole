"use client";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader, SectionCard } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default function SanteHistoriquePage() {
  const { data, loading, error } = useDashboard();

  if (loading && !data) {
    return (
      <div className="section">
        <span className="helper">Chargement de l&apos;historique sante...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="alert alert-error">{error || "Donnees indisponibles."}</div>;
  }

  return (
    <div className="stack">
      <PageHeader
        title="Historique sante"
        description="Table de consultation dediee a tous les actes de sante enregistres."
      />

      <SectionCard title="Tous les actes enregistres">
        {data.historiqueSante.length === 0 ? (
          <EmptyState message="Aucun historique sante." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Animal</th>
                  <th>Type</th>
                  <th>Traitement</th>
                  <th>Date</th>
                  <th>Rappel</th>
                </tr>
              </thead>
              <tbody>
                {data.historiqueSante.map((item) => (
                  <tr key={item.id}>
                    <td>{item.animalId}</td>
                    <td>{item.type}</td>
                    <td>{item.nomTraitement}</td>
                    <td>{formatDate(item.dateAdminion)}</td>
                    <td>{formatDate(item.prochainRappel)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
