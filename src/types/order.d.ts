export interface IOrder {
  id: number;
  customer_id: number;
  driver_id?: number | null;
  location: string;
  status: "pending" | "preparing" | "delivered" | "rejected" | "success";
  remark?: string | null;
  total_amount: number;
  driver_fee: number;
}

export interface CartItem {
  dish: IDish;
  quantity: number;
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
