"use client";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { PageHeader, SectionCard } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

export default function ConfigCataloguesPage() {
  const { data, loading, error } = useDashboard();

  if (loading && !data) {
    return (
      <div className="section">
        <span className="helper">Chargement des catalogues...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="alert alert-error">{error || "Donnees indisponibles."}</div>;
  }

  return (
    <div className="stack">
      <PageHeader
        title="Catalogues"
        description="Constantes metier et plans disponibles, sans autre responsabilite."
      />

      <SectionCard title="Catalogues de reference">
        <div className="triple-grid">
          <div className="list">
            <strong>Vaccins</strong>
            {data.config.vaccins.map((vaccin) => (
              <span key={vaccin.id} className="pill">
                {vaccin.nom}
              </span>
            ))}
          </div>
          <div className="list">
            <strong>Medicaments</strong>
            {data.config.medicaments.map((medicament) => (
              <span key={medicament.id} className="pill">
                {medicament.nom}
              </span>
            ))}
          </div>
          <div className="list">
            <strong>Races</strong>
            {data.config.races.map((race) => (
              <span key={race.id} className="pill">
                {race.nom}
              </span>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Plans disponibles" hint="Reference commerciale de l'application">
        <div className="list">
          {data.plans.map((plan) => (
            <div key={plan.id} className="list-item">
              <div className="split">
                <strong>{plan.name}</strong>
                <span className="pill">{formatCurrency(plan.price)}</span>
              </div>
              <span className="helper">
                {plan.maxAnimals < 0
                  ? "Animaux illimites"
                  : `${plan.maxAnimals} animaux max`}{" "}
                · {plan.maxUsers} utilisateur(s)
              </span>
              <span className="helper">{plan.features.join(", ")}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
