"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, ClockIcon, BookOpenIcon } from "lucide-react";

interface UpcomingDeadlinesProps {
  userRole: string;
}

export function UpcomingDeadlines({ userRole }: UpcomingDeadlinesProps) {
  // Mock data for admin
  const adminDeadlines = [
    {
      id: 1,
      title: "End of Semester Grades",
      course: "All Courses",
      date: "June 15, 2023",
      daysLeft: 5,
      type: "grades",
    },
    {
      id: 2,
      title: "Course Evaluations",
      course: "All Courses",
      date: "June 10, 2023",
      daysLeft: 2,
      type: "evaluation",
    },
    {
      id: 3,
      title: "New Curriculum Submission",
      course: "Department Heads",
      date: "June 20, 2023",
      daysLeft: 10,
      type: "submission",
    },
    {
      id: 4,
      title: "Faculty Meeting",
      course: "All Faculty",
      date: "June 8, 2023",
      daysLeft: 1,
      type: "meeting",
    },
  ];

  // Mock data for teacher
  const teacherDeadlines = [
    {
      id: 1,
      title: "Assignment Grading",
      course: "Advanced Programming",
      date: "June 8, 2023",
      daysLeft: 1,
      type: "grades",
    },
    {
      id: 2,
      title: "Midterm Exam",
      course: "Data Structures",
      date: "June 15, 2023",
      daysLeft: 8,
      type: "exam",
    },
    {
      id: 3,
      title: "Project Submission",
      course: "Algorithms",
      date: "June 20, 2023",
      daysLeft: 13,
      type: "submission",
    },
    {
      id: 4,
      title: "Department Meeting",
      course: "Computer Science",
      date: "June 10, 2023",
      daysLeft: 3,
      type: "meeting",
    },
  ];

  const deadlines = userRole === "Administrator" ? adminDeadlines : teacherDeadlines;

  const getBadgeVariant = (daysLeft: number) => {
    if (daysLeft <= 2) return "destructive";
    if (daysLeft <= 5) return "warning";
    return "secondary";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "grades":
      case "evaluation":
        return <BookOpenIcon className="h-4 w-4 mr-2" />;
      case "exam":
      case "submission":
        return <ClockIcon className="h-4 w-4 mr-2" />;
      case "meeting":
        return <CalendarIcon className="h-4 w-4 mr-2" />;
      default:
        return <CalendarIcon className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="space-y-4">
      {deadlines.map((deadline) => (
        <Card key={deadline.id} className="border-l-4" style={{ borderLeftColor: deadline.daysLeft <= 2 ? '#ef4444' : deadline.daysLeft <= 5 ? '#f59e0b' : '#8b5cf6' }}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{deadline.title}</h3>
                <p className="text-sm text-muted-foreground">{deadline.course}</p>
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {deadline.date}
                </div>
              </div>
              <Badge variant={getBadgeVariant(deadline.daysLeft)}>
                {deadline.daysLeft} {deadline.daysLeft === 1 ? "day" : "days"} left
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
