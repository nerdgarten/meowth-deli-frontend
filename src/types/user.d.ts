export interface ICustomerProfile {
  firstname: string;
  lastname: string;
  tel: string;
  image: string;
}
export interface IRestaurantProfile {
  name: string;
  detail: string;
  tel: string;
  is_available: boolean;
  banner: string;
}
export interface IDriverProfile {
  firstname: string;
  lastname: string;
  tel: string;
  image: string;
}
export interface IVehicle {
  vehicle: string;
  licence: string;
}
