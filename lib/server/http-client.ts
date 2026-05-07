// HTTP client implementation - provides abstraction layer for HTTP requests
// This allows changing HTTP behavior without touching component code
import type {
  IHttpClient,
  IHttpResponse,
  IErrorHandler,
} from "@/lib/interfaces/http";

class DefaultErrorHandler implements IErrorHandler {
  async handle(error: any) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        message: "Erreur de connexion réseau",
        code: "NETWORK_ERROR",
        recoverable: true,
      };
    }

    if (error?.status === 401) {
      return {
        message: "Votre session a expiré",
        code: "UNAUTHORIZED",
        recoverable: false,
      };
    }

    if (error?.status === 403) {
      return {
        message: "Accès refusé",
        code: "FORBIDDEN",
        recoverable: false,
      };
    }

    if (error?.status >= 500) {
      return {
        message: "Erreur serveur. Veuillez réessayer plus tard.",
        code: "SERVER_ERROR",
        recoverable: true,
      };
    }

    return {
      message: error?.message || "Une erreur est survenue",
      code: "UNKNOWN_ERROR",
      recoverable: true,
    };
  }
}

export class HttpClient implements IHttpClient {
  private baseUrl: string = "";
  private errorHandler: IErrorHandler;

  constructor(errorHandler?: IErrorHandler) {
    this.errorHandler = errorHandler || new DefaultErrorHandler();
  }

  async get<T>(path: string, options?: any): Promise<T> {
    return this.request<T>("GET", path, undefined, options);
  }

  async post<T>(path: string, body?: any, options?: any): Promise<T> {
    return this.request<T>("POST", path, body, options);
  }

  async patch<T>(path: string, body?: any, options?: any): Promise<T> {
    return this.request<T>("PATCH", path, body, options);
  }

  async delete<T>(path: string, options?: any): Promise<T> {
    return this.request<T>("DELETE", path, undefined, options);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: any,
    options?: any,
  ): Promise<T> {
    try {
      // 1. Utilisation de l'objet Headers natif (Correction de l'erreur d'indexation)
      const headers = new Headers(options?.headers);

      if (body && method !== "DELETE") {
        // Cette méthode est sûre et acceptée par TypeScript
        headers.set("Content-Type", "application/json");
      }

      const response = await fetch(path, {
        method,
        credentials: "include",
        headers, // Headers est parfaitement compatible avec HeadersInit
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      });

      if (!response.ok) {
        // On essaie de récupérer le corps de l'erreur si possible
        let errorMessage = response.statusText;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          /* ignored */
        }

        throw {
          status: response.status,
          message: errorMessage,
        };
      }

      return (await response.json()) as T;
    } catch (error) {
      const handled = await this.errorHandler.handle(error);
      const err = new Error(handled.message);
      (err as any).code = handled.code;
      (err as any).recoverable = handled.recoverable;
      throw err;
    }
  }
}

// Singleton instance
export const httpClient = new HttpClient();
