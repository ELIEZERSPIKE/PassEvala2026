// components/Toast/ToastProvider.tsx - Version simplifiée
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#1A0A00',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '1px solid #E5E5E5',
        },
        success: {
          duration: 4000,
          style: {
            borderLeft: '4px solid #22c55e',
          },
        },
        error: {
          duration: 4000,
          style: {
            borderLeft: '4px solid #ef4444',
          },
        },
      }}
    />
  );
}