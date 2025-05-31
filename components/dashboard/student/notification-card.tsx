"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  FileText,
  FileQuestion,
  FolderKanban,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { StudentNotification } from "@/apis/student-notifications";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface NotificationCardProps {
  notification: StudentNotification;
  onMarkAsRead?: (notificationId: string) => void;
  onNavigateToAssignment?: (assignmentId: string) => void;
}

export function NotificationCard({
  notification,
  onMarkAsRead,
  onNavigateToAssignment,
}: NotificationCardProps) {
  // Function to get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "assignment_created":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "quiz_created":
        return <FileQuestion className="h-5 w-5 text-yellow-500" />;
      case "deadline_reminder":
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to get assignment type icon
  const getAssignmentTypeIcon = (assignmentType?: string) => {
    switch (assignmentType) {
      case "upload":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "quiz":
        return <FileQuestion className="h-4 w-4 text-yellow-500" />;
      case "both":
        return <FolderKanban className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  // Format time ago
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: vi,
  });

  // Format deadline if available
  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;

    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return { text: "Quá hạn", variant: "destructive" as const };
    } else if (diffDays <= 1) {
      return { text: "Hôm nay", variant: "destructive" as const };
    } else if (diffDays <= 3) {
      return { text: `${diffDays} ngày`, variant: "warning" as const };
    } else {
      return { text: `${diffDays} ngày`, variant: "outline" as const };
    }
  };

  const deadlineBadge = formatDeadline(notification.deadline);

  const handleMarkAsRead = () => {
    if (onMarkAsRead && !notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleNavigateToAssignment = () => {
    if (onNavigateToAssignment && notification.assignmentId) {
      onNavigateToAssignment(notification.assignmentId);
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 transition-colors hover:bg-muted/50 ${
        !notification.isRead ? "bg-blue-50/50 border-blue-200" : "bg-white"
      }`}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-grow space-y-2">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm">{notification.title}</h4>
              {notification.isNew && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-blue-100 text-blue-700 border-blue-200"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Mới
                </Badge>
              )}
              {notification.isRead && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {timeAgo}
            </span>
          </div>

          {/* Message */}
          <p className="text-sm text-muted-foreground">
            {notification.message}
          </p>

          {/* Course and Assignment Info */}
          {notification.courseName && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium">{notification.courseName}</span>
              {notification.assignmentType && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    {getAssignmentTypeIcon(notification.assignmentType)}
                    <span className="capitalize">
                      {notification.assignmentType}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Deadline */}
          {notification.deadline && deadlineBadge && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Deadline:{" "}
                {new Date(notification.deadline).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <Badge variant={deadlineBadge.variant} className="text-xs">
                {deadlineBadge.text}
              </Badge>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            {notification.assignmentId && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={handleNavigateToAssignment}
              >
                Xem bài tập
              </Button>
            )}
            {!notification.isRead && (
              <Button
                size="sm"
                variant="ghost"
                className="text-xs h-7"
                onClick={handleMarkAsRead}
              >
                Đánh dấu đã đọc
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
