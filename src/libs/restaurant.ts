import { apiClient } from "@/libs/axios";
import type { IDish } from "@/types/dish";
import type { IRestaurant } from "@/types/restaurant";

export const getDishRestaurantId = async (
  restaurant_id: string
): Promise<IDish[]> => {
  try {
    const response = await apiClient.get<IDish[]>(
      `/restaurant/${restaurant_id}/dish`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dish:", error);
    throw error;
  }
};

export const getRestaurantById = async (
  restaurant_id: string
): Promise<IRestaurant> => {
  try {
    const response = await apiClient.get<IRestaurant>(
      `/restaurant/${restaurant_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dish:", error);
    throw error;
  }
};

export const getAllRestaurant = async (): Promise<IRestaurant[]> => {
  try {
    const response = await apiClient.get<IRestaurant[]>(`/restaurant`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dish:", error);
    throw error;
  }
};