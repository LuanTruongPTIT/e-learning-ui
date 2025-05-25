"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  CheckCircle,
  FileText,
  Download,
} from "lucide-react";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";
import {
  getCourseContent,
  markLectureAsCompleted,
  updateLectureProgress,
  UpdateLectureProgressRequest,
} from "@/apis/student-courses";

// Mock data for course content based on actual system structure without sections
const mockCourseContent = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  title: "Introduction to Web Development",
  description:
    "Learn the fundamentals of web development including HTML, CSS, JavaScript, and modern frameworks.",
  thumbnail:
    "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  instructor: {
    name: "Nguyen Van A",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    title: "Senior Web Developer",
    bio: "Experienced web developer with expertise in modern JavaScript frameworks and backend technologies.",
  },
  progress: 25,
  total_lectures: 15,
  completed_lectures: 4,
  total_duration: "12h 45m",
  last_accessed: "2023-06-15T10:30:00Z",
  created_at: "2023-01-10T08:00:00Z",
  updated_at: "2023-05-20T14:15:00Z",
  category: "Web Development",
  level: "Beginner to Intermediate",
  status: "in_progress",
  lectures: [
    {
      id: "550e8400-e29b-41d4-a716-446655440101",
      title: "Introduction to HTML",
      type: "video",
      duration: "15m",
      is_completed: true,
      video_url: "https://www.youtube.com/embed/qz0aGYrrlhU",
      content:
        "HTML is the standard markup language for Web pages. With HTML you can create your own Website. HTML is easy to learn - You will enjoy it!",
      description: "An introduction to HTML structure and basic elements",
      order_index: 1,
      attachments: [
        {
          id: "attachment-1-1-1",
          title: "HTML Cheat Sheet",
          type: "pdf",
          size: "1.2 MB",
          url: "#",
        },
      ],
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440102",
      title: "HTML Elements and Attributes",
      type: "video",
      duration: "20m",
      is_completed: true,
      video_url: "https://www.youtube.com/embed/1PnVor36_40",
      content:
        "CSS is the language we use to style an HTML document. CSS describes how HTML elements should be displayed.",
      description: "Learn about different HTML elements and their attributes",
      order_index: 2,
      attachments: [
        {
          id: "attachment-1-2-1",
          title: "CSS Reference Guide",
          type: "pdf",
          size: "2.5 MB",
          url: "#",
        },
      ],
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440103",
      title: "HTML Forms",
      type: "video",
      duration: "25m",
      is_completed: true,
      video_url: "https://www.youtube.com/embed/W6NZfCO5SIk",
      content:
        "JavaScript is the world's most popular programming language. JavaScript is the programming language of the Web.",
      description: "Creating interactive forms with HTML",
      order_index: 3,
      attachments: [
        {
          id: "attachment-1-3-1",
          title: "JavaScript Basics PDF",
          type: "pdf",
          size: "3.1 MB",
          url: "#",
        },
      ],
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440201",
      title: "CSS Basics",
      type: "video",
      duration: "18m",
      is_completed: true,
      video_url: "https://www.youtube.com/embed/srvUrASNj0s",
      content:
        "Responsive web design makes your web page look good on all devices. Responsive web design uses only HTML and CSS.",
      description: "Introduction to CSS selectors and properties",
      order_index: 4,
      attachments: [
        {
          id: "attachment-2-1-1",
          title: "Responsive Design Guide",
          type: "pdf",
          size: "1.8 MB",
          url: "#",
        },
      ],
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440202",
      title: "CSS Box Model",
      type: "video",
      duration: "22m",
      is_completed: false,
      video_url: "https://www.youtube.com/embed/2KL-z9A56SQ",
      content:
        "Media queries allow you to apply CSS styles depending on a device's general type or specific characteristics.",
      description: "Understanding the CSS box model",
      order_index: 5,
      attachments: [],
    },
  ],
};

