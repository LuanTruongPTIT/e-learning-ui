"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

// Mock data for course details
const mockCourseDetails = {
  id: "course-1",
  title: "Complete Web Development Bootcamp",
  description:
    "Learn web development from scratch. This comprehensive course covers HTML, CSS, JavaScript, React, Node.js, and more.",
  thumbnail:
    "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  instructor: {
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    title: "Senior Web Developer",
    bio: "John has 10+ years of experience in web development and has taught over 50,000 students online.",
  },
  progress: 25,
  total_lectures: 48,
  completed_lectures: 12,
  total_duration: "24h 30m",
  last_accessed: "2023-06-15T10:30:00Z",
  created_at: "2023-01-10T08:00:00Z",
  updated_at: "2023-05-20T14:15:00Z",
  category: "Web Development",
  level: "Beginner to Advanced",
  status: "in_progress",
  sections: [
    {
      id: "section-1",
      title: "Web Fundamentals",
      description: "Learn the basics of web development",
      progress: 100,
      lectures: [
        {
          id: "lecture-1-1",
          title: "Introduction to HTML",
          type: "video",
          duration: "15m",
          is_completed: true,
          is_preview: true,
        },
        {
          id: "lecture-1-2",
          title: "CSS Fundamentals",
          type: "video",
          duration: "20m",
          is_completed: true,
          is_preview: false,
        },
        {
          id: "lecture-1-3",
          title: "JavaScript Basics",
          type: "video",
          duration: "25m",
          is_completed: true,
          is_preview: false,
        },
      ],
    },
    {
      id: "section-2",
      title: "Responsive Design",
      description: "Create websites that work on any device",
      progress: 50,
      lectures: [
        {
          id: "lecture-2-1",
          title: "Responsive Design Principles",
          type: "video",
          duration: "18m",
          is_completed: true,
          is_preview: false,
        },
        {
          id: "lecture-2-2",
          title: "Media Queries",
          type: "video",
          duration: "22m",
          is_completed: true,
          is_preview: false,
        },
        {
          id: "lecture-2-3",
          title: "Flexbox Layout",
          type: "video",
          duration: "28m",
          is_completed: false,
          is_preview: false,
        },
        {
          id: "lecture-2-4",
          title: "CSS Grid Layout",
          type: "video",
          duration: "30m",
          is_completed: false,
          is_preview: false,
        },
      ],
    },
    {
      id: "section-3",
      title: "JavaScript Deep Dive",
      description: "Master JavaScript programming",
      progress: 0,
      lectures: [
        {
          id: "lecture-3-1",
          title: "JavaScript Functions",
          type: "video",
          duration: "25m",
          is_completed: false,
          is_preview: false,
        },
        {
          id: "lecture-3-2",
          title: "Working with Arrays",
          type: "video",
          duration: "22m",
          is_completed: false,
          is_preview: false,
        },
        {
          id: "lecture-3-3",
          title: "DOM Manipulation",
          type: "video",
          duration: "35m",
          is_completed: false,
          is_preview: false,
        },
        {
          id: "lecture-3-4",
          title: "Event Handling",
          type: "video",
          duration: "28m",
          is_completed: false,
          is_preview: false,
        },
        {
          id: "lecture-3-5",
          title: "Asynchronous JavaScript",
          type: "video",
          duration: "40m",
          is_completed: false,
          is_preview: false,
        },
      ],
    },
    {
      id: "section-4",
      title: "Building Projects",
      description: "Apply your knowledge to real projects",
      progress: 0,
      lectures: [
        {
          id: "lecture-4-1",
          title: "Project Setup",
          type: "video",
          duration: "15m",
          is_completed: false,
          is_preview: false,
        },
        {
          id: "lecture-4-2",
          title: "Building a Landing Page",
          type: "video",
          duration: "45m",
          is_completed: false,
          is_preview: false,
        },
        {
          id: "lecture-4-3",
          title: "Creating a Portfolio Website",
          type: "video",
          duration: "50m",
          is_completed: false,
          is_preview: false,
        },
        {
          id: "lecture-4-4",
          title: "Building an E-commerce Site",
          type: "video",
          duration: "60m",
          is_completed: false,
          is_preview: false,
        },
      ],
    },
  ],
  announcements: [
    {
      id: "announcement-1",
      title: "Course Updated with New Content",
      content:
        "We've added new lectures on React Hooks and Server Components. Check out Section 5!",
      date: "2023-05-20T14:15:00Z",
    },
    {
      id: "announcement-2",
      title: "Live Q&A Session",
      content:
        "Join us for a live Q&A session on June 30th at 3 PM EST to get your questions answered.",
      date: "2023-06-10T09:00:00Z",
    },
  ],
  resources: [
    {
      id: "resource-1",
      title: "HTML Cheat Sheet",
      type: "pdf",
      size: "1.2 MB",
      url: "#",
    },
    {
      id: "resource-2",
      title: "CSS Reference Guide",
      type: "pdf",
      size: "2.5 MB",
      url: "#",
    },
    {
      id: "resource-3",
      title: "JavaScript Code Samples",
      type: "zip",
      size: "4.8 MB",
      url: "#",
    },
  ],
};

