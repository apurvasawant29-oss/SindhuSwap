import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiBarChart2,
  FiShoppingBag,
  FiUsers,
  FiRefreshCw,
  FiActivity,
  FiMapPin,
  FiGrid,
  FiCalendar
} from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";
import StatsCard from "../components/common/StatsCard";
import AreaChart from "../components/charts/AreaChart";
import BarChart from "../components/charts/BarChart";
import PieChart from "../components/charts/PieChart";
import LineChart from "../components/charts/LineChart";
import Skeleton from "../components/common/Skeleton";

export default function Analytics() {
  const [isLoading, setIsLoading] = useState(true);
  const { products, users, bookSwaps, orders } = useAdmin();

  // Skeleton screen on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Skeleton type="dashboard" />;
  }

  // --- ANALYTICS DATA CALCULATIONS ---
  
  // 1. Most active taluka calculation
  const talukasMap = {};
  products.forEach((p) => {
    talukasMap[p.taluka] = (talukasMap[p.taluka] || 0) + 1;
  });
  let mostActiveTaluka = "Kudal";
  let maxListings = 0;
  Object.keys(talukasMap).forEach((tal) => {
    if (talukasMap[tal] > maxListings) {
      maxListings = talukasMap[tal];
      mostActiveTaluka = tal;
    }
  });

  // 2. Most sold/listed category
  const categoriesMap = {};
  products.forEach((p) => {
    categoriesMap[p.category] = (categoriesMap[p.category] || 0) + 1;
  });
  let mostSoldCategory = "Mobiles";
  let maxCatCount = 0;
  Object.keys(categoriesMap).forEach((cat) => {
    if (categoriesMap[cat] > maxCatCount) {
      maxCatCount = categoriesMap[cat];
      mostSoldCategory = cat;
    }
  });

  // 3. Swap statistics
  const totalSwaps = bookSwaps.length;
  const completedSwapsCount = bookSwaps.filter((s) => s.status === "Completed").length;
  const swapCompletionRate = totalSwaps > 0 ? Math.round((completedSwapsCount / totalSwaps) * 100) : 0;

  // Monthly trends for analytics page
  const userGrowthTrends = [
    { label: "Feb", value: 120 },
    { label: "Mar", value: 185 },
    { label: "Apr", value: 290 },
    { label: "May", value: 430 },
    { label: "Jun", value: 650 },
    { label: "Jul", value: users.length * 120 }
  ];

  const listingsTrends = [
    { label: "Feb", value: 50 },
    { label: "Mar", value: 90 },
    { label: "Apr", value: 140 },
    { label: "May", value: 190 },
    { label: "Jun", value: 240 },
    { label: "Jul", value: products.length }
  ];

  const swapsTrends = [
    { label: "Feb", value: 8 },
    { label: "Mar", value: 15 },
    { label: "Apr", value: 24 },
    { label: "May", value: 38 },
    { label: "Jun", value: 42 },
    { label: "Jul", value: bookSwaps.length }
  ];

  const revenueTrends = [
    { label: "Feb", value: 22000 },
    { label: "Mar", value: 18000 },
    { label: "Apr", value: 34000 },
    { label: "May", value: 54000 },
    { label: "Jun", value: 72000 },
    { label: "Jul", value: orders.filter((o) => o.status === "Completed").reduce((sum, o) => sum + o.price, 0) || 18500 }
  ];

  return (
    <div className="space-y-8">
      {/* 1. MO-ON-MO GROWTH STATISTICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          label="Sales Growth"
          value={revenueTrends[5].value}
          icon={FiTrendingUp}
          trend="+22.5% vs Last Mo"
          trendType="positive"
          tone="teal"
          sparkData={[12, 18, 25, 38, 48, 62]}
        />
        <StatsCard
          label="User Registrations"
          value={userGrowthTrends[5].value}
          icon={FiUsers}
          trend="+14.8% vs Last Mo"
          trendType="positive"
          tone="sky"
          sparkData={[20, 28, 42, 58, 72, 85]}
        />
        <StatsCard
          label="Book Swaps Growth"
          value={swapsTrends[5].value}
          icon={FiRefreshCw}
          trend="+31.2% vs Last Mo"
          trendType="positive"
          tone="violet"
          sparkData={[5, 12, 18, 22, 35, 42]}
        />
        <StatsCard
          label="Market Listings"
          value={listingsTrends[5].value}
          icon={FiShoppingBag}
          trend="+8.9% vs Last Mo"
          trendType="positive"
          tone="amber"
          sparkData={[30, 42, 58, 70, 85, 98]}
        />
      </div>

      {/* 2. CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaChart title="Monthly Revenue Streams Trend" data={revenueTrends} />
        <PieChart title="Volume Share by Category" data={categoryChartData(products)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart title="Listings Density by Taluka" data={talukaChartData(products)} />
        <LineChart title="Physical Book Swap Transacted Trend" data={swapsTrends} color="#8b5cf6" />
      </div>

      {/* 3. PERFORMANCE SUMMARY WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Most Active Taluka */}
        <div className="admin-glass-card rounded-2xl p-5 flex flex-col justify-between h-52">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Geographical Hotspot</span>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-2">
              <FiMapPin className="text-teal-500" /> Most Active Taluka
            </h4>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-slate-800 tracking-tight block">{mostActiveTaluka}</span>
            <span className="text-xs text-slate-500 mt-1 block">
              Houses <strong className="text-primary font-bold">{maxListings}</strong> active marketplace listings.
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <span className="h-full bg-teal-500 block rounded-full" style={{ width: `${Math.min(100, (maxListings/12)*100)}%` }} />
          </div>
        </div>

        {/* Most Sold Category */}
        <div className="admin-glass-card rounded-2xl p-5 flex flex-col justify-between h-52">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Inventory Insights</span>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-2">
              <FiGrid className="text-teal-500" /> Top Listed Category
            </h4>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-slate-800 tracking-tight block">{mostSoldCategory}</span>
            <span className="text-xs text-slate-500 mt-1 block">
              Contains <strong className="text-primary font-bold">{maxCatCount}</strong> active product listings.
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <span className="h-full bg-teal-500 block rounded-full" style={{ width: `${Math.min(100, (maxCatCount/12)*100)}%` }} />
          </div>
        </div>

        {/* Book Swap Analytics */}
        <div className="admin-glass-card rounded-2xl p-5 flex flex-col justify-between h-52">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Barter Metrics</span>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-2">
              <FiRefreshCw className="text-teal-500 animate-spin-slow" /> Swap Success Rate
            </h4>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-slate-800 tracking-tight block">{swapCompletionRate}%</span>
            <span className="text-xs text-slate-500 mt-1 block">
              <strong className="text-primary font-bold">{completedSwapsCount}</strong> of {totalSwaps} books successfully swapped.
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <span className="h-full bg-teal-500 block rounded-full" style={{ width: `${swapCompletionRate}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helpers inside script to map categories
function categoryChartData(products) {
  const map = {};
  products.forEach((p) => {
    map[p.category] = (map[p.category] || 0) + 1;
  });
  return Object.keys(map).map((cat) => ({
    label: cat,
    value: map[cat]
  }));
}

function talukaChartData(products) {
  const map = {};
  products.forEach((p) => {
    map[p.taluka] = (map[p.taluka] || 0) + 1;
  });
  return Object.keys(map).map((tal) => ({
    label: tal,
    value: map[tal]
  }));
}
