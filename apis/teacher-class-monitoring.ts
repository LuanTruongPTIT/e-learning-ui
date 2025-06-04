import axiosInstance, { endpoints } from "@/lib/axios";
import { IApiResponse } from "@/interfaces/api-response";

// Interface definitions
export interface ClassOverview {
  classId: string;
  className: string;
  programName: string;
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  averageProgress: number;
  totalCourses: number;
  completedAssignments: number;
  pendingAssignments: number;
  courseProgress: CourseProgress[];
  topPerformers: StudentPerformance[];
  lowPerformers: StudentPerformance[];
}

export interface CourseProgress {
  courseId: string;
  courseName: string;
  averageProgress: number;
  studentsCompleted: number;
  studentsInProgress: number;
  studentsNotStarted: number;
}

export interface StudentPerformance {
  studentId: string;
  studentName: string;
  email: string;
  overallProgress: number;
  completedCourses: number;
  inProgressCourses: number;
  lastAccessed: string;
}

export interface ClassStudent {
  studentId: string;
  studentName: string;
  email: string;
  avatarUrl?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  enrollmentDate: string;
  programName: string;
  department?: string;
  overallProgress: number;
  completedCourses: number;
  inProgressCourses: number;
  notStartedCourses: number;
  totalAssignments: number;
  completedAssignments: number;
  pendingAssignments: number;
  averageGrade: number;
  lastAccessed: string;
  status: string;
  courseProgress: StudentCourseDetail[];
  recentAssignments: StudentAssignmentDetail[];
  recentActivities: StudentActivityDetail[];
}

export interface StudentCourseDetail {
  courseId: string;
  courseName: string;
  progress: number;
  status: string;
  lastAccessed?: string;
  completedLectures: number;
  totalLectures: number;
  completedAssignments: number;
  totalAssignments: number;
  currentGrade?: number;
}

export interface StudentAssignmentDetail {
  assignmentId: string;
  assignmentTitle: string;
  courseName: string;
  deadline: string;
  submittedAt?: string;
  score?: number;
  maxScore: number;
  status: string;
  isLate: boolean;
}

export interface StudentActivityDetail {
  activityType: string;
  description: string;
  timestamp: string;
  courseName?: string;
  score?: number;
}

export interface GetClassStudentsRequest {
  teacherId?: string;
  classId: string;
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface GetClassStudentsResponse {
  students: ClassStudent[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// API functions

// Get all classes for the current teacher (using token)
export const getTeacherClasses = async (): Promise<
  IApiResponse<ClassOverview[]>
> => {
  try {
    const response = await axiosInstance.get(
      endpoints.teacher.get_teacher_classes,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get specific class overview
export const getClassOverview = async (
  classId: string,
  teacherId?: string
): Promise<IApiResponse<ClassOverview>> => {
  try {
    const params = new URLSearchParams();
    if (teacherId) {
      params.append("teacherId", teacherId);
    }

    const url = `${endpoints.teacher.get_class_overview(classId)}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response = await axiosInstance.get(url, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClassStudents = async (
  request: GetClassStudentsRequest
): Promise<IApiResponse<GetClassStudentsResponse>> => {
  try {
    const params = new URLSearchParams();

    if (request.teacherId) params.append("teacherId", request.teacherId);
    if (request.page) params.append("page", request.page.toString());
    if (request.pageSize)
      params.append("pageSize", request.pageSize.toString());
    if (request.searchTerm) params.append("searchTerm", request.searchTerm);
    if (request.sortBy) params.append("sortBy", request.sortBy);
    if (request.sortOrder) params.append("sortOrder", request.sortOrder);

    const url = `${endpoints.teacher.get_class_students(
      request.classId
    )}?${params.toString()}`;
    const response = await axiosInstance.get(url, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get detailed student information
export const getStudentDetail = async (
  studentId: string
): Promise<IApiResponse<ClassStudent>> => {
  try {
    const response = await axiosInstance.get(
      endpoints.teacher.get_student_detail(studentId),
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Export student progress report
export const exportClassReport = async (
  classId: string,
  format: "csv" | "excel" = "csv"
): Promise<Blob> => {
  try {
    const response = await axiosInstance.get(
      `${endpoints.teacher.export_class_report(classId)}?format=${format}`,
      {
        responseType: "blob",
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Send message to student
export const sendMessageToStudent = async (
  studentId: string,
  message: {
    subject: string;
    content: string;
  }
): Promise<IApiResponse<{ success: boolean }>> => {
  try {
    const response = await axiosInstance.post(
      endpoints.teacher.send_message_to_student(studentId),
      message,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
