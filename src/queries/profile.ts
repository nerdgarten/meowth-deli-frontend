import { apiClient } from "@/libs/axios";
import type { ICustomerProfile } from "@/types/user";
import { z } from "zod";

export async function queryCustomerProfile(): Promise<ICustomerProfile> {
  const response = await apiClient.get<ICustomerProfile>("/customer/profile");

  return response.data;
}

export const EditProfileFormSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  tel: z
    .string()
    .min(6, "Invalid phone number")
    .regex(/^\+?[1-9][0-9]{7,14}$/, "Invalid phone number"),
});

export async function updateCustomerProfileMutation(
  data: z.infer<typeof EditProfileFormSchema>
) {
  const response = await apiClient.patch<ICustomerProfile>(
    "/customer/profile",
    data
  );

  return response.data;
}
