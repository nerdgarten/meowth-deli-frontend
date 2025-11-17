import { apiClient } from "@/libs/axios";
import type { Role } from "@/types/role";

export const authenticatedAs = async (): Promise<Role | null> => {
  try {
    const response = await apiClient.get<{ role: string }>("/authenticate");

    return response.data.role as Role;
  } catch {
    return null;
  }
};
export const resetPassword = async (
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    const data = {
      oldPassword,
      newPassword,
    };
    await apiClient.patch("/authenticate/change-password", {
      oldPassword,
      newPassword,
    });
  } catch (error) {
    throw new Error("Failed to reset password");
  }
};
