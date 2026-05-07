"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { EmptyState } from "@/components/dashboard/empty-state";
import { EnclosAssignForm } from "@/components/enclos/EnclosAssignForm";
import { EnclosClimateForm } from "@/components/enclos/EnclosClimateForm";
import { EnclosCreateForm } from "@/components/enclos/EnclosCreateForm";
import { PageHeader, SectionCard, StatusBadge } from "@/components/ui";
import Link from "next/link";

export default function ElevageEnclosPage() {
  const { data, loading, pending, error, submitAction } = useDashboard();

  // État pour gérer l'ouverture des modales comme dans Animaux
  const [openModals, setOpenModals] = useState({
    assign: false,
    climate: false,
  });

  // Fermer les modales avec la touche ESC (logique copiée d'Animaux)
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenModals({ assign: false, climate: false });
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const closeModal = (modal: "assign" | "climate") => {
    setOpenModals((prev) => ({ ...prev, [modal]: false }));
  };

  const handleBackdropClick = (
    e: React.MouseEvent,
    modal: "assign" | "climate",
  ) => {
    if (e.target === e.currentTarget) closeModal(modal);
  };

  if (loading && !data)
    return (
      <div className="section">
        <span className="helper">Chargement...</span>
      </div>
    );
  if (!data)
    return (
      <div className="alert alert-error">
        {error || "Données indisponibles."}
      </div>
    );

  const hasEnclos = data.enclos.length > 0;
  const hasAnimals = data.animals.length > 0;

  // Style commun pour le backdrop (identique à ton code Animaux)
  const backdropStyle: React.CSSProperties = {
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
    padding: "1rem",
  };

  return (
    <div className="stack">
      <PageHeader
        title="Enclos"
        description="Gestion de l'espace physique et conditions climatiques.">
        <Link className="button-ghost" href="/dashboard/elevage/animaux">
          Aller aux animaux
        </Link>
      </PageHeader>

      {/* Boutons pour ouvrir les modales */}
      <div
        className="dashboard-actions"
        style={{ display: "flex", gap: "1rem" }}>
        <button
          className="button"
          onClick={() => setOpenModals({ ...openModals, assign: true })}
          disabled={!hasEnclos || !hasAnimals}>
          Affecter un animal
        </button>
        <button
          className="button-ghost"
          onClick={() => setOpenModals({ ...openModals, climate: true })}
          disabled={!hasEnclos}>
          Mettre à jour le climat
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Section Statique : Création */}
        <SectionCard title="Créer un enclos" hint="Gestion de l'espace">
          <EnclosCreateForm
            data={data}
            pending={pending}
            submitAction={submitAction}
          />
        </SectionCard>

        {/* Section Statique : Liste des enclos */}
        <SectionCard title="Parc d'enclos" hint="Occupation actuelle">
          {!hasEnclos ? (
            <EmptyState message="Aucun enclos enregistré." />
          ) : (
            <EnclosList items={data.enclos} />
          )}
        </SectionCard>
      </div>

      {/* MODALE 1: Affecter un animal (Code en dur comme Animaux) */}
      {openModals.assign && (
        <div
          className="modal-backdrop"
          onClick={(e) => handleBackdropClick(e, "assign")}
          style={backdropStyle}>
          <div style={{ width: "100%", maxWidth: "500px" }}>
            <SectionCard title="Affecter un animal" hint="Mouvement tracé">
              <div className="stack">
                <EnclosAssignForm
                  data={data}
                  pending={pending}
                  submitAction={async (url, method, body, msg) => {
                    const ok = await submitAction(url, method, body, msg);
                    if (ok) closeModal("assign");
                    return ok;
                  }}
                />
                <button
                  className="button-ghost"
                  onClick={() => closeModal("assign")}>
                  Annuler
                </button>
              </div>
            </SectionCard>
          </div>
        </div>
      )}

      {/* MODALE 2: Conditions Climatiques (Code en dur comme Animaux) */}
      {openModals.climate && (
        <div
          className="modal-backdrop"
          onClick={(e) => handleBackdropClick(e, "climate")}
          style={backdropStyle}>
          <div style={{ width: "100%", maxWidth: "500px" }}>
            <SectionCard
              title="Conditions des enclos"
              hint="Mise à jour climat">
              <div className="stack">
                <EnclosClimateForm
                  data={data}
                  pending={pending}
                  submitAction={async (url, method, body, msg) => {
                    const ok = await submitAction(url, method, body, msg);
                    if (ok) closeModal("climate");
                    return ok;
                  }}
                />
                <button
                  className="button-ghost"
                  onClick={() => closeModal("climate")}>
                  Annuler
                </button>
              </div>
            </SectionCard>
          </div>
        </div>
      )}
    </div>
  );
}

function EnclosList({ items }: { items: any[] }) {
  return (
    <div className="list">
      {items.map((enclos) => (
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
            {enclos.type} · {enclos.localisation || "N/A"}
          </span>
          <span className="helper">
            Temp {enclos.temperature ?? "-"}° · Hum {enclos.humidite ?? "-"}%
          </span>
        </div>
      ))}
    </div>
  );
}
