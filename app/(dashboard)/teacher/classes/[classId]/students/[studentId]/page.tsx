"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Trophy,
  AlertCircle,
  Clock,
  Mail,
  User,
  Calendar,
  FileText,
  Award,
  Loader2,
  Send,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import {
  getStudentDetail,
  ClassStudent,
  sendMessageToStudent,
} from "@/apis/teacher-class-monitoring";

const StudentDetailPage = () => {
  const params = useParams();
  const classId = params.classId as string;
  const studentId = params.studentId as string;
  const [student, setStudent] = useState<ClassStudent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchStudentDetail();
  }, [studentId]);

  const fetchStudentDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getStudentDetail(studentId);
      setStudent(response.data);
    } catch (err) {
      console.error("Error fetching student detail:", err);
      setError("Không thể tải thông tin sinh viên. Vui lòng thử lại.");

      // Fallback to mock data in case of API failure
      setStudent({
        studentId: studentId,
        studentName: "Nguyễn Văn An",
        email: "an.nv@example.com",
        avatarUrl: "/api/placeholder/80/80",
        overallProgress: 85.5,
        completedCourses: 2,
        inProgressCourses: 2,
        notStartedCourses: 0,
        totalAssignments: 8,
        completedAssignments: 7,
        pendingAssignments: 1,
        averageGrade: 8.5,
        lastAccessed: "2024-06-02T10:30:00",
        status: "active",
        courseProgress: [
          {
            courseId: "c1",
            courseName: "Nhập môn lập trình",
            progress: 100,
            status: "completed",
            lastAccessed: "2024-06-02T10:30:00",
            completedLectures: 10,
            totalLectures: 10,
            completedAssignments: 3,
            totalAssignments: 3,
            currentGrade: 9.0,
          },
          {
            courseId: "c2",
            courseName: "Cấu trúc dữ liệu",
            progress: 75,
            status: "in_progress",
            lastAccessed: "2024-06-02T09:15:00",
            completedLectures: 6,
            totalLectures: 8,
            completedAssignments: 2,
            totalAssignments: 3,
            currentGrade: 8.5,
          },
          {
            courseId: "c3",
            courseName: "Thuật toán",
            progress: 60,
            status: "in_progress",
            lastAccessed: "2024-06-01T14:20:00",
            completedLectures: 4,
            totalLectures: 8,
            completedAssignments: 1,
            totalAssignments: 2,
            currentGrade: 7.5,
          },
          {
            courseId: "c4",
            courseName: "Lập trình web",
            progress: 0,
            status: "not_started",
            lastAccessed: "2024-05-25T09:00:00",
            completedLectures: 0,
            totalLectures: 12,
            completedAssignments: 0,
            totalAssignments: 4,
            currentGrade: undefined,
          },
        ],
        recentAssignments: [],
        recentActivities: [
          {
            activityType: "assignment_submit",
            description: "Submitted assignment: Thuật toán sắp xếp",
            timestamp: "2024-06-02T08:30:00",
            courseName: "Cấu trúc dữ liệu",
            score: 9.0,
          },
          {
            activityType: "lecture_complete",
            description: "Completed lecture: Giới thiệu về cấu trúc dữ liệu",
            timestamp: "2024-06-01T16:45:00",
            courseName: "Cấu trúc dữ liệu",
            score: undefined,
          },
          {
            activityType: "course_access",
            description: "Accessed course content",
            timestamp: "2024-05-31T14:20:00",
            courseName: "Lập trình web",
            score: undefined,
          },
        ],
        enrollmentDate: "2024-01-15T00:00:00",
        programName: "Công nghệ thông tin",
        department: "Khoa CNTT",
        phoneNumber: undefined,
        address: undefined,
        dateOfBirth: undefined,
        gender: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageSubject.trim() || !messageContent.trim()) {
      alert("Vui lòng nhập đầy đủ tiêu đề và nội dung tin nhắn.");
      return;
    }

    try {
      setSendingMessage(true);
      await sendMessageToStudent(studentId, {
        subject: messageSubject,
        content: messageContent,
      });

      alert("Tin nhắn đã được gửi thành công!");
      setMessageSubject("");
      setMessageContent("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Có lỗi xảy ra khi gửi tin nhắn.");
    } finally {
      setSendingMessage(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
        );
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">Đang học</Badge>;
      case "not_started":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Chưa bắt đầu
          </Badge>
        );
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Đang tải thông tin sinh viên...</span>
        </div>
      </div>
    );
  }

  if (error && !student) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchStudentDetail}>Thử lại</Button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy sinh viên
          </h3>
          <p className="text-gray-600">
            Sinh viên có thể đã bị xóa hoặc bạn không có quyền truy cập.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href={`/teacher/classes/${classId}/students`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Chi tiết sinh viên
            </h1>
            <p className="text-gray-600 mt-1">
              Thông tin chi tiết và tiến độ học tập
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={fetchStudentDetail} variant="outline" size="sm">
            <Loader2 className="h-4 w-4 mr-2" />
            Làm mới
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Profile */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-600" />
                </div>
              </div>
              <CardTitle className="text-xl font-bold">
                {student.studentName}
              </CardTitle>
              <p className="text-gray-600">{student.email}</p>
              <Badge
                className={
                  student.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {student.status === "active" ? "Hoạt động" : "Không hoạt động"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tiến độ tổng thể</span>
                <span
                  className={`font-bold ${getProgressColor(
                    student.overallProgress
                  )}`}
                >
                  {Math.round(student.overallProgress)}%
                </span>
              </div>
              <Progress value={student.overallProgress} className="h-2" />

              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Khóa học hoàn thành</span>
                  </div>
                  <span className="font-medium">
                    {student.completedCourses}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Đang học</span>
                  </div>
                  <span className="font-medium">
                    {student.inProgressCourses}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Bài tập hoàn thành</span>
                  </div>
                  <span className="font-medium">
                    {student.completedAssignments}/{student.totalAssignments}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Điểm trung bình</span>
                  </div>
                  <span
                    className={`font-medium ${getProgressColor(
                      student.averageGrade * 10
                    )}`}
                  >
                    {student.averageGrade.toFixed(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">Truy cập cuối</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {student.lastAccessed
                      ? new Date(student.lastAccessed).toLocaleDateString(
                          "vi-VN"
                        )
                      : "Chưa xác định"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Send Message */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Gửi tin nhắn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  placeholder="Tiêu đề tin nhắn"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Nội dung tin nhắn..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={4}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={sendingMessage}
                className="w-full"
              >
                {sendingMessage ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Gửi tin nhắn
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Course Progress */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Tiến độ từng khóa học
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {student.courseProgress.map((course) => (
                  <div key={course.courseId} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        {course.courseName}
                      </h4>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(course.status)}
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700"
                        >
                          {Math.round(course.progress)}%
                        </Badge>
                      </div>
                    </div>

                    <Progress value={course.progress} className="h-2" />

                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Tiến độ: {Math.round(course.progress)}%</span>
                      <span>
                        Truy cập cuối:{" "}
                        {course.lastAccessed
                          ? new Date(course.lastAccessed).toLocaleDateString(
                              "vi-VN"
                            )
                          : "Chưa xác định"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Hoạt động gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {student.recentActivities &&
                student.recentActivities.length > 0 ? (
                  student.recentActivities.map((activity, index) => {
                    const getActivityIcon = (type: string) => {
                      switch (type) {
                        case "assignment_submit":
                          return <Trophy className="h-4 w-4 text-green-600" />;
                        case "lecture_complete":
                          return <BookOpen className="h-4 w-4 text-blue-600" />;
                        case "course_access":
                          return (
                            <FileText className="h-4 w-4 text-purple-600" />
                          );
                        default:
                          return <Clock className="h-4 w-4 text-gray-600" />;
                      }
                    };

                    const getActivityColor = (type: string) => {
                      switch (type) {
                        case "assignment_submit":
                          return "bg-green-50";
                        case "lecture_complete":
                          return "bg-blue-50";
                        case "course_access":
                          return "bg-purple-50";
                        default:
                          return "bg-gray-50";
                      }
                    };

                    const getIconBgColor = (type: string) => {
                      switch (type) {
                        case "assignment_submit":
                          return "bg-green-100";
                        case "lecture_complete":
                          return "bg-blue-100";
                        case "course_access":
                          return "bg-purple-100";
                        default:
                          return "bg-gray-100";
                      }
                    };

                    const formatTimeAgo = (timestamp: string | undefined) => {
                      if (!timestamp) return "Không xác định";

                      try {
                        const now = new Date();
                        const activityTime = new Date(timestamp as string);
                        const diffInHours = Math.floor(
                          (now.getTime() - activityTime.getTime()) /
                            (1000 * 60 * 60)
                        );

                        if (diffInHours < 1) {
                          return "Vừa xong";
                        } else if (diffInHours < 24) {
                          return `${diffInHours} giờ trước`;
                        } else {
                          const diffInDays = Math.floor(diffInHours / 24);
                          return `${diffInDays} ngày trước`;
                        }
                      } catch {
                        return "Không xác định";
                      }
                    };

                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 rounded-lg ${getActivityColor(
                          activity.activityType
                        )}`}
                      >
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${getIconBgColor(
                            activity.activityType
                          )}`}
                        >
                          {getActivityIcon(activity.activityType)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.description}
                          </p>
                          {activity.courseName && (
                            <p className="text-xs text-gray-600">
                              Khóa học: {activity.courseName}
                            </p>
                          )}
                          {activity.score && (
                            <p className="text-xs text-gray-600">
                              Điểm: {activity.score}/10
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            {formatTimeAgo(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Chưa có hoạt động nào</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;
