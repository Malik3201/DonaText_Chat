import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600 text-lg">Loading your conversations...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
