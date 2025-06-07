import { IApiResponse } from "@/interfaces/api-response";
import axiosInstance from "./axios";

export interface StudentCourse {
  courseId: string; // Guid => string
  courseName: string;
  courseCode: string;
  teacherName: string;
  progressPercentage: number;
  status: string;
  enrollmentDate: string; // DateTime => string (ISO format)
  lastAccessed?: string | null; // nullable DateTime
}
export interface StudentDetail {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  enrollmentDate: string;
  status: string;
  department: string;
  program: string;
  gpa: number;
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  avatar: string;
  address: string;
  performanceStats: StudentPerformanceStats;
  courseProgresses: CourseProgress[];
  studyActivities: MonthlyActivity[];
  subjectScores: SubjectScore[];
}
export interface Teacher {
  id: string; // Guid → string
  name: string;
  email: string;
  phoneNumber: string;
  department: string;
  joinDate: string; // DateTime → string (ISO format)
  status: string;
  coursesCount: number;
  studentsCount: number;
  rating: number;
}
export interface AdminCourse {
  id: string; // Guid
  name: string;
  description: string;
  code: string;
  instructor: string;
  department: string;
  startDate: string; // DateTime → ISO string
  endDate?: string | null; // nullable DateTime
  status: string;
  studentsCount: number;
  maxStudents: number;
  duration: number; // hours
  rating: number;
  completionRate: number;
  thumbnailUrl: string;
}
export interface GetAdminCoursesResponse {
  courses: AdminCourse[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetTeachersResponse {
  teachers: Teacher[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetStudentsResponse {
  students: StudentDetail[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface OverviewStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  activeCourses: number;
  averageGpa: number;
  completionRate: number;
}
export interface EnrollmentTrend {
  month: string;
  students: number;
  courses: number;
}
export interface DepartmentStat {
  department: string;
  students: number;
  courses: number;
  averageGpa: number;
}
export interface PerformanceMetric {
  excellentStudents: number; // GPA >= 8.5
  goodStudents: number; // GPA 7.0 - 8.4
  averageStudents: number; // GPA 5.5 - 6.9
  belowAverageStudents: number; // GPA < 5.5
}
export interface RecentActivity {
  id: string;
  type: string;
  message: string;
  timestamp: string; // ISO 8601 string
}
export interface AdminDashboardStatsResponse {
  overview: OverviewStats;
  enrollmentTrends: EnrollmentTrend[];
  departmentStats: DepartmentStat[];
  performanceMetrics: PerformanceMetric;
  recentActivities: RecentActivity[];
}

export interface StudentPerformanceStats {
  averageScore: number;
  attendanceRate: number;
  totalAssignments: number;
  completedAssignments: number;
  totalQuizzes: number;
  quizAverageScore: number;
  studyHours: number;
  rank: string;
}

export interface CourseProgress {
  courseId: string;
  courseName: string;
  courseCode: string;
  teacherName: string;
  progressPercentage: number;
  currentScore: number;
  status: string;
  lastAccessed: string;
}

export interface MonthlyActivity {
  month: string;
  studyHours: number;
  assignmentsCompleted: number;
  quizzesTaken: number;
  averageScore: number;
}

export interface SubjectScore {
  subject: string;
  score: number;
  grade: string;
  color: string;
}

export interface TeacherDetail {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  department: string;
  joinDate: string;
  status: string;
  avatar: string;
  address: string;
  specialization: string;
  rating: number;
  coursesCount: number;
  studentsCount: number;
  performanceStats: TeacherPerformanceStats;
  teachingCourses: TeachingCourse[];
  teachingActivities: MonthlyTeachingActivity[];
  studentPerformances: StudentPerformanceByTeacher[];
  departmentComparisons: DepartmentComparison[];
}

export interface TeacherPerformanceStats {
  averageStudentScore: number;
  studentSatisfactionRate: number;
  totalLessons: number;
  completedLessons: number;
  totalAssignments: number;
  assignmentCompletionRate: number;
  teachingHours: number;
  rank: string;
}

export interface TeachingCourse {
  courseId: string;
  courseName: string;
  courseCode: string;
  studentsEnrolled: number;
  maxStudents: number;
  completionRate: number;
  averageScore: number;
  status: string;
  startDate: string;
}

export interface MonthlyTeachingActivity {
  month: string;
  teachingHours: number;
  studentsGraded: number;
  assignmentsCreated: number;
  averageStudentScore: number;
}

export interface StudentPerformanceByTeacher {
  studentName: string;
  courseName: string;
  score: number;
  progress: number;
  status: string;
}

export interface DepartmentComparison {
  metric: string;
  teacherValue: number;
  departmentAverage: number;
  trend: string;
}

export interface CourseDetail {
  id: string;
  name: string;
  code: string;
  description: string;
  thumbnailUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  department: string;
  teacherName: string;
  teacherAvatar: string;
  studentsEnrolled: number;
  maxStudents: number;
  completionRate: number;
  rating: number;
  duration: number;
  performanceStats: CoursePerformanceStats;
  enrolledStudents: EnrolledStudent[];
  enrollmentTrends: MonthlyEnrollment[];
  progressDistributions: ProgressDistribution[];
  courseContents: CourseContent[];
}

export interface CoursePerformanceStats {
  averageScore: number;
  completionRate: number;
  dropoutRate: number;
  totalLessons: number;
  completedLessons: number;
  totalAssignments: number;
  assignmentCompletionRate: number;
  averageStudyTime: number;
  difficultyLevel: string;
}

export interface EnrolledStudent {
  studentId: string;
  studentName: string;
  avatar: string;
  progress: number;
  score: number;
  status: string;
  lastAccessed: string;
  enrollmentDate: string;
}

export interface MonthlyEnrollment {
  month: string;
  newEnrollments: number;
  completions: number;
  dropouts: number;
  averageScore: number;
}

export interface ProgressDistribution {
  range: string;
  count: number;
  percentage: number;
  color: string;
}

export interface CourseContent {
  id: string;
  title: string;
  type: string;
  duration: number;
  completionRate: number;
  status: string;
  order: number;
}

export const adminApi = {
  // Get Student by ID
  getStudentById: async (
    studentId: string
  ): Promise<IApiResponse<StudentDetail>> => {
    const response = await axiosInstance.get(`/admin/students/${studentId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Get Students
  getStudents: async (
    params: {
      searchTerm?: string;
      status?: string;
      page?: number;
      pageSize?: number;
    } = {}
  ): Promise<IApiResponse<GetStudentsResponse>> => {
    const searchParams = new URLSearchParams();
    if (params.searchTerm) searchParams.append("searchTerm", params.searchTerm);
    if (params.status) searchParams.append("status", params.status);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.pageSize)
      searchParams.append("pageSize", params.pageSize.toString());

    const response = await axiosInstance.get(
      `/admin/students?${searchParams}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  // Get Teachers
  getTeachers: async (
    params: {
      searchTerm?: string;
      status?: string;
      department?: string;
      page?: number;
      pageSize?: number;
    } = {}
  ): Promise<IApiResponse<GetTeachersResponse>> => {
    const searchParams = new URLSearchParams();
    if (params.searchTerm) searchParams.append("searchTerm", params.searchTerm);
    if (params.status) searchParams.append("status", params.status);
    if (params.department) searchParams.append("department", params.department);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.pageSize)
      searchParams.append("pageSize", params.pageSize.toString());

    const response = await axiosInstance.get(
      `/admin/teachers?${searchParams}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  // Get Courses
  getCourses: async (
    params: {
      searchTerm?: string;
      status?: string;
      department?: string;
      page?: number;
      pageSize?: number;
    } = {}
  ): Promise<IApiResponse<GetAdminCoursesResponse>> => {
    const searchParams = new URLSearchParams();
    if (params.searchTerm) searchParams.append("searchTerm", params.searchTerm);
    if (params.status) searchParams.append("status", params.status);
    if (params.department) searchParams.append("department", params.department);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.pageSize)
      searchParams.append("pageSize", params.pageSize.toString());

    const response = await axiosInstance.get(`/admin/courses?${searchParams}`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Get Dashboard Statistics
  getDashboardStats: async (): Promise<
    IApiResponse<AdminDashboardStatsResponse>
  > => {
    const response = await axiosInstance.get(`/admin/dashboard/statistics`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Get Student Details
  getStudentDetails: async (
    studentId: string
  ): Promise<IApiResponse<StudentDetail>> => {
    const response = await axiosInstance.get(`/admin/students/${studentId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Get Teacher Details
  getTeacherDetails: async (
    teacherId: string
  ): Promise<IApiResponse<TeacherDetail>> => {
    const response = await axiosInstance.get(`/admin/teachers/${teacherId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Get Course Details
  getCourseDetails: async (
    courseId: string
  ): Promise<IApiResponse<CourseDetail>> => {
    const response = await axiosInstance.get(`/admin/courses/${courseId}`, {
      withCredentials: true,
    });
    return response.data;
  },
};
