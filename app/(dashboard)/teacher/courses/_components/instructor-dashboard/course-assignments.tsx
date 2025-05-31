"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Users,
  // Calendar,
  Clock,
  FileText,
  ArrowUpDown,
} from "lucide-react";
import { format, isAfter, isBefore } from "date-fns";
import { vi } from "date-fns/locale";
import CreateAssignmentModal from "./create-assignment-modal";
import { toast } from "@/components/ui/toast";

interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description: string;
  deadline: Date;
  assignment_type: "quiz" | "upload" | "both";
  show_answers: boolean;
  time_limit?: number;
  attachment_urls: string[];
  created_at: Date;
  updated_at: Date;
  submissions_count: number;
  total_students: number;
}

interface CourseAssignmentsProps {
  courseId: string;
}

// Mock data for assignments
const mockAssignments: Assignment[] = [
  {
    id: "assignment-1",
    course_id: "course-1",
    title: "Bài tập JavaScript cơ bản",
    description:
      "Hoàn thành các bài tập về biến, hàm và vòng lặp trong JavaScript",
    deadline: new Date("2024-02-15T23:59:00"),
    assignment_type: "upload",
    show_answers: false,
    attachment_urls: ["https://example.com/assignment1.pdf"],
    created_at: new Date("2024-01-20T10:00:00"),
    updated_at: new Date("2024-01-20T10:00:00"),
    submissions_count: 18,
    total_students: 24,
  },
  {
    id: "assignment-2",
    course_id: "course-1",
    title: "Quiz: Kiến thức HTML/CSS",
    description: "Kiểm tra kiến thức cơ bản về HTML và CSS",
    deadline: new Date("2024-02-20T15:30:00"),
    assignment_type: "quiz",
    show_answers: true,
    time_limit: 45,
    attachment_urls: [],
    created_at: new Date("2024-01-25T14:00:00"),
    updated_at: new Date("2024-01-25T14:00:00"),
    submissions_count: 22,
    total_students: 24,
  },
  {
    id: "assignment-3",
    course_id: "course-1",
    title: "Dự án cuối khóa",
    description:
      "Xây dựng một website hoàn chỉnh sử dụng HTML, CSS và JavaScript",
    deadline: new Date("2024-03-01T23:59:00"),
    assignment_type: "both",
    show_answers: false,
    time_limit: 120,
    attachment_urls: [
      "https://example.com/project-requirements.pdf",
      "https://example.com/template.zip",
    ],
    created_at: new Date("2024-02-01T09:00:00"),
    updated_at: new Date("2024-02-01T09:00:00"),
    submissions_count: 5,
    total_students: 24,
  },
];

export default function CourseAssignments({
  courseId,
}: CourseAssignmentsProps) {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  // const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter and sort assignments
  const filteredAssignments = assignments
    .filter((assignment) => {
      const matchesSearch =
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterStatus === "all") return true;

      const now = new Date();
      if (filterStatus === "active") return isAfter(assignment.deadline, now);
      if (filterStatus === "expired") return isBefore(assignment.deadline, now);

      return true;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "title":
          aValue = a.title;
          bValue = b.title;
          break;
        case "deadline":
          aValue = a.deadline.getTime();
          bValue = b.deadline.getTime();
          break;
        case "created_at":
          aValue = a.created_at.getTime();
          bValue = b.created_at.getTime();
          break;
        case "submissions":
          aValue = a.submissions_count;
          bValue = b.submissions_count;
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

  const getStatusBadge = (deadline: Date) => {
    const now = new Date();
    const isExpired = isBefore(deadline, now);

    return (
      <Badge variant={isExpired ? "destructive" : "default"}>
        {isExpired ? "Đã hết hạn" : "Đang mở"}
      </Badge>
    );
  };

  const getAssignmentTypeIcon = (type: string) => {
    switch (type) {
      case "quiz":
        return "📝";
      case "upload":
        return "📄";
      case "both":
        return "🔄";
      default:
        return "📋";
    }
  };

  const getSubmissionProgress = (submitted: number, total: number) => {
    const percentage = total > 0 ? Math.round((submitted / total) * 100) : 0;
    return `${submitted}/${total} (${percentage}%)`;
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: Implement API call to delete assignment
      setAssignments((prev) =>
        prev.filter((assignment) => assignment.id !== id)
      );
      toast.success("Xóa bài tập thành công!");
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast.error("Có lỗi xảy ra khi xóa bài tập");
    }
  };

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bài tập..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Đang mở</SelectItem>
              <SelectItem value="expired">Đã hết hạn</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="title">Tiêu đề</SelectItem>
              <SelectItem value="created_at">Ngày tạo</SelectItem>
              <SelectItem value="submissions">Số bài nộp</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>

          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo bài tập
          </Button>
        </div>
      </div>

      {/* Assignments Table */}
      {filteredAssignments.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow className="hover:bg-secondary/50 border-none">
                <TableHead className="w-[30%]">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => toggleSort("title")}
                  >
                    Tiêu đề
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[15%]">Loại</TableHead>
                <TableHead className="w-[20%]">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => toggleSort("deadline")}
                  >
                    Deadline
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[15%]">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => toggleSort("submissions")}
                  >
                    Nộp bài
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[10%]">Trạng thái</TableHead>
                <TableHead className="text-right w-[10%]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map((assignment, index) => (
                <TableRow
                  key={assignment.id}
                  className={
                    index % 2 === 0
                      ? "bg-white hover:bg-gray-50"
                      : "bg-secondary/30 hover:bg-secondary/50"
                  }
                >
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <span>
                          {getAssignmentTypeIcon(assignment.assignment_type)}
                        </span>
                        {assignment.title}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {assignment.description}
                      </div>
                      {assignment.time_limit && (
                        <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          {assignment.time_limit} phút
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {assignment.assignment_type === "quiz" && "Quiz online"}
                      {assignment.assignment_type === "upload" && "Nộp file"}
                      {assignment.assignment_type === "both" && "Cả hai"}
                    </div>
                    {assignment.attachment_urls.length > 0 && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {assignment.attachment_urls.length} file
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {format(assignment.deadline, "dd/MM/yyyy", {
                        locale: vi,
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(assignment.deadline, "HH:mm", { locale: vi })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {getSubmissionProgress(
                        assignment.submissions_count,
                        assignment.total_students
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(assignment.deadline)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Users className="mr-2 h-4 w-4" />
                          Xem bài nộp
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive focus:text-destructive"
                          onClick={() => handleDelete(assignment.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md bg-muted/20">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Chưa có bài tập nào</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {searchQuery || filterStatus !== "all"
              ? "Không tìm thấy bài tập phù hợp với bộ lọc."
              : "Tạo bài tập đầu tiên cho khóa học này."}
          </p>
          {!searchQuery && filterStatus === "all" && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo bài tập đầu tiên
            </Button>
          )}
        </div>
      )}

      {/* Create Assignment Modal */}
      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        courseId={courseId}
        onAssignmentCreated={() => {
          // TODO: Refresh assignments list
          console.log("Assignment created, refreshing list...");
        }}
      />
    </div>
  );
}
