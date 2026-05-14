// Service interfaces for OCP - extensible business logic layer
export interface IAnimalService {
  addAnimal(userId: string, input: any): Promise<any>;
  updateAnimal(userId: string, animalId: string, input: any): Promise<any>;
  deleteAnimal(userId: string, animalId: string): Promise<void>;
  listAnimals(userId: string, query?: any): Promise<any[]>;
}

export interface IHealthService {
  addVaccine(userId: string, input: any): Promise<any>;
  addMedicine(userId: string, input: any): Promise<any>;
  scheduleVaccine(userId: string, input: any): Promise<any>;
  scheduleMedicine(userId: string, input: any): Promise<any>;
  getHealthHistory(userId: string, animalId: string): Promise<any[]>;
}

export interface IEnclosureService {
  createEnclosure(userId: string, input: any): Promise<any>;
  updateEnclosure(
    userId: string,
    enclosureId: string,
    input: any,
  ): Promise<any>;
  deleteEnclosure(userId: string, enclosureId: string): Promise<void>;
  listEnclosures(userId: string): Promise<any[]>;
  assignAnimalsToEnclosure(
    userId: string,
    enclosureId: string,
    animalIds: string[],
  ): Promise<void>;
}

export interface INotificationService {
  createNotification(userId: string, type: string, data: any): Promise<void>;
  listNotifications(userId: string, type?: string): Promise<any[]>;
  deleteNotification(userId: string, notificationId: string): Promise<void>;
}

export interface IConfigService {
  getRaces(): Promise<any[]>;
  getVaccines(): Promise<any[]>;
  getMedicines(): Promise<any[]>;
  getEggCategories(): Promise<any[]>;
  updateCouvaisonDuration(durationDays: number): Promise<void>;
}

export interface IAuthorizationService {
  canUserAccessAnimal(userId: string, animalId: string): Promise<boolean>;
  canUserAccessEnclosure(userId: string, enclosureId: string): Promise<boolean>;
  canUserAccessFarm(userId: string, farmId: string): Promise<boolean>;
  canUserDeleteEnclosure(userId: string, enclosureId: string): Promise<boolean>;
  canUserDeleteAnimal(userId: string, animalId: string): Promise<boolean>;
}
