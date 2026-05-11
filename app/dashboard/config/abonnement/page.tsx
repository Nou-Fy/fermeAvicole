"use client";

import { useEffect, useState } from "react";

import { useDashboard } from "@/components/dashboard/dashboard-provider";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader, SectionCard, StatusBadge } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ConfigAbonnementPage() {
  const { data, loading, pending, error, submitAction } = useDashboard();
  const [planId, setPlanId] = useState("");

  useEffect(() => {
    if (!data || planId || !data.plans[0]) {
      return;
    }

    const nextPlan =
      data.plans.find((plan) => plan.id !== data.subscription?.planId)?.id ||
      data.plans[0].id;

    setPlanId(nextPlan);
  }, [data, planId]);

  if (loading && !data) {
    return (
      <div className="section">
        <span className="helper">
          Chargement des parametres d&apos;abonnement...
        </span>
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
        title="Abonnement"
        description="Page dediee a l'etat du plan courant et a sa modification."
      />

      <div className="dashboard-grid">
        <SectionCard
          title="Abonnement actuel"
          hint="Details de votre abonnement en cours">
          {data.subscription ? (
            <div className="list-item">
              <div className="split">
                <strong>{data.subscription.plan.name}</strong>
                <StatusBadge
                  label={data.subscription.status}
                  tone={
                    data.subscription.status === "ACTIVE" ? "success" : "warn"
                  }
                />
              </div>
              <span className="helper">
                Expire le {formatDate(data.subscription.endDate)}
              </span>
              <span className="helper">
                Montant paye: {formatCurrency(data.subscription.amountPaid)}
              </span>
              <span className="helper">
                Prochain paiement:{" "}
                {formatDate(
                  new Date(
                    new Date(data.subscription.endDate).setDate(
                      new Date(data.subscription.endDate).getDate() + 1,
                    ),
                  ),
                )}{" "}
              </span>
              <span className="helper">
                Nombre d&apos;animaux Maximum :{" "}
                {data.subscription.plan.maxAnimals}
              </span>
              <span className="helper">
                Nombre d&apos;animaux restants :{" "}
                {data.subscription.plan.maxAnimals - data.stats.totalAnimals}
              </span>
            </div>
          ) : (
            <EmptyState message="Aucun abonnement actif." />
          )}
        </SectionCard>

        <SectionCard
          title="Changer de plan"
          hint="Migration simple vers un autre abonnement">
          <form
            className="stack"
            onSubmit={(event) => {
              event.preventDefault();
              void submitAction(
                "/api/subscriptions",
                "POST",
                { planId },
                "Abonnement mis a jour.",
              );
            }}>
            <div className="field">
              <label className="label">Plan cible</label>
              <select
                className="select"
                value={planId}
                onChange={(event) => setPlanId(event.target.value)}>
                {data.plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} · {formatCurrency(plan.price)}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="button-secondary"
              disabled={pending}
              type="submit">
              Changer de plan
            </button>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
