import { apiClient } from "@/libs/axios";

export const isAuthenticated = async(): Promise<boolean> => {
  const response = await apiClient.get("/isAuthenticated");

  return response.status === 200;
};