export default function CourseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId;

  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    // Simulate API call to fetch course details
    const fetchCourseDetails = async () => {
      try {
        // Fetch course details from API
        const response = await getCourseDetails(courseId as string);
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
  const formatDate = (dateString) => {
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

    let total = 0;
    let completed = 0;

    course.sections.forEach((section) => {
      total += section.lectures.length;
      section.lectures.forEach((lecture) => {
        if (lecture.is_completed) completed++;
      });
    });

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

    for (const section of course.sections) {
      for (const lecture of section.lectures) {
        if (!lecture.is_completed) {
          return { sectionId: section.id, lectureId: lecture.id };
        }
      }
    }

    // If all lectures are completed, return the first lecture
    if (course.sections.length > 0 && course.sections[0].lectures.length > 0) {
      return {
        sectionId: course.sections[0].id,
        lectureId: course.sections[0].lectures[0].id,
      };
    }

    return null;
  };

  const nextLecture = course ? findNextLecture() : null;

  // Handle continue learning button click
  const handleContinueLearning = () => {
    if (nextLecture) {
      router.push(
        `/student/courses/${courseId}/learn/${nextLecture.sectionId}/${nextLecture.lectureId}`
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
              src={course.thumbnail}
              alt={course.title}
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
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-muted-foreground mb-4">{course.description}</p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Instructor: {course.instructor.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{progress.total} lectures</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{course.total_duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Last updated: {formatDate(course.updated_at)}</span>
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
              <span>Last accessed: {formatDate(course.last_accessed)}</span>
            </div>
          </div>

          <Tabs defaultValue="content" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Course Content</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 pt-4">
              <Accordion type="multiple" className="w-full">
                {course.sections.map((section, index) => (
                  <AccordionItem key={section.id} value={section.id}>
                    <AccordionTrigger className="hover:bg-muted/50 px-4 py-2 rounded-md">
                      <div className="flex flex-col items-start text-left">
                        <div className="font-medium">
                          Section {index + 1}: {section.title}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <span>{section.lectures.length} lectures</span>
                          <span>•</span>
                          <div className="flex items-center">
                            <Progress
                              value={section.progress}
                              className="h-1.5 w-16 mr-2"
                            />
                            <span>{section.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4">
                      <div className="space-y-1 py-2">
                        {section.lectures.map((lecture) => (
                          <Link
                            key={lecture.id}
                            href={`/student/courses/${courseId}/learn/${section.id}/${lecture.id}`}
                          >
                            <div
                              className={`flex items-center justify-between p-2 rounded-md hover:bg-muted/50 ${
                                lecture.is_completed ? "bg-muted/20" : ""
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {lecture.is_completed ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                  <PlayCircle className="h-5 w-5 text-muted-foreground" />
                                )}
                                <div>
                                  <div className="font-medium">
                                    {lecture.title}
                                  </div>
                                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                                    <span>{lecture.type}</span>
                                    <span>•</span>
                                    <span>{lecture.duration}</span>
                                    {lecture.is_preview && (
                                      <>
                                        <span>•</span>
                                        <Badge
                                          variant="outline"
                                          className="text-xs py-0 h-5"
                                        >
                                          Preview
                                        </Badge>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {lecture.is_completed ? "Completed" : ""}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
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
                            {resource.type.toUpperCase()} • {resource.size}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={resource.url}>
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
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Category</h3>
                <p className="text-sm text-muted-foreground">
                  {course.category}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Level</h3>
                <p className="text-sm text-muted-foreground">{course.level}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Total Duration</h3>
                <p className="text-sm text-muted-foreground">
                  {course.total_duration}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Last Updated</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(course.updated_at)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{course.instructor.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {course.instructor.title}
                  </p>
                </div>
              </div>
              <p className="text-sm">{course.instructor.bio}</p>
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
