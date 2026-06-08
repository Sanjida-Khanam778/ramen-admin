import { useState } from "react";

const defaultData = [
  { month: "Jan", total: 90000 },
  { month: "Feb", total: 105000 },
  { month: "Mar", total: 120000 },
  { month: "Apr", total: 112000 },
  { month: "May", total: 130000 },
  { month: "Jun", total: 145000 },
];

export default function RevenueChart({ data: propData }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Normalize incoming data
  const chartData =
    Array.isArray(propData) && propData.length > 0
      ? propData.map((d) => {
          let m = d.month;
          try {
            const parsed = new Date(d.month);
            if (!isNaN(parsed.getTime())) {
              m = parsed.toLocaleString("en-US", { month: "short" });
            }
          } catch (e) {
            // keep raw month
          }
          return {
            month: m,
            total: d.total ?? d.value ?? 0,
          };
        })
      : defaultData;

  const width = 500;
  const height = 185;
  const maxVal = 160000;
  const ticks = [160000, 120000, 80000, 40000, 0];

  // Map values to coordinates
  const stepX = width / (chartData.length - 1 || 1);
  const points = chartData.map((d, i) => {
    const x = i * stepX;
    const y = height - (d.total / maxVal) * height;
    return { x, y, value: d.total, month: d.month };
  });

  // Build smooth bezier curve path
  let pathD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + stepX / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + stepX / 2;
      const cpY2 = p1.y;
      pathD += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${p1.x},${p1.y}`;
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray shadow-sm relative">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-[#1E293B]">Earnings Trends</h3>
      </div>

      <div className="flex gap-4">
        {/* Left Y Axis */}
        <div className="w-12 flex flex-col justify-between h-48 text-[11px] font-semibold text-[#6A7282] -mt-2">
          {ticks.map((tick, i) => (
            <span key={i} className="text-right">
              {tick}
            </span>
          ))}
        </div>

        {/* Chart Area */}
        <div className="flex-1 relative">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-48 overflow-visible"
          >
            {/* Horizontal Grid lines */}
            {ticks.map((tick, i) => {
              const y = height - (tick / maxVal) * height;
              return (
                <line
                  key={i}
                  x1="0"
                  y1={y}
                  x2={width}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Vertical Grid lines */}
            {points.map((p, i) => (
              <line
                key={i}
                x1={p.x}
                y1="0"
                x2={p.x}
                y2={height}
                stroke="#F1F5F9"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}

            {/* Hover vertical marker line */}
            {hoveredIdx !== null && (
              <line
                x1={points[hoveredIdx].x}
                y1="0"
                x2={points[hoveredIdx].x}
                y2={height}
                stroke="#10B981"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            )}

            {/* Outline Line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data point circles (Hollow green dot: green border, white fill) */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === i ? "6" : "4.5"}
                fill="white"
                stroke="#10B981"
                strokeWidth={hoveredIdx === i ? "3" : "2.5"}
                className="transition-all duration-150"
              />
            ))}

            {/* Hitboxes for hover detection */}
            {points.map((p, i) => (
              <rect
                key={i}
                x={p.x - 25}
                y={0}
                width={50}
                height={height}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            ))}
          </svg>

          {/* Floating Tooltip */}
          {hoveredIdx !== null && (
            <div
              className="absolute z-10 p-2 bg-slate-900 text-white rounded-lg shadow-md text-[11px] font-semibold tracking-wider pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-150"
              style={{
                left: `${(points[hoveredIdx].x / width) * 100}%`,
                top: `${(points[hoveredIdx].y / height) * 100 - 8}%`,
              }}
            >
              ${points[hoveredIdx].value.toLocaleString()}
            </div>
          )}

          {/* X Axis Labels */}
          <div className="flex justify-between text-[11px] font-semibold text-[#6A7282] mt-4 select-none">
            {chartData.map((d, i) => (
              <span key={i} className="w-12 text-center">
                {d.month}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
