import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { apiRequest, OrderApi, ProductApi } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const ORDER_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

interface CostInputs {
  materialCost: number;
  printHours: number;
  hourlyRate: number;
  laborCost: number;
  overheadPercent: number;
  profitPercent: number;
}

const defaultCostInputs: CostInputs = {
  materialCost: 0,
  printHours: 0,
  hourlyRate: 0,
  laborCost: 0,
  overheadPercent: 15,
  profitPercent: 20,
};

const emptyProduct: ProductApi = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  imagePath: "",
};

export function AdminDashboard() {
  const { isAdmin, token, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<ProductApi[]>([]);
  const [orders, setOrders] = useState<OrderApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);
  const [form, setForm] = useState<ProductApi>(emptyProduct);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [costInputs, setCostInputs] = useState<CostInputs>(defaultCostInputs);

  const costSummary = useMemo(() => {
    const machineCost = costInputs.printHours * costInputs.hourlyRate;
    const baseCost = costInputs.materialCost + machineCost + costInputs.laborCost;
    const overhead = baseCost * (costInputs.overheadPercent / 100);
    const subtotal = baseCost + overhead;
    const profit = subtotal * (costInputs.profitPercent / 100);
    const total = subtotal + profit;

    return { machineCost, baseCost, overhead, profit, total };
  }, [costInputs]);

  const loadDashboardData = async () => {
    if (!token) {
      return;
    }

    try {
      setLoading(true);
      const [productData, orderData] = await Promise.all([
        apiRequest<ProductApi[]>("/api/products"),
        apiRequest<OrderApi[]>("/api/orders/admin", {}, token),
      ]);
      setProducts(productData);
      setOrders(orderData);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load dashboard";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [token]);

  const resetProductForm = () => {
    setForm(emptyProduct);
    setEditingProductId(null);
  };

  const handleProductSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) {
      return;
    }

    try {
      setSavingProduct(true);
      if (editingProductId) {
        await apiRequest(`/api/products/${editingProductId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        }, token);
        toast.success("Product updated");
      } else {
        await apiRequest("/api/products", {
          method: "POST",
          body: JSON.stringify(form),
        }, token);
        toast.success("Product added");
      }

      await loadDashboardData();
      resetProductForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save product";
      toast.error(message);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleEditProduct = (product: ProductApi) => {
    setForm({
      name: product.name,
      description: product.description ?? "",
      price: Number(product.price ?? 0),
      stock: Number(product.stock ?? 0),
      imagePath: product.imagePath ?? "",
    });
    setEditingProductId(product.id ?? null);
  };

  const handleDeleteProduct = async (id?: number) => {
    if (!token || !id) {
      return;
    }

    try {
      await apiRequest(`/api/products/${id}`, { method: "DELETE" }, token);
      toast.success("Product removed");
      await loadDashboardData();
      if (editingProductId === id) {
        resetProductForm();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to remove product";
      toast.error(message);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    if (!token) {
      return;
    }

    try {
      await apiRequest(`/api/orders/admin/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }, token);
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
      toast.success("Order status updated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update order status";
      toast.error(message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <h1 className="text-3xl mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 mb-6">Please sign in as an admin to continue.</p>
            <Link to="/auth">
              <Button>Go to Sign In</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <h1 className="text-3xl mb-2">Admin Access Required</h1>
            <p className="text-gray-600">Your account does not have admin privileges.</p>
          </Card>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter((order) => order.status === "PENDING").length;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl">Admin Dashboard</h1>
          <p className="text-gray-600">Manage products, orders, and print costing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-500">Products</div>
            <div className="text-3xl font-semibold">{products.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Orders</div>
            <div className="text-3xl font-semibold">{orders.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Pending Orders</div>
            <div className="text-3xl font-semibold">{pendingOrders}</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl mb-4">Product Management</h2>
            <form className="space-y-3" onSubmit={handleProductSubmit}>
              <Input
                required
                value={form.name}
                placeholder="Product name"
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              />
              <textarea
                className="w-full border rounded-md px-3 py-2 min-h-24"
                placeholder="Product description"
                value={form.description ?? ""}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  required
                  placeholder="Price"
                  value={form.price}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, price: Number(event.target.value || 0) }))
                  }
                />
                <Input
                  type="number"
                  min={0}
                  required
                  placeholder="Stock"
                  value={form.stock}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, stock: Number(event.target.value || 0) }))
                  }
                />
                <Input
                  placeholder="Image path"
                  value={form.imagePath ?? ""}
                  onChange={(event) => setForm((prev) => ({ ...prev, imagePath: event.target.value }))}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={savingProduct}>
                  {savingProduct ? "Saving..." : editingProductId ? "Update Product" : "Add Product"}
                </Button>
                {editingProductId && (
                  <Button type="button" variant="outline" onClick={resetProductForm}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-6 max-h-80 overflow-auto border rounded-md">
              {products.map((product) => (
                <div key={product.id} className="p-3 border-b last:border-b-0 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-600">
                      LKR {Number(product.price).toFixed(2)} • Stock: {product.stock}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => handleEditProduct(product)}>
                      Edit
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              {!loading && products.length === 0 && <div className="p-4 text-sm text-gray-600">No products found.</div>}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl mb-4">Orders</h2>
            <div className="space-y-3 max-h-[32rem] overflow-auto">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-md p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="font-medium">Order #{order.id}</div>
                      <div className="text-sm text-gray-600">{order.user?.email ?? "Unknown user"}</div>
                    </div>
                    <div className="text-sm">LKR {Number(order.totalAmount).toFixed(2)}</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
                    <select
                      className="border rounded-md px-3 py-2"
                      value={order.status}
                      onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <div className="text-sm text-gray-600 self-center">{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              ))}
              {!loading && orders.length === 0 && <div className="text-sm text-gray-600">No orders yet.</div>}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl mb-4">Cost Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <Input
              type="number"
              min={0}
              step="0.01"
              placeholder="Material cost"
              value={costInputs.materialCost}
              onChange={(event) =>
                setCostInputs((prev) => ({ ...prev, materialCost: Number(event.target.value || 0) }))
              }
            />
            <Input
              type="number"
              min={0}
              step="0.1"
              placeholder="Print hours"
              value={costInputs.printHours}
              onChange={(event) =>
                setCostInputs((prev) => ({ ...prev, printHours: Number(event.target.value || 0) }))
              }
            />
            <Input
              type="number"
              min={0}
              step="0.01"
              placeholder="Hourly machine rate"
              value={costInputs.hourlyRate}
              onChange={(event) =>
                setCostInputs((prev) => ({ ...prev, hourlyRate: Number(event.target.value || 0) }))
              }
            />
            <Input
              type="number"
              min={0}
              step="0.01"
              placeholder="Labor cost"
              value={costInputs.laborCost}
              onChange={(event) =>
                setCostInputs((prev) => ({ ...prev, laborCost: Number(event.target.value || 0) }))
              }
            />
            <Input
              type="number"
              min={0}
              step="0.1"
              placeholder="Overhead %"
              value={costInputs.overheadPercent}
              onChange={(event) =>
                setCostInputs((prev) => ({ ...prev, overheadPercent: Number(event.target.value || 0) }))
              }
            />
            <Input
              type="number"
              min={0}
              step="0.1"
              placeholder="Profit %"
              value={costInputs.profitPercent}
              onChange={(event) =>
                setCostInputs((prev) => ({ ...prev, profitPercent: Number(event.target.value || 0) }))
              }
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
            <div className="border rounded-md p-3">
              <div className="text-gray-500">Machine Cost</div>
              <div className="font-semibold">LKR {costSummary.machineCost.toFixed(2)}</div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-gray-500">Base Cost</div>
              <div className="font-semibold">LKR {costSummary.baseCost.toFixed(2)}</div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-gray-500">Overhead</div>
              <div className="font-semibold">LKR {costSummary.overhead.toFixed(2)}</div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-gray-500">Profit</div>
              <div className="font-semibold">LKR {costSummary.profit.toFixed(2)}</div>
            </div>
            <div className="border rounded-md p-3 bg-blue-50">
              <div className="text-gray-500">Recommended Price</div>
              <div className="font-semibold">LKR {costSummary.total.toFixed(2)}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
