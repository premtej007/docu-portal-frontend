import React from 'react';
import { Loader } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center space-y-4 p-8 rounded-lg bg-white shadow-md">
        <Loader className="h-12 w-12 text-primary-600 animate-spin" />
        <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
        <p className="text-gray-500">Please wait while we set things up</p>
      </div>
    </div>
  );
};

export default LoadingScreen;