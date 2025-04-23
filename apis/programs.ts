import axiosInstance, { endpoints } from "@/lib/axios";

export interface IApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface Program {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const getPrograms = async (): Promise<IApiResponse<Program[]>> => {
  try {
    const result = await axiosInstance.get(endpoints.programs.get_programs, {
      withCredentials: true,
    });
    return result.data;
  } catch (error) {
    throw error;
  }
};
