export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  zip: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  coupon: string;
  paymentLast4: string;
  status: OrderStatus;
  createdAt: string;
}

export interface AdminOrderUser {
  _id: string;
  name?: string;
  email: string;
}

export interface AdminOrder extends Omit<Order, "shippingAddress"> {
  user: AdminOrderUser;
  shippingAddress: ShippingAddress;
}

export interface AdminOrdersResponse {
  records: AdminOrder[];
  meta: { total: number; page: number; limit: number; pages: number };
}

export interface AdminOrderQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  pendingCount: number;
  statusCounts: Record<OrderStatus, number>;
  monthly: { label: string; revenue: number }[];
  categoryMix: { category: string; revenue: number; units: number; pct: number }[];
  topProducts: { name: string; units: number; revenue: number }[];
  lowStock: { _id: string; name: string; stock: number; category: string }[];
}

export interface CheckoutArgs {
  shippingAddress: ShippingAddress;
  paymentIntentId: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  amount: number;
}
