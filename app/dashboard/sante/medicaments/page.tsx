"use client";

import { useEffect, useState } from "react";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader, SectionCard } from "@/components/ui";

export default function SanteMedicamentsPage() {
  const { data, loading, pending, error, submitAction } = useDashboard();
  const [medicamentForm, setMedicamentForm] = useState({
    animalId: "",
    nomTraitement: "",
    configMedicamentId: "",
    duree_jours: "",
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    if (!medicamentForm.animalId && data.animals[0]) {
      setMedicamentForm((current) => ({
        ...current,
        animalId: data.animals[0].id,
      }));
    }
    if (!medicamentForm.configMedicamentId && data.config.medicaments[0]) {
      setMedicamentForm((current) => ({
        ...current,
        configMedicamentId: data.config.medicaments[0].id,
      }));
    }
  }, [data, medicamentForm.animalId, medicamentForm.configMedicamentId]);

  if (loading && !data) {
    return (
      <div className="section">
        <span className="helper">Chargement du module medicaments...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="alert alert-error">{error || "Donnees indisponibles."}</div>;
  }

  return (
    <div className="stack">
      <PageHeader
        title="Medicaments"
        description="Formulaire specialise pour les traitements et leur duree de rappel."
      />

      <SectionCard title="Ajouter un medicament" hint="Suivi des traitements et rappels">
              {data.animals.length === 0 || data.config.medicaments.length === 0 ? (
                <EmptyState message="Il faut des animaux et des medicaments de reference." />
              ) : (
                <form
                  className="stack"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const ok = await submitAction(
                      "/api/sante/medicament",
                      "POST",
                      {
                        ...medicamentForm,
                        duree_jours: medicamentForm.duree_jours
                          ? Number(medicamentForm.duree_jours)
                          : undefined,
                      },
                      "Medicament enregistre.",
                    );

                    if (ok) {
                      setMedicamentForm((current) => ({
                        ...current,
                        nomTraitement: "",
                        duree_jours: "",
                      }));
                    }
                  }}
                >
                  <div className="form-grid">
                    <div className="field">
                      <label className="label">Animal</label>
                      <select
                        className="select"
                        value={medicamentForm.animalId}
                        onChange={(event) =>
                          setMedicamentForm((current) => ({
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
                      <label className="label">Medicament</label>
                      <select
                        className="select"
                        value={medicamentForm.configMedicamentId}
                        onChange={(event) =>
                          setMedicamentForm((current) => ({
                            ...current,
                            configMedicamentId: event.target.value,
                          }))
                        }
                      >
                        {data.config.medicaments.map((medicament) => (
                          <option key={medicament.id} value={medicament.id}>
                            {medicament.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label className="label">Duree en jours</label>
                      <input
                        className="input"
                        type="number"
                        value={medicamentForm.duree_jours}
                        onChange={(event) =>
                          setMedicamentForm((current) => ({
                            ...current,
                            duree_jours: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="field field-full">
                      <label className="label">Nom du traitement</label>
                      <input
                        className="input"
                        value={medicamentForm.nomTraitement}
                        onChange={(event) =>
                          setMedicamentForm((current) => ({
                            ...current,
                            nomTraitement: event.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>
                  <button className="button-secondary" disabled={pending} type="submit">
                    Ajouter le traitement
                  </button>
                </form>
              )}
      </SectionCard>
    </div>
  );
}
