import { getAuthToken } from "@/utils/auth";

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  userId?: string;
  sessionId?: string;
  context?: string;
}

export interface SendMessageRequest {
  message: string;
  sessionId?: string;
  context?: string;
}

export interface StudyPlanRequest {
  courseId: string;
  studentLevel: string;
  preferences: string;
}

export interface ExplainConceptRequest {
  concept: string;
  subject: string;
  studentLevel: string;
}

export interface ReviewAssignmentRequest {
  assignmentText: string;
  rubric: string;
}

export interface GenerateQuizRequest {
  topic: string;
  questionCount: number;
  difficulty: string;
}

export interface AIStatus {
  isAvailable: boolean;
  models: string[];
  timestamp: string;
  error?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5093";

class AIService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = getAuthToken();

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "ELearning-Frontend/1.0",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: "include",
      mode: "cors",
    };

    try {
      console.log(
        `🚀 Making request to: ${API_BASE_URL}/api/ai-chat${endpoint}`
      );

      const response = await fetch(
        `${API_BASE_URL}/api/ai-chat${endpoint}`,
        requestOptions
      );

      console.log(
        `📡 Response status: ${response.status} ${response.statusText}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error: ${response.status}`, errorText);

        if (response.status === 404) {
          throw new Error(
            "API endpoint không tồn tại. Kiểm tra backend đã chạy chưa."
          );
        } else if (response.status === 500) {
          throw new Error("Lỗi server. Kiểm tra Ollama service đã chạy chưa.");
        } else if (response.status === 0 || response.status === 503) {
          throw new Error(
            "Không thể kết nối đến server. Kiểm tra CORS và backend."
          );
        }

        try {
          const errorData = JSON.parse(errorText);
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        } catch {
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`
          );
        }
      }

      const data = await response.json();
      console.log(`✅ Response data:`, data);
      return data;
    } catch (error) {
      console.error(`💥 Request failed:`, error);

      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Không thể kết nối đến server. Kiểm tra backend đã chạy và CORS được cấu hình đúng."
        );
      }

      throw error;
    }
  }

  async sendMessage(request: SendMessageRequest): Promise<ChatMessage> {
    return this.makeRequest<ChatMessage>("/send", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    return this.makeRequest<ChatMessage[]>(`/history/${sessionId}`);
  }

  async getStatus(): Promise<AIStatus> {
    return this.makeRequest<AIStatus>("/status");
  }

  async generateStudyPlan(
    request: StudyPlanRequest
  ): Promise<{ studyPlan: string }> {
    return this.makeRequest<{ studyPlan: string }>("/study-plan", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async explainConcept(
    request: ExplainConceptRequest
  ): Promise<{ explanation: string }> {
    return this.makeRequest<{ explanation: string }>("/explain-concept", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async reviewAssignment(
    request: ReviewAssignmentRequest
  ): Promise<{ review: string }> {
    return this.makeRequest<{ review: string }>("/review-assignment", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async generateQuiz(request: GenerateQuizRequest): Promise<{ quiz: string }> {
    return this.makeRequest<{ quiz: string }>("/generate-quiz", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getStatus();
      return true;
    } catch {
      return false;
    }
  }
}

export const aiService = new AIService();
