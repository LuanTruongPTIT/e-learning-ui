"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import {
  GraduationCap,
  Users,
  CheckCircle,
  AlertCircle,
  Star,
  Eye,
  Download,
  FileText,
  Loader2,
} from "lucide-react";
import Link from "next/link";

// Mock data
const mockAssignment = {
  id: "1",
  title: "Bài tập lập trình Java - OOP",
  description: "Viết chương trình quản lý thư viện sử dụng OOP",
  deadline: "2024-01-15T23:59:59",
  maxScore: 10,
  totalSubmissions: 15,
  gradedSubmissions: 8,
  pendingSubmissions: 7,
};

interface MockSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string | null;
  submissionType: string;
  fileUrls: string[];
  textContent: string | null;
  submittedAt: string;
  grade: number | null;
  feedback: string | null;
  status: string;
  isLate: boolean;
  lateDuration: string | null;
}

const mockSubmissions: MockSubmission[] = [
  {
    id: "1",
    studentId: "s1",
    studentName: "Nguyễn Văn An",
    studentEmail: "an@student.edu.vn",
    studentAvatar: null,
    submissionType: "file",
    fileUrls: ["file1.java", "file2.java"],
    textContent: null,
    submittedAt: "2024-01-14T10:30:00",
    grade: 8.5,
    feedback: "Bài làm tốt, logic rõ ràng. Cần cải thiện comment code.",
    status: "graded",
    isLate: false,
    lateDuration: null,
  },
  {
    id: "2",
    studentId: "s2",
    studentName: "Trần Thị Bình",
    studentEmail: "binh@student.edu.vn",
    studentAvatar: null,
    submissionType: "file",
    fileUrls: ["assignment.zip"],
    textContent: "Giải thích thuật toán: Sử dụng design pattern Observer...",
    submittedAt: "2024-01-16T08:15:00",
    grade: null,
    feedback: null,
    status: "submitted",
    isLate: true,
    lateDuration: "8 giờ 16 phút",
  },
  {
    id: "3",
    studentId: "s3",
    studentName: "Lê Minh Cường",
    studentEmail: "cuong@student.edu.vn",
    studentAvatar: null,
    submissionType: "file",
    fileUrls: ["Library.java", "Book.java", "Member.java"],
    textContent: null,
    submittedAt: "2024-01-15T20:45:00",
    grade: null,
    feedback: null,
    status: "submitted",
    isLate: false,
    lateDuration: null,
  },
];

