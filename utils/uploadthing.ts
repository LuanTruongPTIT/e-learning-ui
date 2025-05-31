import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadButtonProps {
  onUploadComplete?: (files: Array<{ url: string; name: string }>) => void;
  onUploadError?: (error: Error) => void;
  endpoint?: string;
}

export const UploadButton: React.FC<UploadButtonProps> = ({
  onUploadComplete,
  onUploadError,
}) => {
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadedFiles = Array.from(files).map((file) => ({
        url: `https://uploadthing.com/f/${file.name}`,
        name: file.name,
      }));

      if (onUploadComplete) {
        onUploadComplete(uploadedFiles);
      }
    } catch (error) {
      if (onUploadError) {
        onUploadError(error as Error);
      }
    }
  };

  return React.createElement(
    "div",
    { className: "flex flex-col gap-2" },
    React.createElement(
      Button,
      {
        type: "button",
        variant: "outline",
        className: "relative overflow-hidden",
      },
      React.createElement(Upload, { className: "h-4 w-4 mr-2" }),
      "Choose Files",
      React.createElement("input", {
        type: "file",
        multiple: true,
        className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer",
        onChange: handleFileUpload,
        accept: ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip,.rar",
      })
    ),
    React.createElement(
      "p",
      { className: "text-xs text-gray-500" },
      "Upload files (PDF, DOC, images, archives)"
    )
  );
};
