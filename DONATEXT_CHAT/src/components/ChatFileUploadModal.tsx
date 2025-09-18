import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { fileUploadService } from '../../../services/fileUploadService';
import toast from 'react-hot-toast';
import FileIcon from '../../../assets/svgs/FileIcon';

interface ChatFileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (file: any, fileInfo: any) => void;
}

const ChatFileUploadModal: React.FC<ChatFileUploadModalProps> = ({
  isOpen,
  onClose,
  onFileUpload,
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
    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload file to server
      const response = await fileUploadService.uploadSingleFile(file, (progress) => {
        setUploadProgress(progress.percentage);
      });

      console.log('Upload response:', response);
      const fileUrl = response?.data?.url || (response as any)?.url;

      if (fileUrl) {
        const fileInfo = {
          name: file.name, // Original file name
          url: fileUrl,    // S3 URL
        };

        console.log('File uploaded successfully:', fileInfo);
        onFileUpload(file, fileInfo);
        toast.success('File uploaded successfully');
        onClose();
      } else {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response from server');
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
    maxSize: 50 * 1024 * 1024, // 50MB max
    multiple: false,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upload File</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isUploading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {selectedFile ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
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
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-500 h-2 transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                disabled={isUploading}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-4">
                <FileIcon />
                <div className="text-center">
                  <p className="text-base font-medium text-gray-600">
                    {isDragActive
                      ? 'Drop file here'
                      : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Any file type (max. 50MB)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isUploading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatFileUploadModal;
