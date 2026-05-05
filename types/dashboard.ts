import type {
  Animal,
  AnimalEnclosAssociation,
  Client,
  Commande,
  ConfigCategorieOeufConstante,
  ConfigCouvaisonDuration,
  ConfigMedicamentConstante,
  ConfigRaceConstante,
  ConfigTypeEnclosConstante,
  ConfigVaccinConstante,
  Couvaison,
  DistributionAlimentation,
  Enclos,
  FormuleAlimentation,
  LigneCommande,
  NotificationSante,
  OeufProduit,
  Payment,
  Solde,
  Subscription,
  SubscriptionPlan,
  Transaction,
  UserRole,
  SanteHistorique,
} from "@prisma/client";

export type DashboardUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  farmName: string;
  role: UserRole;
  createdAt: Date;
  lastLogin: Date | null;
};

export type AnimalView = Animal & {
  ageMois: number;
  etatParAge: string;
};

export type CouvaisonView = Couvaison & {
  noteDescription: string;
  noteLettre: string;
  performanceScore: number;
};

export type EnclosView = Enclos & {
  animauxActuels: AnimalEnclosAssociation[];
};

export type CommandeView = Commande & {
  client: Client;
  items: LigneCommande[];
};

export type SubscriptionView = Subscription & {
  plan: SubscriptionPlan;
  payments: Payment[];
};

export type DashboardOverview = {
  user: DashboardUser;
  plans: SubscriptionPlan[];
  subscription: SubscriptionView | null;
  payments: Payment[];
  animals: AnimalView[];
  notifications: NotificationSante[];
  historiqueSante: SanteHistorique[];
  enclos: EnclosView[];
  oeufs: OeufProduit[];
  couvaisons: CouvaisonView[];
  formules: FormuleAlimentation[];
  distributions: DistributionAlimentation[];
  clients: Client[];
  commandes: CommandeView[];
  transactions: Transaction[];
  solde: Solde | { farmId: string; total: number };
  rapport: {
    revenus: number;
    depenses: number;
    profit: number;
    parCategorie: Record<string, number>;
  };
  config: {
    vaccins: ConfigVaccinConstante[];
    medicaments: ConfigMedicamentConstante[];
    couvaisonDuration: ConfigCouvaisonDuration | { durationDays: number };
    races: ConfigRaceConstante[];
    enclosTypes: ConfigTypeEnclosConstante[];
    oeufCategories: ConfigCategorieOeufConstante[];
  };
  stats: {
    totalAnimals: number;
    totalEggs: number;
    totalSales: number;
    unreadNotifications: number;
    activeEnclos: number;
    monthlyProfit: number;
  };
};
