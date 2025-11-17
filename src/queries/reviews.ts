import { apiClient } from "@/libs/axios";
import type { DriverReviewResponse,ReviewResponse } from "@/types/review";

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

export interface SubmitReviewData {
  title: string;
  orderId: number;
  rate: number;
  reviewText?: string;
  file?: File;
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

export async function submitDriverReview(
  driverId: number,
  reviewData: SubmitReviewData
): Promise<void> {
  const formData = new FormData();
  formData.append('driver_id', driverId.toString());
  formData.append('rate', reviewData.rate.toString());
  formData.append('title', reviewData.title);
  if (reviewData.reviewText) {
    formData.append('review_text', reviewData.reviewText);
  }
  if (reviewData.file) {
    formData.append('files', reviewData.file);
  }
  await apiClient.post(`/review/driver`, formData);
}

export async function submitRestaurantReview(
  restaurantId: number,
  reviewData: SubmitReviewData
): Promise<void> {
  const formData = new FormData();
  formData.append('restaurant_id', restaurantId.toString());
  formData.append('rate', reviewData.rate.toString());
  formData.append('title', reviewData.title);
  if (reviewData.reviewText) {
    formData.append('review_text', reviewData.reviewText);
  }
  if (reviewData.file) {
    formData.append('images', reviewData.file);
  }
  await apiClient.post(`/review/restaurant`, formData);
}
