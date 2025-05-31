"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Shuffle,
  RotateCcw,
  Eye,
  CheckCircle,
  Target,
  BookOpen,
  Zap,
  Settings,
} from "lucide-react";
import { QuizSettings as QuizSettingsType } from "@/types/quiz";

interface QuizSettingsProps {
  settings: QuizSettingsType;
  onChange: (settings: QuizSettingsType) => void;
}

export default function QuizSettings({ settings, onChange }: QuizSettingsProps) {
  const updateSetting = <K extends keyof QuizSettingsType>(
    key: K,
    value: QuizSettingsType[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Cài đặt Quiz
        </h3>
        <p className="text-sm text-muted-foreground">
          Cấu hình các tùy chọn cho quiz của bạn
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Time Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              Thời gian làm bài
            </CardTitle>
            <CardDescription>
              Thiết lập thời gian giới hạn cho quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={!!settings.time_limit}
                onCheckedChange={(checked) =>
                  updateSetting("time_limit", checked ? 60 : undefined)
                }
              />
              <Label>Giới hạn thời gian</Label>
            </div>

            {settings.time_limit && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Thời gian (phút)</Label>
                  <span className="text-sm font-medium">{settings.time_limit} phút</span>
                </div>
                <Slider
                  value={[settings.time_limit]}
                  onValueChange={([value]) => updateSetting("time_limit", value)}
                  min={5}
                  max={180}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5 phút</span>
                  <span>180 phút</span>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.auto_submit}
                onCheckedChange={(checked) => updateSetting("auto_submit", checked)}
              />
              <Label>Tự động nộp bài khi hết thời gian</Label>
            </div>
          </CardContent>
        </Card>

        {/* Attempts Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <RotateCcw className="h-4 w-4" />
              Số lần làm bài
            </CardTitle>
            <CardDescription>
              Cho phép học sinh làm lại quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Số lần làm bài tối đa</Label>
              <Select
                value={settings.max_attempts.toString()}
                onValueChange={(value) => updateSetting("max_attempts", parseInt(value))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 lần</SelectItem>
                  <SelectItem value="2">2 lần</SelectItem>
                  <SelectItem value="3">3 lần</SelectItem>
                  <SelectItem value="5">5 lần</SelectItem>
                  <SelectItem value="999">Không giới hạn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.allow_review}
                onCheckedChange={(checked) => updateSetting("allow_review", checked)}
              />
              <Label>Cho phép xem lại bài làm</Label>
            </div>
          </CardContent>
        </Card>

        {/* Randomization Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shuffle className="h-4 w-4" />
              Trộn câu hỏi & đáp án
            </CardTitle>
            <CardDescription>
              Ngẫu nhiên hóa thứ tự để tránh gian lận
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.shuffle_questions}
                onCheckedChange={(checked) => updateSetting("shuffle_questions", checked)}
              />
              <Label>Trộn thứ tự câu hỏi</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.shuffle_answers}
                onCheckedChange={(checked) => updateSetting("shuffle_answers", checked)}
              />
              <Label>Trộn thứ tự đáp án</Label>
            </div>
          </CardContent>
        </Card>

        {/* Results Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="h-4 w-4" />
              Hiển thị kết quả
            </CardTitle>
            <CardDescription>
              Cấu hình cách hiển thị kết quả cho học sinh
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.show_results_immediately}
                onCheckedChange={(checked) => updateSetting("show_results_immediately", checked)}
              />
              <Label>Hiển thị kết quả ngay lập tức</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.show_correct_answers}
                onCheckedChange={(checked) => updateSetting("show_correct_answers", checked)}
              />
              <Label>Hiển thị đáp án đúng</Label>
            </div>
          </CardContent>
        </Card>

        {/* Grading Settings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4" />
              Cài đặt điểm số
            </CardTitle>
            <CardDescription>
              Thiết lập điểm đạt và cách tính điểm
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={!!settings.passing_score}
                    onCheckedChange={(checked) =>
                      updateSetting("passing_score", checked ? 70 : undefined)
                    }
                  />
                  <Label>Thiết lập điểm đạt</Label>
                </div>

                {settings.passing_score && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Điểm đạt (%)</Label>
                      <span className="text-sm font-medium">{settings.passing_score}%</span>
                    </div>
                    <Slider
                      value={[settings.passing_score]}
                      onValueChange={([value]) => updateSetting("passing_score", value)}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-700">Thông tin điểm số</span>
                  </div>
                  <div className="text-xs text-blue-600 space-y-1">
                    <p>• Điểm được tính dựa trên số câu trả lời đúng</p>
                    <p>• Mỗi câu hỏi có thể có điểm số khác nhau</p>
                    <p>• Kết quả hiển thị dưới dạng phần trăm</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Summary */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4" />
            Tóm tắt cài đặt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {settings.time_limit ? `${settings.time_limit} phút` : "Không giới hạn"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <span>
                {settings.max_attempts === 999 ? "Không giới hạn" : `${settings.max_attempts} lần`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shuffle className="h-4 w-4 text-muted-foreground" />
              <span>
                {settings.shuffle_questions || settings.shuffle_answers ? "Có trộn" : "Không trộn"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span>
                {settings.passing_score ? `Đạt: ${settings.passing_score}%` : "Không yêu cầu"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
