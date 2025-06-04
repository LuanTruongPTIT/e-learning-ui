import axiosInstance, { endpoints } from "@/lib/axios";
import { EnrolledCourse } from "./student-courses";
import { IApiResponse } from "@/interfaces/api-response";

export interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  notStartedCourses: number;
  overallProgress: number;
}

export interface StudyTimeData {
  day: string;
  hours: number;
}

export interface SubjectDistribution {
  name: string;
  value: number;
  color: string;
}

export interface ProgressData {
  month: string;
  progress: number;
}

export interface Activity {
  id: string;
  type: string;
  course: string;
  title: string;
  timestamp: string;
  score?: number;
}

export interface Deadline {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  type: string;
  isNew?: boolean;
  maxScore?: number;
  instructorId?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentCourses: EnrolledCourse[];
  upcomingDeadlines: Deadline[];
  recentActivities: Activity[];
  progressData: ProgressData[];
  weeklyStudyData: StudyTimeData[];
  subjectDistribution: SubjectDistribution[];
}

// Get all dashboard data in one call
export const getStudentDashboardData = async (): Promise<
  IApiResponse<DashboardData>
> => {
  const response = await axiosInstance.get(
    endpoints.student.get_dashboard_data
  );
  return response.data;
};

// Get dashboard statistics
export const getStudentDashboardStats = async (): Promise<
  IApiResponse<DashboardStats>
> => {
  try {
    const result = await axiosInstance.get(
      endpoints.student.get_dashboard_stats,
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

// Get recent courses
export const getRecentCourses = async (): Promise<
  IApiResponse<{ courses: EnrolledCourse[] }>
> => {
  try {
    const result = await axiosInstance.get(
      endpoints.student.get_recent_courses,
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

// Get upcoming deadlines
export const getUpcomingDeadlines = async (): Promise<
  IApiResponse<{ deadlines: Deadline[] }>
> => {
  const response = await axiosInstance.get(
    endpoints.student.get_upcoming_deadlines
  );
  return response.data;
};

// Get recent activities
export const getRecentActivities = async (): Promise<
  IApiResponse<Activity[]>
> => {
  try {
    const result = await axiosInstance.get(
      endpoints.student.get_recent_activities,
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

// Get progress data for chart
export const getProgressData = async (): Promise<
  IApiResponse<ProgressData[]>
> => {
  try {
    const result = await axiosInstance.get(
      endpoints.student.get_progress_data,
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

// Get weekly study data for chart
export const getWeeklyStudyData = async (): Promise<
  IApiResponse<StudyTimeData[]>
> => {
  try {
    const result = await axiosInstance.get(
      endpoints.student.get_weekly_study_data,
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

// Get subject distribution data for chart
export const getSubjectDistribution = async (): Promise<
  IApiResponse<SubjectDistribution[]>
> => {
  try {
    const result = await axiosInstance.get(
      endpoints.student.get_subject_distribution,
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};
