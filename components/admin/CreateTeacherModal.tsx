"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
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

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      username: "",
      password: "",
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("avatar", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: TeacherFormValues) => {
    console.log("Submitted data:", data);
    try {
      setIsSubmitting(true);

      const response = await CreateTeacher(data);

      console.log("Form data prepared for API submission:", data);
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
                      <FormLabel>Họ và tên</FormLabel>
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
                      <FormLabel>Email</FormLabel>
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
                      <FormLabel>Tên đăng nhập</FormLabel>
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
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nhập mật khẩu"
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
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ngày sinh</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Chọn ngày sinh</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                      <FormLabel>Khoa</FormLabel>
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
                          Môn học phụ trách
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

            {/* Avatar Upload */}
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
                    <Label
                      htmlFor="avatar-upload"
                      className="cursor-pointer inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-md transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Chọn ảnh
                    </Label>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      JPG, PNG hoặc GIF (tối đa 5MB)
                    </p>
                  </div>
                </div>
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
              <Button type="submit" disabled={isSubmitting}>
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
