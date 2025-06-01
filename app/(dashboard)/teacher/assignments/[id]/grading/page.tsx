"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getAssignmentSubmissions,
  gradeAssignment,
  downloadSubmissionFile,
  AssignmentSubmissionsResponse,
  AssignmentSubmission,
  GradeAssignmentRequest,
} from "@/apis/grading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-toastify";
import {
  Download,
  Eye,
  FileText,
  GraduationCap,
  Users,
  CheckCircle,
  AlertCircle,
  Star,
  ArrowLeft,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Cookies from "js-cookie";

export default function AssignmentGradingPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;

  const [isClient, setIsClient] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submissionsData, setSubmissionsData] =
    useState<AssignmentSubmissionsResponse | null>(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState<AssignmentSubmission | null>(null);
  const [showGradingDialog, setShowGradingDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [grading, setGrading] = useState(false);

  // Filter and pagination states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Grading form state
  const [grade, setGrade] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    setIsClient(true);
    const role = Cookies.get("role") || "";
    setIsTeacher(role === "Teacher" || role === "Lecturer");
  }, []);

  useEffect(() => {
    if (isClient && isTeacher && assignmentId) {
      fetchSubmissions();
    }
  }, [isClient, isTeacher, assignmentId, statusFilter, currentPage]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await getAssignmentSubmissions(assignmentId, {
        status: statusFilter === "all" ? undefined : statusFilter,
        page: currentPage,
        pageSize: pageSize,
      });
      setSubmissionsData(response.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmission = (submission: AssignmentSubmission) => {
    setSelectedSubmission(submission);
    setShowDetailDialog(true);
  };

  const handleGradeSubmission = (submission: AssignmentSubmission) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade || 0);
    setFeedback(submission.feedback || "");
    setShowGradingDialog(true);
  };

  const handleSubmitGrade = async () => {
    if (!selectedSubmission) return;

    if (grade < 0 || grade > (submissionsData?.assignment.maxScore || 0)) {
      toast.error(
        `Grade must be between 0 and ${submissionsData?.assignment.maxScore}`
      );
      return;
    }

    try {
      setGrading(true);
      const gradeData: GradeAssignmentRequest = {
        grade: grade,
        feedback: feedback.trim() || undefined,
      };

      await gradeAssignment(selectedSubmission.id, gradeData);
      toast.success("Assignment graded successfully");
      setShowGradingDialog(false);
      fetchSubmissions(); // Refresh data
    } catch (error) {
      console.error("Error grading assignment:", error);
      toast.error("Failed to grade assignment");
    } finally {
      setGrading(false);
    }
  };

  const handleDownloadFile = async (fileUrl: string, fileName: string) => {
    try {
      const blob = await downloadSubmissionFile(fileUrl);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const formatLateDuration = (duration?: string) => {
    if (!duration) return "";
    // Parse duration and format nicely
    return `Trễ ${duration}`;
  };

  const getStatusBadge = (status: string, isLate: boolean) => {
    if (status === "graded") {
      return (
        <Badge variant="default" className="bg-green-500">
          Đã chấm
        </Badge>
      );
    }
    if (isLate) {
      return <Badge variant="destructive">Nộp trễ</Badge>;
    }
    return <Badge variant="secondary">Chờ chấm</Badge>;
  };

  // Show loading while checking client-side state
  if (!isClient) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user has access
  if (!isTeacher) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Access Denied</h3>
            <p className="text-muted-foreground">
              You don&apos;t have permission to view this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Chấm điểm bài tập</h1>
          <p className="text-muted-foreground">
            {submissionsData?.assignment.title}
          </p>
        </div>
      </div>

      {/* Assignment Info */}
      {submissionsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng bài nộp
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {submissionsData.assignment.totalSubmissions}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Đã chấm điểm
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {submissionsData.assignment.gradedSubmissions}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Chờ chấm điểm
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {submissionsData.assignment.pendingSubmissions}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Điểm tối đa</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {submissionsData.assignment.maxScore}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="submitted">Chờ chấm</SelectItem>
                  <SelectItem value="graded">Đã chấm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchSubmissions}>
                <Filter className="mr-2 h-4 w-4" />
                Làm mới
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Submissions Table */}
      {loading ? (
        <Card>
          <CardContent className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : submissionsData?.submissions &&
        submissionsData.submissions.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow className="hover:bg-secondary/50 border-none">
                  <TableHead className="w-[25%]">Học sinh</TableHead>
                  <TableHead className="w-[15%]">Ngày nộp</TableHead>
                  <TableHead className="w-[15%]">Trạng thái</TableHead>
                  <TableHead className="w-[10%]">Điểm</TableHead>
                  <TableHead className="w-[15%]">Files</TableHead>
                  <TableHead className="w-[20%] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissionsData.submissions.map((submission) => (
                  <TableRow key={submission.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={submission.studentAvatar}
                            alt={submission.studentName}
                          />
                          <AvatarFallback>
                            {submission.studentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {submission.studentName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {submission.studentEmail}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {formatDateTime(submission.submittedAt)}
                        </span>
                        {submission.isLate && (
                          <span className="text-xs text-red-500">
                            {formatLateDuration(submission.lateDuration)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(submission.status, submission.isLate)}
                    </TableCell>
                    <TableCell>
                      {submission.grade !== null &&
                      submission.grade !== undefined ? (
                        <span className="font-medium">
                          {submission.grade}/
                          {submissionsData?.assignment.maxScore}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {submission.fileUrls.map((fileUrl, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDownloadFile(fileUrl, `file-${index + 1}`)
                            }
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        ))}
                        {submission.textContent && (
                          <Badge variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            Text
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewSubmission(submission)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleGradeSubmission(submission)}
                        >
                          <GraduationCap className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Chưa có bài nộp</h3>
            <p className="text-muted-foreground mt-1">
              Chưa có học sinh nào nộp bài tập này.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {submissionsData?.submissions &&
        submissionsData.submissions.length > 0 && (
          <Card>
            <CardContent className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Hiển thị{" "}
                {((submissionsData.pagination?.page || 1) - 1) *
                  (submissionsData.pagination?.pageSize || 10) +
                  1}{" "}
                đến{" "}
                {Math.min(
                  (submissionsData.pagination?.page || 1) *
                    (submissionsData.pagination?.pageSize || 10),
                  submissionsData.pagination?.totalCount || 0
                )}{" "}
                trong tổng số {submissionsData.pagination?.totalCount || 0} bài
                nộp
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!submissionsData.pagination?.hasPreviousPage}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>
                <span className="text-sm">
                  Trang {submissionsData.pagination?.page} /{" "}
                  {submissionsData.pagination?.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!submissionsData.pagination?.hasNextPage}
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Grading Dialog */}
      <Dialog open={showGradingDialog} onOpenChange={setShowGradingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chấm điểm bài tập</DialogTitle>
            <DialogDescription>
              Nhập điểm và nhận xét cho bài làm của{" "}
              {selectedSubmission?.studentName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="grade">
                Điểm (0 - {submissionsData?.assignment.maxScore})
              </Label>
              <Input
                id="grade"
                type="number"
                min="0"
                max={submissionsData?.assignment.maxScore}
                step="0.1"
                value={grade}
                onChange={(e) => setGrade(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Nhận xét (tùy chọn)</Label>
              <Textarea
                id="feedback"
                placeholder="Nhập nhận xét cho học sinh..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowGradingDialog(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleSubmitGrade}
              disabled={grading}
            >
              {grading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu điểm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết bài làm</DialogTitle>
            <DialogDescription>
              Bài làm của {selectedSubmission?.studentName}
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              {/* Student Info */}
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={selectedSubmission.studentAvatar}
                    alt={selectedSubmission.studentName}
                  />
                  <AvatarFallback>
                    {selectedSubmission.studentName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {selectedSubmission.studentName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedSubmission.studentEmail}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Nộp lúc: {formatDateTime(selectedSubmission.submittedAt)}
                  </div>
                </div>
              </div>

              {/* Files */}
              {selectedSubmission.fileUrls.length > 0 && (
                <div className="space-y-2">
                  <Label>Files đã nộp:</Label>
                  <div className="space-y-2">
                    {selectedSubmission.fileUrls.map((fileUrl, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <span className="text-sm">File {index + 1}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDownloadFile(fileUrl, `file-${index + 1}`)
                          }
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Tải xuống
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Text Content */}
              {selectedSubmission.textContent && (
                <div className="space-y-2">
                  <Label>Nội dung văn bản:</Label>
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <pre className="whitespace-pre-wrap text-sm">
                      {selectedSubmission.textContent}
                    </pre>
                  </div>
                </div>
              )}

              {/* Current Grade and Feedback */}
              {selectedSubmission.grade !== null &&
                selectedSubmission.grade !== undefined && (
                  <div className="space-y-2">
                    <Label>Điểm hiện tại:</Label>
                    <div className="p-4 border rounded-lg bg-green-50">
                      <div className="font-medium text-green-700">
                        {selectedSubmission.grade}/
                        {submissionsData?.assignment.maxScore}
                      </div>
                      {selectedSubmission.feedback && (
                        <div className="mt-2 text-sm text-green-600">
                          <strong>Nhận xét:</strong>{" "}
                          {selectedSubmission.feedback}
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDetailDialog(false)}
            >
              Đóng
            </Button>
            {selectedSubmission && (
              <Button
                type="button"
                onClick={() => {
                  setShowDetailDialog(false);
                  handleGradeSubmission(selectedSubmission);
                }}
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Chấm điểm
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
