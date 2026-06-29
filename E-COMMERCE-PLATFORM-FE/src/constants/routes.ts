import { UserRole } from "@/store/auth/auth.types";

/**
 * Single source of truth for every path in the app. Components, guards, and the
 * nav read from here — never hardcode a route string.
 */
export const PATHS = {
  // Public storefront
  home: "/",
  catalog: "/catalog",
  product: (id: string) => `/product/${id}`,

  // Storefront content + system states
  content: {
    about: "/about",
    contact: "/contact",
    help: "/help",
    careers: "/careers",
    press: "/press",
    sustainability: "/sustainability",
    shipping: "/shipping",
    returns: "/returns",
    privacy: "/privacy",
    terms: "/terms",
    cookies: "/cookies",
  },
  accessDenied: "/access-denied",

  // Authenticated customer
  cart: "/cart",
  checkout: "/checkout",
  account: "/account",

  // Guest-only
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
  },

  // Admin
  admin: {
    root: "/admin",
    products: "/admin/products",
    productNew: "/admin/products/new",
    product: (id: string) => `/admin/products/${id}`,
    orders: "/admin/orders",
    customers: "/admin/customers",
    customer: (id: string) => `/admin/customers/${id}`,
    reports: "/admin/reports",
    users: "/admin/users",
    settings: "/admin/settings",
    logs: "/admin/logs",
  },
} as const;

/**
 * Which role each guarded route group requires. `null` = any authenticated user.
 * Guards in the route-group layouts read from this map.
 */
export const ROUTE_ACCESS = {
  customer: { requiresAuth: true, role: null as UserRole | null },
  admin: { requiresAuth: true, role: UserRole.ADMIN },
  guest: { requiresAuth: false, role: null as UserRole | null },
} as const;

/** Where each role lands after signing in, and where to send the unauthorized. */
export const REDIRECTS = {
  afterLogin: {
    [UserRole.ADMIN]: PATHS.admin.root,
    [UserRole.USER]: PATHS.home,
  },
  signIn: PATHS.auth.signIn,
  home: PATHS.home,
} as const;
