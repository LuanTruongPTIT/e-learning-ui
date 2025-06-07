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
  Trophy,
  Clock,
  BookOpen,
  Target,
  Award,
} from "lucide-react";
import { adminApi, StudentDetail } from "@/lib/api";
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

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudentDetails();
  }, [params.id]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminApi.getStudentDetails(params.id as string);

      if (response.status === 200 && response.data) {
        setStudent(response.data);
      } else {
        setError("Không thể tải thông tin sinh viên");
        // Fallback to mock data for demo
        setStudent(mockStudentData);
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Lỗi khi tải dữ liệu");
      // Fallback to mock data for demo
      setStudent(mockStudentData);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const mockStudentData: StudentDetail = {
    id: params.id as string,
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    phoneNumber: "0123456789",
    dateOfBirth: "2000-05-15",
    enrollmentDate: "2023-09-01",
    status: "Active",
    department: "Công nghệ thông tin",
    program: "Kỹ thuật phần mềm",
    gpa: 8.5,
    totalCourses: 12,
    completedCourses: 8,
    inProgressCourses: 4,
    avatar: "",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    performanceStats: {
      averageScore: 85.5,
      attendanceRate: 92.3,
      totalAssignments: 45,
      completedAssignments: 42,
      totalQuizzes: 24,
      quizAverageScore: 87.2,
      studyHours: 240,
      rank: "Top 15%",
    },
    courseProgresses: [
      {
        courseId: "1",
        courseName: "Lập trình Web",
        courseCode: "CS101",
        teacherName: "GS. Trần Văn B",
        progressPercentage: 85,
        currentScore: 88,
        status: "In Progress",
        lastAccessed: "2024-01-15",
      },
      {
        courseId: "2",
        courseName: "Cấu trúc dữ liệu",
        courseCode: "CS201",
        teacherName: "TS. Lê Thị C",
        progressPercentage: 100,
        currentScore: 92,
        status: "Completed",
        lastAccessed: "2024-01-10",
      },
      {
        courseId: "3",
        courseName: "Cơ sở dữ liệu",
        courseCode: "CS301",
        teacherName: "ThS. Phạm Văn D",
        progressPercentage: 65,
        currentScore: 80,
        status: "In Progress",
        lastAccessed: "2024-01-14",
      },
    ],
    studyActivities: [
      {
        month: "09/2023",
        studyHours: 45,
        assignmentsCompleted: 8,
        quizzesTaken: 4,
        averageScore: 82,
      },
      {
        month: "10/2023",
        studyHours: 52,
        assignmentsCompleted: 10,
        quizzesTaken: 5,
        averageScore: 85,
      },
      {
        month: "11/2023",
        studyHours: 48,
        assignmentsCompleted: 9,
        quizzesTaken: 4,
        averageScore: 87,
      },
      {
        month: "12/2023",
        studyHours: 40,
        assignmentsCompleted: 7,
        quizzesTaken: 3,
        averageScore: 89,
      },
      {
        month: "01/2024",
        studyHours: 55,
        assignmentsCompleted: 12,
        quizzesTaken: 6,
        averageScore: 86,
      },
    ],
    subjectScores: [
      { subject: "Lập trình", score: 88, grade: "A", color: "#10B981" },
      { subject: "Toán học", score: 82, grade: "B+", color: "#F59E0B" },
      { subject: "Tiếng Anh", score: 90, grade: "A", color: "#10B981" },
      { subject: "Vật lý", score: 78, grade: "B", color: "#3B82F6" },
      { subject: "Hóa học", score: 85, grade: "A-", color: "#10B981" },
      { subject: "Triết học", score: 75, grade: "B", color: "#6B7280" },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">
          Không tìm thấy sinh viên
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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "#10B981";
    if (progress >= 60) return "#3B82F6";
    if (progress >= 40) return "#F59E0B";
    return "#EF4444";
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
            Chi tiết sinh viên
          </h1>
          <p className="text-gray-600">
            Thông tin chi tiết và thống kê học tập
          </p>
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {student.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {student.name}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  student.status
                )}`}
              >
                {student.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{student.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  Sinh:{" "}
                  {new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap className="h-4 w-4" />
                <span>{student.department}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="h-4 w-4" />
                <span>{student.program}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{student.address}</span>
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
              <p className="text-sm font-medium text-gray-600">GPA</p>
              <p className="text-2xl font-bold text-blue-600">{student.gpa}</p>
            </div>
            <Trophy className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tỷ lệ điểm danh
              </p>
              <p className="text-2xl font-bold text-green-600">
                {student.performanceStats.attendanceRate}%
              </p>
            </div>
            <Clock className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Khóa học hoàn thành
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {student.completedCourses}/{student.totalCourses}
              </p>
            </div>
            <Target className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Xếp hạng</p>
              <p className="text-2xl font-bold text-orange-600">
                {student.performanceStats.rank}
              </p>
            </div>
            <Award className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Activities Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hoạt động học tập theo tháng
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={student.studyActivities}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="studyHours"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Giờ học"
              />
              <Line
                type="monotone"
                dataKey="averageScore"
                stroke="#10B981"
                strokeWidth={2}
                name="Điểm TB"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Scores Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Điểm số theo môn học
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={student.subjectScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course Progress Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Tiến độ khóa học
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
                  Giảng viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiến độ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm hiện tại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Truy cập cuối
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {student.courseProgresses.map((course) => (
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
                    {course.teacherName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${course.progressPercentage}%`,
                            backgroundColor: getProgressColor(
                              course.progressPercentage
                            ),
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">
                        {course.progressPercentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.currentScore}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        course.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : course.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(course.lastAccessed).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Bài tập</h4>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {student.performanceStats.completedAssignments}/
              {student.performanceStats.totalAssignments}
            </span>
            <div className="text-right">
              <div className="text-sm text-gray-500">Tỷ lệ hoàn thành</div>
              <div className="text-lg font-semibold text-blue-600">
                {Math.round(
                  (student.performanceStats.completedAssignments /
                    student.performanceStats.totalAssignments) *
                    100
                )}
                %
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Kiểm tra</h4>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {student.performanceStats.totalQuizzes}
            </span>
            <div className="text-right">
              <div className="text-sm text-gray-500">Điểm TB</div>
              <div className="text-lg font-semibold text-green-600">
                {student.performanceStats.quizAverageScore}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            Thời gian học
          </h4>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {student.performanceStats.studyHours}h
            </span>
            <div className="text-right">
              <div className="text-sm text-gray-500">Điểm TB</div>
              <div className="text-lg font-semibold text-purple-600">
                {student.performanceStats.averageScore}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
