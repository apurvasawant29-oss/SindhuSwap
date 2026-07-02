import { motion } from "framer-motion";

const QUICK_REPLIES = [
  "Is this available?",
  "I can swap tomorrow.",
  "Can you share more photos?",
  "Let's meet on campus.",
];

function QuickReplies({ onSendQuickReply }) {
  return (
    <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-slate-100 bg-white px-4 py-2">
      {QUICK_REPLIES.map((reply) => (
        <motion.button
          key={reply}
          type="button"
          onClick={() => onSendQuickReply(reply)}
          whileTap={{ scale: 0.97 }}
          className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
        >
          {reply}
        </motion.button>
      ))}
    </div>
  );
}

export default QuickReplies;
