import axiosInstance from "@/lib/axios";
import { IApiResponse } from "@/interfaces/api-response";

export interface StudentNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  assignmentId?: string;
  courseId?: string;
  courseName?: string;
  deadline?: string;
  assignmentType?: string;
  createdAt: string;
  isRead: boolean;
  isNew: boolean;
}

export interface GetStudentNotificationsResponse {
  notifications: StudentNotification[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface GetStudentNotificationsRequest {
  pageNumber?: number;
  pageSize?: number;
  notificationType?: string;
}

export const studentNotificationsApi = {
  // Get notifications for student
  getNotifications: async (
    params: GetStudentNotificationsRequest = {}
  ): Promise<IApiResponse<GetStudentNotificationsResponse>> => {
    const { pageNumber = 1, pageSize = 20, notificationType } = params;

    const queryParams = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });

    if (notificationType) {
      queryParams.append("notificationType", notificationType);
    }

    const response = await axiosInstance.get(
      `/student/notifications?${queryParams.toString()}`
    );
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<IApiResponse<void>> => {
    const response = await axiosInstance.patch(
      `/student/notifications/${notificationId}/read`
    );
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<IApiResponse<void>> => {
    const response = await axiosInstance.patch(
      `/student/notifications/mark-all-read`
    );
    return response.data;
  },
};
