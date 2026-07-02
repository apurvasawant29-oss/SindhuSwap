import { motion } from "framer-motion";
import { FiBookOpen } from "react-icons/fi";

function ConversationCard({ chat, isSelected, onClick }) {
  const lastMsg = chat.messages[chat.messages.length - 1];

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent select-none ${
        isSelected
          ? "bg-emerald-50/60 border-emerald-100/70"
          : "hover:bg-slate-50"
      }`}
    >
      {/* User Avatar + Online Status */}
      <div className="relative shrink-0 mt-0.5 select-none">
        {chat.avatar ? (
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-11 h-11 rounded-xl object-cover shadow-sm border border-slate-100"
          />
        ) : (
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${chat.avatarColor || "from-emerald-500 to-teal-400"} text-white flex items-center justify-center text-sm font-extrabold shadow-sm`}>
            {chat.name.charAt(0).toUpperCase()}
          </div>
        )}
        {chat.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm animate-pulse" />
        )}
      </div>

      {/* Details (Middle Column) */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xs.5 font-bold text-slate-800 truncate leading-snug">
            {chat.name}
          </h2>
          <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap ml-2 shrink-0">
            {lastMsg ? lastMsg.time : ""}
          </span>
        </div>

        {/* Product Discussed line */}
        <div className="flex items-center gap-1 mt-0.5 text-[10px] text-emerald-700 font-bold leading-normal truncate">
          <FiBookOpen className="h-3 w-3 shrink-0" />
          <span className="truncate">{chat.productName}</span>
        </div>

        {/* Last Message text */}
        <p className={`text-xs mt-1.5 truncate leading-relaxed ${
          chat.unreadCount > 0 ? "font-bold text-slate-900" : "text-slate-500"
        }`}>
          {lastMsg ? (lastMsg.sender === "me" ? "You: " : "") + lastMsg.text : "No messages yet"}
        </p>
      </div>

      {/* Right Column: Thumbnail + Unread Badge */}
      <div className="flex flex-col items-end gap-2 shrink-0 self-stretch justify-between">
        {/* Product Thumbnail image */}
        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-center">
          {chat.productImage ? (
            <img
              src={chat.productImage}
              alt={chat.productName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <span className="text-xs">📚</span>
          )}
        </div>

        {/* Unread badge */}
        {chat.unreadCount > 0 ? (
          <span className="flex h-4.5 min-w-4.5 px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm shadow-rose-500/10 animate-bounce">
            {chat.unreadCount}
          </span>
        ) : (
          <div className="h-4.5" />
        )}
      </div>
    </motion.div>
  );
}

export default ConversationCard;
