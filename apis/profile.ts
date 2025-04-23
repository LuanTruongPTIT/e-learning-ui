import axiosInstance, { endpoints } from "@/lib/axios";

export interface IApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone_number?: string;
  address?: string;
  avatar_url?: string;
  date_of_birth?: string;
  gender?: string;
  account_status: string;
  role: string;
  created_at: string;
}

export const getCurrentUser = async (): Promise<IApiResponse<UserProfile>> => {
  try {
    const result = await axiosInstance.get(endpoints.profile.get_current_user, {
      withCredentials: true,
    });
    return result.data;
  } catch (error) {
    throw error;
  }
};
