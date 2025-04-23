"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";

interface TeacherPerformanceProps {
  userRole: string;
}

export function TeacherPerformance({ userRole }: TeacherPerformanceProps) {
  // Mock data for admin - comparing top teachers
  const adminData = [
    {
      subject: "Student Satisfaction",
      "Dr. Smith": 85,
      "Dr. Johnson": 90,
      "Dr. Williams": 78,
      fullMark: 100,
    },
    {
      subject: "Course Completion",
      "Dr. Smith": 80,
      "Dr. Johnson": 75,
      "Dr. Williams": 85,
      fullMark: 100,
    },
    {
      subject: "Engagement",
      "Dr. Smith": 70,
      "Dr. Johnson": 85,
      "Dr. Williams": 75,
      fullMark: 100,
    },
    {
      subject: "Content Quality",
      "Dr. Smith": 90,
      "Dr. Johnson": 80,
      "Dr. Williams": 85,
      fullMark: 100,
    },
    {
      subject: "Grading Timeliness",
      "Dr. Smith": 75,
      "Dr. Johnson": 70,
      "Dr. Williams": 90,
      fullMark: 100,
    },
  ];

  // Mock data for teacher - personal performance metrics
  const teacherData = [
    {
      subject: "Student Satisfaction",
      "Current Semester": 85,
      "Previous Semester": 75,
      fullMark: 100,
    },
    {
      subject: "Course Completion",
      "Current Semester": 80,
      "Previous Semester": 70,
      fullMark: 100,
    },
    {
      subject: "Engagement",
      "Current Semester": 70,
      "Previous Semester": 65,
      fullMark: 100,
    },
    {
      subject: "Content Quality",
      "Current Semester": 90,
      "Previous Semester": 85,
      fullMark: 100,
    },
    {
      subject: "Grading Timeliness",
      "Current Semester": 75,
      "Previous Semester": 60,
      fullMark: 100,
    },
  ];

  const data = userRole === "Administrator" ? adminData : teacherData;
  
  // Define radar colors based on user role
  const radarColors = userRole === "Administrator" 
    ? [
        { dataKey: "Dr. Smith", stroke: "#4f46e5", fill: "#4f46e5", fillOpacity: 0.2 },
        { dataKey: "Dr. Johnson", stroke: "#10b981", fill: "#10b981", fillOpacity: 0.2 },
        { dataKey: "Dr. Williams", stroke: "#f59e0b", fill: "#f59e0b", fillOpacity: 0.2 },
      ]
    : [
        { dataKey: "Current Semester", stroke: "#4f46e5", fill: "#4f46e5", fillOpacity: 0.2 },
        { dataKey: "Previous Semester", stroke: "#10b981", fill: "#10b981", fillOpacity: 0.2 },
      ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        {radarColors.map((radar) => (
          <Radar
            key={radar.dataKey}
            name={radar.dataKey}
            dataKey={radar.dataKey}
            stroke={radar.stroke}
            fill={radar.fill}
            fillOpacity={radar.fillOpacity}
          />
        ))}
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}
