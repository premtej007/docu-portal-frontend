import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload } from 'lucide-react';
import { useDocuments } from '../../hooks/useDocuments';
import Modal from '../UI/Modal';

interface DocumentUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: (newDoc: any) => void; // ✅ New optional callback prop
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const { uploadDocument } = useDocuments();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);

      if (!title) {
        const fileName = acceptedFiles[0].name;
        const titleWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        setTitle(titleWithoutExtension);
      }

      setError('');
    }
  }, [title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title for your document');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const newDoc = await uploadDocument(file, title); // ✅ Save reference to new doc
      if (onUploadSuccess) {
        onUploadSuccess(newDoc); // ✅ Notify parent (DashboardPage)
      }
      onClose(); // Close modal after notifying
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Document">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-error-50 text-error-700 rounded-md" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Document Title
            </label>
            <input
              type="text"
              id="title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Document File</label>
            <div
              {...getRootProps()}
              className={`mt-1 border-2 border-dashed rounded-md px-6 pt-5 pb-6 flex justify-center ${
                isDragActive 
                  ? 'border-primary-300 bg-primary-50' 
                  : 'border-gray-300 hover:border-primary-300'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <p className="relative cursor-pointer rounded-md font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500">
                    {isDragActive 
                      ? 'Drop the file here' 
                      : 'Drag and drop a file, or click to browse'}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG up to 10MB
                </p>
              </div>
            </div>
          </div>

          {file && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center space-x-3">
                <Upload className="h-5 w-5 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-gray-200"
                onClick={removeFile}
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              className="btn-outline"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default DocumentUpload;