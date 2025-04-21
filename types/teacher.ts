export interface TeacherListResponse {
  status: number;
  message: string;
  total: number;
  data: Teacher[];
}

export interface Teacher {
  user_id: string;
  full_name: string;
  email: string;
  phoneNumber: string | null;
  address: string;
  gender: string;
  role_name: string;
  avatar_url: string;
  information_teaching: TeacherInformationTeaching;
}

export interface TeacherInformationTeaching {
  department_id: string;
  department_name: string;
  department_code: string | null;
  courses: TeacherCourse[];
}

export interface TeacherCourse {
  course_id: string;
  course_name: string;
  course_code: string;
}

export const columns_teacher_page_admin = [
  { header: "Name", accessor: "name" },
  { header: "Subjects", accessor: "subjects" },
  { header: "Department", accessor: "department" },
  { header: "Phone", accessor: "phone" },
  { header: "Address", accessor: "address" },
  { header: "Actions", accessor: "actions" },
];
