import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  calculateStlCost,
  createProduct,
  getAdminShopOrders,
  getAdminStlOrders,
  ShopOrder,
  StlOrder,
  updateAdminShopOrderStatus,
  updateAdminStlOrderStatus,
} from "../lib/api";
import { toast } from "sonner";

const SHOP_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const STL_STATUSES = ["PENDING_QUOTE", "QUOTED", "PRINTING", "READY", "DELIVERED", "CANCELLED"];
const STL_MATERIALS = ["PLA", "ABS", "PETG", "RESIN"];

export function AdminDashboard() {
  const [shopOrders, setShopOrders] = useState<ShopOrder[]>([]);
  const [stlOrders, setStlOrders] = useState<StlOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [calculator, setCalculator] = useState({ fileSizeBytes: "1048576", material: "PLA", quantity: "1" });
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imagePath: "",
  });

  const authUser = useMemo(() => {
    const value = localStorage.getItem("authUser");
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as { fullName?: string; email?: string; roles?: string[] };
    } catch {
      return null;
    }
  }, []);

  const isAdmin = Boolean(authUser?.roles?.includes("ROLE_ADMIN"));
  const hasToken = Boolean(localStorage.getItem("token"));

  const loadData = async () => {
    setLoadingOrders(true);
    try {
      const [shop, stl] = await Promise.all([getAdminShopOrders(), getAdminStlOrders()]);
      setShopOrders(shop);
      setStlOrders(stl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load admin data";
      toast.error(message);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (hasToken && isAdmin) {
      loadData();
    }
  }, [hasToken, isAdmin]);

  const onShopStatusChange = async (orderId: number, status: string) => {
    try {
      await updateAdminShopOrderStatus(orderId, status);
      toast.success("Shop order status updated");
      await loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Status update failed";
      toast.error(message);
    }
  };

  const onStlStatusChange = async (orderId: number, status: string) => {
    try {
      await updateAdminStlOrderStatus(orderId, status);
      toast.success("STL order status updated");
      await loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Status update failed";
      toast.error(message);
    }
  };

  const onCalculate = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const fileSizeBytes = Number(calculator.fileSizeBytes);
      const quantity = Number(calculator.quantity);
      const result = await calculateStlCost(fileSizeBytes, calculator.material, quantity);
      setEstimatedPrice(result.estimatedPrice);
      toast.success("STL price calculated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Cost calculation failed";
      toast.error(message);
    }
  };

  const onCreateProduct = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await createProduct({
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        imagePath: productForm.imagePath || undefined,
      });

      toast.success("Product created");
      setProductForm({ name: "", description: "", price: "", stock: "", imagePath: "" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Product creation failed";
      toast.error(message);
    }
  };

  if (!hasToken) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please log in as admin to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You are logged in, but your account does not have admin access.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Manage STL orders, shop orders, and products.</p>
          </div>
          <Button onClick={loadData} disabled={loadingOrders}>
            {loadingOrders ? "Loading..." : "Refresh Orders"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>STL Cost Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onCalculate} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="number"
                min={1}
                className="w-full border rounded-md px-3 py-2"
                value={calculator.fileSizeBytes}
                onChange={(event) => setCalculator((prev) => ({ ...prev, fileSizeBytes: event.target.value }))}
                placeholder="File size (bytes)"
                required
              />
              <select
                className="w-full border rounded-md px-3 py-2"
                value={calculator.material}
                onChange={(event) => setCalculator((prev) => ({ ...prev, material: event.target.value }))}
              >
                {STL_MATERIALS.map((material) => (
                  <option key={material} value={material}>
                    {material}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                className="w-full border rounded-md px-3 py-2"
                value={calculator.quantity}
                onChange={(event) => setCalculator((prev) => ({ ...prev, quantity: event.target.value }))}
                placeholder="Quantity"
                required
              />
              <Button type="submit">Calculate</Button>
            </form>
            {estimatedPrice !== null && (
              <p className="mt-4 text-lg">Estimated Price: <span className="font-semibold">${estimatedPrice.toFixed(2)}</span></p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>STL Orders ({stlOrders.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[550px] overflow-auto">
              {stlOrders.length === 0 && <p className="text-gray-600">No STL orders yet.</p>}
              {stlOrders.map((order) => (
                <div key={order.id} className="border rounded-md p-3 space-y-2 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">Order #{order.id} · {order.material} · x{order.quantity}</p>
                      <p className="text-sm text-gray-600">{order.customerName || "Unknown"} ({order.customerEmail || "no-email"})</p>
                      <p className="text-sm text-gray-600">File: {order.fileName}</p>
                    </div>
                    <p className="font-semibold">${Number(order.estimatedPrice).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="border rounded-md px-2 py-1 text-sm"
                      value={order.status}
                      onChange={(event) => onStlStatusChange(order.id, event.target.value)}
                    >
                      {STL_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shop Orders ({shopOrders.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[550px] overflow-auto">
              {shopOrders.length === 0 && <p className="text-gray-600">No shop orders yet.</p>}
              {shopOrders.map((order) => (
                <div key={order.id} className="border rounded-md p-3 space-y-2 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">Order #{order.id} · {order.category || "SHOP"}</p>
                      <p className="text-sm text-gray-600">{order.user?.fullName || order.user?.email || "Unknown user"}</p>
                      <p className="text-sm text-gray-600">{order.shippingAddress || "No shipping address"}</p>
                    </div>
                    <p className="font-semibold">${Number(order.totalAmount || 0).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="border rounded-md px-2 py-1 text-sm"
                      value={order.status}
                      onChange={(event) => onShopStatusChange(order.id, event.target.value)}
                    >
                      {SHOP_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2"
                value={productForm.name}
                onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Product name"
                required
              />
              <input
                type="number"
                step="0.01"
                min={0}
                className="w-full border rounded-md px-3 py-2"
                value={productForm.price}
                onChange={(event) => setProductForm((prev) => ({ ...prev, price: event.target.value }))}
                placeholder="Price"
                required
              />
              <input
                type="number"
                min={0}
                className="w-full border rounded-md px-3 py-2"
                value={productForm.stock}
                onChange={(event) => setProductForm((prev) => ({ ...prev, stock: event.target.value }))}
                placeholder="Stock"
                required
              />
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2"
                value={productForm.imagePath}
                onChange={(event) => setProductForm((prev) => ({ ...prev, imagePath: event.target.value }))}
                placeholder="Image URL (optional)"
              />
              <textarea
                className="md:col-span-2 w-full border rounded-md px-3 py-2 min-h-[120px]"
                value={productForm.description}
                onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Description"
                required
              />
              <div className="md:col-span-2">
                <Button type="submit">Create Product</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
