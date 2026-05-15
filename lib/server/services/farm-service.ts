import {
  EtatAnimal,
  PaymentMethod,
  Prisma,
  QualiteOeuf,
  StatutCommande,
  TypeSante,
  TypeTransaction,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type {
  AnimalView,
  CouvaisonView,
  DashboardOverview,
  EnclosView,
} from "@/types/dashboard";

function farmIdForUser(userId: string) {
  return userId;
}

function addDays(date: Date, days: number) {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
}

export function calculateAgeMonths(dateNaissance: Date) {
  const now = new Date();
  let months =
    now.getMonth() -
    dateNaissance.getMonth() +
    12 * (now.getFullYear() - dateNaissance.getFullYear());

  if (now.getDate() < dateNaissance.getDate()) {
    months -= 1;
  }

  return Math.max(0, months);
}

export function calculateAnimalStateByAge(ageMois: number) {
  if (ageMois < 1) {
    return "POUSSIN";
  }

  if (ageMois < 4) {
    return "JEUNE";
  }

  if (ageMois < 72) {
    return "REPRODUCTRICE";
  }

  return "EN_REPOS";
}

export function getCouvaisonNoteDescription(note: string) {
  const descriptions: Record<string, string> = {
    A: "Excellente couveuse",
    B: "Tres bonne couveuse",
    C: "Bonne couveuse",
    D: "Couveuse acceptable",
    E: "Couveuse faible",
  };

  return descriptions[note] ?? "Non note";
}

function noteToNumber(note: string) {
  const mapping: Record<string, number> = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
    E: 1,
  };

  return mapping[note] ?? 0;
}

function toAnimalView(animal: {
  id: string;
  farmId: string;
  numIdentif: string;
  race: string;
  sexe: Prisma.JsonValue | string;
  dateNaissance: Date;
  dateArrivee: Date;
  etat: Prisma.JsonValue | string;
  poids: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  deathDate: Date | null;
}): AnimalView {
  const ageMois = calculateAgeMonths(animal.dateNaissance);

  return {
    ...animal,
    // Assure-toi que status est bien transmis
    status: animal.status || "alive",
    deathDate: animal.deathDate || null,
    sexe: animal.sexe as AnimalView["sexe"],
    etat: animal.etat as AnimalView["etat"],
    ageMois,
    etatParAge: calculateAnimalStateByAge(ageMois),
  };
}
function toCouvaisonView(couvaison: {
  id: string;
  animalId: string;
  farmId: string;
  dateDebut: Date;
  dateFin: Date | null;
  nombreOeufs: number;
  nombrePoussins: number;
  tauxReussite: number;
  note: string;
  dureeJours: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}): CouvaisonView {
  const performanceScore = couvaison.dateFin
    ? (couvaison.nombrePoussins / Math.max(couvaison.nombreOeufs, 1)) *
      noteToNumber(couvaison.note)
    : 0;

  return {
    ...couvaison,
    note: couvaison.note as CouvaisonView["note"],
    noteDescription: getCouvaisonNoteDescription(couvaison.note),
    noteLettre: couvaison.note,
    performanceScore,
  };
}

async function requireAnimalForFarm(userId: string, animalId: string) {
  const animal = await prisma.animal.findFirst({
    where: {
      id: animalId,
      farmId: farmIdForUser(userId),
    },
  });

  if (!animal) {
    throw new Error("Animal introuvable.");
  }

  return animal;
}

async function requireEnclosForFarm(userId: string, enclosId: string) {
  const enclos = await prisma.enclos.findFirst({
    where: {
      id: enclosId,
      farmId: farmIdForUser(userId),
    },
  });

  if (!enclos) {
    throw new Error("Enclos introuvable.");
  }

  return enclos;
}

async function requireClientForFarm(userId: string, clientId: string) {
  const client = await prisma.client.findFirst({
    where: {
      id: clientId,
      farmId: farmIdForUser(userId),
    },
  });

  if (!client) {
    throw new Error("Client introuvable.");
  }

  return client;
}

export async function listVaccins() {
  return prisma.configVaccinConstante.findMany({
    where: { isActive: true },
    orderBy: { nom: "asc" },
  });
}

export async function getVaccin(id: string) {
  return prisma.configVaccinConstante.findUnique({
    where: { id },
  });
}

export async function listMedicaments() {
  return prisma.configMedicamentConstante.findMany({
    where: { isActive: true },
    orderBy: { nom: "asc" },
  });
}

