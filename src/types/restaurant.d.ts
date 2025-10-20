export interface Restaurant {
  id: number;
  verification_status: "approved" | "pending" | "rejected";
  is_available: boolean;
  name: string;
  image: string;
  fee_rate: number;
  location: string;
  detail: string;
  tel: string;
  created_at: string;
  updated_at: string;
}
