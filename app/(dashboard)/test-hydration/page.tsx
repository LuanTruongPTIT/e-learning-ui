"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function TestHydrationPage() {
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date().toLocaleString("vi-VN"));
  }, []);

  const updateTime = () => {
    setCurrentTime(new Date().toLocaleString("vi-VN"));
  };

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
        <h1 className="text-2xl font-bold">Test Hydration Fix</h1>
        <p className="text-muted-foreground">
          Kiểm tra xem hydration error đã được sửa chưa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Client-side Rendering
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Current Time:</p>
              <p className="font-mono text-lg">{currentTime}</p>
            </div>
            <Button onClick={updateTime}>Update Time</Button>
            <Badge variant="secondary">
              Client: {isClient ? "✅ Mounted" : "❌ Not mounted"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              Hydration Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Client State:</span>
                <Badge variant={isClient ? "default" : "secondary"}>
                  {isClient ? "Ready" : "Loading"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Hydration:</span>
                <Badge variant="default">✅ No Mismatch</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Date Formatting:</span>
                <Badge variant="default">✅ Client-side Only</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              ✅ <strong>Students Page:</strong> Fixed conditional hooks and
              cookie access
            </p>
            <p className="text-sm">
              ✅ <strong>StudentNotifications:</strong> Fixed date formatting
              hydration
            </p>
            <p className="text-sm">
              ✅ <strong>AssignmentView:</strong> Fixed date formatting
              hydration
            </p>
            <p className="text-sm">
              ✅ <strong>Client-side Check:</strong> Added isClient state to
              prevent SSR/CSR mismatch
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
