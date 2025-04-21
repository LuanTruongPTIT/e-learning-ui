/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { mockData, type ClassData } from "@/lib/mock-data";
import { Department } from "@/types/deparment";
import {
  CreateClass,
  GetCoursesByDepartment,
  GetDepartment,
} from "@/apis/teacher";
import { Courses_By_Department } from "@/types/course";
import { toast } from "react-toastify";
import { ClassResponse } from "@/types/class";

interface CreateClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClassCreated?: (newClass: ClassResponse) => void;
}

export default function CreateClassModal({
  open,
  onOpenChange,
  onClassCreated,
}: CreateClassModalProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  // Form state
  const [departmentId, setDepartmentId] = useState<string>("");
  const [majorId, setMajorId] = useState<string>("");
  const [academicPeriod, setAcademicPeriod] = useState<string>("");
  const [className, setClassName] = useState<string>("");

  // Filtered options based on selections
  const [filteredMajors, setFilteredMajors] = useState<Courses_By_Department[]>(
    []
  );

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  useEffect(() => {
    const data = GetDepartment();
    data.then((res) => {
      setDepartments(res.data);
    });
  }, []);
  // Reset form when modal is closed
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setDepartmentId("");
    setMajorId("");
    setAcademicPeriod("");
    setClassName("");
    setFormError(null);
    setFormSuccess(false);
  };

  // Filter majors when department changes
  useEffect(() => {
    if (departmentId) {
      const majors_data = GetCoursesByDepartment(departmentId);
      majors_data.then((res) => {
        setFilteredMajors(res.data);
      });
      setMajorId("");
    } else {
      setFilteredMajors([]);
    }
  }, [departmentId]);

  // Filter programs when major changes

  // Validate form
  const validateForm = () => {
    if (!departmentId) {
      setFormError("Please select a department");
      return false;
    }
    if (!majorId) {
      setFormError("Please select a major");
      return false;
    }
    if (!academicPeriod) {
      setFormError("Please select an academic period");
      return false;
    }
    if (!className || className.trim() === "") {
      setFormError("Please enter a class name");
      return false;
    }

    setFormError(null);
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Get the selected items

      // Create new class object
      const newClass: ClassData = {
        id: `class-${Date.now()}`,
        className,
        department_id: departmentId,
        program_id: majorId,
        academicPeriod,
        status: "active",
        createdAt: new Date(),
      };
      console.log(newClass);
      const response = await CreateClass(newClass);
      console.log("response", response);
      if (response.status == 200) {
        toast.success("Class created successfully!");
      }
      // Show success message
      setFormSuccess(true);

      // Call the onClassCreated callback
      // if (onClassCreated) {
      //   onClassCreated(newClass);
      // }

      // Reset form after 2 seconds
      setTimeout(() => {
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      console.error("Error creating class:", error);

      setFormError(
        "Class name is already exist! Please choose another class name."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Create New Class
          </DialogTitle>
          <DialogDescription>
            Create a new class in the e-learning system
          </DialogDescription>
        </DialogHeader>

        {formSuccess ? (
          <div className="py-6">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Class created successfully!
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {formError && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {formError}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Select value={departmentId} onValueChange={setDepartmentId}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="major">Major</Label>
                <Select
                  value={majorId}
                  onValueChange={setMajorId}
                  disabled={!departmentId}
                >
                  <SelectTrigger id="major">
                    <SelectValue
                      placeholder={
                        departmentId
                          ? "Select major"
                          : "Select department first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredMajors.map((major) => (
                      <SelectItem key={major.id} value={major.id}>
                        {major.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="academicPeriod">Academic Period</Label>
                <Select
                  value={academicPeriod}
                  onValueChange={setAcademicPeriod}
                >
                  <SelectTrigger id="academicPeriod">
                    <SelectValue placeholder="Select academic period" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockData.academicPeriods.map((period) => (
                      <SelectItem key={period} value={period}>
                        {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="className">Class Name</Label>
                <Input
                  id="className"
                  placeholder="e.g., SE1201A"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Class"
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
