import { apiClient } from "@/libs/axios";

export async function logoutFunctionMutation() {
  const response = await apiClient.post("/authenticated/logout");

  return response.data;
}