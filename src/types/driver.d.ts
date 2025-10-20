export interface Driver {
  id: number;
  firstname: string;
  lastname: string;
  tel: string;
  vehicle: string;
  licence: string;
  fee_rate: number;
  verification_status: "approved" | "pending" | "rejected";
  is_available: boolean;
  image: string;
  created_at: string;
  updated_at: string;
}
