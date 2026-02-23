import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useUIStore } from '@/store';

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const colors = {
  success: 'from-green-500/20 to-green-600/20 border-green-500/30',
  error: 'from-red-500/20 to-red-600/20 border-red-500/30',
  info: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
};

const iconColors = {
  success: 'text-green-400',
  error: 'text-red-400',
  info: 'text-blue-400',
};

export function Toast() {
  const { toast, hideToast } = useUIStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  const Icon = icons[toast.type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-full px-4"
      >
        <div className={`bg-gradient-to-r ${colors[toast.type]} backdrop-blur-xl border rounded-2xl p-4 shadow-2xl`}>
          <div className="flex items-start gap-3">
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColors[toast.type]}`} />
            <p className="flex-1 text-white text-sm">{toast.message}</p>
            <button
              onClick={hideToast}
              className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
