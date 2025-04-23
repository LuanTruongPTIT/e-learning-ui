"use client";

import { useState, useEffect } from "react";
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
import { toast } from "react-toastify";
import { format } from "date-fns";
import {
  Search,
  ArrowUpDown,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  Calendar,
  Users,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import { getSubjects, getTeacherSubjects, Subject } from "@/apis/subjects";

export default function SubjectsPage() {
  const router = useRouter();
  const userRole = Cookies.get("role") || "";
  const isAdmin = userRole === "Administrator";

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchSubjects();
  }, [page, pageSize, keyword, isAdmin]);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      // Use different API endpoints based on user role
      const response = isAdmin
        ? await getSubjects(keyword, page, pageSize)
        : await getTeacherSubjects(keyword, page, pageSize);

      if (response.status === 200) {
        setSubjects(response.data);
        setTotalItems(response.total || response.data.length);
      } else {
        toast.error("Failed to fetch subjects");
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("An error occurred while fetching subjects");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm: string) => {
    setKeyword(searchTerm);
    setPage(1); // Reset to first page when searching
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleViewSubject = (subjectId: string) => {
    router.push(`/subjects/${subjectId}`);
  };

  const handleViewMaterials = (subjectId: string) => {
    router.push(`/subjects/${subjectId}/materials`);
  };

  const handleViewStudents = (subjectId: string) => {
    router.push(`/subjects/${subjectId}/students`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isAdmin ? "All Subjects" : "My Teaching Subjects"}
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subjects..."
              className="pl-8 w-[250px]"
              value={keyword}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : subjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No subjects found.
                </TableCell>
              </TableRow>
            ) : (
              subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.code}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.department_name}</TableCell>
                  <TableCell>{subject.credits}</TableCell>
                  <TableCell>
                    <Badge
                      variant={subject.is_active ? "default" : "destructive"}
                    >
                      {subject.is_active ? "Active" : "Inactive"}
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
                        <DropdownMenuItem
                          onClick={() => handleViewSubject(subject.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleViewMaterials(subject.id)}
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          View Materials
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleViewStudents(subject.id)}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          View Students
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-end">
        <Pagination
          currentPage={page}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
