"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  progress: number;
  totalLectures: number;
  completedLectures: number;
  lastAccessed: string | null;
  category: string;
  status: "completed" | "in_progress" | "not_started";
}

export default function CourseCard({
  id,
  title,
  description,
  thumbnail,
  instructor,
  progress,
  totalLectures,
  completedLectures,
  lastAccessed,
  category,
  status
}: CourseCardProps) {
  // Format date to readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not started yet";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={
            status === "completed" ? "success" :
            status === "in_progress" ? "info" : "secondary"
          }>
            {status === "completed" ? "Completed" :
             status === "in_progress" ? "In Progress" : "Not Started"}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <div className="text-sm text-muted-foreground">
          Instructor: {instructor}
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {description}
        </p>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>{completedLectures}/{totalLectures} lectures</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(lastAccessed)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/student/courses/${id}`} className="w-full">
          <Button className="w-full">
            {status === "not_started" ? "Start Course" : "Continue Learning"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
