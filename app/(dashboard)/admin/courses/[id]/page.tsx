"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Users,
  BookOpen,
  Clock,
  Star,
  TrendingUp,
  Target,
  Award,
  Play,
  FileText,
  CheckCircle,
} from "lucide-react";
import { adminApi, CourseDetail } from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourseDetails();
  }, [params.id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminApi.getCourseDetails(params.id as string);

      if (response.status === 200 && response.data) {
        setCourse(response.data);
      } else {
        setError("Không thể tải thông tin khóa học");
        setCourse(mockCourseData);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setError("Lỗi khi tải dữ liệu");
      setCourse(mockCourseData);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const mockCourseData: CourseDetail = {
    id: params.id as string,
    name: "Lập trình Web với React",
    code: "WEB301",
    description:
      "Khóa học toàn diện về phát triển ứng dụng web hiện đại sử dụng React, bao gồm các khái niệm cơ bản đến nâng cao như Hooks, Context API, và State Management.",
    thumbnailUrl: "",
    status: "Active",
    createdAt: "2023-08-15",
    updatedAt: "2024-01-10",
    department: "Công nghệ thông tin",
    teacherName: "TS. Nguyễn Văn A",
    teacherAvatar: "",
    studentsEnrolled: 45,
    maxStudents: 50,
    completionRate: 78,
    rating: 4.6,
    duration: 120,
    performanceStats: {
      averageScore: 82.5,
      completionRate: 78,
      dropoutRate: 12,
      totalLessons: 24,
      completedLessons: 18,
      totalAssignments: 12,
      assignmentCompletionRate: 85.5,
      averageStudyTime: 3.5,
      difficultyLevel: "Intermediate",
    },
    enrolledStudents: [
      {
        studentId: "1",
        studentName: "Nguyễn Văn B",
        avatar: "",
        progress: 95,
        score: 92,
        status: "Active",
        lastAccessed: "2024-01-15",
        enrollmentDate: "2023-09-01",
      },
      {
        studentId: "2",
        studentName: "Trần Thị C",
        avatar: "",
        progress: 87,
        score: 88,
        status: "Active",
        lastAccessed: "2024-01-14",
        enrollmentDate: "2023-09-05",
      },
      {
        studentId: "3",
        studentName: "Lê Văn D",
        avatar: "",
        progress: 65,
        score: 75,
        status: "Behind",
        lastAccessed: "2024-01-10",
        enrollmentDate: "2023-09-10",
      },
    ],
    enrollmentTrends: [
      {
        month: "09/2023",
        newEnrollments: 25,
        completions: 0,
        dropouts: 2,
        averageScore: 0,
      },
      {
        month: "10/2023",
        newEnrollments: 15,
        completions: 5,
        dropouts: 1,
        averageScore: 78,
      },
      {
        month: "11/2023",
        newEnrollments: 8,
        completions: 12,
        dropouts: 3,
        averageScore: 82,
      },
      {
        month: "12/2023",
        newEnrollments: 5,
        completions: 18,
        dropouts: 2,
        averageScore: 85,
      },
      {
        month: "01/2024",
        newEnrollments: 2,
        completions: 8,
        dropouts: 1,
        averageScore: 83,
      },
    ],
    progressDistributions: [
      { range: "0-25%", count: 5, percentage: 11, color: "#EF4444" },
      { range: "26-50%", count: 8, percentage: 18, color: "#F59E0B" },
      { range: "51-75%", count: 15, percentage: 33, color: "#3B82F6" },
      { range: "76-100%", count: 17, percentage: 38, color: "#10B981" },
    ],
    courseContents: [
      {
        id: "1",
        title: "Giới thiệu về React",
        type: "Video",
        duration: 45,
        completionRate: 95,
        status: "Published",
        order: 1,
      },
      {
        id: "2",
        title: "JSX và Components",
        type: "Video",
        duration: 60,
        completionRate: 90,
        status: "Published",
        order: 2,
      },
      {
        id: "3",
        title: "Bài tập thực hành 1",
        type: "Assignment",
        duration: 120,
        completionRate: 75,
        status: "Published",
        order: 3,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">
          Không tìm thấy khóa học
        </h2>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStudentStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Behind":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <Play className="h-4 w-4" />;
      case "Assignment":
        return <FileText className="h-4 w-4" />;
      case "Quiz":
        return <Target className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const COLORS = ["#EF4444", "#F59E0B", "#3B82F6", "#10B981"];

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-700">{error} - Hiển thị dữ liệu mẫu</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Chi tiết khóa học
          </h1>
          <p className="text-gray-600">
            Thông tin chi tiết và thống kê học tập
          </p>
        </div>
      </div>

      {/* Course Profile Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-purple-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
            {course.code}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {course.name}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  course.status
                )}`}
              >
                {course.status}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-900">
                  {course.rating}
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{course.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-4 w-4" />
                <span>Giảng viên: {course.teacherName}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="h-4 w-4" />
                <span>{course.department}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{course.duration} giờ học</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-4 w-4" />
                <span>
                  {course.studentsEnrolled}/{course.maxStudents} sinh viên
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  Tạo: {new Date(course.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="h-4 w-4" />
                <span>Hoàn thành: {course.completionRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Điểm TB</p>
              <p className="text-2xl font-bold text-blue-600">
                {course.performanceStats.averageScore}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tỷ lệ hoàn thành
              </p>
              <p className="text-2xl font-bold text-green-600">
                {course.performanceStats.completionRate}%
              </p>
            </div>
            <Target className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tỷ lệ bỏ học</p>
              <p className="text-2xl font-bold text-red-600">
                {course.performanceStats.dropoutRate}%
              </p>
            </div>
            <Users className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Độ khó</p>
              <p className="text-2xl font-bold text-purple-600">
                {course.performanceStats.difficultyLevel}
              </p>
            </div>
            <Award className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trends Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Xu hướng đăng ký theo tháng
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={course.enrollmentTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="newEnrollments"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Đăng ký mới"
              />
              <Line
                type="monotone"
                dataKey="completions"
                stroke="#10B981"
                strokeWidth={2}
                name="Hoàn thành"
              />
              <Line
                type="monotone"
                dataKey="dropouts"
                stroke="#EF4444"
                strokeWidth={2}
                name="Bỏ học"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Phân bố tiến độ sinh viên
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={course.progressDistributions}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ range, percentage }) => `${range}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {course.progressDistributions.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course Content Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Nội dung khóa học
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nội dung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời lượng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tỷ lệ hoàn thành
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {course.courseContents.map((content) => (
                <tr key={content.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="mr-2">
                        {getContentTypeIcon(content.type)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {content.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {content.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {content.duration} phút
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${content.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">
                        {content.completionRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        content.status
                      )}`}
                    >
                      {content.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enrolled Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Sinh viên đăng ký
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sinh viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiến độ
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm số
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Truy cập cuối
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {course.enrolledStudents.map((student) => (
                <tr key={student.studentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-xs">
                            {student.studentName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.studentName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">
                        {student.progress}%
                      </span>
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.score}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStudentStatusColor(
                        student.status
                      )}`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(student.enrollmentDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(student.lastAccessed).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Bài học</h4>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {course.performanceStats.completedLessons}/
              {course.performanceStats.totalLessons}
            </span>
            <BookOpen className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Bài tập</h4>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {course.performanceStats.totalAssignments}
            </span>
            <div className="text-right">
              <div className="text-sm text-gray-500">Hoàn thành</div>
              <div className="text-lg font-semibold text-green-600">
                {course.performanceStats.assignmentCompletionRate}%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            Thời gian học TB
          </h4>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {course.performanceStats.averageStudyTime}h
            </span>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
