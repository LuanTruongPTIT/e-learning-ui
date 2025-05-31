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
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import CreateAssignmentModal from '@/app/(dashboard)/teacher/courses/_components/instructor-dashboard/create-assignment-modal';
import { NotificationList } from '@/components/notifications/NotificationList';
import { RecentActivities } from '@/components/assignments/RecentActivities';
import { toast, Toaster } from 'react-hot-toast';

export default function AssignmentNotificationDemo() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student'>('teacher');

  // Mock course data
  const mockCourse = {
    id: 'course-123',
    name: 'Advanced Web Development',
    description: 'Learn modern web development with React, Node.js, and databases',
    students: 32,
    assignments: 8,
    completionRate: 78
  };

  // Mock stats
  const mockStats = {
    teacher: {
      totalAssignments: 12,
      pendingSubmissions: 8,
      gradedAssignments: 4,
      averageScore: 85.5,
    },
    student: {
      totalAssignments: 8,
      completedAssignments: 5,
      pendingAssignments: 2,
      averageScore: 88.2,
    }
  };

  const handleAssignmentCreated = () => {
    toast.success('🎉 Assignment created! Students will receive notifications automatically.');
    // In real app, this would refresh the assignments list
  };

  const currentStats = mockStats[selectedRole];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Assignment & Notification System Demo
              </h1>
              <p className="text-gray-600 mt-2">
                Complete assignment management with real-time notifications and activity tracking
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">View as:</span>
                <div className="flex rounded-lg border">
                  <Button
                    variant={selectedRole === 'teacher' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedRole('teacher')}
                    className="rounded-r-none"
                  >
                    👨‍🏫 Teacher
                  </Button>
                  <Button
                    variant={selectedRole === 'student' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedRole('student')}
                    className="rounded-l-none"
                  >
                    👨‍🎓 Student
                  </Button>
                </div>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                Demo Mode
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {selectedRole === 'teacher' ? (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                      <p className="text-2xl font-bold text-gray-900">{currentStats.totalAssignments}</p>
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
                      <p className="text-2xl font-bold text-orange-600">{currentStats.pendingSubmissions}</p>
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
                      <p className="text-2xl font-bold text-green-600">{currentStats.gradedAssignments}</p>
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
                      <p className="text-2xl font-bold text-purple-600">{currentStats.averageScore}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                      <p className="text-2xl font-bold text-gray-900">{currentStats.totalAssignments}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{currentStats.completedAssignments}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-orange-600">{currentStats.pendingAssignments}</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average Score</p>
                      <p className="text-2xl font-bold text-purple-600">{currentStats.averageScore}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Features */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="assignments" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="assignments">
                  {selectedRole === 'teacher' ? 'Manage Assignments' : 'My Assignments'}
                </TabsTrigger>
                <TabsTrigger value="activities">Recent Activities</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="assignments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {selectedRole === 'teacher' ? 'Assignment Management' : 'My Assignments'}
                      </div>
                      {selectedRole === 'teacher' && (
                        <Button onClick={() => setIsCreateModalOpen(true)}>
                          <FileText className="h-4 w-4 mr-2" />
                          Create Assignment
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>
                        {selectedRole === 'teacher' 
                          ? 'Create your first assignment to see it here'
                          : 'No assignments available yet'
                        }
                      </p>
                      {selectedRole === 'teacher' && (
                        <p className="text-sm mt-2">
                          When you create an assignment, students will automatically receive notifications
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activities" className="space-y-4">
                <RecentActivities limit={15} />
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4">
                <NotificationList />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Course Info & Quick Actions */}
          <div className="space-y-6">
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
                    <p className="font-medium">{mockCourse.name}</p>
                    <p className="text-sm text-gray-600">{mockCourse.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Students:</span>
                    <span className="font-medium">{mockCourse.students}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Assignments:</span>
                    <span className="font-medium">{mockCourse.assignments}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Completion Rate:</span>
                    <span className="font-medium text-green-600">{mockCourse.completionRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Assignment API</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ✅ Ready
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notification API</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ✅ Ready
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Activity Tracking</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ✅ Ready
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ✅ Connected
                    </Badge>
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
              🎯 <strong>Features Implemented:</strong> Assignment creation with deadline management, 
              automatic student notifications, real-time activity tracking, and notification system
            </p>
            <p className="text-xs mt-2">
              Backend APIs are integrated and ready. Test by creating assignments and checking notifications.
            </p>
          </div>
        </div>
      </div>

      {/* Create Assignment Modal */}
      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        courseId={mockCourse.id}
        onAssignmentCreated={handleAssignmentCreated}
      />
    </div>
  );
}
