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
import { ArrowLeft, Search, FileText, Video, Download, Loader2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Cookies from "js-cookie";

// Temporary interface for course materials
interface CourseMaterial {
  id: string;
  title: string;
  description: string;
  file_type: string;
  file_url: string;
  content_type: string;
  created_at: string;
  is_published: boolean;
}

export default function SubjectMaterialsPage() {
  const router = useRouter();
  const { id } = useParams();
  const userRole = Cookies.get("role") || "";
  const isTeacher = userRole === "Teacher" || userRole === "Lecturer";
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (id) {
      fetchSubject(id as string);
      // In a real implementation, you would fetch materials here
      fetchMockMaterials();
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

  // Mock function to simulate fetching materials
  const fetchMockMaterials = () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const mockMaterials: CourseMaterial[] = [
        {
          id: "1",
          title: "Introduction to the Course",
          description: "Overview of the course syllabus and objectives",
          file_type: "pdf",
          file_url: "/mock/syllabus.pdf",
          content_type: "DOCUMENT",
          created_at: new Date().toISOString(),
          is_published: true,
        },
        {
          id: "2",
          title: "Lecture 1: Fundamentals",
          description: "Introduction to basic concepts",
          file_type: "mp4",
          file_url: "/mock/lecture1.mp4",
          content_type: "VIDEO_UPLOAD",
          created_at: new Date().toISOString(),
          is_published: true,
        },
        {
          id: "3",
          title: "Assignment 1",
          description: "First assignment for the course",
          file_type: "docx",
          file_url: "/mock/assignment1.docx",
          content_type: "DOCUMENT",
          created_at: new Date().toISOString(),
          is_published: false,
        },
      ];
      setMaterials(mockMaterials);
      setLoading(false);
    }, 1000);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSearch = (searchTerm: string) => {
    setKeyword(searchTerm);
    // In a real implementation, you would filter materials based on the search term
  };

  const handleAddMaterial = () => {
    router.push(`/subjects/${id}/materials/add`);
  };

  const handleDownload = (material: CourseMaterial) => {
    // In a real implementation, you would download the file
    toast.info(`Downloading ${material.title}`);
  };

  const getFileIcon = (fileType: string, contentType: string) => {
    if (contentType === "VIDEO_UPLOAD" || contentType === "YOUTUBE_LINK") {
      return <Video className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
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
          <Button onClick={handleAddMaterial}>
            <Plus className="mr-2 h-4 w-4" /> Add Material
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{subject.name} - Course Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Subject Code:</span> {subject.code}
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
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
                  <TableHead className="w-[50px]">Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="hidden md:table-cell">Date Added</TableHead>
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
                ) : materials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No materials found.
                    </TableCell>
                  </TableRow>
                ) : (
                  materials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell>
                        {getFileIcon(material.file_type, material.content_type)}
                      </TableCell>
                      <TableCell className="font-medium">{material.title}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {material.description.length > 50
                          ? `${material.description.substring(0, 50)}...`
                          : material.description}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(new Date(material.created_at), "PPP")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={material.is_published ? "default" : "secondary"}
                        >
                          {material.is_published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(material)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
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
