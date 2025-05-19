"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Loader2 } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { getEnrolledCourses, EnrolledCourse } from "@/apis/student-courses";

// Mock data for enrolled courses
// const mockEnrolledCourses = [
//   {
//     id: "course-1",
//     title: "Introduction to Web Development",
//     description:
//       "Learn the basics of HTML, CSS, and JavaScript to build modern websites.",
//     thumbnail:
//       "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     instructor: "John Doe",
//     progress: 65,
//     total_lectures: 24,
//     completed_lectures: 16,
//     last_accessed: "2023-06-15T10:30:00Z",
//     category: "Web Development",
//     status: "in_progress",
//   },
//   {
//     id: "course-2",
//     title: "Advanced JavaScript Programming",
//     description:
//       "Master JavaScript with advanced concepts like closures, promises, and async/await.",
//     thumbnail:
//       "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     instructor: "Jane Smith",
//     progress: 30,
//     total_lectures: 32,
//     completed_lectures: 10,
//     last_accessed: "2023-06-18T14:45:00Z",
//     category: "Programming",
//     status: "in_progress",
//   },
//   {
//     id: "course-3",
//     title: "Database Design and SQL",
//     description:
//       "Learn how to design efficient databases and write complex SQL queries.",
//     thumbnail:
//       "https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     instructor: "Robert Johnson",
//     progress: 100,
//     total_lectures: 18,
//     completed_lectures: 18,
//     last_accessed: "2023-06-10T09:15:00Z",
//     category: "Database",
//     status: "completed",
//   },
//   {
//     id: "course-4",
//     title: "Mobile App Development with React Native",
//     description: "Build cross-platform mobile applications using React Native.",
//     thumbnail:
//       "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     instructor: "Sarah Williams",
//     progress: 10,
//     total_lectures: 30,
//     completed_lectures: 3,
//     last_accessed: "2023-06-20T16:20:00Z",
//     category: "Mobile Development",
//     status: "in_progress",
//   },
//   {
//     id: "course-5",
//     title: "Data Structures and Algorithms",
//     description:
//       "Master the fundamental data structures and algorithms used in software development.",
//     thumbnail:
//       "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     instructor: "Michael Brown",
//     progress: 45,
//     total_lectures: 40,
//     completed_lectures: 18,
//     last_accessed: "2023-06-17T11:10:00Z",
//     category: "Computer Science",
//     status: "in_progress",
//   },
//   {
//     id: "course-6",
//     title: "Introduction to Artificial Intelligence",
//     description:
//       "Learn the basics of AI, machine learning, and neural networks.",
//     thumbnail:
//       "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2065&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     instructor: "Emily Davis",
//     progress: 0,
//     total_lectures: 28,
//     completed_lectures: 0,
//     last_accessed: null,
//     category: "Artificial Intelligence",
//     status: "not_started",
//   },
// ];

export default function StudentCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);

  useEffect(() => {
    // Simulate API call to fetch enrolled courses
    const fetchEnrolledCourses = async () => {
      try {
        // Fetch enrolled courses from API
        const response = await getEnrolledCourses();
        setEnrolledCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  // Filter courses based on search query and active tab
  const filteredCourses = enrolledCourses.filter((course) => {
    const matchesSearch =
      course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacher_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "in_progress")
      return matchesSearch && course.status === "in_progress";
    if (activeTab === "completed")
      return matchesSearch && course.status === "completed";
    if (activeTab === "not_started")
      return matchesSearch && course.status === "not_started";

    return matchesSearch;
  });

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "Not started yet";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Courses</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
          />
        </div>

        <Tabs
          defaultValue="all"
          className="w-full sm:w-auto"
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="not_started">Not Started</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.course_id}
              id={course.course_id}
              title={course.course_name}
              description={course.description}
              thumbnail={course.thumbnail_url}
              instructor={course.teacher_name}
              progress={course.progress_percentage}
              totalLectures={course.total_lectures}
              completedLectures={course.completed_lectures}
              lastAccessed={course?.last_accessed}
              status={
                course.status as "completed" | "in_progress" | "not_started"
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md bg-muted/20">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No courses found</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {searchQuery
              ? "Try a different search term"
              : "You haven't enrolled in any courses yet"}
          </p>
        </div>
      )}
    </div>
  );
}
