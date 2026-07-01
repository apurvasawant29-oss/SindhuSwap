import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiBell,
  FiShoppingBag,
  FiHeart,
  FiMessageCircle,
  FiRefreshCw,
  FiStar,
  FiAlertCircle,
  FiTrash2,
  FiCheck,
} from "react-icons/fi";
import PageShell from "../../components/common/PageShell";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "swap",
    title: "New Swap Request",
    message: "Priya sent you a swap request for 'Engineering Mathematics'.",
    time: "Today, 10:15 AM",
    timeGroup: "Today",
    isRead: false,
    sender: "Priya",
    link: "/bookswap",
  },
  {
    id: 2,
    type: "sold",
    title: "Product Sold!",
    message: "Congratulations! Your 'Dell Inspiron 15' has been sold to Appu.",
    time: "Today, 8:40 AM",
    timeGroup: "Today",
    isRead: false,
    sender: "Appu",
    link: "/profile",
  },
  {
    id: 3,
    type: "message",
    title: "New Message from Shweta",
    message: "'Is the study table price negotiable?'",
    time: "Yesterday, 6:30 PM",
    timeGroup: "Yesterday",
    isRead: true,
    sender: "Shweta",
    link: "/inbox?seller=Shweta",
  },
  {
    id: 4,
    type: "wishlist",
    title: "Price Drop on iPhone 12",
    message: "An item in your wishlist has dropped by Rs. 2,000.",
    time: "Yesterday, 11:20 AM",
    timeGroup: "Yesterday",
    isRead: false,
    link: "/product/2",
  },
  {
    id: 5,
    type: "review",
    title: "New Review Received",
    message: "Rohit left you a 5-star review: 'Great seller, fast communication.'",
    time: "3 days ago",
    timeGroup: "Earlier",
    isRead: true,
    sender: "Rohit",
    link: "/profile",
  },
  {
    id: 6,
    type: "system",
    title: "System Update: New Talukas Added",
    message: "SindhuSwap is now available in Dodamarg and Vengurla!",
    time: "4 days ago",
    timeGroup: "Earlier",
    isRead: true,
    link: "/help-center",
  },
  {
    id: 7,
    type: "swap",
    title: "Swap Request Accepted",
    message: "Amit accepted your swap request for 'Sony Headphones'. Contact him now.",
    time: "5 days ago",
    timeGroup: "Earlier",
    isRead: true,
    sender: "Amit",
    link: "/inbox?seller=Amit",
  },
];

function Notifications() {
  const [list, setList] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = list.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id) => {
    setList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setList((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDelete = (id) => {
    setList((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setList([]);
  };

  const filteredNotifications = list.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.isRead;
    if (activeTab === "swaps") return n.type === "swap";
    if (activeTab === "messages") return n.type === "message";
    if (activeTab === "system") return n.type === "system" || n.type === "sold";
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case "sold":
        return <FiShoppingBag className="h-5 w-5 text-emerald-600" />;
      case "wishlist":
        return <FiHeart className="h-5 w-5 text-rose-500" />;
      case "message":
        return <FiMessageCircle className="h-5 w-5 text-sky-500" />;
      case "swap":
        return <FiRefreshCw className="h-5 w-5 text-amber-500" />;
      case "review":
        return <FiStar className="h-5 w-5 text-purple-500" />;
      case "system":
      default:
        return <FiAlertCircle className="h-5 w-5 text-slate-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case "sold":
        return "bg-emerald-50 border-emerald-100";
      case "wishlist":
        return "bg-rose-50 border-rose-100";
      case "message":
        return "bg-sky-50 border-sky-100";
      case "swap":
        return "bg-amber-50 border-amber-100";
      case "review":
        return "bg-purple-50 border-purple-100";
      case "system":
      default:
        return "bg-slate-50 border-slate-100";
    }
  };

  // Grouping notifications by time group
  const grouped = {
    Today: filteredNotifications.filter((n) => n.timeGroup === "Today"),
    Yesterday: filteredNotifications.filter((n) => n.timeGroup === "Yesterday"),
    Earlier: filteredNotifications.filter((n) => n.timeGroup === "Earlier"),
  };

  const tabs = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread", count: unreadCount },
    { id: "swaps", label: "Swaps" },
    { id: "messages", label: "Messages" },
    { id: "system", label: "Updates" },
  ];

  return (
    <PageShell>
      <div className="min-h-screen bg-slate-50/50 py-10">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-700/10">
                <FiBell className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">Notifications</h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Manage your swap requests, messages, and listings updates.
                </p>
              </div>
            </div>

            {list.length > 0 && (
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100/80 rounded-lg transition-colors duration-200"
                  >
                    <FiCheckCircle className="h-4 w-4" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 rounded-lg transition-colors duration-200"
                >
                  <FiTrash2 className="h-4 w-4" />
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Filtering Tabs */}
          <div className="flex border-b border-slate-200 mb-6 overflow-x-auto scrollbar-none gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors duration-200 flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "text-teal-700"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white"
                  >
                    {tab.count}
                  </motion.span>
                )}
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.75 bg-teal-600 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
              <FiBell className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-lg font-bold text-slate-700">No notifications</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                You're all caught up! Updates about your swaps and account activities will show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.keys(grouped).map((groupName) => {
                const groupItems = grouped[groupName];
                if (groupItems.length === 0) return null;

                return (
                  <div key={groupName} className="space-y-3">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                      {groupName}
                    </h2>
                    <div className="space-y-2.5">
                      <AnimatePresence initial={false}>
                        {groupItems.map((n) => (
                          <motion.div
                            key={n.id}
                            initial={{ opacity: 0, height: 0, y: 15 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                            transition={{ duration: 0.25 }}
                            layout
                            className={`group relative overflow-hidden rounded-xl border bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.01)] hover:shadow-md transition-shadow duration-200 ${
                              n.isRead ? "border-slate-200/90 opacity-85" : "border-teal-200 ring-1 ring-teal-50"
                            }`}
                          >
                            <div className="flex gap-3.5">
                              {/* Icon Badge */}
                              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 shadow-sm ${getBgColor(n.type)}`}>
                                {getIcon(n.type)}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0 pr-8">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h3 className={`text-sm font-bold text-slate-800 ${!n.isRead ? "text-teal-900" : ""}`}>
                                    {n.title}
                                  </h3>
                                  {!n.isRead && (
                                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs.5 text-slate-600 mt-1 leading-relaxed">
                                  {n.message}
                                </p>
                                <div className="flex items-center gap-3 mt-2.5">
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    {n.time}
                                  </span>
                                  {n.link && (
                                    <Link
                                      to={n.link}
                                      onClick={() => handleMarkAsRead(n.id)}
                                      className="text-[10px] font-bold text-teal-600 hover:text-teal-700 hover:underline"
                                    >
                                      View details &rarr;
                                    </Link>
                                  )}
                                </div>
                              </div>

                              {/* Action hover bar */}
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white pl-2">
                                {!n.isRead && (
                                  <button
                                    onClick={() => handleMarkAsRead(n.id)}
                                    className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 transition-colors"
                                    title="Mark as Read"
                                  >
                                    <FiCheck className="h-3.5 w-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(n.id)}
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                                  title="Delete notification"
                                >
                                  <FiTrash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>

                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

export default Notifications;
