"use client";

import { useEffect, useState } from "react";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader, SectionCard, StatusBadge } from "@/components/ui";

export default function ElevageEnclosPage() {
  const { data, loading, pending, error, submitAction } = useDashboard();
  const [enclosForm, setEnclosForm] = useState({
    nom: "",
    type: "",
    capaciteMax: "",
    localisation: "",
  });
  const [assignForm, setAssignForm] = useState({
    enclosId: "",
    animalNum: "",
    notes: "",
  });
  const [climateForm, setClimateForm] = useState({
    enclosId: "",
    temperature: "",
    humidite: "",
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    if (!enclosForm.type && data.config.enclosTypes[0]) {
      setEnclosForm((current) => ({
        ...current,
        type: data.config.enclosTypes[0].nom,
      }));
    }
    if (!assignForm.enclosId && data.enclos[0]) {
      setAssignForm((current) => ({
        ...current,
        enclosId: data.enclos[0].id,
      }));
    }
    if (!assignForm.animalNum && data.animals[0]) {
      setAssignForm((current) => ({
        ...current,
        animalNum: data.animals[0].numIdentif,
      }));
    }
    if (!climateForm.enclosId && data.enclos[0]) {
      setClimateForm((current) => ({
        ...current,
        enclosId: data.enclos[0].id,
      }));
    }
  }, [assignForm.animalNum, assignForm.enclosId, climateForm.enclosId, data, enclosForm.type]);

  if (loading && !data) {
    return (
      <div className="section">
        <span className="helper">Chargement du module enclos...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="alert alert-error">{error || "Donnees indisponibles."}</div>;
  }

  return (
    <div className="stack">
      <PageHeader
        title="Enclos"
        description="Cette page ne gere que l'espace physique: creation d'enclos, affectation et conditions climatiques."
      />

      <div className="dashboard-grid">
        <SectionCard title="Creer un enclos" hint="Gestion de l'espace de la ferme">
                <form
                  className="stack"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const ok = await submitAction(
                      "/api/enclos",
                      "POST",
                      {
                        ...enclosForm,
                        capaciteMax: Number(enclosForm.capaciteMax),
                      },
                      "Enclos cree.",
                    );

                    if (ok) {
                      setEnclosForm((current) => ({
                        ...current,
                        nom: "",
                        capaciteMax: "",
                        localisation: "",
                      }));
                    }
                  }}
                >
                  <div className="form-grid">
                    <div className="field">
                      <label className="label">Nom</label>
                      <input
                        className="input"
                        value={enclosForm.nom}
                        onChange={(event) =>
                          setEnclosForm((current) => ({
                            ...current,
                            nom: event.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="field">
                      <label className="label">Type</label>
                      <select
                        className="select"
                        value={enclosForm.type}
                        onChange={(event) =>
                          setEnclosForm((current) => ({
                            ...current,
                            type: event.target.value,
                          }))
                        }
                      >
                        {data.config.enclosTypes.map((type) => (
                          <option key={type.id} value={type.nom}>
                            {type.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label className="label">Capacite max</label>
                      <input
                        className="input"
                        type="number"
                        value={enclosForm.capaciteMax}
                        onChange={(event) =>
                          setEnclosForm((current) => ({
                            ...current,
                            capaciteMax: event.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="field">
                      <label className="label">Localisation</label>
                      <input
                        className="input"
                        value={enclosForm.localisation}
                        onChange={(event) =>
                          setEnclosForm((current) => ({
                            ...current,
                            localisation: event.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <button className="button" disabled={pending} type="submit">
                    Creer l&apos;enclos
                  </button>
                </form>
        </SectionCard>

        <SectionCard
          title="Affecter un animal"
          hint="Chaque affectation devient un mouvement trace"
        >
                {data.enclos.length === 0 || data.animals.length === 0 ? (
                  <EmptyState message="Il faut au moins un enclos et un animal." />
                ) : (
                  <form
                    className="stack"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void submitAction(
                        `/api/enclos/${assignForm.enclosId}/animal`,
                        "POST",
                        assignForm,
                        "Animal affecte a l'enclos.",
                      );
                    }}
                  >
                    <div className="form-grid">
                      <div className="field">
                        <label className="label">Enclos</label>
                        <select
                          className="select"
                          value={assignForm.enclosId}
                          onChange={(event) =>
                            setAssignForm((current) => ({
                              ...current,
                              enclosId: event.target.value,
                            }))
                          }
                        >
                          {data.enclos.map((enclos) => (
                            <option key={enclos.id} value={enclos.id}>
                              {enclos.nom}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="field">
                        <label className="label">Animal</label>
                        <select
                          className="select"
                          value={assignForm.animalNum}
                          onChange={(event) =>
                            setAssignForm((current) => ({
                              ...current,
                              animalNum: event.target.value,
                            }))
                          }
                        >
                          {data.animals.map((animal) => (
                            <option key={animal.id} value={animal.numIdentif}>
                              {animal.numIdentif}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button className="button-ghost" disabled={pending} type="submit">
                      Affecter l&apos;animal
                    </button>
                  </form>
                )}
        </SectionCard>
      </div>

      <SectionCard title="Conditions des enclos" hint="Temperature et humidite">
              {data.enclos.length === 0 ? (
                <EmptyState message="Aucun enclos a monitorer." />
              ) : (
                <form
                  className="stack"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void submitAction(
                      `/api/enclos/${climateForm.enclosId}/temperature`,
                      "PUT",
                      {
                        temperature: climateForm.temperature
                          ? Number(climateForm.temperature)
                          : undefined,
                        humidite: climateForm.humidite
                          ? Number(climateForm.humidite)
                          : undefined,
                      },
                      "Conditions de l'enclos mises a jour.",
                    );
                  }}
                >
                  <div className="form-grid">
                    <div className="field">
                      <label className="label">Enclos</label>
                      <select
                        className="select"
                        value={climateForm.enclosId}
                        onChange={(event) =>
                          setClimateForm((current) => ({
                            ...current,
                            enclosId: event.target.value,
                          }))
                        }
                      >
                        {data.enclos.map((enclos) => (
                          <option key={enclos.id} value={enclos.id}>
                            {enclos.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label className="label">Temperature</label>
                      <input
                        className="input"
                        type="number"
                        step="0.1"
                        value={climateForm.temperature}
                        onChange={(event) =>
                          setClimateForm((current) => ({
                            ...current,
                            temperature: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="field">
                      <label className="label">Humidite</label>
                      <input
                        className="input"
                        type="number"
                        step="0.1"
                        value={climateForm.humidite}
                        onChange={(event) =>
                          setClimateForm((current) => ({
                            ...current,
                            humidite: event.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <button className="button-secondary" disabled={pending} type="submit">
                    Mettre a jour le climat
                  </button>
                </form>
              )}
      </SectionCard>

      <SectionCard title="Parc d'enclos" hint="Occupation et conditions courantes">
              {data.enclos.length === 0 ? (
                <EmptyState message="Aucun enclos enregistre." />
              ) : (
                <div className="list">
                  {data.enclos.map((enclos) => (
                    <div key={enclos.id} className="list-item">
                      <div className="split">
                        <strong>{enclos.nom}</strong>
                        <StatusBadge
                          label={`${enclos.animauxActuels.length}/${enclos.capaciteMax}`}
                          tone={
                            enclos.animauxActuels.length > enclos.capaciteMax
                              ? "danger"
                              : "success"
                          }
                        />
                      </div>
                      <span className="helper">
                        {enclos.type} · {enclos.localisation || "Localisation non renseignee"}
                      </span>
                      <span className="helper">
                        Temperature {enclos.temperature ?? "-"} · Humidite {enclos.humidite ?? "-"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
      </SectionCard>
    </div>
  );
}