export async function getMedicament(id: string) {
  return prisma.configMedicamentConstante.findUnique({
    where: { id },
  });
}

export async function getCouvaisonDuration() {
  return (
    (await prisma.configCouvaisonDuration.findFirst()) ?? {
      durationDays: 21,
    }
  );
}

export async function updateCouvaisonDuration(durationDays: number) {
  const current = await prisma.configCouvaisonDuration.findFirst();

  if (current) {
    return prisma.configCouvaisonDuration.update({
      where: { id: current.id },
      data: { durationDays },
    });
  }

  return prisma.configCouvaisonDuration.create({
    data: { durationDays },
  });
}

export async function listRaces() {
  return prisma.configRaceConstante.findMany({
    where: { isActive: true },
    orderBy: { nom: "asc" },
  });
}

export async function listEnclosTypes() {
  return prisma.configTypeEnclosConstante.findMany({
    where: { isActive: true },
    orderBy: { nom: "asc" },
  });
}

export async function listOeufCategories() {
  return prisma.configCategorieOeufConstante.findMany({
    where: { isActive: true },
    orderBy: { nom: "asc" },
  });
}

export async function createAnimal(
  userId: string,
  input: {
    numIdentif: string;
    race: string;
    sexe: "MALE" | "FEMELLE";
    dateNaissance: string;
    notes?: string;
  },
) {
  const animal = await prisma.animal.create({
    data: {
      farmId: farmIdForUser(userId),
      numIdentif: input.numIdentif.trim(),
      race: input.race.trim(),
      sexe: input.sexe,
      dateNaissance: new Date(input.dateNaissance),
      notes: input.notes?.trim() || null,
    },
  });

  return toAnimalView(animal);
}

export async function listAnimals(userId: string) {
  const animals = await prisma.animal.findMany({
    where: { farmId: farmIdForUser(userId) },
    orderBy: { createdAt: "desc" },
  });

  return animals.map((animal) => toAnimalView(animal));
}

export async function getAnimal(userId: string, animalId: string) {
  const animal = await requireAnimalForFarm(userId, animalId);
  return toAnimalView(animal);
}

export async function updateAnimal(
  userId: string,
  animalId: string,
  input: {
    poids?: number;
    etat?: EtatAnimal;
    notes?: string;
  },
) {
  await requireAnimalForFarm(userId, animalId);

  const animal = await prisma.animal.update({
    where: { id: animalId },
    data: {
      poids: input.poids ?? undefined,
      etat: input.etat ?? undefined,
      notes: input.notes ?? undefined,
    },
  });

  return toAnimalView(animal);
}

export async function softDeleteAnimal(userId: string, animalId: string) {
  await requireAnimalForFarm(userId, animalId);

  await prisma.animal.update({
    where: { id: animalId },
    data: { etat: EtatAnimal.DECEDE },
  });

  return {
    message: "Animal marque comme decede.",
  };
}

export async function addVaccin(
  userId: string,
  input: {
    animalId: string;
    nomTraitement: string;
    configVaccinId: string;
  },
) {
  const animal = await requireAnimalForFarm(userId, input.animalId);
  const config = await getVaccin(input.configVaccinId);

  if (!config) {
    throw new Error("Vaccin introuvable.");
  }

  const prochainRappel = new Date();
  prochainRappel.setMonth(
    prochainRappel.getMonth() + Number(config.rappel_mois || 0),
  );

  const record = await prisma.santeHistorique.create({
    data: {
      animalId: animal.id,
      type: TypeSante.VACCIN,
      nomTraitement: input.nomTraitement.trim(),
      prochainRappel,
    },
  });

  await prisma.notificationSante.create({
    data: {
      farmId: animal.farmId,
      animalId: animal.id,
      type: "VACCIN_RAPPEL",
      message: `Rappel vaccin ${input.nomTraitement} pour ${animal.numIdentif}`,
      dateRappel: prochainRappel,
    },
  });

  return record;
}

