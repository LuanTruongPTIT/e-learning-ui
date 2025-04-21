"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  ClassByDepartmentResponse,
  CoursesByProgramResponse,
  createTeachingAssignCourse,
  getClassesByDepartment,
  getCoursesByProgram,
} from "@/apis/teacher";
import { toast } from "react-toastify";

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCourseModal({
  isOpen,
  onClose,
}: CreateCourseModalProps) {
  const [classesOfTeacher, setClassesOfTeacher] = useState<
    ClassByDepartmentResponse[]
  >([]);
  const [subjectRecommend, setSubjectRecommend] = useState<
    CoursesByProgramResponse[]
  >([]);
  useEffect(() => {
    const classes = getClassesByDepartment();
    classes.then((res) => {
      setClassesOfTeacher(res.data);
    });
  }, []);
  const [formData, setFormData] = useState({
    course_name: "",
    description: "",
    class_id: "",
    course_id: "",
    startDate: undefined as unknown as Date,
    endDate: undefined as unknown as Date,
  });

  useEffect(() => {
    const fetchCourses = async (programId: string) => {
      try {
        const response = await getCoursesByProgram(programId);
        setSubjectRecommend(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    if (formData.class_id) {
      const findProgramId = classesOfTeacher.find(
        (cls) => cls.class_id === formData.class_id
      );
      if (!findProgramId) {
        return;
      }
      fetchCourses(findProgramId.program_id);
    } else {
      setSubjectRecommend([]);
    }
  }, [formData.class_id]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get the selected class's program
  const selectedClass = classesOfTeacher.find(
    (c) => c.class_id === formData.class_id
  );

  // Filter subjects based on the selected class's program
  const filteredSubjects = subjectRecommend.filter(
    (subject) =>
      !selectedClass || subject.program_name === selectedClass.program_name
  );

  const handleInputChange = (
    field: string,
    value: string | Date | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.course_name.trim())
      newErrors.course_name = "Course name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.class_id) newErrors.class_id = "Class is required";
    if (!formData.course_id) newErrors.course_id = "Subject is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";

    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate > formData.endDate
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Here you would typically send the data to your API
      console.log("Creating course:", {
        ...formData,
        status: "upcoming",
      });
      const data = {
        course_name: formData.course_name,
        description: formData.description,
        class_id: formData.class_id,
        course_id: formData.course_id,
        start_date: formData.startDate,
        end_date: formData.endDate,
      };
      const result = createTeachingAssignCourse(data);
      result.then((res) => {
        if (res.status === 200) {
          toast.success("Course created successfully!");
        } else {
          toast.error("Failed to create course.");
        }
      });
    }

    // Reset form and close modal
    setFormData({
      course_name: "",
      description: "",
      class_id: "",
      course_id: "",
      startDate: new Date(),
      endDate: new Date(),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="courseName">Course Name</Label>
            <Input
              id="courseName"
              value={formData.course_name}
              onChange={(e) => handleInputChange("course_name", e.target.value)}
              placeholder="Enter course name"
              className={errors.course_name ? "border-red-500" : ""}
            />
            {errors.course_name && (
              <p className="text-sm text-red-500">{errors.course_name}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter course description"
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="class">Class</Label>
            <Select
              value={formData.class_id}
              onValueChange={(value) => {
                handleInputChange("class_id", value);
                // Reset subject if class changes
                handleInputChange("course_id", "");
              }}
            >
              <SelectTrigger
                id="class"
                className={errors.class_id ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classesOfTeacher
                  ? classesOfTeacher.map((cls) => (
                      <SelectItem key={cls.class_id} value={cls.class_id}>
                        {cls.class_name} - {cls.program_name}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
            {errors.class_id && (
              <p className="text-sm text-red-500">{errors.class_id}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Select
              value={formData.course_id}
              onValueChange={(value) => handleInputChange("course_id", value)}
              disabled={!formData.class_id}
            >
              <SelectTrigger
                id="subject"
                className={errors.course_id ? "border-red-500" : ""}
              >
                <SelectValue
                  placeholder={
                    formData.class_id
                      ? "Select subject"
                      : "Select a class first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {subjectRecommend.map((subject) => (
                  <SelectItem key={subject.course_id} value={subject.course_id}>
                    {subject.course_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.course_id && (
              <p className="text-sm text-red-500">{errors.course_id}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground",
                      errors.startDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate
                      ? format(formData.startDate, "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => handleInputChange("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground",
                      errors.endDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate
                      ? format(formData.endDate, "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => handleInputChange("endDate", date)}
                    initialFocus
                    disabled={(date) =>
                      formData.startDate ? date < formData.startDate : false
                    }
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate}</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Course</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
