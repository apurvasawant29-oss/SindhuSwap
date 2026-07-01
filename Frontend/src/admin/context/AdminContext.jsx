import { createContext, useContext, useEffect, useState } from "react";
import fortImage from "../../assets/sindhu.jpg";
import productImage from "../../assets/sawantwadi.jpg";
import peopleImage from "../../assets/us.jpeg";

const AdminContext = createContext();

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}

// Help helper to get items from local storage or fallback
const getLocalStorage = (key, fallback) => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
};

export default function AdminProvider({ children }) {
  // --- SEED MOCK DATA ---
  
  // 1. Initial Products
  const initialProducts = [
    {
      id: "prod-1",
      name: "Dell Inspiron 15",
      category: "Laptops",
      price: 18500,
      condition: "Excellent",
      taluka: "Sawantwadi",
      seller: "Appu",
      sellerId: "user-1",
      rating: 4.8,
      image: productImage,
      featured: true,
      status: "Available", // Available, Exchanged, Sold, Pending Approval
      createdAt: "2026-06-30T10:00:00Z"
    },
    {
      id: "prod-2",
      name: "iPhone 12 (128GB)",
      category: "Mobiles",
      price: 32000,
      condition: "Good",
      taluka: "Kankavli",
      seller: "Shweta",
      sellerId: "user-2",
      rating: 4.7,
      image: fortImage,
      featured: true,
      status: "Available",
      createdAt: "2026-06-29T14:30:00Z"
    },
    {
      id: "prod-3",
      name: "Wooden Study Table",
      category: "Furniture",
      price: 2500,
      condition: "Like New",
      taluka: "Kudal",
      seller: "Riya Patil",
      sellerId: "user-3",
      rating: 4.5,
      image: peopleImage,
      featured: false,
      status: "Pending Approval",
      createdAt: "2026-07-01T08:15:00Z"
    },
    {
      id: "prod-4",
      name: "Let Us C Programming Book",
      category: "Books",
      price: 150,
      condition: "Readable",
      taluka: "Sangamner",
      seller: "Gauri",
      sellerId: "user-4",
      rating: 4.6,
      image: productImage,
      featured: false,
      status: "Available",
      createdAt: "2026-06-28T09:00:00Z"
    },
    {
      id: "prod-5",
      name: "Royal Enfield Classic 350",
      category: "Vehicles",
      price: 95000,
      condition: "Excellent",
      taluka: "Malvan",
      seller: "Omkar Naik",
      sellerId: "user-5",
      rating: 4.9,
      image: fortImage,
      featured: true,
      status: "Pending Approval",
      createdAt: "2026-07-01T11:45:00Z"
    },
    {
      id: "prod-6",
      name: "3-Seater Premium Sofa",
      category: "Furniture",
      price: 8500,
      condition: "Good",
      taluka: "Vengurla",
      seller: "Sneha Sawant",
      sellerId: "user-6",
      rating: 4.8,
      image: peopleImage,
      featured: false,
      status: "Available",
      createdAt: "2026-06-27T16:20:00Z"
    }
  ];

  // 2. Initial Users
  const initialUsers = [
    {
      id: "user-1",
      name: "Appu",
      email: "appu@sindhuswap.com",
      phone: "+91 99887 76655",
      role: "User", // User, Moderator, Admin
      status: "Active", // Active, Suspended, Banned
      taluka: "Sawantwadi",
      rating: 4.9,
      profileImage: peopleImage,
      joinedDate: "2025-10-15"
    },
    {
      id: "user-2",
      name: "Shweta",
      email: "shweta@sindhuswap.com",
      phone: "+91 88776 65544",
      role: "User",
      status: "Active",
      taluka: "Kudal",
      rating: 4.8,
      profileImage: peopleImage,
      joinedDate: "2025-11-20"
    },
    {
      id: "user-3",
      name: "Riya Patil",
      email: "riya@gmail.com",
      phone: "+91 77665 54433",
      role: "User",
      status: "Active",
      taluka: "Kudal",
      rating: 4.7,
      profileImage: peopleImage,
      joinedDate: "2026-01-12"
    },
    {
      id: "user-4",
      name: "Gauri",
      email: "gauri@outlook.com",
      phone: "+91 91234 56789",
      role: "Moderator",
      status: "Active",
      taluka: "Kankavli",
      rating: 4.6,
      profileImage: peopleImage,
      joinedDate: "2025-08-05"
    },
    {
      id: "user-5",
      name: "Omkar Naik",
      email: "omkar@sindhuswap.com",
      phone: "+91 98111 22233",
      role: "User",
      status: "Suspended",
      taluka: "Malvan",
      rating: 4.9,
      profileImage: peopleImage,
      joinedDate: "2025-12-01"
    },
    {
      id: "user-6",
      name: "Sneha Sawant",
      email: "sneha@yahoo.com",
      phone: "+91 94222 33344",
      role: "User",
      status: "Banned",
      taluka: "Sawantwadi",
      rating: 4.8,
      profileImage: peopleImage,
      joinedDate: "2026-02-18"
    }
  ];

  // 3. Initial Book Swaps
  const initialBookSwaps = [
    {
      id: "swap-1",
      bookTitle: "Java Programming (Complete Reference)",
      ownerName: "Appu",
      ownerId: "user-1",
      requesterName: "Shweta",
      requesterId: "user-2",
      status: "Pending", // Pending, Accepted, Rejected, Completed
      createdAt: "2026-07-01T15:20:00Z",
      messages: [
        { sender: "Shweta", text: "Hey Appu, I'm interested in swapping my C++ book for your Java book.", time: "15:20" },
        { sender: "Appu", text: "Hi! That sounds great. Which publication is your C++ book?", time: "15:25" }
      ]
    },
    {
      id: "swap-2",
      bookTitle: "Concepts of Physics - Vol 1",
      ownerName: "Riya Patil",
      ownerId: "user-3",
      requesterName: "Gauri",
      requesterId: "user-4",
      status: "Accepted",
      createdAt: "2026-06-29T11:00:00Z",
      messages: [
        { sender: "Gauri", text: "Hi, is HC Verma still available for swap?", time: "11:00" },
        { sender: "Riya Patil", text: "Yes! Can we meet near Kudal ST stand tomorrow?", time: "11:05" },
        { sender: "Gauri", text: "Perfect, I'll bring the Organic Chemistry book.", time: "11:08" }
      ]
    },
    {
      id: "swap-3",
      bookTitle: "The Alchemist",
      ownerName: "Gauri",
      ownerId: "user-4",
      requesterName: "Appu",
      requesterId: "user-1",
      status: "Completed",
      createdAt: "2026-06-25T10:00:00Z",
      messages: [
        { sender: "Appu", text: "Awesome read, thanks for the swap!", time: "17:00" }
      ]
    }
  ];

  // 4. Initial Reviews
  const initialReviews = [
    {
      id: "rev-1",
      user: "Shweta",
      targetUser: "Appu",
      rating: 5,
      comment: "Very genuine seller. Laptop was in mint condition as described.",
      date: "2026-06-30"
    },
    {
      id: "rev-2",
      user: "Gauri",
      targetUser: "Shweta",
      rating: 4,
      comment: "Product was exactly as described. Communication was quick.",
      date: "2026-06-28"
    },
    {
      id: "rev-3",
      user: "Appu",
      targetUser: "Sneha Sawant",
      rating: 1,
      comment: "Aggressive behavior and refused to complete swap after meeting.",
      date: "2026-06-20"
    }
  ];

  // 5. Reports
  const initialReports = [
    {
      id: "rep-1",
      type: "Product", // Product, User, Book
      targetName: "iPhone 12 (128GB)",
      targetId: "prod-2",
      reporterName: "Riya Patil",
      reason: "Suspected Scam / Fake Listing",
      evidence: "Seller is demanding advance payment via Google Pay before meeting in person.",
      status: "Pending", // Pending, Resolved, Dismissed
      createdAt: "2026-07-01T12:00:00Z"
    },
    {
      id: "rep-2",
      type: "User",
      targetName: "Sneha Sawant",
      targetId: "user-6",
      reporterName: "Appu",
      reason: "Abusive Language",
      evidence: "Abused in chat messages after dispute over book condition.",
      status: "Resolved",
      createdAt: "2026-06-24T09:15:00Z"
    }
  ];

  // 6. Orders (Product Sales)
  const initialOrders = [
    {
      id: "ord-1001",
      productName: "Dell Inspiron 15",
      productId: "prod-1",
      seller: "Appu",
      buyer: "Shweta",
      price: 18500,
      paymentMethod: "Online UPI",
      status: "Completed",
      date: "2026-06-30"
    },
    {
      id: "ord-1002",
      productName: "Wooden Study Table",
      productId: "prod-3",
      seller: "Riya Patil",
      buyer: "Gauri",
      price: 2500,
      paymentMethod: "Cash on Delivery",
      status: "Processing",
      date: "2026-07-01"
    }
  ];

  // 7. Transactions (Money flow tracker)
  const initialTransactions = [
    {
      id: "tx-50001",
      orderId: "ord-1001",
      amount: 18500,
      method: "Razorpay (UPI)",
      sender: "Shweta",
      receiver: "Appu",
      status: "Success",
      date: "2026-06-30T10:15:00Z"
    },
    {
      id: "tx-50002",
      orderId: "ord-1002",
      amount: 250,
      method: "Platform Security Fee",
      sender: "Gauri",
      receiver: "Platform Admin",
      status: "Success",
      date: "2026-07-01T08:30:00Z"
    },
    {
      id: "tx-50003",
      orderId: "ord-new",
      amount: 12000,
      method: "Card Payment",
      sender: "Omkar Naik",
      receiver: "Seller",
      status: "Failed",
      date: "2026-06-29T18:45:00Z"
    }
  ];

  // 8. Categories
  const initialCategories = [
    "Mobiles",
    "Laptops",
    "Furniture",
    "Books",
    "Electronics",
    "Fashion",
    "Sports",
    "Vehicles",
    "Others"
  ];

  // 9. Talukas (Sindhudurg area boundaries)
  const initialTalukas = [
    "Sawantwadi",
    "Kudal",
    "Kankavli",
    "Malvan",
    "Devgad",
    "Vengurla",
    "Vaibhavwadi",
    "Dodamarg"
  ];

  // 10. Banners (Homepage Promo System)
  const initialBanners = [
    { id: "ban-1", title: "Monsoon Book Swap Fair", image: fortImage, status: "Active", link: "/bookswap" },
    { id: "ban-2", title: "Sell Safely locally in Kudal", image: peopleImage, status: "Active", link: "/categories" },
    { id: "ban-3", title: "Upgrade your Laptops - 15% Platform CashBack", image: productImage, status: "Inactive", link: "/categories" }
  ];

  // 11. Advertisements
  const initialAds = [
    { id: "ad-1", advertiser: "Sawantwadi Toyota Services", position: "Sidebar Banner", clicks: 340, impressions: 12800, status: "Active" },
    { id: "ad-2", advertiser: "Kudal Coaching Classes", position: "Bottom Footer Ad", clicks: 125, impressions: 8400, status: "Active" }
  ];

  // 12. Blogs (Community updates)
  const initialBlogs = [
    { id: "blog-1", title: "5 Essential Safety Tips for Face-to-Face Swaps", category: "Tips", author: "Admin", date: "2026-06-28", status: "Published" },
    { id: "blog-2", title: "Why Book Swapping is Gaining Traction in Sindhudurg Colleges", category: "Community", author: "Gauri", date: "2026-06-25", status: "Published" },
    { id: "blog-3", title: "Introducing Online Escrow Verification Payments for High Value Gadgets", category: "Updates", author: "Admin", date: "2026-07-01", status: "Draft" }
  ];

  // 13. System Messages (Contact form/Inquiries submissions)
  const initialMessages = [
    { id: "msg-1", senderName: "Rohan Parab", senderEmail: "rohan@gmail.com", subject: "Unable to upload image", message: "Hey, I tried listing my cycle but the image upload throws a network timeout. Please help.", date: "2026-07-01", status: "Unread" },
    { id: "msg-2", senderName: "Pooja Gawde", senderEmail: "pooja@yahoo.com", subject: "Partnership Inquiry", message: "We would love to advertise our stationery store on SindhuSwap footer banners. Who can we talk to?", date: "2026-06-29", status: "Read" }
  ];

  // 14. Activity Logs (Audit system logs)
  const initialActivityLogs = [
    { id: "log-1", admin: "Super Admin", action: "User Suspended", target: "Omkar Naik", timestamp: "2026-07-01T14:10:00Z", details: "Suspended for listing suspicious duplicated products." },
    { id: "log-2", admin: "Super Admin", action: "Review Deleted", target: "rev-3", timestamp: "2026-06-29T10:05:00Z", details: "Removed review due to toxic remarks." },
    { id: "log-3", admin: "Super Admin", action: "System Backup Created", target: "Database System", timestamp: "2026-07-01T00:00:00Z", details: "Nightly automated cloud snapshot completed successfully." }
  ];

  // 15. General Settings
  const initialSettings = {
    general: {
      siteName: "SindhuSwap",
      siteLogo: "",
      supportEmail: "support@sindhuswap.com",
      supportPhone: "+91 98765 43210",
      theme: "light",
      maintenanceMode: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 60, // minutes
      minPasswordLength: 8
    },
    notifications: {
      emailOnRegistration: true,
      emailOnProductApproval: true,
      emailOnSwapRequest: true,
      pushOnMessages: true
    }
  };

  // --- STATE REGISTRY ---
  const [products, setProducts] = useState(() => getLocalStorage("ss_admin_products", initialProducts));
  const [users, setUsers] = useState(() => getLocalStorage("ss_admin_users", initialUsers));
  const [bookSwaps, setBookSwaps] = useState(() => getLocalStorage("ss_admin_book_swaps", initialBookSwaps));
  const [reviews, setReviews] = useState(() => getLocalStorage("ss_admin_reviews", initialReviews));
  const [reports, setReports] = useState(() => getLocalStorage("ss_admin_reports", initialReports));
  const [orders, setOrders] = useState(() => getLocalStorage("ss_admin_orders", initialOrders));
  const [transactions, setTransactions] = useState(() => getLocalStorage("ss_admin_transactions", initialTransactions));
  const [categories, setCategories] = useState(() => getLocalStorage("ss_admin_categories", initialCategories));
  const [talukas, setTalukas] = useState(() => getLocalStorage("ss_admin_talukas", initialTalukas));
  const [banners, setBanners] = useState(() => getLocalStorage("ss_admin_banners", initialBanners));
  const [ads, setAds] = useState(() => getLocalStorage("ss_admin_ads", initialAds));
  const [blogs, setBlogs] = useState(() => getLocalStorage("ss_admin_blogs", initialBlogs));
  const [messages, setMessages] = useState(() => getLocalStorage("ss_admin_messages", initialMessages));
  const [activityLogs, setActivityLogs] = useState(() => getLocalStorage("ss_admin_activity_logs", initialActivityLogs));
  const [settings, setSettings] = useState(() => getLocalStorage("ss_admin_settings", initialSettings));
  
  // Custom user notifications panel
  const [adminNotifications, setAdminNotifications] = useState(() => getLocalStorage("ss_admin_notify", [
    { id: 1, text: "Suspicious activity report from Kudal user.", read: false, time: "5 mins ago" },
    { id: 2, text: "New swap request #swap-1 pending review.", read: false, time: "25 mins ago" },
    { id: 3, text: "Platform backup completed.", read: true, time: "12 hours ago" }
  ]));

  // Sync state to local storage on changes
  useEffect(() => { localStorage.setItem("ss_admin_products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("ss_admin_users", JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem("ss_admin_book_swaps", JSON.stringify(bookSwaps)); }, [bookSwaps]);
  useEffect(() => { localStorage.setItem("ss_admin_reviews", JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem("ss_admin_reports", JSON.stringify(reports)); }, [reports]);
  useEffect(() => { localStorage.setItem("ss_admin_orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("ss_admin_transactions", JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem("ss_admin_categories", JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem("ss_admin_talukas", JSON.stringify(talukas)); }, [talukas]);
  useEffect(() => { localStorage.setItem("ss_admin_banners", JSON.stringify(banners)); }, [banners]);
  useEffect(() => { localStorage.setItem("ss_admin_ads", JSON.stringify(ads)); }, [ads]);
  useEffect(() => { localStorage.setItem("ss_admin_blogs", JSON.stringify(blogs)); }, [blogs]);
  useEffect(() => { localStorage.setItem("ss_admin_messages", JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem("ss_admin_activity_logs", JSON.stringify(activityLogs)); }, [activityLogs]);
  useEffect(() => { localStorage.setItem("ss_admin_settings", JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem("ss_admin_notify", JSON.stringify(adminNotifications)); }, [adminNotifications]);

  // --- ACTIONS LOGGING HELPER ---
  const logActivity = (action, target, details) => {
    const newLog = {
      id: `log-${Date.now()}`,
      admin: "Super Admin",
      action,
      target,
      timestamp: new Date().toISOString(),
      details
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // --- CONTROLLERS ---

  // Products
  const approveProduct = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Available" } : p))
    );
    const prod = products.find((p) => p.id === id);
    logActivity("Product Approved", prod?.name || id, "Approved listing for local marketplace.");
  };

  const rejectProduct = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Rejected" } : p))
    );
    const prod = products.find((p) => p.id === id);
    logActivity("Product Rejected", prod?.name || id, "Rejected listing from local marketplace.");
  };

  const deleteProduct = (id) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    logActivity("Product Deleted", prod?.name || id, `Deleted listing permanently.`);
  };

  const bulkDeleteProducts = (ids) => {
    setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
    logActivity("Bulk Products Deleted", `${ids.length} products`, `Permanently removed multiple products.`);
  };

  const bulkApproveProducts = (ids) => {
    setProducts((prev) =>
      prev.map((p) => (ids.includes(p.id) ? { ...p, status: "Available" } : p))
    );
    logActivity("Bulk Products Approved", `${ids.length} products`, `Approved multiple listings simultaneously.`);
  };

  const bulkRejectProducts = (ids) => {
    setProducts((prev) =>
      prev.map((p) => (ids.includes(p.id) ? { ...p, status: "Rejected" } : p))
    );
    logActivity("Bulk Products Rejected", `${ids.length} products`, `Rejected multiple listings simultaneously.`);
  };

  const updateProduct = (id, updatedData) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
    logActivity("Product Updated", updatedData.name || id, "Modified product properties.");
  };

  // Users
  const suspendUser = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "Suspended" } : u))
    );
    const user = users.find((u) => u.id === id);
    logActivity("User Suspended", user?.name || id, "Suspended user privileges.");
  };

  const banUser = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "Banned" } : u))
    );
    const user = users.find((u) => u.id === id);
    logActivity("User Banned", user?.name || id, "Banned user credentials permanently.");
  };

  const activateUser = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "Active" } : u))
    );
    const user = users.find((u) => u.id === id);
    logActivity("User Activated", user?.name || id, "Restored user privileges.");
  };

  const deleteUser = (id) => {
    const user = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    logActivity("User Deleted", user?.name || id, "Deleted user account permanently.");
  };

  const updateUserRole = (id, role) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role } : u))
    );
    const user = users.find((u) => u.id === id);
    logActivity("User Role Updated", user?.name || id, `Changed role to: ${role}`);
  };

  // Book Swaps
  const approveSwap = (id) => {
    setBookSwaps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "Accepted" } : s))
    );
    const swap = bookSwaps.find((s) => s.id === id);
    logActivity("Book Swap Accepted", swap?.bookTitle || id, `Accepted swap request between ${swap?.ownerName} and ${swap?.requesterName}`);
  };

  const rejectSwap = (id) => {
    setBookSwaps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "Rejected" } : s))
    );
    const swap = bookSwaps.find((s) => s.id === id);
    logActivity("Book Swap Rejected", swap?.bookTitle || id, `Rejected swap request between ${swap?.ownerName} and ${swap?.requesterName}`);
  };

  const completeSwap = (id) => {
    setBookSwaps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "Completed" } : s))
    );
    const swap = bookSwaps.find((s) => s.id === id);
    logActivity("Book Swap Completed", swap?.bookTitle || id, `Marked swap request as completed.`);
  };

  // Reports
  const resolveReport = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Resolved" } : r))
    );
    const report = reports.find((r) => r.id === id);
    logActivity("Report Resolved", `Report #${id}`, `Resolved report of type ${report?.type} regarding ${report?.targetName}`);
  };

  const dismissReport = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Dismissed" } : r))
    );
    const report = reports.find((r) => r.id === id);
    logActivity("Report Dismissed", `Report #${id}`, `Dismissed report of type ${report?.type} regarding ${report?.targetName}`);
  };

  // Categories
  const addCategory = (name) => {
    if (!categories.includes(name)) {
      setCategories((prev) => [...prev, name]);
      logActivity("Category Added", name, `Added new product category.`);
    }
  };

  const editCategory = (oldName, newName) => {
    setCategories((prev) => prev.map((cat) => (cat === oldName ? newName : cat)));
    logActivity("Category Renamed", oldName, `Renamed category to ${newName}`);
  };

  const deleteCategory = (name) => {
    setCategories((prev) => prev.filter((cat) => cat !== name));
    logActivity("Category Deleted", name, `Removed category from database.`);
  };

  // Talukas
  const addTaluka = (name) => {
    if (!talukas.includes(name)) {
      setTalukas((prev) => [...prev, name]);
      logActivity("Taluka Added", name, `Registered new taluka boundary.`);
    }
  };

  const editTaluka = (oldName, newName) => {
    setTalukas((prev) => prev.map((tal) => (tal === oldName ? newName : tal)));
    logActivity("Taluka Renamed", oldName, `Renamed taluka to ${newName}`);
  };

  const deleteTaluka = (name) => {
    setTalukas((prev) => prev.filter((tal) => tal !== name));
    logActivity("Taluka Deleted", name, `Deregistered taluka.`);
  };

  // Banners
  const addBanner = (banner) => {
    const newBanner = { id: `ban-${Date.now()}`, status: "Active", ...banner };
    setBanners((prev) => [...prev, newBanner]);
    logActivity("Banner Added", banner.title, `Uploaded homepage promotion banner.`);
  };

  const toggleBannerStatus = (id) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: b.status === "Active" ? "Inactive" : "Active" } : b))
    );
    const banner = banners.find((b) => b.id === id);
    logActivity("Banner Status Toggled", banner?.title || id, `Changed active status to ${banner?.status === "Active" ? "Inactive" : "Active"}`);
  };

  const deleteBanner = (id) => {
    const banner = banners.find((b) => b.id === id);
    setBanners((prev) => prev.filter((b) => b.id !== id));
    logActivity("Banner Deleted", banner?.title || id, `Deleted homepage promotion banner.`);
  };

  // Ads
  const addAd = (ad) => {
    const newAd = { id: `ad-${Date.now()}`, clicks: 0, impressions: 0, status: "Active", ...ad };
    setAds((prev) => [...prev, newAd]);
    logActivity("Advertisement Added", ad.advertiser, `Added sponsored campaign.`);
  };

  const toggleAdStatus = (id) => {
    setAds((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: a.status === "Active" ? "Inactive" : "Active" } : a))
    );
    const ad = ads.find((a) => a.id === id);
    logActivity("Ad Status Toggled", ad?.advertiser || id, `Toggled advertiser campaign active state.`);
  };

  const deleteAd = (id) => {
    const ad = ads.find((a) => a.id === id);
    setAds((prev) => prev.filter((a) => a.id !== id));
    logActivity("Ad Deleted", ad?.advertiser || id, `Removed advertising campaign.`);
  };

  // Blogs
  const addBlog = (blog) => {
    const newBlog = { id: `blog-${Date.now()}`, date: new Date().toISOString().split("T")[0], ...blog };
    setBlogs((prev) => [...prev, newBlog]);
    logActivity("Blog Post Created", blog.title, `Authored new community article.`);
  };

  const editBlog = (id, updatedBlog) => {
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedBlog } : b))
    );
    logActivity("Blog Post Updated", updatedBlog.title || id, `Modified blog post attributes.`);
  };

  const deleteBlog = (id) => {
    const blog = blogs.find((b) => b.id === id);
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    logActivity("Blog Post Deleted", blog?.title || id, `Removed blog post.`);
  };

  // Messages
  const readMessage = (id) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "Read" } : m))
    );
  };

  const deleteMessage = (id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    logActivity("Support Inquiry Deleted", `Message #${id}`, `Removed customer support inquiry.`);
  };

  // Settings
  const updateSettings = (section, data) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
    logActivity("Settings Updated", `${section.toUpperCase()} config`, `Modified global settings parameters.`);
  };

  // Admin Push Notifications Sender
  const sendPushNotification = (text) => {
    const newNotification = {
      id: Date.now(),
      text,
      read: false,
      time: "Just now"
    };
    setAdminNotifications((prev) => [newNotification, ...prev]);
    logActivity("Push Notification Created", text, `Broadcasted system notification.`);
  };

  const markAllNotificationsRead = () => {
    setAdminNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setAdminNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <AdminContext.Provider
      value={{
        // Data states
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
        
        // Operations
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
        clearNotification
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
