"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToastProvider } from "@/components/ui/toast";
import {
  BookOpen,
  Plus,
  Settings,
  Eye,
  FileDown,
  FileUp,
  HelpCircle,
  CheckCircle,
  Clock,
  Users,
  Target,
  Shuffle,
  RotateCcw,
} from "lucide-react";
import QuizBuilderModal from "../(dashboard)/teacher/courses/_components/quiz-builder/quiz-builder-modal";
import { Quiz } from "@/types/quiz";

const demoFeatures = [
  {
    title: "Question Builder",
    description: "Tạo câu hỏi đa dạng với editor trực quan",
    icon: HelpCircle,
    features: [
      "4 loại câu hỏi: Multiple choice, Multiple select, True/False, Fill blank",
      "Rich text editor cho câu hỏi",
      "Thêm/xóa/sắp xếp đáp án dễ dàng",
      "Preview real-time",
      "Validation tự động",
    ],
  },
  {
    title: "Quiz Management",
    description: "Quản lý danh sách câu hỏi với drag & drop",
    icon: BookOpen,
    features: [
      "Drag & drop để sắp xếp câu hỏi",
      "Edit/Delete/Duplicate câu hỏi",
      "Import từ CSV/JSON",
      "Export quiz ra file",
      "Auto-save draft",
    ],
  },
  {
    title: "Quiz Settings",
    description: "Cấu hình chi tiết cho quiz",
    icon: Settings,
    features: [
      "Thời gian làm bài",
      "Số lần làm bài cho phép",
      "Shuffle câu hỏi/đáp án",
      "Hiển thị kết quả & đáp án",
      "Điểm đạt yêu cầu",
    ],
  },
  {
    title: "Preview & Test",
    description: "Xem trước và test quiz trước khi publish",
    icon: Eye,
    features: [
      "Preview giao diện học sinh",
      "Test làm bài thực tế",
      "Kiểm tra scoring logic",
      "Responsive design",
      "Accessibility support",
    ],
  },
];

const mockQuizStats = [
  { label: "Tổng Quiz", value: "12", icon: BookOpen, color: "blue" },
  { label: "Câu hỏi", value: "156", icon: HelpCircle, color: "green" },
  { label: "Học sinh", value: "324", icon: Users, color: "purple" },
  { label: "Hoàn thành", value: "89%", icon: CheckCircle, color: "orange" },
];

export default function DemoQuizBuilderPage() {
  const [isQuizBuilderOpen, setIsQuizBuilderOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [savedQuiz, setSavedQuiz] = useState<Quiz | null>(null);

  const handleSaveQuiz = (quiz: Quiz) => {
    setSavedQuiz(quiz);
    setIsQuizBuilderOpen(false);
    console.log("Quiz saved:", quiz);
  };

  return (
    <ToastProvider>
      <div className="container mx-auto py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Demo: Quiz Builder</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Công cụ tạo quiz trắc nghiệm mạnh mẽ với giao diện trực quan và tính năng đa dạng
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={() => setIsQuizBuilderOpen(true)}>
                <Plus className="mr-2 h-5 w-5" />
                Thử Quiz Builder
              </Button>
              <Button size="lg" variant="outline">
                <BookOpen className="mr-2 h-5 w-5" />
                Xem Documentation
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            {mockQuizStats.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                    <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.label === "Hoàn thành" ? "Tỷ lệ hoàn thành" : "Trong hệ thống"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Saved Quiz Display */}
          {savedQuiz && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  Quiz đã lưu thành công!
                </CardTitle>
                <CardDescription className="text-green-700">
                  {savedQuiz.title} - {savedQuiz.questions.length} câu hỏi, {savedQuiz.total_points} điểm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4 text-sm">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-green-600" />
                    <span>{savedQuiz.questions.length} câu hỏi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-600" />
                    <span>{savedQuiz.total_points} điểm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span>{savedQuiz.settings.time_limit || "∞"} phút</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-green-600" />
                    <span>{savedQuiz.settings.max_attempts === 999 ? "∞" : savedQuiz.settings.max_attempts} lần</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features Overview */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Tính năng chính</h2>
              <p className="text-muted-foreground mt-2">
                Công cụ toàn diện cho việc tạo và quản lý quiz trắc nghiệm
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

          {/* Question Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Loại câu hỏi hỗ trợ</CardTitle>
              <CardDescription>
                4 loại câu hỏi phổ biến với validation và scoring tự động
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-4 h-4 border-2 border-blue-500 rounded-full"></div>
                    <div>
                      <h4 className="font-medium">Multiple Choice</h4>
                      <p className="text-sm text-muted-foreground">1 đáp án đúng, 2-6 lựa chọn</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-4 h-4 border-2 border-green-500 rounded"></div>
                    <div>
                      <h4 className="font-medium">Multiple Select</h4>
                      <p className="text-sm text-muted-foreground">Nhiều đáp án đúng</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    <div>
                      <h4 className="font-medium">True/False</h4>
                      <p className="text-sm text-muted-foreground">Câu hỏi đúng/sai</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-16 h-4 border-2 border-orange-500 rounded"></div>
                    <div>
                      <h4 className="font-medium">Fill in the Blank</h4>
                      <p className="text-sm text-muted-foreground">Điền vào chỗ trống</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Tính năng kỹ thuật</CardTitle>
              <CardDescription>
                Được xây dựng với công nghệ hiện đại và UX tối ưu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Form Management
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✅ React Hook Form integration</li>
                    <li>✅ Real-time validation</li>
                    <li>✅ Auto-save drafts</li>
                    <li>✅ Error handling</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    UI/UX Features
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✅ Drag & drop sorting</li>
                    <li>✅ Live preview</li>
                    <li>✅ Responsive design</li>
                    <li>✅ Accessibility support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <FileDown className="h-4 w-4" />
                    Import/Export
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✅ JSON export/import</li>
                    <li>✅ CSV import support</li>
                    <li>✅ Backup & restore</li>
                    <li>✅ Template sharing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Hướng dẫn sử dụng</CardTitle>
              <CardDescription>
                Các bước để tạo quiz hoàn chỉnh
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
                      <h4 className="font-medium">Tạo câu hỏi</h4>
                      <p className="text-sm text-muted-foreground">
                        Chọn loại câu hỏi, nhập nội dung và đáp án
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Sắp xếp câu hỏi</h4>
                      <p className="text-sm text-muted-foreground">
                        Drag & drop để sắp xếp thứ tự câu hỏi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Cấu hình quiz</h4>
                      <p className="text-sm text-muted-foreground">
                        Thiết lập thời gian, số lần làm, hiển thị kết quả
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
                      <h4 className="font-medium">Preview & test</h4>
                      <p className="text-sm text-muted-foreground">
                        Xem trước và test quiz trước khi publish
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      5
                    </div>
                    <div>
                      <h4 className="font-medium">Lưu & publish</h4>
                      <p className="text-sm text-muted-foreground">
                        Lưu quiz và tích hợp vào assignment
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      6
                    </div>
                    <div>
                      <h4 className="font-medium">Theo dõi kết quả</h4>
                      <p className="text-sm text-muted-foreground">
                        Xem báo cáo và phân tích kết quả học sinh
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Builder Modal */}
        <QuizBuilderModal
          isOpen={isQuizBuilderOpen}
          onClose={() => setIsQuizBuilderOpen(false)}
          onSave={handleSaveQuiz}
          assignmentId="demo-assignment"
        />
      </div>
    </ToastProvider>
  );
}
