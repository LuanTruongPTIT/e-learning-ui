'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, FileText, Award, Bell, RefreshCw, ChevronRight } from 'lucide-react';
import { recentActivitiesApi, RecentActivity, ActivityActions } from '@/apis/assignments';
import { toast } from 'react-hot-toast';

interface RecentActivitiesProps {
  userId?: string;
  limit?: number;
  showHeader?: boolean;
  className?: string;
}

const getActivityIcon = (action: string) => {
  switch (action) {
    case ActivityActions.ASSIGNMENT_CREATED:
    case ActivityActions.ASSIGNMENT_SUBMITTED:
    case ActivityActions.ASSIGNMENT_GRADED:
      return <FileText className="h-4 w-4" />;
    case ActivityActions.QUIZ_COMPLETED:
    case ActivityActions.QUIZ_STARTED:
      return <Award className="h-4 w-4" />;
    case ActivityActions.LECTURE_COMPLETED:
      return <BookOpen className="h-4 w-4" />;
    case ActivityActions.COURSE_ENROLLED:
    case ActivityActions.COURSE_COMPLETED:
      return <BookOpen className="h-4 w-4" />;
    case ActivityActions.NOTIFICATION_RECEIVED:
      return <Bell className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getActivityColor = (action: string) => {
  switch (action) {
    case ActivityActions.ASSIGNMENT_CREATED:
      return 'bg-blue-100 text-blue-800';
    case ActivityActions.ASSIGNMENT_SUBMITTED:
      return 'bg-orange-100 text-orange-800';
    case ActivityActions.ASSIGNMENT_GRADED:
      return 'bg-green-100 text-green-800';
    case ActivityActions.QUIZ_COMPLETED:
      return 'bg-purple-100 text-purple-800';
    case ActivityActions.QUIZ_STARTED:
      return 'bg-yellow-100 text-yellow-800';
    case ActivityActions.LECTURE_COMPLETED:
      return 'bg-green-100 text-green-800';
    case ActivityActions.COURSE_ENROLLED:
      return 'bg-blue-100 text-blue-800';
    case ActivityActions.COURSE_COMPLETED:
      return 'bg-emerald-100 text-emerald-800';
    case ActivityActions.NOTIFICATION_RECEIVED:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getActivityText = (activity: RecentActivity) => {
  const { action, target_title, course_name, metadata } = activity;
  
  switch (action) {
    case ActivityActions.ASSIGNMENT_CREATED:
      return `Created assignment: ${target_title}`;
    case ActivityActions.ASSIGNMENT_SUBMITTED:
      return `Submitted assignment: ${target_title}`;
    case ActivityActions.ASSIGNMENT_GRADED:
      return `Assignment graded: ${target_title}${metadata?.score ? ` (${metadata.score}%)` : ''}`;
    case ActivityActions.QUIZ_COMPLETED:
      return `Completed quiz: ${target_title}${metadata?.score ? ` (${metadata.score}%)` : ''}`;
    case ActivityActions.QUIZ_STARTED:
      return `Started quiz: ${target_title}`;
    case ActivityActions.LECTURE_COMPLETED:
      return `Completed lecture: ${target_title}`;
    case ActivityActions.COURSE_ENROLLED:
      return `Enrolled in course: ${target_title}`;
    case ActivityActions.COURSE_COMPLETED:
      return `Completed course: ${target_title}`;
    case ActivityActions.NOTIFICATION_RECEIVED:
      return `Received notification: ${target_title}`;
    default:
      return target_title || 'Unknown activity';
  }
};

export function RecentActivities({ 
  userId, 
  limit = 10, 
  showHeader = true,
  className = ""
}: RecentActivitiesProps) {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const response = await recentActivitiesApi.getRecentActivities(userId, limit, 0);
      
      if (response.status === 200) {
        setActivities(response.data.activities);
        setHasMore(response.data.has_more);
      } else {
        toast.error('Failed to load recent activities');
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load recent activities');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [userId, limit]);

  const content = (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No recent activities</p>
        </div>
      ) : (
        <>
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-full ${getActivityColor(activity.action)}`}>
                {getActivityIcon(activity.action)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {getActivityText(activity)}
                </p>
                {activity.course_name && (
                  <p className="text-sm text-gray-500">{activity.course_name}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{activity.time_ago}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          ))}
          
          {hasMore && (
            <div className="text-center pt-4">
              <Button variant="outline" size="sm" onClick={fetchActivities}>
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );

  if (!showHeader) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activities
          </div>
          <Button variant="ghost" size="sm" onClick={fetchActivities} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}
