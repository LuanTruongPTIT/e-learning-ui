"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

interface OverviewProps {
  userRole: string;
}

export function Overview({ userRole }: OverviewProps) {
  // Mock data for admin
  const adminData = [
    {
      name: "Jan",
      "Active Students": 2500,
      "Course Completions": 1800,
      "New Enrollments": 1200,
    },
    {
      name: "Feb",
      "Active Students": 2700,
      "Course Completions": 1950,
      "New Enrollments": 1350,
    },
    {
      name: "Mar",
      "Active Students": 2800,
      "Course Completions": 2100,
      "New Enrollments": 1500,
    },
    {
      name: "Apr",
      "Active Students": 3000,
      "Course Completions": 2300,
      "New Enrollments": 1700,
    },
    {
      name: "May",
      "Active Students": 3200,
      "Course Completions": 2500,
      "New Enrollments": 1900,
    },
    {
      name: "Jun",
      "Active Students": 3500,
      "Course Completions": 2700,
      "New Enrollments": 2100,
    },
  ];

  // Mock data for teacher
  const teacherData = [
    {
      name: "Jan",
      "Active Students": 120,
      "Course Completions": 85,
      "New Enrollments": 45,
    },
    {
      name: "Feb",
      "Active Students": 135,
      "Course Completions": 95,
      "New Enrollments": 50,
    },
    {
      name: "Mar",
      "Active Students": 140,
      "Course Completions": 100,
      "New Enrollments": 55,
    },
    {
      name: "Apr",
      "Active Students": 150,
      "Course Completions": 110,
      "New Enrollments": 60,
    },
    {
      name: "May",
      "Active Students": 155,
      "Course Completions": 115,
      "New Enrollments": 65,
    },
    {
      name: "Jun",
      "Active Students": 165,
      "Course Completions": 125,
      "New Enrollments": 70,
    },
  ];

  const data = userRole === "Administrator" ? adminData : teacherData;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Active Students" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Course Completions" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="New Enrollments" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
