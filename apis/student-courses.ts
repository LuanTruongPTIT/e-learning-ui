import axiosInstance, { endpoints } from "@/lib/axios";

export interface IApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface Lecture {
  id: string;
  title: string;
  contentType: string;
  isCompleted: boolean;
  contentUrl?: string;
  description?: string;
  order_index?: number;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  progress: number;
  lectures: Lecture[];
}

export interface Instructor {
  teacherName: string;
  avatar: string;
}

export interface Resource {
  id: string;
  title: string;
  contentType: string;
  contentUrl: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface CourseDetails {
  courseId: string;
  courseName: string;
  description: string;
  thumbnailUrl: string;
  instructor: Instructor;
  progressPercent: number;
  totalLectures: number;
  completedLectures: number;
  lastAccessed: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  lectures: Lecture[];
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
  courseId: string,
  studentId?: string
): Promise<IApiResponse<CourseDetails>> => {
  try {
    // Construct the URL with optional studentId parameter
    let url = endpoints.student.get_course_details(courseId);
    if (studentId) {
      url += `?studentId=${studentId}`;
    }

    const result = await axiosInstance.get(url, {
      withCredentials: true,
    });

    // Return the API response directly since the backend now returns data in the correct format
    return result.data;

    // For development/testing with mock data, uncomment the following:
    /*
    return {
      status: 200,
      message: "Course details retrieved successfully",
      data: mockCourseDetails as CourseDetails,
    };
    */
  } catch (error) {
    console.error("Error fetching course details:", error);
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

export interface UpdateLectureProgressRequest {
  watchPosition: number; // Position in seconds
  progressPercentage: number; // Percentage watched (0-100)
}

export const updateLectureProgress = async (
  lectureId: string,
  progressData: UpdateLectureProgressRequest
): Promise<IApiResponse<{ success: boolean }>> => {
  try {
    const result = await axiosInstance.post(
      endpoints.student.update_lecture_progress(lectureId),
      {
        WatchPosition: progressData.watchPosition,
        ProgressPercentage: progressData.progressPercentage,
      },
      { withCredentials: true }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};
