"use client";

import Link from "next/link";

import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  PageHeader,
  SectionCard,
  StatBlock,
  StatusBadge,
} from "@/components/ui";
import { dashboardNavigation } from "@/lib/dashboard/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function DashboardOverviewPage() {
  return (
    <DashboardGate>
      {({ data, pending, submitAction }) => {
        const user = data.user;
        const subscriptionTone =
          data.subscription?.status === "ACTIVE" ? "success" : "warn";

        const fermeActive = data.user.farmName
          ? data.user.farmName
          : "Creer une ferme pour commencer";

        return (
          <div className="stack page-section">
            <PageHeader
              eyebrow={`Dashboard de ${fermeActive}`}
              title="Vue d'ensemble"
              description="Lecture rapide des signaux essentiels de la ferme et acces direct aux domaines metier.">
              <Link className="button" href="/dashboard/elevage/animaux">
                Ouvrir l&apos;elevage
              </Link>
              <Link
                className="button-ghost"
                href="/dashboard/finances/transactions">
                Voir les finances
              </Link>
            </PageHeader>

            <div className="stats-grid">
              <StatBlock label="Animaux" value={data.stats.totalAnimals} />
              <StatBlock label="Oeufs" value={data.stats.totalEggs} />
              <StatBlock label="Commandes" value={data.stats.totalSales} />
              <StatBlock
                label="Profit du mois"
                value={formatCurrency(data.stats.monthlyProfit)}
              />
            </div>

            <div className="dashboard-grid">
              <SectionCard
                title="Profil"
                hint="Compte courant et activite recente">
                <div className="list">
                  <div className="list-item">
                    <strong>
                      {user.firstName} {user.lastName}
                    </strong>
                    <span className="helper">{user.role}</span>
                    <span className="helper">
                      Cree le {formatDate(user.createdAt)}
                    </span>
                    <span className="helper">
                      Derniere connexion: {formatDate(user.lastLogin)}
                    </span>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="Abonnement"
                hint="Etat actuel de la souscription">
                {data.subscription ? (
                  <div className="list-item">
                    <div className="split">
                      <strong>{data.subscription.plan.name}</strong>
                      <StatusBadge
                        label={data.subscription.status}
                        tone={subscriptionTone}
                      />
                    </div>
                    <span className="helper">
                      Expire le {formatDate(data.subscription.endDate)}
                    </span>
                    <span className="helper">
                      Montant paye:{" "}
                      {formatCurrency(data.subscription.amountPaid)}
                    </span>
                    <div className="list">
                      {data.subscription.plan.features.map((feature) => (
                        <span key={feature} className="pill">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <EmptyState message="Aucun abonnement actif pour le moment." />
                )}
              </SectionCard>

              <SectionCard
                title="Alertes sante"
                hint="Notifications en attente">
                {data.notifications.length === 0 ? (
                  <EmptyState message="Aucune notification sante." />
                ) : (
                  <div className="list">
                    {data.notifications.slice(0, 6).map((notification) => (
                      <div key={notification.id} className="list-item">
                        <div className="split">
                          <strong>{notification.message}</strong>
                          <StatusBadge
                            label={notification.isRead ? "Lue" : "A traiter"}
                            tone={notification.isRead ? "success" : "warn"}
                          />
                        </div>
                        <span className="helper">
                          Rappel: {formatDate(notification.dateRappel)}
                        </span>
                        {!notification.isRead ? (
                          <button
                            className="button-ghost"
                            disabled={pending}
                            onClick={() =>
                              void submitAction(
                                `/api/sante/notifications/${notification.id}`,
                                "PUT",
                                {},
                                "Notification marquee comme lue.",
                              )
                            }
                            type="button">
                            Marquer comme lue
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>

              <SectionCard
                title="Rapport financier"
                hint="Resume revenus et depenses">
                <div className="triple-grid">
                  <StatBlock
                    label="Revenus"
                    value={formatCurrency(data.rapport.revenus)}
                  />
                  <StatBlock
                    label="Depenses"
                    value={formatCurrency(data.rapport.depenses)}
                  />
                  <StatBlock
                    label="Profit"
                    value={formatCurrency(data.rapport.profit)}
                  />
                </div>
              </SectionCard>
            </div>
          </div>
        );
      }}
    </DashboardGate>
  );
}
