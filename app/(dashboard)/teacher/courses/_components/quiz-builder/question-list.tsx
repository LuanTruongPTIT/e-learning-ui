"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  GripVertical,
  CheckCircle,
  Circle,
  Square,
  HelpCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { QuizQuestion, QUESTION_TYPE_LABELS } from "@/types/quiz";

interface QuestionListProps {
  questions: QuizQuestion[];
  onAdd: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onDuplicate: (index: number) => void;
  onReorder: (questions: QuizQuestion[]) => void;
}

export default function QuestionList({
  questions,
  onAdd,
  onEdit,
  onDelete,
  onDuplicate,
  onReorder,
}: QuestionListProps) {
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newQuestions = [...questions];
    const draggedQuestion = newQuestions[draggedIndex];
    
    // Remove dragged question
    newQuestions.splice(draggedIndex, 1);
    
    // Insert at new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newQuestions.splice(insertIndex, 0, draggedQuestion);
    
    onReorder(newQuestions);
    setDraggedIndex(null);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newQuestions = [...questions];
      [newQuestions[index - 1], newQuestions[index]] = [newQuestions[index], newQuestions[index - 1]];
      onReorder(newQuestions);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < questions.length - 1) {
      const newQuestions = [...questions];
      [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
      onReorder(newQuestions);
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple_choice':
        return <Circle className="h-4 w-4" />;
      case 'multiple_select':
        return <Square className="h-4 w-4" />;
      case 'true_false':
        return <CheckCircle className="h-4 w-4" />;
      case 'fill_blank':
        return <HelpCircle className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getCorrectAnswersCount = (question: QuizQuestion) => {
    return question.answers.filter(a => a.is_correct).length;
  };

  const renderQuestionPreview = (question: QuizQuestion) => {
    const correctCount = getCorrectAnswersCount(question);
    
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600 line-clamp-2">
          {question.question_text}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            {getQuestionTypeIcon(question.question_type)}
            {QUESTION_TYPE_LABELS[question.question_type]}
          </span>
          <span>{question.answers.length} đáp án</span>
          <span className="text-green-600">{correctCount} đúng</span>
          <span>{question.points} điểm</span>
        </div>
      </div>
    );
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <HelpCircle className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Chưa có câu hỏi nào
        </h3>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          Bắt đầu tạo quiz bằng cách thêm câu hỏi đầu tiên
        </p>
        <Button onClick={onAdd} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Tạo câu hỏi đầu tiên
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Danh sách câu hỏi</h3>
          <p className="text-sm text-muted-foreground">
            Kéo thả để sắp xếp lại thứ tự câu hỏi
          </p>
        </div>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm câu hỏi
        </Button>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {questions.map((question, index) => (
          <Card
            key={question.id}
            className={`transition-all duration-200 ${
              draggedIndex === index ? "opacity-50 scale-95" : "hover:shadow-md"
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Drag Handle */}
                <div className="cursor-move mt-1">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                </div>

                {/* Question Number */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                </div>

                {/* Question Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      {renderQuestionPreview(question)}
                    </div>
                    
                    {/* Question Meta */}
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {question.points} điểm
                      </Badge>
                      
                      {/* Move buttons for mobile */}
                      <div className="flex flex-col gap-1 md:hidden">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === questions.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Actions Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(index)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDuplicate(index)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Nhân bản
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className="hidden md:flex"
                          >
                            <ArrowUp className="h-4 w-4 mr-2" />
                            Di chuyển lên
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleMoveDown(index)}
                            disabled={index === questions.length - 1}
                            className="hidden md:flex"
                          >
                            <ArrowDown className="h-4 w-4 mr-2" />
                            Di chuyển xuống
                          </DropdownMenuItem>
                          {index < questions.length - 1 && (
                            <DropdownMenuSeparator className="hidden md:block" />
                          )}
                          <DropdownMenuItem
                            onClick={() => setDeleteIndex(index)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Question Answers Preview */}
                  {question.question_type !== 'fill_blank' && (
                    <div className="mt-3 space-y-1">
                      {question.answers.slice(0, 3).map((answer, answerIndex) => (
                        <div
                          key={answerIndex}
                          className={`text-xs px-2 py-1 rounded ${
                            answer.is_correct
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            {answer.is_correct && <CheckCircle className="h-3 w-3" />}
                            {answer.answer_text}
                          </span>
                        </div>
                      ))}
                      {question.answers.length > 3 && (
                        <div className="text-xs text-muted-foreground px-2">
                          +{question.answers.length - 3} đáp án khác
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700">
              Tổng cộng: {questions.length} câu hỏi
            </span>
            <span className="text-blue-700 font-medium">
              {questions.reduce((sum, q) => sum + q.points, 0)} điểm
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteIndex !== null} onOpenChange={() => setDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa câu hỏi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteIndex !== null) {
                  onDelete(deleteIndex);
                  setDeleteIndex(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
