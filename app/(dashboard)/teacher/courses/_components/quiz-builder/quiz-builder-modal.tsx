"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Plus,
  Save,
  Eye,
  FileDown,
  FileUp,
  Clock,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/toast";
import {
  Quiz,
  QuizQuestion,
  QuizSettings as QuizSettingsType,
  QuizBuilderForm,
  DEFAULT_QUIZ_SETTINGS,
  QuizValidationResult,
} from "@/types/quiz";

import {
  validateQuiz,
  generateQuizId,
  generateQuestionId,
} from "@/lib/quiz-utils";
import QuestionBuilder from "./question-builder";
import QuizPreview from "./quiz-preview";
import QuestionList from "./question-list";
import QuizSettingsComponent from "./quiz-settings";

interface QuizBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quiz: Quiz) => void;
  initialQuiz?: Quiz;
  assignmentId: string;
}

export default function QuizBuilderModal({
  isOpen,
  onClose,
  onSave,
  initialQuiz,
  assignmentId,
}: QuizBuilderModalProps) {
  const [activeTab, setActiveTab] = useState("questions");
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    initialQuiz?.questions || []
  );
  const [settings, setSettings] = useState<QuizSettingsType>(
    initialQuiz?.settings || DEFAULT_QUIZ_SETTINGS
  );
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<
    number | null
  >(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const form = useForm<QuizBuilderForm>({
    defaultValues: {
      title: initialQuiz?.title || "",
      description: initialQuiz?.description || "",
      settings: settings,
      questions: questions,
    },
  });

  // Auto-save functionality
  useEffect(() => {
    const autoSave = () => {
      const formData = form.getValues();
      const draftData = {
        ...formData,
        questions,
        settings,
      };
      localStorage.setItem(
        `quiz-draft-${assignmentId}`,
        JSON.stringify(draftData)
      );
      setLastSaved(new Date());
    };

    const interval = setInterval(autoSave, 30000); // Auto-save every 30 seconds
    return () => clearInterval(interval);
  }, [questions, settings, assignmentId, form]);

  // Load draft on mount
  useEffect(() => {
    if (!initialQuiz) {
      const draftData = localStorage.getItem(`quiz-draft-${assignmentId}`);
      if (draftData) {
        try {
          const draft = JSON.parse(draftData);
          form.reset(draft);
          setQuestions(draft.questions || []);
          setSettings(draft.settings || DEFAULT_QUIZ_SETTINGS);
        } catch (error) {
          console.error("Failed to load draft:", error);
        }
      }
    }
  }, [initialQuiz, assignmentId, form]);

  const handleAddQuestion = () => {
    setIsEditingQuestion(true);
    setEditingQuestionIndex(null);
  };

  const handleEditQuestion = (index: number) => {
    setIsEditingQuestion(true);
    setEditingQuestionIndex(index);
  };

  const handleSaveQuestion = (question: QuizQuestion) => {
    if (editingQuestionIndex !== null) {
      // Edit existing question
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = question;
      setQuestions(updatedQuestions);
    } else {
      // Add new question
      const newQuestion = {
        ...question,
        id: generateQuestionId(),
        order: questions.length,
      };
      setQuestions([...questions, newQuestion]);
    }
    setIsEditingQuestion(false);
    setEditingQuestionIndex(null);
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    // Update order for remaining questions
    const reorderedQuestions = updatedQuestions.map((q, i) => ({
      ...q,
      order: i,
    }));
    setQuestions(reorderedQuestions);
  };

  const handleDuplicateQuestion = (index: number) => {
    const questionToDuplicate = questions[index];
    const duplicatedQuestion = {
      ...questionToDuplicate,
      id: generateQuestionId(),
      order: questions.length,
      question_text: `${questionToDuplicate.question_text} (Copy)`,
    };
    setQuestions([...questions, duplicatedQuestion]);
  };

  const handleReorderQuestions = (newQuestions: QuizQuestion[]) => {
    const reorderedQuestions = newQuestions.map((q, i) => ({ ...q, order: i }));
    setQuestions(reorderedQuestions);
  };

  const handleSaveQuiz = async () => {
    setIsSaving(true);
    try {
      const formData = form.getValues();

      // Validate quiz
      const validation: QuizValidationResult = validateQuiz({
        title: formData.title,
        description: formData.description,
        questions,
        settings,
      });

      if (!validation.isValid) {
        validation.errors.forEach((error) => {
          toast.error(error.message);
        });
        setIsSaving(false);
        return;
      }

      // Show warnings if any
      validation.warnings.forEach((warning) => {
        toast.warning(warning.message);
      });

      const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

      const quiz: Quiz = {
        id: initialQuiz?.id || generateQuizId(),
        assignment_id: assignmentId,
        title: formData.title,
        description: formData.description,
        settings,
        questions,
        total_points: totalPoints,
        created_at: initialQuiz?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await onSave(quiz);

      // Clear draft
      localStorage.removeItem(`quiz-draft-${assignmentId}`);

      toast.success("Quiz đã được lưu thành công!");
      onClose();
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast.error("Có lỗi xảy ra khi lưu quiz");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImportQuestions = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let importedData;

        if (file.name.endsWith(".json")) {
          importedData = JSON.parse(content);
        } else if (file.name.endsWith(".csv")) {
          // Simple CSV parsing for questions
          const lines = content.split("\n");
          const headers = lines[0].split(",");
          importedData = {
            questions: lines
              .slice(1)
              .map((line, index) => {
                const values = line.split(",");
                return {
                  question: values[0] || "",
                  type: "multiple_choice",
                  points: 1,
                  answers: [
                    { text: values[1] || "", correct: true },
                    { text: values[2] || "", correct: false },
                    { text: values[3] || "", correct: false },
                    { text: values[4] || "", correct: false },
                  ].filter((a) => a.text),
                };
              })
              .filter((q) => q.question),
          };
        }

        if (importedData?.questions) {
          const newQuestions = importedData.questions.map(
            (q: any, index: number) => ({
              id: generateQuestionId(),
              question_text: q.question,
              question_type: q.type || "multiple_choice",
              points: q.points || 1,
              order: questions.length + index,
              answers: q.answers.map((a: any, aIndex: number) => ({
                id: `answer-${Date.now()}-${aIndex}`,
                answer_text: a.text,
                is_correct: a.correct,
                order: aIndex,
              })),
              explanation: q.explanation || "",
            })
          );

          setQuestions([...questions, ...newQuestions]);
          toast.success(`Đã import ${newQuestions.length} câu hỏi`);
        }
      } catch (error) {
        console.error("Import error:", error);
        toast.error("Lỗi khi import file. Vui lòng kiểm tra định dạng file.");
      }
    };
    reader.readAsText(file);
  };

  const handleExportQuiz = () => {
    const formData = form.getValues();
    const exportData = {
      quiz_title: formData.title,
      quiz_description: formData.description,
      settings,
      questions: questions.map((q) => ({
        order: q.order,
        question: q.question_text,
        type: q.question_type,
        points: q.points,
        answers: q.answers.map((a) => ({
          order: a.order,
          text: a.answer_text,
          correct: a.is_correct,
        })),
        explanation: q.explanation,
      })),
      export_date: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-${formData.title
      .replace(/\s+/g, "-")
      .toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Quiz đã được export thành công!");
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">
                {initialQuiz ? "Chỉnh sửa Quiz" : "Tạo Quiz mới"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Tạo và quản lý câu hỏi trắc nghiệm cho bài tập
              </p>
            </div>
            <div className="flex items-center gap-2">
              {lastSaved && (
                <span className="text-xs text-muted-foreground">
                  Đã lưu: {lastSaved.toLocaleTimeString()}
                </span>
              )}
              <Badge variant="outline" className="flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                {questions.length} câu hỏi
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {totalPoints} điểm
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tiêu đề Quiz *
              </label>
              <Input
                {...form.register("title", {
                  required: "Vui lòng nhập tiêu đề",
                })}
                placeholder="Nhập tiêu đề quiz..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mô tả</label>
              <Input
                {...form.register("description")}
                placeholder="Mô tả ngắn về quiz..."
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                value="questions"
                className="flex items-center gap-2"
              >
                <HelpCircle className="h-4 w-4" />
                Câu hỏi ({questions.length})
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Cài đặt
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Xem trước
              </TabsTrigger>
              <TabsTrigger
                value="import-export"
                className="flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                Import/Export
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 h-[500px] overflow-y-auto">
              <TabsContent value="questions" className="space-y-4">
                {isEditingQuestion ? (
                  <QuestionBuilder
                    question={
                      editingQuestionIndex !== null
                        ? questions[editingQuestionIndex]
                        : undefined
                    }
                    onSave={handleSaveQuestion}
                    onCancel={() => {
                      setIsEditingQuestion(false);
                      setEditingQuestionIndex(null);
                    }}
                  />
                ) : (
                  <QuestionList
                    questions={questions}
                    onAdd={handleAddQuestion}
                    onEdit={handleEditQuestion}
                    onDelete={handleDeleteQuestion}
                    onDuplicate={handleDuplicateQuestion}
                    onReorder={handleReorderQuestions}
                  />
                )}
              </TabsContent>

              <TabsContent value="settings">
                <QuizSettingsComponent
                  settings={settings}
                  onChange={setSettings}
                />
              </TabsContent>

              <TabsContent value="preview">
                <QuizPreview
                  quiz={{
                    id: "preview",
                    assignment_id: assignmentId,
                    title: form.getValues("title") || "Quiz Preview",
                    description: form.getValues("description"),
                    settings,
                    questions,
                    total_points: totalPoints,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  }}
                />
              </TabsContent>

              <TabsContent value="import-export" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileUp className="h-5 w-5" />
                        Import câu hỏi
                      </CardTitle>
                      <CardDescription>
                        Import câu hỏi từ file JSON hoặc CSV
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <input
                        type="file"
                        accept=".json,.csv"
                        onChange={handleImportQuestions}
                        className="hidden"
                        id="import-file"
                      />
                      <label
                        htmlFor="import-file"
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <FileUp className="h-4 w-4" />
                        Chọn file
                      </label>
                      <p className="text-xs text-muted-foreground mt-2">
                        Hỗ trợ: .json, .csv
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileDown className="h-5 w-5" />
                        Export quiz
                      </CardTitle>
                      <CardDescription>
                        Xuất quiz ra file JSON để backup hoặc chia sẻ
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={handleExportQuiz}
                        variant="outline"
                        className="w-full"
                        disabled={questions.length === 0}
                      >
                        <FileDown className="h-4 w-4 mr-2" />
                        Export JSON
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {settings.time_limit
                ? `${settings.time_limit} phút`
                : "Không giới hạn"}
            </span>
            <span className="flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              {questions.length} câu hỏi
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              {totalPoints} điểm
            </span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              onClick={handleSaveQuiz}
              disabled={
                isSaving || questions.length === 0 || !form.getValues("title")
              }
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu Quiz
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
