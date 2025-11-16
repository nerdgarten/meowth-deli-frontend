import { z } from "zod";

import { apiClient } from "@/libs/axios";

export async function queryOrderById(orderId: string): Promise<IOrderDetails> {
  const response = await apiClient.get<IOrderDetails>(`/order/${orderId}`);

  return response.data
}

const IOrderDetailsZod = z.object({
  id: z.number(),
  customer_id: z.number(),
  restaurant_id: z.number(),
  driver_id: z.number().nullable(),
  delivery_location_id: z.number(),
  customer: z.object({
    firstname: z.string(),
    lastname: z.string(),
    tel: z.string(),
    image: z.string().nullable(),
  }),
  restaurant: z.object({
    name: z.string(),
    detail: z.string(),
    tel: z.string(),
    banner: z.string().nullable(),
  }),
  driver: z.object({
    firstname: z.string(),
    lastname: z.string(),
    tel: z.string(),
    image: z.string().nullable(),
  }).nullable(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string(),
  }),
  status: z.enum(["pending", "preparing", "delivered", "rejected", "success"]),
  driver_fee: z.number(),
  remark: z.string().nullable(),
  total_amount: z.number(),
  created_at: z.string(),
  orderDishes: z.array(
    z.object({
      amount: z.number(),
      remark: z.string().nullable(),
      dish: z.object({
        id: z.number(),
        name: z.string(),
        detail: z.string(),
        price: z.number(),
        image: z.string().nullable(),
      })
    })
  ),
});

export type IOrderDetails = z.infer<typeof IOrderDetailsZod>;