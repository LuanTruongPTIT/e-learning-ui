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
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Activity,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { EnrolledCourse } from "@/apis/student-courses";
import {
  getStudentDashboardData,
  getUpcomingDeadlines,
  Deadline,
  ProgressData,
  StudyTimeData,
  SubjectDistribution,
  Activity as ActivityType,
} from "@/apis/student-dashboard";
import { CourseProgressChart } from "@/components/dashboard/student/course-progress-chart";
import { WeeklyStudyChart } from "@/components/dashboard/student/weekly-study-chart";
import { SubjectDistributionChart } from "@/components/dashboard/student/subject-distribution-chart";
import { LearningActivityTimeline } from "@/components/dashboard/student/learning-activity-timeline";
import { RecentCourseCard } from "@/components/dashboard/student/recent-course-card";
import { UpcomingDeadlineCard } from "@/components/dashboard/student/upcoming-deadline-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { NotificationList } from "@/components/notifications/NotificationList";

// Mock data for enrolled courses (will be replaced with API data)
const mockEnrolledCourses = [
  {
    id: "course-1",
    title: "Introduction to Web Development",
    description:
      "Learn the basics of HTML, CSS, and JavaScript to build modern websites.",
    thumbnail:
      "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    instructor: "John Doe",
    progress: 65,
    total_lectures: 24,
    completed_lectures: 16,
    last_accessed: "2023-06-15T10:30:00Z",
    category: "Web Development",
    status: "in_progress",
  },
  {
    id: "course-2",
    title: "Advanced JavaScript Programming",
    description:
      "Master JavaScript with advanced concepts like closures, promises, and async/await.",
    thumbnail:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    instructor: "Jane Smith",
    progress: 30,
    total_lectures: 32,
    completed_lectures: 10,
    last_accessed: "2023-06-18T14:45:00Z",
    category: "Programming",
    status: "in_progress",
  },
  {
    id: "course-3",
    title: "Database Design and SQL",
    description:
      "Learn how to design efficient databases and write complex SQL queries.",
    thumbnail:
      "https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    instructor: "Robert Johnson",
    progress: 100,
    total_lectures: 18,
    completed_lectures: 18,
    last_accessed: "2023-06-10T09:15:00Z",
    category: "Database",
    status: "completed",
  },
  {
    id: "course-4",
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile applications using React Native.",
    thumbnail:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    instructor: "Sarah Williams",
    progress: 10,
    total_lectures: 30,
    completed_lectures: 3,
    last_accessed: "2023-06-20T16:20:00Z",
    category: "Mobile Development",
    status: "in_progress",
  },
  {
    id: "course-5",
    title: "Data Structures and Algorithms",
    description:
      "Master the fundamental data structures and algorithms used in software development.",
    thumbnail:
      "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    instructor: "Michael Brown",
    progress: 45,
    total_lectures: 40,
    completed_lectures: 18,
    last_accessed: "2023-06-17T11:10:00Z",
    category: "Computer Science",
    status: "in_progress",
  },
  {
    id: "course-6",
    title: "Introduction to Artificial Intelligence",
    description:
      "Learn the basics of AI, machine learning, and neural networks.",
    thumbnail:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2065&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    instructor: "Emily Davis",
    progress: 0,
    total_lectures: 28,
    completed_lectures: 0,
    last_accessed: null,
    category: "Artificial Intelligence",
    status: "not_started",
  },
];

// Mock data for upcoming deadlines
const mockUpcomingDeadlines = [
  {
    id: "deadline-1",
    title: "JavaScript Final Project",
    course: "Advanced JavaScript Programming",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    type: "assignment",
  },
  {
    id: "deadline-2",
    title: "Database Design Quiz",
    course: "Database Design and SQL",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    type: "quiz",
  },
  {
    id: "deadline-3",
    title: "React Native App Submission",
    course: "Mobile App Development with React Native",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    type: "project",
  },
];

