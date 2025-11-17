import { apiClient } from "@/libs/axios";
import type { Role } from "@/types/role";

export const authenticatedAs = async (): Promise<Role | null> => {
  try {
    const response = await apiClient.get("/authenticate");

    return response.data.role;
  } catch {
    return null;
  }
};
export const resetPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    const data = {
      currentPassword,
      newPassword,
    };
    await apiClient.post("/reset-password", {
      currentPassword,
      newPassword,
    });
  } catch (error) {
    throw new Error("Failed to reset password");
  }
};
