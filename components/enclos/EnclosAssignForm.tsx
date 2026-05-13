"use client";

import { useState, useMemo, useEffect } from "react";
import { showToast } from "@/lib/toast";
import type { DashboardActionMethod } from "@/components/dashboard/dashboard-provider";

type EnclosAssignFormProps = {
  data: {
    enclos: Array<{
      id: string;
      nom: string;
      animauxActuels: Array<{ animalNum: string }>;
    }>;
    animals: Array<{ id: string; numIdentif: string }>;
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

export function EnclosAssignForm({
  data,
  enclosId,
  pending,
  submitAction,
}: EnclosAssignFormProps) {
  // L'enclos cible est verrouillé via la prop
  const selectedEnclos = data.enclos.find((e) => e.id === enclosId);

  // Calcul immuable des animaux disponibles
  const availableAnimals = useMemo(() => {
    const occupiedNumbers = new Set(
      data.enclos.flatMap((enc) =>
        (enc.animauxActuels || []).map((a) => a.animalNum.trim().toLowerCase()),
      ),
    );

    return data.animals.filter(
      (a) => !occupiedNumbers.has(a.numIdentif.trim().toLowerCase()),
    );
  }, [data.enclos, data.animals]);

  const [form, setForm] = useState({
    animalNum: "",
  });

  // Sélection automatique du premier animal disponible
  useEffect(() => {
    if (availableAnimals.length > 0 && !form.animalNum) {
      setForm({ animalNum: availableAnimals[0].numIdentif });
    }
  }, [availableAnimals, form.animalNum]);

  useEffect(() => {
    if (!selectedEnclos) {
      showToast.error("Enclos non spécifié.");
    }
  }, [selectedEnclos]);

  if (!selectedEnclos) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.animalNum) return;

    await submitAction(
      `/api/enclos/${selectedEnclos.id}/animal`, // Cible immuable
      "POST",
      { enclosId: selectedEnclos.id, animalNum: form.animalNum },
      "Animal affecté avec succès.",
    );
  };

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label className="label">Enclos de destination</label>
          <input
            className="input"
            value={selectedEnclos.nom}
            readOnly
            disabled
          />
        </div>

        <div className="field">
          <label className="label">
            Animal à affecter ({availableAnimals.length} disponibles)
          </label>
          <select
            className="select"
            value={form.animalNum}
            onChange={(e) => setForm({ animalNum: e.target.value })}
            disabled={availableAnimals.length === 0}>
            <option value="">-- Choisir un numéro --</option>
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
        {pending ? "Affectation..." : "Confirmer l'affectation"}
      </button>
    </form>
  );
}
