"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Clock,
  Eye,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Target,
  Shuffle,
  Timer,
  BookOpen,
} from "lucide-react";
import { Quiz, QuizQuestion, QUESTION_TYPE_LABELS } from "@/types/quiz";

interface QuizPreviewProps {
  quiz: Quiz;
}

export default function QuizPreview({ quiz }: QuizPreviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleAnswerChange = (questionId: string, answerId: string, checked: boolean) => {
    const currentAnswers = answers[questionId] || [];
    
    if (currentQuestion.question_type === 'multiple_choice' || currentQuestion.question_type === 'true_false') {
      // Single choice - replace all answers
      setAnswers(prev => ({
        ...prev,
        [questionId]: checked ? [answerId] : []
      }));
    } else if (currentQuestion.question_type === 'multiple_select') {
      // Multiple choice - add/remove from array
      if (checked) {
        setAnswers(prev => ({
          ...prev,
          [questionId]: [...currentAnswers, answerId]
        }));
      } else {
        setAnswers(prev => ({
          ...prev,
          [questionId]: currentAnswers.filter(id => id !== answerId)
        }));
      }
    }
  };

  const handleFillBlankChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: [value]
    }));
  };

  const getQuestionScore = (question: QuizQuestion) => {
    const userAnswers = answers[question.id] || [];
    const correctAnswers = question.answers.filter(a => a.is_correct).map(a => a.id);
    
    if (question.question_type === 'fill_blank') {
      const userAnswer = userAnswers[0]?.toLowerCase().trim() || '';
      const correctAnswer = correctAnswers[0]?.toLowerCase().trim() || '';
      return userAnswer === correctAnswer ? question.points : 0;
    }
    
    // For multiple choice questions
    const isCorrect = userAnswers.length === correctAnswers.length &&
      userAnswers.every(id => correctAnswers.includes(id));
    
    return isCorrect ? question.points : 0;
  };

  const getTotalScore = () => {
    return quiz.questions.reduce((total, question) => total + getQuestionScore(question), 0);
  };

  const getPercentage = () => {
    return Math.round((getTotalScore() / quiz.total_points) * 100);
  };

  const renderQuestion = (question: QuizQuestion) => {
    const userAnswers = answers[question.id] || [];

    return (
      <Card key={question.id} className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{QUESTION_TYPE_LABELS[question.question_type]}</Badge>
                <Badge variant="outline">{question.points} điểm</Badge>
              </div>
              <CardTitle className="text-lg">
                Câu {currentQuestionIndex + 1}: {question.question_text}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {question.question_type === 'fill_blank' ? (
              <div>
                <Label>Nhập đáp án của bạn:</Label>
                <Input
                  value={userAnswers[0] || ''}
                  onChange={(e) => handleFillBlankChange(question.id, e.target.value)}
                  placeholder="Nhập đáp án..."
                  className="mt-1"
                />
              </div>
            ) : question.question_type === 'multiple_choice' || question.question_type === 'true_false' ? (
              <RadioGroup
                value={userAnswers[0] || ''}
                onValueChange={(value) => handleAnswerChange(question.id, value, true)}
              >
                {question.answers.map((answer) => (
                  <div key={answer.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={answer.id} />
                    <Label className="flex-1 cursor-pointer">
                      {answer.answer_text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-2">
                <Label>Chọn tất cả đáp án đúng:</Label>
                {question.answers.map((answer) => (
                  <div key={answer.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={userAnswers.includes(answer.id)}
                      onCheckedChange={(checked) => 
                        handleAnswerChange(question.id, answer.id, !!checked)
                      }
                    />
                    <Label className="flex-1 cursor-pointer">
                      {answer.answer_text}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {showResults && (
              <div className="mt-4 p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  {getQuestionScore(question) > 0 ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium">
                    {getQuestionScore(question) > 0 ? 'Đúng' : 'Sai'} 
                    ({getQuestionScore(question)}/{question.points} điểm)
                  </span>
                </div>
                
                {quiz.settings.show_correct_answers && (
                  <div className="text-sm text-gray-600">
                    <strong>Đáp án đúng:</strong>
                    <ul className="mt-1 space-y-1">
                      {question.answers
                        .filter(a => a.is_correct)
                        .map(answer => (
                          <li key={answer.id} className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {answer.answer_text}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {question.explanation && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                    <div className="flex items-center gap-1 mb-1">
                      <HelpCircle className="h-3 w-3 text-blue-500" />
                      <span className="text-xs font-medium text-blue-700">Giải thích:</span>
                    </div>
                    <p className="text-xs text-blue-600">{question.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (quiz.questions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Eye className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Chưa có câu hỏi để xem trước
        </h3>
        <p className="text-gray-500">
          Thêm câu hỏi vào quiz để xem trước giao diện làm bài
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{quiz.title}</CardTitle>
              {quiz.description && (
                <CardDescription className="mt-1">{quiz.description}</CardDescription>
              )}
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Xem trước
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2 text-sm">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
              <span>{quiz.questions.length} câu hỏi</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span>{quiz.total_points} điểm</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {quiz.settings.time_limit ? `${quiz.settings.time_limit} phút` : 'Không giới hạn'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <span>
                {quiz.settings.max_attempts === 999 ? 'Không giới hạn' : `${quiz.settings.max_attempts} lần`}
              </span>
            </div>
          </div>

          {quiz.settings.shuffle_questions && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded flex items-center gap-2">
              <Shuffle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-700">Câu hỏi sẽ được trộn ngẫu nhiên</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quiz Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                Câu {currentQuestionIndex + 1} / {quiz.questions.length}
              </span>
              {quiz.settings.time_limit && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  {quiz.settings.time_limit}:00
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentQuestionIndex(Math.min(quiz.questions.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === quiz.questions.length - 1}
              >
                Sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Question */}
      {renderQuestion(currentQuestion)}

      {/* Quiz Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowResults(!showResults)}
              >
                {showResults ? 'Ẩn kết quả' : 'Xem kết quả'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAnswers({});
                  setShowResults(false);
                  setCurrentQuestionIndex(0);
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Làm lại
              </Button>
            </div>
            
            {showResults && (
              <div className="text-right">
                <div className="text-lg font-bold">
                  {getTotalScore()}/{quiz.total_points} điểm ({getPercentage()}%)
                </div>
                <div className="text-sm text-muted-foreground">
                  {quiz.settings.passing_score && getPercentage() >= quiz.settings.passing_score ? (
                    <span className="text-green-600">✓ Đạt yêu cầu</span>
                  ) : quiz.settings.passing_score ? (
                    <span className="text-red-600">✗ Chưa đạt yêu cầu</span>
                  ) : (
                    'Hoàn thành'
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quiz Settings Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Thông tin quiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span>Hiển thị kết quả:</span>
              <span>{quiz.settings.show_results_immediately ? 'Ngay lập tức' : 'Sau deadline'}</span>
            </div>
            <div className="flex justify-between">
              <span>Hiển thị đáp án:</span>
              <span>{quiz.settings.show_correct_answers ? 'Có' : 'Không'}</span>
            </div>
            <div className="flex justify-between">
              <span>Cho phép xem lại:</span>
              <span>{quiz.settings.allow_review ? 'Có' : 'Không'}</span>
            </div>
            {quiz.settings.passing_score && (
              <div className="flex justify-between">
                <span>Điểm đạt:</span>
                <span>{quiz.settings.passing_score}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
