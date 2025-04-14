import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center">
        <Image
          src="/unauthorized.png"
          alt="Unauthorized Access"
          width={300}
          height={300}
          className="mx-auto mb-8"
        />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Truy cập bị từ chối
        </h1>
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
