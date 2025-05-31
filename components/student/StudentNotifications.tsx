"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  FileText,
  Calendar,
  Clock,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  studentNotificationsApi,
  StudentNotification,
} from "@/apis/student-notifications";
import { AssignmentView } from "./AssignmentView";
import { toast } from "react-hot-toast";

interface StudentNotificationsProps {
  pageSize?: number;
}

export function StudentNotifications({
  pageSize = 20,
}: StudentNotificationsProps) {
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<
    string | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      fetchNotifications();
    }
  }, [currentPage, isClient]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await studentNotificationsApi.getNotifications({
        pageSize,
        pageNumber: currentPage,
      });

      if (response.status === 200) {
        const newNotifications = response.data.notifications || response.data;
        if (currentPage === 1) {
          setNotifications(newNotifications);
        } else {
          setNotifications((prev) => [...prev, ...newNotifications]);
        }
        setHasMore(
          response.data.hasNextPage || newNotifications.length === pageSize
        );
      } else {
        toast.error("Failed to load notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = (notification: StudentNotification) => {
    if (
      notification.type === "assignment_created" &&
      notification.assignmentId
    ) {
      setSelectedAssignmentId(notification.assignmentId);
    }
  };

  const handleBackToNotifications = () => {
    setSelectedAssignmentId(null);
  };

  const loadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "assignment_created":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "assignment_due":
        return <Clock className="h-5 w-5 text-orange-600" />;
      case "grade_released":
        return <Calendar className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string, isNew: boolean) => {
    if (isNew) {
      return "border-l-4 border-l-blue-500 bg-blue-50";
    }
    return "border-l-4 border-l-gray-200";
  };

  const formatTimeAgo = (dateString: string) => {
    if (!isClient) return ""; // Prevent hydration mismatch

    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;

    // Use simple date formatting to avoid locale issues
    return date.toLocaleDateString("vi-VN");
  };

  const formatDeadline = (dateString: string) => {
    if (!isClient) return ""; // Prevent hydration mismatch

    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show loading while client is mounting
  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Thông báo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // If viewing an assignment, show the assignment view
  if (selectedAssignmentId) {
    return (
      <AssignmentView
        assignmentId={selectedAssignmentId}
        onBack={handleBackToNotifications}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Thông báo ({notifications.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && currentPage === 1 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Không có thông báo nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${getNotificationColor(
                  notification.type,
                  notification.isNew
                )}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>

                        {notification.courseName && (
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {notification.courseName}
                            </Badge>
                            {notification.deadline && (
                              <span className="text-xs text-gray-500">
                                Hạn: {formatDeadline(notification.deadline)}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          {notification.isNew && (
                            <Badge variant="secondary" className="text-xs">
                              Mới
                            </Badge>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    "Tải thêm"
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
