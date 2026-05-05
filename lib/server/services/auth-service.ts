import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import {
  getRefreshTokenFromCookies,
  signAccessToken,
  signRefreshToken,
  TokenUserPayload,
  verifyRefreshToken,
} from "@/lib/server/auth";
import { ensureDefaultSubscription } from "@/lib/server/services/subscription-service";

type AuthInput = {
  email: string;
  password: string;
};

type RegisterInput = AuthInput & {
  firstName: string;
  lastName: string;
  farmName: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function sessionUserFromRecord(user: {
  id: string;
  email: string;
  farmName: string;
  role: string;
}) {
  return {
    sub: user.id,
    email: user.email,
    role: user.role,
    farmName: user.farmName,
  } satisfies TokenUserPayload;
}

async function issueTokensForUser(user: {
  id: string;
  email: string;
  farmName: string;
  role: string;
}) {
  const accessToken = await signAccessToken(sessionUserFromRecord(user));
  const refreshToken = await signRefreshToken(user.id);

  const expiresAt = new Date();
  expiresAt.setDate(
    expiresAt.getDate() + Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7),
  );

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
  };
}

export async function registerUser(input: RegisterInput) {
  const email = normalizeEmail(input.email);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Un compte existe deja avec cet email.");
  }

  const password = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      farmName: input.farmName.trim(),
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      farmName: true,
      role: true,
      createdAt: true,
    },
  });

  await ensureDefaultSubscription(user.id);
  const tokens = await issueTokensForUser(user);

  return {
    user,
    ...tokens,
  };
}

export async function loginUser(input: AuthInput) {
  const email = normalizeEmail(input.email);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.isActive) {
    throw new Error("Identifiants invalides.");
  }

  const passwordMatch = await bcrypt.compare(input.password, user.password);

  if (!passwordMatch) {
    throw new Error("Identifiants invalides.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  await ensureDefaultSubscription(user.id);
  const tokens = await issueTokensForUser(user);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      farmName: user.farmName,
      role: user.role,
    },
    ...tokens,
  };
}

export async function refreshUserSession(cookieRefreshToken?: string | null) {
  const refreshToken = cookieRefreshToken ?? getRefreshTokenFromCookies();

  if (!refreshToken) {
    throw new Error("Session expirée.");
  }

  await verifyRefreshToken(refreshToken);

  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    throw new Error("Le refresh token est invalide ou expiré.");
  }

  const user = await prisma.user.findUnique({
    where: { id: tokenRecord.userId },
  });

  if (!user || !user.isActive) {
    throw new Error("Utilisateur introuvable.");
  }

  await prisma.refreshToken.delete({
    where: { id: tokenRecord.id },
  });

  const tokens = await issueTokensForUser(user);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      farmName: user.farmName,
      role: user.role,
    },
    ...tokens,
  };
}

export async function logoutUser(refreshToken?: string | null) {
  if (!refreshToken) {
    return;
  }

  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
}

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      farmName: true,
      role: true,
      createdAt: true,
      lastLogin: true,
      subscriptions: {
        where: { status: "ACTIVE" },
        select: {
          id: true,
          status: true,
          endDate: true,
          renewalFrequency: true,
          amountPaid: true,
          plan: {
            select: {
              id: true,
              name: true,
              features: true,
              price: true,
              maxAnimals: true,
              maxUsers: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("Utilisateur introuvable.");
  }

  return user;
}

export async function checkIfUserExists(email: string) {
  const user = await prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
    select: { id: true },
  });

  return { exists: Boolean(user) };
}
