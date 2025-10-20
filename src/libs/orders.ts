import { apiClient } from "@/libs/axios";
import type { IOrder } from "@/types/order";
import type { IOrderDish } from "@/types/order";
import type { IRestaurant } from "@/types/restaurant";


export const createOrder = async ({
  location,
  dishes,
  restaurant_id,
}: {
  location: string;
  dishes: IOrderDish[];
  restaurant_id: number;
}): Promise<IOrder> => {
  const data = {
    location: location,
    dishes: dishes,
    restaurant_id: restaurant_id,
  };
  try {
    const response = await apiClient.post<IOrder>(`/customer/orders`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
