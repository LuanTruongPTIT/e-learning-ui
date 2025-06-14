"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  FileText,
  Filter,
  Search,
  Users,
  BookOpen,
  GraduationCap,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { TeachingAssignCourseResponse } from "@/apis/teacher";
import Image from "next/image";

interface AssignedCoursesListProps {
  courses: TeachingAssignCourseResponse[];
  onCourseSelect: (course: TeachingAssignCourseResponse) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

export default function AssignedCoursesList({
  courses,
  onCourseSelect,
  isModalOpen,
  setIsModalOpen,
}: AssignedCoursesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("lastUpdated");

  // Get unique departments for filter
  // const departments = Array.from(
  //   new Set(courses.map((course) => course.department))
  // );

  // Filter and sort courses
  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch =
        course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || course.status === statusFilter;

      // const matchesDepartment =
      //   departmentFilter === "all" || course.department === departmentFilter;

      // return matchesSearch && matchesStatus && matchesDepartment;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "lastUpdated":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "title":
          return a.course_name.localeCompare(b.course_name);
        case "startDate":
          return (
            new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
          );
        default:
          return 0;
      }
    });

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Assigned Courses</h1>
          <p className="text-muted-foreground mt-1">
            Manage courses you&apos;ve been assigned to teach
          </p>
        </div>
        <div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
            </SelectContent>
          </Select>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <GraduationCap className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {/* {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))} */}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastUpdated">Last Updated</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="startDate">Start Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md bg-white">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No courses found</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {searchQuery || statusFilter !== "all" || departmentFilter !== "all"
              ? "Try adjusting your search or filters"
              : "You haven&apos;t been assigned any courses yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-none shadow-sm"
              onClick={() => onCourseSelect(course)}
            >
              <div className="h-36 bg-secondary/50 relative">
                <Image
                  src={course.thumbnail_url || "/placeholder.svg"}
                  alt={course.course_name}
                  className="object-cover"
                  fill
                />
                <Badge
                  variant="outline"
                  className={`absolute top-2 right-2 capitalize ${getStatusBadgeVariant(
                    course.status
                  )}`}
                >
                  {course.status}
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{course.course_name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {format(new Date(course.start_date), "MMM d, yyyy")} -{" "}
                    {format(new Date(course.end_date), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  {/* <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-primary" />
                    <span>0 students</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1 text-primary" />
                    <span>0 materials</span>
                  </div> */}
                </div>
                {/* <div className="mt-2 text-xs text-muted-foreground">
                  <span className="font-medium">Department:</span>{" "}
                  N/A
                </div> */}
              </CardContent>
              <CardFooter className="border-t pt-3 text-xs text-muted-foreground">
                <div className="flex items-center">
                  Last updated:{" "}
                  {format(new Date(course.created_at), "MMM d, yyyy")}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
