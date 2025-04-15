/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
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
import { Badge } from "@/components/ui/badge";
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
// const subjects = [
//   { id: "math", label: "Mathematics" },
//   { id: "physics", label: "Physics" },
//   { id: "chemistry", label: "Chemistry" },
//   { id: "biology", label: "Biology" },
//   { id: "history", label: "History" },
//   { id: "geography", label: "Geography" },
//   { id: "english", label: "English" },
//   { id: "computer_science", label: "Computer Science" },
//   { id: "art", label: "Art" },
//   { id: "music", label: "Music" },
// ];
interface CreateTeacherFormProps {
  onSuccess?: () => void;
}
interface Subject {
  course_id: string;
  course_name: string;
  department_id: string;
  department_name: string;
}
export default function CreateTeacherForm({
  onSuccess,
}: CreateTeacherFormProps) {
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
    fetchSubjects();
  }, []);

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
  console.log(uniqueDepartments);
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

      // Prepare data for API submission
      const formData = new FormData();

      // Add all text fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === "avatar") {
          if (value instanceof File) {
            formData.append("avatar", value);
          }
        } else if (key === "subjects") {
          formData.append("subjects", JSON.stringify(value));
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const response = await CreateTeacher(data);

      console.log("Form data prepared for API submission:", data);
      if (response.status === 200) {
        toast.success("Teacher created successfully!");
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create teacher. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className=" grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
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
                      placeholder="Enter email address"
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
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
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Male</SelectItem>
                      <SelectItem value="2">Female</SelectItem>
                      <SelectItem value="3">Other</SelectItem>
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
                <FormItem className="flex flex-col">
                  <FormLabel>Birthday</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(field.value, "PPP")
                            : "Select date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={(date) => date > new Date()}
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
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter address"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 grid-cols-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                    Must be at least 3 characters long!
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>
                    Must be at least 8 characters!
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="2">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjectsAPI &&
                        uniqueDepartments.map((subject: any, index) => (
                          <SelectItem key={index} value={subject.department_id}>
                            {subject.department_name}
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
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Teaching Subjects</FormLabel>
                  <FormControl>
                    <div className="border rounded-md p-4">
                      <div className="mb-3 flex flex-wrap gap-2">
                        {field.value.map((subjectId) => {
                          const subject = subjectsAPI.find(
                            (s) => s.course_id === subjectId
                          );
                          return (
                            <Badge
                              key={subjectId}
                              variant="secondary"
                              className="px-2 py-1"
                            >
                              {subject?.course_name}
                              <button
                                type="button"
                                className="ml-1 text-xs"
                                onClick={() => {
                                  field.onChange(
                                    field.value.filter((id) => id !== subjectId)
                                  );
                                }}
                              >
                                x
                              </button>
                            </Badge>
                          );
                        })}
                        {field.value.length === 0 && (
                          <span className="text-sm text-muted-foreground">
                            No subjects selected
                          </span>
                        )}
                      </div>
                      {!watchDepartment ? (
                        <div className="text-sm text-muted-foreground p-2 text-center">
                          Please select a department first to view available
                          subjects
                        </div>
                      ) : departmentSubjects.length === 0 ? (
                        <div className="text-sm text-muted-foreground p-2 text-center">
                          No subjects available for this department
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {departmentSubjects.map((subject, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`subject-${subject.course_id}`}
                                checked={field.value.includes(
                                  subject.course_id
                                )}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([
                                      ...field.value,
                                      subject.course_id,
                                    ]);
                                  } else {
                                    field.onChange(
                                      field.value.filter(
                                        (id) => id !== subject.course_id
                                      )
                                    );
                                  }
                                }}
                              />
                              <Label
                                htmlFor={`subject-${subject.course_id}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {subject.course_name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employmentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Employment Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(field.value, "PPP")
                            : "Select date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Other Settings */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Other Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FormLabel>Avatar</FormLabel>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full border flex items-center justify-center overflow-hidden bg-gray-100">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview || "/placeholder.svg"}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: Square image, at least 300x300px
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onSuccess}>
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Create Teacher"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
