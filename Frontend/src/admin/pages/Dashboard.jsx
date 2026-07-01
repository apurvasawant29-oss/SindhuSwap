import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiShoppingBag,
  FiRefreshCw,
  FiTrendingUp,
  FiAlertTriangle,
  FiPlus,
  FiServer,
  FiMail,
  FiStar,
  FiBell,
  FiChevronRight,
  FiHeart,
  FiArrowRight,
  FiCheckCircle,
  FiActivity
} from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";
import StatsCard from "../components/common/StatsCard";
import AreaChart from "../components/charts/AreaChart";
import BarChart from "../components/charts/BarChart";
import PieChart from "../components/charts/PieChart";
import LineChart from "../components/charts/LineChart";
import Skeleton from "../components/common/Skeleton";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const {
    products,
    users,
    bookSwaps,
    reports,
    reviews,
    orders,
    activityLogs,
    adminNotifications,
    approveProduct,
    rejectProduct,
    sendPushNotification
  } = useAdmin();

  // Simulate skeleton loading on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 85000 / 100); // 850ms load
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Skeleton type="dashboard" />;
  }

  // --- STATS CALCULATIONS ---
  // 1. Revenue (Sum of Completed Orders)
  const totalRevenue = orders
    .filter((o) => o.status === "Completed")
    .reduce((sum, o) => sum + o.price, 0);

  // 2. Active Users count
  const activeUsersCount = users.filter((u) => u.status === "Active").length;

  // 3. Books Exchanged count
  const booksExchangedCount = bookSwaps.filter((s) => s.status === "Completed").length;

  // 4. Products Listed count
  const productsCount = products.length;

  // 5. Pending approvals count
  const pendingApprovalsCount = products.filter((p) => p.status === "Pending Approval").length;

  // --- CHART DATA GENERATION ---
  // 1. Sales Trend Area Chart
  const salesChartData = [
    { label: "Jan", value: 45000 },
    { label: "Feb", value: 38000 },
    { label: "Mar", value: 55000 },
    { label: "Apr", value: 68000 },
    { label: "May", value: 85000 },
    { label: "Jun", value: 120500 },
    { label: "Jul", value: totalRevenue }
  ];

  // 2. Product Category Doughnut Chart
  const categoriesMap = {};
  products.forEach((p) => {
    categoriesMap[p.category] = (categoriesMap[p.category] || 0) + 1;
  });
  const categoryChartData = Object.keys(categoriesMap).map((cat) => ({
    label: cat,
    value: categoriesMap[cat]
  }));

  // 3. Taluka listings Bar Chart
  const talukasMap = {};
  products.forEach((p) => {
    talukasMap[p.taluka] = (talukasMap[p.taluka] || 0) + 1;
  });
  const talukaChartData = Object.keys(talukasMap).map((tal) => ({
    label: tal,
    value: talukasMap[tal]
  }));

  // 4. User Registration Growth Line Chart
  const userGrowthData = [
    { label: "Feb", value: 240 },
    { label: "Mar", value: 380 },
    { label: "Apr", value: 510 },
    { label: "May", value: 720 },
    { label: "Jun", value: 980 },
    { label: "Jul", value: users.length * 160 } // scaled for realism
  ];

  // Recent Items Lists
  const recentUsers = users.slice().reverse().slice(0, 3);
  const recentListings = products.slice().reverse().slice(0, 3);
  const recentReports = reports.filter((r) => r.status === "Pending").slice(0, 3);
  const recentFeedback = reviews.slice().reverse().slice(0, 3);
  const recentActivities = activityLogs.slice(0, 5);

  // Trigger quick broadcast message
  const handleQuickBroadcast = () => {
    const alerts = [
      "Scheduled database backup starting in 1 hour.",
      "High activity detected from Sawantwadi taluka.",
      "Moderator approval required for new physical books.",
      "Monthly server health checks are complete."
    ];
    const text = alerts[Math.floor(Math.random() * alerts.length)];
    sendPushNotification(text);
  };

  return (
    <div className="space-y-8">
      {/* 1. WELCOME SECTION BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-3xl border border-teal-200/50 bg-gradient-to-r from-teal-50/60 to-emerald-50/50 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div className="absolute top-0 right-0 h-48 w-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1 z-10">
          <h2 className="text-lg font-black text-slate-800 tracking-tight">
            Welcome back, Administrator!
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Here's what is happening with SindhuSwap local marketplace today.
          </p>
        </div>
        <div className="flex gap-2 shrink-0 z-10">
          <button
            onClick={handleQuickBroadcast}
            className="px-4 py-2 bg-primary text-white hover:bg-teal-800 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <FiBell /> Quick Alert Broadcast
          </button>
        </div>
      </motion.div>

      {/* 2. TODAY'S STATISTICS METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatsCard
          label="Total Revenue"
          value={totalRevenue}
          icon={FiTrendingUp}
          trend="+18.4%"
          trendType="positive"
          tone="teal"
          sparkData={[24, 30, 28, 42, 54, 60, totalRevenue ? 65 : 20]}
        />
        <StatsCard
          label="Active Users"
          value={activeUsersCount}
          icon={FiUsers}
          trend="+5.2%"
          trendType="positive"
          tone="sky"
          sparkData={[40, 42, 45, 48, 50, 52, 55]}
        />
        <StatsCard
          label="Books Exchanged"
          value={booksExchangedCount}
          icon={FiRefreshCw}
          trend="+12.0%"
          trendType="positive"
          tone="violet"
          sparkData={[10, 12, 11, 15, 18, 20, 24]}
        />
        <StatsCard
          label="Products Listed"
          value={productsCount}
          icon={FiShoppingBag}
          trend="+8.1%"
          trendType="positive"
          tone="amber"
          sparkData={[80, 84, 83, 89, 92, 95, 102]}
        />
        <StatsCard
          label="Pending Approvals"
          value={pendingApprovalsCount}
          icon={FiAlertTriangle}
          trend={pendingApprovalsCount > 3 ? "Action Needed" : "All Clear"}
          trendType={pendingApprovalsCount > 3 ? "negative" : "positive"}
          tone={pendingApprovalsCount > 3 ? "rose" : "slate"}
          sparkData={[2, 4, 3, 5, 2, 4, pendingApprovalsCount]}
        />
      </div>

      {/* 3. CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaChart title="Revenue Sales Trend (Rs)" data={salesChartData} />
        <PieChart title="Product Listings by Category" data={categoryChartData} />
      </div>

      {/* 4. CHARTS ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart title="Listings by Taluka (Sindhudurg)" data={talukaChartData} />
        <LineChart title="User Growth Analytics Trend" data={userGrowthData} color="#8b5cf6" />
      </div>

      {/* 5. SPLIT DETAILS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: PENDING APPROVALS & QUICK ACTIONS */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Listings Needing Approval */}
          <div className="admin-glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800">Pending Listing Approvals</h3>
              <button
                onClick={() => navigate("/admin/products")}
                className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
              >
                Go to Products <FiChevronRight />
              </button>
            </div>

            {products.filter((p) => p.status === "Pending Approval").length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 font-medium">
                No items currently awaiting approval. All clean!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-400 font-bold border-b border-slate-100">
                      <th className="pb-2">Product</th>
                      <th className="pb-2">Category</th>
                      <th className="pb-2">Taluka</th>
                      <th className="pb-2">Seller</th>
                      <th className="pb-2">Price</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter((p) => p.status === "Pending Approval")
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 border-b border-slate-50">
                          <td className="py-3 flex items-center gap-2">
                            <img src={p.image} className="w-7 h-7 rounded border border-slate-100 object-cover" alt="" />
                            <span className="font-semibold text-slate-700">{p.name}</span>
                          </td>
                          <td className="py-3 text-slate-500">{p.category}</td>
                          <td className="py-3 text-slate-500">{p.taluka}</td>
                          <td className="py-3 font-medium text-slate-600">{p.seller}</td>
                          <td className="py-3 font-bold text-slate-800">Rs. {p.price.toLocaleString()}</td>
                          <td className="py-3 text-right space-x-1.5">
                            <button
                              onClick={() => approveProduct(p.id)}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100/50 rounded-lg font-bold transition-all text-[10px] cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectProduct(p.id)}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100/50 rounded-lg font-bold transition-all text-[10px] cursor-pointer"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="admin-glass-card rounded-2xl p-5 flex flex-col justify-between h-36">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800">Review Reported Items</h4>
                <p className="text-[11px] text-slate-400">Moderation requests for suspicious products, users, or books.</p>
              </div>
              <button
                onClick={() => navigate("/admin/reports")}
                className="mt-3 w-full py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                Open Moderation Center <FiArrowRight />
              </button>
            </div>

            <div className="admin-glass-card rounded-2xl p-5 flex flex-col justify-between h-36">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800">System Parameters Config</h4>
                <p className="text-[11px] text-slate-400">Configure boundaries, pricing fees, maintenance, and credentials.</p>
              </div>
              <button
                onClick={() => navigate("/admin/settings")}
                className="mt-3 w-full py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                Access System Settings <FiArrowRight />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TIMELINE & SYSTEM HEALTH */}
        <div className="space-y-6">
          {/* System Health */}
          <div className="admin-glass-card rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <FiServer className="text-primary" /> System Health Status
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Server status</span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Online (Healthy)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">API Node latency</span>
                <span className="font-mono font-bold text-slate-700">18ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">CPU Uptime load</span>
                <span className="font-mono font-bold text-slate-700">12%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Memory usage</span>
                <span className="font-mono font-bold text-slate-700">42% (8.4GB / 20GB)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Cloud Storage backup</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <FiCheckCircle className="text-xs" /> Successful
                </span>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="admin-glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FiActivity className="text-primary" /> System Audit Timeline
              </h3>
              <button
                onClick={() => navigate("/admin/activity-logs")}
                className="text-[10px] text-primary font-bold hover:underline"
              >
                View all logs
              </button>
            </div>

            <div className="space-y-4 pr-1 max-h-56 overflow-y-auto admin-scrollbar relative">
              {recentActivities.map((act, idx) => (
                <div key={act.id} className="flex gap-3 relative group">
                  {/* Vertical connector line */}
                  {idx !== recentActivities.length - 1 && (
                    <span className="absolute left-[7.5px] top-4 bottom-[-18px] w-0.5 bg-slate-100" />
                  )}
                  {/* Dot status indicator */}
                  <span className="h-4 w-4 rounded-full border-2 border-white bg-teal-500 shadow-sm shrink-0 mt-0.5" />
                  
                  <div className="flex-1 text-[11px] leading-relaxed">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-700 font-bold">{act.action}</strong>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-slate-400 font-medium">{act.target}</p>
                    <p className="text-[10px] text-slate-400/80 italic mt-0.5 bg-slate-50 rounded px-1.5 py-0.5 leading-normal">
                      {act.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 6. RECENT FEEDBACK BAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent users registered */}
        <div className="admin-glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
            Recent Registered Users
          </h3>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="flex items-center gap-2.5">
                  <img src={user.profileImage} className="w-8 h-8 rounded-lg border border-slate-100 object-cover" alt="" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">{user.name}</h4>
                    <p className="text-[10px] text-slate-400">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-500 rounded-lg px-2 py-0.5 font-bold uppercase">
                    {user.taluka}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5 font-mono">{user.joinedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent reviews/feedback */}
        <div className="admin-glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
            Recent User Feedback
          </h3>
          <div className="space-y-3">
            {recentFeedback.map((rev) => (
              <div key={rev.id} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">{rev.user} → {rev.targetUser}</span>
                  <span className="flex items-center gap-0.5 text-amber-500 font-bold font-mono">
                    <FiStar className="fill-amber-500" /> {rev.rating}/5
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
