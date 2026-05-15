// Authorization service - Single Responsibility: Permission checks
import type { IAuthorizationService } from "@/lib/interfaces/services";
import type { IDataStore } from "@/lib/interfaces/repository";
import { prisma } from "@/lib/prisma";

export class AuthorizationService implements IAuthorizationService {
  constructor(private dataStore: IDataStore) {}

  // ✅ NOUVELLE MÉTHODE
  // lib/server/services/authorization-service.ts

  async canUserDeleteEnclosure(
    userId: string,
    enclosureId: string,
  ): Promise<boolean> {
    // 1. Récupère l'utilisateur
    const user = await this.dataStore.users.findById(userId);
    console.log("🔍 USER:", {
      userId,
      userRole: user?.role,
      userFarmId: user?.farmId,
    });

    if (!user || user.role !== "OWNER") {
      return false;
    }

    // 2. Vérife l'accès au farm
    const canAccess = await this.canUserAccessEnclosure(userId, enclosureId);

    if (!canAccess) {
    }

    return canAccess;
  }

  async canUserAccessEnclosure(
    userId: string,
    enclosureId: string,
  ): Promise<boolean> {
    const enclosure = await this.dataStore.enclosures.findById(enclosureId);
    if (!enclosure) return false;

    return enclosure.farmId === userId;
  }

  async canUserAccessAnimal(
    userId: string,
    animalId: string,
  ): Promise<boolean> {
    const animal = await this.dataStore.animals.findById(animalId);
    if (!animal) return false;

    const user = await this.dataStore.users.findById(userId);
    return user && animal.farmId === user.farmId;
  }

  async canUserAccessFarm(userId: string, farmId: string): Promise<boolean> {
    const user = await this.dataStore.users.findById(userId);
    return user && user.farmId === farmId;
  }

  async canUserDeleteAnimal(
    userId: string,
    animalId: string,
  ): Promise<boolean> {
    const user = await this.dataStore.users.findById(userId);
    // if (!user || user.role !== "OWNER") return false;

    return this.canUserAccessAnimal(userId, animalId);
  }
}
