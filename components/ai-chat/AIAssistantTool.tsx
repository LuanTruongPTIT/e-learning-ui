"use client";

import React, { useState } from "react";
import {
  PenTool,
  GraduationCap,
  HelpCircle,
  Brain,
  Loader2,
  Bot,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { aiService } from "@/services/aiChatService";
import { toast } from "react-hot-toast";

interface AIAssistantToolProps {
  className?: string;
}

export default function AIAssistantTool({ className }: AIAssistantToolProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ [key: string]: string }>({});

  // Study Plan state
  const [studyPlan, setStudyPlan] = useState({
    courseId: "",
    studentLevel: "beginner",
    preferences: "",
  });

  // Concept Explanation state
  const [conceptForm, setConceptForm] = useState({
    concept: "",
    subject: "",
    studentLevel: "beginner",
  });

  // Assignment Review state
  const [assignmentForm, setAssignmentForm] = useState({
    assignmentText: "",
    rubric: "",
  });

  // Quiz Generation state
  const [quizForm, setQuizForm] = useState({
    topic: "",
    questionCount: 5,
    difficulty: "medium",
  });

  const handleGenerateStudyPlan = async () => {
    if (!studyPlan.courseId || !studyPlan.preferences) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setIsLoading(true);
    try {
      const response = await aiService.generateStudyPlan(studyPlan);
      setResults((prev) => ({ ...prev, studyPlan: response.studyPlan }));
      toast.success("Đã tạo kế hoạch học tập thành công!");
    } catch (error) {
      console.error("Error generating study plan:", error);
      toast.error("Đã có lỗi xảy ra khi tạo kế hoạch học tập");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplainConcept = async () => {
    if (!conceptForm.concept || !conceptForm.subject) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setIsLoading(true);
    try {
      const response = await aiService.explainConcept(conceptForm);
      setResults((prev) => ({ ...prev, concept: response.explanation }));
      toast.success("Đã giải thích khái niệm thành công!");
    } catch (error) {
      console.error("Error explaining concept:", error);
      toast.error("Đã có lỗi xảy ra khi giải thích khái niệm");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewAssignment = async () => {
    if (!assignmentForm.assignmentText || !assignmentForm.rubric) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setIsLoading(true);
    try {
      const response = await aiService.reviewAssignment(assignmentForm);
      setResults((prev) => ({ ...prev, assignment: response.review }));
      toast.success("Đã đánh giá bài tập thành công!");
    } catch (error) {
      console.error("Error reviewing assignment:", error);
      toast.error("Đã có lỗi xảy ra khi đánh giá bài tập");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!quizForm.topic) {
      toast.error("Vui lòng nhập chủ đề");
      return;
    }

    setIsLoading(true);
    try {
      const response = await aiService.generateQuiz(quizForm);
      setResults((prev) => ({ ...prev, quiz: response.quiz }));
      toast.success("Đã tạo câu hỏi thành công!");
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Đã có lỗi xảy ra khi tạo câu hỏi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-blue-500" />
          AI Trợ Lý Giáo Dục
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="study-plan" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="study-plan" className="flex items-center gap-1">
              <GraduationCap className="h-4 w-4" />
              Kế Hoạch
            </TabsTrigger>
            <TabsTrigger value="concept" className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
              Giải Thích
            </TabsTrigger>
            <TabsTrigger value="assignment" className="flex items-center gap-1">
              <PenTool className="h-4 w-4" />
              Đánh Giá
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              Tạo Quiz
            </TabsTrigger>
          </TabsList>

          {/* Study Plan Tab */}
          <TabsContent value="study-plan" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="courseId">Mã Khóa Học</Label>
                  <Input
                    id="courseId"
                    value={studyPlan.courseId}
                    onChange={(e) =>
                      setStudyPlan((prev) => ({
                        ...prev,
                        courseId: e.target.value,
                      }))
                    }
                    placeholder="VD: MATH101"
                  />
                </div>
                <div>
                  <Label htmlFor="studentLevel">Trình Độ Sinh Viên</Label>
                  <Select
                    value={studyPlan.studentLevel}
                    onValueChange={(value) =>
                      setStudyPlan((prev) => ({ ...prev, studentLevel: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Cơ bản</SelectItem>
                      <SelectItem value="intermediate">Trung bình</SelectItem>
                      <SelectItem value="advanced">Nâng cao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="preferences">Sở Thích & Mục Tiêu</Label>
                  <Textarea
                    id="preferences"
                    value={studyPlan.preferences}
                    onChange={(e) =>
                      setStudyPlan((prev) => ({
                        ...prev,
                        preferences: e.target.value,
                      }))
                    }
                    placeholder="Mô tả sở thích học tập, mục tiêu và thời gian có sẵn..."
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleGenerateStudyPlan}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Tạo Kế Hoạch"
                  )}
                </Button>
              </div>
              <div>
                {results.studyPlan && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Kế Hoạch Học Tập:</h4>
                    <div className="text-sm whitespace-pre-wrap">
                      {results.studyPlan}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Concept Explanation Tab */}
          <TabsContent value="concept" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="concept">Khái Niệm Cần Giải Thích</Label>
                  <Input
                    id="concept"
                    value={conceptForm.concept}
                    onChange={(e) =>
                      setConceptForm((prev) => ({
                        ...prev,
                        concept: e.target.value,
                      }))
                    }
                    placeholder="VD: Tích phân, Thuật toán, DNA..."
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Môn Học</Label>
                  <Input
                    id="subject"
                    value={conceptForm.subject}
                    onChange={(e) =>
                      setConceptForm((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    placeholder="VD: Toán học, Tin học, Sinh học..."
                  />
                </div>
                <div>
                  <Label htmlFor="conceptLevel">Trình Độ</Label>
                  <Select
                    value={conceptForm.studentLevel}
                    onValueChange={(value) =>
                      setConceptForm((prev) => ({
                        ...prev,
                        studentLevel: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Cơ bản</SelectItem>
                      <SelectItem value="intermediate">Trung bình</SelectItem>
                      <SelectItem value="advanced">Nâng cao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleExplainConcept}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Giải Thích"
                  )}
                </Button>
              </div>
              <div>
                {results.concept && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Giải Thích:</h4>
                    <div className="text-sm whitespace-pre-wrap">
                      {results.concept}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Assignment Review Tab */}
          <TabsContent value="assignment" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="assignmentText">Nội Dung Bài Tập</Label>
                  <Textarea
                    id="assignmentText"
                    value={assignmentForm.assignmentText}
                    onChange={(e) =>
                      setAssignmentForm((prev) => ({
                        ...prev,
                        assignmentText: e.target.value,
                      }))
                    }
                    placeholder="Dán nội dung bài tập cần đánh giá..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="rubric">Tiêu Chí Đánh Giá</Label>
                  <Textarea
                    id="rubric"
                    value={assignmentForm.rubric}
                    onChange={(e) =>
                      setAssignmentForm((prev) => ({
                        ...prev,
                        rubric: e.target.value,
                      }))
                    }
                    placeholder="Mô tả tiêu chí chấm điểm và yêu cầu..."
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleReviewAssignment}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Đánh Giá"
                  )}
                </Button>
              </div>
              <div>
                {results.assignment && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Đánh Giá:</h4>
                    <div className="text-sm whitespace-pre-wrap">
                      {results.assignment}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Quiz Generation Tab */}
          <TabsContent value="quiz" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="topic">Chủ Đề</Label>
                  <Input
                    id="topic"
                    value={quizForm.topic}
                    onChange={(e) =>
                      setQuizForm((prev) => ({
                        ...prev,
                        topic: e.target.value,
                      }))
                    }
                    placeholder="VD: Phương trình bậc 2, Lập trình OOP..."
                  />
                </div>
                <div>
                  <Label htmlFor="questionCount">Số Câu Hỏi</Label>
                  <Input
                    id="questionCount"
                    type="number"
                    min="1"
                    max="20"
                    value={quizForm.questionCount}
                    onChange={(e) =>
                      setQuizForm((prev) => ({
                        ...prev,
                        questionCount: parseInt(e.target.value) || 5,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Độ Khó</Label>
                  <Select
                    value={quizForm.difficulty}
                    onValueChange={(value) =>
                      setQuizForm((prev) => ({ ...prev, difficulty: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Dễ</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="hard">Khó</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleGenerateQuiz}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Tạo Quiz"
                  )}
                </Button>
              </div>
              <div>
                {results.quiz && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Câu Hỏi Quiz:</h4>
                    <div className="text-sm whitespace-pre-wrap">
                      {results.quiz}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
