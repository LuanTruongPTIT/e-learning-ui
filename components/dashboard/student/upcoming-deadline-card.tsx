"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  FileQuestion,
  FolderKanban,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface Deadline {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  type: string;
  isNew?: boolean;
}

interface UpcomingDeadlineCardProps {
  deadline: Deadline;
}

export function UpcomingDeadlineCard({ deadline }: UpcomingDeadlineCardProps) {
  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    // Calculate days remaining
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Format date
    const formattedDate = date.toLocaleDateString("vi-VN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      formattedDate,
      daysRemaining: diffDays,
    };
  };

  // Function to get icon based on deadline type
  const getDeadlineIcon = (type: string) => {
    switch (type) {
      case "assignment":
      case "upload":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "quiz":
        return <FileQuestion className="h-5 w-5 text-yellow-500" />;
      case "both":
        return <FolderKanban className="h-5 w-5 text-green-500" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to get badge text and variant based on days remaining
  const getDeadlineBadge = (daysRemaining: number) => {
    if (daysRemaining <= 0) {
      return { text: "Quá hạn", variant: "destructive" as const };
    } else if (daysRemaining <= 1) {
      return { text: "Hôm nay", variant: "destructive" as const };
    } else if (daysRemaining <= 3) {
      return { text: `${daysRemaining} ngày`, variant: "warning" as const };
    } else {
      return { text: `${daysRemaining} ngày`, variant: "outline" as const };
    }
  };

  const { formattedDate, daysRemaining } = formatDate(deadline.dueDate);
  const badge = getDeadlineBadge(daysRemaining);

  return (
    <div className="flex gap-4 items-center border rounded-lg p-3 hover:bg-muted/50 transition-colors">
      <div className="flex-shrink-0">{getDeadlineIcon(deadline.type)}</div>
      <div className="flex-grow space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium line-clamp-1">{deadline.title}</h3>
          {deadline.isNew && (
            <Badge
              variant="secondary"
              className="text-xs bg-blue-100 text-blue-700 border-blue-200"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Mới
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{deadline.course}</p>
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
          <Badge variant={badge.variant} className="ml-auto">
            {badge.text}
          </Badge>
        </div>
      </div>
      <div className="flex-shrink-0">
        <Button size="sm" variant="ghost">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
