import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card } from "../components/ui/card";
import { Package, Heart, Settings, CreditCard, MapPin, Bell, LogOut, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { login, register, getMyOrders, ShopOrder } from "../lib/api";

export function MyAccount() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const user = useMemo(() => {
    const value = localStorage.getItem("authUser");
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as { email?: string; fullName?: string };
    } catch {
      return null;
    }
  }, []);

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const loadOrders = async () => {
    if (!localStorage.getItem("token")) return;
    setOrdersLoading(true);
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch {
      // silently fail – user may not be logged in
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadOrders();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    const authKeys = [
      "token",
      "authToken",
      "accessToken",
      "jwt",
      "user",
      "authUser",
      "refreshToken",
    ];

    authKeys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    toast.success("You have been logged out");
    navigate("/");
    window.location.reload();
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      toast.success("Login successful");
      navigate("/account");
      window.location.reload();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await register(fullName, email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      toast.success("Account created and logged in");
      navigate("/account");
      window.location.reload();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl mb-6">My Account</h1>

          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="bg-white p-1">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="p-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full border rounded-md px-3 py-2"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="password"
                      className="w-full border rounded-md px-3 py-2"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Log In"}
                  </Button>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="p-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full border rounded-md px-3 py-2"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="password"
                      className="w-full border rounded-md px-3 py-2"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl">My Account</h1>
            <p className="text-sm text-gray-600 mt-1">{user?.fullName || user?.email || "Signed in"}</p>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="size-4" />
            Log Out
          </Button>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-white p-1">
            <TabsTrigger value="orders" className="gap-2">
              <Package className="size-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-2">
              <Heart className="size-4" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <Settings className="size-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">My Orders</h2>
              <Button variant="outline" size="sm" onClick={loadOrders} disabled={ordersLoading}>
                <RefreshCcw className={`size-4 mr-1 ${ordersLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
            {ordersLoading && orders.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-gray-600">Loading orders...</p>
              </Card>
            )}
            {!ordersLoading && orders.length === 0 && (
              <Card className="p-8 text-center">
                <Package className="size-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl mb-2">No orders yet</h2>
                <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                <Link to="/browse">
                  <Button>Browse Products</Button>
                </Link>
              </Card>
            )}
            {orders.map((order) => (
              <Card key={order.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-xs text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">LKR {Number(order.totalAmount || 0).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                      order.status === "PROCESSING" ? "bg-blue-100 text-blue-800" :
                      order.status === "SHIPPED" ? "bg-purple-100 text-purple-800" :
                      order.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                      order.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>{order.status}</span>
                  </div>
                </div>
                {order.items && order.items.length > 0 && (
                  <div className="border-t pt-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm py-1">
                        <span className="text-gray-700">{item.productName || "Product"} × {item.quantity}</span>
                        <span className="text-gray-600">LKR {Number(item.unitPrice).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {order.shippingAddress && (
                  <div className="border-t pt-2">
                    <p className="text-xs text-gray-500">Shipping to:</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{order.shippingAddress}</p>
                  </div>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-4">
            <Card className="p-8 text-center">
              <Heart className="size-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">Save items you love for later</p>
              <Link to="/browse">
                <Button>Discover Items</Button>
              </Link>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <Button>Save Changes</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl mb-4">Shipping Addresses</h2>
              <p className="text-gray-600 mb-4">No saved addresses</p>
              <Button variant="outline">
                <MapPin className="size-4 mr-2" />
                Add Address
              </Button>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl mb-4">Payment Methods</h2>
              <p className="text-gray-600 mb-4">No saved payment methods</p>
              <Button variant="outline">
                <CreditCard className="size-4 mr-2" />
                Add Payment Method
              </Button>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl mb-4">Notifications</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="size-4" defaultChecked />
                  <div>
                    <div className="font-medium">Order updates</div>
                    <div className="text-sm text-gray-600">Get notified about your order status</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="size-4" defaultChecked />
                  <div>
                    <div className="font-medium">Promotional emails</div>
                    <div className="text-sm text-gray-600">Receive deals and special offers</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="size-4" />
                  <div>
                    <div className="font-medium">New arrivals</div>
                    <div className="text-sm text-gray-600">Be the first to know about new products</div>
                  </div>
                </label>
              </div>
              <Button className="mt-4">Save Preferences</Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
