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
  gender: string;
  account_status: string;
  created_at: string;
  program_id?: string;
  program_name?: string;
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

export const getStudents = async (): Promise<IApiResponse<Student[]>> => {
  try {
    const result = await axiosInstance.get(endpoints.students.get_students, {
      withCredentials: true,
    });
    return result.data;
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
