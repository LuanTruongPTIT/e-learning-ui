export interface Lecture {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  content_type: "VIDEO_UPLOAD" | "YOUTUBE_LINK"; // Type of content
  content_url: string; // URL đến file video hoặc YouTube link
  youtube_video_id?: string; // ID của video YouTube (nếu là YouTube link)
  duration?: number; // Thời lượng video (tính bằng giây)
  is_published: boolean;
  created_at: Date;
  updated_at: Date;
  created_by: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  status: string;
  enrollmentDate: Date;
  avatar?: string;
  department?: string;
}

export interface TeachingPlan {
  id: string;
  title: string;
  description: string;
  type: string;
  scheduledDate: Date;
  duration: number;
  status: string;
  materials: string[];
  createdAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  startDate: Date;
  endDate: Date;
  studentsCount: number;
  materialsCount: number;
  status: string;
  createdAt: Date;
  lastUpdated: Date;
  lectures: Lecture[];
  students: Student[];
  teachingPlans: TeachingPlan[];
  department: string;
  canEditDuration: boolean;
  assignedBy: string;
  assignedDate: Date;
}

export interface Courses_By_Department {
  id: string;
  name: string;
  code: string;
  department_id: string;
}
