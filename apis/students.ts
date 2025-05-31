import axiosInstance, { endpoints } from "@/lib/axios";

export interface IApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface Student {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone_number: string;
  address: string;
  avatar_url: string;
  date_of_birth: string;
  gender: number;
  account_status: number;
  created_at: string;
  program_id?: string;
  program_name?: string;
}

export interface PaginationInfo {
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

export interface StudentsResponse {
  students: Student[];
  pagination: PaginationInfo;
}

// New response structure to match backend
export interface StudentsApiResponse {
  status: number;
  message: string;
  total: number;
  data: Student[];
  pagination: PaginationInfo;
}

export interface GetStudentsParams {
  keyword?: string;
  page?: number;
  page_size?: number;
  program_id?: string;
  account_status?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface CreateStudentRequest {
  username: string;
  email: string;
  full_name: string;
  phone_number?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
  program_id?: string;
  password: string;
  send_email?: boolean;
}

export interface UpdateStudentRequest {
  full_name?: string;
  phone_number?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
  program_id?: string;
  account_status?: string;
}

export const getStudents = async (
  params?: GetStudentsParams
): Promise<IApiResponse<StudentsResponse>> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.keyword) queryParams.append("keyword", params.keyword);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.page_size)
      queryParams.append("page_size", params.page_size.toString());
    if (params?.program_id) queryParams.append("program_id", params.program_id);
    if (params?.account_status !== undefined)
      queryParams.append("account_status", params.account_status.toString());
    if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params?.sort_order) queryParams.append("sort_order", params.sort_order);

    const url = `${endpoints.students.get_students}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const result = await axiosInstance.get<StudentsApiResponse>(url, {
      withCredentials: true,
    });

    // Transform the response to match the expected format
    const transformedResponse: IApiResponse<StudentsResponse> = {
      status: result.data.status,
      message: result.data.message,
      data: {
        students: result.data.data,
        pagination: result.data.pagination,
      },
    };

    return transformedResponse;
  } catch (error) {
    throw error;
  }
};

export const getStudent = async (
  studentId: string
): Promise<IApiResponse<Student>> => {
  try {
    const result = await axiosInstance.get(
      endpoints.students.get_student(studentId),
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const createStudent = async (
  data: CreateStudentRequest
): Promise<IApiResponse<string>> => {
  try {
    const result = await axiosInstance.post(
      endpoints.students.create_student,
      data,
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const updateStudent = async (
  studentId: string,
  data: UpdateStudentRequest
): Promise<IApiResponse<boolean>> => {
  try {
    const result = await axiosInstance.patch(
      endpoints.students.update_student(studentId),
      data,
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const deleteStudent = async (
  studentId: string
): Promise<IApiResponse<boolean>> => {
  try {
    const result = await axiosInstance.delete(
      endpoints.students.delete_student(studentId),
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};
