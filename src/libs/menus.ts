import { apiClient } from "@/libs/axios";
import type { IDish } from "@/types/dish";

export async function getMenusByRestaurant(restaurantId: string | number) {
  const response = await apiClient.get<IDish[]>(
    `/dish/restaurant/${restaurantId}`
  );
  return response.data;
}

export async function createMenu(
  payload: Partial<IDish> & { image?: File | string | null }
) {
  // If there's a File for image, send multipart/form-data
  if (payload.image && typeof payload.image !== "string") {
    const form = new FormData();
    if (payload.name) form.append("name", String(payload.name));
    if (payload.price !== undefined)
      form.append("price", String(payload.price));
    if (payload.detail) form.append("detail", String(payload.detail));
    if (payload.is_out_of_stock !== undefined)
      form.append("is_out_of_stock", String(payload.is_out_of_stock));
    if (payload.allergy && payload.allergy.length > 0) {
      payload.allergy.forEach((allergen) => {
        form.append("allergy[]", allergen);
      });
    }
    form.append("image", payload.image);
    const response = await apiClient.post<IDish>(`/dish`, form);
    return response.data;
  }

  // For JSON payload, remove image if it's not a valid URL
  const jsonPayload = { ...payload };
  delete jsonPayload.image; // Backend doesn't require image, and it would fail validation if it's not a URL

  const response = await apiClient.post<IDish>(`/dish`, jsonPayload);
  return response.data;
}

export async function updateMenu(
  id: string,
  payload: Partial<IDish> & { image?: File | string | null }
) {
  if (payload.image && typeof payload.image !== "string") {
    const form = new FormData();
    if (payload.name !== undefined) form.append("name", String(payload.name));
    if (payload.price !== undefined)
      form.append("price", String(payload.price));
    if (payload.detail !== undefined)
      form.append("detail", String(payload.detail));
    if (payload.is_out_of_stock !== undefined)
      form.append("is_out_of_stock", String(payload.is_out_of_stock));
    if (payload.allergy && payload.allergy.length > 0) {
      payload.allergy.forEach((allergen) => {
        form.append("allergy[]", allergen);
      });
    }
    form.append("image", payload.image);
    const response = await apiClient.patch<IDish>(`/dish/${id}`, form);
    return response.data;
  }

  // For JSON payload, remove image if it's not a valid URL
  const jsonPayload = { ...payload };
  delete jsonPayload.image;

  const response = await apiClient.patch<IDish>(`/dish/${id}`, jsonPayload);
  return response.data;
}

export async function deleteMenu(id: string) {
  const response = await apiClient.delete(`/dish/${id}`);
  return response.data;
}
