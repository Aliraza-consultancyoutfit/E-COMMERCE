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

export interface CheckoutArgs {
  shippingAddress: ShippingAddress;
  payment: {
    cardNumber: string;
    expiry: string;
    cvc: string;
    nameOnCard: string;
  };
}
