"use client";

import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { StatusBadge } from "@/components/ui";
import { EnclosDelete } from "./EnclosDelete";

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
  // ✅ Ajout du type "view" ici
  onAction: (enclosId: string, type: "assign" | "climate" | "view") => void;
  onDelete?: () => void;
}

export function EnclosList({ items, onAction, onDelete }: EnclosListProps) {
  const [enclosToDelete, setEnclosToDelete] = useState<Enclos | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ✅ On synchronise localItems avec les props "items" pour que la liste se mette à jour
  const [localItems, setLocalItems] = useState<Enclos[]>(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const deleteEnclosure = async (enclosureId: string) => {
    try {
      const response = await fetch(`/api/enclos/${enclosureId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        const { error, code } = data;

        if (code === "ENCLOSURE_NOT_EMPTY") {
          alert(`Impossible: ${error}`);
        } else if (code === "FORBIDDEN") {
          alert("Vous n'avez pas la permission de supprimer cet enclos");
        } else {
          alert(error || "Erreur lors de la suppression");
        }
        return;
      }

      setLocalItems((prev) => prev.filter((e) => e.id !== enclosureId));
      setEnclosToDelete(null);
      onDelete?.();
    } catch (error) {
      alert("Erreur réseau");
    }
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
                <strong>{enclos.nom}</strong> ({enclos.type})
                <br />
                <span className="text-muted-foreground text-sm">
                  Localisation : {enclos.localisation || "N/A"}
                </span>
              </p>
            </div>

            <div className="list-item">
              <StatusBadge
                label={`${enclos.animauxActuels?.length || 0}/${enclos.capaciteMax}`}
                tone={
                  (enclos.animauxActuels?.length || 0) >= enclos.capaciteMax
                    ? "danger"
                    : "success"
                }
              />
            </div>
          </div>

          <div
            className="dashboard-actions"
            style={{
              display: "flex",
              gap: "0.5rem",
              marginTop: "0.75rem",
              flexWrap: "wrap",
            }}>
            <button
              className="button-ghost button-small"
              onClick={() => onAction(enclos.id, "view")}>
              Voir animaux ({enclos.animauxActuels?.length || 0})
            </button>

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
              onClick={() => setEnclosToDelete(enclos)}
              className="button-ghost button-small text-red-600"
              disabled={isDeleting}>
              Supprimer
            </button>
          </div>
        </div>
      ))}

      {/* Modal de suppression */}
      <EnclosDelete
        enclos={enclosToDelete}
        isOpen={enclosToDelete !== null}
        onClose={() => setEnclosToDelete(null)}
        onConfirm={deleteEnclosure}
      />
    </div>
  );
}
