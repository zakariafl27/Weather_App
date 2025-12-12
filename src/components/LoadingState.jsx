import React from 'react';
import { Cloud } from 'lucide-react';

export default function LoadingState(){
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <Cloud className="animate-pulse text-indigo-400" size={48} />
    </div>
  );
};

