"use client";

import { useEffect, useState } from "react";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader, SectionCard } from "@/components/ui";

export default function ProductionCouvaisonPage() {
  const { data, loading, pending, error, submitAction } = useDashboard();
  const [couvaisonForm, setCouvaisonForm] = useState({
    animalId: "",
    nombreOeufs: "",
    notes: "",
  });
  const [finishCouvaisonForm, setFinishCouvaisonForm] = useState({
    couvaisonId: "",
    nombrePoussins: "",
    note: "",
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    if (!couvaisonForm.animalId && data.animals[0]) {
      setCouvaisonForm((current) => ({
        ...current,
        animalId: data.animals[0].id,
      }));
    }
    if (!finishCouvaisonForm.couvaisonId && data.couvaisons[0]) {
      setFinishCouvaisonForm((current) => ({
        ...current,
        couvaisonId: data.couvaisons[0].id,
      }));
    }
  }, [couvaisonForm.animalId, data, finishCouvaisonForm.couvaisonId]);

  if (loading && !data) {
    return (
      <div className="section">
        <span className="helper">Chargement du module couvaison...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="alert alert-error">{error || "Donnees indisponibles."}</div>;
  }

  return (
    <div className="stack">
      <PageHeader
        title="Couvaison"
        description="Page dediee a l'ouverture et a la cloture des lots en incubation."
      />

      <div className="dashboard-grid">
        <SectionCard title="Demarrer une couvaison">
          {data.animals.length === 0 ? (
            <EmptyState message="Ajoutez d'abord des animaux." />
          ) : (
            <form
              className="stack"
              onSubmit={async (event) => {
                event.preventDefault();
                const ok = await submitAction(
                  "/api/couvaison",
                  "POST",
                  {
                    ...couvaisonForm,
                    nombreOeufs: Number(couvaisonForm.nombreOeufs),
                  },
                  "Couvaison lancee.",
                );

                if (ok) {
                  setCouvaisonForm((current) => ({
                    ...current,
                    nombreOeufs: "",
                    notes: "",
                  }));
                }
              }}
            >
              <div className="form-grid">
                <div className="field">
                  <label className="label">Animal</label>
                  <select
                    className="select"
                    value={couvaisonForm.animalId}
                    onChange={(event) =>
                      setCouvaisonForm((current) => ({
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
                  <label className="label">Nombre d&apos;oeufs</label>
                  <input
                    className="input"
                    type="number"
                    value={couvaisonForm.nombreOeufs}
                    onChange={(event) =>
                      setCouvaisonForm((current) => ({
                        ...current,
                        nombreOeufs: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="field field-full">
                  <label className="label">Notes</label>
                  <textarea
                    className="textarea"
                    value={couvaisonForm.notes}
                    onChange={(event) =>
                      setCouvaisonForm((current) => ({
                        ...current,
                        notes: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <button className="button" disabled={pending} type="submit">
                Demarrer
              </button>
            </form>
          )}
        </SectionCard>

        <SectionCard title="Finaliser une couvaison">
          {data.couvaisons.length === 0 ? (
            <EmptyState message="Aucune couvaison en cours ou archivee." />
          ) : (
            <form
              className="stack"
              onSubmit={async (event) => {
                event.preventDefault();
                const ok = await submitAction(
                  `/api/couvaison/${finishCouvaisonForm.couvaisonId}/terminer`,
                  "PUT",
                  {
                    nombrePoussins: Number(finishCouvaisonForm.nombrePoussins),
                    note: finishCouvaisonForm.note || undefined,
                  },
                  "Couvaison cloturee.",
                );

                if (ok) {
                  setFinishCouvaisonForm((current) => ({
                    ...current,
                    nombrePoussins: "",
                    note: "",
                  }));
                }
              }}
            >
              <div className="form-grid">
                <div className="field">
                  <label className="label">Couvaison</label>
                  <select
                    className="select"
                    value={finishCouvaisonForm.couvaisonId}
                    onChange={(event) =>
                      setFinishCouvaisonForm((current) => ({
                        ...current,
                        couvaisonId: event.target.value,
                      }))
                    }
                  >
                    {data.couvaisons.map((couvaison) => (
                      <option key={couvaison.id} value={couvaison.id}>
                        {couvaison.animalId} · {couvaison.nombreOeufs} oeufs
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="label">Nombre de poussins</label>
                  <input
                    className="input"
                    type="number"
                    value={finishCouvaisonForm.nombrePoussins}
                    onChange={(event) =>
                      setFinishCouvaisonForm((current) => ({
                        ...current,
                        nombrePoussins: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="field">
                  <label className="label">Note manuelle</label>
                  <select
                    className="select"
                    value={finishCouvaisonForm.note}
                    onChange={(event) =>
                      setFinishCouvaisonForm((current) => ({
                        ...current,
                        note: event.target.value,
                      }))
                    }
                  >
                    <option value="">Automatique</option>
                    {["A", "B", "C", "D", "E"].map((note) => (
                      <option key={note} value={note}>
                        {note}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button className="button-secondary" disabled={pending} type="submit">
                Finaliser la couvaison
              </button>
            </form>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Historique recent">
        {data.couvaisons.length === 0 ? (
          <EmptyState message="Aucune donnee de couvaison disponible." />
        ) : (
          <div className="list">
            {data.couvaisons.map((couvaison) => (
              <div key={couvaison.id} className="list-item">
                <strong>{couvaison.noteDescription}</strong>
                <span className="helper">
                  {couvaison.nombrePoussins}/{couvaison.nombreOeufs} poussins · score{" "}
                  {couvaison.performanceScore.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
