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
  formData.append('orderId', reviewData.orderId.toString());
  formData.append('rate', reviewData.rate.toString());
  if (reviewData.reviewText) {
    formData.append('reviewText', reviewData.reviewText);
  }
  if (reviewData.file) {
    formData.append('file', reviewData.file);
  }
  await apiClient.post(`/review/driver/${driverId}`, formData);
}

export async function submitRestaurantReview(
  restaurantId: number,
  reviewData: SubmitReviewData
): Promise<void> {
  const formData = new FormData();
  formData.append('orderId', reviewData.orderId.toString());
  formData.append('rate', reviewData.rate.toString());
  if (reviewData.reviewText) {
    formData.append('reviewText', reviewData.reviewText);
  }
  if (reviewData.file) {
    formData.append('file', reviewData.file);
  }
  await apiClient.post(`/review/restaurant/${restaurantId}`, formData);
}
