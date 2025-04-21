"use client";

import { useState } from "react";
import type { Course } from "@/types/course";
import InstructorHeader from "./instructor-header";
import CourseDetailView from "./course-detail-view";
import AssignedCoursesList from "./assigned-courses-list";
import CreateCourseModal from "../create-course/create-course-modal";

// Mock data for instructor assigned courses
const mockAssignedCourses: Course[] = [
  {
    id: "course-1",
    title: "Introduction to Programming",
    description: "Learn the fundamentals of programming with JavaScript",
    thumbnail: "/placeholder.svg?height=150&width=250",
    startDate: new Date("2025-05-01"),
    endDate: new Date("2025-08-30"),
    studentsCount: 24,
    materialsCount: 12,
    status: "active",
    createdAt: new Date("2025-01-15"),
    lastUpdated: new Date("2025-04-20"),
    materials: [],
    students: [],
    teachingPlans: [],
    department: "Computer Science",
    canEditDuration: true,
    assignedBy: "Admin User",
    assignedDate: new Date("2025-01-20"),
  },
  {
    id: "course-2",
    title: "Web Development Fundamentals",
    description: "Master HTML, CSS, and JavaScript to build modern websites",
    thumbnail: "/placeholder.svg?height=150&width=250",
    startDate: new Date("2025-06-15"),
    endDate: new Date("2025-09-15"),
    studentsCount: 32,
    materialsCount: 18,
    status: "active",
    createdAt: new Date("2025-02-10"),
    lastUpdated: new Date("2025-04-25"),
    materials: [],
    students: [],
    teachingPlans: [],
    department: "Computer Science",
    canEditDuration: false,
    assignedBy: "Department Head",
    assignedDate: new Date("2025-02-15"),
  },
  {
    id: "course-3",
    title: "Data Structures and Algorithms",
    description:
      "Understand essential computer science concepts for efficient programming",
    thumbnail: "/placeholder.svg?height=150&width=250",
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-10-30"),
    studentsCount: 18,
    materialsCount: 15,
    status: "upcoming",
    createdAt: new Date("2025-03-05"),
    lastUpdated: new Date("2025-04-15"),
    materials: [],
    students: [],
    teachingPlans: [],
    department: "Computer Science",
    canEditDuration: true,
    assignedBy: "Admin User",
    assignedDate: new Date("2025-03-10"),
  },
  {
    id: "course-4",
    title: "Mobile App Development",
    description: "Build cross-platform mobile applications with React Native",
    thumbnail: "/placeholder.svg?height=150&width=250",
    startDate: new Date("2025-09-01"),
    endDate: new Date("2025-12-15"),
    studentsCount: 27,
    materialsCount: 9,
    status: "active",
    createdAt: new Date("2025-03-20"),
    lastUpdated: new Date("2025-04-10"),
    materials: [],
    students: [],
    teachingPlans: [],
    department: "Software Engineering",
    canEditDuration: false,
    assignedBy: "Department Head",
    assignedDate: new Date("2025-03-25"),
  },
  {
    id: "course-5",
    title: "Database Design and SQL",
    description:
      "Learn to design efficient databases and write complex SQL queries",
    thumbnail: "/placeholder.svg?height=150&width=250",
    startDate: new Date("2025-08-15"),
    endDate: new Date("2025-11-30"),
    studentsCount: 21,
    materialsCount: 14,
    status: "upcoming",
    createdAt: new Date("2025-04-01"),
    lastUpdated: new Date("2025-04-22"),
    materials: [],
    students: [],
    teachingPlans: [],
    department: "Information Systems",
    canEditDuration: true,
    assignedBy: "Admin User",
    assignedDate: new Date("2025-04-05"),
  },
];

export default function DashboardLayout() {
  const [courses, setCourses] = useState<Course[]>(mockAssignedCourses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleBackToDashboard = () => {
    setSelectedCourse(null);
  };

  const handleCourseUpdate = (updatedCourse: Course) => {
    setCourses(
      courses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
    setSelectedCourse(updatedCourse);
  };

  return (
    <div className="min-h-screen bg-[#f5f9fc]">
      {/* <InstructorHeader /> */}

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {selectedCourse ? (
          <CourseDetailView
            course={selectedCourse}
            onBack={handleBackToDashboard}
            onCourseUpdate={handleCourseUpdate}
          />
        ) : (
          <AssignedCoursesList
            courses={courses}
            onCourseSelect={handleCourseSelect}
            isModalOpen={isCreateModalOpen}
            setIsModalOpen={setIsCreateModalOpen}
          />
        )}
        <CreateCourseModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
          }}
        />
      </main>
    </div>
  );
}
