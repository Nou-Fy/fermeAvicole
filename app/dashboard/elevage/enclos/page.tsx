// src/app/dashboard/elevage/enclos/page.tsx
"use client";

import { useState } from "react";
import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { PageHeader, SectionCard } from "@/components/ui";
import Link from "next/link";
import { EnclosCreateForm } from "@/components/enclos/EnclosCreateForm";
import { Modal } from "@/components/ui/Modal";
import { EnclosAssignForm } from "@/components/enclos/EnclosAssignForm";
import { EnclosClimateForm } from "@/components/enclos/EnclosClimateForm";
import { EnclosList } from "@/components/enclos/EnclosList";

export default function ElevageEnclosPage() {
  const { data, loading, error, pending, submitAction } = useDashboard();
  const [activeModal, setActiveModal] = useState<"assign" | "climate" | null>(
    null,
  );

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
  const close = () => setActiveModal(null);

  return (
    <div className="stack">
      <PageHeader title="Enclos" description="Gestion de l'espace physique.">
        <Link className="button-ghost" href="/dashboard/elevage/animaux">
          Aller aux animaux
        </Link>
      </PageHeader>

      <div
        className="dashboard-actions"
        style={{ display: "flex", gap: "1rem" }}>
        <button
          className="button"
          onClick={() => setActiveModal("assign")}
          disabled={!hasEnclos || data.animals.length === 0}>
          Affecter un animal
        </button>
        <button
          className="button-ghost"
          onClick={() => setActiveModal("climate")}
          disabled={!hasEnclos}>
          Mettre à jour le climat
        </button>
      </div>

      <div className="dashboard-grid">
        <SectionCard title="Créer un enclos" hint="Gestion de l'espace">
          <EnclosCreateForm
            data={data}
            pending={pending}
            submitAction={submitAction}
          />
        </SectionCard>

        <SectionCard title="Parc d'enclos" hint="Occupation actuelle">
          <EnclosList items={data.enclos} />
        </SectionCard>
      </div>

      <Modal
        isOpen={activeModal === "assign"}
        onClose={close}
        title="Affecter un animal">
        <EnclosAssignForm
          data={data}
          pending={pending}
          submitAction={async (url, method, body, msg) => {
            const ok = await submitAction(url, method, body, msg);
            if (ok) close(); // <-- On utilise 'close' ici
            return !!ok;
          }}
        />
      </Modal>

      <Modal
        isOpen={activeModal === "climate"}
        onClose={close}
        title="Conditions des enclos">
        <EnclosClimateForm
          data={data}
          pending={pending}
          submitAction={async (url, method, body, msg) => {
            const ok = await submitAction(url, method, body, msg);
            if (ok) close(); // <-- Et ici aussi
            return !!ok;
          }}
        />
      </Modal>
    </div>
  );
}
