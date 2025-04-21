// Mock data for the e-learning system

// Departments
const departments = [
  { id: "IT", name: "Information Technology" },
  { id: "BUS", name: "Business Administration" },
  { id: "ENG", name: "Engineering" },
  { id: "SCI", name: "Science" },
];

// Majors with department associations
const majors = [
  { id: "CS", name: "Computer Science", departmentId: "IT" },
  { id: "SE", name: "Software Engineering", departmentId: "IT" },
  { id: "NE", name: "Network Engineering", departmentId: "IT" },
  { id: "DS", name: "Data Science", departmentId: "IT" },
  { id: "MKT", name: "Marketing", departmentId: "BUS" },
  { id: "FIN", name: "Finance", departmentId: "BUS" },
  { id: "MGT", name: "Management", departmentId: "BUS" },
  { id: "ME", name: "Mechanical Engineering", departmentId: "ENG" },
  { id: "CE", name: "Civil Engineering", departmentId: "ENG" },
  { id: "EE", name: "Electrical Engineering", departmentId: "ENG" },
  { id: "PHY", name: "Physics", departmentId: "SCI" },
  { id: "CHEM", name: "Chemistry", departmentId: "SCI" },
  { id: "BIO", name: "Biology", departmentId: "SCI" },
];

// Programs with major associations
const programs = [
  {
    id: "CS_BSC",
    name: "Bachelor of Science in Computer Science",
    majorId: "CS",
  },
  {
    id: "CS_MSC",
    name: "Master of Science in Computer Science",
    majorId: "CS",
  },
  {
    id: "SE_BSC",
    name: "Bachelor of Science in Software Engineering",
    majorId: "SE",
  },
  {
    id: "SE_MSC",
    name: "Master of Science in Software Engineering",
    majorId: "SE",
  },
  {
    id: "NE_BSC",
    name: "Bachelor of Science in Network Engineering",
    majorId: "NE",
  },
  { id: "DS_BSC", name: "Bachelor of Science in Data Science", majorId: "DS" },
  {
    id: "MKT_BBA",
    name: "Bachelor of Business Administration in Marketing",
    majorId: "MKT",
  },
  {
    id: "FIN_BBA",
    name: "Bachelor of Business Administration in Finance",
    majorId: "FIN",
  },
  {
    id: "MGT_BBA",
    name: "Bachelor of Business Administration in Management",
    majorId: "MGT",
  },
  {
    id: "ME_BSC",
    name: "Bachelor of Science in Mechanical Engineering",
    majorId: "ME",
  },
  {
    id: "CE_BSC",
    name: "Bachelor of Science in Civil Engineering",
    majorId: "CE",
  },
  {
    id: "EE_BSC",
    name: "Bachelor of Science in Electrical Engineering",
    majorId: "EE",
  },
  { id: "PHY_BSC", name: "Bachelor of Science in Physics", majorId: "PHY" },
  { id: "CHEM_BSC", name: "Bachelor of Science in Chemistry", majorId: "CHEM" },
  { id: "BIO_BSC", name: "Bachelor of Science in Biology", majorId: "BIO" },
];

// Academic periods (4-year ranges)
const academicPeriods = ["2020-2024", "2021-2025", "2022-2026", "2023-2027"];

