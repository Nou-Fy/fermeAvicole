"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { FormGroup } from "@/components/ui";
import { showToast } from "@/lib/toast";

type AuthMode = "login" | "register";

const registerInitialState = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  farmName: "",
};

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [form, setForm] = useState(registerInitialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  useEffect(() => {
    if (error) {
      showToast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      showToast.success(success);
    }
  }, [success]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(
          isLogin
            ? {
                email: form.email,
                password: form.password,
              }
            : form,
        ),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "La demande a echoue.");
      }

      setSuccess(isLogin ? "Connexion reussie." : "Compte cree avec succes.");
      router.push("/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Impossible de continuer.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card animate-rise">
      <div className="split" style={{ alignItems: "flex-start" }}>
        <div />
        <ThemeToggle />
      </div>
      <div className="stack" style={{ marginBottom: "1.5rem" }}>
        <span className="eyebrow">{isLogin ? "Connexion" : "Inscription"}</span>
        <h1>
          {isLogin
            ? "Reprendre le pilotage de la ferme"
            : "Lancer votre espace de gestion"}
        </h1>
        <p className="muted">
          {isLogin
            ? "Toutes les operations metier sont maintenant centralisees dans une seule application Next.js."
            : "Creez votre compte et obtenez un abonnement de demarrage pour commencer a saisir vos donnees."}
        </p>
      </div>

      <form className="stack" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormGroup label="Email" htmlFor="email">
            <input
              id="email"
              className="input"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              required
            />
          </FormGroup>

          <FormGroup label="Mot de passe" htmlFor="password">
            <input
              id="password"
              className="input"
              type="password"
              minLength={8}
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              required
            />
          </FormGroup>

          {!isLogin ? (
            <>
              <FormGroup label="Prénom" htmlFor="firstName">
                <input
                  id="firstName"
                  className="input"
                  value={form.firstName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      firstName: event.target.value,
                    }))
                  }
                  required
                />
              </FormGroup>

              <FormGroup label="Nom" htmlFor="lastName">
                <input
                  id="lastName"
                  className="input"
                  value={form.lastName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      lastName: event.target.value,
                    }))
                  }
                  required
                />
              </FormGroup>

              <FormGroup label="Nom de la ferme" htmlFor="farmName" wide>
                <input
                  id="farmName"
                  className="input"
                  value={form.farmName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      farmName: event.target.value,
                    }))
                  }
                  required
                />
              </FormGroup>
            </>
          ) : null}
        </div>

        <button className="button" disabled={loading} type="submit">
          {loading
            ? "Traitement en cours..."
            : isLogin
              ? "Se connecter"
              : "Creer mon compte"}
        </button>
      </form>

      <p className="muted" style={{ marginTop: "1rem" }}>
        {isLogin ? "Pas encore de compte ?" : "Vous avez deja un compte ?"}{" "}
        <Link href={isLogin ? "/register" : "/login"} className="pill">
          {isLogin ? "S'inscrire" : "Se connecter"}
        </Link>
      </p>
    </div>
  );
}
