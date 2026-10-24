import React from 'react';
import { CheckCircle, XCircle, AlertCircle, X, MessageSquare } from 'lucide-react';

export interface ToastNotification {
  id: string;
  type: 'success' | 'danger' | 'info';
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

interface ToastContainerProps {
  notifications: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none no-print">
      {notifications.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isDanger = toast.type === 'danger';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 transform transition-all duration-300 animate-slideUp ${
              isSuccess
                ? 'bg-emerald-900 text-white border-emerald-700'
                : isDanger
                ? 'bg-rose-900 text-white border-rose-700'
                : 'bg-gray-900 text-white border-gray-700'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle className="w-5 h-5 text-emerald-400" />}
              {isDanger && <XCircle className="w-5 h-5 text-rose-400" />}
              {!isSuccess && !isDanger && <AlertCircle className="w-5 h-5 text-blue-400" />}
            </div>

            <div className="flex-1">
              <h4 className="font-bold text-xs uppercase tracking-wider">{toast.title}</h4>
              <p className="text-xs text-gray-200 mt-0.5 leading-relaxed">{toast.message}</p>
              {toast.actionText && toast.onAction && (
                <button
                  type="button"
                  onClick={() => {
                    toast.onAction?.();
                    onDismiss(toast.id);
                  }}
                  className="mt-2 text-xs font-bold text-amber-300 hover:text-amber-200 underline underline-offset-2 flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{toast.actionText}</span>
                </button>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-gray-400 hover:text-white p-1 rounded-lg"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
