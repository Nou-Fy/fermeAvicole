// Animal service - Single Responsibility: Animal CRUD and lifecycle
import type { IAnimalService } from "@/lib/interfaces/services";
import type { IDataStore } from "@/lib/interfaces/repository";
import type { IAuthorizationService } from "@/lib/interfaces/services";

export class AnimalService implements IAnimalService {
  constructor(
    private dataStore: IDataStore,
    private authService: IAuthorizationService,
  ) {}

  async addAnimal(userId: string, input: any) {
    // Authorization check
    const canAccess = await this.authService.canUserAccessFarm(
      userId,
      input.farmId,
    );
    if (!canAccess) {
      throw new Error("Unauthorized access to farm");
    }

    // Business logic
    const animal = await this.dataStore.animals.create({
      ...input,
      userId,
      status: input.status || "ACTIF",
      createdAt: new Date(),
    });

    return animal;
  }

  async updateAnimal(userId: string, animalId: string, input: any) {
    const animal = await this.dataStore.animals.findById(animalId);
    if (!animal) {
      throw new Error("Animal not found");
    }

    const canAccess = await this.authService.canUserAccessAnimal(
      userId,
      animalId,
    );
    if (!canAccess) {
      throw new Error("Unauthorized access to animal");
    }

    const updated = await this.dataStore.animals.update(animalId, {
      ...input,
      updatedAt: new Date(),
    });

    return updated;
  }

  async deleteAnimal(userId: string, animalId: string) {
    const animal = await this.dataStore.animals.findById(animalId);
    if (!animal) {
      throw new Error("Animal not found");
    }

    const canAccess = await this.authService.canUserAccessAnimal(
      userId,
      animalId,
    );
    if (!canAccess) {
      throw new Error("Unauthorized access to animal");
    }

    await this.dataStore.animals.delete(animalId);
  }

  async listAnimals(userId: string, query?: any) {
    return this.dataStore.animals.findMany({
      where: {
        user: { id: userId },
        ...query?.filters,
      },
      skip: query?.skip,
      take: query?.take,
    });
  }

  async unassignAnimalsFromEnclosure(enclosureId: string): Promise<void> {
    if (!enclosureId) {
      throw new Error("Enclosure ID is required");
    }

    try {
      // On utilise la méthode déjà présente dans le repository des enclos
      // pour mettre une date de sortie à toutes les associations actives
      await this.dataStore.enclosures.updateAnimalAssociations(enclosureId, {
        dateSortie: new Date(),
      });
    } catch (error) {
      throw new Error("Failed to unassign animals from enclosure");
    }
  }
}
