"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectToStudents() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/list/students");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to Students page...</p>
      </div>
    </div>
  );
}
