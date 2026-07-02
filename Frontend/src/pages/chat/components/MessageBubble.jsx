import { motion } from "framer-motion";
import { FiCheck, FiMapPin } from "react-icons/fi";

function MessageBubble({ message, isMe, isConsecutive, onImageClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18 }}
      className={`flex ${isMe ? "justify-end" : "justify-start"} ${
        isConsecutive ? "-mt-2" : ""
      }`}
    >
      <div
        className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm sm:max-w-[68%] ${
          isMe
            ? `bg-teal-700 text-white ${isConsecutive ? "rounded-tr-2xl" : "rounded-tr-none"}`
            : `border border-slate-200/80 bg-white text-slate-800 ${isConsecutive ? "rounded-tl-2xl" : "rounded-tl-none"}`
        }`}
      >
        {message.type === "image" && message.mediaUrl && (
          <button
            type="button"
            onClick={() => onImageClick(message.mediaUrl)}
            className="mb-2 block overflow-hidden rounded-xl border border-white/20 bg-slate-100"
          >
            <img
              src={message.mediaUrl}
              alt="Shared attachment"
              className="max-h-56 w-64 object-cover transition duration-300 hover:scale-105"
            />
          </button>
        )}

        {message.type === "location" && (
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(message.locationName || "Sindhudurg")}`}
            target="_blank"
            rel="noreferrer"
            className={`mb-2 flex items-center gap-2 rounded-xl border p-2 text-xs font-bold ${
              isMe
                ? "border-teal-500/40 bg-teal-800/30 text-white"
                : "border-slate-200 bg-slate-50 text-slate-700"
            }`}
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-rose-50 text-rose-500">
              <FiMapPin className="h-4 w-4" />
            </span>
            {message.locationName || "Shared location"}
          </a>
        )}

        {message.text && <p className="break-words whitespace-pre-wrap">{message.text}</p>}

        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
            isMe ? "text-teal-100/90" : "font-semibold text-slate-400"
          }`}
        >
          <span>{message.time}</span>
          {isMe && (
            <span className="flex items-center">
              <FiCheck className="h-3.5 w-3.5" />
              {message.status === "read" && <FiCheck className="-ml-1.5 h-3.5 w-3.5" />}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default MessageBubble;
