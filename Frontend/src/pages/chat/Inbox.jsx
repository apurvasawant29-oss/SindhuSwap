import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSend,
  FiPaperclip,
  FiSmile,
  FiSearch,
  FiPhone,
  FiVideo,
  FiArrowLeft,
  FiMapPin,
  FiCheck,
  FiUser,
  FiPlus,
  FiImage,
  FiFileText,
  FiBookOpen,
} from "react-icons/fi";
import PageShell from "../../components/common/PageShell";

const INITIAL_CHATS = [
  {
    id: "Appu",
    name: "Appu",
    taluka: "Sawantwadi",
    isOnline: true,
    avatarColor: "from-teal-600 to-emerald-400",
    lastSeen: "Online",
    unreadCount: 1,
    messages: [
      { id: 1, sender: "them", text: "Hey! Is the Dell laptop still available?", time: "9:30 AM", isRead: true },
      { id: 2, sender: "me", text: "Yes Appu, it is still available. Excellent condition.", time: "9:32 AM", isRead: true },
      { id: 3, sender: "them", text: "Can we meet near Sawantwadi Lake today for a check?", time: "10:00 AM", isRead: false },
    ],
  },
  {
    id: "Shweta",
    name: "Shweta",
    taluka: "Kudal",
    isOnline: false,
    avatarColor: "from-amber-500 to-rose-400",
    lastSeen: "Last seen 2 hours ago",
    unreadCount: 0,
    messages: [
      { id: 1, sender: "them", text: "Hi, I saw your post for the study table.", time: "Yesterday", isRead: true },
      { id: 2, sender: "me", text: "Yes Shweta, let me know if you want to inspect it.", time: "Yesterday", isRead: true },
    ],
  },
  {
    id: "Priya",
    name: "Priya",
    taluka: "Kudal",
    isOnline: true,
    avatarColor: "from-teal-600 to-indigo-500",
    lastSeen: "Online",
    unreadCount: 0,
    messages: [
      { id: 1, sender: "me", text: "Hi Priya, interested in swapping Engineering Mathematics?", time: "2 days ago", isRead: true },
      { id: 2, sender: "them", text: "Yes! Which book do you want to swap it with?", time: "2 days ago", isRead: true },
    ],
  },
  {
    id: "Rohit",
    name: "Rohit",
    taluka: "Malvan",
    isOnline: false,
    avatarColor: "from-purple-600 to-pink-500",
    lastSeen: "Last seen yesterday",
    unreadCount: 0,
    messages: [
      { id: 1, sender: "them", text: "Awesome product, thanks for the deal!", time: "5 days ago", isRead: true },
    ],
  },
];

const EMOJIS = ["👍", "😊", "😂", "🤝", "📚", "🔥", "💯", "❤️"];

