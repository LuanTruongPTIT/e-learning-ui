"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { markLectureAsCompleted } from "@/apis/student-courses";

export default function DemoMarkCompletePage() {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkComplete = async () => {
    if (isCompleted || isLoading) return;

    try {
      setIsLoading(true);
      
      // Demo lecture ID - replace with actual lecture ID for testing
      const demoLectureId = "550e8400-e29b-41d4-a716-446655440000";
      
      // Call API to mark lecture as completed
      await markLectureAsCompleted(demoLectureId);
      
      // Update local state
      setIsCompleted(true);
      
      // Show success message
      alert("Lecture marked as completed successfully!");
      
    } catch (error) {
      console.error("Error marking lecture as completed:", error);
      alert("Failed to mark lecture as completed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Demo: Mark Lecture Complete</h1>
          <p className="text-muted-foreground">
            Test the mark lecture complete functionality
          </p>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Sample Lecture: Introduction to React</h2>
            <Badge
              variant={isCompleted ? "success" : "outline"}
              className={isCompleted ? "bg-green-100 text-green-800" : ""}
            >
              {isCompleted ? "Completed" : "In Progress"}
            </Badge>
          </div>

          <div className="text-sm text-muted-foreground">
            Duration: 45 minutes • Video Lecture
          </div>

          <div className="pt-4">
            {!isCompleted && (
              <Button
                onClick={handleMarkComplete}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Marking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </>
                )}
              </Button>
            )}
            
            {isCompleted && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Lecture completed!</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-muted/20 rounded-lg p-4">
          <h3 className="font-medium mb-2">How to test:</h3>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Make sure the API server is running on port 5094</li>
            <li>Make sure you're logged in as a student</li>
            <li>Click the "Mark Complete" button above</li>
            <li>Check the browser network tab to see the API call</li>
            <li>The button should show loading state and then success</li>
          </ol>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">API Endpoint:</h3>
          <code className="text-sm text-blue-800">
            POST /student/lectures/{"{lectureId}"}/complete
          </code>
          <p className="text-sm text-blue-700 mt-2">
            This will call the API to mark the lecture as completed and update the student's progress.
          </p>
        </div>
      </div>
    </div>
  );
}
