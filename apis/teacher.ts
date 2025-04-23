"use client";
import { TeacherFormValues } from "@/app/schema/users-schema";
import { IApiResponse } from "@/interfaces/api-response";
import axiosInstance, { endpoints } from "@/lib/axios";
import { ClassData } from "@/lib/mock-data";
import { ClassResponse } from "@/types/class";
import { Courses_By_Department } from "@/types/course";
import { Department } from "@/types/deparment";
import { Teacher } from "@/types/teacher";

interface GetCourseDepartmentResponse {
  course_id: string;
  course_name: string;
  department_id: string;
  department_name: string;
}
export const GetCourseDepartment = async (): Promise<
  IApiResponse<Array<GetCourseDepartmentResponse>>
> => {
  const result = await axiosInstance.get(
    endpoints.course.get_course_departments,
    {
      withCredentials: true,
    }
  );

  return result.data;
};

export const CreateTeacher = async (
  data: TeacherFormValues
): Promise<IApiResponse<string>> => {
  const result = await axiosInstance.post(
    endpoints.teacher.create_teacher,
    {
      ...data,
    },
    {
      withCredentials: true,
    }
  );

  return result.data;
};

export const GetTeacherByAdmin = async (
  page: number,
  page_size: number
): Promise<IApiResponse<Array<Teacher>>> => {
  try {
    const result = await axiosInstance.get(
      endpoints.teacher.get_teacher_by_admin,
      {
        withCredentials: true,
        params: {
          page: page ?? 1,
          page_size: page_size ?? 10,
        },
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const GetDepartment = async (): Promise<
  IApiResponse<Array<Department>>
> => {
  try {
    const result = await axiosInstance.get(
      endpoints.department.get_departments,
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const GetCoursesByDepartment = async (
  department_id: string
): Promise<IApiResponse<Array<Courses_By_Department>>> => {
  try {
    const result = await axiosInstance.get(
      endpoints.course.get_total_course_by_department,
      {
        withCredentials: true,
        params: {
          department_id: department_id,
        },
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};
export const CreateClass = async (
  data: ClassData
): Promise<IApiResponse<string>> => {
  try {
    const result = await axiosInstance.post(
      endpoints.class.create_class,
      {
        ...data,
      },
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const GetClasses = async (
  page: number = 1,
  page_size: number = 10
): Promise<IApiResponse<Array<ClassResponse>>> => {
  try {
    const result = await axiosInstance.get(endpoints.room.get_classes, {
      withCredentials: true,
      params: {
        page,
        page_size,
      },
    });
    return result.data;
  } catch (error) {
    throw error;
  }
};

export interface ClassByDepartmentResponse {
  class_id: string;
  class_name: string;
  department_id: string;
  program_id: string;
  program_name: string;
  teacher_id: string;
}

export const getClassesByDepartment = async (): Promise<
  IApiResponse<Array<ClassByDepartmentResponse>>
> => {
  try {
    const result = await axiosInstance.get(
      endpoints.room.get_classes_by_department_of_teacher,
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

export interface CoursesByProgramResponse {
  course_id: string;
  course_name: string;
  course_code: string;
  program_id: string;
  program_name: string;
}

export const getCoursesByProgram = async (
  programId: string
): Promise<IApiResponse<Array<CoursesByProgramResponse>>> => {
  try {
    const result = await axiosInstance.get(`program/${programId}/courses`, {
      withCredentials: true,
    });
    return result.data;
  } catch (error) {
    throw error;
  }
};

export interface TeachingAssignCourse {
  class_id: string;
  course_id: string;
  course_name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  thumbnail_url: string;
}
export const createTeachingAssignCourse = async (
  data: TeachingAssignCourse
): Promise<IApiResponse<string>> => {
  try {
    const result = await axiosInstance.post(
      `program/teaching-assignment-course`,
      {
        ...data,
      },
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

export interface TeachingAssignCourseResponse {
  id: string;
  course_class_name: string;
  description: string;
  class_id: string;
  class_name: string;
  course_id: string;
  course_name: string;
  course_code: string;
  start_date: Date;
  end_date: Date;
  thumbnail_url: string;
  status: string;
  created_at: Date;
  lectures: any[];
}

export const getTeachingAssignCourses = async (): Promise<
  IApiResponse<Array<TeachingAssignCourseResponse>>
> => {
  try {
    const result = await axiosInstance.get("program/teaching-assign-courses", {
      withCredentials: true,
    });
    return result.data;
  } catch (error) {
    throw error;
  }
};
