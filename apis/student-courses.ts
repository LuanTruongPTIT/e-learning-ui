import axiosInstance, { endpoints } from "@/lib/axios";

export interface IApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface Lecture {
  id: string;
  title: string;
  type: string;
  duration: string;
  is_completed: boolean;
  is_preview?: boolean;
  video_url?: string;
  content?: string;
  attachments?: {
    id: string;
    title: string;
    type: string;
    size: string;
    url: string;
  }[];
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  progress: number;
  lectures: Lecture[];
}

export interface Instructor {
  name: string;
  avatar: string;
  title: string;
  bio: string;
}

export interface Resource {
  id: string;
  title: string;
  type: string;
  size: string;
  url: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface CourseDetails {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: Instructor;
  progress: number;
  total_lectures: number;
  completed_lectures: number;
  total_duration: string;
  last_accessed: string;
  created_at: string;
  updated_at: string;
  category: string;
  level: string;
  status: string;
  sections: Section[];
  announcements: Announcement[];
  resources: Resource[];
}

export interface EnrolledCourse {
  course_id: string;
  course_name: string;
  course_code: string;
  description: string;
  thumbnail_url: string;
  teacher_name: string;
  progress_percentage: number;
  total_lectures: number;
  completed_lectures: number;
  last_accessed?: string | null;
  status: string;
}

export const getEnrolledCourses = async (): Promise<
  IApiResponse<EnrolledCourse[]>
> => {
  try {
    const result = await axiosInstance.get(
      endpoints.student.get_enrolled_courses,
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const getCourseDetails = async (
  courseId: string
): Promise<IApiResponse<CourseDetails>> => {
  try {
    const result = await axiosInstance.get(
      endpoints.student.get_course_details(courseId),
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const getCourseContent = async (
  courseId: string
): Promise<IApiResponse<CourseDetails>> => {
  try {
    const result = await axiosInstance.get(
      endpoints.student.get_course_content(courseId),
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const markLectureAsCompleted = async (
  lectureId: string
): Promise<IApiResponse<{ success: boolean }>> => {
  try {
    const result = await axiosInstance.post(
      endpoints.student.mark_lecture_completed(lectureId),
      {},
      { withCredentials: true }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};
