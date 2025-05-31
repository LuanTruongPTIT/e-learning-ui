"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, FileText, User, BookOpen } from "lucide-react";
import { NotificationList } from "@/components/notifications/NotificationList";

export default function NotificationsDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔔 Demo: Hệ thống Thông báo & Xem Bài tập
          </h1>
          <p className="text-gray-600">
            Demo tính năng thông báo với khả năng click vào để xem và làm bài
            tập
          </p>
        </div>

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
                <BookOpen className="h-8 w-8 text-green-600" />
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
                <User className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Notifications List */}
          <div className="lg:col-span-3">
            <NotificationList />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ✨ Tính năng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">
                      ✅
                    </Badge>
                    <span className="text-sm">Xem thông báo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">
                      ✅
                    </Badge>
                    <span className="text-sm">Filter theo loại</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">
                      ✅
                    </Badge>
                    <span className="text-sm">Đánh dấu đã đọc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">
                      ✅
                    </Badge>
                    <span className="text-sm">Click vào bài tập</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">
                      ✅
                    </Badge>
                    <span className="text-sm">Xem chi tiết assignment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">
                      ✅
                    </Badge>
                    <span className="text-sm">Nộp bài tập</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">
                      ✅
                    </Badge>
                    <span className="text-sm">Theo dõi trạng thái</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Hướng dẫn sử dụng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <p>1. Xem danh sách thông báo</p>
                  <p>2. Click "Xem bài tập" để xem chi tiết</p>
                  <p>3. Upload file hoặc nhập nội dung</p>
                  <p>4. Click "Nộp bài tập" để submit</p>
                  <p>5. Click "Quay lại" để về danh sách</p>
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
                    <span>Notifications API:</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Assignment API:</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Submit API:</span>
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
              🎯 <strong>Workflow hoàn chỉnh:</strong> Thông báo → Click xem bài
              tập → Xem chi tiết → Nộp bài → Theo dõi trạng thái → Quay lại danh
              sách
            </p>
            <p className="text-xs mt-2">
              Demo tích hợp đầy đủ NotificationList với AssignmentView component
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
