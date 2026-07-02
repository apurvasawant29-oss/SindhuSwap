import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowLeft,
  FiPhone,
  FiVideo,
  FiMoreVertical,
  FiVolume2,
  FiVolumeX,
  FiTrash2,
  FiSlash,
  FiBookOpen
} from "react-icons/fi";

function ChatHeader({
  activeChat,
  onBack,
  onInitiateCall,
  onClearChat,
  onToggleMute,
  onBlockUser
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!activeChat) return null;

  return (
    <div className="p-3.5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 shadow-sm z-30">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back Button */}
        <button
          onClick={onBack}
          className="md:hidden p-1.5 rounded-lg hover:bg-slate-50 text-slate-650 transition-colors cursor-pointer shrink-0"
          aria-label="Back to chat list"
        >
          <FiArrowLeft className="h-5 w-5" />
        </button>

        {/* User Profile Avatar */}
        <div className="relative shrink-0 select-none">
          {activeChat.avatar ? (
            <img
              src={activeChat.avatar}
              alt={activeChat.name}
              className="w-10 h-10 rounded-xl object-cover shadow-sm border border-slate-100"
            />
          ) : (
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeChat.avatarColor || "from-emerald-500 to-teal-400"} text-white flex items-center justify-center text-sm font-extrabold shadow-sm`}>
              {activeChat.name.charAt(0).toUpperCase()}
            </div>
          )}
          {activeChat.isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm animate-pulse" />
          )}
        </div>

        {/* Title Details */}
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-800 leading-tight truncate">
            {activeChat.name}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5 truncate">
            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
              {activeChat.isOnline ? "Online" : activeChat.lastSeen || "Offline"}
            </span>
            {activeChat.productName && (
              <>
                <span className="text-slate-300 text-[10px]">•</span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 truncate">
                  <FiBookOpen className="h-3 w-3 inline" />
                  {activeChat.productName}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Header Icons and Dropdown Menu */}
      <div className="flex items-center gap-1 text-slate-400 relative shrink-0" ref={menuRef}>
        <button
          onClick={() => onInitiateCall("voice")}
          className="p-2 rounded-xl hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer"
          title="Voice call"
        >
          <FiPhone className="h-4.5 w-4.5" />
        </button>
        <button
          onClick={() => onInitiateCall("video")}
          className="p-2 rounded-xl hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer"
          title="Video call"
        >
          <FiVideo className="h-4.5 w-4.5" />
        </button>

        <button
          onClick={() => setShowMenu((p) => !p)}
          className="p-2 rounded-xl hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer"
          title="More options"
        >
          <FiMoreVertical className="h-4.5 w-4.5" />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-11 w-44 bg-white border border-slate-200 shadow-xl rounded-xl p-1.5 z-40"
            >
              <button
                onClick={() => {
                  onToggleMute();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg text-left cursor-pointer transition-colors"
              >
                {activeChat.isMuted ? (
                  <>
                    <FiVolume2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>Unmute Notifications</span>
                  </>
                ) : (
                  <>
                    <FiVolumeX className="h-3.5 w-3.5 text-slate-400" />
                    <span>Mute Notifications</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  onClearChat();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg text-left cursor-pointer transition-colors"
              >
                <FiTrash2 className="h-3.5 w-3.5 text-slate-400" />
                <span>Clear Chat History</span>
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={() => {
                  onBlockUser();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg text-left cursor-pointer transition-colors"
              >
                <FiSlash className="h-3.5 w-3.5 text-rose-500" />
                <span>Block {activeChat.name}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ChatHeader;
