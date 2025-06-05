"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface AssignmentStatusChartProps {
  completed: number;
  pending: number;
  total: number;
}

export function AssignmentStatusChart({
  completed,
  pending,
  total,
}: AssignmentStatusChartProps) {
  const data = [
    { name: "Đã chấm điểm", value: completed, color: "#10B981" },
    { name: "Chờ chấm điểm", value: pending, color: "#F59E0B" },
  ];

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="h-[200px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0]?.payload;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border">
                    <p className="font-medium text-gray-900">{data?.name}</p>
                    <p className="text-sm text-gray-600">
                      Số lượng: {data?.value} bài tập
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {completionRate}%
          </div>
          <div className="text-sm text-gray-600">Đã chấm</div>
        </div>
      </div>
    </div>
  );
}
