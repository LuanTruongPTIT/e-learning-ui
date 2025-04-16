"use client";

import { useState } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  UserPlus,
  MoreVertical,
  Mail,
  UserMinus,
  Loader2,
  User,
  CheckCircle2,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Student } from "@/types/course";

// Mock data for student search results
const mockSearchResults: Student[] = [
  {
    id: "s1",
    name: "Jordan Lee",
    email: "jordan.lee@example.com",
    department: "Computer Science",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
    enrollmentDate: new Date(),
  },
  {
    id: "s2",
    name: "Casey Wilson",
    email: "casey.wilson@example.com",
    department: "Information Technology",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
    enrollmentDate: new Date(),
  },
  {
    id: "s3",
    name: "Riley Garcia",
    email: "riley.garcia@example.com",
    department: "Computer Science",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
    enrollmentDate: new Date(),
  },
];

interface CourseStudentsProps {
  courseId: string;
  students: Student[];
  onStudentsChange: (students: Student[]) => void;
}

export default function CourseStudents({
  courseId,
  students,
  onStudentsChange,
}: CourseStudentsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = async () => {
    if (!showAddDialog || !searchEmail) return;

    setIsSearching(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Filter out students who are already enrolled
      const enrolledIds = students.map((s) => s.id);
      const results = mockSearchResults.filter(
        (student) =>
          !enrolledIds.includes(student.id) &&
          (student.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
            student.name.toLowerCase().includes(searchEmail.toLowerCase()))
      );

      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleAddStudents = async () => {
    if (selectedStudents.length === 0) return;

    setIsAdding(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Add selected students to the course
      const newStudents = searchResults
        .filter((student) => selectedStudents.includes(student.id))
        .map((student) => ({
          ...student,
          status: "Active",
          enrollmentDate: new Date(),
        }));

      onStudentsChange([...students, ...newStudents]);
      setShowAddDialog(false);
      setSelectedStudents([]);
      setSearchEmail("");
      setSearchResults([]);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveStudent = (studentId: string) => {
    onStudentsChange(students.filter((student) => student.id !== studentId));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Button onClick={() => setShowAddDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Students
        </Button>
      </div>

      {filteredStudents.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow className="hover:bg-secondary/50 border-none">
                <TableHead className="w-[40%]">Student</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
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
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 bg-primary/20">
                        <AvatarImage
                          src={student.avatar || "/placeholder.svg"}
                          alt={student.name}
                        />
                        <AvatarFallback className="bg-primary/20 text-primary-foreground">
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {student.name}
                    </div>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 hover:bg-green-50"
                    >
                      {student.status}
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
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive focus:text-destructive"
                          onClick={() => handleRemoveStudent(student.id)}
                        >
                          <UserMinus className="mr-2 h-4 w-4" />
                          Remove from Course
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
              : "Add students to your course"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowAddDialog(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Students
            </Button>
          )}
        </div>
      )}

      {/* Add Students Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Students to Course</DialogTitle>
            <DialogDescription>
              Search for students by email address and add them to your course.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email or name..."
                  className="pl-8"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchEmail}
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>

            {searchResults.length > 0 ? (
              <div className="border rounded-md max-h-[300px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]"></TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((student) => (
                      <TableRow
                        key={student.id}
                        className={
                          selectedStudents.includes(student.id)
                            ? "bg-muted/50"
                            : ""
                        }
                      >
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleStudentSelection(student.id)}
                          >
                            {selectedStudents.includes(student.id) ? (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={student.avatar || "/placeholder.svg"}
                                alt={student.name}
                              />
                              <AvatarFallback>
                                {student.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {student.name}
                          </div>
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.department}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center border rounded-md bg-muted/20">
                <Search className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  {searchEmail && !isSearching
                    ? "No matching students found"
                    : "Search for students by email address"}
                </p>
              </div>
            )}

            {selectedStudents.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {selectedStudents.length} student
                  {selectedStudents.length !== 1 ? "s" : ""} selected
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedStudents([])}
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Selection
                </Button>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddStudents}
              disabled={selectedStudents.length === 0 || isAdding}
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add to Course
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
