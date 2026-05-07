// Enclosure service - Single Responsibility: Enclosure management
import type { IEnclosureService } from "@/lib/interfaces/services";
import type { IDataStore } from "@/lib/interfaces/repository";
import type { IAuthorizationService } from "@/lib/interfaces/services";

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
      throw new Error("Unauthorized access to farm");
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
      throw new Error("Enclosure not found");
    }

    const canAccess = await this.authService.canUserAccessEnclosure(
      userId,
      enclosureId,
    );
    if (!canAccess) {
      throw new Error("Unauthorized access");
    }

    const updated = await this.dataStore.enclosures.update(enclosureId, {
      ...input,
      updatedAt: new Date(),
    });

    return updated;
  }

  async deleteEnclosure(userId: string, enclosureId: string) {
    const enclosure = await this.dataStore.enclosures.findById(enclosureId);
    if (!enclosure) {
      throw new Error("Enclosure not found");
    }

    const canAccess = await this.authService.canUserAccessEnclosure(
      userId,
      enclosureId,
    );
    if (!canAccess) {
      throw new Error("Unauthorized access");
    }

    await this.dataStore.enclosures.delete(enclosureId);
  }

  async listEnclosures(userId: string) {
    return this.dataStore.enclosures.findMany({
      where: { userId },
    });
  }

  async assignAnimalsToEnclosure(
    userId: string,
    enclosureId: string,
    animalIds: string[],
  ) {
    const enclosure = await this.dataStore.enclosures.findById(enclosureId);
    if (!enclosure) {
      throw new Error("Enclosure not found");
    }

    const canAccess = await this.authService.canUserAccessEnclosure(
      userId,
      enclosureId,
    );
    if (!canAccess) {
      throw new Error("Unauthorized access");
    }

    // Verify all animals belong to the user
    for (const animalId of animalIds) {
      const canAccessAnimal = await this.authService.canUserAccessAnimal(
        userId,
        animalId,
      );
      if (!canAccessAnimal) {
        throw new Error(`Unauthorized access to animal ${animalId}`);
      }
    }

    // Update animals with enclosure assignment
    await this.dataStore.animals.update(enclosureId, {
      enclos: { connect: animalIds.map((id) => ({ id })) },
    });
  }
}
