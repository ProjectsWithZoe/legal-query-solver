import React, { useState } from "react";
import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadFile } from "@/lib/api";

const FileUpload = ({
  onFileUpload,
}: {
  onFileUpload: (fileId: string, fileUrl: string) => void;
}) => {
  const [fileName, setFileName] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef(null);
  const [isuploading, setIsUploading] = useState(false);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFile = async (file: File) => {
    try {
      // Check if it's a PDF file
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }

      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Upload to FastAPI backend
      setIsUploading(true);
      const response = await uploadFile(file);

      console.log(response.data);

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setFileName(file.name);
      onFileUpload(response.data.file_id, response.data.file_url);
      setIsUploading(false);
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="law-card">
      <h2 className="text-xl font-semibold text-law-navy mb-4">
        Upload Contract
      </h2>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? "border-law-blue bg-blue-50" : "border-law-light-gray"
        } transition-colors`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FileUp className="mx-auto h-12 w-12 text-law-gray mb-4" />
        <p className="text-law-blue mb-2">
          Drag and drop your contract file here
        </p>
        <p className="text-law-gray text-sm mb-4">Supports PDF (Max 5MB)</p>

        <div className="flex justify-center">
          <label className="cursor-pointer">
            <Button
              onClick={handleBrowseClick}
              variant="outline"
              className="bg-white hover:bg-law-light-gray border-law-gray text-law-blue"
            >
              {isuploading ? "Uploading..." : "Browse Files"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={(e) => {
                if (e.target.files) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>

        {fileName && (
          <div className="mt-4 p-2 bg-law-light-gray rounded text-law-blue">
            <p className="text-sm truncate">{fileName}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
