// Mock file upload service
export const fileUploadService = {
  uploadFile: async (file: File): Promise<any> => {
    // Mock file upload - replace with actual upload logic
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          url: URL.createObjectURL(file),
          name: file.name,
          type: file.type,
          size: file.size,
        });
      }, 1000);
    });
  },

  deleteFile: async (fileId: string): Promise<void> => {
    // Mock file deletion - replace with actual deletion logic
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Mock: Deleted file ${fileId}`);
        resolve();
      }, 500);
    });
  },
};
