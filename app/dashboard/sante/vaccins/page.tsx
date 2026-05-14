"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader, SectionCard, StatusBadge } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { showToast } from "@/lib/toast";

export default function SantePage() {
  const { data, loading, pending, error, submitAction } = useDashboard();
  const [vaccinForm, setVaccinForm] = useState({
    animalId: "",
    nomTraitement: "",
    configVaccinId: "",
  });

  // ✅ Hook 1 - Initialisation du formulaire
  useEffect(() => {
    if (!data) return;

    if (!vaccinForm.animalId && data.animals?.[0]) {
      setVaccinForm((current) => ({
        ...current,
        animalId: data.animals[0].id,
      }));
    }
    if (!vaccinForm.configVaccinId && data.config?.vaccins?.[0]) {
      setVaccinForm((current) => ({
        ...current,
        configVaccinId: data.config.vaccins[0].id,
      }));
    }
  }, [data, vaccinForm.animalId, vaccinForm.configVaccinId]);

  // ✅ Hook 2 - Gestion des erreurs (AVANT la condition de retour)
  useEffect(() => {
    if (!data && error) {
      showToast.error(error || "Données indisponibles.");
    }
  }, [data, error]);

  // ✅ Condition de rendu APRÈS tous les hooks
  if (loading && !data) {
    return (
      <div className="section">
        <span className="helper">Chargement du module santé...</span>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="stack">
      <PageHeader
        title="Gestion de la Santé"
        description="Enregistrez les vaccins, consultez les rappels et l'historique complet."
      />

      <div className="grid-2">
        {/* SECTION 1: FORMULAIRE D'AJOUT */}
        <SectionCard
          title="Ajouter un vaccin"
          hint="Crée automatiquement un rappel">
          {data.animals.length === 0 || data.config.vaccins.length === 0 ? (
            <EmptyState message="Il faut des animaux et des vaccins de référence." />
          ) : (
            <form
              className="stack"
              onSubmit={async (event) => {
                event.preventDefault();
                const ok = await submitAction(
                  "/api/sante/vaccin",
                  "POST",
                  vaccinForm,
                  "Vaccin ajouté.",
                );
                if (ok) {
                  setVaccinForm((current) => ({
                    ...current,
                    nomTraitement: "",
                  }));
                }
              }}>
              <div className="form-grid">
                <div className="field">
                  <label className="label">Animal</label>
                  <select
                    className="select"
                    value={vaccinForm.animalId}
                    onChange={(e) =>
                      setVaccinForm({ ...vaccinForm, animalId: e.target.value })
                    }>
                    {data.animals.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.numIdentif}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="label">Vaccin</label>
                  <select
                    className="select"
                    value={vaccinForm.configVaccinId}
                    onChange={(e) =>
                      setVaccinForm({
                        ...vaccinForm,
                        configVaccinId: e.target.value,
                      })
                    }>
                    {data.config.vaccins.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field field-full">
                  <label className="label">Nom du traitement</label>
                  <input
                    className="input"
                    value={vaccinForm.nomTraitement}
                    onChange={(e) =>
                      setVaccinForm({
                        ...vaccinForm,
                        nomTraitement: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <button className="button" disabled={pending} type="submit">
                Ajouter le vaccin
              </button>
            </form>
          )}
        </SectionCard>
      </div>

      {/* SECTION 2: NOTIFICATIONS / RAPPELS */}
      <SectionCard title="Notifications & Rappels">
        {data.notifications.length === 0 ? (
          <EmptyState message="Aucun rappel en attente." />
        ) : (
          <div
            className="list"
            style={{ maxHeight: "400px", overflowY: "auto" }}>
            {data.notifications.map((n) => (
              <div key={n.id} className="list-item">
                <div className="split">
                  <strong>{n.message}</strong>
                  <StatusBadge
                    label={n.isRead ? "Lue" : "Non lue"}
                    tone={n.isRead ? "success" : "warn"}
                  />
                </div>
                <span className="helper">
                  Prévu le {formatDate(n.dateRappel)}
                </span>
                {!n.isRead && (
                  <button
                    className="button-ghost"
                    disabled={pending}
                    onClick={() =>
                      void submitAction(
                        `/api/sante/notifications/${n.id}`,
                        "PUT",
                        {},
                        "Notification mise à jour.",
                      )
                    }>
                    Marquer comme lue
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* SECTION 3: HISTORIQUE COMPLET (Pleine largeur) */}
      <SectionCard title="Historique complet des actes">
        {data.historiqueSante.length === 0 ? (
          <EmptyState message="Aucun historique disponible." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Animal</th>
                  <th>Type</th>
                  <th>Traitement</th>
                  <th>Date</th>
                  <th>Prochain Rappel</th>
                </tr>
              </thead>
              <tbody>
                {data.historiqueSante.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.animalId}</strong>
                    </td>
                    <td>{item.type}</td>
                    <td>{item.nomTraitement}</td>
                    <td>{formatDate(item.dateAdminion)}</td>
                    <td>{formatDate(item.prochainRappel)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
