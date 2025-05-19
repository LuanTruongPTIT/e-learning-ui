"use client";

/**
 * Course Materials Component
 *
 * This component allows teachers to manage course materials, including:
 * - Uploading files (PDF, images, videos, etc.)
 * - Adding YouTube video links
 * - Managing publication status
 * - Deleting materials
 */

import type React from "react";
import { useEffect } from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  FileText,
  MoreVertical,
  Download,
  Trash2,
  Search,
  ArrowUpDown,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { format } from "date-fns";
import type { Lecture } from "@/types/course";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "react-toastify";
import {
  getLectures,
  createLecture,
  updateLecturePublishStatus,
  deleteLecture,
  CreateLectureRequest,
} from "@/apis/lectures";

// Mock data for lectures if none provided
const mockLectures: Lecture[] = [
  {
    id: "material-1",
    course_id: "course-1",
    title: "Introduction to JavaScript",
    description: "Basic introduction to JavaScript programming language",
    content_url: "#",
    content_type: "VIDEO_UPLOAD",
    duration: 1800,
    is_published: true,
    created_at: new Date("2025-05-05"),
    updated_at: new Date("2025-05-05"),
    created_by: "user-1",
  },
  {
    id: "material-2",
    course_id: "course-1",
    title: "Variables and Data Types",
    description: "Understanding variables and data types in JavaScript",
    content_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content_type: "YOUTUBE_LINK",
    duration: 212,
    is_published: true,
    created_at: new Date("2025-05-07"),
    updated_at: new Date("2025-05-07"),
    created_by: "user-1",
    youtube_video_id: "dQw4w9WgXcQ",
  },
  {
    id: "material-3",
    course_id: "course-1",
    title: "Functions and Scope",
    description: "Deep dive into functions and scope in JavaScript",
    content_url: "#",
    content_type: "VIDEO_UPLOAD",
    duration: 2400,
    is_published: false,
    created_at: new Date("2025-05-12"),
    updated_at: new Date("2025-05-12"),
    created_by: "user-1",
  },
];

interface CourseMaterialsProps {
  courseId: string; // This is actually the teaching_assign_course_id
}

