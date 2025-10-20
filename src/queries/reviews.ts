import { apiClient } from "@/libs/axios";
import type { ReviewResponse, DriverReviewResponse } from "@/types/review";

export interface GetRestaurantReviewsParams {
  restaurantId: number;
  limit?: number;
  offset?: number;
}

export interface GetDriverReviewsParams {
  driverId: number;
  limit?: number;
  offset?: number;
}

export async function getRestaurantReviews({
  restaurantId,
  limit = 10,
  offset = 0,
}: GetRestaurantReviewsParams): Promise<ReviewResponse> {
  const response = await apiClient.get<ReviewResponse>(
    `/review/restaurant/${restaurantId}`,
    {
      params: { limit, offset },
    }
  );

  return response.data;
}

export async function getDriverReviews({
  driverId,
  limit = 10,
  offset = 0,
}: GetDriverReviewsParams): Promise<DriverReviewResponse> {
  const response = await apiClient.get<DriverReviewResponse>(
    `/review/driver/${driverId}`,
    {
      params: { limit, offset },
    }
  );

  return response.data;
}
