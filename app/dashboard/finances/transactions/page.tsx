"use client";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { EmptyState } from "@/components/dashboard/empty-state";
import { TransactionForm } from "@/components/transaction/transaction-form";
import { PageHeader, SectionCard, StatBlock } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useState } from "react";

export default function FinancesTransactionsPage() {
  const { data, loading, pending, error, submitAction } = useDashboard();
  const [transactionForm, setTransactionForm] = useState({
    type: "REVENU",
    description: "",
    montant: "",
    categorie: "",
  });

  if (loading && !data) {
    return (
      <div className="section">
        <span className="helper">Chargement du module finances...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="alert alert-error">
        {error || "Donnees indisponibles."}
      </div>
    );
  }

  return (
    <div className="stack">
      <PageHeader
        title="Transactions"
        description="Les revenus, depenses, soldes et rapports sont regroupes ici."
      />

      <div className="dashboard-grid">
        <SectionCard title="Nouvelle transaction" hint="Depense ou revenu">
          <TransactionForm />
        </SectionCard>

        <SectionCard title="Solde et rapport">
          <div className="triple-grid">
            <StatBlock
              label="Solde actuel"
              value={formatCurrency(data.solde.total)}
            />
            <StatBlock
              label="Revenus"
              value={formatCurrency(data.rapport.revenus)}
            />
            <StatBlock
              label="Depenses"
              value={formatCurrency(data.rapport.depenses)}
            />
          </div>
          <div className="list">
            {Object.entries(data.rapport.parCategorie).map(
              ([category, amount]) => (
                <div key={category} className="list-item">
                  <strong>{category}</strong>
                  <span className="helper">{formatCurrency(amount)}</span>
                </div>
              ),
            )}
            {Object.keys(data.rapport.parCategorie).length === 0 ? (
              <EmptyState message="Aucune ventilation par categorie pour le moment." />
            ) : null}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Historique financier">
        {data.transactions.length === 0 ? (
          <EmptyState message="Aucune transaction enregistree." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Categorie</th>
                  <th>Montant</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{formatDate(transaction.date)}</td>
                    <td>{transaction.type}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.categorie}</td>
                    <td>{formatCurrency(transaction.montant)}</td>
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
