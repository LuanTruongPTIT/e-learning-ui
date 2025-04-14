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
