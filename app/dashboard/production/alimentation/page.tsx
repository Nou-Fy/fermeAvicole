"use client";

import { useEffect, useState } from "react";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader, SectionCard } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default function ProductionAlimentationPage() {
  const { data, loading, pending, error, submitAction } = useDashboard();
  const [formuleForm, setFormuleForm] = useState({
    nom: "",
    description: "",
    ingredients: "",
    prix: "",
  });
  const [distributionForm, setDistributionForm] = useState({
    formuleId: "",
    quantite: "",
    notes: "",
  });

  useEffect(() => {
    if (!data || distributionForm.formuleId || !data.formules[0]) {
      return;
    }

    setDistributionForm((current) => ({
      ...current,
      formuleId: data.formules[0].id,
    }));
  }, [data, distributionForm.formuleId]);

  if (loading && !data) {
    return (
      <div className="section">
        <span className="helper">Chargement du module alimentation...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="alert alert-error">{error || "Donnees indisponibles."}</div>;
  }

  return (
    <div className="stack">
      <PageHeader
        title="Alimentation"
        description="Formules et distributions ont leur propre page pour mieux separer la logique de production."
      />

      <div className="dashboard-grid">
        <SectionCard title="Nouvelle formule">
          <form
            className="stack"
            onSubmit={async (event) => {
              event.preventDefault();
              const ok = await submitAction(
                "/api/alimentation/formule",
                "POST",
                {
                  nom: formuleForm.nom,
                  description: formuleForm.description,
                  ingredients: formuleForm.ingredients
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                  prix: Number(formuleForm.prix),
                },
                "Formule creee.",
              );

              if (ok) {
                setFormuleForm({
                  nom: "",
                  description: "",
                  ingredients: "",
                  prix: "",
                });
              }
            }}
          >
            <div className="form-grid">
              <div className="field">
                <label className="label">Nom de la formule</label>
                <input
                  className="input"
                  value={formuleForm.nom}
                  onChange={(event) =>
                    setFormuleForm((current) => ({
                      ...current,
                      nom: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="field">
                <label className="label">Prix</label>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  value={formuleForm.prix}
                  onChange={(event) =>
                    setFormuleForm((current) => ({
                      ...current,
                      prix: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="field field-full">
                <label className="label">Ingredients (separes par des virgules)</label>
                <input
                  className="input"
                  value={formuleForm.ingredients}
                  onChange={(event) =>
                    setFormuleForm((current) => ({
                      ...current,
                      ingredients: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="field field-full">
                <label className="label">Description</label>
                <textarea
                  className="textarea"
                  value={formuleForm.description}
                  onChange={(event) =>
                    setFormuleForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <button className="button" disabled={pending} type="submit">
              Ajouter la formule
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Nouvelle distribution">
          {data.formules.length === 0 ? (
            <EmptyState message="Ajoutez d'abord une formule." />
          ) : (
            <form
              className="stack"
              onSubmit={async (event) => {
                event.preventDefault();
                const ok = await submitAction(
                  "/api/alimentation/distribution",
                  "POST",
                  {
                    formuleId: distributionForm.formuleId,
                    quantite: Number(distributionForm.quantite),
                    notes: distributionForm.notes,
                  },
                  "Distribution ajoutee.",
                );

                if (ok) {
                  setDistributionForm((current) => ({
                    ...current,
                    quantite: "",
                    notes: "",
                  }));
                }
              }}
            >
              <div className="form-grid">
                <div className="field">
                  <label className="label">Formule</label>
                  <select
                    className="select"
                    value={distributionForm.formuleId}
                    onChange={(event) =>
                      setDistributionForm((current) => ({
                        ...current,
                        formuleId: event.target.value,
                      }))
                    }
                  >
                    {data.formules.map((formule) => (
                      <option key={formule.id} value={formule.id}>
                        {formule.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="label">Quantite</label>
                  <input
                    className="input"
                    type="number"
                    value={distributionForm.quantite}
                    onChange={(event) =>
                      setDistributionForm((current) => ({
                        ...current,
                        quantite: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="field field-full">
                  <label className="label">Notes</label>
                  <textarea
                    className="textarea"
                    value={distributionForm.notes}
                    onChange={(event) =>
                      setDistributionForm((current) => ({
                        ...current,
                        notes: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <button className="button-secondary" disabled={pending} type="submit">
                Enregistrer la distribution
              </button>
            </form>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Historique recent">
        {data.formules.length === 0 && data.distributions.length === 0 ? (
          <EmptyState message="Aucune donnee d'alimentation disponible." />
        ) : (
          <div className="list">
            {data.formules.map((formule) => (
              <div key={formule.id} className="list-item">
                <strong>{formule.nom}</strong>
                <span className="helper">{formule.ingredients.join(", ")}</span>
              </div>
            ))}
            {data.distributions.map((distribution) => (
              <div key={distribution.id} className="list-item">
                <strong>Distribution {distribution.quantite}</strong>
                <span className="helper">{formatDate(distribution.date)}</span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
