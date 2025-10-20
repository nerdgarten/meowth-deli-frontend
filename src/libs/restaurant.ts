import { apiClient } from "@/libs/axios";
import type { IDish } from "@/types/dish";
import type { Restaurant } from "@/types/restaurant";

export const getDishRestuarantId = async(restaurant_id: string): Promise<IDish[]> => {
  try {
    const response = await apiClient.get<IDish[]>(`/restaurant/${restaurant_id}/dish`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dish:", error);
    throw error;
  }
};

export const getRestaurantById = async (
  restaurant_id: string
): Promise<Restaurant> => {
  try {
    const response = await apiClient.get<Restaurant>(
      `/restaurant/${restaurant_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dish:", error);
    throw error;
  }
};

export const getAllRestaurant = async (): Promise<Restaurant[]> =>{
  try {
    const response = await apiClient.get<Restaurant[]>(
      `/restaurant`
    )
    return response.data;
  } catch (error) {
    console.error("Error fetching dish:", error);
    throw error;
  }
}


