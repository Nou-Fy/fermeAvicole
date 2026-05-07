// Config service - Single Responsibility: Configuration data access
import type { IConfigService } from "@/lib/interfaces/services";
import type { IDataStore } from "@/lib/interfaces/repository";

export class ConfigService implements IConfigService {
  constructor(private dataStore: IDataStore) {}

  async getRaces() {
    return this.dataStore.config.getRaces();
  }

  async getVaccines() {
    return this.dataStore.config.getVaccines();
  }

  async getMedicines() {
    return this.dataStore.config.getMedicines();
  }

  async getEggCategories() {
    return this.dataStore.config.getEggCategories();
  }

  async updateCouvaisonDuration(durationDays: number) {
    if (durationDays <= 0) {
      throw new Error("Duration must be greater than 0");
    }

    // TODO: Implement config update in data store
    // For now, this is a placeholder
    console.log(`Updating couvaison duration to ${durationDays} days`);
  }
}
