import { apiClient } from "@/libs/axios";
import type { ReviewResponse } from "@/types/review";

export async function getRestaurantReviews(
  restaurantId: string | number
): Promise<ReviewResponse[]> {
  const response = await apiClient.get<ReviewResponse[]>(
    `/review/restaurant/${restaurantId}`
  );
  return response.data;
}

export async function getRestaurantReviewById(
  reviewId: string | number
): Promise<ReviewResponse> {
  const response = await apiClient.get<ReviewResponse>(
    `/review/${reviewId}/restaurant`
  );
  return response.data;
}
