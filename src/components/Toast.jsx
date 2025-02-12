import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  // Handle automatic closing
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Handle keyboard interactions
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      role="alert"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 animate-slide-up"
    >
      <div 
        className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg ${
          type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}
      >
        {type === 'success' ? (
          <CheckCircle className="h-5 w-5" aria-hidden="true" />
        ) : (
          <XCircle className="h-5 w-5" aria-hidden="true" />
        )}
        <span className="sr-only">{type === 'success' ? 'Success:' : 'Error:'}</span>
        <span>{message}</span>
        <button 
          onClick={onClose}
          className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default Toast;