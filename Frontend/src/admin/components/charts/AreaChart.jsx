import { useState } from "react";
import { motion } from "framer-motion";

export default function AreaChart({ title, data = [], xKey = "label", yKey = "value" }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (data.length === 0) return null;

  const width = 500;
  const height = 220;
  const padding = 35;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const values = data.map((d) => d[yKey]);
  const maxValue = Math.max(...values, 100); // Minimum scale limit
  const minValue = 0;
  const valueRange = maxValue - minValue;

  // Convert coordinate points
  const points = data.map((d, idx) => {
    const x = padding + (idx / (data.length - 1)) * chartWidth;
    // Invert y since SVG 0,0 is top-left
    const y = padding + chartHeight - ((d[yKey] - minValue) / valueRange) * chartHeight;
    return { x, y, data: d, index: idx };
  });

  // Create area path coordinates (starts at bottom-left, ends at bottom-right)
  const linePath = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath = `${padding},${padding + chartHeight} ${linePath} ${padding + chartWidth},${padding + chartHeight}`;

  // Grid lines
  const gridLinesCount = 4;
  const gridLines = Array.from({ length: gridLinesCount }).map((_, idx) => {
    const y = padding + (idx / (gridLinesCount - 1)) * chartHeight;
    const value = Math.round(maxValue - (idx / (gridLinesCount - 1)) * valueRange);
    return { y, value };
  });

  return (
    <div className="admin-glass-card rounded-2xl p-5 flex flex-col h-80 relative select-none">
      {/* Chart Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-700 tracking-tight">{title}</h3>
        <span className="text-[10px] text-slate-400 font-semibold font-mono uppercase bg-slate-100 rounded-lg px-2.5 py-1 border border-slate-200">
          Monthly Statistics
        </span>
      </div>

      {/* SVG Canvas Area */}
      <div className="flex-1 w-full relative">
        <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Smooth Teal Gradient Fill */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0f766e" />
              <stop offset="100%" stopColor="#14b8a6" />
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
                {line.value >= 1000 ? `${(line.value / 1000).toFixed(1)}k` : line.value}
              </text>
            </g>
          ))}

          {/* Solid Area Gradient Path */}
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* Bold Trend Line Path */}
          <path
            d={`M ${linePath}`}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points Markers */}
          {points.map((p, idx) => (
            <g key={idx}>
              {/* Highlight Circle on Hover */}
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === idx ? 7 : 4}
                className="transition-all duration-150"
                fill={hoveredIdx === idx ? "#0f766e" : "#14b8a6"}
                stroke="#ffffff"
                strokeWidth={hoveredIdx === idx ? 2.5 : 1.5}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
              
              {/* Interactive invisible click/hover target circle */}
              <circle
                cx={p.x}
                cy={p.y}
                r="16"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            </g>
          ))}

          {/* X Axis Labels */}
          {points.map((p, idx) => (
            <text
              key={idx}
              x={p.x}
              y={height - padding + 15}
              textAnchor="middle"
              className={`text-[9px] font-bold font-mono transition-colors ${
                hoveredIdx === idx ? "fill-primary" : "fill-slate-400"
              }`}
            >
              {p.data[xKey]}
            </text>
          ))}
        </svg>

        {/* Dynamic HTML Tooltip Bubble inside chart */}
        {hoveredIdx !== null && (
          <div
            className="absolute p-2.5 bg-slate-900/95 text-white text-[10px] rounded-xl shadow-lg border border-slate-700/50 pointer-events-none z-10 transition-all font-mono leading-normal"
            style={{
              left: `${(points[hoveredIdx].x / width) * 100}%`,
              top: `${(points[hoveredIdx].y / height) * 100 - 32}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <p className="font-bold text-teal-300">{points[hoveredIdx].data[xKey]}</p>
            <p className="text-slate-200 mt-0.5">Value: <span className="text-white font-black">{points[hoveredIdx].data[yKey].toLocaleString()}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
