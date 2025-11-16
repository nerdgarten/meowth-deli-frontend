export interface ICreateLocation {
  address: string;
  latitude: number;
  longitude: number;
  id?: number;
}
export interface ILocation {
  id?: number;
  customer_id: number;
  address: string;
  is_default?: boolean;
}
