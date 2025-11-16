import { apiClient } from "@/libs/axios";
import type { Role } from "@/types/role";

export const authenticatedAs = async (): Promise<Role | null> => {
  try {
    const response = await apiClient.get<IAuthenticatedAs>("/authenticate");

    return response.data.role;
  } catch {
    return null;
  }
};

export interface IAuthenticatedAs {
  message: string;
  role: Role;
}