'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Users, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Download
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { assignmentApi, Assignment } from '@/apis/assignments';
import { CreateAssignmentModal } from './CreateAssignmentModal';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface AssignmentListProps {
  courseId: string;
  courseName: string;
  isTeacher?: boolean;
}

export function AssignmentList({ courseId, courseName, isTeacher = false }: AssignmentListProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      const response = await assignmentApi.getAssignmentsByCourse(courseId);
      
      if (response.status === 200) {
        setAssignments(response.data);
      } else {
        toast.error('Failed to load assignments');
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) {
      return;
    }

    try {
      const response = await assignmentApi.deleteAssignment(assignmentId);
      
      if (response.status === 200) {
        toast.success('Assignment deleted successfully');
        fetchAssignments(); // Refresh list
      } else {
        toast.error('Failed to delete assignment');
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast.error('Failed to delete assignment');
    }
  };

  const getAssignmentTypeColor = (type: string) => {
    switch (type) {
      case 'upload':
        return 'bg-blue-100 text-blue-800';
      case 'quiz':
        return 'bg-purple-100 text-purple-800';
      case 'both':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssignmentTypeLabel = (type: string) => {
    switch (type) {
      case 'upload':
        return 'File Upload';
      case 'quiz':
        return 'Quiz';
      case 'both':
        return 'Upload + Quiz';
      default:
        return type;
    }
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assignments ({assignments.length})
          </CardTitle>
          {isTeacher && (
            <CreateAssignmentModal
              courseId={courseId}
              courseName={courseName}
              onSuccess={fetchAssignments}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {assignments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No assignments found</p>
            {isTeacher && (
              <p className="text-sm mt-2">Create your first assignment to get started</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => {
              const daysUntil = getDaysUntilDeadline(assignment.deadline);
              const overdue = isOverdue(assignment.deadline);
              
              return (
                <div key={assignment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{assignment.title}</h3>
                        <Badge className={getAssignmentTypeColor(assignment.assignment_type)}>
                          {getAssignmentTypeLabel(assignment.assignment_type)}
                        </Badge>
                        {!assignment.is_published && (
                          <Badge variant="outline">Draft</Badge>
                        )}
                      </div>
                      
                      {assignment.description && (
                        <p className="text-gray-600 mb-3 line-clamp-2">{assignment.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {format(new Date(assignment.deadline), 'MMM dd, yyyy HH:mm')}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {overdue ? (
                            <span className="text-red-600 font-medium">Overdue</span>
                          ) : daysUntil === 0 ? (
                            <span className="text-orange-600 font-medium">Due today</span>
                          ) : daysUntil === 1 ? (
                            <span className="text-yellow-600 font-medium">Due tomorrow</span>
                          ) : (
                            <span>{daysUntil} days left</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>Max: {assignment.max_score} pts</span>
                        </div>
                        
                        {assignment.time_limit_minutes && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{assignment.time_limit_minutes} min</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!isTeacher && (
                        <Button size="sm">
                          View Assignment
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          
                          {assignment.attachment_urls && assignment.attachment_urls.length > 0 && (
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Files
                            </DropdownMenuItem>
                          )}
                          
                          {isTeacher && (
                            <>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Assignment
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteAssignment(assignment.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Assignment
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
