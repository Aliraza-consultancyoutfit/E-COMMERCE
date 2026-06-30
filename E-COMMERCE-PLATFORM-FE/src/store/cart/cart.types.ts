export interface CartLineProduct {
  _id: string;
  name: string;
  price: number;
  oldPrice: number;
  image: string;
  category: string;
  stock: number;
}

export interface CartLine {
  product: CartLineProduct;
  quantity: number;
  lineTotal: number;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface CartResponse {
  items: CartLine[];
  coupon: string;
  summary: CartSummary;
}

export interface AddToCartArgs {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemArgs {
  productId: string;
  quantity: number;
}
