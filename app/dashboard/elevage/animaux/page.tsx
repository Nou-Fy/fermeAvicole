"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader, SectionCard, StatusBadge } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default function ElevageAnimauxPage() {
  const { data, loading, pending, error, submitAction } = useDashboard();
  const [openModals, setOpenModals] = useState<
    Record<"create" | "update", boolean>
  >({
    create: false,
    update: false,
  });

  const [animalForm, setAnimalForm] = useState({
    numIdentif: "",
    race: "",
    sexe: "FEMELLE",
    dateNaissance: "",
    notes: "",
  });

  const [animalUpdateForm, setAnimalUpdateForm] = useState({
    animalId: "",
    poids: "",
    etat: "ACTIF",
    notes: "",
  });

  // Initialiser l'animal sélectionné quand les données arrivent
  useEffect(() => {
    if (!data?.animals[0] || animalUpdateForm.animalId) return;
    setAnimalUpdateForm((current) => ({
      ...current,
      animalId: data.animals[0].id,
    }));
  }, [data?.animals]);

  // Fermer modales avec ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenModals({ create: false, update: false });
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const toggleModal = (modal: "create" | "update") => {
    setOpenModals((prev) => ({
      ...prev,
      [modal]: !prev[modal],
    }));
  };

  const closeModal = (modal: "create" | "update") => {
    setOpenModals((prev) => ({
      ...prev,
      [modal]: false,
    }));
  };

  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement>,
    modal: "create" | "update",
  ) => {
    if (e.target === e.currentTarget) {
      closeModal(modal);
    }
  };

  if (loading && !data) {
    return (
      <div className="section">
        <span className="helper">Chargement du module animaux...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="alert alert-error">
        {error || "Donnees indisponibles."}
      </div>
    );
  }

  return (
    <div className="stack">
      <PageHeader
        title="Animaux"
        description="Chaque responsabilite liee aux animaux est isolee ici: creation, mise a jour et suivi.">
        <Link className="button-ghost" href="/dashboard/elevage/enclos">
          Aller aux enclos
        </Link>
      </PageHeader>

      {/* Boutons d'accès aux modales */}
      <div
        className="dashboard-actions"
        style={{ display: "flex", gap: "1rem" }}>
        <button className="button" onClick={() => toggleModal("create")}>
          Ajouter un animal
        </button>
        <button
          className="button"
          onClick={() => toggleModal("update")}
          disabled={data.animals.length === 0}>
          Mettre à jour un animal
        </button>
      </div>

      {/* MODALE 1: Créer un animal */}
      {openModals.create && (
        <div
          className="modal-backdrop"
          onClick={(e) => handleBackdropClick(e, "create")}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}>
          <SectionCard
            title="Ajouter un animal"
            hint="Creation d'un lot ou d'une nouvelle poule">
            <form
              className="stack"
              onSubmit={async (event) => {
                event.preventDefault();
                const ok = await submitAction(
                  "/api/animals",
                  "POST",
                  animalForm,
                  "Animal ajoute.",
                );

                if (ok) {
                  setAnimalForm({
                    numIdentif: "",
                    race: "",
                    sexe: "FEMELLE",
                    dateNaissance: "",
                    notes: "",
                  });
                  closeModal("create");
                }
              }}>
              <div className="form-grid">
                <div className="field">
                  <label className="label">Numero d&apos;identification</label>
                  <input
                    className="input"
                    value={animalForm.numIdentif}
                    onChange={(event) =>
                      setAnimalForm((current) => ({
                        ...current,
                        numIdentif: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="field">
                  <label className="label">Race</label>
                  <input
                    className="input"
                    value={animalForm.race}
                    onChange={(event) =>
                      setAnimalForm((current) => ({
                        ...current,
                        race: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="field">
                  <label className="label">Sexe</label>
                  <select
                    className="select"
                    value={animalForm.sexe}
                    onChange={(event) =>
                      setAnimalForm((current) => ({
                        ...current,
                        sexe: event.target.value,
                      }))
                    }>
                    <option value="FEMELLE">Femelle</option>
                    <option value="MALE">Male</option>
                  </select>
                </div>
                <div className="field">
                  <label className="label">Date de naissance</label>
                  <input
                    className="input"
                    type="date"
                    value={animalForm.dateNaissance}
                    onChange={(event) =>
                      setAnimalForm((current) => ({
                        ...current,
                        dateNaissance: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="field field-full">
                  <label className="label">Notes</label>
                  <textarea
                    className="textarea"
                    value={animalForm.notes}
                    onChange={(event) =>
                      setAnimalForm((current) => ({
                        ...current,
                        notes: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="button" disabled={pending} type="submit">
                  Enregistrer l&apos;animal
                </button>
                <button
                  className="button-ghost"
                  type="button"
                  onClick={() => closeModal("create")}>
                  Fermer
                </button>
              </div>
            </form>
          </SectionCard>
        </div>
      )}

      {/* MODALE 2: Mettre à jour un animal */}
      {openModals.update && (
        <div
          className="modal-backdrop"
          onClick={(e) => handleBackdropClick(e, "update")}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}>
          <SectionCard
            title="Mettre a jour un animal"
            hint="Poids, etat ou commentaire">
            {data.animals.length === 0 ? (
              <EmptyState message="Ajoutez d'abord un animal." />
            ) : (
              <form
                className="stack"
                onSubmit={(event) => {
                  event.preventDefault();
                  void submitAction(
                    `/api/animals/${animalUpdateForm.animalId}`,
                    "PUT",
                    {
                      poids: animalUpdateForm.poids
                        ? Number(animalUpdateForm.poids)
                        : undefined,
                      etat: animalUpdateForm.etat,
                      notes: animalUpdateForm.notes,
                    },
                    "Animal mis a jour.",
                  );
                }}>
                <div className="form-grid">
                  <div className="field">
                    <label className="label">Animal</label>
                    <select
                      className="select"
                      value={animalUpdateForm.animalId}
                      onChange={(event) =>
                        setAnimalUpdateForm((current) => ({
                          ...current,
                          animalId: event.target.value,
                        }))
                      }>
                      {data.animals.map((animal) => (
                        <option key={animal.id} value={animal.id}>
                          {animal.numIdentif} · {animal.race}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label className="label">Poids (kg)</label>
                    <input
                      className="input"
                      type="number"
                      step="0.1"
                      value={animalUpdateForm.poids}
                      onChange={(event) =>
                        setAnimalUpdateForm((current) => ({
                          ...current,
                          poids: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="field">
                    <label className="label">Etat</label>
                    <select
                      className="select"
                      value={animalUpdateForm.etat}
                      onChange={(event) =>
                        setAnimalUpdateForm((current) => ({
                          ...current,
                          etat: event.target.value,
                        }))
                      }>
                      {[
                        "ACTIF",
                        "POUSSIN",
                        "JEUNE",
                        "REPRODUCTRICE",
                        "EN_REPOS",
                        "RETRAITE",
                        "DECEDE",
                      ].map((etat) => (
                        <option key={etat} value={etat}>
                          {etat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field field-full">
                    <label className="label">Notes</label>
                    <textarea
                      className="textarea"
                      value={animalUpdateForm.notes}
                      onChange={(event) =>
                        setAnimalUpdateForm((current) => ({
                          ...current,
                          notes: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="button-secondary"
                    disabled={pending}
                    type="submit">
                    Sauvegarder
                  </button>
                  <button
                    className="button-ghost"
                    type="button"
                    onClick={() => closeModal("update")}>
                    Fermer
                  </button>
                </div>
              </form>
            )}
          </SectionCard>
        </div>
      )}

      {/* Section toujours visible: Liste des animaux */}
      <SectionCard
        title="Animaux enregistres"
        hint="Etat, age et actions rapides">
        {data.animals.length === 0 ? (
          <EmptyState message="Aucun animal pour le moment." />
        ) : (
          <div className="list">
            {data.animals.map((animal) => (
              <div key={animal.id} className="list-item">
                <div className="split">
                  <strong>
                    {animal.numIdentif} · {animal.race}
                  </strong>
                  <StatusBadge
                    label={animal.etat}
                    tone={animal.etat === "DECEDE" ? "danger" : "success"}
                  />
                </div>
                <span className="helper">
                  {animal.sexe} · {animal.ageMois} mois · etat calcule{" "}
                  {animal.etatParAge}
                </span>
                <span className="helper">
                  Ne le {formatDate(animal.dateNaissance)}
                </span>
                {animal.etat !== "DECEDE" ? (
                  <button
                    className="button-ghost"
                    disabled={pending}
                    onClick={() =>
                      void submitAction(
                        `/api/animals/${animal.id}`,
                        "DELETE",
                        undefined,
                        "Animal archive comme decede.",
                      )
                    }
                    type="button">
                    Marquer decede
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