export default function CourseMaterials({ courseId }: CourseMaterialsProps) {
  const [materials, setMaterials] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    materialType: "Lecture",
    uploadType: "file", // "file" or "youtube"
    file: null as File | null,
    youtubeUrl: "",
    is_published: true,
  });

  // Initialize UploadThing
  const { startUpload } = useUploadThing("courseMaterial");

  // Fetch course materials
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const response = await getLectures(courseId);
        setMaterials(response.data);
      } catch (error) {
        console.error("Error fetching materials:", error);
        toast.error("Failed to load course materials");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [courseId]);

  // Filter and sort materials
  const filteredMaterials = materials
    .filter(
      (material: Lecture) =>
        material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a: Lecture, b: Lecture) => {
      if (sortBy === "created_at") {
        return sortOrder === "asc"
          ? a.created_at.getTime() - b.created_at.getTime()
          : b.created_at.getTime() - a.created_at.getTime();
      } else if (sortBy === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === "content_type") {
        return sortOrder === "asc"
          ? a.content_type.localeCompare(b.content_type)
          : b.content_type.localeCompare(a.content_type);
      }
      return 0;
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm({
        ...uploadForm,
        file: e.target.files[0],
      });
    }
  };

  const handleUpload = async () => {
    // Validate form based on upload type
    if (!uploadForm.title) return;

    if (uploadForm.uploadType === "file" && !uploadForm.file) {
      toast.error("Please select a file to upload");
      return;
    }

    if (uploadForm.uploadType === "youtube" && !uploadForm.youtubeUrl) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    setIsUploading(true);
    try {
      let fileUrl = "";
      let youtubeVideoId = "";

      // Handle file upload or YouTube link
      if (uploadForm.uploadType === "file" && uploadForm.file) {
        // Upload file using UploadThing
        const uploadResult = await startUpload([uploadForm.file]);

        if (!uploadResult || !uploadResult[0]) {
          toast.error("Failed to upload file");
          return;
        }

        const uploadedFile = uploadResult[0];
        fileUrl = uploadedFile.url;
        // Get file extension
      } else if (uploadForm.uploadType === "youtube") {
        // Extract YouTube video ID from URL
        const youtubeRegex =
          /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
        const match = uploadForm.youtubeUrl.match(youtubeRegex);

        if (!match || !match[1]) {
          toast.error("Invalid YouTube URL");
          return;
        }

        youtubeVideoId = match[1];
        fileUrl = uploadForm.youtubeUrl;
        // YouTube video
      }

      // Create lecture data for API
      const lectureData: CreateLectureRequest = {
        title: uploadForm.title,
        description: uploadForm.description || "",
        content_url: fileUrl,
        content_type:
          uploadForm.uploadType === "youtube" ? "YOUTUBE_LINK" : "VIDEO_UPLOAD",
        youtube_video_id: youtubeVideoId || undefined,
        duration: uploadForm.uploadType === "file" ? 0 : 0, // Placeholder, actual duration would be determined later
        is_published: uploadForm.is_published,
        materialType: uploadForm.materialType,
      };

      // Call API to create lecture
      await createLecture(courseId, lectureData);

      // Refresh materials list
      const response = await getLectures(courseId);
      setMaterials(response.data);

      toast.success("Material uploaded successfully");
      setShowUploadDialog(false);
      setUploadForm({
        title: "",
        description: "",
        materialType: "Lecture",
        uploadType: "file",
        file: null,
        youtubeUrl: "",
        is_published: true,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload material");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Call API to delete material
      await deleteLecture(id);

      // Refresh materials list
      const response = await getLectures(courseId);
      setMaterials(response.data);

      toast.success("Material deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete material");
    }
  };

  const togglePublishStatus = async (id: string) => {
    try {
      const material = materials.find((m: Lecture) => m.id === id);
      if (!material) return;

      // Call API to update publish status
      const newStatus = !material.is_published;
      await updateLecturePublishStatus(id, newStatus);

      // Refresh materials list
      const response = await getLectures(courseId);
      setMaterials(response.data);

      toast.success(
        `Material ${newStatus ? "published" : "unpublished"} successfully`
      );
    } catch (error) {
      console.error("Update status error:", error);
      toast.error("Failed to update material status");
    }
  };

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
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
              <SelectItem value="created_at">Upload Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="content_type">Content Type</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>

          <Button onClick={() => setShowUploadDialog(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      {filteredMaterials.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow className="hover:bg-secondary/50 border-none">
                <TableHead className="w-[35%]">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => toggleSort("title")}
                  >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[15%]">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => toggleSort("content_type")}
                  >
                    Content Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[20%]">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => toggleSort("created_at")}
                  >
                    Upload Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[15%]">Size</TableHead>
                <TableHead className="w-[15%]">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.map((material: Lecture, index: number) => (
                <TableRow
                  key={material.id}
                  className={
                    index % 2 === 0
                      ? "bg-white hover:bg-gray-50"
                      : "bg-secondary/30 hover:bg-secondary/50"
                  }
                >
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    {material.title}
                  </TableCell>
                  <TableCell className="uppercase">
                    {material.content_type}
                  </TableCell>
                  <TableCell>
                    {format(material.created_at, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {material.content_type === "YOUTUBE_LINK"
                      ? "YouTube Video"
                      : material.duration
                      ? `${Math.floor(material.duration / 60)}:${(
                          material.duration % 60
                        )
                          .toString()
                          .padStart(2, "0")}`
                      : "Unknown"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        material.is_published
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {material.is_published ? "Published" : "Draft"}
                    </span>
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
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => togglePublishStatus(material.id)}
                        >
                          {material.is_published ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Publish
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive focus:text-destructive"
                          onClick={() => handleDelete(material.id)}
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
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No materials found</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {searchQuery
              ? "Try a different search term"
              : "Upload your first course material"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowUploadDialog(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Material
            </Button>
          )}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Course Material</DialogTitle>
            <DialogDescription>
              Add a new document, assignment, or resource to your course.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter material title"
                value={uploadForm.title}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter a brief description of this material"
                value={uploadForm.description}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="materialType">Material Type</Label>
              <Select
                value={uploadForm.materialType}
                onValueChange={(value) =>
                  setUploadForm({ ...uploadForm, materialType: value })
                }
              >
                <SelectTrigger id="materialType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lecture">Lecture</SelectItem>
                  <SelectItem value="Assignment">Assignment</SelectItem>
                  <SelectItem value="Resource">Resource</SelectItem>
                  <SelectItem value="Exam">Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="uploadTypeFile"
                    name="uploadType"
                    value="file"
                    checked={uploadForm.uploadType === "file"}
                    onChange={() =>
                      setUploadForm({ ...uploadForm, uploadType: "file" })
                    }
                  />
                  <Label htmlFor="uploadTypeFile">Upload File</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="uploadTypeYoutube"
                    name="uploadType"
                    value="youtube"
                    checked={uploadForm.uploadType === "youtube"}
                    onChange={() =>
                      setUploadForm({ ...uploadForm, uploadType: "youtube" })
                    }
                  />
                  <Label htmlFor="uploadTypeYoutube">YouTube Link</Label>
                </div>
              </div>

              {uploadForm.uploadType === "file" ? (
                <div className="grid gap-2">
                  <Label htmlFor="file">File</Label>
                  <Input id="file" type="file" onChange={handleFileChange} />
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="youtubeUrl">YouTube URL</Label>
                  <Input
                    id="youtubeUrl"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={uploadForm.youtubeUrl}
                    onChange={(e) =>
                      setUploadForm({
                        ...uploadForm,
                        youtubeUrl: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_published"
                checked={uploadForm.is_published}
                onCheckedChange={(checked: boolean) =>
                  setUploadForm({ ...uploadForm, is_published: checked })
                }
              />
              <Label htmlFor="is_published">Publish immediately</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUploadDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={
                !uploadForm.title ||
                (uploadForm.uploadType === "file" && !uploadForm.file) ||
                (uploadForm.uploadType === "youtube" &&
                  !uploadForm.youtubeUrl) ||
                isUploading
              }
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
