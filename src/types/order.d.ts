import type { IDish } from "@/types/dish";

export interface IOrder {
  id: number;
  customer_id: number;
  driver_id?: number | null;
  restaurant_id: number;
  delivery_location_id: number;
  status: "pending" | "preparing" | "delivered" | "rejected" | "success";
  remark?: string | null;
  total_amount: number;
  driver_fee: number;
  created_at: string;
  customer: {
    firstname: string;
    lastname: string;
    tel: string;
    image?: string;
  };
  restaurant: {
    name: string;
    tel: string;
    detail?: string;
    banner?: string;
    location: {
      latitude: number;
      longitude: number;
      address: string;
    };
  };
  driver: {
    firstname: string;
    lastname: string;
    tel: string;
    image?: string;
    licence: string;
    vehicle: string;
  } | null;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  orderDishes: Array<{
    amount: number;
    remark?: string | null;
    dish: {
      id: number;
      name: string;
      detail?: string;
      price: number;
      image?: string;
    };
  }>;
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
