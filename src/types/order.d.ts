
export interface IOrder {
  id: number;
  customer_id: number;
  driver_id?: number | null;
  location: string;
  status: "pending" |"preparing" | "delivered" |"rejected" | "success";
  remark?: string | null;
  total_amount: number;
  driver_fee: number;
}

export interface CartItem {
  dish: IDish;
  quantity: number;
}



export interface IOrderDish {
  dish_id: number;
  quantity: number;
}