import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const TOAST_TYPES = {
  success: {
    Icon: CheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-900/90',
    border: 'border-emerald-700/50',
  },
  error: {
    Icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-900/90',
    border: 'border-red-700/50',
  },
  warning: {
    Icon: AlertCircle,
    color: 'text-yellow-400',
    bg: 'bg-yellow-900/90',
    border: 'border-yellow-700/50',
  },
  info: {
    Icon: Info,
    color: 'text-blue-400',
    bg: 'bg-blue-900/90',
    border: 'border-blue-700/50',
  },
};

export default function Toast({ message, type = 'info', duration = 5000, onClose }) {
  const { Icon, color, bg, border } = TOAST_TYPES[type] || TOAST_TYPES.info;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 ${bg} backdrop-blur border ${border} rounded-xl px-4 py-3 flex items-center gap-3 max-w-md animate-slide-down shadow-lg`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${color}`} />
      <p className="text-white text-sm flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// Toast container hook for managing multiple toasts
export function useToast() {
  const [toasts, setToasts] = React.useState([]);

  const showToast = React.useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const hideToast = React.useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const ToastContainer = () => (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ top: `${80 + index * 70}px` }}
          className="fixed left-1/2 -translate-x-1/2 z-50"
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => hideToast(toast.id)}
          />
        </div>
      ))}
    </>
  );

  return { showToast, ToastContainer };
}
