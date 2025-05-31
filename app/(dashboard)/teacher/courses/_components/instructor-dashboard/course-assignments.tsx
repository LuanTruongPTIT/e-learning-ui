"use client";

import React, { useState, useEffect } from "react";
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
  GraduationCap,
} from "lucide-react";
import { format, isAfter, isBefore } from "date-fns";
import { vi } from "date-fns/locale";
import CreateAssignmentModal from "./create-assignment-modal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { assignmentApi, Assignment } from "@/apis/assignments";

interface CourseAssignmentsProps {
  courseId: string;
}

export default function CourseAssignments({
  courseId,
}: CourseAssignmentsProps) {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch assignments from API
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await assignmentApi.getAssignmentsByCourse(courseId);

      if (response.status === 200) {
        setAssignments(response.data);
      } else {
        toast.error("Failed to load assignments");
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchAssignments();
    }
  }, [courseId]);

  // Filter and sort assignments
  const filteredAssignments = assignments
    .filter((assignment) => {
      const matchesSearch =
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (assignment.description?.toLowerCase() || "").includes(
          searchQuery.toLowerCase()
        );

      if (!matchesSearch) return false;

      if (filterStatus === "all") return true;

      const now = new Date();
      const deadline = new Date(assignment.deadline);
      if (filterStatus === "active") return isAfter(deadline, now);
      if (filterStatus === "expired") return isBefore(deadline, now);

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
          aValue = new Date(a.deadline).getTime();
          bValue = new Date(b.deadline).getTime();
          break;
        case "created_at":
          aValue = new Date(a.createdAt || a.created_at).getTime();
          bValue = new Date(b.createdAt || b.created_at).getTime();
          break;
        case "submissions":
          aValue = a.submissionsCount ?? a.submissions_count ?? 0;
          bValue = b.submissionsCount ?? b.submissions_count ?? 0;
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

  const getStatusBadge = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const isExpired = isBefore(deadlineDate, now);

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

  const handleDelete = async (assignmentId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài tập này?")) {
      try {
        const response = await assignmentApi.deleteAssignment(assignmentId);

        if (response.status === 200) {
          toast.success("Đã xóa bài tập thành công");
          fetchAssignments(); // Refresh list
        } else {
          toast.error("Có lỗi xảy ra khi xóa bài tập");
        }
      } catch (error) {
        console.error("Error deleting assignment:", error);
        toast.error("Có lỗi xảy ra khi xóa bài tập");
      }
    }
  };

  const handleGradeAssignment = (assignmentId: string) => {
    router.push(`/teacher/assignments/${assignmentId}/grading`);
  };

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
                          {getAssignmentTypeIcon(
                            assignment.assignmentType ||
                              assignment.assignment_type
                          )}
                        </span>
                        {assignment.title}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {assignment.description}
                      </div>
                      {(assignment.timeLimitMinutes ||
                        assignment.time_limit_minutes) && (
                        <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          {assignment.timeLimitMinutes ||
                            assignment.time_limit_minutes}{" "}
                          phút
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {(assignment.assignmentType ||
                        assignment.assignment_type) === "quiz" && "Quiz online"}
                      {(assignment.assignmentType ||
                        assignment.assignment_type) === "upload" && "Nộp file"}
                      {(assignment.assignmentType ||
                        assignment.assignment_type) === "both" && "Cả hai"}
                    </div>
                    {(assignment.attachmentUrls ||
                      assignment.attachment_urls) &&
                      (assignment.attachmentUrls || assignment.attachment_urls)!
                        .length > 0 && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {
                            (assignment.attachmentUrls ||
                              assignment.attachment_urls)!.length
                          }{" "}
                          file
                        </div>
                      )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {format(new Date(assignment.deadline), "dd/MM/yyyy", {
                        locale: vi,
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(assignment.deadline), "HH:mm", {
                        locale: vi,
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {assignment.submissionsCount ??
                        assignment.submissions_count ??
                        0}
                      /
                      {assignment.totalStudents ??
                        assignment.total_students ??
                        0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(assignment.submissionsCount ??
                        assignment.submissions_count ??
                        0) ===
                      (assignment.totalStudents ??
                        assignment.total_students ??
                        0)
                        ? "Hoàn thành"
                        : `${
                            (assignment.totalStudents ??
                              assignment.total_students ??
                              0) -
                            (assignment.submissionsCount ??
                              assignment.submissions_count ??
                              0)
                          } chưa nộp`}
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
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleGradeAssignment(assignment.id)}
                        >
                          <GraduationCap className="mr-2 h-4 w-4" />
                          Chấm điểm
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
          fetchAssignments(); // Refresh assignments list
          console.log("Assignment created, refreshing list...");
        }}
      />
    </div>
  );
}
