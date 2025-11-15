import { apiClient } from "@/libs/axios";
import type { IOrder } from "@/types/order";
import type { IOrderDish } from "@/types/order";
import type { IRestaurant } from "@/types/restaurant";

export const createOrder = async ({
  delivery_location_id,
  dishes,
  restaurant_id,
  driver_fee,
}: {
  delivery_location_id: number;
  dishes: IOrderDish[];
  restaurant_id: number;
  driver_fee: number;
}): Promise<IOrder> => {
  const data = {
    delivery_location_id: delivery_location_id,
    orderDishes: dishes,
    restaurant_id: restaurant_id,
    driver_fee: driver_fee,
  };
  try {
    const response = await apiClient.post<IOrder>(`/order`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getOrderById = async (order_id: number): Promise<IOrder> => {
  try {
    const response = await apiClient.get<IOrder>(`/order/${order_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dish:", error);
    throw error;
  }
};
