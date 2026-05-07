// Prisma implementation of IDataStore - demonstrates OCP compliance
import { prisma } from "@/lib/prisma";
import type {
  IDataStore,
  IAnimalRepository,
  IEnclosureRepository,
  INotificationRepository,
  IConfigRepository,
  IUserRepository,
} from "@/lib/interfaces/repository";

class PrismaAnimalRepository implements IAnimalRepository {
  async create(data: any) {
    return prisma.animal.create({ data });
  }

  async findMany(query: any) {
    return prisma.animal.findMany(query);
  }

  async findById(id: string) {
    return prisma.animal.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return prisma.animal.update({ where: { id }, data });
  }

  async delete(id: string) {
    await prisma.animal.delete({ where: { id } });
  }
}

class PrismaEnclosureRepository implements IEnclosureRepository {
  async create(data: any) {
    return prisma.enclos.create({ data });
  }

  async findMany(query: any) {
    return prisma.enclos.findMany(query);
  }

  async findById(id: string) {
    return prisma.enclos.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return prisma.enclos.update({ where: { id }, data });
  }

  async delete(id: string) {
    await prisma.enclos.delete({ where: { id } });
  }
}

class PrismaNotificationRepository implements INotificationRepository {
  async create(data: any) {
    return prisma.notificationSante.create({ data });
  }

  async findMany(query: any) {
    return prisma.notificationSante.findMany(query);
  }

  async delete(id: string) {
    await prisma.notificationSante.delete({ where: { id } });
  }
}

class PrismaConfigRepository implements IConfigRepository {
  async getRaces() {
    return prisma.configRaceConstante.findMany();
  }

  async getVaccines() {
    return prisma.configVaccinConstante.findMany();
  }

  async getMedicines() {
    return prisma.configMedicamentConstante.findMany();
  }

  async getEggCategories() {
    return prisma.configCategorieOeufConstante.findMany();
  }
}

class PrismaUserRepository implements IUserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return prisma.user.update({ where: { id }, data });
  }
}

// Composite data store
export class PrismaDataStore implements IDataStore {
  readonly animals: IAnimalRepository = new PrismaAnimalRepository();
  readonly enclosures: IEnclosureRepository = new PrismaEnclosureRepository();
  readonly notifications: INotificationRepository =
    new PrismaNotificationRepository();
  readonly config: IConfigRepository = new PrismaConfigRepository();
  readonly users: IUserRepository = new PrismaUserRepository();
}

// Singleton instance
export const dataStore = new PrismaDataStore();
