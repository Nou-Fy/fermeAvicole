import { NextResponse } from "next/server";

export function json<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function unauthorized(message = "Authentification requise.") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function notFound(message = "Ressource introuvable.") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Une erreur interne est survenue.";

  return NextResponse.json({ error: message }, { status: 500 });
}
