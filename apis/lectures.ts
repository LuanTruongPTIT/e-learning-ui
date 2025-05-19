import axiosInstance, { endpoints } from "@/lib/axios";
import { Lecture } from "@/types/course";

export interface IApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface CreateLectureRequest {
  title: string;
  description: string;
  content_type: "VIDEO_UPLOAD" | "YOUTUBE_LINK";
  content_url: string;
  youtube_video_id?: string;
  duration?: number;
  is_published: boolean;
  materialType: string;
}

export const getLectures = async (
  courseId: string
): Promise<IApiResponse<Lecture[]>> => {
  try {
    const result = await axiosInstance.get(
      endpoints.lectures.get_lectures(courseId),
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const createLecture = async (
  courseId: string,
  data: CreateLectureRequest
): Promise<IApiResponse<string>> => {
  try {
    const result = await axiosInstance.post(
      endpoints.lectures.create_lecture(courseId),
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

export const updateLecturePublishStatus = async (
  lectureId: string,
  isPublished: boolean
): Promise<IApiResponse<boolean>> => {
  try {
    const result = await axiosInstance.patch(
      endpoints.lectures.update_publish_status(lectureId),
      {
        is_published: isPublished,
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

export const deleteLecture = async (
  lectureId: string
): Promise<IApiResponse<boolean>> => {
  try {
    const result = await axiosInstance.delete(
      endpoints.lectures.delete_lecture(lectureId),
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};