export async function addMedicament(
  userId: string,
  input: {
    animalId: string;
    nomTraitement: string;
    configMedicamentId?: string;
    duree_jours?: number;
  },
) {
  const animal = await requireAnimalForFarm(userId, input.animalId);

  let dureeJours = input.duree_jours;
  if (input.configMedicamentId) {
    const config = await getMedicament(input.configMedicamentId);
    if (!config) {
      throw new Error("Medicament introuvable.");
    }
    dureeJours = dureeJours ?? config.duree_jours;
  }

  const record = await prisma.santeHistorique.create({
    data: {
      animalId: animal.id,
      type: TypeSante.MEDICAMENT,
      nomTraitement: input.nomTraitement.trim(),
    },
  });

  const prochainRappel = addDays(new Date(), Number(dureeJours || 0));

  await prisma.notificationSante.create({
    data: {
      farmId: animal.farmId,
      animalId: animal.id,
      type: "MEDICAMENT_RAPPEL",
      message: `Fin du traitement ${input.nomTraitement} pour ${animal.numIdentif}`,
      dateRappel: prochainRappel,
    },
  });

  return record;
}

export async function listNotifications(userId: string) {
  return prisma.notificationSante.findMany({
    where: {
      farmId: farmIdForUser(userId),
    },
    orderBy: { dateRappel: "asc" },
  });
}

export async function markNotificationRead(
  userId: string,
  notificationId: string,
) {
  const notification = await prisma.notificationSante.findFirst({
    where: {
      id: notificationId,
      farmId: farmIdForUser(userId),
    },
  });

  if (!notification) {
    throw new Error("Notification introuvable.");
  }

  return prisma.notificationSante.update({
    where: { id: notification.id },
    data: { isRead: true },
  });
}

export async function listSanteHistory(userId: string, animalId?: string) {
  if (animalId) {
    await requireAnimalForFarm(userId, animalId);
  }

  const animalIds = animalId
    ? [animalId]
    : (
        await prisma.animal.findMany({
          where: { farmId: farmIdForUser(userId) },
          select: { id: true },
        })
      ).map((animal) => animal.id);

  return prisma.santeHistorique.findMany({
    where: {
      animalId: {
        in: animalIds.length > 0 ? animalIds : ["__none__"],
      },
    },
    orderBy: { dateAdminion: "desc" },
  });
}

export async function createEnclos(
  userId: string,
  input: {
    nom: string;
    type: string;
    capaciteMax: number;
    localisation?: string;
  },
) {
  return prisma.enclos.create({
    data: {
      farmId: farmIdForUser(userId),
      nom: input.nom.trim(),
      type: input.type.trim(),
      capaciteMax: input.capaciteMax,
      localisation: input.localisation?.trim() || null,
    },
  });
}

