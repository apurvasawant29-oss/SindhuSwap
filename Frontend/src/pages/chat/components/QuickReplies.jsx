import { motion } from "framer-motion";

const QUICK_REPLIES = [
  "Is this available?",
  "I can swap tomorrow.",
  "Can you share more photos?",
  "Let's meet on campus."
];

function QuickReplies({ onSendQuickReply }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 bg-white border-t border-slate-100 scrollbar-none shrink-0">
      {QUICK_REPLIES.map((text) => (
        <motion.button
          key={text}
          whileHover={{ scale: 1.02, backgroundColor: "#f0fdf4" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSendQuickReply(text)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200/60 hover:border-emerald-250 text-slate-650 hover:text-emerald-700 text-xs font-semibold rounded-full whitespace-nowrap transition-colors duration-250 cursor-pointer"
        >
          {text}
        </motion.button>
      ))}
    </div>
  );
}

export default QuickReplies;
