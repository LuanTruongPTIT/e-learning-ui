"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Users,
  Clock,
  Calendar,
  Star,
  TrendingUp,
} from "lucide-react";
import { adminApi, AdminCourse } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CoursesManagement() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call real API
      const response = await adminApi.getCourses({
        searchTerm: searchTerm || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        department: filterDepartment !== "all" ? filterDepartment : undefined,
        page: 1,
        pageSize: 100,
      });

      if (response.status === 200 && response.data) {
        setCourses(response.data.courses || []);
      } else {
        throw new Error(response.message || "Failed to fetch courses");
      }
    } catch (error: unknown) {
      console.error("Error fetching courses:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi tải danh sách khóa học";
      setError(errorMessage);

      // Fallback to mock data if API fails
      const mockCourses: AdminCourse[] = [
        {
          id: "1",
          name: "Lập trình Web với React",
          description:
            "Khóa học toàn diện về phát triển ứng dụng web sử dụng React.js",
          code: "WEB101",
          instructor: "Nguyễn Thị Mai",
          department: "Công nghệ thông tin",
          startDate: "2024-01-15",
          endDate: "2024-04-15",
          status: "Active",
          studentsCount: 85,
          maxStudents: 100,
          duration: 120,
          rating: 4.8,
          completionRate: 78.5,
          thumbnailUrl: "",
        },
        {
          id: "2",
          name: "Cơ sở dữ liệu nâng cao",
          description: "Học về thiết kế và tối ưu hóa cơ sở dữ liệu",
          code: "DB201",
          instructor: "Trần Văn Nam",
          department: "Công nghệ thông tin",
          startDate: "2024-02-01",
          endDate: "2024-05-01",
          status: "Active",
          studentsCount: 65,
          maxStudents: 80,
          duration: 90,
          rating: 4.6,
          completionRate: 82.3,
          thumbnailUrl: "",
        },
      ];
      setCourses(mockCourses);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when search or filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCourses();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterStatus, filterDepartment]);

  const departments = [...new Set(courses.map((course) => course.department))];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || course.status === filterStatus;
    const matchesDepartment =
      filterDepartment === "all" || course.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "Active":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "Completed":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "Draft":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case "Cancelled":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
      try {
        setCourses(courses.filter((c) => c.id !== courseId));
        alert("Xóa khóa học thành công!");
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Có lỗi xảy ra khi xóa khóa học!");
      }
    }
  };

  const getProgressPercentage = (
    studentsCount: number,
    maxStudents: number
  ) => {
    return Math.round((studentsCount / maxStudents) * 100);
  };

  const getRatingStars = (rating: number) => {
    if (rating === 0) return "Chưa đánh giá";
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push("★");
    }
    if (hasHalfStar) {
      stars.push("☆");
    }

    return stars.join("") + ` (${rating.toFixed(1)})`;
  };

  if (loading) {
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
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Khóa học</h1>
          <p className="mt-2 text-sm text-gray-700">
            Quản lý và theo dõi các khóa học trong hệ thống
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          {/* <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tạo khóa học
          </button> */}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng khóa học
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {courses.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Đang hoạt động
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {courses.filter((c) => c.status === "Active").length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng sinh viên
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {courses.reduce((sum, c) => sum + c.studentsCount, 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tỷ lệ hoàn thành TB
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {courses.length > 0
                      ? (
                          courses
                            .filter((c) => c.completionRate > 0)
                            .reduce((sum, c) => sum + c.completionRate, 0) /
                          courses.filter((c) => c.completionRate > 0).length
                        ).toFixed(1) + "%"
                      : "0%"}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên khóa học, giảng viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Active">Hoạt động</option>
                <option value="Completed">Hoàn thành</option>
                <option value="Draft">Nháp</option>
                <option value="Cancelled">Đã hủy</option>
              </select>
            </div>
            <div className="mt-4 sm:mt-0">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">Tất cả khoa</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      với {course.instructor}
                    </p>
                  </div>
                </div>
                <span className={getStatusBadge(course.status)}>
                  {course.status}
                </span>
              </div>

              <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                {course.description}
              </p>

              <div className="mt-4 space-y-3">
                {/* Students Progress */}
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sinh viên</span>
                    <span className="font-medium">
                      {course.studentsCount}/{course.maxStudents}
                    </span>
                  </div>
                  <div className="mt-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${getProgressPercentage(
                          course.studentsCount,
                          course.maxStudents
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Course Info */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}h
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(course.startDate).toLocaleDateString("vi-VN")}
                  </div>
                </div>

                {/* Rating and Completion */}
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-400" />
                    <span className="text-yellow-600">
                      {getRatingStars(course.rating)}
                    </span>
                  </div>
                  {course.completionRate > 0 && (
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1 text-green-400" />
                      <span className="text-green-600">
                        {course.completionRate}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => router.push(`/admin/courses/${course.id}`)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Xem
                </button>
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Edit2 className="h-4 w-4 mr-1" />
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="inline-flex items-center justify-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không có khóa học nào
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== "all" || filterDepartment !== "all"
              ? "Không tìm thấy khóa học nào phù hợp với bộ lọc."
              : "Bắt đầu bằng cách tạo khóa học mới."}
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tạo khóa học đầu tiên
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
