"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface SubjectDistribution {
  name: string;
  value: number;
  color: string;
}

interface SubjectDistributionChartProps {
  data?: SubjectDistribution[];
}

export function SubjectDistributionChart({
  data,
}: SubjectDistributionChartProps) {
  // Use provided data or fallback to default data
  const chartData = data || [
    { name: "Web Development", value: 2, color: "#4f46e5" },
    { name: "Programming", value: 1, color: "#10b981" },
    { name: "Database", value: 1, color: "#f59e0b" },
    { name: "Mobile Development", value: 1, color: "#ef4444" },
    { name: "Computer Science", value: 1, color: "#8b5cf6" },
  ];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} courses`, null]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
