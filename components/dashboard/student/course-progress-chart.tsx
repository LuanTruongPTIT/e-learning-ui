"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ProgressData {
  month: string;
  progress: number;
}

interface CourseProgressChartProps {
  data?: ProgressData[];
}

export function CourseProgressChart({ data }: CourseProgressChartProps) {
  // Use provided data or fallback to default data
  const chartData = data || [
    { month: "Jan", progress: 10 },
    { month: "Feb", progress: 25 },
    { month: "Mar", progress: 30 },
    { month: "Apr", progress: 45 },
    { month: "May", progress: 60 },
    { month: "Jun", progress: 75 },
    { month: "Jul", progress: 85 },
  ];
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 100]} />
          <Tooltip
            formatter={(value) => [`${value}%`, "Progress"]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="progress"
            stroke="#4f46e5"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            name="Course Progress"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
