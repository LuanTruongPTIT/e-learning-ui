"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  getTeacherDashboard,
  TeacherDashboardData,
} from "@/apis/teacher-dashboard";
import {
  BookOpen,
  Users,
  GraduationCap,
  Trophy,
  FileText,
  TrendingUp,
  AlertCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";

// Import chart components
import { TeacherOverviewChart } from "@/components/charts/TeacherOverviewChart";
import { CourseProgressChart } from "@/components/charts/CourseProgressChart";
import { StudentPerformancePieChart } from "@/components/charts/StudentPerformancePieChart";
import { AssignmentStatusChart } from "@/components/charts/AssignmentStatusChart";
import { ClassComparisonChart } from "@/components/charts/ClassComparisonChart";
import { ActivityTrendsChart } from "@/components/charts/ActivityTrendsChart";
import { RealTimeStatsChart } from "@/components/charts/RealTimeStatsChart";

export default function TeacherPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] =
    useState<TeacherDashboardData | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getTeacherDashboard();
      setDashboardData(response.data);
    } catch (err) {
      console.error("Error fetching teacher dashboard:", err);
      setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "assignment_submit":
        return <Trophy className="h-4 w-4 text-green-600" />;
      case "lecture_complete":
        return <BookOpen className="h-4 w-4 text-blue-600" />;
      case "course_access":
        return <FileText className="h-4 w-4 text-purple-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "assignment_submit":
        return "bg-green-50 border-green-200";
      case "lecture_complete":
        return "bg-blue-50 border-blue-200";
      case "course_access":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - activityTime.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Vừa xong";
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ngày trước`;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích</TabsTrigger>
          <TabsTrigger value="courses">Khóa học</TabsTrigger>
          <TabsTrigger value="classes">Lớp học</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Real-time Statistics */}
          {!loading && dashboardData && (
            <RealTimeStatsChart
              totalStudents={dashboardData.totalStudents}
              totalCourses={dashboardData.totalCourses}
              averageCompletionRate={dashboardData.averageCompletionRate}
              recentActivitiesCount={dashboardData.recentActivities.length}
            />
          )}

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng số học sinh
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-[100px]" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {dashboardData?.totalStudents || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Trong tất cả các lớp
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Số khóa học
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-[100px]" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {dashboardData?.totalCourses || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Đang giảng dạy
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tỷ lệ hoàn thành trung bình
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-[100px]" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {dashboardData?.averageCompletionRate.toFixed(1) || 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Của tất cả học sinh
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Điểm trung bình
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-[100px]" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {dashboardData?.averageGrade.toFixed(1) || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Điểm bài tập trung bình
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Charts and Activities */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Xu hướng hiệu suất giảng dạy
                </CardTitle>
                <CardDescription>
                  Tiến độ học sinh và hoàn thành bài tập theo thời gian
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[350px] w-full" />
                ) : (
                  <TeacherOverviewChart
                    dashboardData={dashboardData || undefined}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Trạng thái bài tập
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <AssignmentStatusChart
                    completed={dashboardData?.completedAssignments || 0}
                    pending={dashboardData?.pendingAssignments || 0}
                    total={dashboardData?.totalAssignments || 0}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Hoạt động gần đây
              </CardTitle>
              <CardDescription>
                Hoạt động của học sinh trong các khóa học
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {dashboardData?.recentActivities &&
                  dashboardData.recentActivities.length > 0 ? (
                    dashboardData.recentActivities.map((activity, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${getActivityColor(
                          activity.activityType
                        )}`}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {getActivityIcon(activity.activityType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-600">
                              {activity.studentName}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-600">
                              {activity.courseName}
                            </span>
                            {activity.score && (
                              <>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-green-600 font-medium">
                                  Điểm: {activity.score}
                                </span>
                              </>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTimeAgo(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Chưa có hoạt động nào</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Phân bố hiệu suất học sinh</CardTitle>
                <CardDescription>
                  Phân chia học sinh theo mức độ hoàn thành
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[350px] w-full" />
                ) : (
                  <StudentPerformancePieChart
                    courseOverviews={dashboardData?.courseOverviews || []}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>So sánh hiệu suất các lớp</CardTitle>
                <CardDescription>
                  Radar chart so sánh các metrics quan trọng
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[350px] w-full" />
                ) : (
                  <ClassComparisonChart
                    classes={dashboardData?.classSummaries || []}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tiến độ theo khóa học</CardTitle>
              <CardDescription>
                Chi tiết tiến độ của từng khóa học
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[350px] w-full" />
              ) : (
                <CourseProgressChart
                  courses={dashboardData?.courseOverviews || []}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Xu hướng hoạt động</CardTitle>
              <CardDescription>
                Biểu đồ xu hướng hoạt động của học sinh theo tuần
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ActivityTrendsChart
                  recentActivities={dashboardData?.recentActivities || []}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid gap-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              dashboardData?.courseOverviews.map((course) => (
                <Card key={course.courseId}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {course.courseName}
                        </CardTitle>
                        <CardDescription>
                          Lớp: {course.className}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {course.enrolledStudents} học sinh
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {course.averageProgress.toFixed(1)}%
                        </div>
                        <p className="text-xs text-gray-600">Tiến độ TB</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {course.completedStudents}
                        </div>
                        <p className="text-xs text-gray-600">Hoàn thành</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {course.inProgressStudents}
                        </div>
                        <p className="text-xs text-gray-600">Đang học</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">
                          {course.notStartedStudents}
                        </div>
                        <p className="text-xs text-gray-600">Chưa bắt đầu</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress
                        value={course.averageProgress}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <>
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </>
            ) : (
              dashboardData?.classSummaries.map((classItem) => (
                <Card key={classItem.classId}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {classItem.className}
                    </CardTitle>
                    <CardDescription>{classItem.programName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Học sinh</span>
                        <Badge variant="outline">
                          {classItem.studentCount}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Khóa học</span>
                        <Badge variant="outline">{classItem.courseCount}</Badge>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Tiến độ trung bình</span>
                          <span>{classItem.averageProgress.toFixed(1)}%</span>
                        </div>
                        <Progress
                          value={classItem.averageProgress}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
