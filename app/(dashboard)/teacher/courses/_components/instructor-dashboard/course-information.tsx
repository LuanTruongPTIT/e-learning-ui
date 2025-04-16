"use client";

import type React from "react";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/course";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const courseFormSchema = z
  .object({
    title: z.string().min(3, {
      message: "Course title must be at least 3 characters.",
    }),
    description: z.string().min(10, {
      message: "Course description must be at least 10 characters.",
    }),
    startDate: z.date({
      required_error: "A start date is required.",
    }),
    endDate: z.date({
      required_error: "An end date is required.",
    }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

type CourseFormValues = z.infer<typeof courseFormSchema>;

interface CourseInformationProps {
  course: Course;
  onUpdate: (data: Partial<Course>) => void;
}

export default function CourseInformation({
  course,
  onUpdate,
}: CourseInformationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: course.title,
      description: course.description,
      startDate: course.startDate,
      endDate: course.endDate,
    },
  });

  async function onSubmit(data: CourseFormValues) {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onUpdate(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {!course.canEditDuration && (
        <Alert
          variant="default"
          className="bg-blue-50 text-blue-800 border-blue-200"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Course Duration Locked</AlertTitle>
          <AlertDescription>
            The course duration has been set by the administrator and cannot be
            modified. Please contact your department head if you need to adjust
            the course dates.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Course Details</h3>
              <p className="text-sm text-muted-foreground">
                View the course information assigned to you.
              </p>
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter course title"
                      {...field}
                      className="bg-white"
                      disabled
                    />
                  </FormControl>
                  <FormDescription>
                    This is the official title of the course.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter course description"
                      className="min-h-[100px] bg-white"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormDescription>
                    The official course description.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Course Duration</h3>
              <p className="text-sm text-muted-foreground">
                {course.canEditDuration
                  ? "You can adjust the course duration if needed."
                  : "Course duration is set by the administrator."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-white",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={!course.canEditDuration}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When the course will begin.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-white",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={!course.canEditDuration}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
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
                          initialFocus
                          disabled={(date) =>
                            date < form.getValues("startDate")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>When the course will end.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Assignment Information</h3>
              <p className="text-sm text-muted-foreground">
                Details about your assignment to this course.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Assigned By</Label>
                <Input
                  value={course.assignedBy}
                  className="bg-white mt-2"
                  disabled
                />
              </div>
              <div>
                <Label>Assignment Date</Label>
                <Input
                  value={format(course.assignedDate, "PPP")}
                  className="bg-white mt-2"
                  disabled
                />
              </div>
            </div>
          </div>

          {course.canEditDuration && (
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-medium">{children}</div>
);
