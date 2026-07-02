import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiFileText, FiImage, FiMapPin, FiMic, FiPaperclip, FiSend, FiSmile } from "react-icons/fi";
import bookImage from "../../../assets/Books/atomic.jpg";

const EMOJIS = ["👍", "😊", "🤝", "📚", "✨", "✅"];

function ChatInput({ onSendMessage }) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttachment, setShowAttachment] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const closePopovers = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowEmoji(false);
        setShowAttachment(false);
      }
    };

    document.addEventListener("mousedown", closePopovers);
    return () => document.removeEventListener("mousedown", closePopovers);
  }, []);

  const submitMessage = (event) => {
    event.preventDefault();
    if (!text.trim()) return;

    onSendMessage(text.trim());
    setText("");
    setShowEmoji(false);
    setShowAttachment(false);
  };

  const sendAttachment = (label, type, mediaUrl = null, locationName = null) => {
    onSendMessage(label, type, mediaUrl, locationName);
    setShowAttachment(false);
  };

  return (
    <div className="relative shrink-0 border-t border-slate-100 bg-white p-3" ref={popoverRef}>
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-4 mb-2 flex gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl"
          >
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setText((current) => `${current}${emoji}`);
                  setShowEmoji(false);
                }}
                className="rounded-lg px-1 text-lg transition hover:bg-slate-50"
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAttachment && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-12 mb-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
          >
            <AttachmentAction
              icon={<FiImage className="h-4 w-4 text-emerald-500" />}
              label="Photo / Book Image"
              onClick={() => sendAttachment("Sent a book photo", "image", bookImage)}
            />
            <AttachmentAction
              icon={<FiFileText className="h-4 w-4 text-sky-500" />}
              label="Product Details"
              onClick={() => sendAttachment("Attached product details", "text")}
            />
            <AttachmentAction
              icon={<FiMapPin className="h-4 w-4 text-rose-500" />}
              label="Location"
              onClick={() => sendAttachment("Shared location", "location", null, "Sindhudurg College")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={submitMessage} className="flex items-center gap-2">
        <IconButton
          active={showAttachment}
          label="Attach file"
          onClick={() => {
            setShowAttachment((open) => !open);
            setShowEmoji(false);
          }}
        >
          <FiPaperclip className="h-5 w-5" />
        </IconButton>
        <IconButton
          active={showEmoji}
          label="Add emoji"
          onClick={() => {
            setShowEmoji((open) => !open);
            setShowAttachment(false);
          }}
        >
          <FiSmile className="h-5 w-5" />
        </IconButton>

        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Type a message..."
          className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200/80 bg-slate-50 px-4 text-sm text-slate-800 outline-0 transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-50"
        />

        {!text.trim() ? (
          <button
            type="button"
            onClick={() => {
              if (isRecording) {
                onSendMessage("Voice message (0:04)");
              }
              setIsRecording((recording) => !recording);
            }}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition ${
              isRecording
                ? "border-rose-400 bg-rose-500 text-white"
                : "border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-600"
            }`}
            aria-label="Record voice message"
          >
            <FiMic className="h-5 w-5" />
          </button>
        ) : (
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-600 text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700"
            aria-label="Send message"
          >
            <FiSend className="h-5 w-5" />
          </motion.button>
        )}
      </form>
    </div>
  );
}

function IconButton({ active, label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition ${
        active ? "bg-teal-50 text-teal-600" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
      }`}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

function AttachmentAction({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
    >
      {icon}
      {label}
    </button>
  );
}

export default ChatInput;
