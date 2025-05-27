import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import toast from 'react-hot-toast';

export interface Document {
  id: number;
  title: string;
  file: string;
  file_name: string;
  uploaded_at: string;
  updated_at: string;
  file_type: string;
  file_size: number;
}

interface DocumentContextType {
  documents: Document[];
  loading: boolean;
  error: string | null;
  selectedDocument: Document | null;
  fetchDocuments: () => Promise<void>;
  uploadDocument: (file: File, title: string) => Promise<Document>;
  deleteDocument: (id: number) => Promise<void>;
  updateDocument: (id: number, title: string) => Promise<Document>;
  selectDocument: (document: Document | null) => void;
  askQuestion: (documentId: number, question: string) => Promise<string>;
}

export const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    } else {
      setDocuments([]);
      setSelectedDocument(null);
    }
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get<Document[]>('/documents/');
      setDocuments(response.data);
    } catch (err: any) {
      setError('Failed to fetch documents');
      toast.error('Failed to fetch documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file: File, title: string): Promise<Document> => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    try {
      const response = await api.post<Document>('/documents/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setDocuments(prev => [response.data, ...prev]);
      toast.success('Document uploaded successfully');
      return response.data;
    } catch (err: any) {
      setError('Failed to upload document');
      toast.error('Failed to upload document');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/documents/${id}/`);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      if (selectedDocument?.id === id) {
        setSelectedDocument(null);
      }
      toast.success('Document deleted successfully');
    } catch (err: any) {
      setError('Failed to delete document');
      toast.error('Failed to delete document');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async (id: number, title: string): Promise<Document> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.patch<Document>(`/documents/${id}/`, { title });
      setDocuments(prev =>
        prev.map(doc => (doc.id === id ? { ...doc, title: response.data.title } : doc))
      );
      if (selectedDocument?.id === id) {
        setSelectedDocument(prev => prev && { ...prev, title: response.data.title });
      }
      toast.success('Document updated successfully');
      return response.data;
    } catch (err: any) {
      setError('Failed to update document');
      toast.error('Failed to update document');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selectDocument = (document: Document | null) => {
    setSelectedDocument(document);
  };

  const askQuestion = async (documentId: number, question: string): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      // 🔄 Changed from /documents/:id/ask/ to /qa/
      const response = await api.post<{ answer: string }>('/qa/', {
        doc_id: documentId,
        question,
      });
      toast.success('Question answered successfully');
      return response.data.answer;
    } catch (err: any) {
      setError('Failed to get answer');
      toast.error('Failed to get answer');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        loading,
        error,
        selectedDocument,
        fetchDocuments,
        uploadDocument,
        deleteDocument,
        updateDocument,
        selectDocument,
        askQuestion, // now points to /qa/
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
