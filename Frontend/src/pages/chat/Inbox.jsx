import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPhoneOff, FiSearch } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import appuAvatar from "../../assets/appu.png";
import shwetaAvatar from "../../assets/shweta.png";
import priyaAvatar from "../../assets/gauri.png";
import PageShell from "../../components/common/PageShell";
import ChatHeader from "./components/ChatHeader";
import ChatInput from "./components/ChatInput";
import ChatMessages from "./components/ChatMessages";
import ConversationCard from "./components/ConversationCard";
import EmptyChat from "./components/EmptyChat";
import ProductInfoCard from "./components/ProductInfoCard";
import QuickReplies from "./components/QuickReplies";

import { messageApi } from "../../api/messageApi";
import { useAuth } from "../../context/AuthContext";
import { getProductImageSrc } from "../../utils/productImage";

function Inbox() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileView, setMobileView] = useState("list");
  const [isTyping, setIsTyping] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const requestedConversationId = searchParams.get("conversationId");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await messageApi.getConversations();
        const apiConversations = res.data?.conversations || res.data?.contacts || [];
        const mapped = apiConversations.map(c => ({
          id: c.id || c._id,
          name: c.name,
          avatar: c.avatar || c.profileImage,
          isOnline: false,
          lastSeen: c.lastSeen || "Offline",
          unreadCount: c.unreadCount || c.unread || 0,
          productName: c.productName || c.product?.name || "Product Chat",
          productImage: getProductImageSrc(c.productImage || c.product),
          product: c.product,
          messages: []
        }));
        setConversations(mapped);
        if (mapped.length > 0) {
          setSelectedId(requestedConversationId || mapped[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch contacts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [requestedConversationId]);

  useEffect(() => {
    if (!selectedId) return;
    const fetchMessages = async () => {
      try {
        const res = await messageApi.getMessages(selectedId);
        const apiMsgs = res.data?.messages || [];
        const formattedMsgs = apiMsgs.map(m => ({
          id: m._id,
          sender: m.sender === "me" || m.senderId === user?._id || m.senderId === user?.id ? "me" : "them",
          text: m.content || m.text,
          type: "text",
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          dateGroup: new Date(m.createdAt).toLocaleDateString(),
          status: m.read ? "read" : "delivered"
        }));
        
        setConversations(prev => prev.map(chat => 
          chat.id === selectedId ? { ...chat, messages: formattedMsgs, unreadCount: 0 } : chat
        ));
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    fetchMessages();
  }, [selectedId, user]);

  const activeChat = conversations.find((chat) => chat.id === selectedId);

  const filteredConversations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return conversations;

    return conversations.filter((chat) =>
      [chat.name, chat.productName, chat.lastSeen]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [conversations, searchQuery]);

  useEffect(() => {
    if (activeCall?.status !== "ringing") return undefined;

    const timer = window.setTimeout(() => {
      setActiveCall((call) => (call ? { ...call, status: "connected" } : call));
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [activeCall?.id, activeCall?.status]);

  const selectConversation = (id) => {
    setSelectedId(id);
    if (window.innerWidth < 768) {
      setMobileView("chat");
    }
    setConversations((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, unreadCount: 0 } : chat))
    );
  };

  const updateProductStatus = (status) => {
    setConversations((prev) =>
      prev.map((chat) =>
        chat.id === selectedId
          ? { ...chat, product: { ...chat.product, swapStatus: status } }
          : chat
      )
    );
  };

  const sendMessage = async (text, type = "text", mediaUrl = null, locationName = null) => {
    if (!activeChat || !text.trim()) return;

    try {
      setIsTyping(true);
      const res = await messageApi.sendMessage({
        conversationId: activeChat.id,
        content: text
      });
      const newMsg = res.data?.message;
      if (!newMsg) return;

      const message = {
        id: newMsg._id,
        sender: "me",
        text: newMsg.content || newMsg.text,
        type,
        mediaUrl,
        locationName,
        dateGroup: new Date(newMsg.createdAt).toLocaleDateString(),
        time: new Date(newMsg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "delivered",
      };

      setConversations((prev) =>
        prev.map((chat) =>
          chat.id === activeChat.id
            ? { ...chat, messages: [...chat.messages, message], lastSeen: text }
            : chat
        )
      );
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setConversations((prev) =>
      prev.map((chat) => (chat.id === selectedId ? { ...chat, messages: [] } : chat))
    );
  };

  const blockUser = () => {
    const remaining = conversations.filter((chat) => chat.id !== selectedId);
    setConversations(remaining);
    setSelectedId(remaining[0]?.id ?? null);
    setMobileView("list");
  };

  return (
    <PageShell>
      <div className="min-h-screen bg-slate-50/50 py-6 sm:py-10">
        <div className="container max-w-6xl">
          <div className="w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/5">
            <div className="flex h-[calc(100vh-160px)] min-h-[640px] w-full min-w-0 flex-col md:flex-row">
              <aside
                className={`w-full shrink-0 overflow-hidden border-slate-100 bg-white md:flex md:w-[35%] lg:w-[30%] md:border-r ${
                  mobileView === "chat" ? "hidden" : "flex flex-col"
                }`}
              >
                <div className="border-b border-slate-100 p-4">
                  <h1 className="text-xl font-bold text-slate-900">Messages</h1>
                  <div className="mt-3 flex h-11 items-center rounded-xl border border-slate-200/80 bg-slate-50 px-3 transition-all duration-200 focus-within:border-teal-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-50">
                    <FiSearch className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search users..."
                      className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-sm text-slate-700 outline-0 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-2">
                  {filteredConversations.map((chat) => (
                    <ConversationCard
                      key={chat.id}
                      chat={chat}
                      isSelected={chat.id === selectedId}
                      onClick={() => selectConversation(chat.id)}
                    />
                  ))}
                </div>
              </aside>

              <section
                className={`min-w-0 flex-1 overflow-hidden flex-col bg-slate-50/45 ${
                  mobileView === "list" ? "hidden md:flex" : "flex"
                }`}
              >
                {activeChat ? (
                  <>
                    <ChatHeader
                      activeChat={activeChat}
                      onBack={() => setMobileView("list")}
                      onInitiateCall={(type) =>
                        setActiveCall({ id: Date.now(), type, chat: activeChat, status: "ringing" })
                      }
                      onClearChat={clearChat}
                      onBlockUser={blockUser}
                    />
                    <ProductInfoCard
                      product={activeChat.product}
                      onAcceptSwap={() => updateProductStatus("Accepted")}
                      onRejectSwap={() => updateProductStatus("Rejected")}
                    />
                    <ChatMessages
                      messages={activeChat.messages}
                      isTyping={isTyping}
                      onImageClick={setPreviewImage}
                    />
                    <QuickReplies onSendQuickReply={sendMessage} />
                    <ChatInput onSendMessage={sendMessage} />
                  </>
                ) : (
                  <EmptyChat />
                )}
              </section>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {previewImage && (
          <motion.button
            type="button"
            className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/80 p-6"
            onClick={() => setPreviewImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Close image preview"
          >
            <img
              src={previewImage}
              alt="Message attachment preview"
              className="max-h-[86vh] max-w-[92vw] rounded-2xl border border-white/10 object-contain shadow-2xl"
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeCall && (
          <motion.div
            className="fixed inset-0 z-[130] flex flex-col items-center justify-center bg-slate-950/95 p-6 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative mb-7 grid place-items-center">
              <span className="absolute h-28 w-28 animate-ping rounded-full bg-teal-500/20" />
              <Avatar chat={activeCall.chat} size="h-20 w-20 text-2xl rounded-2xl" />
            </div>
            <h2 className="text-xl font-bold">{activeCall.chat.name}</h2>
            <p className="mt-2 text-sm font-semibold text-teal-300">
              {activeCall.status === "ringing"
                ? `Ringing ${activeCall.type} call...`
                : `${activeCall.type === "voice" ? "Voice" : "Video"} call connected`}
            </p>
            <button
              type="button"
              onClick={() => setActiveCall(null)}
              className="mt-10 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-950/40 transition hover:bg-rose-600"
              aria-label="End call"
            >
              <FiPhoneOff className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

function Avatar({ chat, size }) {
  if (chat.avatar) {
    return <img src={chat.avatar} alt={chat.name} className={`${size} object-cover shadow-xl`} />;
  }

  return (
    <div className={`${size} grid place-items-center bg-gradient-to-br from-teal-600 to-emerald-500 font-black text-white shadow-xl`}>
      {chat.name.charAt(0)}
    </div>
  );
}

export default Inbox;
