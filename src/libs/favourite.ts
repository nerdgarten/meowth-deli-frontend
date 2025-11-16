import { apiClient } from "@/libs/axios";
import type { IDish } from "@/types/dish";
import type { IRestaurant } from "@/types/restaurant";
import { check } from "zod";
export const createFavouriteDish = async (dish_id: number): Promise<void> => {
  try {
    await apiClient.post<void>(`/favourite/dish`, { id: dish_id });
    return Promise.resolve();
  } catch (error) {
    console.error("Error creating favourite dish:", error);
    throw error;
  }
};
export const deleteFavouriteDish = async (dish_id: number): Promise<void> => {
  try {
    const response = await apiClient.delete<void>(`/favourite/dish/${dish_id}`);
    return Promise.resolve();
  } catch (error) {
    console.error("Error deleting favourite dish:", error);
    throw error;
  }
};
export const getFavouriteDish = async (): Promise<IDish[]> => {
  try {
    const response = await apiClient.get<IDish[]>(`/favourite/dish`);
    return response.data;
  } catch (error) {
    console.error("Error fetching favourite dish:", error);
    throw error;
  }
};
export const createFavouriteRestaurant = async (
  restaurant_id: number
): Promise<void> => {
  try {
    const response = await apiClient.post<void>(`/favourite/restaurant`, {
      id: restaurant_id,
    });
    return Promise.resolve();
  } catch (error) {
    console.error("Error creating favourite restaurant:", error);
    throw error;
  }
};
export const deleteFavouriteRestaurant = async (
  restaurant_id: number
): Promise<void> => {
  try {
    const response = await apiClient.delete<void>(
      `/favourite/restaurant/${restaurant_id}`
    );
    return Promise.resolve();
  } catch (error) {
    console.error("Error deleting favourite restaurant:", error);
    throw error;
  }
};
export const getFavouriteRestaurant = async (): Promise<IRestaurant[]> => {
  try {
    const response = await apiClient.get<IRestaurant[]>(
      `/favourite/restaurant`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching favourite restaurant:", error);
    throw error;
  }
};
export const checkFavouriteDish = async (dish_id: number): Promise<boolean> => {
  try {
    const response = await apiClient.get<boolean>(`/favourite/dish/${dish_id}`);
    return response.data;
  } catch (error) {
    console.error("Error checking favourite dish:", error);
    throw error;
  }
};
export const checkFavouriteRestaurant = async (
  restaurant_id: number
): Promise<boolean> => {
  try {
    const response = await apiClient.get<boolean>(
      `/favourite/restaurant/${restaurant_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error checking favourite restaurant:", error);
    throw error;
  }
};
export const getFavouriteDishesByRestaurant = async (
  restaurant_id: number
): Promise<IDish[]> => {
  try {
    const response = await apiClient.get<IDish[]>(
      `/favourite/restaurant/${restaurant_id}/dish`
    );
    if (response.data[0] === null) {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching favourite dishes by restaurant:", error);
    throw error;
  }
};
