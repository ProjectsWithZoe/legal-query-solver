
import React, { useState } from 'react';
import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const FileUpload = ({ onFileUpload }: { onFileUpload: (file: File) => void }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };
  
  const handleFile = (file: File) => {
    // Check if it's a PDF, DOCX, or TXT file
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOCX, or TXT file');
      return;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    
    setFileName(file.name);
    onFileUpload(file);
    toast.success('File uploaded successfully');
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
      <h2 className="text-xl font-semibold text-law-navy mb-4">Upload Contract</h2>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-law-blue bg-blue-50' : 'border-law-light-gray'
        } transition-colors`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FileUp className="mx-auto h-12 w-12 text-law-gray mb-4" />
        <p className="text-law-blue mb-2">Drag and drop your contract file here</p>
        <p className="text-law-gray text-sm mb-4">Supports PDF, DOCX, and TXT (Max 5MB)</p>
        
        <div className="flex justify-center">
          <label className="cursor-pointer">
            <Button variant="outline" className="bg-white hover:bg-law-light-gray border-law-gray text-law-blue">
              Browse Files
            </Button>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              onChange={handleFileChange}
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
