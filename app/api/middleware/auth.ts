import { NextRequest, NextResponse } from "next/server";

import {
  clearAuthCookies,
  getRefreshTokenFromCookies,
  requireCurrentUserFromCookies,
  setAuthCookies,
} from "@/lib/server/auth";
import { unauthorized } from "@/lib/server/http";

export async function requireUser() {
  return await requireCurrentUserFromCookies();
}

export function unauthorizedResponse() {
  return unauthorized();
}

export async function parseJsonBody<T = Record<string, unknown>>(
  request: NextRequest,
) {
  try {
    return (await request.json()) as T;
  } catch {
    return {} as T;
  }
}

export function successWithCookies(
  payload: unknown,
  accessToken: string,
  refreshToken: string,
) {
  const response = NextResponse.json(payload);
  setAuthCookies(response, accessToken, refreshToken);
  return response;
}

export function clearCookies(response: NextResponse) {
  clearAuthCookies(response);
}

export function getRefreshToken() {
  return getRefreshTokenFromCookies();
}
