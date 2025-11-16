import { apiClient } from "@/libs/axios";

export async function logoutFunctionMutation(): Promise<{ message: string }> {
  const response = await apiClient.post("/authenticate/logout");

  return response.data as { message: string };
}
