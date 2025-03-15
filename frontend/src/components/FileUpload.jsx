/**
 * Reusable file upload component with drag-drop functionality
 * @param {Function} onFileSelect - Callback when file is selected
 * @param {string} acceptedTypes - Comma-separated file types (e.g., 'image/*,.pdf')
 */
import { useCallback } from 'react';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';

const FileUpload = ({ onFileSelect, acceptedTypes = 'image/*,.pdf' }) => {
  const handleFileChange = useCallback(e => {
    const file = e.target.files[0];
    if (validateFile(file)) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const validateFile = file => {
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return false;
    }
    return true;
  };

  return (
    <div className="border-2 border-dashed p-4 rounded-lg text-center">
      <input
        type="file"
        onChange={handleFileChange}
        accept={acceptedTypes}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center"
      >
        <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          Drag and drop or click to upload
        </p>
        <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
      </label>
    </div>
  );
};

export default FileUpload;