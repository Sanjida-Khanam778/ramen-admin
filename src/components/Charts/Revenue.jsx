"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

import { useGetMonthlyRevenueStatsQuery } from "../../Api/dashboardApi";

export default function Revenue() {
  const [sortBy, setSortBy] = useState("yearly");

  const data = [
    { name: "Jan", value: 75 },
    { name: "Feb", value: 65 },
    { name: "Mar", value: 68 },
    { name: "Apr", value: 58 },
    { name: "May", value: 65 },
    { name: "Jun", value: 45 },
    { name: "Jul", value: 60 },
    { name: "Aug", value: 68 },
    { name: "Sep", value: 52 },
    { name: "Oct", value: 48 },
    { name: "Nov", value: 48 },
    { name: "Dec", value: 42 },
  ];

  return (
    <div className="mx-auto">
      <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray">
        {/* Chart Header */}
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-lg font-semibold text-gray-900">Total User</h2>
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-dark/40 rounded-md px-3 py-1 bg-white text-dark/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="september">September</option>
              <option value="october">October</option>
              <option value="november">November</option>
              <option value="december">December</option>
              <option value="january">January</option>
              <option value="february">February</option>
              <option value="march">March</option>
              <option value="april">April</option>
              <option value="may">May</option>
              <option value="june">June</option>
              <option value="july">July</option>
              <option value="august">August</option>
            </select>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                dy={10}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                dx={-10}
              />
              <Bar
                dataKey="value"
                fill="#0E4269"
                radius={[4, 4, 4, 4]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
