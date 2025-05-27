import React, { useState } from 'react';
import DocumentList from '../components/Documents/DocumentList';
import DocumentUpload from '../components/Documents/DocumentUpload';
import QuestionPanel from '../components/AI/QuestionPanel';
import { useDocuments } from '../hooks/useDocuments';
import EmptyState from '../components/UI/EmptyState';

enum View {
  LIST = 'list',
  QUESTION = 'question',
}

const DashboardPage: React.FC = () => {
  const { documents, selectedDocument, selectDocument } = useDocuments();
  const [currentView, setCurrentView] = useState<View>(View.LIST);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const handleDocumentSelect = (document: Document | null) => {
    selectDocument(document);
    if (document) {
      setCurrentView(View.QUESTION);
    }
  };
  
  const handleBackToList = () => {
    setCurrentView(View.LIST);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {currentView === View.LIST ? 'Your Documents' : 'Ask Questions'}
        </h1>
        
        <div className="flex space-x-3">
          {currentView === View.QUESTION && (
            <button
              onClick={handleBackToList}
              className="btn-outline"
            >
              Back to Documents
            </button>
          )}
          
          {currentView === View.LIST && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary"
            >
              Upload Document
            </button>
          )}
        </div>
      </div>
      
      {documents.length === 0 && currentView === View.LIST ? (
        <EmptyState 
          title="No documents yet"
          description="Upload your first document to get started"
          action={() => setShowUploadModal(true)}
          actionText="Upload Document"
        />
      ) : (
        <>
          {currentView === View.LIST && (
            <DocumentList onDocumentSelect={handleDocumentSelect} />
          )}
          
          {currentView === View.QUESTION && selectedDocument && (
            <QuestionPanel document={selectedDocument} />
          )}
        </>
      )}
      
      {showUploadModal && (
  <DocumentUpload
    isOpen={showUploadModal}
    onClose={() => setShowUploadModal(false)}
    onUploadSuccess={(doc) => {
      setShowUploadModal(false);
      handleDocumentSelect(doc); // ✅ Switch to chat view
    }}
  />
)}

    </div>
  );
};

export default DashboardPage;