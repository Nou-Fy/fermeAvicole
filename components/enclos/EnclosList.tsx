import { StatusBadge } from "@/components/ui";

export function EnclosList({ items }: { items: any[] }) {
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
        </div>
      ))}
    </div>
  );
}
