"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  Clock,
  BookOpen,
  Trophy,
  AlertTriangle,
  User,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import {
  getClassStudents,
  ClassStudent,
  GetClassStudentsRequest,
  exportClassReport,
  sendMessageToStudent,
} from "@/apis/teacher-class-monitoring";

const ClassStudentsPage = () => {
  const params = useParams();
  const classId = params.classId as string;
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchStudents();
  }, [classId, currentPage, searchTerm, filterStatus]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const request: GetClassStudentsRequest = {
        classId,
        page: currentPage,
        pageSize,
        searchTerm: searchTerm || undefined,
        sortBy: "name",
        sortOrder: "asc",
      };

      const response = await getClassStudents(request);
      setStudents(response.data.students);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalCount);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Không thể tải danh sách sinh viên. Vui lòng thử lại.");

      // Fallback to mock data in case of API failure
      setStudents([
        {
          studentId: "s1",
          studentName: "Nguyễn Văn An",
          email: "an.nv@example.com",
          avatarUrl: "/api/placeholder/40/40",
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
            },
            {
              courseId: "c2",
              courseName: "Cấu trúc dữ liệu",
              progress: 75,
              status: "in_progress",
              lastAccessed: "2024-06-02T09:15:00",
            },
          ],
        },
        {
          studentId: "s2",
          studentName: "Trần Thị Bình",
          email: "binh.tt@example.com",
          avatarUrl: "/api/placeholder/40/40",
          overallProgress: 72.3,
          completedCourses: 1,
          inProgressCourses: 3,
          notStartedCourses: 0,
          totalAssignments: 8,
          completedAssignments: 6,
          pendingAssignments: 2,
          averageGrade: 7.8,
          lastAccessed: "2024-06-02T08:45:00",
          status: "active",
          courseProgress: [
            {
              courseId: "c1",
              courseName: "Nhập môn lập trình",
              progress: 100,
              status: "completed",
              lastAccessed: "2024-06-01T16:20:00",
            },
            {
              courseId: "c2",
              courseName: "Cấu trúc dữ liệu",
              progress: 60,
              status: "in_progress",
              lastAccessed: "2024-06-02T08:45:00",
            },
          ],
        },
        {
          studentId: "s3",
          studentName: "Lê Văn Cường",
          email: "cuong.lv@example.com",
          avatarUrl: "/api/placeholder/40/40",
          overallProgress: 45.2,
          completedCourses: 0,
          inProgressCourses: 2,
          notStartedCourses: 2,
          totalAssignments: 8,
          completedAssignments: 3,
          pendingAssignments: 5,
          averageGrade: 6.5,
          lastAccessed: "2024-06-01T14:20:00",
          status: "inactive",
          courseProgress: [
            {
              courseId: "c1",
              courseName: "Nhập môn lập trình",
              progress: 65,
              status: "in_progress",
              lastAccessed: "2024-06-01T14:20:00",
            },
            {
              courseId: "c2",
              courseName: "Cấu trúc dữ liệu",
              progress: 25,
              status: "in_progress",
              lastAccessed: "2024-05-30T10:15:00",
            },
          ],
        },
      ]);
      setTotalCount(3);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesStatus =
      filterStatus === "all" || student.status === filterStatus;
    return matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
    } else {
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          Không hoạt động
        </Badge>
      );
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const handleExportReport = async () => {
    try {
      const blob = await exportClassReport(classId, "csv");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `class-${classId}-report.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting report:", error);
    }
  };

  const handleSendMessage = async (studentId: string) => {
    try {
      // In a real app, you would show a modal to compose the message
      const message = {
        subject: "Thông báo từ giảng viên",
        content: "Xin chào! Tôi muốn thảo luận về tiến độ học tập của bạn.",
      };
      await sendMessageToStudent(studentId, message);
      alert("Tin nhắn đã được gửi thành công!");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Có lỗi xảy ra khi gửi tin nhắn.");
    }
  };

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      fetchStudents();
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Đang tải danh sách sinh viên...</span>
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
            Quản lý sinh viên lớp
          </h1>
          <p className="text-gray-600 mt-1">
            Theo dõi tiến độ và hiệu suất học tập của từng sinh viên
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleExportReport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button onClick={fetchStudents} variant="outline" size="sm">
            <Loader2 className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button asChild>
            <Link href={`/teacher/classes/${classId}`}>Quay lại tổng quan</Link>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng sinh viên
                </p>
                <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
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
                <p className="text-sm font-medium text-gray-600">Hoạt động</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredStudents.filter((s) => s.status === "active").length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cần hỗ trợ</p>
                <p className="text-2xl font-bold text-red-600">
                  {
                    filteredStudents.filter((s) => s.overallProgress < 50)
                      .length
                  }
                </p>
              </div>
              <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
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
                  {filteredStudents.length > 0
                    ? Math.round(
                        filteredStudents.reduce(
                          (acc, s) => acc + s.overallProgress,
                          0
                        ) / filteredStudents.length
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm sinh viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Sinh viên</TableHead>
                <TableHead>Tiến độ</TableHead>
                <TableHead>Khóa học</TableHead>
                <TableHead>Bài tập</TableHead>
                <TableHead>Điểm TB</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Truy cập cuối</TableHead>
                <TableHead className="w-24">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student, index) => (
                <TableRow key={student.studentId}>
                  <TableCell>
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {student.studentName}
                        </p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span
                          className={`font-medium ${getProgressColor(
                            student.overallProgress
                          )}`}
                        >
                          {Math.round(student.overallProgress)}%
                        </span>
                      </div>
                      <Progress
                        value={student.overallProgress}
                        className="h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="text-green-600">
                        {student.completedCourses} hoàn thành
                      </div>
                      <div className="text-blue-600">
                        {student.inProgressCourses} đang học
                      </div>
                      <div className="text-gray-500">
                        {student.notStartedCourses} chưa bắt đầu
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>
                        {student.completedAssignments}/
                        {student.totalAssignments}
                      </div>
                      <div className="text-gray-600">hoàn thành</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${getProgressColor(
                        student.averageGrade * 10
                      )}`}
                    >
                      {student.averageGrade.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(student.lastAccessed).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {new Date(student.lastAccessed).toLocaleTimeString(
                          "vi-VN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link
                          href={`/teacher/classes/${classId}/students/${student.studentId}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendMessage(student.studentId)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-6 border-t">
              <div className="text-sm text-gray-600">
                Hiển thị {(currentPage - 1) * pageSize + 1} -{" "}
                {Math.min(currentPage * pageSize, totalCount)}
                trong tổng số {totalCount} sinh viên
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>
                <span className="text-sm text-gray-600">
                  Trang {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {filteredStudents.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy sinh viên
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== "all"
              ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
              : "Lớp học chưa có sinh viên nào"}
          </p>
          {error && (
            <Button onClick={fetchStudents} className="mt-4">
              Thử lại
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassStudentsPage;
