import { motion } from "framer-motion";

function ConversationCard({ chat, isSelected, onClick }) {
  const lastMessage = chat.messages.at(-1);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1 }}
      className={`flex w-full min-w-0 items-start gap-3 overflow-hidden rounded-xl border p-3 text-left transition-all duration-200 ${
        isSelected
          ? "border-teal-100 bg-teal-50/80"
          : "border-transparent hover:bg-slate-50"
      }`}
    >
      <div className="relative mt-0.5 shrink-0">
        {chat.avatar ? (
          <img
            src={chat.avatar}
            alt={chat.name}
            className="h-11 w-11 rounded-xl border border-slate-100 object-cover shadow-sm"
          />
        ) : (
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-500 text-sm font-extrabold text-white shadow-sm">
            {chat.name.charAt(0)}
          </div>
        )}
        {chat.isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <h2 className="min-w-0 truncate text-sm font-bold text-slate-800">{chat.name}</h2>
          <span className="shrink-0 text-[10px] font-semibold text-slate-400">
            {lastMessage?.time}
          </span>
        </div>

        <div className="mt-1 flex min-w-0 items-center gap-2">
          <img
            src={chat.productImage}
            alt={chat.productName}
            className="h-7 w-7 shrink-0 rounded-lg border border-slate-100 object-cover"
          />
          <span className="truncate text-[11px] font-bold text-teal-700">
            {chat.productName}
          </span>
        </div>

        <p
          className={`mt-1.5 truncate text-xs leading-relaxed ${
            chat.unreadCount > 0 ? "font-bold text-slate-900" : "text-slate-500"
          }`}
        >
          {lastMessage?.sender === "me" ? "You: " : ""}
          {lastMessage?.text || "No messages yet"}
        </p>
      </div>

      {chat.unreadCount > 0 && (
        <span className="mt-8 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm shadow-rose-500/20">
          {chat.unreadCount}
        </span>
      )}
    </motion.button>
  );
}

export default ConversationCard;
