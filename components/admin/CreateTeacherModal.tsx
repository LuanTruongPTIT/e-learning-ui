"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  teacherFormSchema,
  TeacherFormValues,
} from "@/app/schema/users-schema";
import Image from "next/image";
import { CreateTeacher, GetCourseDepartment } from "@/apis/teacher";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UploadButton } from "@/lib/uploadthing";

interface CreateTeacherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface Subject {
  course_id: string;
  course_name: string;
  department_id: string;
  department_name: string;
}

export default function CreateTeacherModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateTeacherModalProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjectsAPI, setSubjectsAPI] = useState<Subject[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      username: "",
      password: "",
      birthday: new Date(),
      gender: "1", // Default to male
      status: "1", // Default to active
      employmentDate: new Date(), // Default to today
      subjects: [],
    },
  });

  const watchDepartment = form.watch("department");

  React.useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await GetCourseDepartment();
        const data = await response.data;
        setSubjectsAPI(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    if (open) {
      fetchSubjects();
    }
  }, [open]);

  React.useEffect(() => {
    form.setValue("subjects", []);
  }, [watchDepartment, form]);

  const departmentSubjects = subjectsAPI.filter((subject) =>
    watchDepartment ? subject.department_id === watchDepartment : false
  );

  const uniqueDepartmentsMap = new Map();
  subjectsAPI.forEach((item) => {
    if (!uniqueDepartmentsMap.has(item.department_id)) {
      uniqueDepartmentsMap.set(item.department_id, {
        department_id: item.department_id,
        department_name: item.department_name,
      });
    }
  });

  const uniqueDepartments = Array.from(uniqueDepartmentsMap.values());

  const onSubmit = async (data: TeacherFormValues) => {
    console.log("🎯 FORM SUBMIT TRIGGERED!");
    console.log("Submitted data:", data);
    try {
      setIsSubmitting(true);

      const response = await CreateTeacher(data);

      console.log("API Response:", response);
      if (response.status === 200) {
        toast.success("Giảng viên được tạo thành công!");
        form.reset();
        setAvatarPreview(null);
        onOpenChange(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Không thể tạo giảng viên. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug function to check form errors
  const handleDebugClick = () => {
    console.log("🔍 FORM DEBUG:");
    console.log("Form Values:", form.getValues());
    console.log("Form Errors:", form.formState.errors);
    console.log("Form Valid:", form.formState.isValid);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm Giảng Viên Mới</DialogTitle>
          <DialogDescription>
            Tạo tài khoản giảng viên mới với thông tin chi tiết và môn học phụ
            trách.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="teacher@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên đăng nhập *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên đăng nhập" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu *</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nhập mật khẩu (tối thiểu 8 ký tự)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="0123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giới tính *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn giới tính" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Nam</SelectItem>
                          <SelectItem value="2">Nữ</SelectItem>
                          <SelectItem value="3">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày sinh *</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={
                            field.value instanceof Date
                              ? field.value.toISOString().split("T")[0]
                              : field.value
                          }
                          onChange={(e) => {
                            const dateValue = e.target.value;
                            field.onChange(
                              dateValue ? new Date(dateValue) : new Date()
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employmentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày nhận việc *</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={
                            field.value instanceof Date
                              ? field.value.toISOString().split("T")[0]
                              : field.value
                          }
                          onChange={(e) => {
                            const dateValue = e.target.value;
                            field.onChange(
                              dateValue ? new Date(dateValue) : new Date()
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Hoạt động</SelectItem>
                          <SelectItem value="2">Tạm ngưng</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập địa chỉ đầy đủ"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Department and Subjects */}
            <Card>
              <CardHeader>
                <CardTitle>Khoa và Môn học</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Khoa *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn khoa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {uniqueDepartments.map((dept) => (
                            <SelectItem
                              key={dept.department_id}
                              value={dept.department_id}
                            >
                              {dept.department_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subjects"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">
                          Môn học phụ trách *
                        </FormLabel>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {departmentSubjects.map((subject) => (
                          <FormField
                            key={subject.course_id}
                            control={form.control}
                            name="subjects"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={subject.course_id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(
                                        subject.course_id
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              subject.course_id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) =>
                                                  value !== subject.course_id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {subject.course_name}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Avatar Upload with Uploadthing */}
            <Card>
              <CardHeader>
                <CardTitle>Ảnh đại diện</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-2">
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt="Avatar preview"
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <UploadButton
                      endpoint="teacherAvatar"
                      onClientUploadComplete={(res: { url: string }[]) => {
                        if (res && res[0]) {
                          const fileUrl = res[0].url;
                          setAvatarPreview(fileUrl);
                          form.setValue("avatar", fileUrl);
                          toast.success("Ảnh đã được tải lên thành công!");
                          setIsUploading(false);
                        }
                      }}
                      onUploadError={(error: Error) => {
                        console.error("Upload error:", error);
                        toast.error("Lỗi khi tải ảnh lên. Vui lòng thử lại.");
                        setIsUploading(false);
                      }}
                      onUploadBegin={() => {
                        setIsUploading(true);
                      }}
                      appearance={{
                        button:
                          "ut-ready:bg-primary ut-uploading:cursor-not-allowed bg-primary after:bg-primary",
                        allowedContent: "text-xs text-muted-foreground",
                      }}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      JPG, PNG hoặc GIF (tối đa 4MB)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Debug Button */}
            <Card className="border-dashed border-orange-300 bg-orange-50">
              <CardContent className="pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDebugClick}
                  className="w-full"
                >
                  🔍 Debug Form State (Check Console)
                </Button>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo giảng viên"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
