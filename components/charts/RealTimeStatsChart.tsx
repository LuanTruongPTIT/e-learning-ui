"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  BookOpen,
  Clock,
} from "lucide-react";

interface RealTimeStatsProps {
  totalStudents: number;
  totalCourses: number;
  averageCompletionRate: number;
  recentActivitiesCount: number;
}

interface StatItem {
  label: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export function RealTimeStatsChart({
  totalStudents,
  totalCourses,
  averageCompletionRate,
  recentActivitiesCount,
}: RealTimeStatsProps) {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const updateStats = () => {
      const baseStats: StatItem[] = [
        {
          label: "Học sinh trực tuyến",
          value: Math.round(totalStudents * (0.6 + Math.random() * 0.3)), // 60-90% online
          change: (Math.random() - 0.5) * 10, // Random change ±5
          icon: <Users className="h-4 w-4" />,
          color: "text-blue-600",
        },
        {
          label: "Khóa học đang hoạt động",
          value: Math.round(totalCourses * (0.7 + Math.random() * 0.2)), // 70-90% active
          change: (Math.random() - 0.5) * 6, // Random change ±3
          icon: <BookOpen className="h-4 w-4" />,
          color: "text-green-600",
        },
        {
          label: "Tỷ lệ hoàn thành trung bình",
          value: Math.round(averageCompletionRate + (Math.random() - 0.5) * 4), // ±2%
          change: (Math.random() - 0.5) * 3, // Random change ±1.5%
          icon: <TrendingUp className="h-4 w-4" />,
          color: "text-purple-600",
        },
        {
          label: "Hoạt động trong 1h qua",
          value: Math.round(
            recentActivitiesCount * (0.8 + Math.random() * 0.4)
          ), // 80-120%
          change: (Math.random() - 0.5) * 8, // Random change ±4
          icon: <Activity className="h-4 w-4" />,
          color: "text-orange-600",
        },
      ];

      setStats(baseStats);
      setLastUpdate(new Date());
    };

    // Initial update
    updateStats();

    // Update every 30 seconds
    const interval = setInterval(updateStats, 30000);

    return () => clearInterval(interval);
  }, [
    totalStudents,
    totalCourses,
    averageCompletionRate,
    recentActivitiesCount,
  ]);

  const formatLastUpdate = () => {
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - lastUpdate.getTime()) / 1000
    );

    if (diffInSeconds < 60) {
      return `${diffInSeconds} giây trước`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} phút trước`;
    } else {
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Thống kê thời gian thực</CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Cập nhật {formatLastUpdate()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className={`${stat.color}`}>{stat.icon}</div>
                <Badge
                  variant={stat.change >= 0 ? "default" : "secondary"}
                  className={`text-xs ${
                    stat.change >= 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {stat.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(stat.change).toFixed(1)}
                </Badge>
              </div>

              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                  {stat.label.includes("Tỷ lệ") ? "%" : ""}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>

              {stat.label.includes("Tỷ lệ") && (
                <Progress value={stat.value} className="h-2" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