// Subjects with program associations
const subjects = [
  // Computer Science subjects
  {
    id: "CS101",
    code: "CS101",
    name: "Introduction to Programming",
    programId: "CS_BSC",
    academicYears: ["2020-2024", "2021-2025", "2022-2026", "2023-2027"],
  },
  {
    id: "CS102",
    code: "CS102",
    name: "Data Structures and Algorithms",
    programId: "CS_BSC",
    academicYears: ["2020-2024", "2021-2025", "2022-2026", "2023-2027"],
  },
  {
    id: "CS201",
    code: "CS201",
    name: "Database Systems",
    programId: "CS_BSC",
    academicYears: ["2020-2024", "2021-2025", "2022-2026", "2023-2027"],
  },
  {
    id: "CS301",
    code: "CS301",
    name: "Artificial Intelligence",
    programId: "CS_BSC",
    academicYears: ["2020-2024", "2021-2025", "2022-2026", "2023-2027"],
  },

  // Software Engineering subjects
  {
    id: "SE101",
    code: "SE101",
    name: "Software Engineering Principles",
    programId: "SE_BSC",
    academicYears: ["2020-2024", "2021-2025", "2022-2026", "2023-2027"],
  },
  {
    id: "SE102",
    code: "SE102",
    name: "Object-Oriented Programming",
    programId: "SE_BSC",
    academicYears: ["2020-2024", "2021-2025", "2022-2026", "2023-2027"],
  },
  {
    id: "SE201",
    code: "SE201",
    name: "Software Design and Architecture",
    programId: "SE_BSC",
    academicYears: ["2020-2024", "2021-2025", "2022-2026", "2023-2027"],
  },
  {
    id: "SE301",
    code: "SE301",
    name: "Software Testing and Quality Assurance",
    programId: "SE_BSC",
    academicYears: ["2020-2024", "2021-2025", "2022-2026", "2023-2027"],
  },

  // Network Engineering subjects
  {
    id: "NE101",
    code: "NE101",
    name: "Computer Networks",
    programId: "NE_BSC",
    academicYears: ["2020-2024", "2021-2025", "2022-2026", "2023-2027"],
  },
  {
    id: "NE102",
    code: "NE102",
    name: "Network Security",
    programId: "NE_BSC",
    academicYears: ["2020-2024", "2021-2025", "2022-2026", "2023-2027"],
  },

  // Data Science subjects
  {
    id: "DS101",
    code: "DS101",
    name: "Introduction to Data Science",
    programId: "DS_BSC",
    academicYears: ["2020-2024", "2021-2025", "2022-2026", "2023-2027"],
  },
  {
    id: "DS102",
    code: "DS102",
    name: "Statistical Methods",
    programId: "DS_BSC",
    academicYears: ["2020-2024", "2021-2025", "2022-2026", "2023-2027"],
  },

  // Business subjects
  {
    id: "BUS101",
    code: "BUS101",
    name: "Principles of Management",
    programId: "MGT_BBA",
    academicYears: ["2020-2024", "2021-2025", "2022-2026", "2023-2027"],
  },
  {
    id: "MKT101",
    code: "MKT101",
    name: "Marketing Fundamentals",
    programId: "MKT_BBA",
    academicYears: ["2020-2024", "2021-2025", "2022-2026", "2023-2027"],
  },
  {
    id: "FIN101",
    code: "FIN101",
    name: "Financial Accounting",
    programId: "FIN_BBA",
    academicYears: ["2020-2024", "2021-2025", "2022-2026", "2023-2027"],
  },
];

// Teachers with department and subject qualifications
const teachers = [
  {
    id: "T1",
    name: "Dr. John Smith",
    departmentId: "IT",
    qualifiedSubjects: ["CS101", "CS102", "SE102"],
  },
  {
    id: "T2",
    name: "Prof. Jane Doe",
    departmentId: "IT",
    qualifiedSubjects: ["CS201", "CS301", "DS101"],
  },
  {
    id: "T3",
    name: "Dr. Robert Johnson",
    departmentId: "IT",
    qualifiedSubjects: ["SE101", "SE201", "SE301"],
  },
  {
    id: "T4",
    name: "Prof. Emily Williams",
    departmentId: "IT",
    qualifiedSubjects: ["NE101", "NE102"],
  },
  {
    id: "T5",
    name: "Dr. Michael Brown",
    departmentId: "IT",
    qualifiedSubjects: ["DS101", "DS102"],
  },
  {
    id: "T6",
    name: "Prof. Sarah Miller",
    departmentId: "BUS",
    qualifiedSubjects: ["BUS101", "MKT101"],
  },
  {
    id: "T7",
    name: "Dr. David Wilson",
    departmentId: "BUS",
    qualifiedSubjects: ["FIN101", "BUS101"],
  },
  {
    id: "T8",
    name: "Prof. Lisa Taylor",
    departmentId: "ENG",
    qualifiedSubjects: ["ME101", "CE101"],
  },
  {
    id: "T9",
    name: "Dr. James Anderson",
    departmentId: "ENG",
    qualifiedSubjects: ["EE101", "ME101"],
  },
  {
    id: "T10",
    name: "Prof. Jennifer Martinez",
    departmentId: "SCI",
    qualifiedSubjects: ["PHY101", "CHEM101"],
  },
];

