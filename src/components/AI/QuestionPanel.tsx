import React, { useState, useEffect } from 'react';
import { Send, Clock, Loader } from 'lucide-react';
import { Document } from '../../contexts/DocumentContext';
import { useDocuments } from '../../hooks/useDocuments';
import toast from 'react-hot-toast';

interface QuestionPanelProps {
  document: Document;
}

interface Conversation {
  id: number;
  question: string;
  answer: string;
  timestamp: Date;
}

const QuestionPanel: React.FC<QuestionPanelProps> = ({ document }) => {
  const { askQuestion } = useDocuments();

  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Clear history when a new document is selected
  useEffect(() => {
    setConversations([]);
  }, [document.id]);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      const answer = await askQuestion(document.id, question);
      setConversations(prev => [
        ...prev,
        {
          id: Date.now(),
          question,
          answer,
          timestamp: new Date(),
        },
      ]);
      setQuestion('');
    } catch (err: any) {
      console.error('Error asking question:', err);
      toast.error(err.message || 'Failed to fetch answer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Ask Questions about: {document.title}
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Ask any question about the content of this document
        </p>
      </div>

      <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow p-4 mb-4">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <Clock className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-lg font-medium">No questions asked yet</p>
            <p className="text-sm">
              Ask your first question about this document below
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {conversations.map(conv => (
              <div key={conv.id} className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Your question:</p>
                  <p className="text-gray-900">{conv.question}</p>
                </div>

                <div className="bg-primary-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">AI response:</p>
                  <p className="text-gray-900 whitespace-pre-line">{conv.answer}</p>
                </div>

                <div className="border-b border-gray-200 pt-2">
                  <p className="text-xs text-gray-400 pb-2">
                    {conv.timestamp.toLocaleTimeString()} •{' '}
                    {conv.timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <form onSubmit={handleSubmitQuestion} className="flex items-end">
          <div className="flex-1">
            <label
              htmlFor="question"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Question
            </label>
            <textarea
              id="question"
              rows={2}
              className="input resize-none"
              placeholder="Type your question here..."
              value={question}
              onChange={e => setQuestion(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="ml-3 btn-primary h-10 self-end"
            disabled={isLoading || !question.trim()}
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Ask
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionPanel;