// Mock data for recent activities
const mockRecentActivities = [
  {
    id: "activity-1",
    type: "completed_lecture",
    course: "Introduction to Web Development",
    title: "CSS Flexbox and Grid",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: "activity-2",
    type: "started_course",
    course: "Mobile App Development with React Native",
    title: "Getting Started with React Native",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "activity-3",
    type: "completed_quiz",
    course: "Advanced JavaScript Programming",
    title: "Promises and Async/Await Quiz",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    score: 85,
  },
  {
    id: "activity-4",
    type: "submitted_assignment",
    course: "Database Design and SQL",
    title: "Database Schema Design",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
];

export default function StudentDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<{
    stats: {
      totalCourses: number;
      completedCourses: number;
      inProgressCourses: number;
      notStartedCourses: number;
      overallProgress: number;
    };
    recentCourses: EnrolledCourse[];
    upcomingDeadlines: Deadline[];
    recentActivities: ActivityType[];
    progressData: ProgressData[];
    weeklyStudyData: StudyTimeData[];
    subjectDistribution: SubjectDistribution[];
  } | null>(null);

  useEffect(() => {
    // Fetch dashboard data from API
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        try {
          // Fetch upcoming deadlines from real API
          const deadlinesResponse = await getUpcomingDeadlines();
          let realUpcomingDeadlines: Deadline[] = [];

          if (deadlinesResponse.status === 200 && deadlinesResponse.data) {
            realUpcomingDeadlines = deadlinesResponse.data.deadlines.map(
              (deadline) => ({
                id: deadline.id,
                title: deadline.title,
                course: deadline.course,
                dueDate: deadline.dueDate,
                type: deadline.type,
                isNew: deadline.isNew,
              })
            );
          }

          // In a production environment, use the real API call:
          const response = await getStudentDashboardData();
          setDashboardData({
            ...response.data,
            upcomingDeadlines:
              realUpcomingDeadlines.length > 0
                ? realUpcomingDeadlines
                : (mockUpcomingDeadlines as unknown as Deadline[]),
          });
          setLoading(false);
        } catch (apiError) {
          console.error("Error fetching dashboard data from API:", apiError);

          // Try to fetch at least upcoming deadlines
          try {
            const deadlinesResponse = await getUpcomingDeadlines();
            if (deadlinesResponse.status === 200 && deadlinesResponse.data) {
              const realUpcomingDeadlines =
                deadlinesResponse.data.deadlines.map((deadline) => ({
                  id: deadline.id,
                  title: deadline.title,
                  course: deadline.course,
                  dueDate: deadline.dueDate,
                  type: deadline.type,
                  isNew: deadline.isNew,
                }));

              // Fallback to mock data with real deadlines
              setDashboardData({
                stats: {
                  totalCourses: mockEnrolledCourses.length,
                  completedCourses: mockEnrolledCourses.filter(
                    (course) => course.status === "completed"
                  ).length,
                  inProgressCourses: mockEnrolledCourses.filter(
                    (course) => course.status === "in_progress"
                  ).length,
                  notStartedCourses: mockEnrolledCourses.filter(
                    (course) => course.status === "not_started"
                  ).length,
                  overallProgress: Math.round(
                    mockEnrolledCourses.reduce(
                      (acc, course) => acc + course.progress,
                      0
                    ) / mockEnrolledCourses.length
                  ),
                },
                recentCourses: mockEnrolledCourses
                  .filter((course) => course.last_accessed)
                  .sort((a, b) => {
                    if (!a.last_accessed) return 1;
                    if (!b.last_accessed) return -1;
                    return (
                      new Date(b.last_accessed).getTime() -
                      new Date(a.last_accessed).getTime()
                    );
                  })
                  .slice(0, 3) as unknown as EnrolledCourse[],
                upcomingDeadlines: realUpcomingDeadlines,
                recentActivities:
                  mockRecentActivities as unknown as ActivityType[],
                progressData: [
                  { month: "Jan", progress: 10 },
                  { month: "Feb", progress: 25 },
                  { month: "Mar", progress: 30 },
                  { month: "Apr", progress: 45 },
                  { month: "May", progress: 60 },
                  { month: "Jun", progress: 75 },
                  { month: "Jul", progress: 85 },
                ],
                weeklyStudyData: [
                  { day: "Mon", hours: 2.5 },
                  { day: "Tue", hours: 1.8 },
                  { day: "Wed", hours: 3.2 },
                  { day: "Thu", hours: 2.0 },
                  { day: "Fri", hours: 1.5 },
                  { day: "Sat", hours: 4.0 },
                  { day: "Sun", hours: 3.5 },
                ],
                subjectDistribution: [
                  { name: "Web Development", value: 2, color: "#4f46e5" },
                  { name: "Programming", value: 1, color: "#10b981" },
                  { name: "Database", value: 1, color: "#f59e0b" },
                  { name: "Mobile Development", value: 1, color: "#ef4444" },
                  { name: "Computer Science", value: 1, color: "#8b5cf6" },
                ],
              });
            } else {
              throw new Error("Failed to fetch deadlines");
            }
          } catch (deadlineError) {
            console.error("Error fetching deadlines:", deadlineError);

            // Complete fallback to mock data
            setDashboardData({
              stats: {
                totalCourses: mockEnrolledCourses.length,
                completedCourses: mockEnrolledCourses.filter(
                  (course) => course.status === "completed"
                ).length,
                inProgressCourses: mockEnrolledCourses.filter(
                  (course) => course.status === "in_progress"
                ).length,
                notStartedCourses: mockEnrolledCourses.filter(
                  (course) => course.status === "not_started"
                ).length,
                overallProgress: Math.round(
                  mockEnrolledCourses.reduce(
                    (acc, course) => acc + course.progress,
                    0
                  ) / mockEnrolledCourses.length
                ),
              },
              recentCourses: mockEnrolledCourses
                .filter((course) => course.last_accessed)
                .sort((a, b) => {
                  if (!a.last_accessed) return 1;
                  if (!b.last_accessed) return -1;
                  return (
                    new Date(b.last_accessed).getTime() -
                    new Date(a.last_accessed).getTime()
                  );
                })
                .slice(0, 3) as unknown as EnrolledCourse[],
              upcomingDeadlines: mockUpcomingDeadlines as unknown as Deadline[],
              recentActivities:
                mockRecentActivities as unknown as ActivityType[],
              progressData: [
                { month: "Jan", progress: 10 },
                { month: "Feb", progress: 25 },
                { month: "Mar", progress: 30 },
                { month: "Apr", progress: 45 },
                { month: "May", progress: 60 },
                { month: "Jun", progress: 75 },
                { month: "Jul", progress: 85 },
              ],
              weeklyStudyData: [
                { day: "Mon", hours: 2.5 },
                { day: "Tue", hours: 1.8 },
                { day: "Wed", hours: 3.2 },
                { day: "Thu", hours: 2.0 },
                { day: "Fri", hours: 1.5 },
                { day: "Sat", hours: 4.0 },
                { day: "Sun", hours: 3.5 },
              ],
              subjectDistribution: [
                { name: "Web Development", value: 2, color: "#4f46e5" },
                { name: "Programming", value: 1, color: "#10b981" },
                { name: "Database", value: 1, color: "#f59e0b" },
                { name: "Mobile Development", value: 1, color: "#ef4444" },
                { name: "Computer Science", value: 1, color: "#8b5cf6" },
              ],
            });
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in fetchDashboardData:", error);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Use data from API or fallback to mock data if API call hasn't completed yet
  const stats = dashboardData?.stats || {
    totalCourses: mockEnrolledCourses.length,
    completedCourses: mockEnrolledCourses.filter(
      (course) => course.status === "completed"
    ).length,
    inProgressCourses: mockEnrolledCourses.filter(
      (course) => course.status === "in_progress"
    ).length,
    notStartedCourses: mockEnrolledCourses.filter(
      (course) => course.status === "not_started"
    ).length,
    overallProgress:
      mockEnrolledCourses.length > 0
        ? Math.round(
            mockEnrolledCourses.reduce(
              (acc, course) => acc + course.progress,
              0
            ) / mockEnrolledCourses.length
          )
        : 0,
  };

  const { totalCourses, completedCourses, inProgressCourses, overallProgress } =
    stats;

  // Get recent courses from API or fallback to mock data
  const recentCourses =
    dashboardData?.recentCourses ||
    [...mockEnrolledCourses]
      .filter((course) => course.last_accessed)
      .sort((a, b) => {
        if (!a.last_accessed) return 1;
        if (!b.last_accessed) return -1;
        return (
          new Date(b.last_accessed).getTime() -
          new Date(a.last_accessed).getTime()
        );
      })
      .slice(0, 3);

  // Get upcoming deadlines from API or fallback to mock data
  const upcomingDeadlines =
    dashboardData?.upcomingDeadlines || mockUpcomingDeadlines;

  // Get recent activities from API or fallback to mock data
  const recentActivities =
    dashboardData?.recentActivities || mockRecentActivities;

  // Get chart data from API or fallback to mock data
  const progressData = dashboardData?.progressData || [
    { month: "Jan", progress: 10 },
    { month: "Feb", progress: 25 },
    { month: "Mar", progress: 30 },
    { month: "Apr", progress: 45 },
    { month: "May", progress: 60 },
    { month: "Jun", progress: 75 },
    { month: "Jul", progress: 85 },
  ];

  const weeklyStudyData = dashboardData?.weeklyStudyData || [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 1.8 },
    { day: "Wed", hours: 3.2 },
    { day: "Thu", hours: 2.0 },
    { day: "Fri", hours: 1.5 },
    { day: "Sat", hours: 4.0 },
    { day: "Sun", hours: 3.5 },
  ];

  const subjectDistribution = dashboardData?.subjectDistribution || [
    { name: "Web Development", value: 2, color: "#4f46e5" },
    { name: "Programming", value: 1, color: "#10b981" },
    { name: "Database", value: 1, color: "#f59e0b" },
    { name: "Mobile Development", value: 1, color: "#ef4444" },
    { name: "Computer Science", value: 1, color: "#8b5cf6" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <Link href="/student/courses">
          <Button>View All Courses</Button>
        </Link>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Learning Progress</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="deadlines">Upcoming Deadlines</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCourses}</div>
                <p className="text-xs text-muted-foreground">
                  Enrolled courses
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  In Progress
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressCourses}</div>
                <p className="text-xs text-muted-foreground">
                  Courses in progress
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedCourses}</div>
                <p className="text-xs text-muted-foreground">
                  Completed courses
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Overall Progress
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallProgress}%</div>
                <Progress value={overallProgress} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Charts and Recent Courses */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>
                  Your course completion progress over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CourseProgressChart data={progressData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Subject Distribution</CardTitle>
                <CardDescription>Courses by subject area</CardDescription>
              </CardHeader>
              <CardContent>
                <SubjectDistributionChart data={subjectDistribution} />
              </CardContent>
            </Card>
          </div>

          {/* Recent Courses and Upcoming Deadlines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Courses</CardTitle>
                <CardDescription>Continue where you left off</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCourses.map((course) => (
                    <RecentCourseCard key={course.id} course={course} />
                  ))}
                  {recentCourses.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No recent courses
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>
                  Don&apos;t miss these deadlines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeadlines.map((deadline) => (
                    <UpcomingDeadlineCard
                      key={deadline.id}
                      deadline={deadline}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          {/* Learning Progress Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
                <CardDescription>
                  Your progress across all courses
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <CourseProgressChart data={progressData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Weekly Study Time</CardTitle>
                <CardDescription>Hours spent studying per day</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <WeeklyStudyChart data={weeklyStudyData} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Course Completion Status</CardTitle>
              <CardDescription>
                Progress for each enrolled course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recentCourses
                  ? dashboardData.recentCourses.map((course) => (
                      <div key={course.id} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{course.title}</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            {course.completedLectures ||
                              course.completed_lectures}{" "}
                            of {course.totalLectures || course.total_lectures}{" "}
                            lectures completed
                          </span>
                          <span>{course.category}</span>
                        </div>
                      </div>
                    ))
                  : mockEnrolledCourses.map((course) => (
                      <div key={course.id} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{course.title}</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            {course.completed_lectures} of{" "}
                            {course.total_lectures} lectures completed
                          </span>
                          <span>{course.category}</span>
                        </div>
                      </div>
                    ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          {/* Recent Activity Content */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Activity Timeline</CardTitle>
              <CardDescription>Your recent learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              <LearningActivityTimeline activities={recentActivities} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deadlines" className="space-y-4">
          {/* Upcoming Deadlines Content */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>
                Assignments, quizzes, and projects due soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <UpcomingDeadlineCard key={deadline.id} deadline={deadline} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
