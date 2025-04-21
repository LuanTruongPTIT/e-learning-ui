"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClassTable from "./_components/admin/class-table";
import CreateClassButton from "./_components/admin/create-class-button";
import { ClassResponse } from "@/types/class";
import { GetClasses } from "@/apis/teacher";

export default function ClassesAdminPage() {
  const [classes, setClasses] = useState<ClassResponse[]>([]);
  const [activeClasses, setActiveClasses] = useState<ClassResponse[]>([]);
  const [inactiveClasses, setInactiveClasses] = useState<ClassResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial class data
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await GetClasses();
        if (response.status === 200) {
          setClasses(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Filter classes by status whenever classes array changes
  useEffect(() => {
    setActiveClasses(classes.filter((cls) => cls.status === "active"));
    setInactiveClasses(classes.filter((cls) => cls.status === "inactive"));
  }, [classes]);

  // Handle class creation
  const handleClassCreated = (newClass: ClassResponse) => {
    setClasses((prevClasses) => [...prevClasses, newClass]);
  };

  // Handle class update
  const handleClassUpdate = (updatedClass: ClassResponse) => {
    setClasses((prevClasses) =>
      prevClasses.map((cls) =>
        cls.id === updatedClass.id ? updatedClass : cls
      )
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Class Management</h1>
          <p className="text-muted-foreground">
            Create and manage classes in the e-learning system
          </p>
        </div>
        <CreateClassButton onClassCreated={handleClassCreated} />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Total Classes</CardTitle>
            <CardDescription>All classes in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{classes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Active Classes</CardTitle>
            <CardDescription>Currently active classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {activeClasses.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Inactive Classes</CardTitle>
            <CardDescription>Currently inactive classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {inactiveClasses.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Classes</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Classes</CardTitle>
              <CardDescription>
                View and manage all classes in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClassTable classes={classes} onClassUpdate={handleClassUpdate} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Classes</CardTitle>
              <CardDescription>
                View and manage currently active classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClassTable
                classes={activeClasses}
                onClassUpdate={handleClassUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Classes</CardTitle>
              <CardDescription>
                View and manage currently inactive classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClassTable
                classes={inactiveClasses}
                onClassUpdate={handleClassUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
