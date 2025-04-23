"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface StudentProgressProps {
  userRole: string;
}

export function StudentProgress({ userRole }: StudentProgressProps) {
  // Mock data for admin
  const adminData = [
    { name: "Computer Science", value: 540, color: "#4f46e5" },
    { name: "Engineering", value: 620, color: "#10b981" },
    { name: "Business", value: 480, color: "#f59e0b" },
    { name: "Arts & Humanities", value: 350, color: "#ef4444" },
    { name: "Health Sciences", value: 410, color: "#8b5cf6" },
  ];

  // Mock data for teacher
  const teacherData = [
    { name: "Advanced Programming", value: 45, color: "#4f46e5" },
    { name: "Data Structures", value: 38, color: "#10b981" },
    { name: "Algorithms", value: 32, color: "#f59e0b" },
    { name: "Database Systems", value: 28, color: "#ef4444" },
  ];

  const data = userRole === "Administrator" ? adminData : teacherData;

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
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} students`, null]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
