"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Bell, User, BookOpen, Calendar, Clock } from "lucide-react";
import { StudentNotifications } from "@/components/student/StudentNotifications";
import { AssignmentView } from "@/components/student/AssignmentView";

export default function AssignmentViewDemo() {
  const [currentView, setCurrentView] = useState<
    "notifications" | "assignment"
  >("notifications");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("");

  // Mock assignment ID for testing
  const mockAssignmentId = "11111111-1111-1111-1111-111111111111";

  const handleViewAssignment = (assignmentId?: string) => {
    setSelectedAssignmentId(assignmentId || mockAssignmentId);
    setCurrentView("assignment");
  };

  const handleBackToNotifications = () => {
    setCurrentView("notifications");
    setSelectedAssignmentId("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Demo: Hệ thống Xem Bài tập & Làm bài
          </h1>
          <p className="text-gray-600">
            Demo tính năng sinh viên xem thông báo, click vào bài tập và làm bài
          </p>
        </div>

        {/* Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant={
                  currentView === "notifications" ? "default" : "outline"
                }
                onClick={() => setCurrentView("notifications")}
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                Thông báo
              </Button>

              <Button
                variant={currentView === "assignment" ? "default" : "outline"}
                onClick={() => handleViewAssignment()}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Xem bài tập mẫu
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Thông báo mới
                  </p>
                  <p className="text-2xl font-bold text-blue-600">3</p>
                </div>
                <Bell className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Bài tập chưa làm
                  </p>
                  <p className="text-2xl font-bold text-orange-600">2</p>
                </div>
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Bài đã nộp
                  </p>
                  <p className="text-2xl font-bold text-green-600">5</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Điểm trung bình
                  </p>
                  <p className="text-2xl font-bold text-purple-600">8.5</p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main View */}
          <div className="lg:col-span-3">
            {currentView === "notifications" ? (
              <StudentNotifications />
            ) : (
              <AssignmentView
                assignmentId={selectedAssignmentId}
                onBack={handleBackToNotifications}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Hành động nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setCurrentView("notifications")}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Xem thông báo
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleViewAssignment()}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Làm bài tập
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Xem lịch học
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Hoạt động gần đây
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Bài tập mới</p>
                      <p className="text-xs text-gray-600">JavaScript cơ bản</p>
                      <p className="text-xs text-gray-500">2 giờ trước</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-green-600 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Đã nộp bài</p>
                      <p className="text-xs text-gray-600">HTML/CSS Quiz</p>
                      <p className="text-xs text-gray-500">1 ngày trước</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <BookOpen className="h-4 w-4 text-purple-600 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Điểm mới</p>
                      <p className="text-xs text-gray-600">
                        Dự án cuối khóa: 9.0
                      </p>
                      <p className="text-xs text-gray-500">2 ngày trước</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">API Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Backend:</span>
                    <Badge variant="default">Running</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Database:</span>
                    <Badge variant="default">Connected</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Notifications:</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              🎯 <strong>Tính năng đã hoàn thành:</strong> Xem thông báo, click
              vào bài tập, xem chi tiết assignment, nộp bài, theo dõi trạng thái
              submission
            </p>
            <p className="text-xs mt-2">
              Demo hoàn chỉnh workflow từ notification đến assignment submission
              với real-time updates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
