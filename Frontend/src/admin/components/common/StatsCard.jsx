import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const toneStyles = {
  teal: "bg-teal-50 text-teal-600 border-teal-100/50",
  amber: "bg-amber-50 text-amber-600 border-amber-100/50",
  violet: "bg-violet-50 text-violet-600 border-violet-100/50",
  sky: "bg-sky-50 text-sky-600 border-sky-100/50",
  rose: "bg-rose-50 text-rose-600 border-rose-100/50",
  slate: "bg-slate-50 text-slate-600 border-slate-100/50"
};

export default function StatsCard({ label, value, icon: Icon, trend, trendType = "positive", tone = "teal", sparkData = [20, 30, 25, 45, 38, 50, 62] }) {
  const [animatedVal, setAnimatedVal] = useState(0);

  // Animate numeric counters from 0 on mount
  useEffect(() => {
    if (typeof value === "number") {
      let start = 0;
      const end = value;
      if (start === end) return;
      
      const duration = 1200; // ms
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setAnimatedVal(end);
          clearInterval(timer);
        } else {
          setAnimatedVal(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    } else {
      setAnimatedVal(value);
    }
  }, [value]);

  // Format value (e.g. currency rupee or number commas)
  const formatVal = (val) => {
    if (typeof value === "string") return val;
    if (label.toLowerCase().includes("revenue")) {
      return `Rs. ${val.toLocaleString()}`;
    }
    return val.toLocaleString();
  };

  // Convert sparkData to SVG points path
  const width = 100;
  const height = 30;
  const max = Math.max(...sparkData);
  const min = Math.min(...sparkData);
  const spread = max - min || 1;
  const points = sparkData
    .map((val, idx) => {
      const x = (idx / (sparkData.length - 1)) * width;
      const y = height - ((val - min) / spread) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="admin-glass-card rounded-2xl p-5 flex flex-col justify-between h-40 group relative overflow-hidden"
    >
      {/* Background radial spotlight grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.03),transparent)] pointer-events-none" />

      {/* Card Header (Icon and Name) */}
      <div className="flex items-start justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
          {label}
        </span>
        <div className={`p-2.5 rounded-xl border ${toneStyles[tone] || toneStyles.teal} shrink-0`}>
          <Icon className="text-base" />
        </div>
      </div>

      {/* Card Body (Value & Sparkline) */}
      <div className="flex items-end justify-between mt-3">
        <div className="space-y-1">
          <span className="text-2xl font-black text-slate-800 tracking-tight block">
            {formatVal(animatedVal)}
          </span>
          
          {/* Trend Badge */}
          {trend && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold rounded-lg px-2 py-0.5 border ${
                trendType === "positive"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : "bg-rose-50 text-rose-600 border-rose-100"
              }`}
            >
              {trendType === "positive" ? <FiTrendingUp className="text-[10px]" /> : <FiTrendingDown className="text-[10px]" />}
              {trend}
            </span>
          )}
        </div>

        {/* Small SVG Sparkline */}
        <div className="w-24 h-8 shrink-0 pb-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
            <polyline
              fill="none"
              stroke={trendType === "positive" ? "#10b981" : "#ef4444"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
