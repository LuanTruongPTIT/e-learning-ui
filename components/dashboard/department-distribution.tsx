"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface DepartmentDistributionProps {
  userRole: string;
}

export function DepartmentDistribution({ userRole }: DepartmentDistributionProps) {
  // Mock data for admin
  const adminData = [
    { name: "Computer Science", value: 28, color: "#4f46e5" },
    { name: "Engineering", value: 22, color: "#10b981" },
    { name: "Business", value: 18, color: "#f59e0b" },
    { name: "Arts & Humanities", value: 15, color: "#ef4444" },
    { name: "Health Sciences", value: 17, color: "#8b5cf6" },
  ];

  // Mock data for teacher
  const teacherData = [
    { name: "Computer Science", value: 45, color: "#4f46e5" },
    { name: "Software Engineering", value: 30, color: "#10b981" },
    { name: "Information Technology", value: 25, color: "#f59e0b" },
  ];

  const data = userRole === "Administrator" ? adminData : teacherData;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, null]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
