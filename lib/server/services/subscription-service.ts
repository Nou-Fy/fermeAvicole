import {
  PaymentMethod,
  PaymentStatus,
  RenewalFrequency,
  SubscriptionStatus,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

function addDays(date: Date, days: number) {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
}

function addMonths(date: Date, months: number) {
  const value = new Date(date);
  value.setMonth(value.getMonth() + months);
  return value;
}

export async function listPlans() {
  return prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });
}

export async function getActiveSubscription(userId: string) {
  return prisma.subscription.findFirst({
    where: {
      userId,
      status: SubscriptionStatus.ACTIVE,
    },
    include: {
      plan: true,
      payments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function ensureDefaultSubscription(userId: string) {
  const existing = await getActiveSubscription(userId);

  if (existing) {
    return existing;
  }

  const basicPlan =
    (await prisma.subscriptionPlan.findUnique({ where: { name: "BASIC" } })) ??
    (await prisma.subscriptionPlan.findFirst({
      where: { isActive: true },
      orderBy: { price: "asc" },
    }));

  if (!basicPlan) {
    throw new Error(
      "Aucun plan d'abonnement n'est disponible. Lancez `npm run db:seed`.",
    );
  }

  return prisma.subscription.create({
    data: {
      userId,
      planId: basicPlan.id,
      status: SubscriptionStatus.ACTIVE,
      endDate: addDays(new Date(), 30),
      renewalFrequency: RenewalFrequency.MONTHLY,
      amountPaid: 0,
      isAutoRenew: false,
    },
    include: {
      plan: true,
      payments: true,
    },
  });
}

export async function createSubscription(userId: string, planId: string) {
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  });

  if (!plan || !plan.isActive) {
    throw new Error("Le plan demandé est indisponible.");
  }

  const active = await prisma.subscription.findFirst({
    where: {
      userId,
      status: SubscriptionStatus.ACTIVE,
    },
  });

  if (active) {
    await prisma.subscription.update({
      where: { id: active.id },
      data: {
        status: SubscriptionStatus.CANCELLED,
        cancelledAt: new Date(),
        isAutoRenew: false,
      },
    });
  }

  return prisma.subscription.create({
    data: {
      userId,
      planId,
      status: SubscriptionStatus.ACTIVE,
      endDate: addMonths(new Date(), 1),
      renewalFrequency: RenewalFrequency.MONTHLY,
      amountPaid: plan.price,
      isAutoRenew: true,
    },
    include: {
      plan: true,
      payments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getSubscriptionStatus(userId: string) {
  const subscription = await getActiveSubscription(userId);

  if (!subscription) {
    return {
      isActive: false,
      remainingDays: 0,
      subscription: null,
    };
  }

  const diff = subscription.endDate.getTime() - Date.now();
  const remainingDays = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

  return {
    isActive: remainingDays > 0,
    remainingDays,
    subscription,
  };
}

export async function listPayments(subscriptionId: string) {
  return prisma.payment.findMany({
    where: { subscriptionId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createPayment(
  subscriptionId: string,
  amount: number,
  paymentMethod: PaymentMethod = PaymentMethod.BANK_TRANSFER,
) {
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: { plan: true },
  });

  if (!subscription) {
    throw new Error("Abonnement introuvable.");
  }

  const payment = await prisma.payment.create({
    data: {
      subscriptionId,
      transactionId: `PAY-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`,
      amount,
      paymentMethod,
      status: PaymentStatus.COMPLETED,
      paidAt: new Date(),
    },
  });

  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      status: SubscriptionStatus.ACTIVE,
      endDate: addMonths(
        subscription.endDate > new Date() ? subscription.endDate : new Date(),
        1,
      ),
      amountPaid: amount,
      updatedAt: new Date(),
    },
  });

  return payment;
}
