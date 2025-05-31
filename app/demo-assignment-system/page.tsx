'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Bell, 
  Clock, 
  Users, 
  BookOpen,
  Award,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { CreateAssignmentModal } from '@/components/assignments/CreateAssignmentModal';
import { AssignmentList } from '@/components/assignments/AssignmentList';
import { RecentActivities } from '@/components/assignments/RecentActivities';

export default function AssignmentSystemDemo() {
  const [selectedCourse, setSelectedCourse] = useState({
    id: 'course-1',
    name: 'Advanced Web Development',
  });

  // Mock data for demonstration
  const mockStats = {
    totalAssignments: 12,
    pendingSubmissions: 8,
    gradedAssignments: 4,
    averageScore: 85.5,
  };

  const mockNotifications = [
    {
      id: '1',
      title: 'New Assignment Created',
      message: 'React Hooks Assignment has been created for Advanced Web Development',
      time: '2 minutes ago',
      type: 'assignment',
      isRead: false,
    },
    {
      id: '2',
      title: 'Assignment Submitted',
      message: 'John Doe submitted JavaScript Fundamentals assignment',
      time: '15 minutes ago',
      type: 'submission',
      isRead: false,
    },
    {
      id: '3',
      title: 'Deadline Reminder',
      message: 'Database Design assignment due in 2 days',
      time: '1 hour ago',
      type: 'reminder',
      isRead: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <FileText className="h-4 w-4" />;
      case 'submission':
        return <Users className="h-4 w-4" />;
      case 'reminder':
        return <Clock className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'assignment':
        return 'bg-blue-100 text-blue-800';
      case 'submission':
        return 'bg-green-100 text-green-800';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assignment & Notification System</h1>
              <p className="text-gray-600 mt-2">
                Complete assignment management with real-time notifications and activity tracking
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Demo Mode
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalAssignments}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Submissions</p>
                  <p className="text-2xl font-bold text-orange-600">{mockStats.pendingSubmissions}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Graded</p>
                  <p className="text-2xl font-bold text-green-600">{mockStats.gradedAssignments}</p>
                </div>
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-purple-600">{mockStats.averageScore}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Assignments */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="assignments" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="activities">Recent Activities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="assignments" className="space-y-4">
                <AssignmentList
                  courseId={selectedCourse.id}
                  courseName={selectedCourse.name}
                  isTeacher={true}
                />
              </TabsContent>
              
              <TabsContent value="activities" className="space-y-4">
                <RecentActivities limit={15} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Notifications & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <CreateAssignmentModal
                  courseId={selectedCourse.id}
                  courseName={selectedCourse.name}
                  trigger={
                    <Button className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Create Assignment
                    </Button>
                  }
                />
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  View Submissions
                </Button>
                <Button variant="outline" className="w-full">
                  <Award className="h-4 w-4 mr-2" />
                  Grade Assignments
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Reminder
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </div>
                  <Badge variant="secondary">
                    {mockNotifications.filter(n => !n.isRead).length} new
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-3 rounded-lg border ${
                        notification.isRead ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            notification.isRead ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </p>
                          <p className={`text-sm ${
                            notification.isRead ? 'text-gray-500' : 'text-gray-600'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4">
                  View All Notifications
                </Button>
              </CardContent>
            </Card>

            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Current Course
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{selectedCourse.name}</p>
                    <p className="text-sm text-gray-600">Fall 2024 Semester</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Students:</span>
                    <span className="font-medium">32</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Assignments:</span>
                    <span className="font-medium">{mockStats.totalAssignments}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Completion Rate:</span>
                    <span className="font-medium text-green-600">78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              🎯 <strong>Assignment System Features:</strong> Create assignments, track submissions, 
              real-time notifications, activity monitoring, and automatic student notifications
            </p>
            <p className="text-xs mt-2">
              This demo showcases the complete assignment management workflow with notification system
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
