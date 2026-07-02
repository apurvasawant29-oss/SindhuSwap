import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowLeft,
  FiBookOpen,
  FiMoreVertical,
  FiPhone,
  FiSlash,
  FiTrash2,
  FiVideo,
} from "react-icons/fi";

function ChatHeader({ activeChat, onBack, onInitiateCall, onClearChat, onBlockUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const closeMenu = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-100 bg-white p-3.5 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 md:hidden"
          aria-label="Back to conversations"
        >
          <FiArrowLeft className="h-5 w-5" />
        </button>

        <div className="relative shrink-0">
          {activeChat.avatar ? (
            <img
              src={activeChat.avatar}
              alt={activeChat.name}
              className="h-11 w-11 rounded-xl border border-slate-100 object-cover shadow-sm"
            />
          ) : (
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-500 text-sm font-extrabold text-white shadow-sm">
              {activeChat.name.charAt(0)}
            </div>
          )}
          {activeChat.isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          )}
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-slate-900">{activeChat.name}</h2>
          <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <span className={activeChat.isOnline ? "text-emerald-600" : ""}>
              {activeChat.isOnline ? "Online" : activeChat.lastSeen}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex min-w-0 items-center gap-1 text-teal-700">
              <FiBookOpen className="h-3 w-3 shrink-0" />
              <span className="truncate">{activeChat.productName}</span>
            </span>
            <span className="hidden rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 sm:inline">
              Swap Requested
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex shrink-0 items-center gap-1 text-slate-400" ref={menuRef}>
        <button
          type="button"
          onClick={() => onInitiateCall("voice")}
          className="rounded-xl p-2 transition hover:bg-slate-50 hover:text-slate-700"
          aria-label="Voice call"
          title="Voice call"
        >
          <FiPhone className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          onClick={() => onInitiateCall("video")}
          className="rounded-xl p-2 transition hover:bg-slate-50 hover:text-slate-700"
          aria-label="Video call"
          title="Video call"
        >
          <FiVideo className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="rounded-xl p-2 transition hover:bg-slate-50 hover:text-slate-700"
          aria-label="More options"
          title="More options"
        >
          <FiMoreVertical className="h-[18px] w-[18px]" />
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              className="absolute right-0 top-11 z-30 w-44 rounded-xl border border-slate-200 bg-white p-1.5 text-slate-600 shadow-xl"
            >
              <button
                type="button"
                onClick={() => {
                  onClearChat();
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold transition hover:bg-slate-50"
              >
                <FiTrash2 className="h-3.5 w-3.5 text-slate-400" />
                Clear chat
              </button>
              <button
                type="button"
                onClick={() => {
                  onBlockUser();
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                <FiSlash className="h-3.5 w-3.5" />
                Block user
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default ChatHeader;
