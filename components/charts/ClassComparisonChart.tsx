"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { TeacherClassSummary } from "@/apis/teacher-dashboard";

interface ClassComparisonChartProps {
  classes: TeacherClassSummary[];
}

export function ClassComparisonChart({ classes }: ClassComparisonChartProps) {
  // Transform data for radar chart
  const metrics = [
    "Tiến độ TB",
    "Số học sinh",
    "Số khóa học",
    "Tỷ lệ tham gia",
    "Hiệu quả học tập",
  ];

  const chartData = metrics.map((metric) => {
    const dataPoint: { [key: string]: string | number } = { metric };

    classes.slice(0, 3).forEach((classItem, index) => {
      switch (metric) {
        case "Tiến độ TB":
          dataPoint[`class${index}`] = classItem.averageProgress;
          break;
        case "Số học sinh":
          dataPoint[`class${index}`] = (classItem.studentCount / 50) * 100; // Normalize to 100
          break;
        case "Số khóa học":
          dataPoint[`class${index}`] = (classItem.courseCount / 10) * 100; // Normalize to 100
          break;
        case "Tỷ lệ tham gia":
          dataPoint[`class${index}`] = Math.min(
            95,
            70 + classItem.averageProgress / 5
          ); // Mock data
          break;
        case "Hiệu quả học tập":
          dataPoint[`class${index}`] = Math.min(
            100,
            classItem.averageProgress + Math.random() * 10
          );
          break;
        default:
          dataPoint[`class${index}`] = 0;
      }
    });

    return dataPoint;
  });

  const colors = ["#3B82F6", "#10B981", "#F59E0B"];

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={chartData}
          margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
        >
          <PolarGrid />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fontSize: 12, fill: "#6B7280" }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#6B7280" }}
          />

          {classes.slice(0, 3).map((classItem, index) => (
            <Radar
              key={`class-${index}`}
              name={
                classItem.className.length > 15
                  ? classItem.className.substring(0, 15) + "..."
                  : classItem.className
              }
              dataKey={`class${index}`}
              stroke={colors[index]}
              fill={colors[index]}
              fillOpacity={0.1}
              strokeWidth={2}
            />
          ))}

          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border">
                    <p className="font-medium text-gray-900 mb-2">{label}</p>
                    {payload.map((entry, index) => (
                      <p
                        key={index}
                        style={{ color: entry.color }}
                        className="text-sm"
                      >
                        {entry.name}:{" "}
                        {typeof entry.value === "number"
                          ? entry.value.toFixed(1)
                          : entry.value}
                        {label === "Tiến độ TB" ||
                        label === "Tỷ lệ tham gia" ||
                        label === "Hiệu quả học tập"
                          ? "%"
                          : ""}
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />

          <Legend wrapperStyle={{ fontSize: "12px" }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
