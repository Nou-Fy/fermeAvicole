"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/lib/toast";
import type { DashboardActionMethod } from "@/components/dashboard/dashboard-provider";

type EnclosClimateFormProps = {
  data: {
    enclos: Array<{
      id: string;
      nom: string;
      temperature?: number | null;
      humidite?: number | null;
    }>;
  };
  enclosId: string | null;
  pending: boolean;
  submitAction: (
    path: string,
    method: DashboardActionMethod,
    body?: Record<string, unknown>,
    successMessage?: string,
  ) => Promise<boolean>;
};

export function EnclosClimateForm({
  data,
  enclosId,
  pending,
  submitAction,
}: EnclosClimateFormProps) {
  // État pour les mesures uniquement
  const [form, setForm] = useState({
    temperature: "",
    humidite: "",
  });

  // On identifie l'enclos cible de manière immuable via la prop
  const selectedEnclos = data.enclos.find((e) => e.id === enclosId);

  // Synchronisation des données actuelles au chargement
  useEffect(() => {
    if (selectedEnclos) {
      setForm({
        temperature: selectedEnclos.temperature?.toString() ?? "",
        humidite: selectedEnclos.humidite?.toString() ?? "",
      });
    }
  }, [selectedEnclos]);

  useEffect(() => {
    if (!selectedEnclos) {
      showToast.error("Enclos non trouvé.");
    }
  }, [selectedEnclos]);

  if (!selectedEnclos) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void submitAction(
      `/api/enclos/${selectedEnclos.id}/temperature`, // L'ID est immuable ici
      "PUT",
      {
        temperature: form.temperature ? Number(form.temperature) : undefined,
        humidite: form.humidite ? Number(form.humidite) : undefined,
      },
      "Conditions climatiques mises à jour.",
    );
  };

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label className="label">Enclos sélectionné</label>
          <input
            className="input"
            value={selectedEnclos.nom}
            readOnly
            disabled
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}>
          <div className="field">
            <label className="label">Température (°C)</label>
            <input
              className="input"
              type="number"
              step="0.1"
              placeholder="Ex: 24.5"
              value={form.temperature}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, temperature: e.target.value }))
              }
            />
          </div>

          <div className="field">
            <label className="label">Humidité (%)</label>
            <input
              className="input"
              type="number"
              placeholder="Ex: 60"
              value={form.humidite}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, humidite: e.target.value }))
              }
            />
          </div>
        </div>
      </div>
      <button className="button" disabled={pending} type="submit">
        {pending ? "Enregistrement..." : "Mettre à jour le climat"}
      </button>
    </form>
  );
}
