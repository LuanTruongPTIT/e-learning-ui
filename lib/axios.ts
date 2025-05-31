import axios, { AxiosRequestConfig } from "axios";
import { HOST_API } from "./global-config";
import Cookies from "js-cookie";
//----------------------------------------------------------------------
console.log(HOST_API);
const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("Interceptor error:", error); // ❗ thêm dòng này
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/sign-in";
      }
    }
    console.log(error.response.data);
    return Promise.reject(error.response.data);
  }
);
// axiosInstance.interceptors.response.use(
//   (res) => res,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       if (typeof window !== "undefined") {
//         window.location.href = "/sign-in"; // ✅ dùng thẳng window
//       }
//     }
//     return Promise.reject(error.response.data);
//   }
// );

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

const VERSION_PREFIX = "/v1";

export const endpoints = {
  auth: {
    login: `users/login`,
    register: `${VERSION_PREFIX}/register`,
  },
  course: {
    get_course_departments: `program/course-department`,
    get_total_course_by_department: `program/get-program-by-department`,
  },
  teacher: {
    create_teacher: `users/create-teacher`,
    get_teacher_by_admin: `users/teachers`,
  },
  department: {
    get_departments: `program/department`,
  },
  class: {
    create_class: `room/create-class`,
  },
  room: {
    get_classes: `room/classes`,
    get_classes_by_department_of_teacher: `room/classes-by-department-of-teacher`,
  },
  lectures: {
    get_lectures: (teachingAssignCourseId: string) =>
      `program/teaching-assign-courses/${teachingAssignCourseId}/lectures`,
    create_lecture: (teachingAssignCourseId: string) =>
      `program/teaching-assign-courses/${teachingAssignCourseId}/lectures`,
    update_publish_status: (lectureId: string) =>
      `program/lectures/${lectureId}/publish-status`,
    delete_lecture: (lectureId: string) => `program/lectures/${lectureId}`,
  },
  students: {
    get_students: `users/students`,
    get_student: (studentId: string) => `users/students/${studentId}`,
    create_student: `users/students`,
    update_student: (studentId: string) => `users/students/${studentId}`,
    delete_student: (studentId: string) => `users/students/${studentId}`,
  },
  programs: {
    get_programs: `program/programs`,
    get_program: (programId: string) => `program/programs/${programId}`,
  },
  student: {
    get_enrolled_courses: `student/courses`,
    get_course_details: (courseId: string) =>
      `student/courses-detail/${courseId}`,
    get_course_content: (courseId: string) =>
      `student/courses/${courseId}/content`,
    mark_lecture_completed: (lectureId: string) =>
      `student/lectures/${lectureId}/complete`,
    update_lecture_progress: (lectureId: string) =>
      `student/lectures/${lectureId}/progress`,
    // Dashboard endpoints
    get_dashboard_data: `student/dashboard`,
    get_dashboard_stats: `student/dashboard/stats`,
    get_recent_courses: `student/dashboard/recent-courses`,
    get_upcoming_deadlines: `student/dashboard/deadlines`,
    get_recent_activities: `student/dashboard/activities`,
    get_progress_data: `student/dashboard/progress`,
    get_weekly_study_data: `student/dashboard/weekly-study`,
    get_subject_distribution: `student/dashboard/subjects`,
  },
  profile: {
    get_current_user: `users/me`,
  },
};
