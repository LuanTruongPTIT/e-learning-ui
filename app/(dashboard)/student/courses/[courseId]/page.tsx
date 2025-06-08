"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Removed unused accordion imports
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronLeft,
  BookOpen,
  Clock,
  CheckCircle,
  PlayCircle,
  FileText,
  Download,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getCourseDetails, CourseDetails } from "@/apis/student-courses";

// Mock data for course details based on actual system structure without sections
const mockCourseDetails = {
  course_id: "550e8400-e29b-41d4-a716-446655440000", // UUID format
  course_name: "Introduction to Web Development",
  description:
    "Learn the fundamentals of web development including HTML, CSS, JavaScript, and modern frameworks.",
  thumbnail_url:
    "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  instructor: {
    teacher_name: "Nguyen Van A",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  progress_percent: 25,
  total_lectures: 15,
  completed_lectures: 4,
  last_accessed: "2023-06-15T10:30:00Z",
  created_at: "2023-01-10T08:00:00Z",
  updated_at: "2023-05-20T14:15:00Z",
  status: "in_progress",
  lectures: [
    {
      id: "550e8400-e29b-41d4-a716-446655440101",
      title: "Introduction to HTML",
      content_type: "video",
      is_completed: true,
      content_url: "https://example.com/videos/intro-to-html.mp4",
      description: "An introduction to HTML structure and basic elements",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440102",
      title: "HTML Elements and Attributes",
      content_type: "video",
      is_completed: true,
      content_url: "https://example.com/videos/html-elements.mp4",
      description: "Learn about different HTML elements and their attributes",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440103",
      title: "HTML Forms",
      content_type: "video",
      is_completed: true,
      content_url: "https://example.com/videos/html-forms.mp4",
      description: "Creating interactive forms with HTML",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440201",
      title: "CSS Basics",
      content_type: "video",
      is_completed: true,
      content_url: "https://example.com/videos/css-basics.mp4",
      description: "Introduction to CSS selectors and properties",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440202",
      title: "CSS Box Model",
      content_type: "video",
      is_completed: false,
      content_url: "https://example.com/videos/css-box-model.mp4",
      description: "Understanding the CSS box model",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440203",
      title: "Flexbox Layout",
      content_type: "video",
      is_completed: false,
      content_url: "https://example.com/videos/flexbox.mp4",
      description: "Creating flexible layouts with CSS Flexbox",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440204",
      title: "CSS Grid Layout",
      content_type: "video",
      is_completed: false,
      content_url: "https://example.com/videos/css-grid.mp4",
      description: "Building complex layouts with CSS Grid",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440301",
      title: "JavaScript Syntax",
      content_type: "video",
      is_completed: false,
      content_url: "https://example.com/videos/js-syntax.mp4",
      description: "Basic JavaScript syntax and data types",
      order_index: 8,
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440302",
      title: "JavaScript Functions",
      content_type: "video",
      is_completed: false,
      content_url: "https://example.com/videos/js-functions.mp4",
      description: "Working with functions in JavaScript",
    },
  ],
  announcements: [
    {
      id: "announcement-1",
      title: "New Content Added",
      content:
        "We've added new lectures on React Hooks. Check out the latest lectures!",
      date: "2023-05-20T14:15:00Z",
    },
    {
      id: "announcement-2",
      title: "Live Q&A Session",
      content:
        "Join us for a live Q&A session on June 30th at 3 PM to get your questions answered.",
      date: "2023-06-10T09:00:00Z",
    },
  ],
  resources: [
    {
      id: "resource-3",
      title: "JavaScript Code Samples",
      content_type: "zip",
      content_url: "/resources/js-samples.zip",
    },
  ],
};

