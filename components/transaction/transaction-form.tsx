"use client";

import { useState } from "react";
import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { showToast } from "@/lib/toast";

interface TransactionFormProps {
  onSuccess?: (transactionId: string, montant: number) => void;
  defaultAmount?: string;
  defaultDescription?: string;
  commandeId?: string;
}

export function TransactionForm({
  onSuccess,
  defaultAmount,
  defaultDescription,
  commandeId,
}: TransactionFormProps) {
  const { pending, submitAction } = useDashboard();

  const [form, setForm] = useState({
    type: "REVENU",
    description: defaultDescription || "",
    montant: defaultAmount || "",
    categorie: "Vente",
  });

  // État pour les frais de livraison
  const [deliveryOption, setDeliveryOption] = useState<
    "none" | "centre_ville" | "peripherie" | "custom"
  >("none");

  const [customFret, setCustomFret] = useState("");

  // Calcul des frais de livraison
  const getDeliveryFee = (): number => {
    switch (deliveryOption) {
      case "centre_ville":
        return 3000;
      case "peripherie":
        return 5000;
      case "custom":
        return Number(customFret) || 0;
      case "none":
      default:
        return 0;
    }
  };

  // Montant final = montant - frais
  const montantBrut = Number(form.montant) || 0;
  const deliveryFee = getDeliveryFee();
  const montantFinal = montantBrut - deliveryFee;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validation : au moins un montant valide
    if (montantFinal <= 0) {
      showToast.error("Le montant final doit être positif.");
      return;
    }

    // Validation : si custom, le champ doit être rempli
    if (deliveryOption === "custom" && !customFret) {
      showToast.error("Veuillez entrer le montant du fret personnalisé.");
      return;
    }

    const ok = await submitAction(
      "/api/transaction",
      "POST",
      {
        ...form,
        montant: montantFinal, // Envoie le montant FINAL (après déduction frais)
        commandeId,
        deliveryOption,
        deliveryFee: getDeliveryFee(), // Envoie aussi les frais pour la trace
      },
      "Transaction ajoutée.",
    );

    if (ok) {
      // Reset du formulaire
      setForm({
        type: "REVENU",
        description: defaultDescription || "",
        montant: defaultAmount || "",
        categorie: "Vente",
      });
      setDeliveryOption("none");
      setCustomFret("");

      // Callback au parent
      if (onSuccess) onSuccess("TX-ID-from-response", montantFinal);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <div className="form-grid">
        {/* TYPE */}
        <div className="field">
          <label className="label">Type</label>
          <select
            className="select"
            value={form.type}
            onChange={(e) => handleChange("type", e.target.value)}>
            <option value="REVENU">Revenu</option>
            <option value="DEPENSE">Dépense</option>
          </select>
        </div>

        {/* CATEGORIE */}
        <div className="field">
          <label className="label">Catégorie</label>
          <input
            className="input"
            value={form.categorie}
            onChange={(e) => handleChange("categorie", e.target.value)}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div className="field field-full">
          <label className="label">Description</label>
          <input
            className="input"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
          />
        </div>

        {/* MONTANT BRUT ET FRAIS DE LIVRAISON SUR LA MÊME LIGNE */}
        <div className="field">
          <label className="label">Montant</label>
          <input
            className="input"
            type="number"
            step="0.01"
            value={form.montant}
            onChange={(e) => handleChange("montant", e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label className="label">Frais de livraison</label>
          <select
            className="select"
            value={deliveryOption}
            onChange={(e) =>
              setDeliveryOption(
                e.target.value as
                  | "none"
                  | "centre_ville"
                  | "peripherie"
                  | "custom",
              )
            }>
            <option value="none">Sans livraison (0)</option>
            <option value="centre_ville">Centre-ville (-3 000)</option>
            <option value="peripherie">Périphérie (-5 000)</option>
            <option value="custom">Fret personnalisé</option>
          </select>
        </div>
      </div>

      {/* Champ custom visible seulement si "custom" est sélectionné */}
      {deliveryOption === "custom" && (
        <div className="field">
          <label className="label">Montant du fret</label>
          <input
            className="input"
            type="number"
            step="0.01"
            value={customFret}
            onChange={(e) => setCustomFret(e.target.value)}
            placeholder="Entrez le montant"
            required
          />
        </div>
      )}

      <button className="button" disabled={pending} type="submit">
        {pending ? "Envoi en cours..." : "Ajouter la transaction"}
      </button>
    </form>
  );
}
