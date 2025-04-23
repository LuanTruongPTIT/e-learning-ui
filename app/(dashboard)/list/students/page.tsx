"use client";

import { useState, useEffect } from "react";
import {
  getStudents,
  createStudent,
  deleteStudent,
  Student,
  CreateStudentRequest,
} from "@/apis/students";
import { getPrograms, Program } from "@/apis/programs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { format } from "date-fns";
import {
  Search,
  UserPlus,
  ArrowUpDown,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Cookies from "js-cookie";

export default function StudentsPage() {
  const userRole = Cookies.get("role") || "";
  const isAdmin = userRole === "Administrator";

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("full_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
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

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        // Gọi API để lấy danh sách học sinh
        const response = await getStudents();

        // Chuyển đổi định dạng ngày tháng từ string sang Date
        const formattedStudents = response.data.map((student) => ({
          ...student,
          date_of_birth: student.date_of_birth
            ? new Date(student.date_of_birth)
            : new Date(),
          created_at: new Date(student.created_at),
        }));

        setStudents(formattedStudents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Failed to load students");
        setLoading(false);
      }
    };

    const fetchPrograms = async () => {
      try {
        // Gọi API để lấy danh sách chương trình học
        const response = await getPrograms();
        setPrograms(response.data);
      } catch (error) {
        console.error("Error fetching programs:", error);
        toast.error("Failed to load programs");
      }
    };

    fetchStudents();
    fetchPrograms();
  }, []);

  // Filter và sort students
  const filteredStudents = students
    .filter(
      (student) =>
        student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.phone_number.includes(searchQuery)
    )
    .sort((a, b) => {
      const aValue = a[sortBy as keyof Student];
      const bValue = b[sortBy as keyof Student];

      if (!aValue || !bValue) return 0;

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Toggle sort order
  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setNewStudent((prev) => ({ ...prev, send_email: checked }));
  };

  // Validate form
  const validateForm = () => {
    if (!newStudent.username) {
      toast.error("Username is required");
      return false;
    }
    if (!newStudent.email) {
      toast.error("Email is required");
      return false;
    }
    if (!newStudent.full_name) {
      toast.error("Full name is required");
      return false;
    }
    if (!newStudent.password) {
      toast.error("Password is required");
      return false;
    }
    if (newStudent.password !== newStudent.confirm_password) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Chuẩn bị dữ liệu để gửi đến API
      const studentData: CreateStudentRequest = {
        username: newStudent.username,
        email: newStudent.email,
        full_name: newStudent.full_name,
        phone_number: newStudent.phone_number || undefined,
        address: newStudent.address || undefined,
        date_of_birth: newStudent.date_of_birth || undefined,
        gender: newStudent.gender || undefined,
        program_id: newStudent.program_id || undefined,
        password: newStudent.password,
        send_email: newStudent.send_email,
      };

      // Gọi API để tạo học sinh mới
      await createStudent(studentData);

      // Cập nhật lại danh sách học sinh
      const response = await getStudents();
      const formattedStudents = response.data.map((student) => ({
        ...student,
        date_of_birth: student.date_of_birth
          ? new Date(student.date_of_birth)
          : new Date(),
        created_at: new Date(student.created_at),
      }));

      setStudents(formattedStudents);
      toast.success("Student created successfully");
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      console.error("Error creating student:", error);
      toast.error("Failed to create student");
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

  const handleDeleteStudent = async (id: string) => {
    try {
      // Gọi API để xóa học sinh
      await deleteStudent(id);

      // Cập nhật lại danh sách học sinh
      setStudents(students.filter((student) => student.id !== id));
      toast.success("Student deleted successfully");
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Students Management</h1>
        {isAdmin && (
          <Button onClick={() => setShowCreateDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredStudents.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow className="hover:bg-secondary/50 border-none">
                <TableHead className="w-[30%]">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => toggleSort("full_name")}
                  >
                    Student
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[20%]">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => toggleSort("program_name")}
                  >
                    Program
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[15%]">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => toggleSort("gender")}
                  >
                    Gender
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[15%]">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => toggleSort("account_status")}
                  >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={student.avatar_url}
                          alt={student.full_name}
                        />
                        <AvatarFallback>
                          {student.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{student.full_name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {student.program_name || (
                      <span className="text-muted-foreground">
                        Not assigned
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.account_status === "Active"
                          ? "success"
                          : student.account_status === "Inactive"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {student.account_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {isAdmin && (
                          <>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteStudent(student.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md bg-muted/20">
          <User className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No students found</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {searchQuery
              ? "Try a different search term"
              : "Add your first student to get started"}
          </p>
          {!searchQuery && isAdmin && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          )}
        </div>
      )}

      {/* Create Student Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Create a new student account. The student will receive an email
              with login instructions if you choose to send an email.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
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
                <Label htmlFor="full_name">Full Name</Label>
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
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    value={newStudent.phone_number}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
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
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={newStudent.gender}
                    onValueChange={(value) =>
                      handleSelectChange("gender", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="program_id">Program</Label>
                  <Select
                    value={newStudent.program_id}
                    onValueChange={(value) =>
                      handleSelectChange("program_id", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
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
                <Label htmlFor="address">Address</Label>
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
                  <Label htmlFor="password">Password</Label>
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
                  <Label htmlFor="confirm_password">Confirm Password</Label>
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
                  Send welcome email with login details
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Student"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
