import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Browse } from "./pages/Browse";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { SellerProfile } from "./pages/SellerProfile";
import { MyAccount } from "./pages/MyAccount";
import { Auth } from "./pages/Auth";
import { AdminDashboard } from "./pages/AdminDashboard";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "browse", Component: Browse },
      { path: "product/:id", Component: ProductDetail },
      { path: "cart", Component: Cart },
      { path: "seller/:id", Component: SellerProfile },
      { path: "account", Component: MyAccount },
      { path: "auth", Component: Auth },
      { path: "admin", Component: AdminDashboard },
      { path: "*", Component: NotFound },
    ],
  },
]);
