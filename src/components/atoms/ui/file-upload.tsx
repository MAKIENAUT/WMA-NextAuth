import React from "react";
import { Label } from "./label";
import { Input } from "./input";

interface FileUploadProps {
  id: string;
  label: string;
  required?: boolean;
  accept?: string;
  value?: FileList | null;
  onChange: (files: FileList | null) => void;
  fileName?: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  required = false,
  accept = ".pdf",
  value,
  onChange,
  fileName,
}) => {
  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="border-2 border-dashed border-wma-darkTeal rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
        <Input
          type="file"
          accept={accept}
          className="hidden"
          id={id}
          onChange={(e) => onChange(e.target.files)}
        />
        <label htmlFor={id} className="cursor-pointer block">
          {fileName ? (
            <div className="flex items-center justify-center">
              <span className="text-sm font-medium">{fileName}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <span className="text-sm mb-2">
                Click/drag & drop your file here
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

export default FileUpload;