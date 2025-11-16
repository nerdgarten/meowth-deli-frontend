import { apiClient } from "@/libs/axios";

export const getAllergy = async () => {
  try {
    const response = await apiClient.get(`/customer/allergy`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dish:", error);
    throw error;
  }
};
export const updateAllergy = async (allergy: string[]) => {
  try {
    const response = await apiClient.put(`/customer/allergy`, {
      allergies: allergy,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating allergy:", error);
    throw error;
  }
};
