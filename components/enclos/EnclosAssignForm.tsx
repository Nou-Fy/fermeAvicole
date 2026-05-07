"use client";

import { useState, useMemo, useEffect } from "react";
import type { DashboardActionMethod } from "@/components/dashboard/dashboard-provider";

type EnclosAssignFormProps = {
  data: {
    enclos: Array<{
      id: string;
      nom: string;
      // Ici, on utilise la structure réelle : animalNum et non numIdentif
      animauxActuels: Array<{ animalNum: string }>;
    }>;
    animals: Array<{ id: string; numIdentif: string }>;
  };
  pending: boolean;
  submitAction: (
    path: string,
    method: DashboardActionMethod,
    body?: Record<string, unknown>,
    successMessage?: string,
  ) => Promise<boolean>;
};

export function EnclosAssignForm({
  data,
  pending,
  submitAction,
}: EnclosAssignFormProps) {
  const availableAnimals = useMemo(() => {
    // 1. On récupère les numéros occupés via 'animalNum' (la propriété réelle)
    const occupiedNumbers = new Set(
      data.enclos.flatMap((enc) =>
        (enc.animauxActuels || [])
          .filter((a) => a && a.animalNum) // Sécurité
          .map((a) => a.animalNum.trim().toLowerCase()),
      ),
    );

    // 2. On filtre la liste globale qui, elle, utilise 'numIdentif'
    return data.animals.filter((a) => {
      if (!a || !a.numIdentif) return false;
      return !occupiedNumbers.has(a.numIdentif.trim().toLowerCase());
    });
  }, [data.enclos, data.animals]);

  const [form, setForm] = useState({
    enclosId: data.enclos[0]?.id || "",
    animalNum: "",
  });

  // Synchronisation auto du premier animal disponible
  useEffect(() => {
    if (availableAnimals.length > 0 && !form.animalNum) {
      setForm((prev) => ({
        ...prev,
        animalNum: availableAnimals[0].numIdentif,
      }));
    }
  }, [availableAnimals, form.animalNum]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.enclosId || !form.animalNum) return;

    const success = await submitAction(
      `/api/enclos/${form.enclosId}/animal`,
      "POST",
      form,
      "Animal affecté.",
    );
    if (success) setForm((prev) => ({ ...prev, animalNum: "" }));
  };

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label className="label">Enclos de destination</label>
          <select
            className="select"
            value={form.enclosId}
            onChange={(e) => setForm({ ...form, enclosId: e.target.value })}>
            {data.enclos.map((enclos) => (
              <option key={enclos.id} value={enclos.id}>
                {enclos.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="label">
            Animal disponible ({availableAnimals.length})
          </label>
          <select
            className="select"
            value={form.animalNum}
            onChange={(e) => setForm({ ...form, animalNum: e.target.value })}
            disabled={availableAnimals.length === 0}>
            <option value="">-- Sélectionner --</option>
            {availableAnimals.map((a) => (
              <option key={a.id} value={a.numIdentif}>
                {a.numIdentif}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="button"
        disabled={pending || availableAnimals.length === 0 || !form.animalNum}
        type="submit">
        Affecter l&apos;animal
      </button>
    </form>
  );
}
