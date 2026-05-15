import type { IEnclosureService } from "@/lib/interfaces/services";
import type { IDataStore } from "@/lib/interfaces/repository";
import type { IAuthorizationService } from "@/lib/interfaces/services";
import {
  EnclosureNotFoundError,
  ForbiddenError,
  EnclosureNotEmptyError,
} from "@/lib/server/services/errors"; // ✅ CHANGE ICI

export class EnclosureService implements IEnclosureService {
  constructor(
    private dataStore: IDataStore,
    private authService: IAuthorizationService,
  ) {}

  async createEnclosure(userId: string, input: any) {
    const canAccess = await this.authService.canUserAccessFarm(
      userId,
      input.farmId,
    );
    if (!canAccess) {
      throw new ForbiddenError("Unauthorized access to farm");
    }

    const enclosure = await this.dataStore.enclosures.create({
      ...input,
      userId,
      createdAt: new Date(),
    });

    return enclosure;
  }

  async updateEnclosure(userId: string, enclosureId: string, input: any) {
    const enclosure = await this.dataStore.enclosures.findById(enclosureId);
    if (!enclosure) {
      throw new EnclosureNotFoundError(enclosureId);
    }

    const canAccess = await this.authService.canUserAccessEnclosure(
      userId,
      enclosureId,
    );
    if (!canAccess) {
      throw new ForbiddenError("Unauthorized access");
    }

    const updated = await this.dataStore.enclosures.update(enclosureId, {
      ...input,
      updatedAt: new Date(),
    });

    return updated;
  }

  async deleteEnclosure(userId: string, enclosureId: string): Promise<void> {
    // 1. Vérifier l'existence
    const enclosure = await this.dataStore.enclosures.findById(enclosureId);
    if (!enclosure) {
      throw new EnclosureNotFoundError(enclosureId);
    }

    // 2. Vérifier les permissions (OWNER ONLY)
    const canDelete = await this.authService.canUserDeleteEnclosure(
      userId,
      enclosureId,
    );
    if (!canDelete) {
      throw new ForbiddenError("Only farm owners can delete enclosures");
    }

    // 3. Vérifier s'il y a des animaux actifs
    const activeAnimals =
      await this.dataStore.enclosures.findActiveAnimalAssociations(enclosureId);

    if (activeAnimals.length > 0) {
      throw new EnclosureNotEmptyError(activeAnimals.length);
    }

    // 4. Soft delete dans une transaction
    await this.dataStore.transaction(async (tx) => {
      // Marquer toutes les associations comme sorties
      await tx.enclosures.updateAnimalAssociations(enclosureId, {
        dateSortie: new Date(),
      });

      // Soft delete l'enclos
      await tx.enclosures.update(enclosureId, {
        status: "SUPPRIME",
        deletedAt: new Date(),
        deletedBy: userId,
      });
    });
  }

  async listEnclosures(userId: string) {
    return this.dataStore.enclosures.findMany({
      where: {
        userId,
        status: "ACTIF", // 👈 C'EST IMPORTANT
      },
    });
  }

  async assignAnimalsToEnclosure(
    userId: string,
    enclosureId: string,
    animalIds: string[],
  ) {
    const enclosure = await this.dataStore.enclosures.findById(enclosureId);
    if (!enclosure) {
      throw new EnclosureNotFoundError(enclosureId);
    }

    const canAccess = await this.authService.canUserAccessEnclosure(
      userId,
      enclosureId,
    );
    if (!canAccess) {
      throw new ForbiddenError("Unauthorized access");
    }

    // Verify all animals belong to the user
    for (const animalId of animalIds) {
      const canAccessAnimal = await this.authService.canUserAccessAnimal(
        userId,
        animalId,
      );
      if (!canAccessAnimal) {
        throw new ForbiddenError(`Unauthorized access to animal ${animalId}`);
      }
    }

    // Update animals with enclosure assignment
    await this.dataStore.animals.update(enclosureId, {
      enclos: { connect: animalIds.map((id) => ({ id })) },
    });
  }
}
