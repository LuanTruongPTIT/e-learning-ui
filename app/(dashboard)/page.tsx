"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Get user role from cookies
    const role = Cookies.get("role");
    
    // Redirect based on role
    if (role === "Administrator") {
      router.push("/admin");
    } else if (role === "Teacher" || role === "Lecturer") {
      router.push("/teacher");
    }
  }, [router]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to E-Learning Dashboard</CardTitle>
          <CardDescription>
            Please select your role to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full" 
            size="lg"
            onClick={() => {
              Cookies.set("role", "Administrator");
              router.push("/admin");
            }}
          >
            Continue as Administrator
          </Button>
          <Button 
            className="w-full" 
            size="lg"
            variant="outline"
            onClick={() => {
              Cookies.set("role", "Teacher");
              router.push("/teacher");
            }}
          >
            Continue as Teacher
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
