import axiosInstance, { endpoints } from "@/lib/axios";
import { IApiResponse } from "@/interfaces/api-response";

// Interface definitions for Teacher Dashboard
export interface TeacherDashboardData {
  totalStudents: number;
  totalCourses: number;
  totalClasses: number;
  averageCompletionRate: number;
  averageGrade: number;
  completedAssignments: number;
  pendingAssignments: number;
  totalAssignments: number;
  courseOverviews: TeacherCourseOverview[];
  recentActivities: TeacherRecentActivity[];
  classSummaries: TeacherClassSummary[];
}

export interface TeacherCourseOverview {
  courseId: string;
  courseName: string;
  className: string;
  enrolledStudents: number;
  averageProgress: number;
  completedStudents: number;
  inProgressStudents: number;
  notStartedStudents: number;
}

export interface TeacherRecentActivity {
  activityType: string;
  description: string;
  timestamp: string;
  studentName: string;
  courseName: string;
  score?: number;
}

export interface TeacherClassSummary {
  classId: string;
  className: string;
  programName: string;
  studentCount: number;
  averageProgress: number;
  courseCount: number;
}

// API functions
export const getTeacherDashboard = async (): Promise<
  IApiResponse<TeacherDashboardData>
> => {
  try {
    const response = await axiosInstance.get(
      endpoints.teacher.get_teacher_dashboard,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
