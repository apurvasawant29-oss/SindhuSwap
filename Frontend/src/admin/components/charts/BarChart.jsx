import { useState } from "react";
import { motion } from "framer-motion";

export default function BarChart({ title, data = [], xKey = "label", yKey = "value" }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (data.length === 0) return null;

  const width = 500;
  const height = 220;
  const padding = 35;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const values = data.map((d) => d[yKey]);
  const maxValue = Math.max(...values, 10);
  const minValue = 0;
  const valueRange = maxValue - minValue;

  const barCount = data.length;
  const barSpacing = chartWidth / barCount;
  const barWidth = Math.min(24, barSpacing * 0.5);

  // Convert coordinate points for bars
  const bars = data.map((d, idx) => {
    const x = padding + idx * barSpacing + (barSpacing - barWidth) / 2;
    const barHeight = ((d[yKey] - minValue) / valueRange) * chartHeight;
    const y = padding + chartHeight - barHeight;
    return { x, y, w: barWidth, h: barHeight, data: d, index: idx };
  });

  // Grid lines
  const gridLinesCount = 4;
  const gridLines = Array.from({ length: gridLinesCount }).map((_, idx) => {
    const y = padding + (idx / (gridLinesCount - 1)) * chartHeight;
    const value = Math.round(maxValue - (idx / (gridLinesCount - 1)) * valueRange);
    return { y, value };
  });

  return (
    <div className="admin-glass-card rounded-2xl p-5 flex flex-col h-80 relative select-none">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-700 tracking-tight">{title}</h3>
        <span className="text-[10px] text-slate-400 font-semibold font-mono uppercase bg-slate-100 rounded-lg px-2.5 py-1 border border-slate-200">
          Distribution
        </span>
      </div>

      {/* SVG Canvas */}
      <div className="flex-1 w-full relative">
        <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
            <linearGradient id="barHoverGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLines.map((line, idx) => (
            <g key={idx}>
              <line
                x1={padding}
                y1={line.y}
                x2={padding + chartWidth}
                y2={line.y}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding - 8}
                y={line.y + 4}
                textAnchor="end"
                className="text-[9px] fill-slate-400 font-mono font-semibold"
              >
                {line.value}
              </text>
            </g>
          ))}

          {/* Bars */}
          {bars.map((bar, idx) => (
            <g key={idx}>
              {/* Rounded Bar using rect */}
              <rect
                x={bar.x}
                y={bar.y}
                width={bar.w}
                height={Math.max(4, bar.h)} // Ensure at least a slim line is visible for zero
                rx={Math.min(4, bar.w / 2)}
                fill={hoveredIdx === idx ? "url(#barHoverGradient)" : "url(#barGradient)"}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
              
              {/* Transparent interactive target */}
              <rect
                x={bar.x - (barSpacing - bar.w)/2}
                y={padding}
                width={barSpacing}
                height={chartHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            </g>
          ))}

          {/* Base bottom axis line */}
          <line
            x1={padding}
            y1={padding + chartHeight}
            x2={padding + chartWidth}
            y2={padding + chartHeight}
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />

          {/* X Axis Labels */}
          {bars.map((bar, idx) => (
            <text
              key={idx}
              x={bar.x + bar.w / 2}
              y={height - padding + 15}
              textAnchor="middle"
              className={`text-[9px] font-bold font-mono transition-colors ${
                hoveredIdx === idx ? "fill-primary" : "fill-slate-400"
              }`}
            >
              {bar.data[xKey].length > 8 ? `${bar.data[xKey].slice(0, 6)}..` : bar.data[xKey]}
            </text>
          ))}
        </svg>

        {/* Floating Tooltip HTML Bubble */}
        {hoveredIdx !== null && (
          <div
            className="absolute p-2.5 bg-slate-900/95 text-white text-[10px] rounded-xl shadow-lg border border-slate-700/50 pointer-events-none z-10 transition-all font-mono leading-normal"
            style={{
              left: `${((bars[hoveredIdx].x + bars[hoveredIdx].w / 2) / width) * 100}%`,
              top: `${(bars[hoveredIdx].y / height) * 100 - 15}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <p className="font-bold text-amber-400">{bars[hoveredIdx].data[xKey]}</p>
            <p className="text-slate-200 mt-0.5">Listings: <span className="text-white font-black">{bars[hoveredIdx].data[yKey]}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
