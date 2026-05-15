// Repository interfaces for OCP - extensible data access layer
export interface IAnimalRepository {
  create(data: any): Promise<any>;
  findMany(query: any): Promise<any[]>;
  findById(id: string): Promise<any | null>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<void>;
}

export interface IEnclosureRepository {
  create(data: any): Promise<any>;
  findMany(query: any): Promise<any[]>;
  findById(id: string): Promise<any | null>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<void>;
  findAnimalAssociations(enclosureId: string): Promise<any[]>;
  findActiveAnimalAssociations(enclosureId: string): Promise<any[]>;
  updateAnimalAssociations(
    enclosureId: string,
    data: { dateSortie: Date },
  ): Promise<void>;
}

export interface INotificationRepository {
  create(data: any): Promise<any>;
  findMany(query: any): Promise<any[]>;
  delete(id: string): Promise<void>;
}

export interface IConfigRepository {
  getRaces(): Promise<any[]>;
  getVaccines(): Promise<any[]>;
  getMedicines(): Promise<any[]>;
  getEggCategories(): Promise<any[]>;
}

export interface IUserRepository {
  findById(id: string): Promise<any | null>;
  update(id: string, data: any): Promise<any>;
}

export interface IDataStore {
  animals: IAnimalRepository;
  enclosures: IEnclosureRepository;
  notifications: INotificationRepository;
  config: IConfigRepository;
  users: IUserRepository;
  transaction<T>(callback: (tx: IDataStore) => Promise<T>): Promise<T>;
}
