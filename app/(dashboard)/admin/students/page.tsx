"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, UserPlus, Search, Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import CreateStudentModal from "@/components/admin/CreateStudentModal";

interface Student {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  enrollmentDate: string;
  status: "Active" | "Inactive" | "Suspended";
  coursesCount: number;
  gpa: number;
  avatar?: string;
  program: string;
  department: string;
}

interface StudentsResponse {
  students: Student[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch students data
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        pageSize: 10,
        searchTerm: searchTerm || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
      };

      const response = await adminApi.getStudents(params);
      if (response.data) {
        // Transform API response to match our interface
        const transformedStudents: Student[] =
          response.data.students?.map((student: any) => ({
            id: student.id,
            name: student.name,
            email: student.email,
            phoneNumber: student.phoneNumber || "N/A",
            dateOfBirth: student.dateOfBirth,
            enrollmentDate: student.enrollmentDate,
            status: student.status as "Active" | "Inactive" | "Suspended",
            coursesCount: student.totalCourses || 0,
            gpa: student.gpa || 0,
            program: student.program || "Chưa xác định",
            department: student.department || "Chưa xác định",
            avatar: student.avatar,
          })) || [];

        setStudents(transformedStudents);
        setTotalPages(response.data.totalPages || 1);
        setTotalCount(response.data.totalCount || 0);
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Lỗi khi tải dữ liệu");
      // Fallback to mock data for demo
      setStudents(mockStudentsData);
      setTotalPages(3);
      setTotalCount(25);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentPage, searchTerm, filterStatus]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchStudents();
  };

  const handleCreateSuccess = () => {
    fetchStudents(); // Refresh data after creating new student
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const mockStudentsData: Student[] = [
    {
      id: "1",
      name: "Nguyễn Văn An",
      email: "an.nguyen@student.com",
      phoneNumber: "0901234567",
      dateOfBirth: "2002-01-15",
      enrollmentDate: "2023-09-01",
      status: "Active",
      coursesCount: 4,
      gpa: 8.5,
      avatar: "/avatars/student1.jpg",
      program: "Kỹ thuật phần mềm",
      department: "Công nghệ thông tin",
    },
    {
      id: "2",
      name: "Trần Thị Bình",
      email: "binh.tran@student.com",
      phoneNumber: "0902345678",
      dateOfBirth: "2002-02-20",
      enrollmentDate: "2023-09-01",
      status: "Active",
      coursesCount: 3,
      gpa: 9.2,
      avatar: "/avatars/student2.jpg",
      program: "Khoa học máy tính",
      department: "Công nghệ thông tin",
    },
    {
      id: "3",
      name: "Lê Văn Cường",
      email: "cuong.le@student.com",
      phoneNumber: "0903456789",
      dateOfBirth: "2002-03-10",
      enrollmentDate: "2023-09-01",
      status: "Inactive",
      coursesCount: 2,
      gpa: 7.8,
      avatar: "/avatars/student3.jpg",
      program: "Hệ thống thông tin",
      department: "Công nghệ thông tin",
    },
  ];

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Quản lý Sinh viên</h1>
            <p className="text-muted-foreground">
              Quản lý thông tin và tài khoản sinh viên
            </p>
          </div>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Thêm Sinh viên
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng sinh viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">
              +12% so với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang học</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter((s) => s.status === "Active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {students.length > 0
                ? Math.round(
                    (students.filter((s) => s.status === "Active").length /
                      students.length) *
                      100
                  )
                : 0}
              % tổng số
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tạm ngưng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter((s) => s.status === "Inactive").length}
            </div>
            <p className="text-xs text-muted-foreground">Cần xem xét</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sinh viên mới</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Trong tháng này</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo tên, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Active">Đang học</SelectItem>
                <SelectItem value="Inactive">Tạm ngưng</SelectItem>
                <SelectItem value="Suspended">Đình chỉ</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Tìm kiếm
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-yellow-800">{error} - Hiển thị dữ liệu demo</p>
          </CardContent>
        </Card>
      )}

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Sinh viên</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sinh viên</TableHead>
                <TableHead>Chương trình</TableHead>
                <TableHead>Khoa</TableHead>
                <TableHead>Ngày nhập học</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {student.email}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {student.phoneNumber}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.program}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.enrollmentDate}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(student.status)}>
                      {student.status === "Active"
                        ? "Đang học"
                        : student.status === "Inactive"
                        ? "Tạm ngưng"
                        : student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/students/${student.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị {(currentPage - 1) * 10 + 1} -{" "}
          {Math.min(currentPage * 10, totalCount)} của {totalCount} sinh viên
        </p>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            Sau
          </Button>
        </div>
      </div>

      {/* Create Student Modal */}
      <CreateStudentModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
