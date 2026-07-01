import { motion, AnimatePresence } from "framer-motion";
import { FiAlertOctagon, FiInfo, FiTrash2, FiX } from "react-icons/fi";

const typeConfig = {
  danger: {
    icon: FiTrash2,
    iconColor: "text-red-600 bg-red-50 border-red-100",
    buttonBg: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    colorTheme: "red"
  },
  warning: {
    icon: FiAlertOctagon,
    iconColor: "text-amber-600 bg-amber-50 border-amber-100",
    buttonBg: "bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500",
    colorTheme: "amber"
  },
  info: {
    icon: FiInfo,
    iconColor: "text-blue-600 bg-blue-50 border-blue-100",
    buttonBg: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    colorTheme: "blue"
  }
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  isLoading = false
}) {
  const config = typeConfig[type] || typeConfig.warning;
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900"
          />

          {/* Modal box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", damping: 20, stiffness: 260 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 overflow-hidden relative z-10"
          >
            {/* Header close button */}
            <button
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <FiX className="text-base" />
            </button>

            {/* Content Details */}
            <div className="flex gap-4">
              <div className={`p-3 rounded-xl border shrink-0 h-11 w-11 flex items-center justify-center ${config.iconColor}`}>
                <Icon className="text-xl" />
              </div>
              
              <div className="flex-1 space-y-1.5">
                <h3 className="text-base font-bold text-slate-800 tracking-tight leading-normal">
                  {title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            {/* Buttons bottom panel */}
            <div className="flex items-center justify-end gap-3 mt-6 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 text-xs font-semibold select-none cursor-pointer transition-colors"
              >
                {cancelText}
              </button>
              
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 select-none shadow-sm ${config.buttonBg}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
