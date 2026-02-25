import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card } from "../components/ui/card";
import { Package, Heart, Settings, CreditCard, MapPin, Bell } from "lucide-react";

export function MyAccount() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl mb-8">My Account</h1>

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
            <Card className="p-8 text-center">
              <Package className="size-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
              <Link to="/browse">
                <Button>Browse Products</Button>
              </Link>
            </Card>
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
