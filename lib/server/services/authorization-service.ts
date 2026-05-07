// Authorization service - Single Responsibility: Permission checks
import type { IAuthorizationService } from "@/lib/interfaces/services";
import type { IDataStore } from "@/lib/interfaces/repository";
import { prisma } from "@/lib/prisma";

export class AuthorizationService implements IAuthorizationService {
  constructor(private dataStore: IDataStore) {}

  async canUserAccessAnimal(
    animalId: string,
    farmId: string,
  ): Promise<boolean> {
    const animal = await prisma.animal.findFirst({
      where: {
        id: animalId,
        farmId: farmId,
      },
    });
    return !!animal;
  }

  // Correction ici : On utilise farmId pour correspondre au schéma
  async canUserAccessEnclosure(
    enclosureId: string,
    farmId: string,
  ): Promise<boolean> {
    const enclosure = await prisma.enclos.findFirst({
      where: {
        id: enclosureId,
        farmId: farmId,
      },
    });

    return !!enclosure;
  }

  // Cette méthode devient redondante avec la précédente,
  // mais gardons-la si votre interface l'exige
  async canAccessEnclosure(
    enclosureId: string,
    farmId: string,
  ): Promise<boolean> {
    return this.canUserAccessEnclosure(enclosureId, farmId);
  }

  async canUserAccessFarm(userId: string, farmId: string): Promise<boolean> {
    const user = await this.dataStore.users.findById(userId);

    if (!user) return false;

    // Dans votre schéma, le lien se fait par farmName ou farmId
    // Logique à adapter selon votre besoin métier :
    return true;
  }
}
