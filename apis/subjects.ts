import axiosInstance, { endpoints } from "@/lib/axios";

export interface Subject {
  id: string;
  code: string;
  name: string;
  department_id: string;
  department_name: string;
  credits: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubjectsResponse {
  status: number;
  message: string;
  total: number;
  data: Subject[];
}

export interface SubjectResponse {
  status: number;
  message: string;
  data: Subject;
}

export const getSubjects = async (
  keyword?: string,
  page: number = 1,
  pageSize: number = 10
): Promise<SubjectsResponse> => {
  try {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (page) params.append("page", page.toString());
    if (pageSize) params.append("page_size", pageSize.toString());

    const response = await axiosInstance.get(`/courses/subjects?${params.toString()}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

export const getSubject = async (id: string): Promise<SubjectResponse> => {
  try {
    const response = await axiosInstance.get(`/courses/subjects/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching subject with ID ${id}:`, error);
    throw error;
  }
};

export const getTeacherSubjects = async (
  keyword?: string,
  page: number = 1,
  pageSize: number = 10
): Promise<SubjectsResponse> => {
  try {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (page) params.append("page", page.toString());
    if (pageSize) params.append("page_size", pageSize.toString());

    const response = await axiosInstance.get(`/courses/teacher/subjects?${params.toString()}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher subjects:", error);
    throw error;
  }
};
