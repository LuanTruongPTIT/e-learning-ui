"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  BookOpen,
  Trophy,
  AlertCircle,
  TrendingUp,
  Clock,
  FileText,
  BarChart3,
  User,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  getClassOverview,
  ClassOverview,
} from "@/apis/teacher-class-monitoring";

const ClassDetailPage = () => {
  const params = useParams();
  const classId = params.classId as string;
  const [classDetail, setClassDetail] = useState<ClassOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClassDetail();
  }, [classId]);

  const fetchClassDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getClassOverview(classId);
      setClassDetail(response.data);
    } catch (err) {
      console.error("Error fetching class detail:", err);
      setError("Không thể tải thông tin lớp học. Vui lòng thử lại.");

      // Fallback to mock data in case of API failure
      setClassDetail({
        classId: classId,
        className: "CS101 - Introduction to Programming",
        programName: "Computer Science Program",
        totalStudents: 25,
        activeStudents: 22,
        inactiveStudents: 3,
        averageProgress: 68.5,
        totalCourses: 4,
        completedAssignments: 12,
        pendingAssignments: 8,
        courseProgress: [
          {
            courseId: "c1",
            courseName: "Nhập môn lập trình",
            averageProgress: 75.2,
            studentsCompleted: 8,
            studentsInProgress: 12,
            studentsNotStarted: 5,
          },
          {
            courseId: "c2",
            courseName: "Cấu trúc dữ liệu",
            averageProgress: 62.8,
            studentsCompleted: 5,
            studentsInProgress: 15,
            studentsNotStarted: 5,
          },
          {
            courseId: "c3",
            courseName: "Thuật toán",
            averageProgress: 58.3,
            studentsCompleted: 3,
            studentsInProgress: 18,
            studentsNotStarted: 4,
          },
          {
            courseId: "c4",
            courseName: "Lập trình web",
            averageProgress: 45.1,
            studentsCompleted: 2,
            studentsInProgress: 10,
            studentsNotStarted: 13,
          },
        ],
        topPerformers: [
          {
            studentId: "s1",
            studentName: "Nguyễn Văn An",
            email: "an.nv@example.com",
            overallProgress: 92.5,
            completedCourses: 3,
            inProgressCourses: 1,
            lastAccessed: "2024-06-02T10:30:00",
          },
          {
            studentId: "s2",
            studentName: "Trần Thị Bình",
            email: "binh.tt@example.com",
            overallProgress: 88.3,
            completedCourses: 3,
            inProgressCourses: 1,
            lastAccessed: "2024-06-02T09:15:00",
          },
          {
            studentId: "s3",
            studentName: "Lê Văn Cường",
            email: "cuong.lv@example.com",
            overallProgress: 85.7,
            completedCourses: 2,
            inProgressCourses: 2,
            lastAccessed: "2024-06-02T11:45:00",
          },
        ],
        lowPerformers: [
          {
            studentId: "s4",
            studentName: "Phạm Thị Dung",
            email: "dung.pt@example.com",
            overallProgress: 32.1,
            completedCourses: 0,
            inProgressCourses: 2,
            lastAccessed: "2024-06-01T14:20:00",
          },
          {
            studentId: "s5",
            studentName: "Hoàng Văn Em",
            email: "em.hv@example.com",
            overallProgress: 28.5,
            completedCourses: 0,
            inProgressCourses: 1,
            lastAccessed: "2024-05-30T16:30:00",
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Đang tải thông tin lớp học...</span>
        </div>
      </div>
    );
  }

  if (error && !classDetail) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchClassDetail}>Thử lại</Button>
        </div>
      </div>
    );
  }

  if (!classDetail) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy lớp học
          </h3>
          <p className="text-gray-600">
            Lớp học có thể đã bị xóa hoặc bạn không có quyền truy cập.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {classDetail.className}
          </h1>
          <p className="text-gray-600 mt-1">{classDetail.programName}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={fetchClassDetail} variant="outline" size="sm">
            <Loader2 className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button asChild variant="outline">
            <Link href={`/teacher/classes/${classId}/students`}>
              <Users className="h-4 w-4 mr-2" />
              Quản lý sinh viên
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/teacher/classes/${classId}/analytics`}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Phân tích chi tiết
            </Link>
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sinh viên</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classDetail.totalStudents}
                </p>
                <p className="text-xs text-green-600">
                  {classDetail.activeStudents} hoạt động
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiến độ TB</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(classDetail.averageProgress)}%
                </p>
                <p className="text-xs text-blue-600">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  Đang tăng
                </p>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Khóa học</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classDetail.totalCourses}
                </p>
                <p className="text-xs text-gray-600">Đang diễn ra</p>
              </div>
              <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bài tập</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classDetail.pendingAssignments}
                </p>
                <p className="text-xs text-orange-600">Chờ chấm</p>
              </div>
              <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress */}
      {classDetail.courseProgress && classDetail.courseProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Tiến độ theo khóa học
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {classDetail.courseProgress.map((course) => (
                <div key={course.courseId} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                      {course.courseName}
                    </h4>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700"
                    >
                      {Math.round(course.averageProgress)}%
                    </Badge>
                  </div>

                  <Progress value={course.averageProgress} className="h-2" />

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      <span className="text-green-600 font-medium">
                        {course.studentsCompleted}
                      </span>{" "}
                      hoàn thành
                    </span>
                    <span>
                      <span className="text-blue-600 font-medium">
                        {course.studentsInProgress}
                      </span>{" "}
                      đang học
                    </span>
                    <span>
                      <span className="text-gray-500 font-medium">
                        {course.studentsNotStarted}
                      </span>{" "}
                      chưa bắt đầu
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        {classDetail.topPerformers && classDetail.topPerformers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Sinh viên xuất sắc
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classDetail.topPerformers.map((student) => (
                  <div
                    key={student.studentId}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {student.studentName}
                        </p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {Math.round(student.overallProgress)}%
                      </p>
                      <p className="text-xs text-gray-600">
                        {student.completedCourses} hoàn thành
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Low Performers */}
        {classDetail.lowPerformers && classDetail.lowPerformers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Sinh viên cần hỗ trợ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classDetail.lowPerformers.map((student) => (
                  <div
                    key={student.studentId}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-red-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {student.studentName}
                        </p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">
                        {Math.round(student.overallProgress)}%
                      </p>
                      <p className="text-xs text-gray-600">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {new Date(student.lastAccessed).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-6">
        <Button asChild size="lg">
          <Link href={`/teacher/classes/${classId}/students`}>
            <Users className="h-5 w-5 mr-2" />
            Xem tất cả sinh viên
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href={`/teacher/classes/${classId}/analytics`}>
            <BarChart3 className="h-5 w-5 mr-2" />
            Báo cáo chi tiết
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ClassDetailPage;