export default function CourseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId;

  const [course, setCourse] = useState<CourseDetails | null>();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    // Fetch course details from API
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await getCourseDetails(courseId as string);
        console.log(response);
        setCourse(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  // Format date to readable format
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate total lectures and completed lectures
  const calculateProgress = () => {
    if (!course) return { total: 0, completed: 0, percentage: 0 };

    const total = course.lectures.length;
    const completed = course.lectures.filter(
      (lecture) => lecture.isCompleted
    ).length;

    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  const progress = course
    ? calculateProgress()
    : { total: 0, completed: 0, percentage: 0 };

  // Find the next lecture to continue
  const findNextLecture = () => {
    if (!course) return null;

    // Find the first incomplete lecture
    const nextLecture = course.lectures.find((lecture) => !lecture.isCompleted);

    if (nextLecture) {
      return { lectureId: nextLecture.id };
    }

    // If all lectures are completed, return the first lecture
    if (course.lectures.length > 0) {
      return { lectureId: course.lectures[0].id };
    }

    return null;
  };

  const nextLecture = course ? findNextLecture() : null;

  // Handle continue learning button click
  const handleContinueLearning = () => {
    if (nextLecture) {
      router.push(
        `/student/courses/${courseId}/learn/${nextLecture.lectureId}`
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Link href="/student/courses">
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to Courses
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The course you're looking for doesn't exist or you don't have access
            to it.
          </p>
          <Link href="/student/courses">
            <Button>Go Back to My Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center mb-6">
        <Link href="/student/courses">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Courses
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Info - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative rounded-lg overflow-hidden h-[300px] w-full">
            <Image
              src={course.thumbnailUrl}
              alt={course.courseName}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Button size="lg" onClick={handleContinueLearning}>
                <PlayCircle className="mr-2 h-5 w-5" />
                Continue Learning
              </Button>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">{course.courseName}</h1>
            <p className="text-muted-foreground mb-4">{course.description}</p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Instructor: {course.instructor.teacherName}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{progress.total} lectures</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Progress: {course.progressPercent}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Last updated: {formatDate(course.updatedAt)}</span>
              </div>
            </div>
          </div>

          <div className="border rounded-md p-4 bg-muted/20">
            <div className="flex justify-between text-sm mb-1">
              <span>Your progress</span>
              <span>{progress.percentage}% complete</span>
            </div>
            <Progress value={progress.percentage} className="h-2 mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {progress.completed}/{progress.total} lectures completed
              </span>
              <span>Last accessed: {formatDate(course.lastAccessed)}</span>
            </div>
          </div>

          <Tabs defaultValue="content" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Course Content</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 pt-4">
              <div className="border rounded-md divide-y">
                {course.lectures.map((lecture, index) => (
                  <Link
                    key={lecture.id}
                    href={`/student/courses/${courseId}/learn/${lecture.id}`}
                  >
                    <div
                      className={`flex items-center justify-between p-4 hover:bg-muted/50 ${
                        lecture.isCompleted ? "bg-muted/20" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {lecture.isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <PlayCircle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <div className="font-medium">
                            {index + 1}. {lecture.title}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span>{lecture.contentType}</span>
                            <span>•</span>
                            <span>{lecture.description}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        {lecture.isCompleted ? (
                          <Badge
                            variant="success"
                            className="bg-green-100 text-green-800"
                          >
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not completed</Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="announcements" className="space-y-4 pt-4">
              {course.announcements.length > 0 ? (
                course.announcements.map((announcement) => (
                  <Card key={announcement.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {announcement.title}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(announcement.date)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>{announcement.content}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 border rounded-md bg-muted/20">
                  <h3 className="text-lg font-medium">No announcements yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Check back later for updates from your instructor
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="resources" className="space-y-4 pt-4">
              {course.resources.length > 0 ? (
                <div className="border rounded-md divide-y">
                  {course.resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{resource.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {resource.contentType.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={resource.contentUrl}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md bg-muted/20">
                  <h3 className="text-lg font-medium">
                    No resources available
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    The instructor hasn't added any downloadable resources yet
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Instructor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={course.instructor.avatar}
                    alt={course.instructor.teacherName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">
                    {course.instructor.teacherName}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" onClick={handleContinueLearning}>
            <PlayCircle className="mr-2 h-5 w-5" />
            Continue Learning
          </Button>
        </div>
      </div>
    </div>
  );
}
