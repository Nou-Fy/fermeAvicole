import { useState, type FormEvent } from "react";
import type { DashboardActionMethod } from "@/components/dashboard/dashboard-provider";

type EnclosCreateFormProps = {
  data: {
    config: {
      enclosTypes: Array<{ id: string; nom: string }>;
    };
  };
  pending: boolean;
  submitAction: (
    path: string,
    method: DashboardActionMethod,
    body?: Record<string, unknown>,
    successMessage?: string,
  ) => Promise<boolean>;
};

export function EnclosCreateForm({
  data,
  pending,
  submitAction,
}: EnclosCreateFormProps) {
  const [form, setForm] = useState({
    nom: "",
    type: data.config.enclosTypes[0]?.nom || "",
    capaciteMax: "",
    localisation: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ok = await submitAction(
      "/api/enclos",
      "POST",
      { ...form, capaciteMax: Number(form.capaciteMax) },
      "Enclos créé.",
    );
    if (ok) setForm({ ...form, nom: "", capaciteMax: "", localisation: "" });
  };

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label className="label">Nom</label>
          <input
            className="input"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label className="label">Type</label>
          <select
            className="select"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {data.config.enclosTypes.map((t) => (
              <option key={t.id} value={t.nom}>
                {t.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="label">Capacité max</label>
          <input
            className="input"
            type="number"
            value={form.capaciteMax}
            onChange={(e) => setForm({ ...form, capaciteMax: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label className="label">Localisation</label>
          <input
            className="input"
            value={form.localisation}
            onChange={(e) => setForm({ ...form, localisation: e.target.value })}
          />
        </div>
      </div>
      <button className="button" disabled={pending} type="submit">
        Créer un enclos
      </button>
    </form>
  );
}
