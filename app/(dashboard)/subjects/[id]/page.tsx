"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSubject, Subject } from "@/apis/subjects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";
import { ArrowLeft, BookOpen, Calendar, Clock, Users, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function SubjectDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchSubject(id as string);
    }
  }, [id]);

  const fetchSubject = async (subjectId: string) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleViewMaterials = () => {
    router.push(`/subjects/${id}/materials`);
  };

  const handleViewStudents = () => {
    router.push(`/subjects/${id}/students`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin mb-4" />
          <p className="text-lg">Loading subject details...</p>
        </div>
      </div>
    );
  }

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
      <Button variant="outline" onClick={handleBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{subject.name}</CardTitle>
                  <CardDescription className="mt-2">
                    <span className="font-medium">Code:</span> {subject.code}
                  </CardDescription>
                </div>
                <Badge variant={subject.is_active ? "default" : "destructive"}>
                  {subject.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-muted-foreground">
                    {subject.description || "No description available."}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">Department</h3>
                    <p>{subject.department_name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Credits</h3>
                    <p>{subject.credits}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Created At</h3>
                    <p>{format(new Date(subject.created_at), "PPP")}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Last Updated</h3>
                    <p>{format(new Date(subject.updated_at), "PPP")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full justify-start"
                onClick={handleViewMaterials}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                View Course Materials
              </Button>
              <Button
                className="w-full justify-start"
                onClick={handleViewStudents}
              >
                <Users className="mr-2 h-4 w-4" />
                View Enrolled Students
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
