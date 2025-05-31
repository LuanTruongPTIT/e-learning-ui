"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  BellOff,
  Loader2,
  RefreshCw,
  CheckCheck,
  Filter,
} from "lucide-react";
import { NotificationCard } from "@/components/dashboard/student/notification-card";
import {
  studentNotificationsApi,
  StudentNotification,
  GetStudentNotificationsResponse,
} from "@/apis/student-notifications";
import { toast } from "react-toastify";

export function NotificationList() {
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 20,
    totalCount: 0,
    hasNextPage: false,
  });

  // Fetch notifications
  const fetchNotifications = async (
    pageNumber = 1,
    notificationType?: string
  ) => {
    try {
      const isRefresh = pageNumber === 1;
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await studentNotificationsApi.getNotifications({
        pageNumber,
        pageSize: 20,
        notificationType:
          notificationType === "all" ? undefined : notificationType,
      });

      if (response.status === 200 && response.data) {
        const data = response.data as GetStudentNotificationsResponse;

        if (pageNumber === 1) {
          setNotifications(data.notifications);
        } else {
          setNotifications((prev) => [...prev, ...data.notifications]);
        }

        setPagination({
          pageNumber: data.pageNumber,
          pageSize: data.pageSize,
          totalCount: data.totalCount,
          hasNextPage: data.hasNextPage,
        });
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Không thể tải thông báo");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load more notifications
  const loadMore = () => {
    if (pagination.hasNextPage && !loading) {
      fetchNotifications(pagination.pageNumber + 1, activeTab);
    }
  };

  // Refresh notifications
  const refresh = () => {
    fetchNotifications(1, activeTab);
  };

  // Mark notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await studentNotificationsApi.markAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      toast.success("Đã đánh dấu thông báo là đã đọc");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Không thể đánh dấu thông báo");
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await studentNotificationsApi.markAllAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );

      toast.success("Đã đánh dấu tất cả thông báo là đã đọc");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Không thể đánh dấu tất cả thông báo");
    }
  };

  // Navigate to assignment
  const handleNavigateToAssignment = (assignmentId: string) => {
    // TODO: Implement navigation to assignment detail page
    console.log("Navigate to assignment:", assignmentId);
    toast.info("Chức năng xem bài tập sẽ được triển khai sau");
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setNotifications([]);
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
    fetchNotifications(1, value);
  };

  // Initial load
  useEffect(() => {
    fetchNotifications(1, "all");
  }, []);

  // Filter notifications by type
  const getFilteredNotifications = () => {
    if (activeTab === "all") return notifications;
    if (activeTab === "unread") return notifications.filter((n) => !n.isRead);
    if (activeTab === "new") return notifications.filter((n) => n.isNew);
    return notifications.filter((n) => n.type === activeTab);
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const newCount = notifications.filter((n) => n.isNew).length;

  if (loading && notifications.length === 0) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Thông báo</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount} chưa đọc
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Làm mới
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                >
                  <CheckCheck className="h-4 w-4 mr-1" />
                  Đánh dấu tất cả
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Filter className="h-3 w-3" />
            Tất cả
            <Badge variant="outline" className="text-xs ml-1">
              {notifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center gap-1">
            <Bell className="h-3 w-3" />
            Chưa đọc
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs ml-1">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="new" className="flex items-center gap-1">
            ✨ Mới
            {newCount > 0 && (
              <Badge variant="secondary" className="text-xs ml-1">
                {newCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="assignment_created">📝 Bài tập</TabsTrigger>
          <TabsTrigger value="deadline_reminder">⏰ Deadline</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BellOff className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Không có thông báo
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  {activeTab === "unread"
                    ? "Bạn đã đọc hết tất cả thông báo"
                    : activeTab === "new"
                    ? "Không có thông báo mới"
                    : "Chưa có thông báo nào"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Notifications List */}
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onNavigateToAssignment={handleNavigateToAssignment}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {pagination.hasNextPage && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Tải thêm
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
