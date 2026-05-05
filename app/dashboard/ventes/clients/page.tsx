"use client";

import Link from "next/link";
import { useState } from "react";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader, SectionCard } from "@/components/ui";

export default function VentesClientsPage() {
  const { data, loading, pending, error, submitAction } = useDashboard();
  const [clientForm, setClientForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
  });

  if (loading && !data) {
    return (
      <div className="section">
        <span className="helper">Chargement du module clients...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="alert alert-error">{error || "Donnees indisponibles."}</div>;
  }

  return (
    <div className="stack">
      <PageHeader
        title="Clients"
        description="La base commerciale est maintenant separee de la gestion des commandes."
      >
        <Link className="button-ghost" href="/dashboard/ventes/commandes">
          Aller aux commandes
        </Link>
      </PageHeader>

      <SectionCard title="Creer un client" hint="Base commerciale locale">
        <form
          className="stack"
          onSubmit={async (event) => {
            event.preventDefault();
            const ok = await submitAction(
              "/api/client",
              "POST",
              clientForm,
              "Client ajoute.",
            );

            if (ok) {
              setClientForm({
                nom: "",
                email: "",
                telephone: "",
                adresse: "",
                ville: "",
                codePostal: "",
              });
            }
          }}
        >
          <div className="form-grid">
            <div className="field">
              <label className="label">Nom</label>
              <input
                className="input"
                value={clientForm.nom}
                onChange={(event) =>
                  setClientForm((current) => ({
                    ...current,
                    nom: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="field">
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={clientForm.email}
                onChange={(event) =>
                  setClientForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="field">
              <label className="label">Telephone</label>
              <input
                className="input"
                value={clientForm.telephone}
                onChange={(event) =>
                  setClientForm((current) => ({
                    ...current,
                    telephone: event.target.value,
                  }))
                }
              />
            </div>
            <div className="field">
              <label className="label">Ville</label>
              <input
                className="input"
                value={clientForm.ville}
                onChange={(event) =>
                  setClientForm((current) => ({
                    ...current,
                    ville: event.target.value,
                  }))
                }
              />
            </div>
            <div className="field field-full">
              <label className="label">Adresse</label>
              <textarea
                className="textarea"
                value={clientForm.adresse}
                onChange={(event) =>
                  setClientForm((current) => ({
                    ...current,
                    adresse: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <button className="button" disabled={pending} type="submit">
            Ajouter le client
          </button>
        </form>
      </SectionCard>

      <SectionCard title="Clients enregistres">
        {data.clients.length === 0 ? (
          <EmptyState message="Aucun client enregistre." />
        ) : (
          <div className="list">
            {data.clients.map((client) => (
              <div key={client.id} className="list-item">
                <strong>{client.nom}</strong>
                <span className="helper">{client.email}</span>
                <span className="helper">
                  {client.telephone || "Sans telephone"} · {client.ville || "Ville non renseignee"}
                </span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
