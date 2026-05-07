// HTTP and notification interfaces for OCP
export interface IHttpClient {
  get<T>(path: string, options?: any): Promise<T>;
  post<T>(path: string, body?: any, options?: any): Promise<T>;
  patch<T>(path: string, body?: any, options?: any): Promise<T>;
  delete<T>(path: string, options?: any): Promise<T>;
}

export interface IHttpResponse<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface INotificationStrategy {
  canHandle(event: any): boolean;
  handle(event: any): Promise<void>;
}

export interface IErrorHandler {
  handle(error: any): Promise<{
    message: string;
    code: string;
    recoverable: boolean;
  }>;
}

export interface IDashboardActions {
  executeAction<T>(
    path: string,
    method: "GET" | "POST" | "PATCH" | "DELETE",
    body?: any,
  ): Promise<T>;
  onError(error: any): void;
  onSuccess(message: string): void;
}