export default function LecturePage() {
  const router = useRouter();
  const params = useParams();
  const { courseId, lectureId } = params;

  const [course, setCourse] = useState<any>(mockCourseContent);
  const [currentLecture, setCurrentLecture] = useState<any>(
    mockCourseContent.lectures.find((l) => l.id === lectureId) ||
      mockCourseContent.lectures[0]
  );
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);
  const videoContainerRef = useRef(null);

  useEffect(() => {
    // Fetch course content from API
    const fetchCourseContent = async () => {
      try {
        setLoading(true);
        const response = await getCourseContent(courseId as string);
        setCourse(response.data);

        // Find current lecture
        const lecture = response.data.lectures.find(
          (l: any) => l.id === lectureId
        );
        console.log("lecture", lecture);
        if (lecture) {
          setCurrentLecture(lecture);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching course content:", error);
        setLoading(false);
      }
    };

    if (courseId && lectureId) {
      fetchCourseContent();

      // Uncomment for development with mock data
      // setCurrentLecture(
      //   mockCourseContent.lectures.find((l) => l.id === lectureId) ||
      //     mockCourseContent.lectures[0]
      // );
      // setLoading(false);
    }
  }, [courseId, lectureId]);

  // Handle lecture completion
  const handleLectureComplete = async () => {
    if (currentLecture && !currentLecture.is_completed && !markingComplete) {
      try {
        setMarkingComplete(true);
        // Call API to mark lecture as completed
        await markLectureAsCompleted(currentLecture.id);

        // Update local state
        setCurrentLecture((prev: any) => ({
          ...prev,
          is_completed: true,
        }));

        // Show success message
        alert("Lecture marked as completed successfully!");
      } catch (error) {
        console.error("Error marking lecture as completed:", error);
        alert("Failed to mark lecture as completed. Please try again.");
      } finally {
        setMarkingComplete(false);
      }
    }
  };

  // Handle progress update during video playback
  const handleProgressUpdate = async (
    watchPosition: number,
    progressPercentage: number
  ) => {
    if (currentLecture) {
      try {
        // Throttle API calls - only update every 10 seconds or 5% progress
        const shouldUpdate =
          watchPosition % 10 === 0 || // Every 10 seconds
          progressPercentage % 5 === 0; // Every 5% progress

        if (shouldUpdate) {
          await updateLectureProgress(currentLecture.id, {
            watchPosition,
            progressPercentage,
          });
        }
      } catch (error) {
        console.error("Error updating lecture progress:", error);
      }
    }
  };

  // Find next and previous lectures
  const findAdjacentLectures = () => {
    if (!course || !currentLecture) return { prev: null, next: null };

    // Sort lectures by order_index
    const sortedLectures = [...course.lectures].sort(
      (a, b) => a.order_index - b.order_index
    );

    const currentIndex = sortedLectures.findIndex((l) => l.id === lectureId);

    return {
      prev: currentIndex > 0 ? sortedLectures[currentIndex - 1] : null,
      next:
        currentIndex < sortedLectures.length - 1
          ? sortedLectures[currentIndex + 1]
          : null,
    };
  };

  const { prev, next } = findAdjacentLectures();

  // Navigate to next or previous lecture
  const navigateToLecture = (direction) => {
    if (direction === "prev" && prev) {
      router.push(`/student/courses/${courseId}/learn/${prev.id}`);
    } else if (direction === "next" && next) {
      router.push(`/student/courses/${courseId}/learn/${next.id}`);
    }
  };

  // Calculate course progress
  const calculateProgress = () => {
    if (!course) return 0;

    const total = course.lectures.length;
    const completed = course.lectures.filter(
      (lecture) => lecture.is_completed
    ).length;

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course || !currentLecture) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Link href={`/student/courses/${courseId}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to Course
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Lecture Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The lecture you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have access to it.
          </p>
          <Link href={`/student/courses/${courseId}`}>
            <Button>Go Back to Course</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen ${fullscreen ? "bg-black" : ""}`}>
      {/* Header */}
      {!fullscreen && (
        <header className="bg-background border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/student/courses/${courseId}`}>
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                Back to Course
              </Button>
            </Link>
            <h1 className="text-lg font-medium truncate">{course.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground mr-2">
              Your progress: {calculateProgress()}%
            </div>
            <Progress value={calculateProgress()} className="w-32 h-2" />
          </div>
        </header>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {!fullscreen && sidebarOpen && (
          <aside className="w-80 border-r bg-muted/20 flex flex-col overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-medium">Course Content</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-0">
                {course.lectures
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((lecture, index) => (
                    <Link
                      key={lecture.id}
                      href={`/student/courses/${courseId}/learn/${lecture.id}`}
                    >
                      <div
                        className={`flex items-center gap-3 p-3 hover:bg-muted/50 border-l-2 ${
                          lecture.id === lectureId
                            ? "border-primary bg-muted/30"
                            : lecture.is_completed
                            ? "border-green-500/50 bg-muted/10"
                            : "border-transparent"
                        }`}
                      >
                        {lecture.is_completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <PlayCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {index + 1}. {lecture.title}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <span>{lecture.type}</span>
                            <span>•</span>
                            <span>{lecture.duration}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </aside>
        )}

        {/* Content Area */}
        <main
          className={`flex-1 flex flex-col overflow-hidden ${
            fullscreen ? "bg-black" : ""
          }`}
        >
          {/* Video Player */}
          <div className="h-[60vh] bg-black">
            <VideoPlayer
              src={currentLecture.content_url}
              title={currentLecture.title}
              onComplete={handleLectureComplete}
              autoMarkComplete={true}
              autoMarkCompleteThreshold={80}
              lectureId={currentLecture.id}
              onProgressUpdate={handleProgressUpdate}
            />
          </div>

          {/* Lecture Content */}
          {!fullscreen && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">{currentLecture.title}</h1>
                  <Badge
                    variant={
                      currentLecture.is_completed ? "success" : "outline"
                    }
                    className={
                      currentLecture.is_completed
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {currentLecture.is_completed ? "Completed" : "In Progress"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateToLecture("prev")}
                      disabled={!prev}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateToLecture("next")}
                      disabled={!next}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>

                    {/* Mark Complete Button */}
                    {!currentLecture.is_completed && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleLectureComplete}
                        disabled={markingComplete}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {markingComplete ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Marking...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Complete
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Duration: {currentLecture.duration}
                  </div>
                </div>

                <Separator />

                <Tabs defaultValue="notes">
                  <TabsList>
                    <TabsTrigger value="notes">Lecture Notes</TabsTrigger>
                    <TabsTrigger value="attachments">Attachments</TabsTrigger>
                  </TabsList>
                  <TabsContent value="notes" className="pt-4">
                    <div className="prose max-w-none">
                      <p>{currentLecture.content}</p>
                      {currentLecture.description && (
                        <div className="mt-4">
                          <h3 className="text-lg font-medium">Description</h3>
                          <p>{currentLecture.description}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="attachments" className="pt-4">
                    {currentLecture.attachments &&
                    currentLecture.attachments.length > 0 ? (
                      <div className="border rounded-md divide-y">
                        {currentLecture.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center justify-between p-4"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="font-medium">
                                  {attachment.title}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {attachment.type.toUpperCase()} •{" "}
                                  {attachment.size}
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={attachment.url}>
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
                          No attachments available
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          This lecture doesn&apos;t have any downloadable
                          attachments
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
