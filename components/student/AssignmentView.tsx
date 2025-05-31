"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Calendar,
  Clock,
  User,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  Timer,
} from "lucide-react";
import {
  assignmentApi,
  StudentAssignmentDetails,
  SubmitAssignmentRequest,
  downloadAssignmentFile,
  triggerFileDownload,
} from "@/apis/assignments";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { UploadButton } from "@/utils/uploadthing";

interface AssignmentViewProps {
  assignmentId: string;
  onBack?: () => void;
}

export function AssignmentView({ assignmentId, onBack }: AssignmentViewProps) {
  const [assignment, setAssignment] = useState<StudentAssignmentDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(
    new Set()
  );
  const [submissionData, setSubmissionData] = useState<SubmitAssignmentRequest>(
    {
      submissionType: "file",
      fileUrls: [],
      textContent: "",
    }
  );

  useEffect(() => {
    fetchAssignmentDetails();
  }, [assignmentId]);

  const fetchAssignmentDetails = async () => {
    try {
      setIsLoading(true);
      const response = await assignmentApi.getAssignmentDetailsForStudent(
        assignmentId
      );

      if (response.status === 200) {
        setAssignment(response.data);
        // Set default submission type based on assignment type
        setSubmissionData((prev) => ({
          ...prev,
          submissionType:
            response.data.assignmentType === "quiz" ? "quiz" : "file",
        }));
      } else {
        toast.error("Failed to load assignment details");
      }
    } catch (error) {
      console.error("Error fetching assignment:", error);
      toast.error("Failed to load assignment details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!assignment) return;

    // Validate submission
    if (
      submissionData.submissionType === "file" &&
      (!submissionData.fileUrls || submissionData.fileUrls.length === 0)
    ) {
      toast.error("Please upload at least one file");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await assignmentApi.submitAssignment(
        assignmentId,
        submissionData
      );

      if (response.status === 200) {
        toast.success(response.message || "Assignment submitted successfully");
        fetchAssignmentDetails(); // Refresh to show submission
      } else {
        toast.error("Failed to submit assignment");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast.error("Failed to submit assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadComplete = (res: Array<{ url: string; name: string }>) => {
    if (res && res.length > 0) {
      const newFileUrls = res.map((file) => file.url);
      setSubmissionData((prev) => ({
        ...prev,
        fileUrls: [...(prev.fileUrls || []), ...newFileUrls],
      }));
      toast.success(`${res.length} file(s) uploaded successfully`);
    }
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload error:", error);
    toast.error("Failed to upload file");
  };

  const removeFile = (index: number) => {
    setSubmissionData((prev) => ({
      ...prev,
      fileUrls: prev.fileUrls?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleDownloadFile = async (fileUrl: string) => {
    if (!assignment) return;

    try {
      setDownloadingFiles((prev) => new Set(prev).add(fileUrl));

      const blob = await downloadAssignmentFile(assignment.id, fileUrl);

      // Extract filename from URL
      const fileName = fileUrl.split("/").pop() || "attachment";

      triggerFileDownload(blob, fileName);

      toast.success("File downloaded successfully");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    } finally {
      setDownloadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileUrl);
        return newSet;
      });
    }
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();

    if (diffTime <= 0) return "Overdue";

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) return `${diffDays} ngày ${diffHours} giờ`;
    if (diffHours > 0) return `${diffHours} giờ ${diffMinutes} phút`;
    return `${diffMinutes} phút`;
  };

  const getAssignmentTypeColor = (type: string) => {
    switch (type) {
      case "upload":
        return "bg-blue-100 text-blue-800";
      case "quiz":
        return "bg-purple-100 text-purple-800";
      case "both":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAssignmentTypeLabel = (type: string) => {
    switch (type) {
      case "upload":
        return "Nộp file";
      case "quiz":
        return "Trắc nghiệm";
      case "both":
        return "File + Trắc nghiệm";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <p className="text-gray-600">Assignment not found</p>
        {onBack && (
          <Button onClick={onBack} className="mt-4">
            Go Back
          </Button>
        )}
      </div>
    );
  }

  const overdue = isOverdue(assignment.deadline);
  const canSubmit = !overdue && !assignment.hasSubmission;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {assignment.title}
          </h1>
          <p className="text-gray-600">{assignment.courseName}</p>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            ← Quay lại
          </Button>
        )}
      </div>

      {/* Assignment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Thông tin bài tập
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Giảng viên:</span>
              <span className="font-medium">{assignment.teacherName}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Hạn nộp:</span>
              <span
                className={`font-medium ${
                  overdue ? "text-red-600" : "text-gray-900"
                }`}
              >
                {format(new Date(assignment.deadline), "dd/MM/yyyy HH:mm", {
                  locale: vi,
                })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Thời gian còn lại:</span>
              <span
                className={`font-medium ${
                  overdue ? "text-red-600" : "text-green-600"
                }`}
              >
                {getTimeRemaining(assignment.deadline)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Loại bài tập:</span>
              <Badge
                className={getAssignmentTypeColor(assignment.assignmentType)}
              >
                {getAssignmentTypeLabel(assignment.assignmentType)}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Điểm tối đa:</span>
              <span className="font-medium">{assignment.maxScore} điểm</span>
            </div>

            {assignment.timeLimitMinutes && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Thời gian làm bài:
                </span>
                <span className="font-medium">
                  {assignment.timeLimitMinutes} phút
                </span>
              </div>
            )}
          </div>

          {assignment.description && (
            <div>
              <h3 className="font-medium mb-2">Mô tả:</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {assignment.description}
              </p>
            </div>
          )}

          {assignment.attachmentUrls &&
            assignment.attachmentUrls.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Tài liệu đính kèm:</h3>
                <div className="space-y-2">
                  {assignment.attachmentUrls.map((url, index) => {
                    const isDownloading = downloadingFiles.has(url);
                    const fileName =
                      url.split("/").pop() || `attachment-${index + 1}`;

                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                      >
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm flex-1" title={url}>
                          {fileName}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadFile(url)}
                          disabled={isDownloading}
                          className="flex items-center gap-1"
                        >
                          {isDownloading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          {isDownloading ? "Downloading..." : "Download"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Submission Status */}
      {assignment.hasSubmission && assignment.submission && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Bài nộp của bạn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Thời gian nộp:</span>
                <p className="font-medium">
                  {format(
                    new Date(assignment.submission.submittedAt),
                    "dd/MM/yyyy HH:mm",
                    { locale: vi }
                  )}
                </p>
              </div>

              <div>
                <span className="text-sm text-gray-600">Trạng thái:</span>
                <Badge
                  variant={
                    assignment.submission.status === "graded"
                      ? "default"
                      : "secondary"
                  }
                >
                  {assignment.submission.status === "graded"
                    ? "Đã chấm điểm"
                    : "Đã nộp"}
                </Badge>
              </div>

              {assignment.submission.grade !== undefined && (
                <div>
                  <span className="text-sm text-gray-600">Điểm:</span>
                  <p className="font-medium text-lg">
                    {assignment.submission.grade}/{assignment.maxScore}
                  </p>
                </div>
              )}
            </div>

            {assignment.submission.fileUrls &&
              assignment.submission.fileUrls.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">File đã nộp:</h3>
                  <div className="space-y-2">
                    {assignment.submission.fileUrls.map((url, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                      >
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{url}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {assignment.submission.feedback && (
              <div>
                <h3 className="font-medium mb-2">Nhận xét của giảng viên:</h3>
                <p className="text-gray-700 p-3 bg-gray-50 rounded">
                  {assignment.submission.feedback}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Submission Form */}
      {canSubmit && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Nộp bài tập
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {assignment.assignmentType === "upload" ||
            assignment.assignmentType === "both" ? (
              <div>
                <Label htmlFor="file-upload">Tải lên file</Label>
                <div className="mt-2">
                  <UploadButton
                    onUploadComplete={handleUploadComplete}
                    onUploadError={handleUploadError}
                  />
                  {submissionData.fileUrls &&
                    submissionData.fileUrls.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <p className="text-sm text-gray-600">File đã chọn:</p>
                        {submissionData.fileUrls.map((url, index) => {
                          const fileName =
                            url.split("/").pop() || `file-${index + 1}`;
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                <span
                                  className="text-sm truncate"
                                  title={fileName}
                                >
                                  {fileName}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                              >
                                ×
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                </div>
              </div>
            ) : null}

            <div>
              <Label htmlFor="text-content">Nội dung văn bản (tùy chọn)</Label>
              <Textarea
                id="text-content"
                placeholder="Nhập nội dung bài làm hoặc ghi chú..."
                value={submissionData.textContent}
                onChange={(e) =>
                  setSubmissionData((prev) => ({
                    ...prev,
                    textContent: e.target.value,
                  }))
                }
                rows={6}
                className="mt-2"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Đang nộp..." : "Nộp bài tập"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overdue Message */}
      {overdue && !assignment.hasSubmission && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Bài tập đã quá hạn nộp</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
