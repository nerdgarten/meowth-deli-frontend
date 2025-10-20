import { apiClient } from "@/libs/axios";
import type { Driver } from "@/types/driver";

export async function getDriver(driverId: number): Promise<Driver> {
  const response = await apiClient.get<Driver>(`/driver/${driverId}`);

  return response.data;
}
