export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export interface ApiUser {
  id: number;
  email: string;
  fullName?: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: ApiUser;
}

export interface ProductApi {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imagePath?: string;
}

export interface OrderItemApi {
  id: number;
  quantity: number;
  unitPrice: number;
  product: ProductApi;
}

export interface OrderApi {
  id: number;
  status: string;
  orderType?: "SHOP" | "STL_REVIEW" | string;
  stlFilePath?: string;
  shippingAddress?: string;
  totalAmount: number;
  createdAt: string;
  user?: ApiUser;
  items?: OrderItemApi[];
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(options.headers ?? {});
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
