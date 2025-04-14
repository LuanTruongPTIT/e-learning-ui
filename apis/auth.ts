import { IApiResponse } from "@/interfaces/api-response";
import axiosInstance, { endpoints } from "@/lib/axios";

export interface LoginResponse {
  access_token: string;
  expires_in_access_token: number;
  refresh_token: string;
  expires_in_refresh_tokens: number;
  role: string;
}

export const login = async (
  email: string,
  password: string
): Promise<IApiResponse<LoginResponse>> => {
  const result = await axiosInstance.post(
    endpoints.auth.login,
    {
      email,
      password,
    },
    {
      withCredentials: true,
    }
  );

  return result.data;
};
