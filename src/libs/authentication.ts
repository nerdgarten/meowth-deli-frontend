import { apiClient } from "@/libs/axios";

export const isAuthenticated = async(): Promise<boolean> => {
  try {
    const response = await apiClient.get("/authenticated/isAuthenticated");

    return response.status === 200;
  } catch {
    return false;
  }
};
