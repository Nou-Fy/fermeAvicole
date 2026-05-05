"use client";

import { useState } from "react";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { PageHeader, SectionCard } from "@/components/ui";

export default function ConfigCouvaisonPage() {
  const { data, loading, pending, error, submitAction } = useDashboard();
  const [durationDays, setDurationDays] = useState("");

  if (loading && !data) {
    return (
      <div className="section">
        <span className="helper">Chargement des parametres de couvaison...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="alert alert-error">{error || "Donnees indisponibles."}</div>;
  }

  const currentValue =
    durationDays || String(data.config.couvaisonDuration.durationDays || 21);

  return (
    <div className="stack">
      <PageHeader
        title="Duree de couvaison"
        description="Cette page n'a qu'une responsabilite: piloter le parametre global de duree."
      />

      <SectionCard title="Parametre global applique aux nouvelles couvaisons">
        <form
          className="stack"
          onSubmit={(event) => {
            event.preventDefault();
            void submitAction(
              "/api/config/couvaison-duration",
              "PUT",
              { durationDays: Number(currentValue) },
              "Duree de couvaison mise a jour.",
            );
          }}
        >
          <div className="field">
            <label className="label">Nombre de jours</label>
            <input
              className="input"
              type="number"
              value={currentValue}
              onChange={(event) => setDurationDays(event.target.value)}
            />
          </div>
          <button className="button" disabled={pending} type="submit">
            Sauvegarder
          </button>
        </form>
      </SectionCard>
    </div>
  );
}
