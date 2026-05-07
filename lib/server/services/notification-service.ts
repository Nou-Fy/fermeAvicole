// Notification service - Single Responsibility: Notification management
import type { INotificationService } from "@/lib/interfaces/services";
import type { IDataStore } from "@/lib/interfaces/repository";

export class NotificationService implements INotificationService {
  constructor(private dataStore: IDataStore) {}

  async createNotification(userId: string, type: string, data: any) {
    // Validate notification type
    const validTypes = [
      "VACCIN_RAPPEL",
      "MEDICAMENT_RAPPEL",
      "EGG_COLLECTION",
      "ANIMAL_ALERT",
      "HEALTH_UPDATE",
    ];

    if (!validTypes.includes(type)) {
      throw new Error(`Invalid notification type: ${type}`);
    }

    await this.dataStore.notifications.create({
      user: { connect: { id: userId } },
      type,
      message: this.formatNotificationMessage(type, data),
      data: JSON.stringify(data),
      createdAt: new Date(),
      read: false,
    });
  }

  private formatNotificationMessage(type: string, data: any): string {
    const messages: Record<string, (d: any) => string> = {
      VACCIN_RAPPEL: (d) => `Rappel de vaccination pour ${d.animalName}`,
      MEDICAMENT_RAPPEL: (d) => `Rappel de médicament pour ${d.animalName}`,
      EGG_COLLECTION: (d) => `Collecte d'œufs: ${d.count} œufs collectés`,
      ANIMAL_ALERT: (d) => `Alerte santé: ${d.animalName} - ${d.reason}`,
      HEALTH_UPDATE: (d) => `Mise à jour de santé: ${d.message}`,
    };

    return messages[type]?.(data) || "Nouvelle notification";
  }

  async listNotifications(userId: string, type?: string) {
    return this.dataStore.notifications.findMany({
      where: {
        user: { id: userId },
        ...(type && { type }),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async deleteNotification(userId: string, notificationId: string) {
    // TODO: Verify ownership before deleting
    await this.dataStore.notifications.delete(notificationId);
  }
}
