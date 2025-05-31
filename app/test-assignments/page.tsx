"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToastProvider } from "@/components/ui/toast";
import CreateAssignmentModal from "../(dashboard)/teacher/courses/_components/instructor-dashboard/create-assignment-modal";
import CourseAssignments from "../(dashboard)/teacher/courses/_components/instructor-dashboard/course-assignments";
import { Plus, BookOpen, FileText, Users, Calendar } from "lucide-react";

export default function TestAssignmentsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("create");

  return (
    <ToastProvider>
      <div className="container mx-auto py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Test: Assignment Features</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Test tính năng tạo và quản lý bài tập với UI components hoàn chỉnh
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("create")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "create"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Plus className="inline-block w-4 h-4 mr-2" />
                Test Create Modal
              </button>
              <button
                onClick={() => setActiveTab("manage")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "manage"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileText className="inline-block w-4 h-4 mr-2" />
                Test Management
              </button>
            </div>
          </div>

          {/* Test Create Modal */}
          {activeTab === "create" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Test Create Assignment Modal
                </CardTitle>
                <CardDescription>
                  Click nút bên dưới để test modal tạo bài tập với đầy đủ tính năng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center p-4 border rounded-lg">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <h3 className="font-medium">Quiz Online</h3>
                      <p className="text-sm text-muted-foreground">
                        Tạo quiz với thời gian giới hạn
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <h3 className="font-medium">Upload File</h3>
                      <p className="text-sm text-muted-foreground">
                        Bài tập yêu cầu nộp file
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Users className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <h3 className="font-medium">Kết hợp</h3>
                      <p className="text-sm text-muted-foreground">
                        Cả quiz và nộp file
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button size="lg" onClick={() => setIsCreateModalOpen(true)}>
                      <Plus className="mr-2 h-5 w-5" />
                      Mở Modal Tạo Bài Tập
                    </Button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Tính năng trong modal:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Form validation real-time</li>
                      <li>• Date-time picker cho deadline</li>
                      <li>• File upload với preview</li>
                      <li>• Cấu hình quiz (thời gian, hiển thị đáp án)</li>
                      <li>• Toast notifications</li>
                      <li>• Loading states</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Test Management Component */}
          {activeTab === "manage" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Test Assignment Management
                </CardTitle>
                <CardDescription>
                  Component quản lý danh sách bài tập với đầy đủ tính năng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">3</div>
                      <div className="text-sm text-blue-600">Tổng bài tập</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">75%</div>
                      <div className="text-sm text-green-600">Tỷ lệ nộp bài</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">24</div>
                      <div className="text-sm text-orange-600">Học sinh</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">1</div>
                      <div className="text-sm text-red-600">Sắp hết hạn</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Tính năng quản lý:</h4>
                    <div className="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground">
                      <div>
                        <li>• Tìm kiếm theo tiêu đề, mô tả</li>
                        <li>• Lọc theo trạng thái</li>
                        <li>• Sắp xếp theo nhiều tiêu chí</li>
                      </div>
                      <div>
                        <li>• Dropdown actions (view, edit, delete)</li>
                        <li>• Progress tracking</li>
                        <li>• Responsive table</li>
                      </div>
                    </div>
                  </div>

                  {/* Assignment Management Component */}
                  <div className="border rounded-lg p-4">
                    <CourseAssignments courseId="test-course" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Tính năng đã triển khai</CardTitle>
              <CardDescription>
                Tổng quan về các component và tính năng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    CreateAssignmentModal
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✅ Form validation với React Hook Form</li>
                    <li>✅ Date-time picker với date-fns</li>
                    <li>✅ File upload với preview</li>
                    <li>✅ 3 loại bài tập (Quiz/Upload/Both)</li>
                    <li>✅ Cấu hình quiz (time limit, show answers)</li>
                    <li>✅ Toast notifications</li>
                    <li>✅ Loading states</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    CourseAssignments
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✅ Search & filter functionality</li>
                    <li>✅ Sortable table columns</li>
                    <li>✅ Status badges với colors</li>
                    <li>✅ Progress tracking</li>
                    <li>✅ Dropdown actions menu</li>
                    <li>✅ Responsive design</li>
                    <li>✅ Empty state handling</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Stack */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Implementation</CardTitle>
              <CardDescription>
                Stack công nghệ và libraries sử dụng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h4 className="font-medium mb-2">Frontend</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Next.js 15 App Router</li>
                    <li>• React 19 + TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• Shadcn/ui components</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Form & State</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• React Hook Form</li>
                    <li>• Date-fns for dates</li>
                    <li>• Custom Toast system</li>
                    <li>• Local state management</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">UI/UX</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Responsive design</li>
                    <li>• Loading states</li>
                    <li>• Form validation</li>
                    <li>• Accessibility support</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Next Steps
              </CardTitle>
              <CardDescription>
                Các bước tiếp theo để hoàn thiện tính năng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Backend Integration</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Tạo API endpoints</li>
                    <li>• Database migrations</li>
                    <li>• File upload handling</li>
                    <li>• Authentication & authorization</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Advanced Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Quiz builder interface</li>
                    <li>• Auto-grading system</li>
                    <li>• Email notifications</li>
                    <li>• Analytics dashboard</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Assignment Modal */}
        <CreateAssignmentModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          courseId="test-course"
          onAssignmentCreated={() => {
            console.log("Assignment created in test mode!");
          }}
        />
      </div>
    </ToastProvider>
  );
}
