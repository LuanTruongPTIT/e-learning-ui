/* eslint-disable @typescript-eslint/no-unused-vars */
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Định nghĩa router cho upload
export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // Middleware dùng để xử lý xác thực hoặc thêm metadata (nếu cần)
      return {}; // Trả về object rỗng nếu không có metadata
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Hàm này được gọi sau khi upload xong
      console.log("Upload complete:", file);

      // Không được return bất cứ thứ gì ở đây
      // Nếu bạn muốn lưu file.url vào database thì xử lý tại đây
    }),
} satisfies FileRouter;

// Export type để sử dụng ở client nếu cần
export type OurFileRouter = typeof ourFileRouter;
