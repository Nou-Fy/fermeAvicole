import { serverError } from "@/lib/server/http";

export async function handleApiRequest<T extends Promise<Response>>(
  handler: () => T,
) {
  try {
    return await handler();
  } catch (error) {
    return serverError(error);
  }
}
