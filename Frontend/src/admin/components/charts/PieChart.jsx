import { useState } from "react";
import { motion } from "framer-motion";

const legendColors = [
  "#0f766e", // teal-700
  "#14b8a6", // teal-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#0ea5e9", // sky-500
  "#ec4899", // pink-500
  "#f43f5e", // rose-500
  "#64748b", // slate-500
  "#10b981"  // emerald-500
];

export default function PieChart({ title, data = [], nameKey = "label", valueKey = "value" }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (data.length === 0) return null;

  const total = data.reduce((acc, curr) => acc + curr[valueKey], 0);

  // Doughnut details
  const radius = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~314.159
  
  let currentOffset = 0;

  const slices = data.map((d, idx) => {
    const percentage = d[valueKey] / (total || 1);
    const dashArray = `${percentage * circumference} ${circumference}`;
    const dashOffset = currentOffset;
    
    // Increment offset for next slice (SVG stroke draws counter-clockwise or clockwise depending on parameters; offset rotates it)
    currentOffset -= percentage * circumference;
    const color = legendColors[idx % legendColors.length];

    return {
      data: d,
      dashArray,
      dashOffset,
      color,
      index: idx,
      percentage: Math.round(percentage * 100)
    };
  });

  return (
    <div className="admin-glass-card rounded-2xl p-5 flex flex-col h-80 relative select-none">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-700 tracking-tight">{title}</h3>
        <span className="text-[10px] text-slate-400 font-semibold font-mono uppercase bg-slate-100 rounded-lg px-2.5 py-1 border border-slate-200">
          Share Breakdown
        </span>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* Doughnut SVG */}
        <div className="relative w-36 h-36 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            {/* Background trace circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />

            {/* Colored Doughnut Slices */}
            {slices.map((slice, idx) => (
              <circle
                key={idx}
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={hoveredIdx === idx ? strokeWidth + 3 : strokeWidth}
                strokeDasharray={slice.dashArray}
                strokeDashoffset={slice.dashOffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer origin-center"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            ))}
          </svg>

          {/* Center Summary Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total</span>
            <span className="text-lg font-black text-slate-800 tracking-tight">
              {hoveredIdx !== null ? slices[hoveredIdx].data[valueKey].toLocaleString() : total.toLocaleString()}
            </span>
            <span className="text-[9px] font-bold font-mono text-primary">
              {hoveredIdx !== null ? `${slices[hoveredIdx].percentage}%` : "100%"}
            </span>
          </div>
        </div>

        {/* Legend Panel */}
        <div className="flex-1 overflow-y-auto max-h-48 w-full admin-scrollbar space-y-1.5 px-2">
          {slices.map((slice, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${
                hoveredIdx === idx ? "bg-slate-50 border border-slate-100" : "border border-transparent"
              }`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                <span className="text-xs font-semibold text-slate-600 truncate max-w-28 sm:max-w-none">
                  {slice.data[nameKey]}
                </span>
              </div>
              <span className="text-xs font-black text-slate-700 font-mono">
                {slice.data[valueKey]} ({slice.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
