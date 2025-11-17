import { apiClient } from "@/libs/axios";
import type { ICreateLocation } from "@/types/location";
import type { IDish } from "@/types/dish";
import type { IRestaurant } from "@/types/restaurant";
import { check } from "zod";
export const createCustomerLocation = async (
  data: ICreateLocation
): Promise<ICreateLocation> => {
  try {
    const response = await apiClient.post<ICreateLocation>(
      `/location/customer`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating favourite dish:", error);
    throw error;
  }
};
export const createRestaurantLocation = async (
  data: ICreateLocation
): Promise<ICreateLocation> => {
  try {
    const response = await apiClient.post<ICreateLocation>(
      `/location/restaurant`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating restaurant location:", error);
    throw error;
  }
};
export const getCustomerLocations = async (): Promise<ICreateLocation[]> => {
  try {
    const response =
      await apiClient.get<ICreateLocation[]>(`/location/customer`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer locations:", error);
    throw error;
  }
};
export const getRestaurantLocations = async (): Promise<ICreateLocation> => {
  try {
    const response =
      await apiClient.get<ICreateLocation>(`/location/restaurant`);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant locations:", error);
    throw error;
  }
};

export const getDefaultCustomerLocation =
  async (): Promise<ICreateLocation> => {
    try {
      const response = await apiClient.get<ICreateLocation>(
        `/location/customer/default`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching default customer location:", error);
      throw error;
    }
  };
export const setDefaultCustomerLocation = async (
  locationId: string
): Promise<ICreateLocation> => {
  try {
    const response = await apiClient.patch<ICreateLocation>(
      `/location/customer/default/`,
      {
        location_id: Number(locationId),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error setting default customer location:", error);
    throw error;
  }
};
