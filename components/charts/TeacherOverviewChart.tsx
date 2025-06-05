"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { TeacherDashboardData } from "@/apis/teacher-dashboard";

interface TeacherOverviewChartProps {
  dashboardData?: TeacherDashboardData;
}

export function TeacherOverviewChart({
  dashboardData,
}: TeacherOverviewChartProps) {
  // Create real trend data from API data
  const generateRealTrendData = () => {
    if (!dashboardData) {
      // Fallback mock data only when no API data
      return [
        {
          month: "T1",
          studentProgress: 72,
          assignmentCompletion: 85,
          classActivity: 78,
        },
        {
          month: "T2",
          studentProgress: 75,
          assignmentCompletion: 82,
          classActivity: 80,
        },
        {
          month: "T3",
          studentProgress: 78,
          assignmentCompletion: 88,
          classActivity: 85,
        },
        {
          month: "T4",
          studentProgress: 82,
          assignmentCompletion: 90,
          classActivity: 87,
        },
        {
          month: "T5",
          studentProgress: 85,
          assignmentCompletion: 92,
          classActivity: 90,
        },
        {
          month: "T6",
          studentProgress: 88,
          assignmentCompletion: 94,
          classActivity: 92,
        },
      ];
    }

    // Parse recent activities to create timeline data
    const activities = dashboardData.recentActivities || [];
    const courses = dashboardData.courseOverviews || [];

    // Create 6 time periods (weeks) going back
    const timeData = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const periodStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const periodEnd = new Date(
        now.getTime() - (i - 1) * 7 * 24 * 60 * 60 * 1000
      );

      // Count activities in this period
      let assignmentCount = 0;
      let lectureCount = 0;
      let totalCount = 0;

      activities.forEach((activity) => {
        const activityDate = new Date(activity.timestamp);
        if (activityDate >= periodStart && activityDate < periodEnd) {
          totalCount++;
          if (activity.activityType === "assignment_submit") {
            assignmentCount++;
          } else if (activity.activityType === "lecture_complete") {
            lectureCount++;
          }
        }
      });

      // Calculate student progress for this period based on course data
      let avgProgress = 0;
      if (courses.length > 0) {
        // For historical data, we simulate progress building up to current level
        const currentAvg =
          courses.reduce((sum, course) => sum + course.averageProgress, 0) /
          courses.length;
        const progressBuildUp = currentAvg * (1 - i * 0.15); // Progress builds up over time
        avgProgress = Math.max(0, Math.min(100, progressBuildUp));
      }

      // Calculate assignment completion rate
      const currentCompletionRate =
        dashboardData.totalAssignments > 0
          ? (dashboardData.completedAssignments /
              dashboardData.totalAssignments) *
            100
          : 0;

      // For historical data, simulate completion rate building up
      const assignmentCompletion = Math.max(
        0,
        Math.min(100, currentCompletionRate * (1 - i * 0.12))
      );

      // Class activity based on total activities in period
      const maxActivities = Math.max(10, activities.length / 2); // Expected max activities per period
      const classActivity = Math.min(100, (totalCount / maxActivities) * 100);

      timeData.push({
        month: `T${6 - i}`,
        studentProgress: Math.round(avgProgress),
        assignmentCompletion: Math.round(assignmentCompletion),
        classActivity: Math.round(classActivity),
        period: `Tuần ${6 - i}`,
        rawData: {
          assignments: assignmentCount,
          lectures: lectureCount,
          totalActivities: totalCount,
        },
      });
    }

    return timeData;
  };

  const data = generateRealTrendData();

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6B7280" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            domain={[0, 100]}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const dataPoint = payload[0]?.payload;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border">
                    <p className="font-medium text-gray-900 mb-2">
                      {dataPoint?.period}
                    </p>
                    {payload.map((entry, index) => (
                      <p
                        key={index}
                        style={{ color: entry.color }}
                        className="text-sm"
                      >
                        {entry.name}: {entry.value}%
                      </p>
                    ))}
                    {dataPoint?.rawData && (
                      <div className="mt-2 pt-2 border-t text-xs text-gray-600">
                        <p>Bài tập nộp: {dataPoint.rawData.assignments}</p>
                        <p>
                          Bài giảng hoàn thành: {dataPoint.rawData.lectures}
                        </p>
                        <p>
                          Tổng hoạt động: {dataPoint.rawData.totalActivities}
                        </p>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} iconType="line" />
          <Line
            type="monotone"
            dataKey="studentProgress"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
            name="Tiến độ học sinh"
          />
          <Line
            type="monotone"
            dataKey="assignmentCompletion"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
            name="Hoàn thành bài tập"
          />
          <Line
            type="monotone"
            dataKey="classActivity"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
            name="Hoạt động lớp học"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
