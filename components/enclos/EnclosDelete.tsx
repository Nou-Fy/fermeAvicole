"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface Enclos {
  id: string;
  nom: string;
}

interface EnclosDeleteProps {
  enclos: Enclos | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (enclosId: string) => Promise<void>;
}

export function EnclosDelete({
  enclos,
  isOpen,
  onClose,
  onConfirm,
}: EnclosDeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!enclos) return;
    setIsDeleting(true);
    try {
      await onConfirm(enclos.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Supprimer l'enclos"
      hint="Action irréversible">
      <div className="stack">
        <p>
          Êtes-vous sûr de vouloir supprimer <strong>{enclos?.nom}</strong> ?
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            marginTop: "1rem",
          }}>
          <button
            className="button-ghost"
            style={{
              backgroundColor: "#fee2e2",
              color: "#dc2626",
            }}
            onClick={handleDelete}
            disabled={isDeleting}>
            {isDeleting ? "..." : "Confirmer"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
