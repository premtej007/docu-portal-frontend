import React, { useState } from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import DocumentCard from './DocumentCard';
import { Search } from 'lucide-react';

interface DocumentListProps {
  onDocumentSelect: (document: any) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ onDocumentSelect }) => {
  const { documents, loading } = useDocuments();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredDocuments = documents.filter(doc => 
  typeof doc.title === 'string' && 
  doc.title.toLowerCase().includes(searchTerm.toLowerCase())
)
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary-200 rounded-full mb-4"></div>
          <div className="h-4 w-24 bg-primary-200 rounded mb-3"></div>
          <div className="h-3 w-36 bg-primary-100 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Search bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          className="input pl-10"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Document grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onClick={() => onDocumentSelect(document)}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <p className="text-gray-500">No documents found</p>
            {searchTerm && (
              <p className="text-sm text-gray-400 mt-1">
                Try a different search term
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;