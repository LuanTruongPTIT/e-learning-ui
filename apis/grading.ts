import axiosInstance from "@/lib/axios";

export interface IApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface AssignmentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  submissionType: string;
  fileUrls: string[];
  textContent?: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  status: string;
  isLate: boolean;
  lateDuration?: string;
}

export interface AssignmentInfo {
  id: string;
  title: string;
  description: string;
  deadline: string;
  maxScore: number;
  totalSubmissions: number;
  gradedSubmissions: number;
  pendingSubmissions: number;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AssignmentSubmissionsResponse {
  assignment: AssignmentInfo;
  submissions: AssignmentSubmission[];
  pagination: PaginationInfo;
}

export interface GradeAssignmentRequest {
  grade: number;
  feedback?: string;
}

export interface GradeAssignmentResponse {
  submissionId: string;
  grade: number;
  feedback?: string;
  gradedAt: string;
  status: string;
}

export const getAssignmentSubmissions = async (
  assignmentId: string,
  params?: {
    status?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<IApiResponse<AssignmentSubmissionsResponse>> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.status) queryParams.append("status", params.status);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize)
      queryParams.append("pageSize", params.pageSize.toString());

    const url = `teacher/assignments/${assignmentId}/submissions${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const result = await axiosInstance.get(url, {
      withCredentials: true,
    });
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const gradeAssignment = async (
  submissionId: string,
  data: GradeAssignmentRequest
): Promise<IApiResponse<GradeAssignmentResponse>> => {
  try {
    const result = await axiosInstance.post(
      `teacher/submissions/${submissionId}/grade`,
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

export const downloadSubmissionFile = async (
  fileUrl: string
): Promise<Blob> => {
  try {
    const result = await axiosInstance.get(fileUrl, {
      responseType: "blob",
      withCredentials: true,
    });
    return result.data;
  } catch (error) {
    throw error;
  }
};
