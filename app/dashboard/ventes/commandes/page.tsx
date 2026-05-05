"use client";

import { useEffect, useState } from "react";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader, SectionCard, StatusBadge } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function VentesCommandesPage() {
  const { data, loading, pending, error, submitAction } = useDashboard();
  const [commandeForm, setCommandeForm] = useState({
    clientId: "",
    description: "",
    quantite: "",
    prixUnitaire: "",
    notes: "",
  });

  useEffect(() => {
    if (!data || commandeForm.clientId || !data.clients[0]) {
      return;
    }

    setCommandeForm((current) => ({
      ...current,
      clientId: data.clients[0].id,
    }));
  }, [commandeForm.clientId, data]);

  if (loading && !data) {
    return (
      <div className="section">
        <span className="helper">Chargement du module commandes...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="alert alert-error">{error || "Donnees indisponibles."}</div>;
  }

  return (
    <div className="stack">
      <PageHeader
        title="Commandes"
        description="Page dediee a la creation et a la progression des commandes."
      />

      <SectionCard title="Creer une commande" hint="Une ligne d'article pour demarrer vite">
        {data.clients.length === 0 ? (
          <EmptyState message="Ajoutez d'abord un client." />
        ) : (
          <form
            className="stack"
            onSubmit={async (event) => {
              event.preventDefault();
              const quantite = Number(commandeForm.quantite);
              const prixUnitaire = Number(commandeForm.prixUnitaire);
              const ok = await submitAction(
                "/api/commande",
                "POST",
                {
                  clientId: commandeForm.clientId,
                  total: quantite * prixUnitaire,
                  notes: commandeForm.notes,
                  items: [
                    {
                      description: commandeForm.description,
                      quantite,
                      prixUnitaire,
                    },
                  ],
                },
                "Commande creee.",
              );

              if (ok) {
                setCommandeForm((current) => ({
                  ...current,
                  description: "",
                  quantite: "",
                  prixUnitaire: "",
                  notes: "",
                }));
              }
            }}
          >
            <div className="form-grid">
              <div className="field">
                <label className="label">Client</label>
                <select
                  className="select"
                  value={commandeForm.clientId}
                  onChange={(event) =>
                    setCommandeForm((current) => ({
                      ...current,
                      clientId: event.target.value,
                    }))
                  }
                >
                  {data.clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="label">Description</label>
                <input
                  className="input"
                  value={commandeForm.description}
                  onChange={(event) =>
                    setCommandeForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="field">
                <label className="label">Quantite</label>
                <input
                  className="input"
                  type="number"
                  value={commandeForm.quantite}
                  onChange={(event) =>
                    setCommandeForm((current) => ({
                      ...current,
                      quantite: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="field">
                <label className="label">Prix unitaire</label>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  value={commandeForm.prixUnitaire}
                  onChange={(event) =>
                    setCommandeForm((current) => ({
                      ...current,
                      prixUnitaire: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="field field-full">
                <label className="label">Notes</label>
                <textarea
                  className="textarea"
                  value={commandeForm.notes}
                  onChange={(event) =>
                    setCommandeForm((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <button className="button-secondary" disabled={pending} type="submit">
              Enregistrer la commande
            </button>
          </form>
        )}
      </SectionCard>

      <SectionCard title="Commandes" hint="Statuts et dernieres ventes">
        {data.commandes.length === 0 ? (
          <EmptyState message="Aucune commande enregistree." />
        ) : (
          <div className="list">
            {data.commandes.map((commande) => (
              <div key={commande.id} className="list-item">
                <div className="split">
                  <strong>{commande.client.nom}</strong>
                  <StatusBadge
                    label={commande.statut}
                    tone={commande.statut === "LIVREE" ? "success" : "warn"}
                  />
                </div>
                <span className="helper">
                  Total {formatCurrency(commande.total)} · {formatDate(commande.dateCommande)}
                </span>
                <span className="helper">
                  {commande.items.map((item) => item.description).join(", ")}
                </span>
                {commande.statut !== "LIVREE" ? (
                  <button
                    className="button-ghost"
                    disabled={pending}
                    onClick={() =>
                      void submitAction(
                        `/api/commande/${commande.id}/statut`,
                        "PUT",
                        { statut: "LIVREE" },
                        "Commande marquee comme livree.",
                      )
                    }
                    type="button"
                  >
                    Marquer livree
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
