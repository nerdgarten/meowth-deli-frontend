import { z } from "zod";

import { apiClient } from "@/libs/axios";
import type { IDish } from "@/types/dish";
import type { IRestaurant } from "@/types/restaurant";
import type {
  IDriverProfile,
  IRestaurantProfile,
  IVehicle,
} from "@/types/user";
export const EditDriverSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  tel: z
    .string()
    .min(6, "Invalid phone number")
    .regex(/^\+?[1-9][0-9]{7,14}$/, "Invalid phone number"),
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

export const DriverProfileFormSchema = EditDriverSchema.extend({
  profilePicture: FileOrUrlSchema,
});

export async function updateDriverProfileMutation(
  data: z.infer<typeof DriverProfileFormSchema>
) {
  const response = await apiClient.patch<IRestaurantProfile>(
    "/driver/profile",
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

export async function queryDriverProfile(): Promise<IDriverProfile> {
  const response = await apiClient.get<IDriverProfile>("/driver/profile");
  return response.data;
}

export const VehicleFormSchema = EditDriverSchema.extend({
  vehicle: z.string().min(1, "Please enter your vehicle type."),
  licence: z.string().min(1, "Please enter your license plate."),
});

export async function updateVehicleProfileMutation(
  data: z.infer<typeof VehicleFormSchema>
) {
  const response = await apiClient.patch<IVehicle>(
    "/driver/profile",
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

export async function queryVehicle(): Promise<IVehicle> {
  const response = await apiClient.get<IVehicle>("/driver/profile");
  return response.data;
}
