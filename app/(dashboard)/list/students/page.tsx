"use client";

import { useState, useEffect } from "react";
import {
  getStudents,
  createStudent,
  deleteStudent,
  CreateStudentRequest,
  GetStudentsParams,
  StudentsResponse,
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
import {
  Search,
  UserPlus,
  ArrowUpDown,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Calendar,
  User,
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Cookies from "js-cookie";

export default function StudentsPage() {
  // State for user role and mounting
  const [isClient, setIsClient] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);

  const [studentsData, setStudentsData] = useState<StudentsResponse>({
    students: [],
    pagination: {
      total_count: 0,
      page: 1,
      page_size: 10,
      total_pages: 0,
      has_next_page: false,
      has_previous_page: false,
    },
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<GetStudentsParams>({
    page: 1,
    page_size: 10,
    sort_by: "created_at",
    sort_order: "desc",
  });

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

  // Initialize client-side data
  useEffect(() => {
    setIsClient(true);
    const role = Cookies.get("role") || "";
    setIsAdmin(role === "Administrator");
    setIsTeacher(role === "Teacher" || role === "Lecturer");
  }, []);

  // Fetch students data
  const fetchStudents = async (params?: GetStudentsParams) => {
    try {
      setLoading(true);
      const response = await getStudents(params);
      setStudentsData(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

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
    if (isClient) {
      fetchPrograms();
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient && (isAdmin || isTeacher)) {
      fetchStudents(filters);
    }
  }, [filters, isClient, isAdmin, isTeacher]);

  // Show loading while checking client-side state
  if (!isClient) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user has access - after client is mounted
  if (!isAdmin && !isTeacher) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Access Denied</h3>
            <p className="text-muted-foreground">
              You don&apos;t have permission to view this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle search
  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      keyword: searchQuery,
      page: 1,
    }));
  };

  // Handle filter change
  const handleFilterChange = (
    key: keyof GetStudentsParams,
    value: string | number | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  // Toggle sort order
  const toggleSort = (column: string) => {
    const newSortOrder =
      sortBy === column && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortOrder(newSortOrder);
    setFilters((prev) => ({
      ...prev,
      sort_by: column,
      sort_order: newSortOrder,
      page: 1,
    }));
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

      await createStudent(studentData);
      toast.success("Student created successfully");
      setShowCreateDialog(false);
      resetForm();
      fetchStudents(filters); // Refresh the list
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
      await deleteStudent(id);
      toast.success("Student deleted successfully");
      fetchStudents(filters); // Refresh the list
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      page: 1,
      page_size: 10,
      sort_by: "created_at",
      sort_order: "desc",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Students Management</h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Manage all students" : "View your students"}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowCreateDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentsData?.pagination?.total_count || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Students
            </CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentsData?.students?.filter((s) => s.account_status === 1)
                ?.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Page</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentsData?.pagination?.page || 1} /{" "}
              {studentsData?.pagination?.total_pages || 1}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Size</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentsData?.pagination?.page_size || 10}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline" onClick={() => fetchStudents(filters)}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <Label>Program</Label>
                <Select
                  value={filters.program_id || ""}
                  onValueChange={(value) =>
                    handleFilterChange("program_id", value || undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All programs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All programs</SelectItem>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={filters.account_status?.toString() || ""}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "account_status",
                      value ? parseInt(value) : undefined
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="1">Active</SelectItem>
                    <SelectItem value="0">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Page Size</Label>
                <Select
                  value={filters.page_size?.toString() || "10"}
                  onValueChange={(value) =>
                    handleFilterChange("page_size", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Students Table */}
      {loading ? (
        <Card>
          <CardContent className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : studentsData?.students?.length > 0 ? (
        <Card>
          <CardContent className="p-0">
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
                {studentsData?.students?.map((student) => (
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
                    <TableCell>
                      {student.gender === 1 ? "Male" : "Female"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.account_status === 1 ? "success" : "secondary"
                        }
                      >
                        {student.account_status === 1 ? "Active" : "Inactive"}
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
                )) || []}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No students found</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              {searchQuery ||
              filters.program_id ||
              filters.account_status !== undefined
                ? "Try adjusting your search or filters"
                : "Add your first student to get started"}
            </p>
            {!searchQuery &&
              !filters.program_id &&
              filters.account_status === undefined &&
              isAdmin && (
                <Button onClick={() => setShowCreateDialog(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              )}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {studentsData?.students?.length > 0 && (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              {((studentsData?.pagination?.page || 1) - 1) *
                (studentsData?.pagination?.page_size || 10) +
                1}{" "}
              to{" "}
              {Math.min(
                (studentsData?.pagination?.page || 1) *
                  (studentsData?.pagination?.page_size || 10),
                studentsData?.pagination?.total_count || 0
              )}{" "}
              of {studentsData?.pagination?.total_count || 0} students
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handlePageChange((studentsData?.pagination?.page || 1) - 1)
                }
                disabled={!studentsData?.pagination?.has_previous_page}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from(
                  {
                    length: Math.min(
                      5,
                      studentsData?.pagination?.total_pages || 1
                    ),
                  },
                  (_, i) => {
                    const pageNum =
                      (studentsData?.pagination?.page || 1) - 2 + i;
                    if (
                      pageNum < 1 ||
                      pageNum > (studentsData?.pagination?.total_pages || 1)
                    )
                      return null;
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          pageNum === (studentsData?.pagination?.page || 1)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handlePageChange((studentsData?.pagination?.page || 1) + 1)
                }
                disabled={!studentsData?.pagination?.has_next_page}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
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
