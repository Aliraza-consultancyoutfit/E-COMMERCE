import type { OrderStatus, ShippingAddress } from "@/store/orders/order.types";

export interface CustomerListItem {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  orderCount: number;
  spent: number;
}

export interface CustomersResponse {
  records: CustomerListItem[];
  meta: { total: number; page: number; limit: number; pages: number };
}

export interface CustomerQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CustomerOrderSummary {
  _id: string;
  createdAt: string;
  status: OrderStatus;
  total: number;
}

export interface CustomerDetail {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  orderCount: number;
  spent: number;
  avgOrder: number;
  defaultAddress: ShippingAddress | null;
  recentOrders: CustomerOrderSummary[];
}
