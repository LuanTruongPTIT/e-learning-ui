"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface RecentActivitiesProps {
  userRole: string;
}

export function RecentActivities({ userRole }: RecentActivitiesProps) {
  // Mock data for admin
  const adminActivities = [
    {
      id: 1,
      user: {
        name: "Olivia Martin",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        initials: "OM",
      },
      action: "uploaded a new lecture",
      course: "Introduction to Computer Science",
      time: "2 hours ago",
      type: "upload",
    },
    {
      id: 2,
      user: {
        name: "Jackson Lee",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        initials: "JL",
      },
      action: "created a new assignment",
      course: "Data Structures and Algorithms",
      time: "3 hours ago",
      type: "create",
    },
    {
      id: 3,
      user: {
        name: "Isabella Nguyen",
        avatar: "https://randomuser.me/api/portraits/women/26.jpg",
        initials: "IN",
      },
      action: "graded assignments",
      course: "Web Development Fundamentals",
      time: "5 hours ago",
      type: "grade",
    },
    {
      id: 4,
      user: {
        name: "William Chen",
        avatar: "https://randomuser.me/api/portraits/men/17.jpg",
        initials: "WC",
      },
      action: "published course materials",
      course: "Database Systems",
      time: "1 day ago",
      type: "publish",
    },
    {
      id: 5,
      user: {
        name: "Sophia Rodriguez",
        avatar: "https://randomuser.me/api/portraits/women/63.jpg",
        initials: "SR",
      },
      action: "created a new course",
      course: "Artificial Intelligence",
      time: "1 day ago",
      type: "create",
    },
  ];

  // Mock data for teacher
  const teacherActivities = [
    {
      id: 1,
      user: {
        name: "Emma Johnson",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg",
        initials: "EJ",
      },
      action: "submitted assignment",
      course: "Advanced Programming",
      time: "1 hour ago",
      type: "submit",
    },
    {
      id: 2,
      user: {
        name: "Liam Smith",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg",
        initials: "LS",
      },
      action: "completed a quiz",
      course: "Advanced Programming",
      time: "2 hours ago",
      type: "complete",
    },
    {
      id: 3,
      user: {
        name: "Ava Brown",
        avatar: "https://randomuser.me/api/portraits/women/14.jpg",
        initials: "AB",
      },
      action: "viewed lecture",
      course: "Data Structures",
      time: "3 hours ago",
      type: "view",
    },
    {
      id: 4,
      user: {
        name: "Noah Davis",
        avatar: "https://randomuser.me/api/portraits/men/41.jpg",
        initials: "ND",
      },
      action: "asked a question",
      course: "Data Structures",
      time: "5 hours ago",
      type: "question",
    },
    {
      id: 5,
      user: {
        name: "Mia Wilson",
        avatar: "https://randomuser.me/api/portraits/women/50.jpg",
        initials: "MW",
      },
      action: "joined discussion",
      course: "Advanced Programming",
      time: "1 day ago",
      type: "join",
    },
  ];

  const activities = userRole === "Administrator" ? adminActivities : teacherActivities;

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "upload":
      case "create":
        return "default";
      case "grade":
      case "complete":
        return "success";
      case "publish":
      case "submit":
        return "secondary";
      case "view":
        return "outline";
      case "question":
      case "join":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.user.name}{" "}
              <span className="text-muted-foreground">{activity.action}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              {activity.course}
            </p>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <Badge variant={getBadgeVariant(activity.type)}>
              {activity.type}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {activity.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