// Class data type
export interface ClassData {
  id: string;
  className: string;
  department_id: string;
  program_id: string;
  academicPeriod: string;
  status: "active" | "inactive";
  createdAt: Date;
}

// Course data type
export interface CourseData {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  courseName: string;
  description: string;
  startDate: Date;
  endDate: Date;
  teacherId: string;
  teacherName: string;
  hasTeachingPlan: boolean;
  createdAt: Date;
  status: "active" | "inactive";
}

// Sample classes
const classes: ClassData[] = [
  {
    id: "class-1",
    className: "CS2023A",
    department: departments.find((d) => d.id === "IT")!,
    major: majors.find((m) => m.id === "CS")!,
    program: programs.find((p) => p.id === "CS_BSC")!,
    academicPeriod: "2022-2026",
    status: "active",
    createdAt: new Date("2023-08-15"),
  },
  {
    id: "class-2",
    className: "SE2023A",
    department: departments.find((d) => d.id === "IT")!,
    major: majors.find((m) => m.id === "SE")!,
    program: programs.find((p) => p.id === "SE_BSC")!,
    academicPeriod: "2022-2026",
    status: "active",
    createdAt: new Date("2023-08-20"),
  },
  {
    id: "class-3",
    className: "BUS2023A",
    department: departments.find((d) => d.id === "BUS")!,
    major: majors.find((m) => m.id === "MGT")!,
    program: programs.find((p) => p.id === "MGT_BBA")!,
    academicPeriod: "2022-2026",
    status: "inactive",
    createdAt: new Date("2023-08-25"),
  },
];

// Sample courses
const courses: CourseData[] = [
  {
    id: "course-1",
    classId: "class-1",
    className: "CS2023A",
    subjectId: "CS101",
    subjectName: "Introduction to Programming",
    courseName: "Introduction to Programming - Fall 2023",
    description:
      "Learn the fundamentals of programming using JavaScript and Python.",
    startDate: new Date("2023-09-01"),
    endDate: new Date("2023-12-15"),
    teacherId: "T1",
    teacherName: "Dr. John Smith",
    hasTeachingPlan: true,
    createdAt: new Date("2023-08-20"),
    status: "active",
  },
  {
    id: "course-2",
    classId: "class-1",
    className: "CS2023A",
    subjectId: "CS102",
    subjectName: "Data Structures and Algorithms",
    courseName: "Data Structures and Algorithms - Spring 2024",
    description:
      "Study fundamental data structures and algorithms for efficient problem solving.",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-05-30"),
    teacherId: "T1",
    teacherName: "Dr. John Smith",
    hasTeachingPlan: false,
    createdAt: new Date("2023-12-10"),
    status: "active",
  },
  {
    id: "course-3",
    classId: "class-2",
    className: "SE2023A",
    subjectId: "SE101",
    subjectName: "Software Engineering Principles",
    courseName: "Software Engineering Fundamentals",
    description:
      "Introduction to software engineering concepts, methodologies, and practices.",
    startDate: new Date("2023-09-01"),
    endDate: new Date("2023-12-15"),
    teacherId: "T3",
    teacherName: "Dr. Robert Johnson",
    hasTeachingPlan: true,
    createdAt: new Date("2023-08-22"),
    status: "active",
  },
];

// Export all mock data
export const mockData = {
  departments,
  majors,
  programs,
  academicPeriods,
  subjects,
  teachers,
  classes,
  courses,
};
