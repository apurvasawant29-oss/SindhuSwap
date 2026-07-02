import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSend,
  FiPaperclip,
  FiSmile,
  FiImage,
  FiFileText,
  FiMapPin,
  FiMic
} from "react-icons/fi";
import { toast } from "react-toastify";

const EMOJIS = ["👍", "😊", "😂", "🤝", "📚", "🔥", "💯", "❤️"];

function ChatInput({ onSendMessage }) {
  const [text, setText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const attachmentRef = useRef(null);
  const emojiRef = useRef(null);

  // Click outside listener for popups
  useEffect(() => {
    function handleClickOutside(event) {
      if (attachmentRef.current && !attachmentRef.current.contains(event.target)) {
        setShowAttachments(false);
      }
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojis(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text.trim(), "text");
    setText("");
    setShowEmojis(false);
    setShowAttachments(false);
  };

  const handleEmojiClick = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmojis(false);
  };

  const handleSendImage = () => {
    setShowAttachments(false);
    // Send a mock product or book image
    const randomId = Math.floor(Math.random() * 100) + 1;
    const mediaUrl = `https://picsum.photos/seed/swap${randomId}/400/300`;
    onSendMessage("Sent a photo", "image", mediaUrl);
  };

  const handleSendLocation = () => {
    setShowAttachments(false);
    const locations = ["Sindhudurg College", "Sawantwadi Lake", "Kudal Bus Stand", "Malvan Beach"];
    const loc = locations[Math.floor(Math.random() * locations.length)];
    onSendMessage(`Shared location: ${loc}`, "location", null, loc);
  };

  const handleSendDocument = () => {
    setShowAttachments(false);
    onSendMessage("Attachment: Study_Notes.pdf (2.4 MB)", "text");
  };

  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.info("Recording voice message... Click again to send.");
    } else {
      setIsRecording(false);
      onSendMessage("🎙️ Voice Message (0:04)", "text");
      toast.success("Voice message sent!");
    }
  };

  return (
    <div className="p-3 bg-white border-t border-slate-100 shrink-0 relative z-20">
      {/* Emoji Picker Popover */}
      <AnimatePresence>
        {showEmojis && (
          <motion.div
            ref={emojiRef}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="absolute bottom-full left-4 mb-2 bg-white rounded-xl border border-slate-200/90 shadow-xl p-2.5 flex items-center gap-2 z-30"
          >
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleEmojiClick(emoji)}
                className="text-lg hover:scale-120 active:scale-95 transition-transform cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachment Dropdown */}
      <AnimatePresence>
        {showAttachments && (
          <motion.div
            ref={attachmentRef}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="absolute bottom-full left-12 mb-2 bg-white rounded-xl border border-slate-200/90 shadow-xl p-2 flex flex-col gap-1 w-44 z-30"
          >
            <button
              type="button"
              onClick={handleSendImage}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-650 hover:bg-slate-50 rounded-lg text-left cursor-pointer transition-colors"
            >
              <FiImage className="text-emerald-500 h-4 w-4 shrink-0" />
              <span>Photo / Image</span>
            </button>
            <button
              type="button"
              onClick={handleSendDocument}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-650 hover:bg-slate-50 rounded-lg text-left cursor-pointer transition-colors"
            >
              <FiFileText className="text-blue-500 h-4 w-4 shrink-0" />
              <span>Document File</span>
            </button>
            <button
              type="button"
              onClick={handleSendLocation}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-650 hover:bg-slate-50 rounded-lg text-left cursor-pointer transition-colors"
            >
              <FiMapPin className="text-rose-500 h-4 w-4 shrink-0" />
              <span>Share Location</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Composer Row */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => {
            setShowEmojis((p) => !p);
            setShowAttachments(false);
          }}
          className={`p-2 rounded-xl transition-colors shrink-0 cursor-pointer ${
            showEmojis ? "bg-emerald-50 text-emerald-600" : "text-slate-400 hover:text-slate-650"
          }`}
          aria-label="Toggle emoji picker"
        >
          <FiSmile className="h-5 w-5" />
        </button>

        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => {
            setShowAttachments((p) => !p);
            setShowEmojis(false);
          }}
          className={`p-2 rounded-xl transition-colors shrink-0 cursor-pointer ${
            showAttachments ? "bg-emerald-50 text-emerald-600" : "text-slate-400 hover:text-slate-650"
          }`}
          aria-label="Toggle attachment menu"
        >
          <FiPaperclip className="h-5 w-5" />
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message, suggest swap, or details..."
          className="flex-1 min-w-0 h-10 bg-slate-50 border border-slate-200/80 rounded-xl px-4 text-xs.5 outline-0 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/10 transition-all duration-200"
        />

        {/* Voice Message & Send buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!text.trim() ? (
            <button
              type="button"
              onClick={handleVoiceRecord}
              className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                isRecording
                  ? "bg-rose-500 text-white animate-pulse"
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-650 border border-slate-200/40"
              }`}
              title="Record voice note"
            >
              <FiMic className="h-4.5 w-4.5" />
            </button>
          ) : (
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/15 hover:shadow-emerald-600/25 transition-all cursor-pointer"
              aria-label="Send message"
            >
              <FiSend className="h-4.5 w-4.5" />
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ChatInput;
