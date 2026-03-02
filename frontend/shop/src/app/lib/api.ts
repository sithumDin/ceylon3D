export type AuthUser = {
	id: number;
	email: string;
	fullName?: string;
	roles?: string[];
};

export type AuthResponse = {
	token: string;
	tokenType: string;
	user: AuthUser;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export type ShopOrder = {
	id: number;
	status: string;
	totalAmount: number;
	shippingAddress?: string;
	createdAt?: string;
	category?: "SHOP" | "STL";
	user?: {
		id: number;
		email: string;
		fullName?: string;
	};
};

export type StlOrder = {
	id: number;
	customerName?: string;
	customerEmail?: string;
	phone?: string;
	fileName: string;
	fileSizeBytes: number;
	material: string;
	quantity: number;
	estimatedPrice: number;
	status: string;
	note?: string;
	createdAt?: string;
};

type AuthFetchOptions = {
	method?: "GET" | "POST" | "PUT" | "DELETE";
	body?: unknown;
};

function getAuthHeaders() {
	const token = localStorage.getItem("token");
	if (!token) {
		throw new Error("Please log in first");
	}

	return {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(errorText || "Request failed");
	}

	return (await response.json()) as T;
}

async function authJson<T>(path: string, options: AuthFetchOptions = {}): Promise<T> {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		method: options.method || "GET",
		headers: getAuthHeaders(),
		body: options.body ? JSON.stringify(options.body) : undefined,
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(errorText || "Request failed");
	}

	if (response.status === 204) {
		return null as T;
	}

	return (await response.json()) as T;
}

export function login(email: string, password: string) {
	return postJson<AuthResponse>("/auth/login", { email, password });
}

export function register(fullName: string, email: string, password: string) {
	return postJson<AuthResponse>("/auth/register", { fullName, email, password });
}

export function getAdminShopOrders() {
	return authJson<ShopOrder[]>("/orders/admin");
}

export function updateAdminShopOrderStatus(orderId: number, status: string) {
	return authJson<ShopOrder>(`/orders/admin/${orderId}/status`, {
		method: "PUT",
		body: { status },
	});
}

export function getAdminStlOrders() {
	return authJson<StlOrder[]>("/stl-orders/admin");
}

export function updateAdminStlOrderStatus(orderId: number, status: string) {
	return authJson<StlOrder>(`/stl-orders/admin/${orderId}/status`, {
		method: "PUT",
		body: { status },
	});
}

export function calculateStlCost(fileSizeBytes: number, material: string, quantity: number) {
	return authJson<{ estimatedPrice: number }>("/stl-orders/calculate-cost", {
		method: "POST",
		body: { fileSizeBytes, material, quantity },
	});
}

export function createProduct(payload: {
	name: string;
	description: string;
	price: number;
	stock: number;
	imagePath?: string;
}) {
	return authJson("/products", {
		method: "POST",
		body: payload,
	});
}
