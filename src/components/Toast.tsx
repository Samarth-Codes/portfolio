import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Toast as ToastType, useToast } from '../contexts/ToastContext';

interface ToastProps {
  toast: ToastType;
}

const ToastComponent: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToast();

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-gray-900/90 border-green-400 text-green-400 shadow-green-400/20';
      case 'error':
        return 'bg-gray-900/90 border-red-400 text-red-400 shadow-red-400/20';
      case 'info':
        return 'bg-gray-900/90 border-cyan-400 text-cyan-400 shadow-cyan-400/20';
      default:
        return 'bg-gray-900/90 border-cyan-400 text-cyan-400 shadow-cyan-400/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
      className={`
        flex items-center gap-3 p-4 rounded-lg border backdrop-blur-sm
        shadow-lg max-w-md w-full
        ${getStyles()}
      `}
      style={{
        boxShadow: `0 0 20px ${toast.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 
                              toast.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 
                              'rgba(6, 182, 212, 0.2)'}`
      }}
    >
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      
      <div className="flex-1 text-sm font-medium">
        {toast.message}
      </div>
      
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-20 right-4 z-[10000] space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastComponent;