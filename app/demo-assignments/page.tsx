"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  FileText,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import CreateAssignmentModal from "../(dashboard)/teacher/courses/_components/instructor-dashboard/create-assignment-modal";

const demoFeatures = [
  {
    title: "Tạo bài tập đa dạng",
    description: "Hỗ trợ tạo quiz online, bài tập nộp file, hoặc kết hợp cả hai",
    icon: Plus,
    features: [
      "Quiz online với thời gian giới hạn",
      "Bài tập nộp file (PDF, DOC, PPT...)",
      "Kết hợp quiz và nộp file",
      "Tùy chọn hiển thị đáp án",
      "Đính kèm file hướng dẫn",
    ],
  },
  {
    title: "Quản lý deadline",
    description: "Thiết lập và theo dõi deadline cho từng bài tập",
    icon: Calendar,
    features: [
      "Date-time picker trực quan",
      "Cảnh báo bài tập sắp hết hạn",
      "Phân loại bài tập theo trạng thái",
      "Tự động cập nhật trạng thái",
      "Thông báo cho học sinh",
    ],
  },
  {
    title: "Theo dõi tiến độ",
    description: "Giám sát việc nộp bài và tiến độ học tập của học sinh",
    icon: TrendingUp,
    features: [
      "Thống kê số bài đã nộp",
      "Tỷ lệ hoàn thành theo thời gian",
      "Danh sách học sinh chưa nộp",
      "Xuất báo cáo chi tiết",
      "Gửi nhắc nhở tự động",
    ],
  },
  {
    title: "Giao diện thân thiện",
    description: "UI/UX được thiết kế đơn giản và trực quan",
    icon: Eye,
    features: [
      "Thiết kế responsive",
      "Tìm kiếm và lọc nhanh",
      "Sắp xếp theo nhiều tiêu chí",
      "Modal tạo bài tập tiện lợi",
      "Thao tác nhanh với dropdown",
    ],
  },
];

const mockAssignments = [
  {
    id: "1",
    title: "Bài tập JavaScript cơ bản",
    type: "upload",
    deadline: "15/02/2024 23:59",
    submissions: "18/24",
    status: "active",
    description: "Hoàn thành các bài tập về biến, hàm và vòng lặp",
  },
  {
    id: "2",
    title: "Quiz: Kiến thức HTML/CSS",
    type: "quiz",
    deadline: "20/02/2024 15:30",
    submissions: "22/24",
    status: "active",
    description: "Kiểm tra kiến thức cơ bản về HTML và CSS",
    timeLimit: "45 phút",
  },
  {
    id: "3",
    title: "Dự án cuối khóa",
    type: "both",
    deadline: "01/03/2024 23:59",
    submissions: "5/24",
    status: "active",
    description: "Xây dựng website hoàn chỉnh",
    timeLimit: "120 phút",
  },
];

export default function DemoAssignmentsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "quiz":
        return "📝";
      case "upload":
        return "📄";
      case "both":
        return "🔄";
      default:
        return "📋";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Demo: Tạo bài tập cho khóa học</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Khám phá tính năng tạo và quản lý bài tập đa dạng cho giảng viên. 
            Hỗ trợ quiz online, bài tập nộp file, và quản lý deadline hiệu quả.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-5 w-5" />
              Thử tạo bài tập
            </Button>
            <Link href="/teacher/courses">
              <Button size="lg" variant="outline">
                <BookOpen className="mr-2 h-5 w-5" />
                Đến trang khóa học
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng bài tập</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Đang hoạt động</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tỷ lệ nộp bài</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75%</div>
              <p className="text-xs text-muted-foreground">Trung bình</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Học sinh</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Đã đăng ký</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sắp hết hạn</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Trong 3 ngày</p>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Tính năng chính</h2>
            <p className="text-muted-foreground mt-2">
              Công cụ toàn diện cho việc tạo và quản lý bài tập
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {demoFeatures.map((feature) => (
              <Card 
                key={feature.title} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedFeature(selectedFeature === feature.title ? null : feature.title)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <feature.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedFeature === feature.title && (
                    <div className="space-y-3 border-t pt-4">
                      <h4 className="font-medium">Tính năng chi tiết:</h4>
                      <ul className="space-y-1">
                        {feature.features.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sample Assignments */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Ví dụ bài tập</h2>
            <p className="text-muted-foreground mt-2">
              Các loại bài tập có thể tạo trong hệ thống
            </p>
          </div>

          <div className="grid gap-4">
            {mockAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {getTypeIcon(assignment.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground">{assignment.description}</p>
                        {assignment.timeLimit && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-blue-600">
                            <Clock className="h-3 w-3" />
                            {assignment.timeLimit}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">{assignment.submissions}</div>
                        <div className="text-xs text-muted-foreground">Đã nộp</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{assignment.deadline}</div>
                        <div className="text-xs text-muted-foreground">Deadline</div>
                      </div>
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status === "active" ? "Đang mở" : "Đã đóng"}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technical Implementation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Cấu trúc cơ sở dữ liệu</CardTitle>
            <CardDescription>
              Thiết kế bảng assignments để lưu trữ thông tin bài tập
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm">
{`CREATE TABLE assignments (
  id VARCHAR(255) PRIMARY KEY,
  course_id VARCHAR(255) NOT NULL,
  lecture_id VARCHAR(255), -- Optional: link to specific lecture
  title VARCHAR(500) NOT NULL,
  description TEXT,
  deadline DATETIME NOT NULL,
  assignment_type ENUM('quiz', 'upload', 'both') DEFAULT 'upload',
  show_answers BOOLEAN DEFAULT FALSE,
  time_limit INT, -- in minutes, for quiz type
  attachment_urls JSON, -- array of file URLs
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(255) NOT NULL,
  
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (lecture_id) REFERENCES lectures(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Hướng dẫn sử dụng</CardTitle>
            <CardDescription>
              Các bước để tạo và quản lý bài tập hiệu quả
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Chọn loại bài tập</h4>
                    <p className="text-sm text-muted-foreground">
                      Quiz online, nộp file, hoặc kết hợp cả hai tùy theo mục đích học tập.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Thiết lập thông tin</h4>
                    <p className="text-sm text-muted-foreground">
                      Nhập tiêu đề, mô tả chi tiết và đính kèm file hướng dẫn nếu cần.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Chọn deadline</h4>
                    <p className="text-sm text-muted-foreground">
                      Sử dụng date-time picker để thiết lập thời hạn nộp bài chính xác.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Cấu hình quiz (nếu có)</h4>
                    <p className="text-sm text-muted-foreground">
                      Thiết lập thời gian làm bài và tùy chọn hiển thị đáp án.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                    5
                  </div>
                  <div>
                    <h4 className="font-medium">Theo dõi tiến độ</h4>
                    <p className="text-sm text-muted-foreground">
                      Giám sát việc nộp bài và gửi nhắc nhở cho học sinh chưa hoàn thành.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                    6
                  </div>
                  <div>
                    <h4 className="font-medium">Đánh giá và phản hồi</h4>
                    <p className="text-sm text-muted-foreground">
                      Chấm điểm và cung cấp phản hồi chi tiết cho từng học sinh.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Assignment Modal */}
      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        courseId="demo-course"
        onAssignmentCreated={() => {
          console.log("Demo assignment created!");
        }}
      />
    </div>
  );
}
