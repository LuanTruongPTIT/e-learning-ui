"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUploadThing } from "@/lib/uploadthing";
import QuizBuilderModal from "../quiz-builder/quiz-builder-modal";
import { Quiz } from "@/types/quiz";
import { assignmentApi, CreateAssignmentRequest } from "@/apis/assignments";

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onAssignmentCreated?: () => void;
}

// Schema validation cho form
const formSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề bài tập"),
  description: z.string().min(1, "Vui lòng nhập mô tả bài tập"),
  deadline: z
    .date({
      required_error: "Vui lòng chọn deadline",
      invalid_type_error: "Ngày không hợp lệ",
    })
    .refine((date) => date > new Date(), {
      message: "Deadline phải sau thời điểm hiện tại",
    }),
  assignmentType: z.enum(["quiz", "upload", "both"], {
    required_error: "Vui lòng chọn loại bài tập",
  }),
  showAnswers: z.boolean(),
  timeLimit: z.number().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateAssignmentModal({
  isOpen,
  onClose,
  courseId,
  onAssignmentCreated,
}: CreateAssignmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuizBuilderOpen, setIsQuizBuilderOpen] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadedFileUrls, setUploadedFileUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // React Hook Form setup
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      assignmentType: "upload",
      showAnswers: false,
    },
  });

  // UploadThing hook
  const { startUpload } = useUploadThing("courseMaterial");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);

      // Upload files immediately
      setIsUploading(true);
      try {
        const uploadedFiles = await startUpload(newFiles);
        if (uploadedFiles) {
          const urls = uploadedFiles.map((file) => file.url);
          setUploadedFileUrls((prev) => [...prev, ...urls]);
          toast.success("Upload file thành công!");
        }
      } catch (error) {
        console.error("Error starting upload:", error);
        toast.error("Không thể upload file");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    setUploadedFileUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOpenQuizBuilder = () => {
    setIsQuizBuilderOpen(true);
  };

  const handleSaveQuiz = (savedQuiz: Quiz) => {
    setQuiz(savedQuiz);
    setIsQuizBuilderOpen(false);
    toast.success("Quiz đã được lưu!");
  };

  const handleCloseModal = () => {
    // Reset all states when closing modal
    setIsSubmitting(false);
    setIsUploading(false);
    setAttachments([]);
    setUploadedFileUrls([]);
    setQuiz(null);
    form.reset();
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Prepare assignment data for API
      const assignmentData: CreateAssignmentRequest = {
        course_id: courseId,
        title: data.title,
        description: data.description,
        deadline: data.deadline.toISOString(),
        assignment_type: data.assignmentType,
        show_answers: data.showAnswers,
        time_limit: data.timeLimit,
        attachments: uploadedFileUrls.length > 0 ? uploadedFileUrls : undefined,
        max_score: quiz ? quiz.total_points : 100, // Use quiz points if available
        is_published: true, // Default to published
        // Add quiz data if available (you may need to extend the API interface)
        ...(quiz && { quiz_data: quiz }),
      };

      console.log("Creating assignment with data:", assignmentData);

      // Call API to create assignment
      const response = await assignmentApi.createAssignment(assignmentData);

      if (response.status === 201) {
        toast.success(response.data.message || "Tạo bài tập thành công!");
        onAssignmentCreated?.();
        handleCloseModal();
      } else {
        toast.error(response.message || "Có lỗi xảy ra khi tạo bài tập");
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error("Có lỗi xảy ra khi tạo bài tập");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo bài tập mới</DialogTitle>
          <DialogDescription>
            Tạo bài tập cho khóa học. Học sinh sẽ nhận được thông báo khi bài
            tập được tạo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề bài tập *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tiêu đề bài tập..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả bài tập *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả chi tiết về bài tập..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Assignment Type */}
            <FormField
              control={form.control}
              name="assignmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại bài tập</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="quiz">
                        📝 Quiz online (soạn trực tiếp)
                      </SelectItem>
                      <SelectItem value="upload">
                        📄 Upload đề bài + yêu cầu nộp file
                      </SelectItem>
                      <SelectItem value="both">🔄 Cả hai loại</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quiz Builder Section */}
            {(form.watch("assignmentType") === "quiz" ||
              form.watch("assignmentType") === "both") && (
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-blue-900">
                        Quiz Builder
                      </h4>
                      <p className="text-sm text-blue-700">
                        {quiz
                          ? `Quiz đã tạo: ${quiz.questions.length} câu hỏi, ${quiz.total_points} điểm`
                          : "Tạo câu hỏi trắc nghiệm cho bài tập"}
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={handleOpenQuizBuilder}
                      variant={quiz ? "outline" : "default"}
                      size="sm"
                    >
                      {quiz ? "Chỉnh sửa Quiz" : "Tạo Quiz"}
                    </Button>
                  </div>

                  {quiz && (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-2 bg-white rounded border">
                        <div className="font-medium text-blue-600">
                          {quiz.questions.length}
                        </div>
                        <div className="text-blue-500">Câu hỏi</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded border">
                        <div className="font-medium text-blue-600">
                          {quiz.total_points}
                        </div>
                        <div className="text-blue-500">Điểm</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded border">
                        <div className="font-medium text-blue-600">
                          {quiz.settings.time_limit || "∞"}
                        </div>
                        <div className="text-blue-500">Phút</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Deadline */}
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline *</FormLabel>
                  <div className="space-y-3">
                    {/* Display selected datetime */}
                    <div className="p-3 border rounded-md bg-gray-50">
                      <div className="text-sm text-gray-600">
                        Deadline đã chọn:
                      </div>
                      <div className="font-medium">
                        {field.value
                          ? format(field.value, "dd/MM/yyyy HH:mm", {
                              locale: vi,
                            })
                          : "Chưa chọn deadline"}
                      </div>
                    </div>

                    {/* Date picker */}
                    <div className="border rounded-md p-3">
                      <div className="text-sm font-medium mb-2">Chọn ngày:</div>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            // Maintain existing time if available, otherwise set to 23:59
                            const newDate = new Date(date);
                            if (field.value) {
                              newDate.setHours(
                                field.value.getHours(),
                                field.value.getMinutes()
                              );
                            } else {
                              newDate.setHours(23, 59, 0, 0);
                            }
                            field.onChange(newDate);
                          }
                        }}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border-0"
                      />
                    </div>

                    {/* Time picker */}
                    <div className="border rounded-md p-3">
                      <div className="text-sm font-medium mb-2">Chọn giờ:</div>
                      <Input
                        type="time"
                        value={field.value ? format(field.value, "HH:mm") : ""}
                        onChange={(e) => {
                          if (field.value && e.target.value) {
                            const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number);
                            const newDate = new Date(field.value);
                            newDate.setHours(hours, minutes, 0, 0);
                            field.onChange(newDate);
                          }
                        }}
                        className="w-32"
                      />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Attachments */}
            {(form.watch("assignmentType") === "upload" ||
              form.watch("assignmentType") === "both") && (
              <div className="space-y-2">
                <Label>File đính kèm (tùy chọn)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="mt-2">
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <span className="text-sm text-blue-600 hover:text-blue-500">
                          {isUploading ? "Đang upload..." : "Chọn file"}
                        </span>
                        <Input
                          id="file-upload"
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX, PPT, PPTX, TXT, JPG, PNG (tối đa 32MB
                        mỗi file)
                      </p>
                      {isUploading && (
                        <div className="flex items-center justify-center mt-2">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span className="text-sm text-gray-600">
                            Đang upload file...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* File List */}
                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({formatFileSize(file.size)})
                            </span>
                            {uploadedFileUrls[index] && (
                              <span className="text-xs text-green-600">
                                ✓ Đã upload
                              </span>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Show Answers Option for Quiz */}
            {(form.watch("assignmentType") === "quiz" ||
              form.watch("assignmentType") === "both") && (
              <FormField
                control={form.control}
                name="showAnswers"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="rounded"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        Hiển thị đáp án sau khi nộp bài
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCloseModal}
                disabled={isSubmitting || isUploading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Tạo bài tập
              </Button>
            </DialogFooter>
          </form>
        </Form>

        {/* Quiz Builder Modal */}
        <QuizBuilderModal
          isOpen={isQuizBuilderOpen}
          onClose={() => setIsQuizBuilderOpen(false)}
          onSave={handleSaveQuiz}
          initialQuiz={quiz || undefined}
          assignmentId={courseId}
        />
      </DialogContent>
    </Dialog>
  );
}
