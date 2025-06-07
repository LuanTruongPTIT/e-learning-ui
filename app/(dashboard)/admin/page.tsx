"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  BookOpen,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react";
import { adminApi, AdminDashboardStatsResponse } from "@/lib/api";

interface DashboardStats {
  overview: {
    totalStudents: number;
    totalTeachers: number;
    totalCourses: number;
    activeCourses: number;
    averageGpa: number;
    completionRate: number;
  };
  enrollmentTrends: {
    month: string;
    students: number;
    courses: number;
  }[];
  departmentStats: {
    department: string;
    students: number;
    courses: number;
    averageGpa: number;
  }[];
  performanceMetrics: {
    excellentStudents: number;
    goodStudents: number;
    averageStudents: number;
    belowAverageStudents: number;
  };
  recentActivities: {
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getDashboardStats();
      console.log(data);
      setStats(data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Không thể tải dữ liệu dashboard. Đang sử dụng dữ liệu mẫu.");

      // Fallback to mock data
      setStats({
        overview: {
          totalStudents: 1250,
          totalTeachers: 85,
          totalCourses: 42,
          activeCourses: 28,
          averageGpa: 8.5,
          completionRate: 78.5,
        },
        enrollmentTrends: [
          { month: "T7/2023", students: 180, courses: 5 },
          { month: "T8/2023", students: 220, courses: 7 },
          { month: "T9/2023", students: 310, courses: 8 },
          { month: "T10/2023", students: 280, courses: 6 },
          { month: "T11/2023", students: 195, courses: 4 },
          { month: "T12/2023", students: 165, courses: 3 },
        ],
        departmentStats: [],
        performanceMetrics: {
          excellentStudents: 315,
          goodStudents: 450,
          averageStudents: 385,
          belowAverageStudents: 100,
        },
        recentActivities: [
          {
            id: "1",
            type: "enrollment",
            message: 'Nguyễn Văn A đã đăng ký khóa học "Lập trình Web"',
            timestamp: "2 giờ trước",
          },
          {
            id: "2",
            type: "completion",
            message: 'Trần Thị B đã hoàn thành bài tập "HTML5 Cơ bản"',
            timestamp: "3 giờ trước",
          },
          {
            id: "3",
            type: "assignment",
            message: 'GV. Lê Văn C đã tạo bài tập mới cho lớp "JavaScript"',
            timestamp: "5 giờ trước",
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    trend?: "up" | "down";
    trendValue?: string;
  }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-8 w-8 text-blue-600" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {value}
              </div>
              {trend && trendValue && (
                <div
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <TrendingUp
                    className={`self-center flex-shrink-0 h-4 w-4 ${
                      trend === "down" ? "transform rotate-180" : ""
                    }`}
                  />
                  <span className="ml-1">{trendValue}</span>
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Không thể tải dữ liệu dashboard</p>
          <button
            onClick={fetchDashboardData}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Tổng quan hệ thống
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Thống kê và hoạt động gần đây của hệ thống e-learning
          </p>
          {error && <p className="mt-1 text-sm text-orange-500">{error}</p>}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Tổng số sinh viên"
          value={stats.overview.totalStudents.toLocaleString()}
          icon={Users}
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="Tổng số giáo viên"
          value={stats.overview.totalTeachers.toLocaleString()}
          icon={UserCheck}
          trend="up"
          trendValue="+5%"
        />
        <StatCard
          title="Tổng số khóa học"
          value={stats.overview.totalCourses.toLocaleString()}
          icon={BookOpen}
          trend="up"
          trendValue="+8%"
        />
        <StatCard
          title="Điểm trung bình"
          value={stats.overview.averageGpa.toFixed(1)}
          icon={Award}
          trend="up"
          trendValue="+0.3"
        />
        <StatCard
          title="Tỷ lệ hoàn thành"
          value={`${stats.overview.completionRate.toFixed(1)}%`}
          icon={TrendingUp}
          trend="up"
          trendValue="+2.1%"
        />
        <StatCard
          title="Lớp đang hoạt động"
          value={stats.overview.activeCourses.toLocaleString()}
          icon={Clock}
          trend="up"
          trendValue="+4"
        />
      </div>

      {/* Recent Activities */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Hoạt động gần đây
          </h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {stats.recentActivities.slice(0, 5).map((activity, index) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {index !==
                      Math.min(stats.recentActivities.length - 1, 4) && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span
                          className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            activity.type === "enrollment"
                              ? "bg-green-500"
                              : activity.type === "completion"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          {activity.type === "enrollment" && (
                            <Users className="h-4 w-4 text-white" />
                          )}
                          {activity.type === "completion" && (
                            <Award className="h-4 w-4 text-white" />
                          )}
                          {activity.type === "assignment" && (
                            <BookOpen className="h-4 w-4 text-white" />
                          )}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-900">
                            {activity.message}
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {activity.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Thao tác nhanh
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="relative bg-white p-6 rounded-lg border border-gray-300 hover:border-gray-400 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                  <Users className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Quản lý sinh viên
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Xem và quản lý danh sách sinh viên
                </p>
              </div>
            </button>

            <button className="relative bg-white p-6 rounded-lg border border-gray-300 hover:border-gray-400 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                  <UserCheck className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Quản lý giáo viên
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Xem và quản lý danh sách giáo viên
                </p>
              </div>
            </button>

            <button className="relative bg-white p-6 rounded-lg border border-gray-300 hover:border-gray-400 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white">
                  <BookOpen className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Quản lý khóa học
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Xem và quản lý danh sách khóa học
                </p>
              </div>
            </button>

            <button className="relative bg-white p-6 rounded-lg border border-gray-300 hover:border-gray-400 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                  <TrendingUp className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Xem thống kê
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Thống kê chi tiết hệ thống
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
