"use client";

import { useEffect, useState } from "react";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader, SectionCard, StatusBadge } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default function ProductionOeufsPage() {
  const { data, loading, pending, error, submitAction } = useDashboard();
  const [oeufForm, setOeufForm] = useState({
    animalId: "",
    categorie: "",
    poids: "",
    qualite: "EXCELLENT",
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    if (!oeufForm.animalId && data.animals[0]) {
      setOeufForm((current) => ({
        ...current,
        animalId: data.animals[0].id,
      }));
    }
    if (!oeufForm.categorie && data.config.oeufCategories[0]) {
      setOeufForm((current) => ({
        ...current,
        categorie: data.config.oeufCategories[0].nom,
      }));
    }
  }, [data, oeufForm.animalId, oeufForm.categorie]);

  if (loading && !data) {
    return (
      <div className="section">
        <span className="helper">Chargement du module oeufs...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="alert alert-error">{error || "Donnees indisponibles."}</div>;
  }

  return (
    <div className="stack">
      <PageHeader
        title="Oeufs"
        description="Production et suivi commercial des oeufs dans une page specialisee."
      />

      <SectionCard title="Production d'oeufs" hint="Ajout et vente des oeufs">
        {data.animals.length === 0 || data.config.oeufCategories.length === 0 ? (
          <EmptyState message="Il faut des animaux et des categories d'oeufs." />
        ) : (
          <form
            className="stack"
            onSubmit={async (event) => {
              event.preventDefault();
              const ok = await submitAction(
                "/api/oeuf",
                "POST",
                {
                  ...oeufForm,
                  poids: Number(oeufForm.poids),
                },
                "Oeuf enregistre.",
              );

              if (ok) {
                setOeufForm((current) => ({
                  ...current,
                  poids: "",
                }));
              }
            }}
          >
            <div className="form-grid">
              <div className="field">
                <label className="label">Animal</label>
                <select
                  className="select"
                  value={oeufForm.animalId}
                  onChange={(event) =>
                    setOeufForm((current) => ({
                      ...current,
                      animalId: event.target.value,
                    }))
                  }
                >
                  {data.animals.map((animal) => (
                    <option key={animal.id} value={animal.id}>
                      {animal.numIdentif}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="label">Categorie</label>
                <select
                  className="select"
                  value={oeufForm.categorie}
                  onChange={(event) =>
                    setOeufForm((current) => ({
                      ...current,
                      categorie: event.target.value,
                    }))
                  }
                >
                  {data.config.oeufCategories.map((category) => (
                    <option key={category.id} value={category.nom}>
                      {category.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="label">Poids (g)</label>
                <input
                  className="input"
                  type="number"
                  value={oeufForm.poids}
                  onChange={(event) =>
                    setOeufForm((current) => ({
                      ...current,
                      poids: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="field">
                <label className="label">Qualite</label>
                <select
                  className="select"
                  value={oeufForm.qualite}
                  onChange={(event) =>
                    setOeufForm((current) => ({
                      ...current,
                      qualite: event.target.value,
                    }))
                  }
                >
                  {["EXCELLENT", "BON", "NORMAL", "DEFAUT", "REJETE"].map(
                    (quality) => (
                      <option key={quality} value={quality}>
                        {quality}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
            <button className="button" disabled={pending} type="submit">
              Ajouter l&apos;oeuf
            </button>
          </form>
        )}
      </SectionCard>

      <SectionCard title="Stock d'oeufs" hint="Disponibilite et ventes">
        {data.oeufs.length === 0 ? (
          <EmptyState message="Aucun oeuf enregistre." />
        ) : (
          <div className="list">
            {data.oeufs.map((oeuf) => (
              <div key={oeuf.id} className="list-item">
                <div className="split">
                  <strong>{oeuf.categorie}</strong>
                  <StatusBadge
                    label={oeuf.vendu ? "Vendu" : "Disponible"}
                    tone={oeuf.vendu ? "success" : "warn"}
                  />
                </div>
                <span className="helper">
                  {oeuf.qualite} · {oeuf.poids} g · {formatDate(oeuf.dateProduction)}
                </span>
                {!oeuf.vendu ? (
                  <button
                    className="button-ghost"
                    disabled={pending}
                    onClick={() =>
                      void submitAction(
                        `/api/oeuf/${oeuf.id}/vendre`,
                        "PUT",
                        {},
                        "Oeuf marque comme vendu.",
                      )
                    }
                    type="button"
                  >
                    Marquer vendu
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
