"use client";

import React from "react";
import AIChat from "@/components/ai-chat/AIChat";
import AIAssistantTool from "@/components/ai-chat/AIAssistantTool";
import { Toaster } from "react-hot-toast";

export default function AIDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Demo AI Trợ Lý Giáo Dục
          </h1>
          <p className="text-gray-600">
            Trải nghiệm các tính năng AI hỗ trợ giảng viên và sinh viên
          </p>
        </div>

        {/* AI Assistant Tools */}
        <div className="mb-8">
          <AIAssistantTool />
        </div>

        {/* Floating Chat */}
        <AIChat context="Demo page - AI Education Assistant" />

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Hướng dẫn sử dụng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">🎓 Dành cho Sinh viên:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Tạo kế hoạch học tập cá nhân</li>
                <li>• Hỏi AI giải thích khái niệm khó hiểu</li>
                <li>• Chat trực tiếp với AI để được hỗ trợ</li>
                <li>• Luyện tập với các câu hỏi do AI tạo</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">👨‍🏫 Dành cho Giảng viên:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Đánh giá và chấm điểm bài tập tự động</li>
                <li>• Tạo câu hỏi quiz theo chủ đề</li>
                <li>• Tạo kế hoạch giảng dạy chi tiết</li>
                <li>• Hỗ trợ giải đáp thắc mắc của sinh viên</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              ⚡ Lưu ý quan trọng:
            </h4>
            <p className="text-sm text-blue-800">
              Để sử dụng đầy đủ tính năng, cần có Ollama đang chạy tại địa chỉ
              localhost:11434. Nếu chưa có, hãy tải và cài đặt Ollama từ{" "}
              <a
                href="https://ollama.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-600"
              >
                https://ollama.ai
              </a>
            </p>
          </div>
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
}
