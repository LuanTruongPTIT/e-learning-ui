"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  BookOpen,
  Clock,
  Award,
  Download,
} from "lucide-react";
import { adminApi, AdminDashboardStatsResponse } from "@/lib/api";

export default function StatisticsPage() {
  const [data, setData] = useState<AdminDashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, [selectedPeriod]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call real API
      const response = await adminApi.getDashboardStats();

      if (response.status === 200 && response.data) {
        setData(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch statistics");
      }
    } catch (error: unknown) {
      console.error("Error fetching statistics:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi tải thống kê";
      setError(errorMessage);

      // Fallback to mock data if API fails
      const mockData: AdminDashboardStatsResponse = {
        overview: {
          totalStudents: 1250,
          totalTeachers: 85,
          totalCourses: 42,
          activeCourses: 28,
          averageGpa: 7.8,
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
        departmentStats: [
          {
            department: "Công nghệ thông tin",
            students: 450,
            courses: 15,
            averageGpa: 8.2,
          },
          {
            department: "Toán học",
            students: 320,
            courses: 12,
            averageGpa: 7.8,
          },
          {
            department: "Tiếng Anh",
            students: 280,
            courses: 8,
            averageGpa: 8.5,
          },
          { department: "Vật lý", students: 200, courses: 7, averageGpa: 7.3 },
        ],
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
            message: "Sinh viên Nguyễn Văn A đã đăng ký khóa học React",
            timestamp: new Date().toISOString(),
          },
        ],
      };
      setData(mockData);
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
    color = "blue",
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    trend?: "up" | "down";
    trendValue?: string;
    color?: string;
  }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 text-${color}-600`} />
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
    </div>
  );

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Lỗi khi tải dữ liệu
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                <p className="mt-1">Đang hiển thị dữ liệu mẫu.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Thống kê và Báo cáo
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Phân tích chi tiết về hiệu quả học tập và hoạt động hệ thống
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="1month">1 tháng qua</option>
            <option value="3months">3 tháng qua</option>
            <option value="6months">6 tháng qua</option>
            <option value="1year">1 năm qua</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Tổng sinh viên"
          value={data.overview.totalStudents.toLocaleString()}
          icon={Users}
          trend="up"
          trendValue="+12%"
          color="blue"
        />
        <StatCard
          title="Tổng giáo viên"
          value={data.overview.totalTeachers.toLocaleString()}
          icon={Users}
          trend="up"
          trendValue="+5%"
          color="green"
        />
        <StatCard
          title="Khóa học hoạt động"
          value={`${data.overview.activeCourses}/${data.overview.totalCourses}`}
          icon={BookOpen}
          trend="up"
          trendValue="+3"
          color="purple"
        />
        <StatCard
          title="GPA trung bình"
          value={data.overview.averageGpa.toFixed(1)}
          icon={Award}
          trend="up"
          trendValue="+0.2"
          color="yellow"
        />
        <StatCard
          title="Tỷ lệ hoàn thành"
          value={`${data.overview.completionRate}%`}
          icon={TrendingUp}
          trend="up"
          trendValue="+5.2%"
          color="green"
        />
        <StatCard
          title="Thời gian học TB"
          value="156h"
          icon={Clock}
          trend="up"
          trendValue="+8h"
          color="blue"
        />
      </div>

      {/* Department Statistics */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Thống kê theo khoa
          </h3>
          <div className="space-y-4">
            {data.departmentStats.map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {dept.department}
                    </h4>
                    <span className="text-sm text-gray-500">
                      GPA: {dept.averageGpa.toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-600">
                    <span>{dept.students} sinh viên</span>
                    <span>{dept.courses} khóa học</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (dept.students / data.overview.totalStudents) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Distribution */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Phân phối kết quả học tập
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700">Xuất sắc (≥8.5)</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {data.performanceMetrics.excellentStudents} sinh viên
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700">Giỏi (7.0-8.4)</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {data.performanceMetrics.goodStudents} sinh viên
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700">Khá (5.5-6.9)</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {data.performanceMetrics.averageStudents} sinh viên
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700">
                  Cần cải thiện (&lt;5.5)
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {data.performanceMetrics.belowAverageStudents} sinh viên
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
