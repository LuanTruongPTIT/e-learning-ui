"use client";

import { 
  BookOpen, 
  CheckCircle, 
  Play, 
  FileText, 
  Award,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  type: string;
  course: string;
  title: string;
  timestamp: string;
  score?: number;
}

interface LearningActivityTimelineProps {
  activities: Activity[];
}

export function LearningActivityTimeline({ activities }: LearningActivityTimelineProps) {
  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // Function to get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completed_lecture':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'started_course':
        return <Play className="h-5 w-5 text-blue-500" />;
      case 'completed_quiz':
        return <Award className="h-5 w-5 text-yellow-500" />;
      case 'submitted_assignment':
        return <FileText className="h-5 w-5 text-purple-500" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to get badge text and variant based on activity type
  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'completed_lecture':
        return { text: 'Completed Lecture', variant: 'success' as const };
      case 'started_course':
        return { text: 'Started Course', variant: 'info' as const };
      case 'completed_quiz':
        return { text: 'Completed Quiz', variant: 'warning' as const };
      case 'submitted_assignment':
        return { text: 'Submitted Assignment', variant: 'secondary' as const };
      default:
        return { text: 'Activity', variant: 'outline' as const };
    }
  };

  return (
    <div className="space-y-6">
      {activities.map((activity) => {
        const badge = getActivityBadge(activity.type);
        
        return (
          <div key={activity.id} className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-grow space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant={badge.variant}>{badge.text}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(activity.timestamp)}
                </span>
              </div>
              <p className="font-medium">{activity.title}</p>
              <p className="text-sm text-muted-foreground">{activity.course}</p>
              {activity.score !== undefined && (
                <p className="text-sm">
                  Score: <span className="font-medium">{activity.score}%</span>
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
