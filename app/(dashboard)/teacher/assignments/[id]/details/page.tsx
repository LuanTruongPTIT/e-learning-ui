"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { assignmentApi, TeacherAssignmentDetails } from "@/apis/assignments";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Users,
  CheckCircle,
  Download,
  Edit,
  Trash2,
  GraduationCap,
  BarChart3,
} from "lucide-react";
import { format, isAfter } from "date-fns";
import { vi } from "date-fns/locale";
import Cookies from "js-cookie";

export default function AssignmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;

  const [isClient, setIsClient] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<TeacherAssignmentDetails | null>(
    null
  );

  useEffect(() => {
    setIsClient(true);
    const role = Cookies.get("role") || "";
    setIsTeacher(role === "Teacher" || role === "Lecturer");
  }, []);

  useEffect(() => {
    if (isClient && isTeacher && assignmentId) {
      fetchAssignmentDetails();
    }
  }, [isClient, isTeacher, assignmentId]);

  const fetchAssignmentDetails = async () => {
    try {
      setLoading(true);
      const response = await assignmentApi.getAssignmentDetailsForTeacher(
        assignmentId
      );
      if (response.status === 200) {
        setAssignment(response.data);
      } else {
        toast.error("Failed to load assignment details");
      }
    } catch (error) {
      console.error("Error fetching assignment details:", error);
      toast.error("Failed to load assignment details");
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmissions = () => {
    router.push(`/teacher/assignments/${assignmentId}/grading`);
  };

  const handleEdit = () => {
    // TODO: Navigate to edit page
    toast.info("Edit functionality coming soon");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        const response = await assignmentApi.deleteAssignment(assignmentId);
        if (response.status === 200) {
          toast.success("Assignment deleted successfully");
          router.back();
        } else {
          toast.error("Failed to delete assignment");
        }
      } catch (error) {
        console.error("Error deleting assignment:", error);
        toast.error("Failed to delete assignment");
      }
    }
  };

  const getStatusBadge = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const isActive = isAfter(deadlineDate, now);

    return (
      <Badge variant={isActive ? "default" : "destructive"}>
        {isActive ? "Active" : "Expired"}
      </Badge>
    );
  };

  const getAssignmentTypeDisplay = (type: string) => {
    switch (type) {
      case "quiz":
        return "Online Quiz";
      case "upload":
        return "File Upload";
      case "both":
        return "Quiz + Upload";
      default:
        return "Unknown";
    }
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "PPP 'at' p", { locale: vi });
  };

  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  if (!isClient || !isTeacher) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground">
            You need teacher permissions to view this page.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Assignment Not Found</h2>
          <p className="text-muted-foreground">
            The assignment you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{assignment.title}</h1>
            <p className="text-muted-foreground">
              {assignment.courseName} • {assignment.className}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleViewSubmissions}>
            <Users className="mr-2 h-4 w-4" />
            View Submissions
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignment.totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignment.submissionsCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (assignment.submissionsCount / assignment.totalStudents) * 100
              )}
              % completion
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Graded</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {assignment.gradedSubmissions}
            </div>
            <p className="text-xs text-muted-foreground">
              {assignment.pendingSubmissions} pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignment.averageGrade
                ? `${assignment.averageGrade.toFixed(1)}/${assignment.maxScore}`
                : "N/A"}
            </div>
            {assignment.averageGrade && (
              <p className="text-xs text-muted-foreground">
                {Math.round(
                  (assignment.averageGrade / assignment.maxScore) * 100
                )}
                % average
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignment Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Type
                  </label>
                  <p className="font-medium">
                    {getAssignmentTypeDisplay(assignment.assignmentType)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">
                    {getStatusBadge(assignment.deadline)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Deadline
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">
                      {formatDateTime(assignment.deadline)}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Max Score
                  </label>
                  <p className="font-medium">{assignment.maxScore} points</p>
                </div>
                {assignment.timeLimitMinutes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Time Limit
                    </label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">
                        {assignment.timeLimitMinutes} minutes
                      </p>
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Show Answers
                  </label>
                  <p className="font-medium">
                    {assignment.showAnswers ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              {assignment.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Description
                  </label>
                  <div className="mt-2 p-4 bg-muted rounded-lg">
                    <p className="whitespace-pre-wrap">
                      {assignment.description}
                    </p>
                  </div>
                </div>
              )}

              {assignment.attachmentUrls &&
                assignment.attachmentUrls.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Attachments
                    </label>
                    <div className="mt-2 space-y-2">
                      {assignment.attachmentUrls.map((url, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-muted rounded"
                        >
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="flex-1 text-sm">
                            Attachment {index + 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              downloadFile(url, `attachment-${index + 1}`)
                            }
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Submissions
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewSubmissions}
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignment.recentSubmissions.length > 0 ? (
                <div className="space-y-4">
                  {assignment.recentSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {submission.studentName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {submission.studentName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(
                            new Date(submission.submittedAt),
                            "MMM d, HH:mm"
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        {submission.grade !== null &&
                        submission.grade !== undefined ? (
                          <div className="text-sm font-medium">
                            {submission.grade}/{assignment.maxScore}
                          </div>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                        {submission.isLate && (
                          <div className="text-xs text-red-500">Late</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No submissions yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleViewSubmissions}
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Grade Submissions
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleEdit}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Assignment
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Assignment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
