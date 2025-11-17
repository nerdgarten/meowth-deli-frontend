import { apiClient } from "@/libs/axios";
import type { IDish } from "@/types/dish";

export async function getRestaurant(restaurantId: number): Promise<IDish[]> {
  const response = await apiClient.get<IDish[]>(
    `/restaurant/${restaurantId}`
  );

  return response.data;
}
