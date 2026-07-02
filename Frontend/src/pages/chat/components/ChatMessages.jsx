import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import MessageBubble from "./MessageBubble";

function ChatMessages({ messages, isTyping, onImageClick }) {
  const scrollRef = useRef(null);

  // Auto-scroll on mount, change in messages, or typing status
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/20"
      style={{ scrollbarWidth: "thin" }}
    >
      {messages.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs">
          <span>No messages yet. Start the conversation!</span>
        </div>
      ) : (
        messages.map((msg, index) => {
          const isMe = msg.sender === "me";
          const prevMsg = index > 0 ? messages[index - 1] : null;
          
          // Show date divider if it is the first message or if the dateGroup changed
          const showDateDivider = !prevMsg || prevMsg.dateGroup !== msg.dateGroup;
          
          // Group consecutive messages from the same sender (within a short window)
          const isConsecutive = prevMsg && prevMsg.sender === msg.sender && !showDateDivider;

          return (
            <div key={msg.id || index} className="flex flex-col">
              {showDateDivider && msg.dateGroup && (
                <div className="flex justify-center my-3 shrink-0">
                  <span className="px-3 py-1 bg-slate-100 text-slate-400 border border-slate-200/40 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {msg.dateGroup}
                  </span>
                </div>
              )}
              <MessageBubble
                message={msg}
                isMe={isMe}
                isConsecutive={isConsecutive}
                onImageClick={onImageClick}
              />
            </div>
          );
        })
      )}

      {/* Typing indicator */}
      {isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start shrink-0 mt-2"
        >
          <div className="bg-white border border-slate-200/50 rounded-2xl rounded-tl-none px-3.5 py-2.5 flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default ChatMessages;
