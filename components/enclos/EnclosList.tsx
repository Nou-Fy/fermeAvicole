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
}

export function EnclosList({ items, onAction }: EnclosListProps) {
  return (
    <div className="list">
      {items.length === 0 && (
        <div className="section">
          <span className="helper">Aucun enclos créé.</span>
        </div>
      )}

      {items.map((enclos) => (
        <div
          key={enclos.id}
          className="list-item"
          style={{ flexDirection: "column", alignItems: "stretch" }}>
          <div className="split">
            <div className="stack-tiny">
              <strong>{enclos.nom}</strong>
              <span className="helper">
                {enclos.type} · {enclos.localisation || "N/A"}
              </span>
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
          </div>
        </div>
      ))}
    </div>
  );
}
