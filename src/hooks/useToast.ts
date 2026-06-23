// hooks/useToast.ts
import { toast } from 'react-hot-toast';

export const useToast = () => {
  const showSuccess = (message: string) => {
    toast.success(message, {
      icon: '✅',
      duration: 4000,
    });
  };

  const showError = (message: string) => {
    toast.error(message, {
      icon: '❌',
      duration: 5000,
    });
  };

  const showInfo = (message: string) => {
    toast(message, {
      icon: 'ℹ️',
      duration: 4000,
    });
  };

  const showWarning = (message: string) => {
    toast(message, {
      icon: '⚠️',
      duration: 4000,
    });
  };

  const showLoading = (message: string) => {
    return toast.loading(message, {
      duration: Infinity,
    });
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  // ✅ Fonction pour les articles avec style personnalisé
  const showArticleToast = (message: string) => {
    toast.success(message, {
      duration: 4000,
      style: {
        background: '#fff',
        color: '#1A0A00',
        padding: '16px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        borderLeft: '4px solid #22c55e',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    dismiss,
    showArticleToast,
  };
};