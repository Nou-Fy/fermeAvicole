"use client";

import { useEffect, useState } from "react";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader, SectionCard, StatusBadge } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function FinancesPaiementsPage() {
  const { data, loading, pending, error, submitAction } = useDashboard();
  const [paymentForm, setPaymentForm] = useState({
    subscriptionId: "",
    amount: "",
    paymentMethod: "BANK_TRANSFER",
  });

  useEffect(() => {
    if (!data || !data.subscription) {
      return;
    }

    if (!paymentForm.subscriptionId) {
      setPaymentForm((current) => ({
        ...current,
        subscriptionId: data.subscription?.id || "",
        amount: current.amount || String(data.subscription?.plan?.price || ""),
      }));
    }
  }, [data, paymentForm.subscriptionId]);

  if (loading && !data) {
    return (
      <div className="section">
        <span className="helper">Chargement du module paiements...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="alert alert-error">{error || "Donnees indisponibles."}</div>;
  }

  return (
    <div className="stack">
      <PageHeader
        title="Paiements"
        description="Page dediee aux paiements d'abonnement et a leur historique."
      />

      <SectionCard title="Paiement d'abonnement" hint="Simulation de paiement interne">
        {data.subscription ? (
          <form
            className="stack"
            onSubmit={(event) => {
              event.preventDefault();
              void submitAction(
                "/api/payments",
                "POST",
                {
                  subscriptionId: paymentForm.subscriptionId,
                  amount: Number(paymentForm.amount),
                  paymentMethod: paymentForm.paymentMethod,
                },
                "Paiement enregistre.",
              );
            }}
          >
            <div className="form-grid">
              <div className="field">
                <label className="label">Abonnement</label>
                <input
                  className="input"
                  value={paymentForm.subscriptionId}
                  onChange={(event) =>
                    setPaymentForm((current) => ({
                      ...current,
                      subscriptionId: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="field">
                <label className="label">Montant</label>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  value={paymentForm.amount}
                  onChange={(event) =>
                    setPaymentForm((current) => ({
                      ...current,
                      amount: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="field">
                <label className="label">Mode</label>
                <select
                  className="select"
                  value={paymentForm.paymentMethod}
                  onChange={(event) =>
                    setPaymentForm((current) => ({
                      ...current,
                      paymentMethod: event.target.value,
                    }))
                  }
                >
                  {["BANK_TRANSFER", "CREDIT_CARD", "DEBIT_CARD", "PAYPAL"].map(
                    (method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
            <button className="button-secondary" disabled={pending} type="submit">
              Enregistrer le paiement
            </button>
          </form>
        ) : (
          <EmptyState message="Abonnement introuvable pour creer un paiement." />
        )}
      </SectionCard>

      <SectionCard title="Historique des paiements">
        {data.payments.length === 0 ? (
          <EmptyState message="Aucun paiement enregistre." />
        ) : (
          <div className="list">
            {data.payments.map((payment) => (
              <div key={payment.id} className="list-item">
                <div className="split">
                  <strong>{formatCurrency(payment.amount)}</strong>
                  <StatusBadge
                    label={payment.status}
                    tone={payment.status === "COMPLETED" ? "success" : "warn"}
                  />
                </div>
                <span className="helper">
                  {payment.paymentMethod} · {formatDate(payment.paidAt || payment.createdAt)}
                </span>
                <span className="helper">{payment.transactionId}</span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
