import { TeacherFormValues } from "@/app/schema/users-schema";
import { IApiResponse } from "@/interfaces/api-response";
import axiosInstance, { endpoints } from "@/lib/axios";

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
