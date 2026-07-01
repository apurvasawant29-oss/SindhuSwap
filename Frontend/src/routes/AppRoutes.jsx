import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminProvider from "../admin/context/AdminContext";
import AdminLayout from "../admin/layouts/AdminLayout";
import Dashboard from "../admin/pages/Dashboard";
import Analytics from "../admin/pages/Analytics";
import Products from "../admin/pages/Products";
import Books from "../admin/pages/Books";
import Users from "../admin/pages/Users";
import Orders from "../admin/pages/Orders";
import Transactions from "../admin/pages/Transactions";
import Swaps from "../admin/pages/Swaps";
import Reports from "../admin/pages/Reports";
import Categories from "../admin/pages/Categories";
import Talukas from "../admin/pages/Talukas";
import Messages from "../admin/pages/Messages";
import Reviews from "../admin/pages/Reviews";
import Notifications from "../admin/pages/Notifications";
import Banners from "../admin/pages/Banners";
import Advertisements from "../admin/pages/Advertisements";
import Blogs from "../admin/pages/Blogs";
import SettingsAdmin from "../admin/pages/Settings";
import RolesPermissions from "../admin/pages/RolesPermissions";
import AdminProfile from "../admin/pages/AdminProfile";
import ActivityLogs from "../admin/pages/ActivityLogs";
import HelpCenter from "../admin/pages/HelpCenter";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import BookSwap from "../pages/books/BookSwap";
import Home from "../pages/home/Home";
import About from "../pages/info/About";
import Contact from "../pages/info/Contact";
import HelpCenterUser from "../pages/info/HelpCenter";
import NotFound from "../pages/NotFound";
import AddProduct from "../pages/product/AddProduct";
import CategoriesUser from "../pages/product/Categories";
import ProductDetails from "../pages/product/ProductDetails";
import Profile from "../pages/profile/Profile";
import Wishlist from "../pages/profile/Wishlist";
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
        <Route path="/help-center" element={<HelpCenterUser />} />
        <Route path="/categories" element={<CategoriesUser />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<AdminProvider><AdminLayout /></AdminProvider>}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/books" element={<Books />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/transactions" element={<Transactions />} />
            <Route path="/admin/swaps" element={<Swaps />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/talukas" element={<Talukas />} />
            <Route path="/admin/messages" element={<Messages />} />
            <Route path="/admin/reviews" element={<Reviews />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/banners" element={<Banners />} />
            <Route path="/admin/advertisements" element={<Advertisements />} />
            <Route path="/admin/blogs" element={<Blogs />} />
            <Route path="/admin/settings" element={<SettingsAdmin />} />
            <Route path="/admin/roles-permissions" element={<RolesPermissions />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/activity-logs" element={<ActivityLogs />} />
            <Route path="/admin/help-center" element={<HelpCenter />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
