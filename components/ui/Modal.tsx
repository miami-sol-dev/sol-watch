'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // React 19: Cleanup functions are more reliable
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{ animation: 'fadeIn 0.2s ease-out' }}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
          animation: 'slideUp 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-all hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, #F94C9B 0%, #00B8D4 100%)',
          }}
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Content */}
        <div className="p-8">
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}