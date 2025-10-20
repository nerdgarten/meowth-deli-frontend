export interface IDish {
  id: number;
  name: string;
  detail: string;
  price: number;
  allergy: string;
  restaurant_id: number;
  is_out_of_stock: boolean;
}