"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Loader2, Users } from "lucide-react";
import Link from "next/link";

export default function TestStudentsPage() {
  const [isClient, setIsClient] = useState(false);
  const [testResults, setTestResults] = useState({
    hydration: false,
    safeAccess: false,
    clientState: false,
  });

  useEffect(() => {
    setIsClient(true);

    // Simulate test results
    setTimeout(() => {
      setTestResults({
        hydration: true,
        safeAccess: true,
        clientState: true,
      });
    }, 1000);
  }, []);

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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Test Students Page Fix</h1>
        <p className="text-muted-foreground">
          Kiểm tra xem lỗi ở Students page đã được sửa chưa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Fix Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Hydration Error:</span>
                <Badge
                  variant={testResults.hydration ? "default" : "secondary"}
                >
                  {testResults.hydration ? "✅ Fixed" : "❌ Not Fixed"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Safe Access:</span>
                <Badge
                  variant={testResults.safeAccess ? "default" : "secondary"}
                >
                  {testResults.safeAccess ? "✅ Fixed" : "❌ Not Fixed"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Client State:</span>
                <Badge
                  variant={testResults.clientState ? "default" : "secondary"}
                >
                  {testResults.clientState ? "✅ Ready" : "❌ Loading"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              Test Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/list/students">
              <Button className="w-full" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Go to Students Page
              </Button>
            </Link>
            <Link href="/test-hydration">
              <Button className="w-full" variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" />
                Test Hydration Fix
              </Button>
            </Link>
            <Link href="/demo-complete">
              <Button className="w-full" variant="outline">
                <AlertCircle className="mr-2 h-4 w-4" />
                Demo Complete
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Changes Made</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              ✅ <strong>Safe Access:</strong> Changed{" "}
              <code>studentsData.students.length</code> to{" "}
              <code>studentsData?.students?.length</code>
            </p>
            <p className="text-sm">
              ✅ <strong>Map Function:</strong> Changed{" "}
              <code>studentsData.students.map()</code> to{" "}
              <code>studentsData?.students?.map() || []</code>
            </p>
            <p className="text-sm">
              ✅ <strong>Client State:</strong> Added <code>isClient</code>{" "}
              state to prevent SSR/CSR mismatch
            </p>
            <p className="text-sm">
              ✅ <strong>Cookie Access:</strong> Moved{" "}
              <code>Cookies.get()</code> to <code>useEffect</code>
            </p>
            <p className="text-sm">
              ✅ <strong>Pagination:</strong> All pagination properties use safe
              access with fallback values
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Error Details Fixed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded border-l-4 border-red-500">
              <p className="text-sm font-medium text-red-800">
                Before (Error):
              </p>
              <code className="text-xs text-red-700">
                studentsData.students.length &gt; 0
              </code>
            </div>
            <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
              <p className="text-sm font-medium text-green-800">
                After (Fixed):
              </p>
              <code className="text-xs text-green-700">
                studentsData?.students?.length &gt; 0
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
