import { apiClient } from "@/libs/axios";
import type { IDish } from "@/types/dish";
import type { IRestaurant } from "@/types/restaurant";
import type { Role } from "@/types/role";

export const getFavouriteRestaurants = async (): Promise<IRestaurant[]> => {
  try {
    const response = await apiClient.get<IRestaurant[]>(`/restaurant/favorite`);
    return response.data;
  } catch (error) {
    console.error("Error fetching favourite restaurants:", error);
    throw error;
  }
};

export const updateFavouriteRestaurant = async (
  restaurantId: number,
  isFavourite: boolean
): Promise<void> => {
  try {
    await apiClient.post<void>(`/restaurant/favorite`, {
      restaurantId: restaurantId,
      isFavourite: isFavourite,
    });
    return Promise.resolve();
  } catch (error) {
    console.error("Error updating favourite restaurants:", error);
    throw error;
  }
};

export const createFavouriteDish = async (dish_id: number): Promise<void> => {
  try {
    await apiClient.post<void>(`/dish/favorite`, {
      dishId: dish_id,
      isFavorite: true,
    });
    return Promise.resolve();
  } catch (error) {
    console.error("Error creating favourite dish:", error);
    throw error;
  }
};
export const deleteFavouriteDish = async (dish_id: number): Promise<void> => {
  try {
    const response = await apiClient.post<void>(`/dish/favorite`, {
      dishId: dish_id,
      isFavorite: false,
    });
    return Promise.resolve();
  } catch (error) {
    console.error("Error deleting favourite dish:", error);
    throw error;
  }
};
export const getFavouriteDish = async (): Promise<IDish[]> => {
  try {
    const response = await apiClient.get<IDish[]>(`/dish/favorite`);
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
    const response = await apiClient.post<void>(`/restaurant/favorite`, {
      restaurantId: restaurant_id,
      isFavorite: true,
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
    const response = await apiClient.post<void>(`/restaurant/favorite`, {
      restaurantId: restaurant_id,
      isFavorite: false,
    });
    return Promise.resolve();
  } catch (error) {
    console.error("Error deleting favourite restaurant:", error);
    throw error;
  }
};
export const getFavouriteRestaurant = async (): Promise<IRestaurant[]> => {
  try {
    const response = await apiClient.get<IRestaurant[]>(`restaurant/favorite`);
    return response.data;
  } catch (error) {
    console.error("Error fetching favourite restaurant:", error);
    throw error;
  }
};
export const checkFavouriteDish = async (dish_id: number): Promise<boolean> => {
  try {
    const response = await apiClient.get<{ isFavorite: boolean }>(
      `/dish/favorite/${dish_id}`
    );
    return response.data.isFavorite;
  } catch (error) {
    console.error("Error checking favourite dish:", error);
    throw error;
  }
};
export const checkFavouriteRestaurant = async (
  restaurant_id: number
): Promise<boolean> => {
  try {
    const response = await apiClient.get<{ isFavorite: boolean }>(
      `/restaurant/favorite/${restaurant_id}`
    );
    return response.data.isFavorite;
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
      `/dish/favorite/restaurant/${restaurant_id}`
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
