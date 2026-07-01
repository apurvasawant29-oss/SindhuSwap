import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../admin/pages/Dashboard";
import Products from "../admin/pages/Products";
import Reviews from "../admin/pages/Reviews";
import SettingsAdmin from "../admin/pages/Settings";
import Swaps from "../admin/pages/Swaps";
import Users from "../admin/pages/Users";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import BookSwap from "../pages/books/BookSwap";
import Home from "../pages/home/Home";
import About from "../pages/info/About";
import Contact from "../pages/info/Contact";
import HelpCenter from "../pages/info/HelpCenter";
import NotFound from "../pages/NotFound";
import AddProduct from "../pages/product/AddProduct";
import Categories from "../pages/product/Categories";
import ProductDetails from "../pages/product/ProductDetails";
import Profile from "../pages/profile/Profile";
import Wishlist from "../pages/profile/Wishlist";
import Notifications from "../pages/notifications/Notifications";
import Inbox from "../pages/chat/Inbox";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/bookswap" element={<BookSwap />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/chat" element={<Inbox />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/reviews" element={<Reviews />} />
          <Route path="/admin/swaps" element={<Swaps />} />
          <Route path="/admin/settings" element={<SettingsAdmin />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
