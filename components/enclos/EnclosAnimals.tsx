"use client";

interface Animal {
  id: string;
  animalNum: string;
  dateEntree: string;
  notes?: string | null;
}

interface EnclosAnimalsProps {
  animals: Animal[] | undefined;
}

export function EnclosAnimals({ animals }: EnclosAnimalsProps) {
  if (!animals?.length) {
    return (
      <p
        className="helper text-center"
        style={{ padding: "2rem 1rem", color: "var(--muted-foreground)" }}>
        Aucun animal dans cet enclos.
      </p>
    );
  }

  return (
    <div className="stack" style={{ gap: "0.75rem" }}>
      {animals.map((assignment: Animal) => (
        <div
          key={assignment.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            backgroundColor: "var(--muted)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--accent)";
            e.currentTarget.style.transform = "translateX(4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--muted)";
            e.currentTarget.style.transform = "translateX(0)";
          }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: "0 0 0.5rem 0", fontWeight: "600" }}>
              Animal #{assignment.animalNum}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.875rem",
                color: "var(--muted-foreground)",
              }}>
              Entré le{" "}
              {new Date(assignment.dateEntree).toLocaleDateString("fr-FR")}
            </p>
            {assignment.notes && (
              <p
                style={{
                  margin: "0.5rem 0 0 0",
                  fontSize: "0.813rem",
                  fontStyle: "italic",
                  color: "var(--muted-foreground)",
                }}>
                {assignment.notes}
              </p>
            )}
          </div>
          <div
            style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "50%",
              backgroundColor: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "0.875rem",
            }}>
            ✓
          </div>
        </div>
      ))}
    </div>
  );
}