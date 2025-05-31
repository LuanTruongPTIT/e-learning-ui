"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  BookOpen,
  Download,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { StudentNotifications } from "@/components/student/StudentNotifications";
import { AssignmentView } from "@/components/student/AssignmentView";

export default function DemoCompletePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<
    string | null
  >(null);
  const [showAssignmentView, setShowAssignmentView] = useState(false);

  // Sample data
  const stats = {
    totalNotifications: 5,
    unreadNotifications: 3,
    totalAssignments: 8,
    pendingAssignments: 4,
    completedAssignments: 4,
    overdueAssignments: 1,
  };

  const sampleAssignments = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      title: "Assignment with File Downloads",
      description: "This assignment has downloadable files for testing",
      deadline: "2024-12-31T23:59:59Z",
      status: "pending",
      hasFiles: true,
      fileCount: 2,
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      title: "Math Quiz Assignment",
      description: "Complete the math quiz before deadline",
      deadline: "2024-12-25T23:59:59Z",
      status: "completed",
      hasFiles: false,
      fileCount: 0,
    },
    {
      id: "33333333-3333-3333-3333-333333333333",
      title: "Essay Writing Task",
      description: "Write a 1000-word essay on the given topic",
      deadline: "2024-12-20T23:59:59Z",
      status: "overdue",
      hasFiles: true,
      fileCount: 1,
    },
  ];

  const handleViewAssignment = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    setShowAssignmentView(true);
  };

  const handleBackToList = () => {
    setShowAssignmentView(false);
    setSelectedAssignmentId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDeadline = (deadline: string) => {
    return new Date(deadline).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (showAssignmentView && selectedAssignmentId) {
    return (
      <div className="container mx-auto py-6">
        <AssignmentView
          assignmentId={selectedAssignmentId}
          onBack={handleBackToList}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Student Dashboard Demo</h1>
        <p className="text-muted-foreground">
          Demo hoàn chỉnh cho workflow: Notifications → Assignment View → File
          Download
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNotifications}</div>
            <p className="text-xs text-muted-foreground">
              {stats.unreadNotifications} unread
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Assignments
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssignments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingAssignments} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completedAssignments}
            </div>
            <p className="text-xs text-muted-foreground">
              {(
                (stats.completedAssignments / stats.totalAssignments) *
                100
              ).toFixed(0)}
              % completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.overdueAssignments}
            </div>
            <p className="text-xs text-muted-foreground">
              Need immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  View Notifications ({stats.unreadNotifications} unread)
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => setActiveTab("assignments")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Assignments ({stats.pendingAssignments} pending)
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() =>
                    handleViewAssignment("11111111-1111-1111-1111-111111111111")
                  }
                >
                  <Download className="mr-2 h-4 w-4" />
                  Test File Download
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                  <Bell className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      New assignment created
                    </div>
                    <div className="text-xs text-gray-500">
                      Assignment with File Downloads
                    </div>
                  </div>
                  <Badge variant="secondary">New</Badge>
                </div>
                <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      Assignment completed
                    </div>
                    <div className="text-xs text-gray-500">
                      Math Quiz Assignment
                    </div>
                  </div>
                  <Badge variant="secondary">Completed</Badge>
                </div>
                <div className="flex items-center gap-3 p-2 bg-red-50 rounded">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      Assignment overdue
                    </div>
                    <div className="text-xs text-gray-500">
                      Essay Writing Task
                    </div>
                  </div>
                  <Badge variant="destructive">Overdue</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Student Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StudentNotifications />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                My Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(assignment.status)}
                        <Badge className={getStatusColor(assignment.status)}>
                          {assignment.status}
                        </Badge>
                      </div>
                      <div>
                        <div className="font-medium">{assignment.title}</div>
                        <div className="text-sm text-gray-500">
                          {assignment.description}
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {formatDeadline(assignment.deadline)}
                          </div>
                          {assignment.hasFiles && (
                            <div className="flex items-center gap-1 text-xs text-blue-600">
                              <FileText className="h-3 w-3" />
                              {assignment.fileCount} files
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleViewAssignment(assignment.id)}
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Demo Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm space-y-1">
            <p>
              <strong>1. Overview Tab:</strong> Xem tổng quan và quick actions
            </p>
            <p>
              <strong>2. Notifications Tab:</strong> Xem thông báo assignments
              mới
            </p>
            <p>
              <strong>3. Assignments Tab:</strong> Xem danh sách assignments và
              click &quot;View Details&quot;
            </p>
            <p>
              <strong>4. Assignment View:</strong> Xem chi tiết assignment và
              download files
            </p>
            <p>
              <strong>5. File Download:</strong> Test download các file
              attachments
            </p>
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded">
            <p className="text-sm text-green-800">
              <strong>✅ Workflow hoàn chỉnh:</strong> Teacher tạo assignment →
              Student nhận notification → Click xem assignment → Download files
              → Submit bài
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
