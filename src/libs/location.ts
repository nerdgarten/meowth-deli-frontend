import { apiClient } from "@/libs/axios";
import type { ILocation } from "@/types/location";

export const getLocationByCustomerId = async(): Promise<ILocation[]> => {
  try {
    const response = await apiClient.get<ILocation[]>(`/location/customer/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dish:", error);
    throw error;
  }
};
