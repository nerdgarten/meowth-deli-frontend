import type { ICreateLocation } from "./location";

export interface IRestaurant {
  id: number;
  verification_status: "approved" | "pending" | "rejected";
  is_available: boolean;
  name: string;
  banner: string;
  fee_rate: number;
  location?: ICreateLocation;
  detail: string;
  tel: string;
  created_at: string;
  updated_at: string;
}
