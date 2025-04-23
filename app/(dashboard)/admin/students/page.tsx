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

// Kiểu dữ liệu Student đã được định nghĩa trong apis/students.ts

// Mock data cho Students
const mockStudents: Student[] = [
  {
    id: "1",
    username: "student1",
    email: "student1@example.com",
    full_name: "Nguyễn Văn A",
    phone_number: "0901234567",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    avatar_url: "",
    date_of_birth: new Date("2000-01-15"),
    gender: "Male",
    account_status: "Active",
    created_at: new Date("2023-01-01"),
    program_id: "prog1",
    program_name: "Công nghệ thông tin",
  },
  {
    id: "2",
    username: "student2",
    email: "student2@example.com",
    full_name: "Trần Thị B",
    phone_number: "0909876543",
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    avatar_url: "",
    date_of_birth: new Date("2001-05-20"),
    gender: "Female",
    account_status: "Active",
    created_at: new Date("2023-02-15"),
    program_id: "prog2",
    program_name: "Khoa học máy tính",
  },
  {
    id: "3",
    username: "student3",
    email: "student3@example.com",
    full_name: "Lê Văn C",
    phone_number: "0908765432",
    address: "789 Đường DEF, Quận 3, TP.HCM",
    avatar_url: "",
    date_of_birth: new Date("1999-11-10"),
    gender: "Male",
    account_status: "Inactive",
    created_at: new Date("2023-03-10"),
    program_id: "prog1",
    program_name: "Công nghệ thông tin",
  },
];

// Kiểu dữ liệu Program đã được định nghĩa trong apis/programs.ts

export default function StudentsPage() {
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

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleCreateStudent = async () => {
    // Validate form
    if (!newStudent.username || !newStudent.email || !newStudent.full_name) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (newStudent.password !== newStudent.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

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
        <Button onClick={() => setShowCreateDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
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

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full_name">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="created_at">Registration Date</SelectItem>
              <SelectItem value="program_name">Program</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
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
                    onClick={() => toggleSort("created_at")}
                  >
                    Registration Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[15%]">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student, index) => (
                <TableRow
                  key={student.id}
                  className={
                    index % 2 === 0
                      ? "bg-white hover:bg-gray-50"
                      : "bg-secondary/30 hover:bg-secondary/50"
                  }
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={student.avatar_url} />
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
                        <div className="text-sm text-muted-foreground">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {student.program_name || "Not assigned"}
                  </TableCell>
                  <TableCell>
                    {format(student.created_at, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.account_status === "Active"
                          ? "success"
                          : "secondary"
                      }
                    >
                      {student.account_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive focus:text-destructive"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
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
          {!searchQuery && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          )}
        </div>
      )}

      {/* Create Student Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Create a new student account. The student will receive an email
              with login instructions if you choose to send an email
              notification.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username" className="required">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={newStudent.username}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, username: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="required">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="full_name" className="required">
                Full Name
              </Label>
              <Input
                id="full_name"
                placeholder="Enter full name"
                value={newStudent.full_name}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, full_name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  placeholder="Enter phone number"
                  value={newStudent.phone_number}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      phone_number: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={newStudent.date_of_birth}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      date_of_birth: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={newStudent.gender}
                  onValueChange={(value) =>
                    setNewStudent({ ...newStudent, gender: value })
                  }
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="program">Program</Label>
                <Select
                  value={newStudent.program_id}
                  onValueChange={(value) =>
                    setNewStudent({ ...newStudent, program_id: value })
                  }
                >
                  <SelectTrigger id="program">
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

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Enter address"
                value={newStudent.address}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, address: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password" className="required">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={newStudent.password}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, password: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm_password" className="required">
                  Confirm Password
                </Label>
                <Input
                  id="confirm_password"
                  type="password"
                  placeholder="Confirm password"
                  value={newStudent.confirm_password}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      confirm_password: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="send_email"
                checked={newStudent.send_email}
                onCheckedChange={(checked) =>
                  setNewStudent({
                    ...newStudent,
                    send_email: checked as boolean,
                  })
                }
              />
              <Label htmlFor="send_email">
                Send email notification to student
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateStudent} disabled={isSubmitting}>
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
