import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { JWTPayload, SignJWT, jwtVerify } from "jose";

import { prisma } from "@/lib/prisma";

const ACCESS_COOKIE = "ferme_session";
const REFRESH_COOKIE = "ferme_refresh";
const encoder = new TextEncoder();

const authSecret = process.env.AUTH_SECRET;

if (!authSecret) {
  throw new Error("AUTH_SECRET is missing.");
}

const secretKey = encoder.encode(authSecret);
const accessLifetimeHours = Number(process.env.TOKEN_TTL_HOURS || 24);
const refreshLifetimeDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7);

export type SessionPayload = JWTPayload & {
  sub: string;
  email: string;
  role: string;
  farmName: string;
};

export type TokenUserPayload = {
  sub: string;
  email: string;
  role: string;
  farmName: string;
};

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export async function signAccessToken(payload: TokenUserPayload) {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
    farmName: payload.farmName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${accessLifetimeHours}h`)
    .sign(secretKey);
}

export async function signRefreshToken(userId: string) {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${refreshLifetimeDays}d`)
    .sign(secretKey);
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey);
  return payload as SessionPayload;
}

export async function verifyRefreshToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey);
  return payload;
}

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
) {
  response.cookies.set(
    ACCESS_COOKIE,
    accessToken,
    cookieOptions(accessLifetimeHours * 60 * 60),
  );
  response.cookies.set(
    REFRESH_COOKIE,
    refreshToken,
    cookieOptions(refreshLifetimeDays * 24 * 60 * 60),
  );
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", { ...cookieOptions(0), maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, "", { ...cookieOptions(0), maxAge: 0 });
}

export function getAccessTokenFromCookies() {
  return cookies().get(ACCESS_COOKIE)?.value ?? null;
}

export function getRefreshTokenFromCookies() {
  return cookies().get(REFRESH_COOKIE)?.value ?? null;
}

export async function getSessionFromCookies() {
  const token = getAccessTokenFromCookies();

  if (!token) {
    return null;
  }

  try {
    return await verifyAccessToken(token);
  } catch {
    return null;
  }
}

export async function getCurrentUserFromCookies() {
  const session = await getSessionFromCookies();

  if (!session?.sub) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: session.sub },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      farmName: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      lastLogin: true,
    },
  });
}

export async function requireCurrentUserFromCookies() {
  const user = await getCurrentUserFromCookies();

  if (!user || !user.isActive) {
    return null;
  }

  return user;
}
