"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSubject, Subject } from "@/apis/subjects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-toastify";
import { ArrowLeft, Search, Mail, Phone, Loader2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Cookies from "js-cookie";

// Temporary interface for enrolled students
interface EnrolledStudent {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  enrollment_date: string;
  status: string;
}

export default function SubjectStudentsPage() {
  const router = useRouter();
  const { id } = useParams();
  const userRole = Cookies.get("role") || "";
  const isTeacher = userRole === "Teacher" || userRole === "Lecturer";
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (id) {
      fetchSubject(id as string);
      // In a real implementation, you would fetch enrolled students here
      fetchMockStudents();
    }
  }, [id]);

  const fetchSubject = async (subjectId: string) => {
    try {
      const response = await getSubject(subjectId);
      if (response.status === 200) {
        setSubject(response.data);
      } else {
        toast.error("Failed to fetch subject details");
      }
    } catch (error) {
      console.error("Error fetching subject details:", error);
      toast.error("An error occurred while fetching subject details");
    }
  };

  // Mock function to simulate fetching enrolled students
  const fetchMockStudents = () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const mockStudents: EnrolledStudent[] = [
        {
          id: "1",
          full_name: "John Doe",
          email: "john.doe@example.com",
          phone_number: "123-456-7890",
          enrollment_date: new Date().toISOString(),
          status: "active",
        },
        {
          id: "2",
          full_name: "Jane Smith",
          email: "jane.smith@example.com",
          phone_number: "987-654-3210",
          enrollment_date: new Date().toISOString(),
          status: "active",
        },
        {
          id: "3",
          full_name: "Bob Johnson",
          email: "bob.johnson@example.com",
          phone_number: "555-123-4567",
          enrollment_date: new Date().toISOString(),
          status: "inactive",
        },
      ];
      setStudents(mockStudents);
      setLoading(false);
    }, 1000);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSearch = (searchTerm: string) => {
    setKeyword(searchTerm);
    // In a real implementation, you would filter students based on the search term
  };

  const handleAddStudent = () => {
    router.push(`/subjects/${id}/students/add`);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!subject) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="outline" onClick={handleBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Subject Not Found</h2>
          <p className="text-muted-foreground">
            The subject you are looking for does not exist or you don't have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        {isTeacher && (
          <Button onClick={handleAddStudent}>
            <Plus className="mr-2 h-4 w-4" /> Add Student
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{subject.name} - Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Subject Code:</span> {subject.code}
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-8 w-[250px]"
                value={keyword}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No students enrolled.
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src="" alt={student.full_name} />
                          <AvatarFallback>{getInitials(student.full_name)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{student.full_name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          {student.email}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          {student.phone_number}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={student.status === "active" ? "default" : "secondary"}
                        >
                          {student.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
