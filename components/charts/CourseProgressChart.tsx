"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { TeacherCourseOverview } from "@/apis/teacher-dashboard";

interface CourseProgressChartProps {
  courses: TeacherCourseOverview[];
}

export function CourseProgressChart({ courses }: CourseProgressChartProps) {
  // Transform data for the chart
  const chartData = courses.slice(0, 6).map((course) => ({
    name:
      course.courseName.length > 15
        ? course.courseName.substring(0, 15) + "..."
        : course.courseName,
    fullName: course.courseName,
    completed: course.completedStudents,
    inProgress: course.inProgressStudents,
    notStarted: course.notStartedStudents,
    averageProgress: course.averageProgress,
  }));

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#6B7280" }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6B7280" }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0]?.payload;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border">
                    <p className="font-medium text-gray-900 mb-2">
                      {data?.fullName}
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm text-green-600">
                        Hoàn thành: {data?.completed} sinh viên
                      </p>
                      <p className="text-sm text-yellow-600">
                        Đang học: {data?.inProgress} sinh viên
                      </p>
                      <p className="text-sm text-gray-600">
                        Chưa bắt đầu: {data?.notStarted} sinh viên
                      </p>
                      <p className="text-sm text-blue-600 font-medium">
                        Tiến độ TB: {data?.averageProgress}%
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar
            dataKey="completed"
            stackId="a"
            fill="#10B981"
            name="Hoàn thành"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="inProgress"
            stackId="a"
            fill="#F59E0B"
            name="Đang học"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="notStarted"
            stackId="a"
            fill="#6B7280"
            name="Chưa bắt đầu"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
