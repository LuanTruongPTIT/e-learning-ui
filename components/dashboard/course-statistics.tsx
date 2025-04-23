"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CourseStatisticsProps {
  userRole: string;
}

export function CourseStatistics({ userRole }: CourseStatisticsProps) {
  // Mock data for admin
  const adminData = [
    {
      name: "Week 1",
      "Completion Rate": 35,
      "Engagement": 40,
      "Satisfaction": 65,
    },
    {
      name: "Week 2",
      "Completion Rate": 45,
      "Engagement": 50,
      "Satisfaction": 68,
    },
    {
      name: "Week 3",
      "Completion Rate": 52,
      "Engagement": 55,
      "Satisfaction": 70,
    },
    {
      name: "Week 4",
      "Completion Rate": 58,
      "Engagement": 62,
      "Satisfaction": 72,
    },
    {
      name: "Week 5",
      "Completion Rate": 65,
      "Engagement": 68,
      "Satisfaction": 75,
    },
    {
      name: "Week 6",
      "Completion Rate": 70,
      "Engagement": 72,
      "Satisfaction": 78,
    },
    {
      name: "Week 7",
      "Completion Rate": 75,
      "Engagement": 75,
      "Satisfaction": 80,
    },
    {
      name: "Week 8",
      "Completion Rate": 78,
      "Engagement": 78,
      "Satisfaction": 82,
    },
  ];

  // Mock data for teacher
  const teacherData = [
    {
      name: "Week 1",
      "Advanced Programming": 40,
      "Data Structures": 30,
      "Algorithms": 45,
    },
    {
      name: "Week 2",
      "Advanced Programming": 48,
      "Data Structures": 38,
      "Algorithms": 52,
    },
    {
      name: "Week 3",
      "Advanced Programming": 55,
      "Data Structures": 45,
      "Algorithms": 58,
    },
    {
      name: "Week 4",
      "Advanced Programming": 62,
      "Data Structures": 52,
      "Algorithms": 65,
    },
    {
      name: "Week 5",
      "Advanced Programming": 68,
      "Data Structures": 60,
      "Algorithms": 70,
    },
    {
      name: "Week 6",
      "Advanced Programming": 75,
      "Data Structures": 68,
      "Algorithms": 75,
    },
    {
      name: "Week 7",
      "Advanced Programming": 80,
      "Data Structures": 75,
      "Algorithms": 80,
    },
    {
      name: "Week 8",
      "Advanced Programming": 85,
      "Data Structures": 80,
      "Algorithms": 85,
    },
  ];

  const data = userRole === "Administrator" ? adminData : teacherData;
  
  // Define line colors based on user role
  const lineColors = userRole === "Administrator" 
    ? [
        { dataKey: "Completion Rate", stroke: "#4f46e5" },
        { dataKey: "Engagement", stroke: "#10b981" },
        { dataKey: "Satisfaction", stroke: "#f59e0b" },
      ]
    : [
        { dataKey: "Advanced Programming", stroke: "#4f46e5" },
        { dataKey: "Data Structures", stroke: "#10b981" },
        { dataKey: "Algorithms", stroke: "#f59e0b" },
      ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {lineColors.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.stroke}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
