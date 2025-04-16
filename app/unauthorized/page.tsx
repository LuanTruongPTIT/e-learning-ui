"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Đảm bảo bạn đã import đúng
import { AlertCircle } from "lucide-react"; // Dùng icon nếu bạn dùng lucide-react

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6 text-blue-600">
          <AlertCircle size={100} />
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">403</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Truy cập bị từ chối
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Bạn không có quyền truy cập vào trang này.
        </p>
        <Button
          onClick={() => router.back()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Quay lại trang trước
        </Button>
      </div>
    </div>
  );
}
