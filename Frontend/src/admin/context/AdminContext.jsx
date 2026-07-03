import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { adminApi } from "../../api/adminApi";
import { contactApi } from "../../api/contactApi";

const AdminContext = createContext();

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}

const TALUKAS = ["Sawantwadi", "Kudal", "Kankavli", "Malvan", "Devgad", "Vengurla", "Vaibhavwadi", "Dodamarg"];

const normalizeMessage = (message) => ({
  id: message._id || message.id,
  senderName: message.name || message.senderName,
  senderEmail: message.email || message.senderEmail,
  subject: message.subject,
  message: message.message,
  date: message.createdAt ? new Date(message.createdAt).toISOString().slice(0, 10) : "",
  status: message.status || "Unread",
});

export default function AdminProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookSwaps, setBookSwaps] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reports, setReports] = useState([]);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryRecords, setCategoryRecords] = useState([]);
  const [talukas, setTalukas] = useState(TALUKAS);
  const [banners, setBanners] = useState([]);
  const [ads, setAds] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [settings, setSettings] = useState({
    general: { siteName: "SindhuSwap", supportEmail: "support@sindhuswap.com", supportPhone: "+91 98765 43210", maintenanceMode: false },
    security: { twoFactorAuth: false, sessionTimeout: 60, minPasswordLength: 8 },
    notifications: { emailOnRegistration: true, emailOnProductApproval: true, emailOnSwapRequest: true, pushOnMessages: true },
  });
  const [adminNotifications, setAdminNotifications] = useState([]);

  const logActivity = (action, target, details) => {
    setActivityLogs((current) => [
      { id: `log-${Date.now()}`, admin: "Admin", action, target, details, timestamp: new Date().toISOString() },
      ...current,
    ]);
  };

  const loadAdminData = async () => {
    const [
      productsResponse,
      usersResponse,
      categoriesResponse,
      messagesResponse,
      reviewsResponse,
      reportsResponse,
      swapsResponse,
      notificationsResponse,
    ] = await Promise.allSettled([
      adminApi.products(),
      adminApi.users(),
      adminApi.categories(),
      contactApi.list(),
      adminApi.reviews(),
      adminApi.reports(),
      adminApi.swaps(),
      adminApi.notifications(),
    ]);

    if (productsResponse.status === "fulfilled") setProducts(productsResponse.value.data.products || []);
    if (usersResponse.status === "fulfilled") setUsers(usersResponse.value.data.users || []);
    if (categoriesResponse.status === "fulfilled") {
      const records = categoriesResponse.value.data.categories || [];
      setCategoryRecords(records);
      setCategories(records.map((item) => item.name || item));
    }
    if (messagesResponse.status === "fulfilled") setMessages((messagesResponse.value.data.messages || []).map(normalizeMessage));
    if (reviewsResponse.status === "fulfilled") setReviews(reviewsResponse.value.data.reviews || []);
    if (reportsResponse.status === "fulfilled") setReports(reportsResponse.value.data.reports || []);
    if (swapsResponse.status === "fulfilled") setBookSwaps(swapsResponse.value.data.swaps || []);
    if (notificationsResponse.status === "fulfilled") setAdminNotifications(notificationsResponse.value.data.notifications || []);
  };

  useEffect(() => {
    loadAdminData().catch(() => {});
  }, []);

  const updateProduct = async (id, updatedData) => {
    const response = await adminApi.updateProduct(id, updatedData);
    const product = response.data.product;
    setProducts((current) => current.map((item) => (item.id === id ? product : item)));
    logActivity("Product Updated", product?.name || id, "Modified product details.");
  };

  const patchProductStatus = (id, status) => updateProduct(id, { status });
  const approveProduct = (id) => patchProductStatus(id, "Available");
  const rejectProduct = (id) => patchProductStatus(id, "Rejected");

  const deleteProduct = async (id) => {
    await adminApi.deleteProduct(id);
    setProducts((current) => current.filter((item) => item.id !== id));
    logActivity("Product Deleted", id, "Deleted listing from database.");
  };

  const bulkDeleteProducts = async (ids) => Promise.all(ids.map(deleteProduct));
  const bulkApproveProducts = async (ids) => Promise.all(ids.map(approveProduct));
  const bulkRejectProducts = async (ids) => Promise.all(ids.map(rejectProduct));

  const updateUser = async (id, payload) => {
    const response = await adminApi.updateUser(id, payload);
    const user = response.data.user;
    setUsers((current) => current.map((item) => (item.id === id ? user : item)));
  };

  const suspendUser = (id) => updateUser(id, { status: "Suspended" });
  const banUser = (id) => updateUser(id, { status: "Banned" });
  const activateUser = (id) => updateUser(id, { status: "Active" });
  const updateUserRole = (id, role) => updateUser(id, { role });
  const deleteUser = async (id) => {
    await adminApi.deleteUser(id);
    setUsers((current) => current.filter((item) => item.id !== id));
  };

  const addCategory = async (name) => {
    const response = await adminApi.createCategory({ name });
    const category = response.data.category;
    setCategoryRecords((current) => [...current, category]);
    setCategories((current) => [...new Set([...current, category.name])]);
  };
  const editCategory = async (oldName, newName) => {
    const category = categoryRecords.find((item) => item.name === oldName);
    if (category?._id) {
      const response = await adminApi.updateCategory(category._id, { name: newName });
      setCategoryRecords((current) => current.map((item) => (item._id === category._id ? response.data.category : item)));
    }
    setCategories((current) => current.map((item) => (item === oldName ? newName : item)));
  };
  const deleteCategory = async (name) => {
    const category = categoryRecords.find((item) => item.name === name);
    if (category?._id) {
      await adminApi.deleteCategory(category._id);
      setCategoryRecords((current) => current.filter((item) => item._id !== category._id));
    }
    setCategories((current) => current.filter((item) => item !== name));
  };

  const readMessage = async (id) => {
    await contactApi.markRead(id);
    setMessages((current) => current.map((item) => (item.id === id ? { ...item, status: "Read" } : item)));
  };
  const deleteMessage = async (id) => {
    await contactApi.remove(id);
    setMessages((current) => current.filter((item) => item.id !== id));
  };

  const updateLocalStatus = (setter, id, status) => setter((current) => current.map((item) => (item.id === id || item._id === id ? { ...item, status } : item)));
  const approveSwap = (id) => updateLocalStatus(setBookSwaps, id, "Accepted");
  const rejectSwap = (id) => updateLocalStatus(setBookSwaps, id, "Rejected");
  const completeSwap = (id) => updateLocalStatus(setBookSwaps, id, "Completed");
  const resolveReport = (id) => updateLocalStatus(setReports, id, "Resolved");
  const dismissReport = (id) => updateLocalStatus(setReports, id, "Dismissed");

  const addTaluka = (name) => setTalukas((current) => [...new Set([...current, name])]);
  const editTaluka = (oldName, newName) => setTalukas((current) => current.map((item) => (item === oldName ? newName : item)));
  const deleteTaluka = (name) => setTalukas((current) => current.filter((item) => item !== name));
  const addBanner = (banner) => setBanners((current) => [...current, { id: `ban-${Date.now()}`, status: "Active", ...banner }]);
  const toggleBannerStatus = (id) => updateLocalStatus(setBanners, id, "Inactive");
  const deleteBanner = (id) => setBanners((current) => current.filter((item) => item.id !== id));
  const addAd = (ad) => setAds((current) => [...current, { id: `ad-${Date.now()}`, status: "Active", clicks: 0, impressions: 0, ...ad }]);
  const toggleAdStatus = (id) => updateLocalStatus(setAds, id, "Inactive");
  const deleteAd = (id) => setAds((current) => current.filter((item) => item.id !== id));
  const addBlog = (blog) => setBlogs((current) => [...current, { id: `blog-${Date.now()}`, date: new Date().toISOString().slice(0, 10), ...blog }]);
  const editBlog = (id, updatedBlog) => setBlogs((current) => current.map((item) => (item.id === id ? { ...item, ...updatedBlog } : item)));
  const deleteBlog = (id) => setBlogs((current) => current.filter((item) => item.id !== id));
  const updateSettings = (section, data) => setSettings((current) => ({ ...current, [section]: { ...current[section], ...data } }));
  const sendPushNotification = (text) => setAdminNotifications((current) => [{ id: Date.now(), text, read: false, time: "Just now" }, ...current]);
  const markAllNotificationsRead = () => setAdminNotifications((current) => current.map((item) => ({ ...item, read: true })));
  const clearNotification = (id) => setAdminNotifications((current) => current.filter((item) => item.id !== id));

  const value = useMemo(() => ({
    products,
    users,
    bookSwaps,
    reviews,
    reports,
    orders,
    transactions,
    categories,
    talukas,
    banners,
    ads,
    blogs,
    messages,
    activityLogs,
    settings,
    adminNotifications,
    approveProduct,
    rejectProduct,
    deleteProduct,
    bulkDeleteProducts,
    bulkApproveProducts,
    bulkRejectProducts,
    updateProduct,
    suspendUser,
    banUser,
    activateUser,
    deleteUser,
    updateUserRole,
    approveSwap,
    rejectSwap,
    completeSwap,
    resolveReport,
    dismissReport,
    addCategory,
    editCategory,
    deleteCategory,
    addTaluka,
    editTaluka,
    deleteTaluka,
    addBanner,
    toggleBannerStatus,
    deleteBanner,
    addAd,
    toggleAdStatus,
    deleteAd,
    addBlog,
    editBlog,
    deleteBlog,
    readMessage,
    deleteMessage,
    updateSettings,
    sendPushNotification,
    markAllNotificationsRead,
    clearNotification,
    refreshAdminData: loadAdminData,
  }), [products, users, bookSwaps, reviews, reports, orders, transactions, categories, categoryRecords, talukas, banners, ads, blogs, messages, activityLogs, settings, adminNotifications]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

