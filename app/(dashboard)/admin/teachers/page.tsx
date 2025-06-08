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
import CreateTeacherModal from "@/components/admin/CreateTeacherModal";

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  specialization: string;
  joinDate: string;
  status: string;
  studentsCount: number;
  coursesCount: number;
  avatar?: string;
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch teachers data
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        pageSize: 10,
        searchTerm: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        department: departmentFilter !== "all" ? departmentFilter : undefined,
      };

      const response = await adminApi.getTeachers(params);
      if (response.data) {
        // Transform API response to match our interface
        const transformedTeachers: Teacher[] =
          response.data.teachers?.map((teacher: any) => ({
            id: teacher.id,
            name: teacher.name,
            email: teacher.email,
            phone: teacher.phone || "N/A",
            department: teacher.department || "Chưa xác định",
            specialization: teacher.specialization || "Chưa xác định",
            joinDate: teacher.joinDate,
            status: teacher.status,
            studentsCount: teacher.studentsCount || 0,
            coursesCount: teacher.coursesCount || 0,
            avatar: teacher.avatar,
          })) || [];

        setTeachers(transformedTeachers);
        setTotalPages(response.data.totalPages || 1);
        setTotalCount(response.data.totalCount || 0);
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Lỗi khi tải dữ liệu");
      // Fallback to mock data for demo
      setTeachers(mockTeachersData);
      setTotalPages(2);
      setTotalCount(15);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [currentPage, searchTerm, statusFilter, departmentFilter]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchTeachers();
  };

  const handleCreateSuccess = () => {
    fetchTeachers(); // Refresh data after creating new teacher
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "on_leave":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const mockTeachersData: Teacher[] = [
    {
      id: "1",
      name: "Nguyễn Thành Nam",
      email: "nam.nguyen@teacher.com",
      phone: "0901234567",
      department: "Công nghệ thông tin",
      specialization: "Kỹ thuật phần mềm",
      joinDate: "2020-09-01",
      status: "Active",
      studentsCount: 45,
      coursesCount: 3,
      avatar: "/avatars/teacher1.jpg",
    },
    {
      id: "2",
      name: "Trần Thị Mai",
      email: "mai.tran@teacher.com",
      phone: "0902345678",
      department: "Công nghệ thông tin",
      specialization: "Trí tuệ nhân tạo",
      joinDate: "2019-08-15",
      status: "Active",
      studentsCount: 38,
      coursesCount: 2,
      avatar: "/avatars/teacher2.jpg",
    },
    {
      id: "3",
      name: "Lê Văn Tuấn",
      email: "tuan.le@teacher.com",
      phone: "0903456789",
      department: "Công nghệ thông tin",
      specialization: "An toàn thông tin",
      joinDate: "2021-01-10",
      status: "On_Leave",
      studentsCount: 25,
      coursesCount: 2,
      avatar: "/avatars/teacher3.jpg",
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
            <h1 className="text-3xl font-bold">Quản lý Giảng viên</h1>
            <p className="text-muted-foreground">
              Quản lý thông tin và tài khoản giảng viên
            </p>
          </div>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Thêm Giảng viên
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng giảng viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">
              +8% so với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang hoạt động
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teachers.filter((t) => t.status === "Active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {teachers.length > 0
                ? Math.round(
                    (teachers.filter((t) => t.status === "Active").length /
                      teachers.length) *
                      100
                  )
                : 0}
              % tổng số
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nghỉ phép</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teachers.filter((t) => t.status === "On_Leave").length}
            </div>
            <p className="text-xs text-muted-foreground">Tạm thời</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Giảng viên mới
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Active">Đang hoạt động</SelectItem>
                <SelectItem value="Inactive">Tạm ngưng</SelectItem>
                <SelectItem value="On_Leave">Nghỉ phép</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Khoa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khoa</SelectItem>
                <SelectItem value="Công nghệ thông tin">
                  Công nghệ thông tin
                </SelectItem>
                <SelectItem value="Kinh tế">Kinh tế</SelectItem>
                <SelectItem value="Kỹ thuật">Kỹ thuật</SelectItem>
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

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Giảng viên</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Giảng viên</TableHead>
                <TableHead>Khoa</TableHead>
                {/* <TableHead>Chuyên môn</TableHead> */}
                <TableHead>Sinh viên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={teacher.avatar} />
                        <AvatarFallback>
                          {teacher.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{teacher.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {teacher.email}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {teacher.phone}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{teacher.department}</TableCell>
                  {/* <TableCell>{teacher.specialization}</TableCell> */}
                  <TableCell>
                    <div className="text-sm">
                      <div>{teacher.studentsCount} sinh viên</div>
                      <div className="text-muted-foreground">
                        {teacher.coursesCount} môn học
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(teacher.status)}>
                      {teacher.status === "Active"
                        ? "Hoạt động"
                        : teacher.status === "Inactive"
                        ? "Tạm ngưng"
                        : teacher.status === "On_Leave"
                        ? "Nghỉ phép"
                        : teacher.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/teachers/${teacher.id}`}>
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
          {Math.min(currentPage * 10, totalCount)} của {totalCount} giảng viên
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

      {/* Create Teacher Modal */}
      <CreateTeacherModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
