import { Course } from "@/types/course";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Calendar, Users, BookOpen } from "lucide-react";
import { format } from "date-fns";

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

export default function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <Image
        src={course.thumbnail || "/placeholder.svg"}
        alt={course.title}
        width={400}
        height={200}
        className="w-full h-[150px] object-cover"
      />
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-1">{course.title}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {course.description || "No description available"}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{format(course.startDate, "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.studentsCount || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{course.materialsCount || 0}</span>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-xs px-2 py-1 rounded-full bg-lamaPurpleLight text-lamaPurple">
            {course.department}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
