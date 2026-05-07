// Health service - Single Responsibility: Health management
import type { IHealthService } from "@/lib/interfaces/services";
import type { IDataStore } from "@/lib/interfaces/repository";
import type { IAuthorizationService } from "@/lib/interfaces/services";
import { prisma } from "@/lib/prisma";

export class HealthService implements IHealthService {
  constructor(
    private dataStore: IDataStore,
    private authService: IAuthorizationService,
  ) {}

  // Utilisation de farmId pour la cohérence avec le reste du projet
  async addVaccine(farmId: string, input: any) {
    const canAccess = await this.authService.canUserAccessAnimal(
      input.animalId,
      farmId,
    );

    if (!canAccess) {
      throw new Error("Unauthorized access to this animal");
    }

    // Dans votre schéma, le modèle est SanteHistorique
    return await prisma.santeHistorique.create({
      data: {
        animalId: input.animalId,
        type: "VACCIN", // Enum TypeSante
        nomTraitement: input.nomVaccin || "Vaccination",
        description: input.description,
        dateAdminion: input.dateVaccination || new Date(),
        prochainRappel: input.prochainRappel,
      },
    });
  }

  async addMedicine(farmId: string, input: any) {
    const canAccess = await this.authService.canUserAccessAnimal(
      input.animalId,
      farmId,
    );

    if (!canAccess) {
      throw new Error("Unauthorized access");
    }

    return await prisma.santeHistorique.create({
      data: {
        animalId: input.animalId,
        type: "MEDICAMENT", // Enum TypeSante
        nomTraitement: input.nomMedicament,
        description: input.description,
        dateAdminion: input.dateApplication || new Date(),
        prochainRappel: input.prochainRappel,
      },
    });
  }

  async getHealthHistory(farmId: string, animalId: string) {
    const canAccess = await this.authService.canUserAccessAnimal(
      animalId,
      farmId,
    );

    if (!canAccess) {
      throw new Error("Unauthorized access");
    }

    // Récupération centralisée dans SanteHistorique
    return await prisma.santeHistorique.findMany({
      where: { animalId },
      orderBy: {
        dateAdminion: "desc",
      },
    });
  }

  async scheduleMedicine(farmId: string, input: any) {
    // 1. Vérification d'autorisation (Cohérence avec le reste du service)
    const canAccess = await this.authService.canUserAccessAnimal(
      input.animalId,
      farmId,
    );

    if (!canAccess) {
      throw new Error("Unauthorized access");
    }

    // 2. Implémentation conforme au schéma SanteHistorique
    return await prisma.santeHistorique.create({
      data: {
        animalId: input.animalId,
        type: "MEDICAMENT", // Enum TypeSante défini dans votre schéma
        nomTraitement: input.nomMedicament,
        description: input.description || "Planification de médicament",
        dateAdminion: new Date(), // Date de création de la planification
        prochainRappel: input.scheduledDate, // La date effective du soin
      },
    });
  }

  // Exemple simplifié pour la planification (schedule)
  async scheduleVaccine(farmId: string, input: any) {
    const canAccess = await this.authService.canUserAccessAnimal(
      input.animalId,
      farmId,
    );

    if (!canAccess) throw new Error("Unauthorized");

    return await prisma.santeHistorique.create({
      data: {
        animalId: input.animalId,
        type: "VACCIN",
        nomTraitement: input.nomVaccin,
        dateAdminion: new Date(), // Date de planification
        prochainRappel: input.scheduledDate,
        description: "Prévu/Planifié",
      },
    });
  }
}
