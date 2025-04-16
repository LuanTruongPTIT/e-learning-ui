export interface Material {
  id: string;
  title: string;
  type: string;
  uploadDate: Date;
  size: string;
  fileType: string;
  url: string;
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
  materials: Material[];
  students: Student[];
  teachingPlans: TeachingPlan[];
  department: string;
  canEditDuration: boolean;
  assignedBy: string;
  assignedDate: Date;
}
