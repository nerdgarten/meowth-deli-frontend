import { z } from "zod";

import { apiClient } from "@/libs/axios";
import type { IDish } from "@/types/dish";
import type { IRestaurant } from "@/types/restaurant";
import type { IRestaurantProfile } from "@/types/user";

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

export const EditRestaurantSchema = z.object({
  name: z
    .string()
    .min(1, "Please enter your Restaurant name.")
    .max(128, "Restaurant name is too long."),
  detail: z.string(),

  tel: z
    .string()
    .min(6, "Invalid phone number")
    .regex(/^\+?[1-9][0-9]{7,14}$/, "Invalid phone number"),
  is_available: z.boolean(),
});
const fileSchema = z.custom<File>(
  (v) => typeof File !== "undefined" && v instanceof File,
  { message: "Not a file" }
);

const FileOrUrlSchema = z
  .union([
    fileSchema,
    z.string().min(1), // remove url()/or() duplication; still requires non-empty
  ])
  .nullable()
  .optional();

export const RestaurantProfileFormSchema = EditRestaurantSchema.extend({
  restaurantBanner: FileOrUrlSchema,
});

export async function updateRestaurantProfileMutation(
  data: z.infer<typeof RestaurantProfileFormSchema>
) {
  const response = await apiClient.patch<IRestaurantProfile>(
    "/restaurant/profile",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
    // Do NOT set Content-Type; axios will set the multipart boundary
  );
  return response.data;
}

export async function queryRestaurantProfile(): Promise<IRestaurantProfile> {
  const response = await apiClient.get<IRestaurantProfile>(
    "/restaurant/profile"
  );
  return response.data;
}