export async function listEnclos(userId: string): Promise<EnclosView[]> {
  return prisma.enclos.findMany({
    where: {
      farmId: farmIdForUser(userId),
      status: "ACTIF",
    },
    include: {
      animauxActuels: {
        where: { dateSortie: null },
        orderBy: { dateEntree: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function assignAnimalToEnclos(
  userId: string,
  enclosId: string,
  input: {
    animalNum: string;
    notes?: string;
  },
) {
  await requireEnclosForFarm(userId, enclosId);

  await prisma.animalEnclosAssociation.updateMany({
    where: {
      animalNum: input.animalNum,
      dateSortie: null,
    },
    data: {
      dateSortie: new Date(),
    },
  });

  return prisma.animalEnclosAssociation.create({
    data: {
      enclosId,
      animalNum: input.animalNum.trim(),
      notes: input.notes?.trim() || null,
    },
  });
}

export async function updateEnclosClimate(
  userId: string,
  enclosId: string,
  input: {
    temperature?: number;
    humidite?: number;
  },
) {
  await requireEnclosForFarm(userId, enclosId);

  return prisma.enclos.update({
    where: { id: enclosId },
    data: {
      temperature: input.temperature ?? undefined,
      humidite: input.humidite ?? undefined,
    },
  });
}

export async function createOeuf(
  userId: string,
  input: {
    animalId: string;
    categorie: string;
    poids: number;
    qualite: QualiteOeuf;
  },
) {
  await requireAnimalForFarm(userId, input.animalId);

  return prisma.oeufProduit.create({
    data: {
      animalId: input.animalId,
      farmId: farmIdForUser(userId),
      categorie: input.categorie.trim(),
      poids: input.poids,
      qualite: input.qualite,
    },
  });
}

export async function listOeufs(userId: string) {
  return prisma.oeufProduit.findMany({
    where: { farmId: farmIdForUser(userId) },
    orderBy: { dateProduction: "desc" },
  });
}

export async function listAnimalOeufs(userId: string, animalId: string) {
  await requireAnimalForFarm(userId, animalId);
  const oeufs = await prisma.oeufProduit.findMany({
    where: { animalId },
    orderBy: { dateProduction: "desc" },
  });

  const total = oeufs.length;
  const excellents = oeufs.filter(
    (oeuf) => oeuf.qualite === "EXCELLENT",
  ).length;

  return {
    total,
    excellents,
    oeufs,
  };
}

export async function sellOeuf(userId: string, oeufId: string) {
  const oeuf = await prisma.oeufProduit.findFirst({
    where: {
      id: oeufId,
      farmId: farmIdForUser(userId),
    },
  });

  if (!oeuf) {
    throw new Error("Oeuf introuvable.");
  }

  return prisma.oeufProduit.update({
    where: { id: oeufId },
    data: { vendu: true },
  });
}

function autoCouvaisonNote(tauxReussite: number) {
  if (tauxReussite >= 90) {
    return "A";
  }
  if (tauxReussite >= 75) {
    return "B";
  }
  if (tauxReussite >= 60) {
    return "C";
  }
  if (tauxReussite >= 40) {
    return "D";
  }
  return "E";
}

export async function createCouvaison(
  userId: string,
  input: {
    animalId: string;
    nombreOeufs: number;
    notes?: string;
  },
) {
  await requireAnimalForFarm(userId, input.animalId);
  const config = await getCouvaisonDuration();
  const dureeJours = Number(config.durationDays || 21);
  const dateFin = addDays(new Date(), dureeJours);

  const couvaison = await prisma.couvaison.create({
    data: {
      animalId: input.animalId,
      farmId: farmIdForUser(userId),
      nombreOeufs: input.nombreOeufs,
      dureeJours,
      notes: input.notes?.trim() || null,
      dateFin,
    },
  });

  return toCouvaisonView(couvaison);
}

export async function finishCouvaison(
  userId: string,
  couvaisonId: string,
  input: {
    nombrePoussins: number;
    note?: string;
  },
) {
  const couvaison = await prisma.couvaison.findFirst({
    where: {
      id: couvaisonId,
      farmId: farmIdForUser(userId),
    },
  });

  if (!couvaison) {
    throw new Error("Couvaison introuvable.");
  }

  const tauxReussite =
    (input.nombrePoussins / Math.max(couvaison.nombreOeufs, 1)) * 100;

  const updated = await prisma.couvaison.update({
    where: { id: couvaison.id },
    data: {
      dateFin: new Date(),
      nombrePoussins: input.nombrePoussins,
      note: (input.note ||
        autoCouvaisonNote(tauxReussite)) as CouvaisonView["note"],
      tauxReussite,
    },
  });

  return toCouvaisonView(updated);
}

export async function listAnimalCouvaisons(userId: string, animalId: string) {
  await requireAnimalForFarm(userId, animalId);

  const couvaisons = await prisma.couvaison.findMany({
    where: { animalId, farmId: farmIdForUser(userId) },
    orderBy: { dateDebut: "desc" },
  });

  return couvaisons.map((couvaison) => toCouvaisonView(couvaison));
}

export async function getCouvaisonStats(userId: string, animalId: string) {
  const couvaisons = await listAnimalCouvaisons(userId, animalId);
  const totalCouvaisons = couvaisons.length;
  const totalOeufs = couvaisons.reduce(
    (sum, couvaison) => sum + couvaison.nombreOeufs,
    0,
  );
  const totalPoussins = couvaisons.reduce(
    (sum, couvaison) => sum + couvaison.nombrePoussins,
    0,
  );
  const tauxMoyen = totalOeufs > 0 ? (totalPoussins / totalOeufs) * 100 : 0;
  const notes = couvaisons
    .filter((couvaison) => couvaison.dateFin)
    .map((couvaison) => noteToNumber(couvaison.note));
  const noteMoyenne =
    notes.length > 0
      ? notes.reduce((sum, value) => sum + value, 0) / notes.length
      : 0;

  return {
    totalCouvaisons,
    totalOeufs,
    totalPoussins,
    tauxReussiteMoyen: Number(tauxMoyen.toFixed(2)),
    noteMoyenne: Number(noteMoyenne.toFixed(2)),
    bonneCouveuseScore: Number(
      couvaisons
        .reduce((sum, couvaison) => sum + couvaison.performanceScore, 0)
        .toFixed(2),
    ),
  };
}

export async function createFormule(
  userId: string,
  input: {
    nom: string;
    description?: string;
    ingredients: string[];
    prix: number;
  },
) {
  return prisma.formuleAlimentation.create({
    data: {
      farmId: farmIdForUser(userId),
      nom: input.nom.trim(),
      description: input.description?.trim() || null,
      ingredients: input.ingredients,
      prix: input.prix,
    },
  });
}

export async function listFormules(userId: string) {
  return prisma.formuleAlimentation.findMany({
    where: { farmId: farmIdForUser(userId), isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createDistribution(
  userId: string,
  input: {
    formuleId: string;
    quantite: number;
    notes?: string;
  },
) {
  const formule = await prisma.formuleAlimentation.findFirst({
    where: {
      id: input.formuleId,
      farmId: farmIdForUser(userId),
    },
  });

  if (!formule) {
    throw new Error("Formule introuvable.");
  }

  return prisma.distributionAlimentation.create({
    data: {
      farmId: farmIdForUser(userId),
      formuleId: input.formuleId,
      quantite: input.quantite,
      notes: input.notes?.trim() || null,
    },
  });
}

export async function listDistributions(userId: string) {
  return prisma.distributionAlimentation.findMany({
    where: { farmId: farmIdForUser(userId) },
    orderBy: { date: "desc" },
  });
}

export async function createClient(
  userId: string,
  input: {
    nom: string;
    email: string;
    telephone?: string;
    adresse?: string;
    ville?: string;
    codePostal?: string;
  },
) {
  return prisma.client.create({
    data: {
      farmId: farmIdForUser(userId),
      nom: input.nom.trim(),
      email: input.email.trim().toLowerCase(),
      telephone: input.telephone?.trim() || null,
      adresse: input.adresse?.trim() || null,
      ville: input.ville?.trim() || null,
      codePostal: input.codePostal?.trim() || null,
    },
  });
}

export async function listClients(userId: string) {
  return prisma.client.findMany({
    where: { farmId: farmIdForUser(userId) },
    orderBy: { createdAt: "desc" },
  });
}

export async function createCommande(
  userId: string,
  input: {
    clientId: string;
    total: number;
    items: Array<{
      description: string;
      quantite: number;
      prixUnitaire: number;
    }>;
    notes?: string;
  },
) {
  await requireClientForFarm(userId, input.clientId);

  return prisma.commande.create({
    data: {
      farmId: farmIdForUser(userId),
      clientId: input.clientId,
      total: input.total,
      notes: input.notes?.trim() || null,
      items: {
        create: input.items.map((item) => ({
          description: item.description.trim(),
          quantite: item.quantite,
          prixUnitaire: item.prixUnitaire,
        })),
      },
    },
    include: {
      client: true,
      items: true,
    },
  });
}

export async function listCommandes(userId: string) {
  return prisma.commande.findMany({
    where: { farmId: farmIdForUser(userId) },
    include: {
      client: true,
      items: true,
    },
    orderBy: { dateCommande: "desc" },
  });
}

export async function updateCommandeStatus(
  userId: string,
  commandeId: string,
  statut: StatutCommande,
) {
  const commande = await prisma.commande.findFirst({
    where: {
      id: commandeId,
      farmId: farmIdForUser(userId),
    },
  });

  if (!commande) {
    throw new Error("Commande introuvable.");
  }

  return prisma.commande.update({
    where: { id: commande.id },
    data: { statut },
    include: { client: true, items: true },
  });
}

export async function createTransaction(
  userId: string,
  input: {
    type: TypeTransaction;
    description: string;
    montant: number;
    categorie: string;
  },
) {
  const farmId = farmIdForUser(userId);

  const transaction = await prisma.transaction.create({
    data: {
      farmId,
      type: input.type,
      description: input.description.trim(),
      montant: input.montant,
      categorie: input.categorie.trim(),
    },
  });

  const solde = await prisma.solde.findUnique({
    where: { farmId },
  });

  const nouveauTotal =
    input.type === TypeTransaction.REVENU
      ? (solde?.total || 0) + input.montant
      : (solde?.total || 0) - input.montant;

  if (solde) {
    await prisma.solde.update({
      where: { farmId },
      data: { total: nouveauTotal },
    });
  } else {
    await prisma.solde.create({
      data: {
        farmId,
        total: nouveauTotal,
      },
    });
  }

  return transaction;
}

export async function listTransactions(userId: string) {
  return prisma.transaction.findMany({
    where: { farmId: farmIdForUser(userId) },
    orderBy: { date: "desc" },
  });
}

export async function getSolde(userId: string) {
  return (
    (await prisma.solde.findUnique({
      where: { farmId: farmIdForUser(userId) },
    })) ?? { farmId: farmIdForUser(userId), total: 0 }
  );
}

export async function getRapport(userId: string) {
  const transactions = await listTransactions(userId);

  const revenus = transactions
    .filter((transaction) => transaction.type === TypeTransaction.REVENU)
    .reduce((sum, transaction) => sum + transaction.montant, 0);

  const depenses = transactions
    .filter((transaction) => transaction.type === TypeTransaction.DEPENSE)
    .reduce((sum, transaction) => sum + transaction.montant, 0);

  const parCategorie = transactions.reduce<Record<string, number>>(
    (acc, transaction) => {
      const key = transaction.categorie || "Autre";
      acc[key] = (acc[key] || 0) + transaction.montant;
      return acc;
    },
    {},
  );

  return {
    revenus,
    depenses,
    profit: revenus - depenses,
    parCategorie,
  };
}

export async function getDashboardData(
  user: DashboardOverview["user"],
  subscription: DashboardOverview["subscription"],
  payments: DashboardOverview["payments"],
): Promise<DashboardOverview> {
  const [
    animals,
    notifications,
    historiqueSante,
    enclos,
    oeufs,
    couvaisonsRaw,
    formules,
    distributions,
    clients,
    commandes,
    transactions,
    solde,
    rapport,
    vaccins,
    medicaments,
    couvaisonDuration,
    races,
    enclosTypes,
    oeufCategories,
  ] = await Promise.all([
    listAnimals(user.id),
    listNotifications(user.id),
    listSanteHistory(user.id),
    listEnclos(user.id),
    listOeufs(user.id),
    prisma.couvaison.findMany({
      where: { farmId: farmIdForUser(user.id) },
      orderBy: { dateDebut: "desc" },
    }),
    listFormules(user.id),
    listDistributions(user.id),
    listClients(user.id),
    listCommandes(user.id),
    listTransactions(user.id),
    getSolde(user.id),
    getRapport(user.id),
    listVaccins(),
    listMedicaments(),
    getCouvaisonDuration(),
    listRaces(),
    listEnclosTypes(),
    listOeufCategories(),
  ]);

  const couvaisons = couvaisonsRaw.map((couvaison) =>
    toCouvaisonView(couvaison),
  );
  const monthlyProfit = transactions
    .filter((transaction) => {
      const now = new Date();
      return (
        transaction.date.getMonth() === now.getMonth() &&
        transaction.date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, transaction) => {
      if (transaction.type === TypeTransaction.REVENU) {
        return sum + transaction.montant;
      }

      return sum - transaction.montant;
    }, 0);

  return {
    user,
    plans: subscription?.plan
      ? await prisma.subscriptionPlan.findMany({
          where: { isActive: true },
          orderBy: { price: "asc" },
        })
      : await prisma.subscriptionPlan.findMany({
          where: { isActive: true },
          orderBy: { price: "asc" },
        }),
    subscription,
    payments,
    animals,
    notifications,
    historiqueSante,
    enclos,
    oeufs,
    couvaisons,
    formules,
    distributions,
    clients,
    commandes,
    transactions,
    solde,
    rapport,
    config: {
      vaccins,
      medicaments,
      couvaisonDuration,
      races,
      enclosTypes,
      oeufCategories,
    },
    stats: {
      totalAnimals: animals.length,
      totalEggs: oeufs.length,
      totalSales: commandes.length,
      unreadNotifications: notifications.filter((item) => !item.isRead).length,
      activeEnclos: enclos.length,
      monthlyProfit,
    },
  };
}

export async function createManualPayment(
  userId: string,
  input: {
    subscriptionId: string;
    amount: number;
    paymentMethod?: PaymentMethod;
  },
) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      id: input.subscriptionId,
      userId,
    },
  });

  if (!subscription) {
    throw new Error("Abonnement introuvable.");
  }

  const { createPayment } =
    await import("@/lib/server/services/subscription-service");
  return createPayment(
    input.subscriptionId,
    input.amount,
    input.paymentMethod ?? PaymentMethod.BANK_TRANSFER,
  );
}
