"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Search,
  Eye,
  BarChart3,
  GraduationCap,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import {
  getTeacherClasses,
  ClassOverview,
} from "@/apis/teacher-class-monitoring";

const ClassesMonitoringPage = () => {
  const [classes, setClasses] = useState<ClassOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call API to get all classes for the current teacher
      // The backend will automatically get teacher ID from JWT token
      const response = await getTeacherClasses();
      setClasses(response.data);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Không thể tải danh sách lớp học. Vui lòng thử lại.");

      // Fallback to mock data in case of API failure
      setClasses([
        {
          classId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
          className: "CS101 - Introduction to Programming",
          programName: "Computer Science Program",
          totalStudents: 25,
          activeStudents: 22,
          inactiveStudents: 3,
          averageProgress: 68.5,
          totalCourses: 4,
          completedAssignments: 12,
          pendingAssignments: 8,
          courseProgress: [],
          topPerformers: [],
          lowPerformers: [],
        },
        {
          classId: "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
          className: "WEB201 - Advanced Web Development",
          programName: "Computer Science Program",
          totalStudents: 18,
          activeStudents: 17,
          inactiveStudents: 1,
          averageProgress: 72.3,
          totalCourses: 3,
          completedAssignments: 9,
          pendingAssignments: 6,
          courseProgress: [],
          topPerformers: [],
          lowPerformers: [],
        },
        {
          classId: "b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
          className: "DB301 - Database Management",
          programName: "Information Technology",
          totalStudents: 30,
          activeStudents: 28,
          inactiveStudents: 2,
          averageProgress: 45.2,
          totalCourses: 5,
          completedAssignments: 15,
          pendingAssignments: 12,
          courseProgress: [],
          topPerformers: [],
          lowPerformers: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter(
    (cls) =>
      cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.programName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600 bg-green-50";
    if (progress >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getProgressIcon = (progress: number) => {
    if (progress >= 60) return <TrendingUp className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Đang tải danh sách lớp học...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý lớp học</h1>
          <p className="text-gray-600 mt-1">
            Theo dõi tiến độ học tập và hiệu suất của các lớp học
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm lớp học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button onClick={fetchClasses} variant="outline">
            <Loader2 className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng lớp học
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.length}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng sinh viên
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.reduce((acc, cls) => acc + cls.totalStudents, 0)}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tiến độ trung bình
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.length > 0
                    ? Math.round(
                        classes.reduce(
                          (acc, cls) => acc + cls.averageProgress,
                          0
                        ) / classes.length
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bài tập chờ</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.reduce(
                    (acc, cls) => acc + cls.pendingAssignments,
                    0
                  )}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClasses.map((classItem) => (
          <Card
            key={classItem.classId}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {classItem.className}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {classItem.programName}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`ml-2 ${getProgressColor(
                    classItem.averageProgress
                  )}`}
                >
                  <span className="flex items-center gap-1">
                    {getProgressIcon(classItem.averageProgress)}
                    {Math.round(classItem.averageProgress)}%
                  </span>
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Student Stats */}
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">
                    {classItem.totalStudents}
                  </p>
                  <p className="text-xs text-gray-600">Tổng SV</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">
                    {classItem.activeStudents}
                  </p>
                  <p className="text-xs text-gray-600">Hoạt động</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-red-600">
                    {classItem.inactiveStudents}
                  </p>
                  <p className="text-xs text-gray-600">Không hoạt động</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tiến độ trung bình</span>
                  <span className="font-medium">
                    {Math.round(classItem.averageProgress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${classItem.averageProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Course and Assignment Info */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>{classItem.totalCourses} khóa học</span>
                <span>{classItem.completedAssignments} BT hoàn thành</span>
                <span>{classItem.pendingAssignments} BT chờ</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button asChild size="sm" className="flex-1">
                  <Link href={`/teacher/classes/${classItem.classId}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Xem chi tiết
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href={`/teacher/classes/${classItem.classId}/students`}>
                    <Users className="h-4 w-4 mr-2" />
                    Sinh viên
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClasses.length === 0 && !loading && (
        <div className="text-center py-12">
          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy lớp học
          </h3>
          <p className="text-gray-600">
            {searchTerm
              ? "Thử tìm kiếm với từ khóa khác"
              : "Bạn chưa có lớp học nào"}
          </p>
          {error && (
            <Button onClick={fetchClasses} className="mt-4">
              Thử lại
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassesMonitoringPage;
