export interface IRestaurant {
  id: number;
  verification_status: "approved" | "pending" | "rejected";
  is_available: boolean;
  name: string;
  banner: string;
  fee_rate: number;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    created_at?: Date;
    updated_at?: Date;
  };
  detail: string;
  tel: string;
  created_at: string;
  updated_at: string;
}
