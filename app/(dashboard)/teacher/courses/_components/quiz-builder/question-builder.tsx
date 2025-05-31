"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Save,
  X,
  Eye,
  AlertCircle,
  CheckCircle,
  GripVertical,
  HelpCircle,
} from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "@/components/ui/toast";
import {
  QuizQuestion,
  QuestionType,
  QuizAnswer,
  QuestionBuilderForm,
  QUESTION_TYPE_LABELS,
  MAX_ANSWERS_PER_QUESTION,
  MIN_ANSWERS_PER_QUESTION,
} from "@/types/quiz";
import { generateAnswerId } from "@/lib/quiz-utils";

interface QuestionBuilderProps {
  question?: QuizQuestion;
  onSave: (question: QuizQuestion) => void;
  onCancel: () => void;
}

export default function QuestionBuilder({
  question,
  onSave,
  onCancel,
}: QuestionBuilderProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [questionType, setQuestionType] = useState<QuestionType>(
    question?.question_type || 'multiple_choice'
  );

  const form = useForm<QuestionBuilderForm>({
    defaultValues: {
      question_text: question?.question_text || "",
      question_type: questionType,
      points: question?.points || 1,
      answers: question?.answers.map(a => ({
        answer_text: a.answer_text,
        is_correct: a.is_correct,
      })) || [
        { answer_text: "", is_correct: false },
        { answer_text: "", is_correct: false },
      ],
      explanation: question?.explanation || "",
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "answers",
  });

  // Update form when question type changes
  useEffect(() => {
    const currentAnswers = form.getValues("answers");
    
    if (questionType === 'true_false') {
      // For true/false, set exactly 2 answers
      form.setValue("answers", [
        { answer_text: "Đúng", is_correct: false },
        { answer_text: "Sai", is_correct: false },
      ]);
    } else if (questionType === 'fill_blank') {
      // For fill in blank, set 1 answer
      form.setValue("answers", [
        { answer_text: "", is_correct: true },
      ]);
    } else if (currentAnswers.length < MIN_ANSWERS_PER_QUESTION) {
      // Ensure minimum answers for other types
      const newAnswers = [...currentAnswers];
      while (newAnswers.length < MIN_ANSWERS_PER_QUESTION) {
        newAnswers.push({ answer_text: "", is_correct: false });
      }
      form.setValue("answers", newAnswers);
    }
  }, [questionType, form]);

  const handleAddAnswer = () => {
    if (fields.length < MAX_ANSWERS_PER_QUESTION) {
      append({ answer_text: "", is_correct: false });
    }
  };

  const handleRemoveAnswer = (index: number) => {
    if (fields.length > MIN_ANSWERS_PER_QUESTION && questionType !== 'true_false') {
      remove(index);
    }
  };

  const handleCorrectAnswerChange = (index: number, isCorrect: boolean) => {
    const currentAnswers = form.getValues("answers");
    
    if (questionType === 'multiple_choice' || questionType === 'true_false') {
      // For single choice, uncheck others
      const updatedAnswers = currentAnswers.map((answer, i) => ({
        ...answer,
        is_correct: i === index ? isCorrect : false,
      }));
      form.setValue("answers", updatedAnswers);
    } else {
      // For multiple choice, allow multiple correct answers
      const updatedAnswers = [...currentAnswers];
      updatedAnswers[index] = { ...updatedAnswers[index], is_correct: isCorrect };
      form.setValue("answers", updatedAnswers);
    }
  };

  const validateQuestion = (): boolean => {
    const formData = form.getValues();
    
    // Check question text
    if (!formData.question_text.trim()) {
      toast.error("Vui lòng nhập câu hỏi");
      return false;
    }

    // Check points
    if (formData.points <= 0) {
      toast.error("Điểm số phải lớn hơn 0");
      return false;
    }

    // Check answers based on question type
    if (questionType === 'fill_blank') {
      if (!formData.answers[0]?.answer_text.trim()) {
        toast.error("Vui lòng nhập đáp án cho câu hỏi điền vào chỗ trống");
        return false;
      }
    } else {
      // Check if all answers have text
      const emptyAnswers = formData.answers.filter(a => !a.answer_text.trim());
      if (emptyAnswers.length > 0) {
        toast.error("Vui lòng nhập nội dung cho tất cả đáp án");
        return false;
      }

      // Check if at least one answer is correct
      const correctAnswers = formData.answers.filter(a => a.is_correct);
      if (correctAnswers.length === 0) {
        toast.error("Vui lòng chọn ít nhất một đáp án đúng");
        return false;
      }

      // For multiple choice, ensure only one correct answer
      if (questionType === 'multiple_choice' && correctAnswers.length > 1) {
        toast.error("Câu hỏi trắc nghiệm chỉ được có một đáp án đúng");
        return false;
      }
    }

    return true;
  };

  const handleSave = () => {
    if (!validateQuestion()) return;

    const formData = form.getValues();
    
    const savedQuestion: QuizQuestion = {
      id: question?.id || `question-${Date.now()}`,
      question_text: formData.question_text,
      question_type: questionType,
      points: formData.points,
      order: question?.order || 0,
      answers: formData.answers.map((answer, index) => ({
        id: question?.answers[index]?.id || generateAnswerId(),
        answer_text: answer.answer_text,
        is_correct: answer.is_correct,
        order: index,
      })),
      explanation: formData.explanation,
    };

    onSave(savedQuestion);
  };

  const renderAnswerInput = (field: any, index: number) => {
    const isCorrect = form.watch(`answers.${index}.is_correct`);
    
    return (
      <div key={field.id} className="flex items-center gap-3 p-3 border rounded-lg">
        <div className="cursor-move">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        
        <div className="flex items-center">
          {questionType === 'multiple_choice' || questionType === 'true_false' ? (
            <RadioGroup
              value={isCorrect ? index.toString() : ""}
              onValueChange={(value) => handleCorrectAnswerChange(parseInt(value), true)}
            >
              <RadioGroupItem value={index.toString()} />
            </RadioGroup>
          ) : questionType === 'multiple_select' ? (
            <Checkbox
              checked={isCorrect}
              onCheckedChange={(checked) => handleCorrectAnswerChange(index, !!checked)}
            />
          ) : null}
        </div>

        <div className="flex-1">
          {questionType === 'true_false' ? (
            <div className="py-2 px-3 bg-gray-50 rounded border">
              {field.answer_text}
            </div>
          ) : (
            <Input
              {...form.register(`answers.${index}.answer_text`)}
              placeholder={questionType === 'fill_blank' ? "Nhập đáp án đúng..." : `Đáp án ${index + 1}`}
              className={isCorrect ? "border-green-500 bg-green-50" : ""}
            />
          )}
        </div>

        {isCorrect && (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Đúng
          </Badge>
        )}

        {questionType !== 'true_false' && questionType !== 'fill_blank' && fields.length > MIN_ANSWERS_PER_QUESTION && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveAnswer(index)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  };

  const renderPreview = () => {
    const formData = form.getValues();
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Xem trước câu hỏi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline">{QUESTION_TYPE_LABELS[questionType]}</Badge>
              <Badge variant="outline">{formData.points} điểm</Badge>
            </div>
            <h3 className="text-lg font-medium">{formData.question_text || "Câu hỏi..."}</h3>
          </div>

          <div className="space-y-2">
            {formData.answers.map((answer, index) => (
              <div
                key={index}
                className={`p-3 border rounded-lg ${
                  answer.is_correct ? "border-green-500 bg-green-50" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {questionType === 'multiple_choice' || questionType === 'true_false' ? (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                  ) : questionType === 'multiple_select' ? (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                  ) : null}
                  <span>{answer.answer_text || `Đáp án ${index + 1}`}</span>
                  {answer.is_correct && (
                    <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {formData.explanation && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <HelpCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">Giải thích</span>
              </div>
              <p className="text-sm text-blue-600">{formData.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {question ? "Chỉnh sửa câu hỏi" : "Tạo câu hỏi mới"}
          </h3>
          <p className="text-sm text-muted-foreground">
            Nhập nội dung câu hỏi và các đáp án
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "Ẩn" : "Xem trước"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Question Form */}
        <div className="space-y-4">
          {/* Question Type */}
          <div>
            <Label className="text-sm font-medium">Loại câu hỏi</Label>
            <Select value={questionType} onValueChange={(value: QuestionType) => setQuestionType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Question Text */}
          <div>
            <Label className="text-sm font-medium">Câu hỏi *</Label>
            <Textarea
              {...form.register("question_text")}
              placeholder="Nhập nội dung câu hỏi..."
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Points */}
          <div>
            <Label className="text-sm font-medium">Điểm số</Label>
            <Input
              type="number"
              min="0.5"
              step="0.5"
              {...form.register("points", { valueAsNumber: true })}
              className="mt-1"
            />
          </div>

          {/* Answers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">
                Đáp án {questionType !== 'fill_blank' && `(${fields.length})`}
              </Label>
              {questionType !== 'true_false' && questionType !== 'fill_blank' && fields.length < MAX_ANSWERS_PER_QUESTION && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddAnswer}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm đáp án
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => renderAnswerInput(field, index))}
            </div>

            {questionType === 'multiple_choice' && (
              <p className="text-xs text-muted-foreground mt-2">
                Chọn một đáp án đúng bằng cách click vào radio button
              </p>
            )}
            {questionType === 'multiple_select' && (
              <p className="text-xs text-muted-foreground mt-2">
                Có thể chọn nhiều đáp án đúng bằng cách tick vào checkbox
              </p>
            )}
          </div>

          {/* Explanation */}
          <div>
            <Label className="text-sm font-medium">Giải thích (tùy chọn)</Label>
            <Textarea
              {...form.register("explanation")}
              placeholder="Giải thích đáp án đúng..."
              rows={2}
              className="mt-1"
            />
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div>
            {renderPreview()}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Hủy
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Lưu câu hỏi
        </Button>
      </div>
    </div>
  );
}
