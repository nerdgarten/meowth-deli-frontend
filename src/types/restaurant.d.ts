export interface IRestaurant {
  id: number;
  verification_status: string;
  is_available: boolean;
  name: string;
  fee_rate: number;
  location: string;
  detail: string;
  tel: string;
}