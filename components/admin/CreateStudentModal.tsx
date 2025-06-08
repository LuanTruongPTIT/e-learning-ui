"use client";

import { useState, useEffect } from "react";
import { createStudent, CreateStudentRequest } from "@/apis/students";
import { getPrograms, Program } from "@/apis/programs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface CreateStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function CreateStudentModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateStudentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);

  // Form state cho việc tạo student mới
  const [newStudent, setNewStudent] = useState({
    username: "",
    email: "",
    full_name: "",
    phone_number: "",
    address: "",
    date_of_birth: "",
    gender: "Male",
    program_id: "",
    password: "",
    confirm_password: "",
    send_email: true,
  });

  // Fetch programs data
  const fetchPrograms = async () => {
    try {
      const response = await getPrograms();
      setPrograms(response.data);
    } catch (error) {
      console.error("Error fetching programs:", error);
      toast.error("Failed to load programs");
    }
  };

  useEffect(() => {
    if (open) {
      fetchPrograms();
    }
  }, [open]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setNewStudent((prev) => ({ ...prev, send_email: checked }));
  };

  const validateForm = () => {
    if (!newStudent.username.trim()) {
      toast.error("Username is required");
      return false;
    }
    if (!newStudent.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!newStudent.full_name.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!newStudent.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (newStudent.password !== newStudent.confirm_password) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStudent.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const studentData: CreateStudentRequest = {
        username: newStudent.username,
        email: newStudent.email,
        full_name: newStudent.full_name,
        phone_number: newStudent.phone_number || undefined,
        address: newStudent.address || undefined,
        date_of_birth: newStudent.date_of_birth || undefined,
        gender: newStudent.gender,
        program_id: newStudent.program_id || undefined,
        password: newStudent.password,
        send_email: newStudent.send_email,
      };

      await createStudent(studentData);
      toast.success("Student created successfully!");
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating student:", error);
      toast.error("Failed to create student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewStudent({
      username: "",
      email: "",
      full_name: "",
      phone_number: "",
      address: "",
      date_of_birth: "",
      gender: "Male",
      program_id: "",
      password: "",
      confirm_password: "",
      send_email: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm Sinh Viên Mới</DialogTitle>
          <DialogDescription>
            Tạo tài khoản sinh viên mới. Sinh viên sẽ nhận email với hướng dẫn
            đăng nhập nếu bạn chọn gửi email.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  name="username"
                  value={newStudent.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newStudent.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Họ và tên</Label>
              <Input
                id="full_name"
                name="full_name"
                value={newStudent.full_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone_number">Số điện thoại</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={newStudent.phone_number}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Ngày sinh</Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={newStudent.date_of_birth}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Giới tính</Label>
                <Select
                  value={newStudent.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Nam</SelectItem>
                    <SelectItem value="Female">Nữ</SelectItem>
                    <SelectItem value="Other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="program_id">Chương trình</Label>
                <Select
                  value={newStudent.program_id}
                  onValueChange={(value) =>
                    handleSelectChange("program_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chương trình" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Textarea
                id="address"
                name="address"
                value={newStudent.address}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={newStudent.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Xác nhận mật khẩu</Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  value={newStudent.confirm_password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="send_email"
                checked={newStudent.send_email}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="send_email">
                Gửi email chào mừng với thông tin đăng nhập
              </Label>
            </div>
          </div>
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
                "Tạo sinh viên"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
