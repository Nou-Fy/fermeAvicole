// Dashboard actions handler - Single Responsibility: Execute dashboard actions with consistent error handling
import type { IDashboardActions, IHttpResponse } from "@/lib/interfaces/http";
import { httpClient } from "@/lib/server/http-client";

export class DashboardActionsHandler implements IDashboardActions {
  private onSuccessCallback: ((message: string) => void) | null = null;
  private onErrorCallback: ((error: any) => void) | null = null;

  setSuccessCallback(callback: (message: string) => void) {
    this.onSuccessCallback = callback;
  }

  setErrorCallback(callback: (error: any) => void) {
    this.onErrorCallback = callback;
  }

  async executeAction<T>(
    path: string,
    method: "GET" | "POST" | "PATCH" | "DELETE",
    body?: any,
  ): Promise<T> {
    try {
      let result: T;

      switch (method) {
        case "GET":
          result = await httpClient.get<T>(path);
          break;
        case "POST":
          result = await httpClient.post<T>(path, body);
          break;
        case "PATCH":
          result = await httpClient.patch<T>(path, body);
          break;
        case "DELETE":
          result = await httpClient.delete<T>(path);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      return result;
    } catch (error) {
      this.onError(error);
      throw error;
    }
  }

  onSuccess(message: string) {
    if (this.onSuccessCallback) {
      this.onSuccessCallback(message);
    }
  }

  onError(error: any) {
    if (this.onErrorCallback) {
      this.onErrorCallback(error);
    }
  }
}

// Hook for use in React components
export function useDashboardActions() {
  return new DashboardActionsHandler();
}
