import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface AdminToastContextType {
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

const AdminToastContext = createContext<AdminToastContextType | undefined>(undefined);

export const useAdminToast = () => {
  const context = useContext(AdminToastContext);
  if (!context) {
    throw new Error("useAdminToast must be used within an AdminToastProvider");
  }
  return context;
};

const Toast = ({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) => {
  const [progress, setProgress] = useState(100);
  const duration = toast.duration || 3000;

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (elapsed >= duration) {
        clearInterval(interval);
        onRemove(toast.id);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [duration, toast.id, onRemove]);

  const styleConfig = {
    success: { icon: CheckCircle, color: "#16A34A", border: "border-l-[#16A34A]" },
    error: { icon: XCircle, color: "#DC2626", border: "border-l-[#DC2626]" },
    warning: { icon: AlertTriangle, color: "#D97706", border: "border-l-[#D97706]" },
    info: { icon: Info, color: "#2563EB", border: "border-l-[#2563EB]" },
  };

  const config = styleConfig[toast.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden bg-white border-[1.5px] border-[rgba(15,23,42,0.08)] rounded-[14px] shadow-lg mb-2 flex items-start p-[14px_18px] gap-3 w-[320px] pointer-events-auto border-l-[3px] ${config.border}`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      <Icon className="w-5 h-5 mt-0.5 shrink-0" style={{ color: config.color }} />
      <div className="flex-1">
        <p className="text-[14px] font-medium text-[#0F172A] leading-snug">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-[#94A3B8] hover:text-[#0F172A] transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-[3px] bg-gray-100 w-full">
        <div
          className="h-full transition-all duration-75 ease-linear"
          style={{ width: `${progress}%`, backgroundColor: config.color }}
        />
      </div>
    </motion.div>
  );
};

export const AdminToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AdminToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[999] flex flex-col pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </AdminToastContext.Provider>
  );
};
