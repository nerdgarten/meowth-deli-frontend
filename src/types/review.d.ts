export interface User {
  id: number;
  email: string;
}

export interface Customer {
  id: number;
  firstname: string;
  lastname: string;
}

export interface Restaurant {
  id: number;
  name: string;
}

export interface Driver {
  id: number;
  firstname: string;
  lastname: string;
}

export interface Review {
  id: number;
  user_id: number;
  restaurant_id: number;
  order_id: number;
  rate: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
  user: User;
  restaurant: Restaurant;
}

export interface DriverReview {
  id: number;
  customer_id: number;
  driver_id: number;
  order_id: number;
  rate: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
  customer: Customer;
  driver: Driver;
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
}

export interface ReviewResponse {
  id: number;
  title: string;
  customer_id: number;
  restaurant_id: number;
  rate: number;
  review_text?: string;
  image?: string;
  restaurant: {
    id: number;
    name: string;
    banner?: string;
    tel: string;
  };
  customer: {
    id: number;
    firstname: string;
    lastname: string;
    image?: string;
    tel: string;
  };
}

export interface DriverReviewResponse {
  data: DriverReview[];
  pagination: Pagination;
}
