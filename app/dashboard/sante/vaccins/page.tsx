"use client";

import { useEffect, useState } from "react";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader, SectionCard } from "@/components/ui";

export default function SanteVaccinsPage() {
  const { data, loading, pending, error, submitAction } = useDashboard();
  const [vaccinForm, setVaccinForm] = useState({
    animalId: "",
    nomTraitement: "",
    configVaccinId: "",
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    if (!vaccinForm.animalId && data.animals[0]) {
      setVaccinForm((current) => ({
        ...current,
        animalId: data.animals[0].id,
      }));
    }
    if (!vaccinForm.configVaccinId && data.config.vaccins[0]) {
      setVaccinForm((current) => ({
        ...current,
        configVaccinId: data.config.vaccins[0].id,
      }));
    }
  }, [data, vaccinForm.animalId, vaccinForm.configVaccinId]);

  if (loading && !data) {
    return (
      <div className="section">
        <span className="helper">Chargement du module vaccins...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="alert alert-error">{error || "Donnees indisponibles."}</div>;
  }

  return (
    <div className="stack">
      <PageHeader
        title="Vaccins"
        description="Page dediee a l'enregistrement des vaccinations et a la creation automatique des rappels."
      />

      <SectionCard title="Ajouter un vaccin" hint="Avec creation automatique du rappel">
              {data.animals.length === 0 || data.config.vaccins.length === 0 ? (
                <EmptyState message="Il faut des animaux et des vaccins de reference." />
              ) : (
                <form
                  className="stack"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const ok = await submitAction(
                      "/api/sante/vaccin",
                      "POST",
                      vaccinForm,
                      "Vaccin ajoute.",
                    );

                    if (ok) {
                      setVaccinForm((current) => ({
                        ...current,
                        nomTraitement: "",
                      }));
                    }
                  }}
                >
                  <div className="form-grid">
                    <div className="field">
                      <label className="label">Animal</label>
                      <select
                        className="select"
                        value={vaccinForm.animalId}
                        onChange={(event) =>
                          setVaccinForm((current) => ({
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
                      <label className="label">Vaccin</label>
                      <select
                        className="select"
                        value={vaccinForm.configVaccinId}
                        onChange={(event) =>
                          setVaccinForm((current) => ({
                            ...current,
                            configVaccinId: event.target.value,
                          }))
                        }
                      >
                        {data.config.vaccins.map((vaccin) => (
                          <option key={vaccin.id} value={vaccin.id}>
                            {vaccin.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field field-full">
                      <label className="label">Nom du traitement</label>
                      <input
                        className="input"
                        value={vaccinForm.nomTraitement}
                        onChange={(event) =>
                          setVaccinForm((current) => ({
                            ...current,
                            nomTraitement: event.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>
                  <button className="button" disabled={pending} type="submit">
                    Ajouter le vaccin
                  </button>
                </form>
              )}
      </SectionCard>
    </div>
  );
}
