import { useState, useEffect } from "react";
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
  pending,
  submitAction,
}: EnclosClimateFormProps) {
  const [form, setForm] = useState({
    enclosId: "",
    temperature: "",
    humidite: "",
  });

  useEffect(() => {
    if (!data || form.enclosId) {
      return;
    }

    const first = data.enclos[0];
    if (first) {
      setForm({
        enclosId: first.id,
        temperature: first.temperature?.toString() ?? "",
        humidite: first.humidite?.toString() ?? "",
      });
    }
  }, [data, form.enclosId]);

  if (!data || data.enclos.length === 0) {
    return null;
  }

  return (
    <form
      className="stack"
      onSubmit={(event) => {
        event.preventDefault();
        void submitAction(
          `/api/enclos/${form.enclosId}/temperature`,
          "PUT",
          {
            temperature: form.temperature
              ? Number(form.temperature)
              : undefined,
            humidite: form.humidite ? Number(form.humidite) : undefined,
          },
          "Climat de l'enclos mis a jour.",
        );
      }}>
      <div className="form-grid">
        <div className="field">
          <label className="label">Enclos</label>
          <select
            className="select"
            value={form.enclosId}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                enclosId: event.target.value,
              }))
            }>
            {data.enclos.map((enclos) => (
              <option key={enclos.id} value={enclos.id}>
                {enclos.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="label">Temperature</label>
          <input
            className="input"
            type="number"
            value={form.temperature}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                temperature: event.target.value,
              }))
            }
          />
        </div>
        <div className="field">
          <label className="label">Humidite</label>
          <input
            className="input"
            type="number"
            value={form.humidite}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                humidite: event.target.value,
              }))
            }
          />
        </div>
      </div>
      <button className="button-ghost" disabled={pending} type="submit">
        Mettre a jour
      </button>
    </form>
  );
}
