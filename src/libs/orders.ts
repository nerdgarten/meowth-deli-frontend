import { apiClient } from "@/libs/axios";
import type { IOrder } from "@/types/order";
import type { IOrderDish } from "@/types/order";

export const createOrder = async ({
  delivery_location_id,
  dishes,
  restaurant_id,
  driver_fee,
  remark,
}: {
  delivery_location_id: number;
  dishes: IOrderDish[];
  restaurant_id: number;
  driver_fee: number;
  remark: string;
}): Promise<IOrder> => {
  const data = {
    delivery_location_id: delivery_location_id,
    orderDishes: dishes,
    restaurant_id: restaurant_id,
    driver_fee: driver_fee,
    remark: remark,
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
    console.error("Error fetching order:", error);
    throw error;
  }
};

export async function getRestaurantOrders(): Promise<IOrder[]> {
  const response = await apiClient.get<IOrder[]>(`/order/restaurant`);
  return response.data;
}

export async function updateOrderStatus(order_id: number, status: IOrder["status"]): Promise<void> {
  // TODO: implement update order status function
  return;
}
