import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import MessageBubble from "./MessageBubble";

function ChatMessages({ messages, isTyping, onImageClick }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50/30 p-4">
      {messages.map((message, index) => {
        const previous = messages[index - 1];
        const showDate = !previous || previous.dateGroup !== message.dateGroup;
        const isConsecutive = previous?.sender === message.sender && !showDate;

        return (
          <div key={message.id}>
            {showDate && (
              <div className="my-3 flex justify-center">
                <span className="rounded-full border border-slate-200/70 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 shadow-sm">
                  {message.dateGroup}
                </span>
              </div>
            )}
            <MessageBubble
              message={message}
              isMe={message.sender === "me"}
              isConsecutive={isConsecutive}
              onImageClick={onImageClick}
            />
          </div>
        );
      })}

      {isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start"
        >
          <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-none border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:140ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:280ms]" />
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default ChatMessages;
