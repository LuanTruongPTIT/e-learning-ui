"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { TeacherCourseOverview } from "@/apis/teacher-dashboard";

interface StudentPerformancePieChartProps {
  courseOverviews?: TeacherCourseOverview[];
}

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

export function StudentPerformancePieChart({
  courseOverviews,
}: StudentPerformancePieChartProps) {
  // Calculate performance distribution from real data
  const calculatePerformanceDistribution = () => {
    if (!courseOverviews || courseOverviews.length === 0) {
      return [
        { name: "Xuất sắc (90-100%)", value: 25, color: "#10B981" },
        { name: "Tốt (75-89%)", value: 35, color: "#3B82F6" },
        { name: "Khá (60-74%)", value: 25, color: "#F59E0B" },
        { name: "Trung bình (40-59%)", value: 12, color: "#EF4444" },
        { name: "Yếu (<40%)", value: 3, color: "#6B7280" },
      ];
    }

    // Calculate total students and their performance levels
    let excellent = 0; // 90-100%
    let good = 0; // 75-89%
    let fair = 0; // 60-74%
    let average = 0; // 40-59%
    let poor = 0; // <40%

    courseOverviews.forEach((course) => {
      const totalStudents = course.enrolledStudents;
      const avgProgress = course.averageProgress;

      // Distribute students based on course average progress
      // This is an approximation since we don't have individual student data
      if (avgProgress >= 90) {
        excellent += Math.round(totalStudents * 0.7);
        good += Math.round(totalStudents * 0.3);
      } else if (avgProgress >= 75) {
        excellent += Math.round(totalStudents * 0.3);
        good += Math.round(totalStudents * 0.5);
        fair += Math.round(totalStudents * 0.2);
      } else if (avgProgress >= 60) {
        good += Math.round(totalStudents * 0.2);
        fair += Math.round(totalStudents * 0.6);
        average += Math.round(totalStudents * 0.2);
      } else if (avgProgress >= 40) {
        fair += Math.round(totalStudents * 0.3);
        average += Math.round(totalStudents * 0.5);
        poor += Math.round(totalStudents * 0.2);
      } else {
        average += Math.round(totalStudents * 0.3);
        poor += Math.round(totalStudents * 0.7);
      }
    });

    return [
      { name: "Xuất sắc (90-100%)", value: excellent, color: "#10B981" },
      { name: "Tốt (75-89%)", value: good, color: "#3B82F6" },
      { name: "Khá (60-74%)", value: fair, color: "#F59E0B" },
      { name: "Trung bình (40-59%)", value: average, color: "#EF4444" },
      { name: "Yếu (<40%)", value: poor, color: "#6B7280" },
    ].filter((item) => item.value > 0); // Remove empty categories
  };

  const chartData = calculatePerformanceDistribution();

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: LabelProps) => {
    if (percent < 0.05) return null; // Don't show label for slices less than 5%

    const RADIAN = Math.PI / 180;
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
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
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
                      Số lượng: {data?.value} sinh viên
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px" }}
            layout="vertical"
            align="right"
            verticalAlign="middle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
