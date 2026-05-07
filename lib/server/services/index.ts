// Service factory - Creates all services with proper dependencies
import { dataStore } from "@/lib/server/data-store";
import { AnimalService } from "@/lib/server/services/animal-service";
import { HealthService } from "@/lib/server/services/health-service";
import { EnclosureService } from "@/lib/server/services/enclosure-service";
import { NotificationService } from "@/lib/server/services/notification-service";
import { ConfigService } from "@/lib/server/services/config-service";
import { AuthorizationService } from "@/lib/server/services/authorization-service";

class ServiceFactory {
  private authService: AuthorizationService;
  private animalService: AnimalService;
  private healthService: HealthService;
  private enclosureService: EnclosureService;
  private notificationService: NotificationService;
  private configService: ConfigService;

  constructor() {
    this.authService = new AuthorizationService(dataStore);
    this.animalService = new AnimalService(dataStore, this.authService);
    this.healthService = new HealthService(dataStore, this.authService);
    this.enclosureService = new EnclosureService(dataStore, this.authService);
    this.notificationService = new NotificationService(dataStore);
    this.configService = new ConfigService(dataStore);
  }

  getAuthService() {
    return this.authService;
  }

  getAnimalService() {
    return this.animalService;
  }

  getHealthService() {
    return this.healthService;
  }

  getEnclosureService() {
    return this.enclosureService;
  }

  getNotificationService() {
    return this.notificationService;
  }

  getConfigService() {
    return this.configService;
  }
}

// Singleton instance
export const services = new ServiceFactory();
