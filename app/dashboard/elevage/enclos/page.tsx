"use client";

import { useState, useMemo } from "react"; // Ajout de useMemo pour la performance
import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { PageHeader, SectionCard } from "@/components/ui";
import Link from "next/link";
import { EnclosCreateForm } from "@/components/enclos/EnclosCreateForm";
import { Modal } from "@/components/ui/Modal";
import { EnclosAssignForm } from "@/components/enclos/EnclosAssignForm";
import { EnclosClimateForm } from "@/components/enclos/EnclosClimateForm";
import { EnclosList } from "@/components/enclos/EnclosList";
import { EnclosAnimals } from "@/components/enclos/EnclosAnimals";

export default function ElevageEnclosPage() {
  const { data, loading, error, pending, submitAction } = useDashboard() as any;

  // 1. On étend le type de la modale pour inclure 'view'
  const [activeModal, setActiveModal] = useState<
    "assign" | "climate" | "view" | null
  >(null);
  const [selectedEnclosId, setSelectedEnclosId] = useState<string | null>(null);

  // 2. On récupère l'objet complet de l'enclos sélectionné pour afficher ses détails
  const selectedEnclos = useMemo(
    () => data?.enclos?.find((e: any) => e.id === selectedEnclosId),
    [data, selectedEnclosId],
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

  // 3. Mise à jour du handler pour accepter l'action "view"
  const handleAction = (id: string, type: "assign" | "climate" | "view") => {
    setSelectedEnclosId(id);
    setActiveModal(type);
  };

  const close = () => {
    setActiveModal(null);
    setSelectedEnclosId(null);
  };

  return (
    <div className="stack">
      <PageHeader title="Enclos" description="Gestion de l'espace physique.">
        <Link className="button-ghost" href="/dashboard/elevage/animaux">
          Aller aux animaux
        </Link>
      </PageHeader>

      <div className="dashboard-grid">
        <SectionCard title="Créer un enclos" hint="Ajouter une structure">
          <EnclosCreateForm
            data={data}
            pending={pending}
            submitAction={submitAction}
          />
        </SectionCard>

        <SectionCard title="Parc d'enclos" hint="Actions par enclos">
          <EnclosList items={data.enclos || []} onAction={handleAction} />
        </SectionCard>
      </div>

      {/* 4. Nouvelle Modal pour afficher les ANIMAUX */}
      <Modal
        isOpen={activeModal === "view"}
        onClose={close}
        title={`Animaux dans ${selectedEnclos?.nom || "l'enclos"}`}>
        <div className="stack">
          <EnclosAnimals animals={selectedEnclos?.animauxActuels} />
        </div>
      </Modal>

      {/* Modal Affectation */}
      <Modal
        isOpen={activeModal === "assign"}
        onClose={close}
        title="Affecter un animal">
        <EnclosAssignForm
          data={data}
          enclosId={selectedEnclosId}
          pending={pending}
          submitAction={async (url, method, body, msg) => {
            const ok = await submitAction(url, method, body, msg);
            if (ok) close();
            return !!ok;
          }}
        />
      </Modal>

      {/* Modal Climat */}
      <Modal
        isOpen={activeModal === "climate"}
        onClose={close}
        title="Mettre à jour le climat">
        <EnclosClimateForm
          data={data}
          enclosId={selectedEnclosId}
          pending={pending}
          submitAction={async (url, method, body, msg) => {
            const ok = await submitAction(url, method, body, msg);
            if (ok) close();
            return !!ok;
          }}
        />
      </Modal>
    </div>
  );
}
