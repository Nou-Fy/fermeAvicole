import Link from "next/link";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { getCurrentUserFromCookies } from "@/lib/server/auth";

export default async function HomePage() {
  const currentUser = await getCurrentUserFromCookies();

  return (
    <>
      <header className="shell topbar">
        <div className="brand">
          <span className="brand-mark" />
          <span>Ferme Avicole</span>
        </div>
        <div className="actions">
          <ThemeToggle />
          <Link className="button-ghost" href="/login">
            Connexion
          </Link>
          <Link className="button" href={currentUser ? "/dashboard" : "/register"}>
            {currentUser ? "Ouvrir le dashboard" : "Creer un compte"}
          </Link>
        </div>
      </header>

      <main className="hero">
        <section className="shell hero-grid">
          <div className="hero-panel animate-rise">
            <span className="eyebrow">Refonte terminee</span>
            <div className="hero-copy stack" style={{ marginTop: "1rem" }}>
              <h1>Le projet vit maintenant dans une seule application Next.js.</h1>
              <p className="muted">
                Frontend, API, authentification, reporting et operations metier
                cohabitent dans une base de code unifiee, branchee directement sur
                PostgreSQL via Prisma.
              </p>
              <div className="button-row">
                <Link className="button" href={currentUser ? "/dashboard" : "/register"}>
                  {currentUser ? "Continuer" : "Commencer"}
                </Link>
                <Link className="button-secondary" href="/login">
                  Acceder a mon espace
                </Link>
              </div>
            </div>
            <div className="hero-stats">
              <div className="stat-card">
                <div className="muted">Architecture</div>
                <div className="stat-value">Next.js</div>
              </div>
              <div className="stat-card">
                <div className="muted">Base</div>
                <div className="stat-value">PostgreSQL</div>
              </div>
              <div className="stat-card">
                <div className="muted">Infra</div>
                <div className="stat-value">Sans Docker</div>
              </div>
            </div>
          </div>

          <div className="hero-panel animate-rise" style={{ animationDelay: "80ms" }}>
            <div className="stack">
              <h2>Ce que la nouvelle app couvre</h2>
              <div className="list">
                <div className="list-item">
                  <strong>Authentification integree</strong>
                  <span className="helper">
                    Session par cookies, profils utilisateurs et abonnement actif.
                  </span>
                </div>
                <div className="list-item">
                  <strong>Operations metier centralisees</strong>
                  <span className="helper">
                    Animaux, sante, enclos, oeufs, couvaison, alimentation,
                    ventes et finances dans le meme dashboard.
                  </span>
                </div>
                <div className="list-item">
                  <strong>Prisma multi-schema conserve</strong>
                  <span className="helper">
                    La structure PostgreSQL existante reste compatible avec la
                    base `micro_ser_elevage`.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="shell page-section">
          <div className="info-grid">
            <article className="section animate-rise">
              <div className="section-header">
                <div>
                  <span className="eyebrow">Monolithe utile</span>
                  <h3>Une API interne claire</h3>
                </div>
              </div>
              <div className="section-body">
                <p className="muted">
                  Toutes les anciennes routes des microservices ont ete migrees en
                  route handlers Next.js, avec des services serveur partages pour
                  garder la logique metier lisible.
                </p>
              </div>
            </article>

            <article className="section animate-rise">
              <div className="section-header">
                <div>
                  <span className="eyebrow">Base locale</span>
                  <h3>Connexion directe a PostgreSQL</h3>
                </div>
              </div>
              <div className="section-body">
                <p className="muted">
                  L&apos;application s&apos;appuie sur `DATABASE_URL` local et ne depend
                  plus de Docker Compose, RabbitMQ ou de ports de services
                  disperses.
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
