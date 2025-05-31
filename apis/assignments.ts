import axiosInstance from "@/lib/axios";
import { IApiResponse } from "@/interfaces/api-response";

// Assignment Types
export interface Assignment {
  id: string;
  teaching_assign_course_id: string;
  title: string;
  description?: string;
  deadline: string;
  assignment_type: "upload" | "quiz" | "both";
  show_answers: boolean;
  time_limit_minutes?: number;
  attachment_urls?: string[];
  max_score: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface CreateAssignmentRequest {
  course_id: string;
  title: string;
  description?: string;
  deadline: string;
  assignment_type: "upload" | "quiz" | "both";
  show_answers: boolean;
  time_limit?: number;
  attachments?: string[];
  max_score: number;
  is_published: boolean;
}

export interface CreateAssignmentResponse {
  assignment_id: string;
  message: string;
}

// Recent Activity Types
export interface RecentActivity {
  id: string;
  user_id: string;
  action: string;
  target_type: string;
  target_id: string;
  target_title?: string;
  course_id?: string;
  course_name?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  time_ago: string;
}

export interface GetRecentActivitiesResponse {
  activities: RecentActivity[];
  total_count: number;
  has_more: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  target_type?: string;
  target_id?: string;
  is_read: boolean;
  priority: string;
  created_at: string;
  read_at?: string;
  time_ago: string;
}

export interface GetNotificationsResponse {
  notifications: Notification[];
  total_count: number;
  unread_count: number;
  has_more: boolean;
}

// Assignment API Functions
export const assignmentApi = {
  // Create Assignment
  createAssignment: async (
    data: CreateAssignmentRequest
  ): Promise<IApiResponse<CreateAssignmentResponse>> => {
    const response = await axiosInstance.post("/program/assignments", data);
    return response.data;
  },

  // Get Assignments by Course
  getAssignmentsByCourse: async (
    courseId: string
  ): Promise<IApiResponse<Assignment[]>> => {
    const response = await axiosInstance.get(
      `/program/courses/${courseId}/assignments`
    );
    return response.data;
  },

  // Get Assignment Details
  getAssignment: async (
    assignmentId: string
  ): Promise<IApiResponse<Assignment>> => {
    const response = await axiosInstance.get(
      `/program/assignments/${assignmentId}`
    );
    return response.data;
  },

  // Update Assignment
  updateAssignment: async (
    assignmentId: string,
    data: Partial<CreateAssignmentRequest>
  ): Promise<IApiResponse<boolean>> => {
    const response = await axiosInstance.put(
      `/program/assignments/${assignmentId}`,
      data
    );
    return response.data;
  },

  // Delete Assignment
  deleteAssignment: async (
    assignmentId: string
  ): Promise<IApiResponse<boolean>> => {
    const response = await axiosInstance.delete(
      `/program/assignments/${assignmentId}`
    );
    return response.data;
  },

  // Student APIs
  // Get Assignment Details for Student
  getAssignmentDetailsForStudent: async (
    assignmentId: string
  ): Promise<IApiResponse<StudentAssignmentDetails>> => {
    const response = await axiosInstance.get(
      `/student/assignments/${assignmentId}`
    );
    return response.data;
  },

  // Submit Assignment
  submitAssignment: async (
    assignmentId: string,
    data: SubmitAssignmentRequest
  ): Promise<IApiResponse<SubmitAssignmentResponse>> => {
    const response = await axiosInstance.post(
      `/student/assignments/${assignmentId}/submit`,
      data
    );
    return response.data;
  },
};

// Recent Activities API Functions
export const recentActivitiesApi = {
  // Get Recent Activities
  getRecentActivities: async (
    userId?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<IApiResponse<GetRecentActivitiesResponse>> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (userId) {
      params.append("userId", userId);
    }

    const response = await axiosInstance.get(
      `/program/recent-activities?${params}`
    );
    return response.data;
  },
};

// Notifications API Functions
export const notificationsApi = {
  // Get Notifications
  getNotifications: async (
    userId?: string,
    isRead?: boolean,
    limit: number = 20,
    offset: number = 0
  ): Promise<IApiResponse<GetNotificationsResponse>> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (userId) {
      params.append("userId", userId);
    }

    if (isRead !== undefined) {
      params.append("isRead", isRead.toString());
    }

    const response = await axiosInstance.get(
      `/program/notifications?${params}`
    );
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (
    notificationId: string
  ): Promise<IApiResponse<boolean>> => {
    const response = await axiosInstance.patch(
      `/program/notifications/${notificationId}/read`
    );
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (userId?: string): Promise<IApiResponse<boolean>> => {
    const params = userId ? `?userId=${userId}` : "";
    const response = await axiosInstance.patch(
      `/program/notifications/mark-all-read${params}`
    );
    return response.data;
  },
};

// Activity Action Constants
export const ActivityActions = {
  ASSIGNMENT_CREATED: "assignment_created",
  ASSIGNMENT_SUBMITTED: "assignment_submitted",
  ASSIGNMENT_GRADED: "assignment_graded",
  QUIZ_COMPLETED: "quiz_completed",
  QUIZ_STARTED: "quiz_started",
  LECTURE_COMPLETED: "lecture_completed",
  COURSE_ENROLLED: "course_enrolled",
  COURSE_COMPLETED: "course_completed",
  NOTIFICATION_RECEIVED: "notification_received",
} as const;

// Target Types Constants
export const TargetTypes = {
  ASSIGNMENT: "assignment",
  QUIZ: "quiz",
  LECTURE: "lecture",
  COURSE: "course",
  NOTIFICATION: "notification",
} as const;

// Student Assignment Types
export interface StudentAssignmentDetails {
  id: string;
  title: string;
  description: string;
  deadline: string;
  assignmentType: string;
  showAnswers: boolean;
  timeLimitMinutes?: number;
  attachmentUrls?: string[];
  maxScore: number;
  isPublished: boolean;
  createdAt: string;
  courseName: string;
  teacherName: string;
  hasSubmission: boolean;
  submission?: AssignmentSubmissionInfo;
}

export interface AssignmentSubmissionInfo {
  id: string;
  submissionType: string;
  fileUrls?: string[];
  submittedAt: string;
  grade?: number;
  feedback?: string;
  status: string;
}

export interface SubmitAssignmentRequest {
  submissionType: string;
  fileUrls?: string[];
  textContent?: string;
  quizAnswers?: Record<string, unknown>;
}

export interface SubmitAssignmentResponse {
  submission_id: string;
  submitted_at: string;
}

// Download assignment attachment file
export const downloadAssignmentFile = async (
  assignmentId: string,
  fileUrl: string
): Promise<Blob> => {
  const response = await axiosInstance.get(
    `/student/assignments/${assignmentId}/download`,
    {
      params: { fileUrl },
      responseType: "blob",
    }
  );

  return response.data;
};

// Helper function to trigger file download in browser
export const triggerFileDownload = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
