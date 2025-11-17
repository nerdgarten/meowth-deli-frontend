import type { IDish } from "@/types/dish";

export interface IOrder {
  id: number;
  customer_id: number;
  driver_id?: number | null;
  restaurant_id: number;
  status: "pending" | "preparing" | "delivered" | "rejected" | "success";
  remark?: string | null;
  total_amount: number;
  driver_fee: number;
  location: string;
}

export interface CartItem {
  dish: IDish;
  quantity: number;
}

export interface IOrderDish {
  dish_id: number;
  quantity: number;
}

export interface StoredOrder {
  id: string;
  restaurantId: string;
  createdAt: string;
  totalAmount: number;
}

export interface OrderItem {
  quantity: number;
  name: string;
  mods: string[];
  price: number;
}

export interface StatusTimeline {
  icon: React.ReactNode;
  title: string;
  time: string;
  status?: "Complete" | "In Progress";
}

export interface OrderDetails {
  id: string;
  driver?: {
    name: string;
  };
  restaurant: {
    name: string;
  };
  address: string;
  note: string;
  payment: {
    method: "meowth-wallet" | "cash";
    status: "Payment Waiting" | "Paid";
    walletBalance?: number;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  statusTimeline: StatusTimeline[];
  heroMessage: string;
  reportLink: string;
}
