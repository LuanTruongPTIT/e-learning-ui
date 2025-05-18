"use client";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  progress: number;
  totalLectures?: number;
  total_lectures?: number;
  completedLectures?: number;
  completed_lectures?: number;
  lastAccessed?: string | null;
  last_accessed?: string | null;
}

interface RecentCourseCardProps {
  course: Course;
}

export function RecentCourseCard({ course }: RecentCourseCardProps) {
  // Format date to readable format
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not started yet";

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="flex gap-4 items-center border rounded-lg p-3 hover:bg-muted/50 transition-colors">
      <div className="relative h-16 w-24 flex-shrink-0 rounded-md overflow-hidden">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-grow space-y-2">
        <h3 className="font-medium line-clamp-1">{course.title}</h3>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>{course.progress}% complete</span>
            <span>
              Last accessed:{" "}
              {formatDate(course.lastAccessed || course.last_accessed)}
            </span>
          </div>
          <Progress value={course.progress} className="h-1.5" />
        </div>
      </div>
      <div className="flex-shrink-0">
        <Link href={`/student/courses/${course.id}`}>
          <Button size="sm" variant="ghost">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
