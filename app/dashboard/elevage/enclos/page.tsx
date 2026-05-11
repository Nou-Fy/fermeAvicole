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
  const { data, loading, error, pending, submitAction } = useDashboard() as any;
  const [activeModal, setActiveModal] = useState<"assign" | "climate" | null>(
    null,
  );
  const [selectedEnclosId, setSelectedEnclosId] = useState<string | null>(null);

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

  const handleAction = (id: string, type: "assign" | "climate") => {
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

      {/* Modal Affectation - L'enclos est "verrouillé" par l'ID passé en prop */}
      <Modal
        isOpen={activeModal === "assign"}
        onClose={close}
        title="Affecter un animal">
        <EnclosAssignForm
          data={data}
          enclosId={selectedEnclosId} // <-- On passe l'enclos choisi
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
          enclosId={selectedEnclosId} // <-- On passe l'enclos choisi
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
