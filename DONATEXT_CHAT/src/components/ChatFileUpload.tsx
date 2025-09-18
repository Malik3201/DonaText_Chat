import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { fileUploadService } from '../services/fileUploadService';
import toast from 'react-hot-toast';
import FileIcon from '../assets/svgs/FileIcon';

interface ChatFileUploadProps {
  onFileUpload: (
    file: File,
    fileInfo: { name: string; type: string; size: string }
  ) => void;
  onFileRemove: () => void;
}

const ChatFileUpload: React.FC<ChatFileUploadProps> = ({
  onFileUpload,
  onFileRemove,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toUpperCase();
    return extension || 'FILE';
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file
    const validation = fileUploadService.validateFile(file);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload file to server
      const response: any = await fileUploadService.uploadSingleFile(
        file,
        progress => {
          setUploadProgress(progress.percentage);
        }
      );

      if (response?.url) {
        const fileInfo = {
          name: file.name,
          type: getFileType(file.name),
          size: formatFileSize(file.size),
        };

        onFileUpload(file, fileInfo);
        toast.success('File uploaded successfully');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload file');
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    onFileRemove();
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'text/plain': ['.txt'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  if (selectedFile) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
              <svg
                className="w-4 h-4 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {getFileType(selectedFile.name)} •{' '}
                {formatFileSize(selectedFile.size)}
              </p>
              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div
                    className="bg-blue-500 h-1 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleRemoveFile}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            disabled={isUploading}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInputChange}
        accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
        className="hidden"
      />

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          <FileIcon />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">
              {isDragActive
                ? 'Drop file here'
                : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">
              Images, PDF, DOC, TXT, XLS (max. 10MB)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatFileUpload;
