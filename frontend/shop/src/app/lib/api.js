

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

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

async function postJson(path, body) {
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

	return (await response.json());
}

async function authJson(path, options = {}) {
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
		return null;
	}

	return (await response.json());
}

export function login(email, password) {
	return postJson("/auth/login", { email, password });
}

export function register(fullName, email, password) {
	return postJson("/auth/register", { fullName, email, password });
}

export function getAdminShopOrders() {
	return authJson("/orders/admin");
}

export function updateAdminShopOrderStatus(orderId, status) {
	return authJson(`/orders/admin/${orderId}/status`, {
		method: "PUT",
		body: { status },
	});
}

export function getAdminStlOrders() {
	return authJson("/stl-orders/admin");
}

export function updateAdminStlOrderStatus(orderId, status) {
	return authJson(`/stl-orders/admin/${orderId}/status`, {
		method: "PUT",
		body: { status },
	});
}

export function calculateStlCost(params) {
	return authJson("/stl-orders/calculate-cost", {
		method: "POST",
		body: params,
	});
}

export function updateStlOrderPrice(orderId, estimatedPrice) {
	return authJson(`/stl-orders/admin/${orderId}/price`, {
		method: "PUT",
		body: { estimatedPrice },
	});
}

export function placeOrder(shippingAddress, items) {
	return authJson("/orders", {
		method: "POST",
		body: { shippingAddress, items },
	});
}

export function getMyOrders() {
	return authJson("/orders");
}

export function createProduct(formData) {
	const token = localStorage.getItem("token");
	if (!token) throw new Error("Please log in first");

	return fetch(`${API_BASE_URL}/products`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	}).then(async (res) => {
		if (!res.ok) {
			const errorText = await res.text();
			throw new Error(errorText || "Product creation failed");
		}
		return res.json();
	});
}

export function getAllProducts() {
	return fetch(`${API_BASE_URL}/products`).then(async (res) => {
		if (!res.ok) throw new Error("Failed to fetch products");
		return res.json();
	});
}

export function updateProduct(id, formData) {
	const token = localStorage.getItem("token");
	if (!token) throw new Error("Please log in first");

	return fetch(`${API_BASE_URL}/products/${id}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	}).then(async (res) => {
		if (!res.ok) {
			const errorText = await res.text();
			throw new Error(errorText || "Product update failed");
		}
		return res.json();
	});
}

export function deleteProduct(id) {
	const token = localStorage.getItem("token");
	if (!token) throw new Error("Please log in first");

	return fetch(`${API_BASE_URL}/products/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}).then(async (res) => {
		if (!res.ok) {
			const errorText = await res.text();
			throw new Error(errorText || "Product deletion failed");
		}
		return null;
	});
}
