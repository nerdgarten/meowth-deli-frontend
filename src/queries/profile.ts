import { apiClient } from "@/libs/axios";
import type { ICustomerProfile } from "@/types/user";

export const queryCustomerProfile = async(): Promise<ICustomerProfile> => {
  const response = await apiClient.get("/customer/profile");

  return response.data;
}