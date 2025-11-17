export interface IDish {
  id: string;
  name: string;
  detail: string;
  price: number;
  allergy: string;
  restaurant_id: string;
  is_out_of_stock: boolean;
  image?: string;
}
