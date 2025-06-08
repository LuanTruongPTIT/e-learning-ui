/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  FileText,
  MoreHorizontal,
  Settings,
  Users,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
// import TeachingPlans from "@/components/instructor-dashboard/teaching-plans";
import CourseMaterials from "./course-materials";
import CourseStudents from "./course-students";
import CourseInformation from "./course-information";
import CourseAssignments from "./course-assignments";
import { TeachingAssignCourseResponse } from "@/apis/teacher";

interface CourseDetailViewProps {
  course: TeachingAssignCourseResponse;
  onBack: () => void;
  // onCourseUpdate: (updatedCourse: Course) => void;
}

export default function CourseDetailView({
  course,
  onBack,
}: // onCourseUpdate,
CourseDetailViewProps) {
  const [activeTab, setActiveTab] = useState("materials");

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 hover:bg-green-50";
      case "draft":
        return "bg-gray-50 text-gray-700 hover:bg-gray-50";
      case "upcoming":
        return "bg-blue-50 text-blue-700 hover:bg-blue-50";
      default:
        return "bg-gray-50 text-gray-700 hover:bg-gray-50";
    }
  };

  // const handleMaterialsUpdate = (materials: any[]) => {
  //   onCourseUpdate({
  //     ...course,
  //     materials,
  //     materialsCount: materials.length,
  //     lastUpdated: new Date(),
  //   });
  // };

  // const handleStudentsUpdate = (students: any[]) => {
  //   onCourseUpdate({
  //     ...course,
  //     students,
  //     studentsCount: students.length,
  //     lastUpdatced: new Date(),
  //   });
  // };

  // const handleTeachingPlansUpdate = (teachingPlans: any[]) => {
  //   onCourseUpdate({
  //     ...course,
  //     teachingPlans,
  //     lastUpdated: new Date(),
  //   });
  // };

  // const handleCourseInfoUpdate = (data: Partial<Course>) => {
  //   onCourseUpdate({
  //     ...course,
  //     ...data,
  //     lastUpdated: new Date(),
  //   });
  // };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={onBack} className="mr-2 p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{course.course_class_name}</h1>
        <Badge
          variant="outline"
          className={`ml-3 capitalize ${getStatusBadgeVariant(course.status)}`}
        >
          {course.status}
        </Badge>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <p className="text-muted-foreground">{course.description}</p>
          <div className="mt-2 text-sm">
            <span className="font-medium text-gray-700">Class:</span>{" "}
            {course.class_name}
          </div>
          {/* <div className="mt-1 text-sm">
            <span className="font-medium text-gray-700">Assigned by:</span>{" "}
          </div> */}
        </div>
        <div className="w-full md:w-1/3 flex flex-col sm:flex-row md:flex-col gap-4">
          <div className="flex items-center bg-white p-3 rounded-lg shadow-sm flex-1">
            <Calendar className="h-5 w-5 text-primary mr-3" />
            <div>
              <p className="text-xs text-muted-foreground">Course Duration</p>
              <p className="font-medium">
                {format(course.start_date, "MMM d")} -{" "}
                {format(course.end_date, "MMM d, yyyy")}
              </p>
            </div>
          </div>
          {/* <div className="flex items-center bg-white p-3 rounded-lg shadow-sm flex-1">
            <Users className="h-5 w-5 text-primary mr-3" />
            <div>
              <p className="text-xs text-muted-foreground">Enrolled Students</p>
              <p className="font-medium">0 students</p>
            </div>
          </div> */}
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-5 md:w-auto bg-secondary">
          <TabsTrigger
            value="materials"
            className="flex items-center gap-2 data-[state=active]:bg-white"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Materials</span>
          </TabsTrigger>
          <TabsTrigger
            value="assignments"
            className="flex items-center gap-2 data-[state=active]:bg-white"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Assignments</span>
          </TabsTrigger>
          {/* <TabsTrigger
            value="teaching-plans"
            className="flex items-center gap-2 data-[state=active]:bg-white"
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Teaching Plans</span>
          </TabsTrigger> */}
          {/* <TabsTrigger
            value="students"
            className="flex items-center gap-2 data-[state=active]:bg-white"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Students</span>
          </TabsTrigger>
          <TabsTrigger
            value="information"
            className="flex items-center gap-2 data-[state=active]:bg-white"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Information</span>
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="materials" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-secondary/50 rounded-t-lg">
              <CardTitle>Course Materials</CardTitle>
              <CardDescription>
                Upload and manage lecture documents, videos, and other course
                materials.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <CourseMaterials
                courseId={course.id}
                // materials={course.lectures}
                // onMaterialsChange={handleMaterialsUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-secondary/50 rounded-t-lg">
              <CardTitle>Course Assignments</CardTitle>
              <CardDescription>
                Create and manage assignments, quizzes, and homework for your
                students.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <CourseAssignments courseId={course.id} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="students" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-secondary/50 rounded-t-lg">
              <CardTitle>Student Management</CardTitle>
              <CardDescription>
                Add, remove, and manage students enrolled in this course.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <CourseStudents
                courseId={course.id}
                students={course.students}
                onStudentsChange={handleStudentsUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent> */}

        <TabsContent value="information" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-secondary/50 rounded-t-lg">
              <CardTitle>Course Information</CardTitle>
              <CardDescription>
                View course details and manage settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <CourseInformation
                course={course}
                // onUpdate={handleCourseInfoUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
