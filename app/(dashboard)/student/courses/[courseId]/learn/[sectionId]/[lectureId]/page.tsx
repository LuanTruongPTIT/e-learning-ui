"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
} from "@/apis/student-courses";

// Mock data for course content
const mockCourseContent = {
  id: "course-1",
  title: "Complete Web Development Bootcamp",
  sections: [
    {
      id: "section-1",
      title: "Web Fundamentals",
      progress: 100,
      lectures: [
        {
          id: "lecture-1-1",
          title: "Introduction to HTML",
          type: "video",
          duration: "15m",
          is_completed: true,
          video_url: "https://www.youtube.com/embed/qz0aGYrrlhU",
          content:
            "HTML is the standard markup language for Web pages. With HTML you can create your own Website. HTML is easy to learn - You will enjoy it!",
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
          id: "lecture-1-2",
          title: "CSS Fundamentals",
          type: "video",
          duration: "20m",
          is_completed: true,
          video_url: "https://www.youtube.com/embed/1PnVor36_40",
          content:
            "CSS is the language we use to style an HTML document. CSS describes how HTML elements should be displayed.",
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
          id: "lecture-1-3",
          title: "JavaScript Basics",
          type: "video",
          duration: "25m",
          is_completed: true,
          video_url: "https://www.youtube.com/embed/W6NZfCO5SIk",
          content:
            "JavaScript is the world's most popular programming language. JavaScript is the programming language of the Web.",
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
      ],
    },
    {
      id: "section-2",
      title: "Responsive Design",
      progress: 50,
      lectures: [
        {
          id: "lecture-2-1",
          title: "Responsive Design Principles",
          type: "video",
          duration: "18m",
          is_completed: true,
          video_url: "https://www.youtube.com/embed/srvUrASNj0s",
          content:
            "Responsive web design makes your web page look good on all devices. Responsive web design uses only HTML and CSS.",
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
          id: "lecture-2-2",
          title: "Media Queries",
          type: "video",
          duration: "22m",
          is_completed: true,
          video_url: "https://www.youtube.com/embed/2KL-z9A56SQ",
          content:
            "Media queries allow you to apply CSS styles depending on a device's general type or specific characteristics.",
          attachments: [],
        },
        {
          id: "lecture-2-3",
          title: "Flexbox Layout",
          type: "video",
          duration: "28m",
          is_completed: false,
          video_url: "https://www.youtube.com/embed/JJSoEo8JSnc",
          content:
            "The Flexible Box Layout Module, makes it easier to design flexible responsive layout structure without using float or positioning.",
          attachments: [
            {
              id: "attachment-2-3-1",
              title: "Flexbox Cheat Sheet",
              type: "pdf",
              size: "1.5 MB",
              url: "#",
            },
          ],
        },
        {
          id: "lecture-2-4",
          title: "CSS Grid Layout",
          type: "video",
          duration: "30m",
          is_completed: false,
          video_url: "https://www.youtube.com/embed/jV8B24rSN5o",
          content:
            "The CSS Grid Layout Module offers a grid-based layout system, with rows and columns, making it easier to design web pages without having to use floats and positioning.",
          attachments: [],
        },
      ],
    },
  ],
};

export default function LecturePage() {
  const router = useRouter();
  const params = useParams();
  const { courseId, sectionId, lectureId } = params;

  const [course, setCourse] = useState<any>(mockCourseContent);
  const [currentSection, setCurrentSection] = useState<any>(mockCourseContent.sections[0]);
  const [currentLecture, setCurrentLecture] = useState<any>(mockCourseContent.sections[0].lectures[0]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const videoContainerRef = useRef(null);

  useEffect(() => {
    // Simulate API call to fetch course content
    const fetchCourseContent = async () => {
      try {
        // Fetch course content from API
        const response = await getCourseContent(courseId as string);
        setCourse(response.data);

        // Find current section and lecture
        const section = response.data.sections.find(
          (s: any) => s.id === sectionId
        );
        if (section) {
          setCurrentSection(section);

          const lecture = section.lectures.find((l: any) => l.id === lectureId);
          if (lecture) {
            setCurrentLecture(lecture);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching course content:", error);
        setLoading(false);
      }
    };

    if (courseId && sectionId && lectureId) {
      fetchCourseContent();
    }
  }, [courseId, sectionId, lectureId]);

  // Handle lecture completion
  const handleLectureComplete = async () => {
    if (currentLecture && !currentLecture.is_completed) {
      try {
        // Call API to mark lecture as completed
        await markLectureAsCompleted(currentLecture.id);

        // Update local state
        setCurrentLecture((prev) => ({
          ...prev,
          is_completed: true,
        }));
      } catch (error) {
        console.error("Error marking lecture as completed:", error);
      }
    }
  };

  // Find next and previous lectures
  const findAdjacentLectures = () => {
    if (!course || !currentSection || !currentLecture)
      return { prev: null, next: null };

    const allLectures = [];
    course.sections.forEach((section) => {
      section.lectures.forEach((lecture) => {
        allLectures.push({
          sectionId: section.id,
          lectureId: lecture.id,
          title: lecture.title,
        });
      });
    });

    const currentIndex = allLectures.findIndex(
      (l) => l.sectionId === sectionId && l.lectureId === lectureId
    );

    return {
      prev: currentIndex > 0 ? allLectures[currentIndex - 1] : null,
      next:
        currentIndex < allLectures.length - 1
          ? allLectures[currentIndex + 1]
          : null,
    };
  };

  const { prev, next } = findAdjacentLectures();

  // Navigate to next or previous lecture
  const navigateToLecture = (direction) => {
    if (direction === "prev" && prev) {
      //http://localhost:3000/student/courses/course-1/learn/section-2/lecture-2-3
      router.push(
        `/student/courses/${courseId}/learn/${prev.sectionId}/${prev.lectureId}`
      );
    } else if (direction === "next" && next) {
      router.push(
        `/student/courses/${courseId}/learn/${next.sectionId}/${next.lectureId}`
      );
    }
  };

  // Calculate course progress
  const calculateProgress = () => {
    if (!course) return 0;

    let total = 0;
    let completed = 0;

    course.sections.forEach((section) => {
      section.lectures.forEach((lecture) => {
        total++;
        if (lecture.is_completed) completed++;
      });
    });

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course || !currentSection || !currentLecture) {
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
            The lecture you're looking for doesn't exist or you don't have
            access to it.
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
              <Accordion
                type="multiple"
                defaultValue={[currentSection.id]}
                className="w-full"
              >
                {mockCourseContent.sections.map((section, index) => (
                  <AccordionItem key={section.id} value={section.id}>
                    <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
                      <div className="flex flex-col items-start text-left">
                        <div className="font-medium">
                          Section {index + 1}: {section.title}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                          <span>{section.lectures.length} lectures</span>
                          <span>•</span>
                          <div className="flex items-center">
                            <Progress
                              value={section.progress}
                              className="h-1.5 w-12 mr-1"
                            />
                            <span>{section.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-0">
                      <div className="space-y-0">
                        {section.lectures.map((lecture) => (
                          <Link
                            key={lecture.id}
                            href={`/student/courses/${courseId}/learn/${section.id}/${lecture.id}`}
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
                                  {lecture.title}
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
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
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
              src={currentLecture.video_url}
              title={currentLecture.title}
              onComplete={handleLectureComplete}
              autoMarkComplete={true}
              autoMarkCompleteThreshold={80}
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
                          This lecture doesn't have any downloadable attachments
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
