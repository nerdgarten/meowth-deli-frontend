import { apiClient } from "@/libs/axios";

export const getAllergy = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get<string[]>(`/customer/allergy`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dish:", error);
    throw error;
  }
};
export const updateAllergy = async (allergy: string[]) => {
  try {
    const response = await apiClient.put<string[]>(`/customer/allergy`, {
      allergies: allergy,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating allergy:", error);
    throw error;
  }
};
