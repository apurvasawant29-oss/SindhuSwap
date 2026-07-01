import { useState } from "react";
import { motion } from "framer-motion";

export default function LineChart({ title, data = [], xKey = "label", yKey = "value", color = "#8b5cf6" }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (data.length === 0) return null;

  const width = 500;
  const height = 220;
  const padding = 35;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const values = data.map((d) => d[yKey]);
  const maxValue = Math.max(...values, 100);
  const minValue = 0;
  const valueRange = maxValue - minValue;

  const points = data.map((d, idx) => {
    const x = padding + (idx / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((d[yKey] - minValue) / valueRange) * chartHeight;
    return { x, y, data: d, index: idx };
  });

  const linePath = points.map((p) => `${p.x},${p.y}`).join(" ");

  const gridLinesCount = 4;
  const gridLines = Array.from({ length: gridLinesCount }).map((_, idx) => {
    const y = padding + (idx / (gridLinesCount - 1)) * chartHeight;
    const value = Math.round(maxValue - (idx / (gridLinesCount - 1)) * valueRange);
    return { y, value };
  });

  return (
    <div className="admin-glass-card rounded-2xl p-5 flex flex-col h-80 relative select-none">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-700 tracking-tight">{title}</h3>
        <span className="text-[10px] text-slate-400 font-semibold font-mono uppercase bg-slate-100 rounded-lg px-2.5 py-1 border border-slate-200">
          Line Comparison
        </span>
      </div>

      <div className="flex-1 w-full relative">
        <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
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

          {/* Line Path */}
          <path
            d={`M ${linePath}`}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Markers */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === idx ? 6.5 : 3.5}
                className="transition-all duration-150"
                fill={hoveredIdx === idx ? "#1e1b4b" : color}
                stroke="#ffffff"
                strokeWidth={hoveredIdx === idx ? 2 : 1.5}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
              
              <circle
                cx={p.x}
                cy={p.y}
                r="15"
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

        {/* Hover Tooltip */}
        {hoveredIdx !== null && (
          <div
            className="absolute p-2.5 bg-slate-900/95 text-white text-[10px] rounded-xl shadow-lg border border-slate-700/50 pointer-events-none z-10 transition-all font-mono leading-normal"
            style={{
              left: `${(points[hoveredIdx].x / width) * 100}%`,
              top: `${(points[hoveredIdx].y / height) * 100 - 32}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <p className="font-bold text-violet-300">{points[hoveredIdx].data[xKey]}</p>
            <p className="text-slate-200 mt-0.5">Value: <span className="text-white font-black">{points[hoveredIdx].data[yKey].toLocaleString()}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
