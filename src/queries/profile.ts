import { z } from "zod";

import { apiClient } from "@/libs/axios";
import type { ICustomerProfile } from "@/types/user";

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

export const ProfileFormSchema = EditProfileFormSchema.extend({
  profilePicture: FileOrUrlSchema,
});

export async function updateCustomerProfileMutation(
  data: z.infer<typeof ProfileFormSchema>
) {
  const { firstname, lastname, tel, profilePicture } = data;
  if (profilePicture instanceof File) {
    const form = new FormData();
    form.append("firstname", firstname);
    form.append("lastname", lastname);
    form.append("tel", tel);
    form.append("profilePicture", profilePicture); // adjust key if backend expects another name

    const response = await apiClient.patch<ICustomerProfile>(
      "/customer/profile",
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
      // Do NOT set Content-Type; axios will set the multipart boundary
    );
    return response.data;
  }
}
