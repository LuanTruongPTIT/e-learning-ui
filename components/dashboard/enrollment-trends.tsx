"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface EnrollmentTrendsProps {
  userRole: string;
}

export function EnrollmentTrends({ userRole }: EnrollmentTrendsProps) {
  // Mock data for admin
  const adminData = [
    {
      name: "Jan",
      "Computer Science": 400,
      "Engineering": 350,
      "Business": 300,
      "Arts & Humanities": 200,
      "Health Sciences": 250,
    },
    {
      name: "Feb",
      "Computer Science": 420,
      "Engineering": 370,
      "Business": 320,
      "Arts & Humanities": 210,
      "Health Sciences": 270,
    },
    {
      name: "Mar",
      "Computer Science": 450,
      "Engineering": 390,
      "Business": 340,
      "Arts & Humanities": 230,
      "Health Sciences": 290,
    },
    {
      name: "Apr",
      "Computer Science": 480,
      "Engineering": 410,
      "Business": 360,
      "Arts & Humanities": 250,
      "Health Sciences": 310,
    },
    {
      name: "May",
      "Computer Science": 520,
      "Engineering": 440,
      "Business": 380,
      "Arts & Humanities": 270,
      "Health Sciences": 330,
    },
    {
      name: "Jun",
      "Computer Science": 550,
      "Engineering": 470,
      "Business": 400,
      "Arts & Humanities": 290,
      "Health Sciences": 350,
    },
  ];

  // Mock data for teacher
  const teacherData = [
    {
      name: "Jan",
      "Advanced Programming": 40,
      "Data Structures": 30,
      "Algorithms": 35,
    },
    {
      name: "Feb",
      "Advanced Programming": 42,
      "Data Structures": 32,
      "Algorithms": 38,
    },
    {
      name: "Mar",
      "Advanced Programming": 45,
      "Data Structures": 35,
      "Algorithms": 40,
    },
    {
      name: "Apr",
      "Advanced Programming": 48,
      "Data Structures": 38,
      "Algorithms": 42,
    },
    {
      name: "May",
      "Advanced Programming": 52,
      "Data Structures": 42,
      "Algorithms": 45,
    },
    {
      name: "Jun",
      "Advanced Programming": 55,
      "Data Structures": 45,
      "Algorithms": 48,
    },
  ];

  const data = userRole === "Administrator" ? adminData : teacherData;
  
  // Define area colors based on user role
  const areaColors = userRole === "Administrator" 
    ? [
        { dataKey: "Computer Science", stroke: "#4f46e5", fill: "#4f46e5" },
        { dataKey: "Engineering", stroke: "#10b981", fill: "#10b981" },
        { dataKey: "Business", stroke: "#f59e0b", fill: "#f59e0b" },
        { dataKey: "Arts & Humanities", stroke: "#ef4444", fill: "#ef4444" },
        { dataKey: "Health Sciences", stroke: "#8b5cf6", fill: "#8b5cf6" },
      ]
    : [
        { dataKey: "Advanced Programming", stroke: "#4f46e5", fill: "#4f46e5" },
        { dataKey: "Data Structures", stroke: "#10b981", fill: "#10b981" },
        { dataKey: "Algorithms", stroke: "#f59e0b", fill: "#f59e0b" },
      ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {areaColors.map((area, index) => (
          <Area
            key={area.dataKey}
            type="monotone"
            dataKey={area.dataKey}
            stackId="1"
            stroke={area.stroke}
            fill={area.fill}
            fillOpacity={0.5 - index * 0.1}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
