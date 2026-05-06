import { useState } from "react";
import type { DashboardActionMethod } from "@/components/dashboard/dashboard-provider";

type EnclosAssignFormProps = {
  data: {
    enclos: Array<{ id: string; nom: string }>;
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
  const [form, setForm] = useState({
    enclosId: data.enclos[0]?.id || "",
    animalNum: data.animals[0]?.numIdentif || "",
  });

  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        submitAction(
          `/api/enclos/${form.enclosId}/animal`,
          "POST",
          form,
          "Animal affecté.",
        );
      }}>
      <div className="form-grid">
        <div className="field">
          <label className="label">Enclos</label>
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
          <label className="label">Animal</label>
          <select
            className="select"
            value={form.animalNum}
            onChange={(e) => setForm({ ...form, animalNum: e.target.value })}>
            {data.animals.map((a) => (
              <option key={a.id} value={a.numIdentif}>
                {a.numIdentif}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button className="button-ghost" disabled={pending} type="submit">
        Affecter l&apos;animal
      </button>
    </form>
  );
}
