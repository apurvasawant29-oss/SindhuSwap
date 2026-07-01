import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid,
  FiBarChart2,
  FiShoppingBag,
  FiBook,
  FiUsers,
  FiTrendingUp,
  FiCreditCard,
  FiRefreshCw,
  FiAlertTriangle,
  FiFolder,
  FiMapPin,
  FiMail,
  FiStar,
  FiBell,
  FiImage,
  FiCpu,
  FiFileText,
  FiShield,
  FiUser,
  FiList,
  FiHelpCircle,
  FiSettings,
  FiMenu,
  FiX,
  FiSearch,
  FiChevronDown,
  FiLogOut,
  FiDatabase,
  FiHeart
} from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";
import "../styles/admin.css";

// Group sidebar items
const navigationGroups = [
  {
    title: "Core",
    items: [
      { label: "Dashboard", to: "/admin", icon: FiGrid },
      { label: "Analytics", to: "/admin/analytics", icon: FiBarChart2 },
      { label: "Activity Logs", to: "/admin/activity-logs", icon: FiList }
    ]
  },
  {
    title: "Management",
    items: [
      { label: "Products", to: "/admin/products", icon: FiShoppingBag },
      { label: "Books", to: "/admin/books", icon: FiBook },
      { label: "Users", to: "/admin/users", icon: FiUsers },
      { label: "Book Swaps", to: "/admin/swaps", icon: FiRefreshCw },
      { label: "Orders", to: "/admin/orders", icon: FiTrendingUp },
      { label: "Transactions", to: "/admin/transactions", icon: FiCreditCard },
      { label: "Reports", to: "/admin/reports", icon: FiAlertTriangle },
      { label: "Reviews", to: "/admin/reviews", icon: FiStar }
    ]
  },
  {
    title: "Configuration",
    items: [
      { label: "Categories", to: "/admin/categories", icon: FiFolder },
      { label: "Talukas", to: "/admin/talukas", icon: FiMapPin },
      { label: "Banners", to: "/admin/banners", icon: FiImage },
      { label: "Advertisements", to: "/admin/advertisements", icon: FiCpu },
      { label: "Blogs", to: "/admin/blogs", icon: FiFileText },
      { label: "Notifications", to: "/admin/notifications", icon: FiBell }
    ]
  },
  {
    title: "Settings & System",
    items: [
      { label: "Roles & Permissions", to: "/admin/roles-permissions", icon: FiShield },
      { label: "Messages", to: "/admin/messages", icon: FiMail },
      { label: "Help Center", to: "/admin/help-center", icon: FiHelpCircle },
      { label: "Profile", to: "/admin/profile", icon: FiUser },
      { label: "Settings", to: "/admin/settings", icon: FiSettings }
    ]
  }
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifyDropdown, setShowNotifyDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [pingTime, setPingTime] = useState(42);
  const [dbUptime, setDbUptime] = useState("99.98%");
  
  const location = useLocation();
  const navigate = useNavigate();
  const { adminNotifications, markAllNotificationsRead, clearNotification } = useAdmin();

  // Simulate server status changes
  useEffect(() => {
    const timer = setInterval(() => {
      setPingTime(Math.floor(Math.random() * 20) + 30);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Compute breadcrumbs
  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter((x) => x);
    return paths.map((path, idx) => {
      const url = `/${paths.slice(0, idx + 1).join("/")}`;
      const isLast = idx === paths.length - 1;
      const formattedLabel = path
        .replace("-", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      return (
        <span key={url} className="flex items-center text-sm font-medium text-slate-500">
          <span className="mx-2 text-slate-300">/</span>
          {isLast ? (
            <span className="text-primary font-semibold">{formattedLabel}</span>
          ) : (
            <Link to={url} className="hover:text-primary transition-colors">
              {formattedLabel}
            </Link>
          )}
        </span>
      );
    });
  };

  // Find active label for header
  const getActivePageTitle = () => {
    for (const group of navigationGroups) {
      const found = group.items.find((item) => item.to === location.pathname);
      if (found) return found.label;
    }
    return "Admin Panel";
  };

  // Close mobile drawer on navigation
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const unreadCount = adminNotifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* 1. DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col bg-slate-900 text-slate-400 border-r border-slate-800 transition-all duration-300 h-screen sticky top-0 shrink-0 select-none overflow-hidden ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Sidebar Brand Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800 bg-slate-950/20 shrink-0">
          <div className="w-9 h-9 bg-primary/20 text-primary border border-primary/20 rounded-xl flex items-center justify-center text-lg font-bold shrink-0">
            <FiRefreshCw className="animate-spin-slow text-teal-400" />
          </div>
          {isSidebarOpen && (
            <span className="text-white font-extrabold text-base tracking-wide flex items-center">
              Sindhu<span className="text-teal-400">Swap</span>
              <span className="ml-2 text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/20 rounded px-1.5 py-0.5 uppercase tracking-widest font-mono">
                Admin
              </span>
            </span>
          )}
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto admin-scrollbar p-3 space-y-6">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {isSidebarOpen && (
                <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">
                  {group.title}
                </h4>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                      isActive
                        ? "bg-primary/25 border border-primary/30 text-teal-300 shadow-sm"
                        : "hover:bg-slate-800/40 hover:text-slate-100 border border-transparent"
                    }`}
                  >
                    <Icon className={`text-base shrink-0 ${isActive ? "text-teal-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                    {isSidebarOpen && <span>{item.label}</span>}
                    
                    {/* Tooltip for collapsed sidebar */}
                    {!isSidebarOpen && (
                      <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-950 text-white text-xs font-semibold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-lg z-50 whitespace-nowrap">
                        {item.label}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20 flex flex-col gap-2 shrink-0">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium hover:bg-slate-800/50 hover:text-slate-100 border border-transparent transition-colors w-full cursor-pointer"
          >
            <FiChevronDown className={`text-base transition-transform duration-300 ${!isSidebarOpen ? "-rotate-90" : "rotate-90"}`} />
            {isSidebarOpen && <span>Collapse Sidebar</span>}
          </button>
        </div>
      </aside>

      {/* 2. MOBILE DRAWER SIDEBAR */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-slate-950 z-50 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-slate-900 text-slate-400 border-r border-slate-800 z-50 flex flex-col p-4 md:hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <span className="text-white font-extrabold text-lg flex items-center">
                  Sindhu<span className="text-teal-400">Swap</span>
                  <span className="ml-2 text-[9px] bg-teal-500/20 text-teal-300 border border-teal-500/20 rounded px-1.5 py-0.5 uppercase tracking-widest font-mono">
                    Admin
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-200"
                >
                  <FiX />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto admin-scrollbar space-y-6">
                {navigationGroups.map((group) => (
                  <div key={group.title} className="space-y-1">
                    <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">
                      {group.title}
                    </h4>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.to;
                      return (
                        <NavLink
                          key={item.label}
                          to={item.to}
                          onClick={() => setIsMobileOpen(false)}
                          className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            isActive
                              ? "bg-primary/25 border border-primary/30 text-teal-300 shadow-sm"
                              : "hover:bg-slate-800/40 hover:text-slate-100"
                          }`}
                        >
                          <Icon className={`text-base ${isActive ? "text-teal-400" : "text-slate-500"}`} />
                          <span>{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER */}
        <header className="h-16 border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 md:hidden border border-slate-200"
            >
              <FiMenu className="text-lg" />
            </button>

            {/* Breadcrumbs (Desktop only) */}
            <nav className="hidden md:flex items-center text-slate-400" aria-label="Breadcrumb">
              <Link to="/admin" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium flex items-center gap-1.5">
                <FiGrid className="text-xs" /> Admin
              </Link>
              {getBreadcrumbs()}
            </nav>
          </div>

          {/* Quick Actions / System Health / Notifications */}
          <div className="flex items-center gap-4">
            {/* System Status Indicators */}
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50">
              <span className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-500">
                <FiCpu className="text-teal-500 animate-pulse" /> Ping: {pingTime}ms
              </span>
              <span className="h-3 w-px bg-slate-200" />
              <span className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-500">
                <FiDatabase className="text-teal-500" /> DB: {dbUptime}
              </span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotifyDropdown(!showNotifyDropdown);
                  setShowProfileDropdown(false);
                }}
                className={`p-2.5 rounded-xl border transition-all relative ${
                  showNotifyDropdown 
                    ? "bg-slate-100 border-slate-300 text-slate-800" 
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <FiBell className="text-lg" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifyDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifyDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-2 w-80 bg-white border border-slate-200/80 rounded-2xl shadow-premium z-50 p-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                        <span className="text-sm font-semibold text-slate-800">System Notifications</span>
                        <button
                          onClick={() => markAllNotificationsRead()}
                          className="text-[11px] text-primary hover:underline font-semibold"
                        >
                          Mark all read
                        </button>
                      </div>

                      <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 admin-scrollbar">
                        {adminNotifications.length === 0 ? (
                          <div className="py-8 text-center text-xs text-slate-400">No new alerts.</div>
                        ) : (
                          adminNotifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-2.5 rounded-xl border text-xs flex justify-between gap-2 transition-colors ${
                                notif.read 
                                  ? "bg-slate-50/50 border-slate-100 text-slate-500" 
                                  : "bg-teal-50/30 border-teal-100/60 text-slate-700 font-medium"
                              }`}
                            >
                              <div className="flex-1">
                                <p className="leading-relaxed">{notif.text}</p>
                                <span className="text-[10px] text-slate-400 mt-1 block">{notif.time}</span>
                              </div>
                              <button
                                onClick={() => clearNotification(notif.id)}
                                className="text-slate-400 hover:text-slate-600 self-start p-0.5 rounded hover:bg-slate-100"
                              >
                                <FiX className="text-xs" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowNotifyDropdown(false);
                }}
                className="flex items-center gap-2 border border-slate-200 rounded-xl p-1.5 hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  SA
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-slate-700">Super Admin</span>
                <FiChevronDown className="text-slate-400 text-xs hidden sm:inline" />
              </button>

              <AnimatePresence>
                {showProfileDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-2 w-52 bg-white border border-slate-200/80 rounded-2xl shadow-premium z-50 p-2"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-bold text-slate-800">Super Admin</p>
                        <p className="text-[10px] text-slate-400">admin@sindhuswap.com</p>
                      </div>

                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          navigate("/admin/profile");
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 rounded-xl transition-colors"
                      >
                        <FiUser className="text-slate-400 text-sm" /> My Profile
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          navigate("/admin/settings");
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 rounded-xl transition-colors"
                      >
                        <FiSettings className="text-slate-400 text-sm" /> Settings
                      </button>

                      <hr className="my-1 border-slate-100" />

                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          navigate("/");
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <FiLogOut className="text-red-400 text-sm" /> Exit Admin
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ROUTE CONTAINER */}
        <main className="flex-grow p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {/* Active view header (desktop layout title helper) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
                {getActivePageTitle()}
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                SindhuSwap System Administration Portal
              </p>
            </div>
            
            {/* Quick search input in header bar */}
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 hover:border-slate-300 focus:border-teal-500 rounded-xl pl-9 pr-4 py-2.5 outline-none transition-all placeholder-slate-400 text-slate-700"
              />
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="pb-16">
            <Outlet context={{ searchQuery }} />
          </div>
        </main>
      </div>
    </div>
  );
}