export default function DemoGradingPage() {
  const [submissions, setSubmissions] =
    useState<MockSubmission[]>(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] =
    useState<MockSubmission | null>(null);
  const [showGradingDialog, setShowGradingDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [grading, setGrading] = useState(false);
  const [grade, setGrade] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  const handleViewSubmission = (submission: MockSubmission) => {
    setSelectedSubmission(submission);
    setShowDetailDialog(true);
  };

  const handleGradeSubmission = (submission: MockSubmission) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade || 0);
    setFeedback(submission.feedback || "");
    setShowGradingDialog(true);
  };

  const handleSubmitGrade = async () => {
    if (!selectedSubmission) return;

    if (grade < 0 || grade > mockAssignment.maxScore) {
      toast.error(`Điểm phải từ 0 đến ${mockAssignment.maxScore}`);
      return;
    }

    try {
      setGrading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update submission
      const updatedSubmissions = submissions.map((sub) =>
        sub.id === selectedSubmission.id
          ? {
              ...sub,
              grade,
              feedback: feedback.trim() || null,
              status: "graded",
            }
          : sub
      );
      setSubmissions(updatedSubmissions);

      toast.success("Chấm điểm thành công!");
      setShowGradingDialog(false);
    } catch {
      toast.error("Có lỗi xảy ra khi chấm điểm");
    } finally {
      setGrading(false);
    }
  };

  const handleDownloadFile = (fileName: string) => {
    toast.info(`Đang tải xuống: ${fileName}`);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
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

  const gradedCount = submissions.filter((s) => s.status === "graded").length;
  const pendingCount = submissions.filter(
    (s) => s.status === "submitted"
  ).length;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Demo - Chấm điểm bài tập</h1>
        <p className="text-muted-foreground">{mockAssignment.title}</p>
      </div>

      {/* Assignment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng bài nộp</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã chấm điểm</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {gradedCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ chấm điểm</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm tối đa</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAssignment.maxScore}</div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách bài nộp</CardTitle>
        </CardHeader>
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
              {submissions.map((submission) => (
                <TableRow key={submission.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={submission.studentAvatar || undefined}
                          alt={submission.studentName}
                        />
                        <AvatarFallback>
                          {submission.studentName
                            .split(" ")
                            .map((n: string) => n[0])
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
                          Trễ {submission.lateDuration}
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
                        {submission.grade}/{mockAssignment.maxScore}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {submission.fileUrls.map((fileName, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadFile(fileName)}
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
                Điểm (0 - {mockAssignment.maxScore})
              </Label>
              <Input
                id="grade"
                type="number"
                min="0"
                max={mockAssignment.maxScore}
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
                    src={selectedSubmission.studentAvatar || undefined}
                    alt={selectedSubmission.studentName}
                  />
                  <AvatarFallback>
                    {selectedSubmission.studentName
                      .split(" ")
                      .map((n: string) => n[0])
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
                    {selectedSubmission.fileUrls.map(
                      (fileName: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <span className="text-sm">{fileName}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadFile(fileName)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Tải xuống
                          </Button>
                        </div>
                      )
                    )}
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
                        {selectedSubmission.grade}/{mockAssignment.maxScore}
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

      {/* API Info */}
      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn truy cập trang chấm điểm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              Cách truy cập trang chấm điểm:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
              <li>Đăng nhập với tài khoản Teacher/Lecturer</li>
              <li>
                Vào menu <strong>&quot;Courses&quot;</strong> từ sidebar
              </li>
              <li>Chọn một khóa học bạn đang giảng dạy</li>
              <li>
                Click tab <strong>&quot;Assignments&quot;</strong>
              </li>
              <li>Tìm bài tập cần chấm điểm</li>
              <li>
                Click vào icon <strong>&quot;⋮&quot;</strong> (More options)
              </li>
              <li>
                Chọn <strong>&quot;Chấm điểm&quot;</strong> từ dropdown menu
              </li>
            </ol>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">
              URL trực tiếp:
            </h4>
            <code className="text-sm bg-white p-2 rounded border block">
              /teacher/assignments/[assignment-id]/grading
            </code>
            <p className="text-sm text-green-600 mt-2">
              Thay [assignment-id] bằng ID thực của bài tập
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-sm">
              <strong>API Endpoints:</strong>
            </div>
            <div className="text-sm">
              <strong>GET</strong> /teacher/assignments/{"{assignmentId}"}
              /submissions
            </div>
            <div className="text-sm">
              <strong>POST</strong> /teacher/submissions/{"{submissionId}"}
              /grade
            </div>
            <div className="text-xs text-muted-foreground">
              Đây là demo page. Trong thực tế sẽ gọi API thật.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Grading Button */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Test Tính Năng Chấm Điểm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Click button bên dưới để test trang chấm điểm với assignment ID
              mẫu
            </p>
            <Link href="/teacher/assignments/11111111-1111-1111-1111-111111111111/grading">
              <Button size="lg" className="w-full max-w-md">
                <GraduationCap className="mr-2 h-5 w-5" />
                Vào Trang Chấm Điểm (Demo)
              </Button>
            </Link>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">
              📝 Hướng dẫn sử dụng thực tế:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
              <li>Đăng nhập với tài khoản Teacher</li>
              <li>Vào menu Courses từ sidebar</li>
              <li>Chọn khóa học → tab Assignments</li>
              <li>Click icon ⋮ → Chấm điểm</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
