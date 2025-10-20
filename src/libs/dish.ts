import { apiClient } from "@/libs/axios";
import { IDish } from "@/types/dish";

export const getDishById = async(dish_id: string): Promise<IDish> => {
  try {
    const response = await apiClient.get<IDish>(`/dish/${dish_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dish:", error);
    throw error;
  }
};


