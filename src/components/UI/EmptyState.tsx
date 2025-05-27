import React from 'react';
import { FileText } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: () => void;
  actionText?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  action, 
  actionText 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg p-8 text-center animate-fade-in">
      <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
        <FileText className="h-8 w-8 text-primary-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      
      {action && actionText && (
        <button
          type="button"
          className="btn-primary"
          onClick={action}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;