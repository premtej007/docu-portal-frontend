import React, { useState } from 'react';
import { 
  FileText, 
  MoreVertical, 
  Trash2, 
  Edit, 
  Download, 
  Pencil 
} from 'lucide-react';
import { Document } from '../../contexts/DocumentContext';
import { useDocuments } from '../../hooks/useDocuments';

interface DocumentCardProps {
  document: Document;
  onClick: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onClick }) => {
  const { deleteDocument, updateDocument } = useDocuments();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(document.title);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getFileIcon = () => {
    const fileType = document.file_type.toLowerCase();
    
    if (fileType.includes('pdf')) {
      return <FileText className="h-12 w-12 text-error-500" />;
    } else if (fileType.includes('doc') || fileType.includes('word')) {
      return <FileText className="h-12 w-12 text-primary-500" />;
    } else if (fileType.includes('xls') || fileType.includes('sheet')) {
      return <FileText className="h-12 w-12 text-success-500" />;
    } else if (fileType.includes('ppt') || fileType.includes('presentation')) {
      return <FileText className="h-12 w-12 text-warning-500" />;
    } else if (fileType.includes('image') || fileType.includes('png') || fileType.includes('jpg')) {
      return <FileText className="h-12 w-12 text-secondary-500" />;
    } else {
      return <FileText className="h-12 w-12 text-gray-500" />;
    }
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setMenuOpen(false);
  };
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (title !== document.title) {
      await updateDocument(document.id, title);
    }
    
    setIsEditing(false);
  };
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(document.id);
    }
    
    setMenuOpen(false);
  };
  
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = document.file;
    link.download = document.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setMenuOpen(false);
  };
  
  return (
    <div 
      className="card group hover:border-primary-300 hover:translate-y-[-2px] transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            {getFileIcon()}
            {isEditing ? (
              <form onSubmit={handleSave} onClick={e => e.stopPropagation()}>
                <input
                  type="text"
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                  onClick={e => e.stopPropagation()}
                />
                <div className="flex mt-2">
                  <button
                    type="submit"
                    className="btn-primary text-xs px-2 py-1"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn-outline text-xs px-2 py-1 ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(false);
                      setTitle(document.title);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h3 className="font-medium text-gray-900 group-hover:text-primary-700 transition-colors duration-200">
                  {document.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {document.file_name}
                </p>
              </div>
            )}
          </div>
          {!isEditing && (
            <div className="relative">
              <button 
                className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
              >
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </button>
              
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 animate-fade-in">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleEdit}
                  >
                    <Edit className="mr-3 h-4 w-4 text-gray-500" />
                    Edit
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleDownload}
                  >
                    <Download className="mr-3 h-4 w-4 text-gray-500" />
                    Download
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-error-600 hover:bg-gray-100"
                    onClick={handleDelete}
                  >
                    <Trash2 className="mr-3 h-4 w-4 text-error-500" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
        <span>Uploaded {formatDate(document.uploaded_at)}</span>
        <span>{formatFileSize(document.file_size)}</span>
      </div>
    </div>
  );
};

export default DocumentCard;