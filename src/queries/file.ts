import { apiClient } from "@/libs/axios";

export async function restaurantUploadFile(file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);

  await apiClient.post("/restaurant/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return Promise.resolve();
}
