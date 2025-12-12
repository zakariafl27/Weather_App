import React from 'react';

export default function ErrorState({ error, onRetry }){
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">{error}</p>
        <button 
          onClick={onRetry}
          className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

