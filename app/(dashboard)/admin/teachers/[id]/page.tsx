"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  Star,
  Users,
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Target,
} from "lucide-react";
import { adminApi, TeacherDetail } from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function TeacherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [teacher, setTeacher] = useState<TeacherDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeacherDetails();
  }, [params.id]);

  const fetchTeacherDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminApi.getTeacherDetails(params.id as string);

      if (response.status === 200 && response.data) {
        setTeacher(response.data);
      } else {
        setError("Không thể tải thông tin giảng viên");
        setTeacher(mockTeacherData);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setError("Lỗi khi tải dữ liệu");
      setTeacher(mockTeacherData);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const mockTeacherData: TeacherDetail = {
    id: params.id as string,
    name: "TS. Nguyễn Thị Mai",
    email: "nguyenthimai@email.com",
    phoneNumber: "0987654321",
    department: "Công nghệ thông tin",
    joinDate: "2020-08-15",
    status: "Active",
    avatar: "",
    address: "456 Đường XYZ, Quận 3, TP.HCM",
    specialization: "Trí tuệ nhân tạo, Machine Learning",
    rating: 4.8,
    coursesCount: 6,
    studentsCount: 120,
    performanceStats: {
      averageStudentScore: 82.5,
      studentSatisfactionRate: 95.2,
      totalLessons: 180,
      completedLessons: 175,
      totalAssignments: 85,
      assignmentCompletionRate: 89.4,
      teachingHours: 320,
      rank: "Top 5%",
    },
    teachingCourses: [
      {
        courseId: "1",
        courseName: "Machine Learning Cơ bản",
        courseCode: "ML101",
        studentsEnrolled: 45,
        maxStudents: 50,
        completionRate: 92,
        averageScore: 85,
        status: "Active",
        startDate: "2024-01-08",
      },
      {
        courseId: "2",
        courseName: "Deep Learning",
        courseCode: "DL201",
        studentsEnrolled: 35,
        maxStudents: 40,
        completionRate: 88,
        averageScore: 83,
        status: "Active",
        startDate: "2024-01-15",
      },
      {
        courseId: "3",
        courseName: "Python cho Data Science",
        courseCode: "PY301",
        studentsEnrolled: 40,
        maxStudents: 45,
        completionRate: 95,
        averageScore: 87,
        status: "Completed",
        startDate: "2023-09-01",
      },
    ],
    teachingActivities: [
      {
        month: "09/2023",
        teachingHours: 65,
        studentsGraded: 180,
        assignmentsCreated: 15,
        averageStudentScore: 82,
      },
      {
        month: "10/2023",
        teachingHours: 72,
        studentsGraded: 195,
        assignmentsCreated: 18,
        averageStudentScore: 84,
      },
      {
        month: "11/2023",
        teachingHours: 68,
        studentsGraded: 170,
        assignmentsCreated: 16,
        averageStudentScore: 85,
      },
      {
        month: "12/2023",
        teachingHours: 55,
        studentsGraded: 140,
        assignmentsCreated: 12,
        averageStudentScore: 86,
      },
      {
        month: "01/2024",
        teachingHours: 75,
        studentsGraded: 200,
        assignmentsCreated: 20,
        averageStudentScore: 83,
      },
    ],
    studentPerformances: [
      {
        studentName: "Nguyễn Văn A",
        courseName: "ML101",
        score: 92,
        progress: 95,
        status: "Excellent",
      },
      {
        studentName: "Trần Thị B",
        courseName: "DL201",
        score: 88,
        progress: 87,
        status: "Good",
      },
      {
        studentName: "Lê Văn C",
        courseName: "PY301",
        score: 85,
        progress: 100,
        status: "Good",
      },
      {
        studentName: "Phạm Thị D",
        courseName: "ML101",
        score: 78,
        progress: 82,
        status: "Average",
      },
      {
        studentName: "Hoàng Văn E",
        courseName: "DL201",
        score: 95,
        progress: 98,
        status: "Excellent",
      },
    ],
    departmentComparisons: [
      {
        metric: "Điểm TB sinh viên",
        teacherValue: 82.5,
        departmentAverage: 78.2,
        trend: "up",
      },
      {
        metric: "Tỷ lệ hài lòng",
        teacherValue: 95.2,
        departmentAverage: 87.5,
        trend: "up",
      },
      {
        metric: "Tỷ lệ hoàn thành",
        teacherValue: 89.4,
        departmentAverage: 82.1,
        trend: "up",
      },
      {
        metric: "Giờ giảng dạy",
        teacherValue: 320,
        departmentAverage: 285,
        trend: "up",
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

  if (!teacher) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">
          Không tìm thấy giảng viên
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
      case "Suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCourseStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
            Chi tiết giảng viên
          </h1>
          <p className="text-gray-600">
            Thông tin chi tiết và thống kê giảng dạy
          </p>
        </div>
      </div>

      {/* Teacher Profile Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {teacher.name.split(" ").pop()?.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {teacher.name}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  teacher.status
                )}`}
              >
                {teacher.status}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-900">
                  {teacher.rating}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{teacher.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  Gia nhập:{" "}
                  {new Date(teacher.joinDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap className="h-4 w-4" />
                <span>{teacher.department}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="h-4 w-4" />
                <span>{teacher.specialization}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{teacher.address}</span>
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
              <p className="text-sm font-medium text-gray-600">Sinh viên</p>
              <p className="text-2xl font-bold text-blue-600">
                {teacher.studentsCount}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Khóa học</p>
              <p className="text-2xl font-bold text-green-600">
                {teacher.coursesCount}
              </p>
            </div>
            <BookOpen className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Giờ giảng dạy</p>
              <p className="text-2xl font-bold text-purple-600">
                {teacher.performanceStats.teachingHours}h
              </p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Xếp hạng</p>
              <p className="text-2xl font-bold text-orange-600">
                {teacher.performanceStats.rank}
              </p>
            </div>
            <Award className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teaching Activities Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hoạt động giảng dạy theo tháng
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={teacher.teachingActivities}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="teachingHours"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Giờ giảng"
              />
              <Line
                type="monotone"
                dataKey="averageStudentScore"
                stroke="#10B981"
                strokeWidth={2}
                name="Điểm TB SV"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Comparison Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            So sánh với khoa
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teacher.departmentComparisons}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="teacherValue" fill="#3B82F6" name="Cá nhân" />
              <Bar dataKey="departmentAverage" fill="#10B981" name="TB Khoa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Teaching Courses Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Khóa học đang giảng dạy
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khóa học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sinh viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tỷ lệ hoàn thành
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm TB
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày bắt đầu
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teacher.teachingCourses.map((course) => (
                <tr key={course.courseId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {course.courseName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {course.courseCode}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.studentsEnrolled}/{course.maxStudents}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${course.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">
                        {course.completionRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.averageScore}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getCourseStatusColor(
                        course.status
                      )}`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(course.startDate).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Performance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Thành tích sinh viên nổi bật
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
                  Khóa học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm số
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiến độ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh giá
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teacher.studentPerformances.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.studentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.courseName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.score}
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        student.status === "Excellent"
                          ? "bg-green-100 text-green-800"
                          : student.status === "Good"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            Tỷ lệ hài lòng
          </h4>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {teacher.performanceStats.studentSatisfactionRate}%
            </span>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            Bài học hoàn thành
          </h4>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {teacher.performanceStats.completedLessons}/
              {teacher.performanceStats.totalLessons}
            </span>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            Tỷ lệ hoàn thành BT
          </h4>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {teacher.performanceStats.assignmentCompletionRate}%
            </span>
            <Award className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
