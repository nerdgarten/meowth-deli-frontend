import { apiClient } from "@/libs/axios";
import type { Restaurant } from "@/types/restaurant";
import { isAuthenticated } from "@/libs/authentication";

export async function getRestaurant(restaurantId: number): Promise<Restaurant> {
  const response = await apiClient.get<Restaurant>(
    `/restaurant/${restaurantId}`
  );

  return response.data;
}