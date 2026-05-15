"use client";

import { useState, useCallback } from "react";
import { Modal } from "../ui/Modal";
import { StatusBadge } from "@/components/ui";

interface Enclos {
  id: string;
  nom: string;
  type: string;
  capaciteMax: number;
  animauxActuels: any[];
  localisation?: string;
}

interface EnclosListProps {
  items: Enclos[];
  onAction: (enclosId: string, type: "assign" | "climate") => void;
  onDelete?: () => void; // ✅ Callback pour rafraîchir
}

export function EnclosList({ items, onAction, onDelete }: EnclosListProps) {
  const [enclosToDelete, setEnclosToDelete] = useState<Enclos | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localItems, setLocalItems] = useState<Enclos[]>(items);

  const deleteEnclosure = async (enclosureId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/enclos/${enclosureId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const { error, code } = await response.json();

        if (code === "ENCLOSURE_NOT_EMPTY") {
          alert(`Impossible: ${error}`);
        } else if (code === "FORBIDDEN") {
          alert("Vous n'avez pas la permission de supprimer cet enclos");
        } else if (code === "ENCLOSURE_NOT_FOUND") {
          alert("Cet enclos n'existe pas");
        } else {
          alert(error || "Erreur lors de la suppression");
        }
        return;
      }

      // ✅ SUPPRIME LOCALEMENT DE LA LISTE
      setLocalItems((prev) => prev.filter((e) => e.id !== enclosureId));
      setEnclosToDelete(null);

      // ✅ APPELLE LE CALLBACK SI PRÉSENT
      onDelete?.();
    } catch (error) {
      console.error("Network error:", error);
      alert("Erreur réseau");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (enclos: Enclos) => {
    setEnclosToDelete(enclos);
  };

  const confirmDelete = () => {
    if (!enclosToDelete) return;
    deleteEnclosure(enclosToDelete.id);
  };

  return (
    <div className="list">
      {localItems.length === 0 && (
        <div className="section">
          <span className="helper">Aucun enclos créé.</span>
        </div>
      )}

      {localItems.map((enclos) => (
        <div
          key={enclos.id}
          className="list-item"
          style={{ flexDirection: "column", alignItems: "stretch" }}>
          <div className="split">
            <div className="stack-tiny">
              <p className="text-foreground">
                <strong>{enclos.nom}</strong> pour les{" "}
                <strong>{enclos.type}</strong> est placé à :{" "}
                <span className="text-muted-foreground">
                  {enclos.localisation || "N/A"}
                </span>
              </p>
            </div>

            <StatusBadge
              label={`${enclos.animauxActuels?.length || 0}/${enclos.capaciteMax}`}
              tone={
                (enclos.animauxActuels?.length || 0) >= enclos.capaciteMax
                  ? "danger"
                  : "success"
              }
            />
          </div>

          <div
            className="dashboard-actions"
            style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <button
              className="button-ghost button-small"
              onClick={() => onAction(enclos.id, "assign")}
              disabled={
                (enclos.animauxActuels?.length || 0) >= enclos.capaciteMax
              }>
              Affecter
            </button>
            <button
              className="button-ghost button-small"
              onClick={() => onAction(enclos.id, "climate")}>
              Climat
            </button>
            <button
              onClick={() => openDeleteModal(enclos)}
              className="button-ghost button-small text-red-600 hover:text-red-700"
              disabled={isDeleting}>
              Supprimer
            </button>
          </div>
        </div>
      ))}

      {/* Modal */}
      <Modal
        isOpen={enclosToDelete !== null}
        onClose={() => setEnclosToDelete(null)}
        title="Supprimer l'enclos"
        hint="Action irréversible">
        <div className="stack">
          <p>
            Êtes-vous sûr de vouloir supprimer l&apos;enclos{" "}
            <strong>&ldquo;{enclosToDelete?.nom}&rdquo;</strong> ?
          </p>
          <p className="text-sm text-red-600">
            Cette action est définitive et ne peut pas être annulée.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
              marginTop: "1.5rem",
            }}>
            <button
              className="button-ghost button-small"
              onClick={confirmDelete}
              disabled={isDeleting}>
              {isDeleting ? "Suppression en cours..." : "Oui, supprimer"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
