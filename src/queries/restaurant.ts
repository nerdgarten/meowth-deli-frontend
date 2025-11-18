import { apiClient } from "@/libs/axios";
import type { IDish } from "@/types/dish";
import type { IRestaurant } from "@/types/restaurant";

export async function getRestaurant(
  restaurantId: number
): Promise<IRestaurant> {
  const response = await apiClient.get<IRestaurant>(
    `/restaurant/${restaurantId}`
  );

  return response.data;
}
