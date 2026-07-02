import { motion } from "framer-motion";
import { FiCheck, FiMapPin, FiDownload } from "react-icons/fi";

function MessageBubble({ message, isMe, isConsecutive, onImageClick }) {
  const { text, time, isRead, type, mediaUrl, locationName } = message;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isMe ? "justify-end" : "justify-start"} ${
        isConsecutive ? "-mt-2" : "mt-0"
      }`}
    >
      <div
        className={`max-w-[70%] sm:max-w-[60%] rounded-2xl px-3.5 py-2 text-xs.5 leading-relaxed shadow-[0_1.5px_4px_rgba(15,23,42,0.01)] relative ${
          isMe
            ? `bg-emerald-600 text-white border border-emerald-650 ${
                isConsecutive ? "rounded-tr-2xl" : "rounded-tr-none"
              }`
            : `bg-white text-slate-800 border border-slate-200/60 ${
                isConsecutive ? "rounded-tl-2xl" : "rounded-tl-none"
              }`
        }`}
      >
        {/* Render Image Message */}
        {type === "image" && mediaUrl && (
          <div className="mb-1.5 rounded-xl overflow-hidden cursor-zoom-in relative group max-w-[240px] border border-slate-100 bg-slate-50">
            <img
              src={mediaUrl}
              alt="Media Attachment"
              className="w-full h-auto object-cover max-h-[160px] group-hover:scale-103 transition-transform duration-300"
              onClick={() => onImageClick(mediaUrl)}
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="p-1.5 rounded-full bg-white/95 text-slate-800 shadow-md">
                <FiDownload className="h-4 w-4" />
              </span>
            </div>
          </div>
        )}

        {/* Render Location Message */}
        {type === "location" && (
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(locationName || "Sawantwadi Lake")}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col gap-2 p-1 rounded-xl mb-1 border hover:scale-[1.01] transition-transform ${
              isMe ? "bg-emerald-750/40 border-emerald-500/20 text-white" : "bg-slate-50 border-slate-100 text-slate-800"
            }`}
          >
            <div className="h-24 w-full bg-sky-100 rounded-lg relative overflow-hidden flex items-center justify-center shrink-0">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:12px_12px]" />
              <FiMapPin className="h-8 w-8 text-rose-500 animate-bounce relative z-10" />
            </div>
            <div className="px-1.5 py-0.5 flex items-center gap-1.5 text-[11px] font-bold">
              <FiMapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{locationName || "Map Location"}</span>
            </div>
          </a>
        )}

        {/* Render Text */}
        {text && <p className="whitespace-pre-wrap breakdown-word">{text}</p>}

        {/* Info Area (Timestamp + Checkmarks) */}
        <div
          className={`flex items-center justify-end gap-1 mt-1 text-[9px] select-none ${
            isMe ? "text-emerald-100/90" : "text-slate-400 font-semibold"
          }`}
        >
          <span>{time}</span>
          {isMe && (
            <span>
              {isRead ? (
                <span className="flex text-emerald-250 font-black">
                  <FiCheck className="h-3.5 w-3.5 -mr-1.5" />
                  <FiCheck className="h-3.5 w-3.5" />
                </span>
              ) : (
                <FiCheck className="h-3.5 w-3.5 text-emerald-100/60" />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default MessageBubble;