function Inbox() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const sellerParam = searchParams.get("seller");

  const [chats, setChats] = useState(INITIAL_CHATS);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [mobileView, setMobileView] = useState("list"); // 'list' or 'chat'

  const messageEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, selectedChatId, isTyping]);

  // Handle URL seller query parameter
  useEffect(() => {
    if (sellerParam) {
      const existingChat = chats.find((c) => c.name.toLowerCase() === sellerParam.toLowerCase());
      if (existingChat) {
        setSelectedChatId(existingChat.id);
        setMobileView("chat");
        // Clear unread
        setChats((prev) =>
          prev.map((c) => (c.id === existingChat.id ? { ...c, unreadCount: 0 } : c))
        );
      } else {
        // Create new mock chat
        const newChat = {
          id: sellerParam,
          name: sellerParam,
          taluka: "Sindhudurg",
          isOnline: true,
          avatarColor: "from-rose-500 to-amber-400",
          lastSeen: "Online",
          unreadCount: 0,
          messages: [
            { id: 1, sender: "them", text: `Hi! I'm interested in trading or buying. Let me know!`, time: "Just Now", isRead: false },
          ],
        };
        setChats((prev) => [newChat, ...prev]);
        setSelectedChatId(newChat.id);
        setMobileView("chat");
      }
    } else if (chats.length > 0 && !selectedChatId) {
      // Don't auto-select on mobile, but select first on desktop
      if (window.innerWidth >= 768) {
        setSelectedChatId(chats[0].id);
      }
    }
  }, [sellerParam]);

  const activeChat = chats.find((c) => c.id === selectedChatId);

  // Send message handler
  const handleSend = (textToSend = messageText) => {
    if (!textToSend.trim() || !selectedChatId) return;

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isRead: false,
    };

    // Update active chat's messages
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === selectedChatId) {
          return {
            ...c,
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    setMessageText("");
    setShowEmojis(false);
    setShowAttachments(false);

    // Simulate reply after 1.5s
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyMessage = {
        id: Date.now() + 1,
        sender: "them",
        text: `Got your message! Let's connect on this swap proposal soon. I'm usually available in the afternoon near the taluka center.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isRead: false,
      };

      setChats((prev) =>
        prev.map((c) => {
          if (c.id === selectedChatId) {
            return {
              ...c,
              messages: [...c.messages, replyMessage],
              unreadCount: mobileView === "list" ? c.unreadCount + 1 : 0,
            };
          }
          return c;
        })
      );
    }, 1800);
  };

  const handleSelectChat = (chat) => {
    setSelectedChatId(chat.id);
    setMobileView("chat");
    setSearchParams({ seller: chat.name });
    // Reset unread count
    setChats((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleBackToList = () => {
    setMobileView("list");
    setSearchParams({});
  };

  const filteredChats = chats.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.taluka.toLowerCase().includes(q) ||
      c.messages.some((m) => m.text.toLowerCase().includes(q))
    );
  });

  return (
    <PageShell>
      <div className="bg-slate-50/50 min-h-[calc(100vh-72px)] flex items-stretch">
        <div className="container max-w-6xl my-6 bg-white border border-slate-200/90 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row flex-1">
          
          {/* SIDEBAR - Recent Conversations */}
          <div className={`w-full md:w-[350px] border-r border-slate-100 flex-col ${
            mobileView === "chat" ? "hidden md:flex" : "flex"
          }`}>
            {/* Search Header */}
            <div className="p-4 border-b border-slate-100 space-y-3 shrink-0">
              <h1 className="text-xl font-bold text-slate-800">Messages</h1>
              <div className="relative flex items-center h-10 w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-50 transition-all duration-200">
                <FiSearch className="text-slate-400 mr-2 h-4 w-4 shrink-0" />
                <input
                  type="text"
                  placeholder="Search chats or messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full border-0 outline-0 text-xs text-slate-700 bg-transparent"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50 p-2 space-y-1">
              {filteredChats.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  <FiMessageCircle className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                  <span>No conversations found</span>
                </div>
              ) : (
                filteredChats.map((chat) => {
                  const lastMsg = chat.messages[chat.messages.length - 1];
                  const isSelected = chat.id === selectedChatId;
                  
                  return (
                    <div
                      key={chat.id}
                      onClick={() => handleSelectChat(chat)}
                      className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "bg-teal-55/70 shadow-sm"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${chat.avatarColor} text-white flex items-center justify-center text-sm font-extrabold shadow-sm`}>
                          {chat.name.charAt(0).toUpperCase()}
                        </div>
                        {chat.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xs.5 font-bold text-slate-800 truncate">
                            {chat.name}
                          </h2>
                          <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                            {lastMsg ? lastMsg.time : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-500 font-semibold">
                          <FiMapPin className="h-3 w-3 text-teal-600 shrink-0" />
                          <span className="truncate">{chat.taluka}</span>
                        </div>
                        <p className={`text-xs mt-1.5 truncate ${
                          chat.unreadCount > 0 ? "font-bold text-slate-800" : "text-slate-500"
                        }`}>
                          {lastMsg ? (lastMsg.sender === "me" ? "You: " : "") + lastMsg.text : "No messages yet"}
                        </p>
                      </div>

                      {/* Badges */}
                      {chat.unreadCount > 0 && (
                        <div className="flex flex-col justify-center shrink-0">
                          <span className="flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
                            {chat.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* CHAT PANE - Selected Conversation */}
          <div className={`flex-1 flex flex-col bg-slate-50/40 relative ${
            mobileView === "list" && !activeChat ? "hidden md:flex" : "flex"
          }`}>
            {activeChat ? (
              <>
                {/* Header */}
                <div className="p-3.5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 shadow-sm z-10">
                  <div className="flex items-center gap-3">
                    {/* Mobile Back Button */}
                    <button
                      onClick={handleBackToList}
                      className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                      aria-label="Back to chat list"
                    >
                      <FiArrowLeft className="h-5 w-5" />
                    </button>

                    {/* Partner Avatar */}
                    <div className="relative shrink-0">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeChat.avatarColor} text-white flex items-center justify-center text-sm font-extrabold shadow-sm`}>
                        {activeChat.name.charAt(0).toUpperCase()}
                      </div>
                      {activeChat.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                      )}
                    </div>

                    {/* Title Details */}
                    <div>
                      <h2 className="text-sm font-bold text-slate-800 leading-tight">
                        {activeChat.name}
                      </h2>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                        {activeChat.isOnline ? "Online" : activeChat.lastSeen}
                      </span>
                    </div>
                  </div>

                  {/* Placeholders for Video/Voice Calls */}
                  <div className="flex items-center gap-2 text-slate-400">
                    <button
                      onClick={() => toast.info("Voice call connecting placeholder...")}
                      className="p-2 rounded-lg hover:bg-slate-50 hover:text-slate-600 transition-colors"
                      aria-label="Voice call"
                    >
                      <FiPhone className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => toast.info("Video call starting placeholder...")}
                      className="p-2 rounded-lg hover:bg-slate-50 hover:text-slate-600 transition-colors"
                      aria-label="Video call"
                    >
                      <FiVideo className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                  {activeChat.messages.map((msg, index) => {
                    const isMe = msg.sender === "me";
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs.5 leading-relaxed shadow-[0_2px_8px_rgba(15,23,42,0.02)] relative ${
                          isMe
                            ? "bg-teal-700 text-white rounded-tr-none shadow-teal-700/5"
                            : "bg-white text-slate-800 border border-slate-200/60 rounded-tl-none"
                        }`}>
                          <p>{msg.text}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                            isMe ? "text-teal-200/90" : "text-slate-400 font-semibold"
                          }`}>
                            <span>{msg.time}</span>
                            {isMe && (
                              <span>
                                {msg.isRead ? (
                                  <span className="flex text-emerald-300"><FiCheck className="h-3 w-3 -mr-1" /><FiCheck className="h-3 w-3" /></span>
                                ) : (
                                  <FiCheck className="h-3 w-3" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white border border-slate-200/60 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </motion.div>
                  )}

                  <div ref={messageEndRef} />
                </div>

                {/* Composer (Form Input) */}
                <div className="p-3 bg-white border-t border-slate-100 shrink-0 relative">
                  
                  {/* Emoji Popover */}
                  <AnimatePresence>
                    {showEmojis && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="absolute bottom-full left-4 mb-2 bg-white rounded-xl border border-slate-200 shadow-xl p-2.5 flex items-center gap-2 z-25"
                      >
                        {EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => {
                              setMessageText((p) => p + emoji);
                              setShowEmojis(false);
                            }}
                            className="text-lg hover:scale-120 active:scale-95 transition-transform"
                          >
                            {emoji}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Attachments Menu */}
                  <AnimatePresence>
                    {showAttachments && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="absolute bottom-full left-12 mb-2 bg-white rounded-xl border border-slate-200 shadow-xl p-2 flex flex-col gap-1 w-44 z-25"
                      >
                        {[
                          { icon: <FiImage className="text-emerald-500" />, label: "Photo / Video" },
                          { icon: <FiFileText className="text-blue-500" />, label: "Document" },
                          { icon: <FiBookOpen className="text-amber-500" />, label: "Product Listing" },
                        ].map((item) => (
                          <button
                            key={item.label}
                            onClick={() => {
                              toast.info(`Mock attached: ${item.label}`);
                              setShowAttachments(false);
                              handleSend(`[Attached ${item.label}]`);
                            }}
                            className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 rounded-lg text-left transition-colors"
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Input Box */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex items-center gap-2"
                  >
                    {/* Emojis Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowEmojis((p) => !p);
                        setShowAttachments(false);
                      }}
                      className={`p-2 rounded-xl transition-colors shrink-0 ${
                        showEmojis ? "bg-teal-50 text-teal-600" : "text-slate-400 hover:text-slate-600"
                      }`}
                      aria-label="Add emoji"
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
                      className={`p-2 rounded-xl transition-colors shrink-0 ${
                        showAttachments ? "bg-teal-50 text-teal-600" : "text-slate-400 hover:text-slate-600"
                      }`}
                      aria-label="Attach file"
                    >
                      <FiPaperclip className="h-5 w-5" />
                    </button>

                    {/* Main input */}
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message, suggest swap, or details..."
                      className="flex-1 min-w-0 h-10 bg-slate-50 border border-slate-200/80 rounded-xl px-4 text-xs.5 outline-0 text-slate-800 placeholder-slate-450 focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500/10 transition-all duration-200"
                    />

                    {/* Send button */}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: messageText.trim() ? 1.05 : 1 }}
                      whileTap={{ scale: messageText.trim() ? 0.95 : 1 }}
                      className={`h-10 w-10 flex items-center justify-center rounded-xl text-white shadow-md transition-all shrink-0 ${
                        messageText.trim()
                          ? "bg-teal-600 shadow-teal-600/15 hover:bg-teal-700"
                          : "bg-slate-300 shadow-none cursor-default"
                      }`}
                      disabled={!messageText.trim()}
                      aria-label="Send message"
                    >
                      <FiSend className="h-4.5 w-4.5" />
                    </motion.button>
                  </form>
                </div>
              </>
            ) : (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/10">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-inner mb-4">
                  <FiMessageCircle className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-slate-700">Select a Conversation</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                  Choose a chat from the recent conversations list to start negotiating swaps, deals, or meeting details.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </PageShell>
  );
}

export default Inbox;
