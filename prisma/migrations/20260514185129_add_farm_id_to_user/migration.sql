-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "alimentation";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "animals";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "configuration";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "couvaison";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "enclos";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "finances";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "oeufs";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "payments";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "sante";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "subscriptions";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "users";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "vente";

-- CreateEnum
CREATE TYPE "users"."UserRole" AS ENUM ('OWNER', 'WORKER', 'ADMIN');

-- CreateEnum
CREATE TYPE "subscriptions"."SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING');

-- CreateEnum
CREATE TYPE "subscriptions"."RenewalFrequency" AS ENUM ('MONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "payments"."PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'PAYPAL');

-- CreateEnum
CREATE TYPE "payments"."PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "animals"."Sexe" AS ENUM ('MALE', 'FEMELLE');

-- CreateEnum
CREATE TYPE "animals"."EtatAnimal" AS ENUM ('POUSSIN', 'JEUNE', 'REPRODUCTRICE', 'EN_REPOS', 'RETRAITE', 'DECEDE', 'ACTIF');

-- CreateEnum
CREATE TYPE "sante"."TypeSante" AS ENUM ('VACCIN', 'MEDICAMENT', 'OBSERVATION');

-- CreateEnum
CREATE TYPE "enclos"."EnclosStatus" AS ENUM ('ACTIF', 'SUPPRIME');

-- CreateEnum
CREATE TYPE "oeufs"."QualiteOeuf" AS ENUM ('EXCELLENT', 'BON', 'NORMAL', 'DEFAUT', 'REJETE');

-- CreateEnum
CREATE TYPE "couvaison"."NoteCouvai" AS ENUM ('A', 'B', 'C', 'D', 'E');

-- CreateEnum
CREATE TYPE "vente"."StatutCommande" AS ENUM ('EN_ATTENTE', 'CONFIRMEE', 'LIVREE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "finances"."TypeTransaction" AS ENUM ('REVENU', 'DEPENSE');

-- CreateTable
CREATE TABLE "users"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "farmName" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "role" "users"."UserRole" NOT NULL DEFAULT 'OWNER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users"."refresh_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions"."subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "subscriptions"."SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "renewalFrequency" "subscriptions"."RenewalFrequency" NOT NULL DEFAULT 'MONTHLY',
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "isAutoRenew" BOOLEAN NOT NULL DEFAULT true,
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions"."subscription_plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "maxAnimals" INTEGER NOT NULL DEFAULT -1,
    "maxUsers" INTEGER NOT NULL DEFAULT 1,
    "features" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments"."payments" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "paymentMethod" "payments"."PaymentMethod" NOT NULL,
    "status" "payments"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration"."config_vaccin_constantes" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "age_mois" INTEGER NOT NULL,
    "rappel_mois" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "config_vaccin_constantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration"."config_medicament_constantes" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "dosage" TEXT NOT NULL,
    "duree_jours" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "config_medicament_constantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration"."config_couvaison_duration" (
    "id" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL DEFAULT 21,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "config_couvaison_duration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration"."config_race_constantes" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "config_race_constantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration"."config_type_enclos_constantes" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "capaciteMax" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "config_type_enclos_constantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration"."config_categorie_oeuf_constantes" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "poids_min" INTEGER NOT NULL,
    "poids_max" INTEGER NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "config_categorie_oeuf_constantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animals"."animals" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "numIdentif" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "sexe" "animals"."Sexe" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'alive',
    "deathDate" TIMESTAMP(3),
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "dateArrivee" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "etat" "animals"."EtatAnimal" NOT NULL DEFAULT 'ACTIF',
    "poids" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "animals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sante"."sante_historiques" (
    "id" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "type" "sante"."TypeSante" NOT NULL,
    "nomTraitement" TEXT NOT NULL,
    "description" TEXT,
    "dateAdminion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prochainRappel" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sante_historiques_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sante"."notification_sante" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "dateRappel" TIMESTAMP(3) NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_sante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enclos"."enclos" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "capaciteMax" INTEGER NOT NULL,
    "localisation" TEXT,
    "temperature" DOUBLE PRECISION,
    "humidite" DOUBLE PRECISION,
    "notes" TEXT,
    "status" "enclos"."EnclosStatus" NOT NULL DEFAULT 'ACTIF',
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enclos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enclos"."animal_enclos_associations" (
    "id" TEXT NOT NULL,
    "enclosId" TEXT NOT NULL,
    "animalNum" TEXT NOT NULL,
    "dateEntree" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateSortie" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "animal_enclos_associations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oeufs"."oeuf_produits" (
    "id" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "dateProduction" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categorie" TEXT NOT NULL,
    "poids" INTEGER NOT NULL,
    "qualite" "oeufs"."QualiteOeuf" NOT NULL,
    "stockageId" TEXT,
    "vendu" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oeuf_produits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "couvaison"."couvaisons" (
    "id" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateFin" TIMESTAMP(3),
    "nombreOeufs" INTEGER NOT NULL,
    "nombrePoussins" INTEGER NOT NULL DEFAULT 0,
    "tauxReussite" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "note" "couvaison"."NoteCouvai" NOT NULL DEFAULT 'C',
    "dureeJours" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "couvaisons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alimentation"."formule_alimentations" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "ingredients" TEXT[],
    "prix" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "formule_alimentations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alimentation"."distribution_alimentations" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "formuleId" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distribution_alimentations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vente"."commandes" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "dateCommande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateExpedition" TIMESTAMP(3),
    "total" DOUBLE PRECISION NOT NULL,
    "statut" "vente"."StatutCommande" NOT NULL DEFAULT 'EN_ATTENTE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commandes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vente"."clients" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "adresse" TEXT,
    "ville" TEXT,
    "codePostal" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vente"."ligne_commandes" (
    "id" TEXT NOT NULL,
    "commandeId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prixUnitaire" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ligne_commandes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finances"."transactions" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "type" "finances"."TypeTransaction" NOT NULL,
    "description" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categorie" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finances"."soldes" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "soldes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_farmId_key" ON "users"."users"("farmId");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "users"."refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_status_key" ON "subscriptions"."subscriptions"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_name_key" ON "subscriptions"."subscription_plans"("name");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"."payments"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "config_vaccin_constantes_nom_key" ON "configuration"."config_vaccin_constantes"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "config_medicament_constantes_nom_key" ON "configuration"."config_medicament_constantes"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "config_race_constantes_nom_key" ON "configuration"."config_race_constantes"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "config_type_enclos_constantes_nom_key" ON "configuration"."config_type_enclos_constantes"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "config_categorie_oeuf_constantes_nom_key" ON "configuration"."config_categorie_oeuf_constantes"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "animals_numIdentif_key" ON "animals"."animals"("numIdentif");

-- CreateIndex
CREATE UNIQUE INDEX "soldes_farmId_key" ON "finances"."soldes"("farmId");

-- AddForeignKey
ALTER TABLE "users"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions"."subscriptions" ADD CONSTRAINT "subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "subscriptions"."subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions"."subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments"."payments" ADD CONSTRAINT "payments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"."subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enclos"."animal_enclos_associations" ADD CONSTRAINT "animal_enclos_associations_enclosId_fkey" FOREIGN KEY ("enclosId") REFERENCES "enclos"."enclos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vente"."commandes" ADD CONSTRAINT "commandes_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "vente"."clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vente"."ligne_commandes" ADD CONSTRAINT "ligne_commandes_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "vente"."commandes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
