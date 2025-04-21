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
    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    );
  }
);
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/sign-in"; // ✅ dùng thẳng window
      }
    }
    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    );
  }
);

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
};
